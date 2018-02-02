function refreshPreview(url) {
  if (url) {
    var safeUrl = checkPathSlashes(url);
    var newUrl = Ermintrude.tredegarBaseUrl + safeUrl;
    document.getElementById('iframe').contentWindow.location.href = newUrl;
    $('.browser-location').val(newUrl);
  }
  else {
    document.getElementById('iframe').contentWindow.location.replace("about:blank");
  }
    hideBugHerd(500)

}

