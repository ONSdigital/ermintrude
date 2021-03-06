package com.github.onsdigital.ermintrude.filter;

import com.github.davidcarboni.restolino.framework.Filter;
import com.github.onsdigital.florence.configuration.Configuration;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.*;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;

/**
 * Routes all traffic to Babbage, Unless it is recognised as a ermintrude file being requested.
 */
public class Proxy implements Filter {

    private static final String ermintrudeToken = "/ermintrude";
    private static final String zebedeeToken = "/zebedee";

    private static final String babbageBaseUrl = Configuration.getBabbageUrl();
    private static final String zebedeeBaseUrl = Configuration.getZebedeeUrl();

    private static final List<String> ermintrudePaths = Arrays.asList("");

    @Override
    public boolean filter(HttpServletRequest request, HttpServletResponse response) {

        String requestUri = request.getRequestURI();
        String requestQueryString = request.getQueryString() != null ? request.getQueryString() : "";

        try {
            if (ermintrudePaths.contains(requestUri)
                    || requestUri.startsWith(ermintrudeToken)) {
                return true; // carry on and serve the file
            }

            String requestBaseUrl = babbageBaseUrl; // proxy to babbage by default.

            if (requestUri.startsWith(zebedeeToken)) {
                requestUri = requestUri.replace(zebedeeToken, "");
                requestBaseUrl = zebedeeBaseUrl;
            }

            HttpRequestBase proxyRequest;
            String requestUrl = requestBaseUrl + requestUri + "?" + requestQueryString;
            //System.out.println("Proxy request from " + request.getRequestURI() + " to " + requestUrl);

            switch (request.getMethod()) {
                case "POST":
                    proxyRequest = new HttpPost(requestUrl);
                    ((HttpPost) proxyRequest).setEntity(new BufferedHttpEntity(new InputStreamEntity(request.getInputStream())));
                    break;
                case "PUT":
                    proxyRequest = new HttpPut(requestUrl);
                    ((HttpPut) proxyRequest).setEntity(new BufferedHttpEntity(new InputStreamEntity(request.getInputStream())));
                    break;
                case "DELETE":
                    proxyRequest = new HttpDelete(requestUrl);
                    break;
                default:
                    proxyRequest = new HttpGet(requestUrl);
                    break;
            }

            CloseableHttpClient httpClient = HttpClients.custom().disableRedirectHandling().build();

            // copy the request headers.
            Enumeration<String> headerNames = request.getHeaderNames();
            String accessToken = "";

            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();

                if (StringUtils.equalsIgnoreCase(headerName, "Cookie") ||
                        StringUtils.equalsIgnoreCase(headerName, "Content-Type") ||
                        StringUtils.equalsIgnoreCase(headerName, "X-Florence-Token"))
                    proxyRequest.addHeader(headerName, request.getHeader(headerName));
            }

            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals("access_token"))
                        accessToken = cookie.getValue();
                }
            }

            if (requestBaseUrl == zebedeeBaseUrl && StringUtils.isNotEmpty(accessToken)) {
                proxyRequest.addHeader("X-Florence-Token", accessToken);
            }

            CloseableHttpResponse proxyResponse = httpClient.execute(proxyRequest);

            try {
                HttpEntity responseEntity = proxyResponse.getEntity();

                // copy headers from the response
                for (Header header : proxyResponse.getAllHeaders()) {
                    response.setHeader(header.getName(), header.getValue());
                }

                response.setStatus(proxyResponse.getStatusLine().getStatusCode());

                if (responseEntity != null && responseEntity.getContent() != null)
                    IOUtils.copy(responseEntity.getContent(), response.getOutputStream());

                EntityUtils.consume(responseEntity);

            } catch (IOException e) {
                System.out.println("IOException " + e.getMessage());
                e.printStackTrace();
            } finally {
                proxyResponse.close();
            }

        } catch (IOException e) {
            System.out.println("IOException " + e.getMessage());
            e.printStackTrace();
        }

        return false;
    }
}