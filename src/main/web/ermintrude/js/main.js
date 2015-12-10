var CookieUtils = {
  getCookieValue: function (a, b) {
    b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = CookieUtils;
}




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


var PathUtils = {
  isJsonFile: function (uri) {
    return uri.indexOf('data.json', uri.length - 'data.json'.length) !== -1;
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = PathUtils;
}




setupErmintrude();/**
 * Checks for changes in the iframe path
 * @param onChanged - function
 */
function checkForPageChanged(onChanged) {
  var iframeUrl = Ermintrude.globalVars.pagePath;
  var nowUrl = $('#iframe')[0].contentWindow.document.location.pathname;
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

/**
 * Checks for initial slash and no trailing slash
 * @param uri
 * @returns {*} - valid format
 */
function checkPathSlashes (uri) {
  var checkedUri = uri[uri.length - 1] === '/' ? uri.substring(0, uri.length - 1) : uri;
  checkedUri = checkedUri[0] !== '/' ? '/' + checkedUri : checkedUri;
  return checkedUri;
}

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

  var workSpace = templates.workSpace(Ermintrude.tredegarBaseUrl + safePath);
  $('.section').html(workSpace);

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

  $('#nav--workspace__welsh').on('click', function () {
    Ermintrude.globalVars.welsh = Ermintrude.globalVars.welsh === false ? true : false;
    createWorkspace(Ermintrude.globalVars.pagePath, collectionId, 'browse');
  });

  onFunction(collectionId);
}

function getCollection(collectionId, success, error) {
  return $.ajax({
    url: "/zebedee/collection/" + collectionId,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      success(response);
    },
    error: function (response) {
      error(response);
    }
  });
}

function getCollectionDetails(collectionId, success, error) {
  return $.ajax({
    url: "/zebedee/collectionDetails/" + collectionId,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      success(response);
    },
    error: function (response) {
      error(response);
    }
  });
}
function getPathName() {
  var parsedUrl = document.getElementById('iframe').contentWindow.location.pathname;
  var safeUrl = checkPathSlashes(parsedUrl);
  return safeUrl;
}

function getPathNameTrimLast() {
  var parsedUrl = document.getElementById('iframe').contentWindow.location.pathname;

  if (parsedUrl.charAt(parsedUrl.length-1) === '/') {
    parsedUrl = parsedUrl.slice(0, -1);
  }
  return parsedUrl;
}

/**
 * Generic error handler method for ajax responses.
 * Apply your specific requirements for an error response and then call this method to take care of the rest.
 * @param response
 */
function handleApiError(response) {

  if(!response || response.status === 200)
    return;

  if(response.status === 403 || response.status === 401) {
    logout();
  } else if (response.status === 504) {
    sweetAlert('This task is taking longer than expected', "It will continue to run in the background.", "info");
  } else {
    var message = 'An error has occurred, please contact an administrator.';

    if(response.responseJSON) {
      message = message + ' ' + response.responseJSON.message;
    }

    console.log(message);
    sweetAlert("Error", message, "error");
  }
}
/**
 * Logout the current user and return to the login screen.
 */
function logout() {
  delete_cookie('access_token');
  localStorage.setItem("loggedInAs", "");
  Ermintrude.refreshAdminMenu();
  viewController();
}

function delete_cookie(name) {
  document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}/**
 * Http post to the zebedee API to authenticate a user.
 * @param email - the email of the user to authenticate
 * @param password - the password of the user
 * @returns {boolean}
 */
function postLogin(email, password) {
  $.ajax({
    url: "/zebedee/login",
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    type: 'POST',
    data: JSON.stringify({
      email: email,
      password: password
    }),
    success: function (response) {
      document.cookie = "access_token=" + response + ";path=/";
      localStorage.setItem("loggedInAs", email);
      Ermintrude.refreshAdminMenu();
      viewController();
    },
    error: function (response) {
      if (response.status === 417) {
        viewChangePassword(email, true);
      } else {
        handleApiError(response);
      }
    }
  });
  return true;
}
/**
 * HTTP post to the zebedee API to set a new password
 * @param success - function to run on success
 * @param error - function to run on error
 * @param email - the email address of the user to change the password for
 * @param password - the password to set
 * @param oldPassword - the current password of the user if they are not already authenticated
 */
function postPassword(success, error, email, password, oldPassword) {
  $.ajax({
    url: "/zebedee/password",
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({
      password: password,
      email: email,
      oldPassword: oldPassword
    }),
    success: function () {
      if(success) {
        success();
      }
    },
    error: function (response) {
      if(error) {
        error(response);
      } else {
        handleApiError(response);
      }
    }
  });
}/**
 * Post to the zebedee API permission endpoint.
 * Set permissions for the given email address.
 * @param success
 * @param error
 * @param email - The email of the user to set permissions for
 * @param admin - boolean true if the user should be given admin permissions
 * @param editor - boolean true if the user should be given editor permissions
 */
function postPermission(success, error, email, admin, editor) {
  $.ajax({
    url: "/zebedee/permission",
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({
      email: email,
      admin: admin,
      editor: editor
    }),
    success: function () {
      if(success) {
        success();
      }
    },
    error: function (response) {
      if(error) {
        error(response);
      } else {
        if (response.status === 403 || response.status === 401) {
          sweetAlert("You are not permitted to update permissions.")
        } else {
          handleApiError(response);
        }
      }
    }
  });
}function refreshPreview(url) {

  if (url) {
    var safeUrl = checkPathSlashes(url);
    var newUrl = Ermintrude.tredegarBaseUrl + safeUrl;
    document.getElementById('iframe').contentWindow.location.href = newUrl;
    $('.browser-location').val(newUrl);
  }
  else {
    var urlStored = Ermintrude.globalVars.pagePath;
    var safeUrl = checkPathSlashes(urlStored);
    var newUrl = Ermintrude.tredegarBaseUrl + safeUrl;
    document.getElementById('iframe').contentWindow.location.href = newUrl;
    $('.browser-location').val(newUrl);
  }
}

function setupErmintrude() {
  window.templates = Handlebars.templates;
  Handlebars.registerHelper('select', function( value, options ){
    var $el = $('<select />').html( options.fn(this) );
    $el.find('[value="' + value + '"]').attr({'selected':'selected'});
    return $el.html();
  });
  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  //Check if array contains element
  Handlebars.registerHelper('ifContains', function(elem, list, options) {
    if(list.indexOf(elem) > -1) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  // Add two values together. Primary usage was '@index + 1' to create numbered lists
  Handlebars.registerHelper('plus', function(value1, value2) {
    return value1 + value2;
  });
  // Add two values together. Primary usage was '@index + 1' to create numbered lists

  Ermintrude.globalVars.activeTab = false;

  // load main ermintrude template
  var ermintrude = templates.ermintrude;

  $('body').append(ermintrude);
  Ermintrude.refreshAdminMenu();

  var adminMenu = $('.admin-nav');
  // dirty checks on admin menu
  adminMenu.on('click', '.nav--admin__item', function () {
    if (Ermintrude.Editor.isDirty) {
      swal ({
        title: "Warning",
        text: "If you do not come back to this page, you will lose any unsaved changes",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel"
      }, function(result){
        if (result === true) {
          Ermintrude.Editor.isDirty = false;
          processMenuClick(this);
          return true;
        } else {
          return false;
        }
      });
    } else {
      processMenuClick(this);
    }
  });


  window.onbeforeunload = function () {
    if (Ermintrude.Editor.isDirty) {
      return 'You have unsaved changes.';
    }
  };
  viewController();


  function processMenuClick(clicked) {
    Ermintrude.collection = {};

    $('.nav--admin__item--collection').hide();
    $('.nav--admin__item').removeClass('selected');
    var menuItem = $(clicked);

    menuItem.addClass('selected');


    if (menuItem.hasClass("nav--admin__item--collections")) {
      viewController('collections');
    } else if (menuItem.hasClass("nav--admin__item--collection")) {
      var thisCollection = CookieUtils.getCookieValue("collection");
      viewCollections(thisCollection);
      $(".nav--admin__item--collections").addClass('selected');
    } else if (menuItem.hasClass("nav--admin__item--login")) {
      viewController('login');
    } else if (menuItem.hasClass("nav--admin__item--logout")) {
      logout();
      viewController();
    }
  }
}

/**
 * Show the change password screen to change the password for the given email.
 * @param email - The email address of the user to change the password for.
 * @param authenticate - true if the existing password for the user needs to be entered.
 */
function viewChangePassword(email, authenticate) {

  var viewModel = {
    authenticate: authenticate
  };
  
  $('body').append(templates.changePassword(viewModel));

  $('#update-password').on('click', function () {
    var oldPassword = $('#password-old').val();
    var newPassword = $('#password-new').val();
    var confirmPassword = $('#password-confirm').val();

    if(newPassword !== confirmPassword) {
      sweetAlert('The passphrases provided do not match', 'Please enter the new passphrase again and confirm it.');
    } else if(!newPassword.match(/.+\s.+\s.+\s.+/)) {
      sweetAlert('The passphrase does not have four words', 'Please enter a new passphrase and confirm it.');
    } else if(newPassword.length < 15) {
      sweetAlert('The passphrase is too short', 'Please make sure it has at least 15 characters (including spaces).');
    } else {
      submitNewPassword(newPassword, oldPassword);
    }
  });

  $('#update-password-cancel').on('click', function () {
    $('.change-password-overlay').stop().fadeOut(200).remove();
  });

  function submitNewPassword(newPassword, oldPassword) {
    postPassword(
      success = function () {
        console.log('Password updated');
        sweetAlert("Password updated", "", "success");
        $('.change-password-overlay').stop().fadeOut(200).remove();

        if(authenticate) {
          postLogin(email, newPassword);
        }
      },
      error = function (response) {
        if (response.status === 403 || response.status === 401) {
          if (authenticate) {
            sweetAlert('The password you entered is incorrect. Please try again');
          } else {
            sweetAlert('You are not authorised to change the password for this user');
          }
        }
      },
      email,
      newPassword,
      oldPassword);
  }
}

function viewCollectionDetails(collectionId) {

  getCollectionDetails(collectionId,
    success = function (response) {
      populateCollectionDetails(response);
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  function populateCollectionDetails(collection) {

    Ermintrude.setActiveCollection(collection);

    if (!collection.publishDate) {
      collection.date = '[manual collection]';
    } else if (collection.publishDate && collection.type === 'manual') {
      collection.date = '[manual collection] Originally scheduled for ' + StringUtils.formatIsoFull(collection.publishDate);
    } else {
      collection.date = StringUtils.formatIsoFull(collection.publishDate);
    }

    ProcessPages(collection.inProgress);
    ProcessPages(collection.complete);
    ProcessPages(collection.reviewed);

    var collectionHtml = window.templates.collectionDetails(collection);
    $('.workspace-menu').html(collectionHtml);

    //page-list
    $('.page-item').click(function () {
      $('.page-list li').removeClass('selected');
      $('.page-options').hide();
      var path = $(this).parent('li').attr('data-path');
      $(this).parent('li').addClass('selected');
      $(this).next('.page-options').show();
      refreshPreview(path);
    });
  }

  function ProcessPages(pages) {
    _.sortBy(pages, 'uri');
    _.each(pages, function (page) {
      page.uri = page.uri.replace('/data.json', '');
      return page;
    });
  }
}function viewCollections(collectionId) {

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    success: function (data) {
      populateCollectionTable(data);
    },
    error: function (jqxhr) {
      handleApiError(jqxhr);
    }
  });

  var response = [];

  function populateCollectionTable(data) {
    $.each(data, function (i, collection) {
      if (!collection.approvedStatus) {
        if (!collection.publishDate) {
          date = '[manual collection]';
          response.push({id: collection.id, name: collection.name, date: date});
        } else if (collection.publishDate && collection.type === 'manual') {
          var formattedDate = StringUtils.formatIsoDateString(collection.publishDate) + ' [rolled back]';
          response.push({id: collection.id, name: collection.name, date: formattedDate});
        } else {
          var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
          response.push({id: collection.id, name: collection.name, date: formattedDate});
        }
      }
    });

    var collectionsHtml = templates.collectionList(response);
    $('.section').html(collectionsHtml);

    if (collectionId) {
      $('.collections-select-table tr[data-id="' + collectionId + '"]')
        .addClass('selected');
    }
    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      Ermintrude.collection.id = $(this).attr('data-id');
      Ermintrude.collection.name = $(this).attr('data-name');
      createWorkspace(Ermintrude.globalVars.pagePath, Ermintrude.collection.id, viewCollectionDetails);
    });
  }
}function viewController(view) {

	if (Ermintrude.Authentication.isAuthenticated()) {

		if (view === 'collections') {
			viewCollections();
		}
		else if (view === 'users') {
			viewUsers('create');
		}
		else if (view === 'login') {
			viewLogIn();
		}
		else if (view === 'publish') {
			viewPublish();
		}
		else if (view === 'reports') {
			viewReports();
		}
		else {
			viewController('collections');
		}
	}
  else {
		viewLogIn();
  	}

  	// setTimeout(uiTidyUp, 300);
}

function viewLogIn() {

  var login_form = templates.login;
  $('.section').html(login_form);

  $('.form-login').submit(function (e) {
    e.preventDefault();
    var email = $('.fl-user-and-access__email').val();
    var password = $('.fl-user-and-access__password').val();
    postLogin(email, password);
  });
}

