/**
 * @param {string} collectionID - Unique ID of the collection that is being previewed
 * @param {string} url - URL of the page that the caller wants the JSON data for
 * @returns {Promise} - Which resolves to the page JSON data or rejects with an error
 */

function getPage(collectionID, url) {
    var fetchURL = '/zebedee/data/' + collectionID + '?uri=' + url;
    var fetchOptions = {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };
    return new Promise((resolve, reject) => {
        fetch(fetchURL, fetchOptions).then(response => {
            if (response.ok) {
                return response.json();
            }
            reject(response);
        }).then(response => {
            resolve(response);
        })
    });
}var CookieUtils = {
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
        var formattedDate = formatIsoDateString(collection.publishDate);
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
        checkDocuments(safeUrl);
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




setupErmintrude();function checkDocuments(url){

  var urlPart = url.replace(Ermintrude.tredegarBaseUrl, '');
  var selectedListItem = $('[data-path="' + urlPart + '"]'); //get first li with data-url with url
  $('.page-list li').removeClass('selected');

  $(selectedListItem).addClass('selected');
  console.log(urlPart);
}

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

function disablePreview(text) {
    var $browser = $('.browser');

    if ($browser.hasClass("browser--disabled")) {
        return;
    }

    if (!text) {
        text = "No page available to preview"
    }

    $browser.addClass("browser--disabled");
    $browser.append("<div class='browser--disabled__child'>" + text + "</div>");
}

function enablePreview() {
    var $browser = $('.browser');

    if (!$browser.hasClass("browser--disabled")) {
        return;
    }

    $browser.removeClass("browser--disabled");
    $(".browser--disabled__child").remove();
}function getCollection(collectionId, success, error) {
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

function getPageData(collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + safePath,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      if (success)
        success(response);
    },
    error: function (response) {
      if (error) {
        error(response);
      } else {
        handleApiError(response);
      }
    }
  });
}

function getDatasetLatestVersion(datasetID, success, error) {
  return $.ajax({
    url: "dataset/datasets/" + datasetID,
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      if (success)
        success(response);
    },
    error: function (response) {
      if (error) {
        error(response);
      } else {
        handleApiError(response);
      }
    }
  });
}function getPathName() {
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

    if (!response || response.status === 200)
        return;

    if (response.status === 403 || response.status === 401) {
        sweetAlert('You are not logged in', 'Please refresh Florence and log back in.');
        logout();
    } else if (response.status === 504) {
        sweetAlert('This task is taking longer than expected', "It will continue to run in the background.", "info");
    } else {
        var message = 'An error has occurred, please contact an administrator.';

        if (response.responseJSON) {
            message = response.responseJSON.message;
        }

        console.log(message);
        sweetAlert("Error", message, "error");
    }
}

/* Unique error handling for the login screen */
function handleLoginApiError(response) {

    if (!response || response.status === 200)
        return;

    if (response.status === 401) {
        sweetAlert('Incorrect login details', 'These login credentials were not recognised. Please try again.', 'error');
    } else {
        var message = 'An error has occurred, please contact an administrator.';

        if (response.responseJSON) {
            message = response.responseJSON.message;
        }

        console.log(message);
        sweetAlert("Error", message, "error");
    }
}

/*
 * Remove the BugHerd feedback button
 * @params timeout
 */

function hideBugHerd(timeout) {

    function ifIframeLoaded() {
        $('#iframe').ready(function () {
            console.log('iframe contents loaded');
            hideTheButton();
        });
    }

    function hideTheButton() {
        var $button = $('#iframe').contents().find('#bugherd-feedback');
        if ($button.length) {
            console.log('b length: ' + $button.length);
            $button.remove();
            return false;
        }
        setTimeout(hideTheButton, 10);
    }
    setTimeout(ifIframeLoaded, timeout);
}

/**
 * Logout the current user and return to the login screen.
 */
function logout() {
  delete_cookie('access_token');
  delete_cookie('collection');
  localStorage.setItem("loggedInAs", "");
  Ermintrude.refreshAdminMenu();
  viewController();
}

function delete_cookie(name) {
  document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
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
                handleLoginApiError(response);
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
}

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
      $('.collection-selected').animate({right: "-100%"}, 1000);
      setTimeout(function () {viewController('collections')}, 1100);
      $('.select-wrap').remove();
      Ermintrude.globalVars.pagePath = '';
    } else if (menuItem.hasClass("nav--admin__item--collection")) {
      var thisCollection = CookieUtils.getCookieValue("collection");
      $('.collection-selected').animate({right: "-100%"}, 1000);
      setTimeout(function () {viewCollections(thisCollection)}, 1100);
      $('.select-wrap').remove();
      $(".nav--admin__item--collections").addClass('selected');
    } else if (menuItem.hasClass("nav--admin__item--login")) {
      viewController('login');
    } else if (menuItem.hasClass("nav--admin__item--logout")) {
      $('.select-wrap').remove();
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
    var resultToSort = [];

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
            collection.date = '[manual collection] Originally scheduled for ' + formatIsoFull(collection.publishDate);
        } else {
            collection.date = formatIsoFull(collection.publishDate);
        }

        ProcessPages(collection.inProgress, collection.id);
        ProcessPages(collection.complete, collection.id);
        ProcessPages(collection.reviewed, collection.id);
        ProcessPages(collection.datasets, collection.id);
        ProcessPages(collection.datasetVersions, collection.id);
        
        //page-list
        //$('.page-item').click(function () {
        //  $('.page-list li').removeClass('selected');
        //  $('.page-options').hide();
        //  var path = $(this).parent('li').attr('data-path');
        //  $(this).parent('li').addClass('selected');
        //  $(this).next('.page-options').show();
        //  refreshPreview(path);
        //});

    }

    function renderList(collectionID){
        var sorted = _.sortBy(resultToSort, 'name');
        var collectionHtml = window.templates.mainNavSelect(sorted);
        $('#mainNavSelect').html(collectionHtml);

        $('select#docs-list').change(function () {
            var $selectedOption = $('#docs-list option:selected')
            var path = $selectedOption.val();
            var lang = $selectedOption.attr('data-lang');
            var type = $selectedOption.attr('data-type');

            if (lang) {
                document.cookie = "lang=" + lang + ";path=/";
            }

            if (type !== "visualisation") {
                $('#vis-files__form').remove();
                enablePreview();
                refreshPreview(path);
                return;
            }

            getPage(collectionID, path).then(response => {
                var templateData = [];
                var files = response.filenames;
                for (var i = 0; i < files.length; i++) {
                    templateData.push({
                        uri: response.uri + "/" + files[i],
                        name: files[i]
                    });
                }
                var visSelectTemplate = templates.visualisationFileSelect(templateData);
                $('.nav-left').append(visSelectTemplate);
                refreshPreview();
                disablePreview("No visualisation page selected to preview");
                bindVisFilesChange();
            }).catch(error => {
                switch(error.status) {
                    case(401): {
                        logout();
                        sweetAlert("Session has expired", "Please login again", "info");
                        console.warn("User is not logged in, redirecting to login screen");
                        break
                    }
                    default: {
                        console.error("An unexpected error has occured\n", error.statusText);
                        break;
                    }
                }
            });

        });

    }

    function ProcessPages(pages, collectionID) {
        _.each(pages, function (page) {
            // If dataset metadata or dataset version
            if(page.id) {
                var latestVersion = '';
                if(!page.version) {
                    page.name = page.title + " (Dataset metadata)";
                    getDatasetLatestVersion(page.id,
                        success = function (response) {
                            // If current exists, get the latest version
                            if (response.current) {
                                latestVersion = response.current.links.latest_version.href;
                            } else {
                                // Check that next has a latest version
                                if (response.next.links.latest_version >= 0) {
                                    latestVersion = response.next.links.latest_version.href;
                                } else {
                                // If there is no latest version available return the dataset edition uri
                                    latestVersion = "/datasets/" + response.id;
                                }   
                            }
                            var versionPathname = latestVersion.replace(/^.*\/\/[^\/]+/, '');
                            page.uri = versionPathname; 
                            resultToSort.push(page);   
                            renderList(collectionID);                 
           
                        },
                        error = function (response) {
                            handleApiError(response);
                        }
                    );

                } else {
                    // If this is a version, return the uri from the value
                    page.name = page.title + " (Dataset version)";
                    var versionPathname = page.uri.replace(/^.*\/\/[^\/]+/, '');
                    page.uri = versionPathname; 
                    resultToSort.push(page);   
                    renderList(collectionID);                 
                }
            } 
            // If dataset landing page
            if (page.type === "api_dataset_landing_page") {
                getPageData(collectionId, page.uri,
                    success = function (response) {
                        var datasetID = response.apiDatasetId;
                        page.uri = '/datasets/' + datasetID;
                        page.name = page.description.title ? page.description.title + " (Filterable dataset landing page)" : page.description.edition + " (Filterable dataset landing page)";
                        resultToSort.push(page);   
                        renderList(collectionID);                 
                    },
                    error = function (response) {
                        handleApiError(response);
                    }
                );
            } 
            // Any other type of page
            if (page.type != "api_dataset_landing_page" && !page.id) {
                page.uri = page.uri.replace('/data.json', '');
                page.name = page.description.title ? page.description.title : page.description.edition;
                resultToSort.push(page); 
                renderList(collectionID);                 
            }

        });
    }
}

function formatIsoFull(input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date) + ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
}

function bindVisFilesChange() {
    $('#vis-files__form').off().on('change', function() {
        var url = $(this).find(":selected").val();
        
        if (!url) {
            refreshPreview();
            disablePreview("No visualisation page selected to preview");
            return;
        }

        enablePreview();
        refreshPreview(url);
    });
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
      if (!collection.publishDate) {
        date = '[manual collection]';
        response.push({id: collection.id, name: collection.name, date: date});
      } else if (collection.publishDate && collection.type === 'manual') {
        var formattedDate = formatIsoDateString(collection.publishDate) + ' [rolled back]';
        response.push({id: collection.id, name: collection.name, date: formattedDate});
      } else {
        var formattedDate = formatIsoDateString(collection.publishDate);
        response.push({id: collection.id, name: collection.name, date: formattedDate});
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
      $('.collection-selected').animate({right: "0%"}, 1000);
        hideBugHerd(1000);
    });
  }
}

function formatIsoDateString(input) {
  var date = new Date(input);
  var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  var formattedDate = $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes;
  return formattedDate;
}
function viewController(view) {

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

