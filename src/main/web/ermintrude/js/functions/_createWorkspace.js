/**
 * Handles the initial creation of the workspace screen.
 * @param path - path to iframe
 * @param collectionId
 * @param menu - opens a specific menu
 * @param stopEventListener - separates the link between editor and iframe
 * @returns {boolean}
 */

function createWorkspace(path, collectionId, onFunction) {
  var safePath = '';
  $("#working-on").on('click', function () {
  }); // add event listener to mainNav

  var currentPath = '';
  if (path) {
    currentPath = path;
    safePath = checkPathSlashes(currentPath);
  }

  Ermintrude.globalVars.pagePath = safePath;
  if (Ermintrude.globalVars.welsh !== true) {
    document.cookie = "lang=" + "en;path=/";
  } else {
    document.cookie = "lang=" + "cy;path=/";
  }
  Ermintrude.refreshAdminMenu();

  var iframeLink = Ermintrude.tredegarBaseUrl + safePath;
  document.getElementById('iframe').contentWindow.location.href = iframeLink;

  document.getElementById('iframe').onload = function () {
    $('.browser-location').val(Ermintrude.tredegarBaseUrl + Ermintrude.globalVars.pagePath);
    var iframeEvent = document.getElementById('iframe').contentWindow;
    iframeEvent.addEventListener('click', Ermintrude.Handler, true);
  };

  if (Ermintrude.globalVars.welsh !== true) {
    $('#nav--workspace__welsh').empty().append('<a href="#">Language: English</a>');
  } else {
    $('#nav--workspace__welsh').empty().append('<a href="#">Language: Welsh</a>');
  }

  $('#nav--workspace__welsh').one('click', function () {
    Ermintrude.globalVars.welsh = Ermintrude.globalVars.welsh === false ? true : false;
    createWorkspace(Ermintrude.globalVars.pagePath, collectionId, viewCollectionDetails);
  });

  onFunction(collectionId);
}

