// The florence object is used for storing application state.
var Ermintrude = Ermintrude || {
    tredegarBaseUrl: window.location.origin,
    refreshAdminMenu: function () {
      var mainNavHtml = templates.mainNav(Ermintrude);
      $('.admin-nav').html(mainNavHtml);
    },
    setActiveCollection: function (collection) {
      document.cookie = "collection=" + collection.id + ";path=/";
      if (!collection.publishDate) {
        var formattedDate = null;
      } else {
        var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
      }
      Ermintrude.collection = {id: collection.id, name: collection.name, date: formattedDate, type: collection.type};
    }
  };

Ermintrude.Editor = {
  isDirty: false,
  data: {}
};

Ermintrude.CreateCollection = {
  selectedRelease:""
};

Ermintrude.collection = {};

Ermintrude.collectionToPublish = {};

Ermintrude.globalVars = {pagePath: '', activeTab: false, pagePos: '', welsh: false};

Ermintrude.Authentication = {
  accessToken: function () {
    return CookieUtils.getCookieValue("access_token");
  },
  isAuthenticated: function () {
    return Ermintrude.Authentication.accessToken() !== '';
  },
  loggedInEmail: function () {
    return localStorage.getItem("loggedInAs")
  }
};

Ermintrude.Handler = function (e) {
  if (Ermintrude.Editor.isDirty) {
    var result = confirm("You have unsaved changes. Are you sure you want to continue");
    if (result === true) {
      Ermintrude.Editor.isDirty = false;
      processPreviewClick(this);
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  } else {
    processPreviewClick(this);
  }

  function processPreviewClick() {
    setTimeout(function () {
      checkForPageChanged(function (newUrl) {
        var safeUrl = checkPathSlashes(newUrl);
        Ermintrude.globalVars.pagePath = safeUrl;
        if ($('.workspace-edit').length) {
          loadPageDataIntoEditor(safeUrl, Ermintrude.collection.id, 'click');
        }
        else if ($('.workspace-browse').length) {
          treeNodeSelect(safeUrl);
        }
      });
    }, 200);
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = Ermintrude;
}


