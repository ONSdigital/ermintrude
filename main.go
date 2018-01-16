package main

import (
	"context"
	"mime"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"time"

	"github.com/ONSdigital/ermintrude/assets"
	"github.com/ONSdigital/ermintrude/healthcheck"
	"github.com/ONSdigital/go-ns/handlers/reverseProxy"
	hc "github.com/ONSdigital/go-ns/healthcheck"
	"github.com/ONSdigital/go-ns/log"
	"github.com/ONSdigital/go-ns/server"
	"github.com/gorilla/pat"
)

var bindAddr = ":8086"
var routerURL = "http://localhost:20000"
var zebedeeURL = "http://localhost:8082"
var datasetAPIURL = "http://localhost:22000"
var datasetAuthToken = "FD0108EA-825D-411C-9B1D-41EF7727F465"
var getAsset = assets.Asset

// Version is set by the make target
var Version string

func main() {
	log.Debug("ermintrude version", log.Data{"version": Version})

	if v := os.Getenv("BIND_ADDR"); len(v) > 0 {
		bindAddr = v
	}
	if v := os.Getenv("ROUTER_URL"); len(v) > 0 {
		routerURL = v
	}
	if v := os.Getenv("ZEBEDEE_URL"); len(v) > 0 {
		zebedeeURL = v
	}
	if v := os.Getenv("DATASET_API_URL"); len(v) > 0 {
		datasetAPIURL = v
	}
	if v := os.Getenv("DATASET_AUTH_TOKEN"); len(v) > 0 {
		datasetAuthToken = v
	}

	log.Namespace = "ermintrude"

	zc := healthcheck.New(zebedeeURL, "zebedee")
	bc := healthcheck.New(routerURL, "router")
	dc := healthcheck.New(datasetAPIURL, "dataset-api")

	routerURL, err := url.Parse(routerURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	routerProxy := reverseProxy.Create(routerURL, nil)

	zebedeeURL, err := url.Parse(zebedeeURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	zebedeeProxy := reverseProxy.Create(zebedeeURL, zebedeeDirector)

	datasetAPIURL, err := url.Parse(datasetAPIURL)
	if err != nil {
		log.Error(err, nil)
		os.Exit(1)
	}
	datasetAPIProxy := reverseProxy.Create(datasetAPIURL, datasetAPIDirector)

	router := pat.New()

	newAppHandler := refactoredIndexFile

	router.Path("/healthcheck").HandlerFunc(hc.Do)

	router.Handle("/zebedee{uri:/.*}", zebedeeProxy)
	router.Handle("/dataset/{uri:.*}", datasetAPIProxy)
	router.HandleFunc("/ermintrude/dist/{uri:.*}", staticFiles)
	router.HandleFunc("/ermintrude", legacyIndexFile)
	router.HandleFunc("/ermintrude/", redirectToFlorence)
	router.HandleFunc("/ermintrude/index.html", redirectToFlorence)
	router.HandleFunc("/ermintrude/collections", legacyIndexFile)
	router.HandleFunc("/ermintrude{uri:/.*}", newAppHandler)
	router.Handle("/{uri:.*}", routerProxy)

	log.Debug("Starting server", log.Data{
		"bind_addr":       bindAddr,
		"router_url":      routerURL,
		"zebedee_url":     zebedeeURL,
		"dataset_api_url": datasetAPIURL,
	})

	s := server.New(bindAddr, router)
	// TODO need to reconsider default go-ns server timeouts
	s.Server.IdleTimeout = 120 * time.Second
	s.Server.WriteTimeout = 120 * time.Second
	s.Server.ReadTimeout = 30 * time.Second
	s.HandleOSSignals = false
	s.MiddlewareOrder = []string{"RequestID", "Log"}

	// FIXME temporary hack to remove timeout middleware (doesn't support hijacker interface)
	mo := s.MiddlewareOrder
	var newMo []string
	for _, mw := range mo {
		if mw != "Timeout" {
			newMo = append(newMo, mw)
		}
	}
	s.MiddlewareOrder = newMo

	go func() {
		if err := s.ListenAndServe(); err != nil {
			log.Error(err, nil)
			os.Exit(2)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, os.Kill)

	for {
		hc.MonitorExternal(bc, zc, dc)

		timer := time.NewTimer(time.Second * 60)

		select {
		case <-timer.C:
			continue
		case <-stop:
			log.Info("shutting service down gracefully", nil)
			timer.Stop()
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()
			if err := s.Server.Shutdown(ctx); err != nil {
				log.Error(err, nil)
			}
			return
		}
	}
}

func redirectToFlorence(w http.ResponseWriter, req *http.Request) {
	http.Redirect(w, req, "/ermintrude", 301)
}

func staticFiles(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get(":uri")

	b, err := getAsset("../dist/" + path)
	if err != nil {
		log.Error(err, nil)
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`Content-Type`, mime.TypeByExtension(filepath.Ext(path)))
	w.WriteHeader(200)
	w.Write(b)
}

func legacyIndexFile(w http.ResponseWriter, req *http.Request) {
	log.Debug("Getting legacy HTML file", nil)

	b, err := getAsset("../dist/legacy-assets/index.html")
	if err != nil {
		log.Error(err, nil)
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`Content-Type`, "text/html")
	w.WriteHeader(200)
	w.Write(b)
}

func refactoredIndexFile(w http.ResponseWriter, req *http.Request) {
	log.Debug("Getting refactored HTML file", nil)

	b, err := getAsset("../dist/refactored.html")
	if err != nil {
		log.Error(err, nil)
		w.WriteHeader(404)
		return
	}

	w.Header().Set(`Content-Type`, "text/html")
	w.WriteHeader(200)
	w.Write(b)
}

func zebedeeDirector(req *http.Request) {
	if c, err := req.Cookie(`access_token`); err == nil && len(c.Value) > 0 {
		req.Header.Set(`X-Florence-Token`, c.Value)
	}
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/zebedee")
}

func importAPIDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/import")
}

func datasetAPIDirector(req *http.Request) {
	req.URL.Path = strings.TrimPrefix(req.URL.Path, "/dataset")
	req.Header.Set("Internal-token", datasetAuthToken)
}
