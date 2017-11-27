/**
 * Checks for changes in the iframe path
 * @param onChanged - function
 */
function checkForPageChanged(onChanged) {
  var iframeUrl = Ermintrude.globalVars.pagePath;
  var nowUrl = $('#iframe')[0].contentWindow.document.location.pathname;
  hideBugHerd(300);
  if (iframeUrl !== nowUrl) {
    Ermintrude.globalVars.activeTab = false;
    Ermintrude.globalVars.pagePos = '';
    if (!onChanged) {
      Ermintrude.globalVars.pagePath = nowUrl;
    } else {
      Ermintrude.globalVars.pagePath = nowUrl;
      onChanged(nowUrl);
    }
  }
}

