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




var StringUtils = {
  textareaLines: function (line, maxLineLength, start, numberOfLinesCovered) {

    if (start + maxLineLength >= line.length) {
      //console.log('Line Length = ' + numberOfLinesCovered);
      return numberOfLinesCovered;
    }

    var substring = line.substr(start, maxLineLength + 1);
    var actualLineLength = substring.lastIndexOf(' ') + 1;

    if (actualLineLength === maxLineLength) // edge case - the break is at the end of the line exactly with a space after it
    {
      actualLineLength--;
    }

    if (start + actualLineLength === line.length) {
      return numberOfLinesCovered;
    }

    if (actualLineLength === 0) {
      actualLineLength = maxLineLength;
    }

    //if(numberOfLinesCovered < 30) {
    //  console.log('Line: ' + numberOfLinesCovered + ' length = ' + actualLineLength);
    //}
    return StringUtils.textareaLines(line, maxLineLength, start + actualLineLength, numberOfLinesCovered + 1);
  },

  formatIsoDateString: function (input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
  },

  formatIsoFullDateString: function (input) {
    var date = new Date(input);
//    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date);        //+ ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
  },

  formatIsoFull: function (input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date) + ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
  },

  formatIsoFullSec: function (input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date) + ' ' + date.getHours() + ':' + minutes + ':' + seconds;
    return formattedDate;
  },

  randomId: function () {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4());
  }

};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = StringUtils;
}

/**
 * Load the release selector screen and populate the list of available releases.
 */
function viewReleaseSelector() {

  var html = templates.releaseSelector();
  $('body').append(html);

  var releases = [];
  PopulateReleasesForUri("/releasecalendar/data?view=upcoming", releases);

  $('.btn-release-selector-cancel').on('click', function () {
    $('.release-select').stop().fadeOut(200).remove();
  });

  $('#release-search-input').on('input', function () {
    var searchText = $(this).val();
    populateReleasesList(releases, searchText)
  });

  function PopulateReleasesForUri(baseReleaseUri, releases) {
    //console.log("populating release for uri " + baseReleaseUri);
    $.ajax({
        url: baseReleaseUri,
        type: "get",
        success: function (data) {
          populateRemainingReleasePages(data, releases, baseReleaseUri);
        },
        error: function (response) {
          handleApiError(response);
        }
      }
    );
  }

  /**
   * Take the data from the response of getting the first release page and
   * determine if there are any more pages to get.
   * @param data
   */
  function populateRemainingReleasePages(data, releases, baseReleaseUri) {
    var pageSize = 10;
    _(data.result.results).each(function (release) {
      releases.push(release);
    });

    // if there are more results than the existing page size, go get them.
    if (data.result.numberOfResults > pageSize) {

      var pagesToGet = Math.ceil((data.result.numberOfResults - pageSize) / pageSize);
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

      for (var i = 2; i < pagesToGet + 2; i++) {
        var dfd = getReleasesPage(baseReleaseUri, i, releases);
        pageDataRequests.push(dfd);
      }

      $.when.apply($, pageDataRequests).then(function () {
        populateReleasesList(releases);
      });
    } else {
      populateReleasesList(releases);
    }
  }

  /**
   * Get the release page for the given index and add the response to the given releases array.
   * @param i
   * @param releases
   * @returns {*}
   */
  function getReleasesPage(baseReleaseUri, i, releases) {
    //console.log("getting page  " + i + " for " + baseReleaseUri);
    var dfd = $.Deferred();
    $.ajax({
      url: baseReleaseUri + '&page=' + i,
      type: "get",
      success: function (data) {
        _(data.result.results).each(function (release) {
          releases.push(release);
        });
        dfd.resolve();
      },
      error: function (response) {
        handleApiError(response);
        dfd.resolve();
      }
    });
    return dfd;
  }

  /**
   * Populate the releases list from the given array of releases.
   * @param releases
   */
  function populateReleasesList(releases, filter) {
    var releaseList = $('#release-list');
    releaseList.find('tr').remove(); // remove existing table entries

    _(_.sortBy(releases, function (release) {
      return release.description.releaseDate
    }))
      .each(function (release) {
        if (!filter || (release.description.title.toUpperCase().indexOf(filter.toUpperCase()) > -1)) {
          var date = StringUtils.formatIsoFullDateString(release.description.releaseDate);
          releaseList.append('<tr data-id="' + release.description.title + '" data-uri="' + release.uri + '"><td>' + release.description.title + '</td><td>' + date + '</td></tr>');
        }
      });

    releaseList.find('tr').on('click', function () {
      var releaseTitle = $(this).attr('data-id');
      var releaseUri = $(this).attr('data-uri');
      Ermintrude.CreateCollection.selectedRelease = {uri: releaseUri, title: releaseTitle};

      $('.selected-release').text(releaseTitle);
      $('.release-select').stop().fadeOut(200).remove();
    })
  }
}setupErmintrude();/**
 * Keeps the accordion open in the tab specified
 * @param active - the active tab
 */

function accordion(active) {
  var activeTab = parseInt(active);
  if(!activeTab){
    activeTab = 'none';
  }
  $(function () {
    $(".edit-accordion").accordion(
      {
        header: "div.edit-section__head",
        heightStyle: "content",
        active: activeTab,
        collapsible: true
      }
    );
  });
}
$('.section').bind('DOMSubtreeModified', function (){
	$('.auto-size').textareaAutoSize();
});

/**
 * Saves data. Used to save metadata in a timeout
 * @param collectionId
 * @param data
 */
function autoSaveMetadata(collectionId, data) {
  putContent(collectionId, data.uri, JSON.stringify(data),
    success = function () {
      Ermintrude.Editor.isDirty = false;
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

/**
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
 * Checks a valid link
 * @param uri
 * @returns {*} - if valid returns a formatted valid link
 */

function checkPathParsed (uri) {
  if (uri.match(/^(https?|ftp):\/\/(([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+(:([a-z0-9$_\.\+!\*\'\(\),;\?&=-]|%[0-9a-f]{2})+)?@)?((([a-z0-9]\.|[a-z0-9][a-z0-9-]*[a-z0-9]\.)*[a-z][a-z0-9-]*[a-z0-9]|((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5]))(:\d+)?)(((\/+([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)*(\?([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?)?)?(#([a-z0-9$_\.\+!\*\'\(\),;:@&=-]|%[0-9a-f]{2})*)?/i)) {
    var myUrl = parseURL(uri);
    var safeUrl = myUrl.pathname;
    if (safeUrl.charAt(safeUrl.length-1) === '/') {
      safeUrl = safeUrl.slice(0, -1);
    }
  return safeUrl;
  } else {
    sweetAlert('This is not a valid link');
    return false;
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

function checkRenameUri(collectionId, data, renameUri, onSave) {
  if (renameUri) {
    swal({
      title: "Warning",
      text: "You have changed the title or edition and this could change the uri. Are you sure you want to proceed?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Change url",
      cancelButtonText: "Cancel",
      closeOnConfirm: true
    }, function (result) {
      if (result === true) {
        // Does it have edition?
        if (data.description.edition) {
          //Special case dataset editions. They have edition but not title
          if (data.description.title) {
            var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          }
          var editionNoSpace = data.description.edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          if (data.type === 'dataset') {
            tmpNewUri.splice([tmpNewUri.length - 1], 1, editionNoSpace);
          } else {
            tmpNewUri.splice([tmpNewUri.length - 2], 2, titleNoSpace, editionNoSpace);
          }
          var newUri = tmpNewUri.join("/");
          //is it a compendium? Rename children array
          if (data.type === 'compendium_landing_page') {
            if (data.chapters) {
              data.chapters = renameCompendiumChildren(data.chapters, titleNoSpace, editionNoSpace);
            }
            if (data.datasets) {
              data.datasets = renameCompendiumChildren(data.datasets, titleNoSpace, editionNoSpace);
            }
          }
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              Ermintrude.globalVars.pagePath = newUri;
              onSave(collectionId, newUri, JSON.stringify(data));
            }
          );
          console.log(newUri);
          // is it an adHoc?
        } else if (data.type === 'static_adhoc') {
          var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var referenceNoSpace = data.description.reference.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          tmpNewUri.splice([tmpNewUri.length - 1], 1, referenceNoSpace + titleNoSpace);
          var newUri = tmpNewUri.join("/");
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              Ermintrude.globalVars.pagePath = newUri;
              onSave(collectionId, newUri, JSON.stringify(data));
            }
          );
          console.log(newUri);
        } else {
          var titleNoSpace = data.description.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
          var tmpNewUri = data.uri.split("/");
          //Articles with no edition. Add date as edition
          if (data.type === 'article' || data.type === 'article_download') {
            var editionDate = $.datepicker.formatDate('yy-mm-dd', new Date());
            tmpNewUri.splice([tmpNewUri.length - 2], 2, titleNoSpace, editionDate);
          } else {
            tmpNewUri.splice([tmpNewUri.length - 1], 1, titleNoSpace);
          }
          var newUri = tmpNewUri.join("/");
          //if it is a dataset rename children array
          if (data.type === 'dataset_landing_page') {
            if (data.datasets) {
              data.datasets = renameDatasetChildren(data.datasets, titleNoSpace);
            }
          }
          moveContent(collectionId, data.uri, newUri,
            onSuccess = function () {
              Ermintrude.globalVars.pagePath = newUri;
              onSave(collectionId, newUri, JSON.stringify(data));
            }
          );
          console.log(newUri);
        }
      } else {
        refreshPreview(data.uri);
        loadPageDataIntoEditor(data.uri, collectionId);
      }
    });
  } else {
    onSave(collectionId, data.uri, JSON.stringify(data));
  }
}

/**
 * Return the last edited event for the given page, from the given collection.
 * @param collection
 * @param page
 * @returns {*}
 */
function getLastEditedEvent(collection, page) {

  var uri = page;
  var safeUri = checkPathSlashes(uri);

  var pageEvents = collection.eventsByUri[safeUri];

  var lastEditedEvent = _.chain(pageEvents)
    .filter(function (event) {
      return event.type === 'EDITED';
    })
    .sortBy(function (event) {
      return event.date;
    })
    .last()
    .value();

  return lastEditedEvent;
}

/**
 * Return the collection created event from the given collection of events.
 * @param events
 * @returns {*}
 */
function getCollectionCreatedEvent(events) {

  var event = _.chain(events)
    .filter(function (event) {
      return event.type === 'CREATED';
    })
    .last()
    .value();

  return event;
}

/**
 * Return the last completed event for the given page, from the given collection.
 * @param collection
 * @param page
 * @returns {*}
 */
function getLastCompletedEvent(collection, page) {

  var uri = page;
  var safeUri = checkPathSlashes(uri);

   var lastCompletedEvent;

  if (collection.eventsByUri) {
    var pageEvents = collection.eventsByUri[safeUri];
    if (pageEvents) {
      lastCompletedEvent = _.chain(pageEvents)
        .filter(function (event) {
          return event.type === 'COMPLETED';
        })
        .sortBy(function (event) {
          return event.date;
        })
        .last()
        .value();
    }
  }
  return lastCompletedEvent;
}

function createCollection() {

  var publishTime, collectionId, collectionDate, releaseUri;
  collectionId = $('#collectionname').val();
  var publishType = $('input[name="publishType"]:checked').val();
  var scheduleType = $('input[name="scheduleType"]:checked').val();

  if (publishType === 'scheduled') {
    publishTime  = parseInt($('#hour').val()) + parseInt($('#min').val());
    var toIsoDate = $('#date').datepicker("getDate");
    collectionDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
  } else {
    collectionDate  = null;
  }

  if (scheduleType === 'release' && publishType === 'scheduled') {
    if(!Ermintrude.CreateCollection.selectedRelease) {
      sweetAlert('Please select a release');
      return true;
    }
    releaseUri  = Ermintrude.CreateCollection.selectedRelease.uri;
  } else {
    releaseUri  = null;
  }

  // inline tests
  if (collectionId === '') {
    sweetAlert('This is not a valid collection name', "A collection name can't be empty");
    return true;
  } if (collectionId.match(/\./)) {
    sweetAlert('This is not a valid collection name', "You can't use fullstops");
    return true;
  } if ((publishType === 'scheduled') && (scheduleType === 'custom')  && (isValidDate(new Date(collectionDate)))) {
    sweetAlert('This is not a valid date');
    return true;
  } if ((publishType === 'scheduled') && (scheduleType === 'custom') && (Date.parse(collectionDate) < new Date())) {
    sweetAlert('This is not a valid date');
    return true;
  } else {
    // Create the collection
    $.ajax({
      url: "/zebedee/collection",
      dataType: 'json',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({name: collectionId, type: publishType, publishDate: collectionDate, releaseUri: releaseUri, isEncrypted: true}),
      success: function (collection) {
        Ermintrude.setActiveCollection(collection);
        createWorkspace('', collection.id, 'browse');
      },
      error: function (response) {
        if(response.status === 409) {
          sweetAlert("Error", response.responseJSON.message, "error");
        }
        else {
          handleApiError(response);
        }
      }
    });
  }
}

function isValidDate(d) {
  if (!isNaN(d.getTime())) { return false; }
  return true;
}

/**
 * Handles the initial creation of the workspace screen.
 * @param path - path to iframe
 * @param collectionId
 * @param menu - opens a specific menu
 * @param stopEventListener - separates the link between editor and iframe
 * @returns {boolean}
 */

function createWorkspace(path, collectionId, menu, stopEventListener) {
  var safePath = '';
  $("#working-on").on('click', function () {
  }); // add event listener to mainNav

  if (stopEventListener) {
    document.getElementById('iframe').onload = function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.removeEventListener('click', Ermintrude.Handler, true);
    };
    return false;
  } else {
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

      //click handlers
      $('.nav--workspace > li').click(function () {
        menu = '';
        if (Ermintrude.Editor.isDirty) {
          swal({
            title: "Warning",
            text: "You have unsaved changes. Are you sure you want to continue?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel"
          }, function(result) {
            if (result === true) {
              Ermintrude.Editor.isDirty = false;
              processMenuClick(this);
            } else {
              return false;
            }
          });
        } else {
          processMenuClick(this);
        }
      });

      function processMenuClick(clicked) {
        var menuItem = $(clicked);

        $('.nav--workspace li').removeClass('selected');
        menuItem.addClass('selected');

        if (menuItem.is('#browse')) {
          loadBrowseScreen(collectionId, 'click');
        } else if (menuItem.is('#create')) {
          Ermintrude.globalVars.pagePath = getPathName();
          loadCreateScreen(Ermintrude.globalVars.pagePath, collectionId);
        } else if (menuItem.is('#edit')) {
          Ermintrude.globalVars.pagePath = getPathName();
          loadPageDataIntoEditor(Ermintrude.globalVars.pagePath, Ermintrude.collection.id);
        } else {
          loadBrowseScreen(collectionId);
        }
      }

      $('#nav--workspace__welsh').on('click', function () {
        Ermintrude.globalVars.welsh = Ermintrude.globalVars.welsh === false ? true : false;
        createWorkspace(Ermintrude.globalVars.pagePath, collectionId, 'browse');
      });

      $('.workspace-menu').on('click', '.btn-browse-create', function () {
        var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
        var spanType = $(this).parent().prev('span');
        var typeClass = spanType[0].attributes[0].nodeValue;
        var typeGroup = typeClass.match(/--(\w*)$/);
        var type = typeGroup[1];
        Ermintrude.globalVars.pagePath = dest;
        $('.nav--workspace li').removeClass('selected');
        $("#create").addClass('selected');
        loadCreateScreen(Ermintrude.globalVars.pagePath, collectionId, type);
      });

      $('.workspace-menu').on('click', '.btn-browse-edit', function () {
        var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
        Ermintrude.globalVars.pagePath = dest;
        $('.nav--workspace li').removeClass('selected');
        $("#edit").addClass('selected');
        loadPageDataIntoEditor(Ermintrude.globalVars.pagePath, collectionId);
      });

      if (menu === 'edit') {
        $('.nav--workspace li').removeClass('selected');
        $("#edit").addClass('selected');
        loadPageDataIntoEditor(Ermintrude.globalVars.pagePath, collectionId);
      } else if (menu === 'browse') {
        $('.nav--workspace li').removeClass('selected');
        $("#browse").addClass('selected');
        loadBrowseScreen(collectionId, 'click');
      }
    //};
  }
}

function deleteCollection(collectionId, success, error) {
  $.ajax({
    url: "/zebedee/collection/" + collectionId,
    type: 'DELETE',
    success: function (response) {
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

function deleteContent(collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  // send ajax call
  $.ajax({
    url: "/zebedee/content/" + collectionId + "?uri=" + safePath,
    type: 'DELETE',
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

function deleteUnpublishedVersion (collectionId, path, success, error) {
  var url = "/zebedee/version/" + collectionId + "?uri=" + path;

  // Update content
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'DELETE',
    success: function (response) {
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

function deleteUser(email) {
  $.ajax({
    url: "/zebedee/users?email=" + email,
    dataType: 'json',
    contentType: 'application/json',
    type: 'DELETE',
    success: function () {
      console.log('User deleted');
      sweetAlert('Deleted', "User '"  + email + "' has been deleted", 'success');
      viewController('users');
    },
    error: function (response) {
      if (response.status === 403 || response.status === 401) {
        sweetAlert("Error", "You are not permitted to delete users", "error")
      } else {
        handleApiError(response);
      }
    }
  });
}/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template (has to be 'edition')
 */

function addDataset(collectionId, data, field, idField) {
  var downloadExtensions, pageType;
  var uriUpload;
  var lastIndex;
  if (data[field]) {
    lastIndex = data[field].length;
  } else {
    lastIndex = 0;
  }
  var uploadedNotSaved = {uploaded: false, saved: false, editionUri: ""};
  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);

  //Add
  if (data.timeseries) {
    downloadExtensions = /\.csdb$/;
    pageType = 'timeseries_dataset';
  } else {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
    pageType = 'dataset';
  }

  $('#add-' + idField).one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Ermintrude.globalVars.pagePos = position + 200;
    $('#sortable-' + idField).append(
      '<div id="' + lastIndex + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <textarea class="auto-size" placeholder="Period (E.g. 2015, August to December 2010, etc." type="text"             id="edition"></textarea>' +
      '    <textarea class="auto-size" placeholder="Label (E.g. Final, Revised, etc.)" type="text" id="version"></textarea>' +
      '    <input type="file" title="Select a file and click Submit" name="files">' +
      '    <br>' +
      '    <button type="submit" form="UploadForm" value="submit">Submit</button>' +
      '    <button class="btn-page-cancel" id="file-cancel">Cancel</button>' +
      '  </form>' +
      '  <div id="response"></div>' +
      '  <ul id="list"></ul>' +
      '</div>');

    $('#file-cancel').one('click', function (e) {
      e.preventDefault();
      $('#' + lastIndex).remove();
      //Check files uploaded and delete them
      if (uploadedNotSaved.uploaded === true) {
        data[field].splice(-1, 1);
        deleteContent(Ermintrude.collection.id, uploadedNotSaved.editionUri,
          onSuccess = function () {
          },
          onError = function (error) {
            handleApiError(error);
          }
        );
      }
      addDataset(collectionId, pageData, 'datasets', 'edition');
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      var pageTitle = this[0].value;
      var pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      var versionLabel = this[1].value;

      var file = this[2].files[0];
      if (!file) {
        sweetAlert("Please select a file to upload");
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = data.uri + '/' + pageTitleTrimmed + '/' + fileNameNoSpace;
      var safeUriUpload = checkPathSlashes(uriUpload);

      if (data[field] && data[field].length > 0) {
        $(data[field]).each(function (i, filesUploaded) {
          if (filesUploaded.file == safeUriUpload) {
            sweetAlert('This file already exists');
            $('#' + lastIndex).remove();
            addDataset(collectionId, pageData, 'datasets', 'edition');
            return;
          }
        });
      }

      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        sweetAlert('This file type is not supported');
        $('#' + lastIndex).remove();
        addDataset(collectionId, pageData, 'datasets', 'edition');
        return;
      }

      if (pageTitle.length < 4) {
        sweetAlert("This is not a valid file title");
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + safeUriUpload,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function () {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: data.uri + '/' + pageTitleTrimmed});
            uploadedNotSaved.uploaded = true;
            // create the dataset
            loadT8EditionCreator(collectionId, data, pageType, pageTitle, fileNameNoSpace, versionLabel);
            // on success save parent and child data
          }
        });
      }
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }

  sortable();
}

/**
 * Manage files associated with content
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function addFile(collectionId, data, field, idField) {
  var list = data[field];
  var downloadExtensions, supplementary;
  if (field === 'supplementaryFiles') {
    supplementary = 'supplementary ';
  } else {
    supplementary = '';
  }
  var dataTemplate = {list: list, idField: idField, supplementary: supplementary};
  var html = templates.editorDownloads(dataTemplate);
  $('#' + idField).replaceWith(html);
  var uriUpload;

  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);

  //Edit saved from editor

  // Delete
  if (!data[field] || data[field].length === 0) {
    var lastIndex = 0;
  } else {
    $(data[field]).each(function (index) {
      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        swal ({
          title: "Warning",
          text: "Are you sure you want to delete this file?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function(result) {
          if (result === true) {
            swal({
              title: "Deleted",
              text: "This alert has been deleted",
              type: "success",
              timer: 2000
            });
            var position = $(".workspace-edit").scrollTop();
            Ermintrude.globalVars.pagePos = position;
            $(this).parent().remove();
            $.ajax({
              url: "/zebedee/content/" + collectionId + "?uri=" + data[field][index].file,
              type: "DELETE",
              success: function (res) {
                console.log(res);
              },
              error: function (res) {
                console.log(res);
              }
            });
            data[field].splice(index, 1);
            updateContent(collectionId, data.uri, JSON.stringify(data));
          }
        });
      });
    });
  }

  //Add
  if (data.type === 'static_adhoc') {
    downloadExtensions = /\.csv$|.xls$|.doc$|.pdf$|.zip$/;
  } else if (data.type === 'static_qmi') {
    downloadExtensions = /\.pdf$/;
  } else if (data.type === 'article_download' || data.type === 'static_methodology_download') {
    downloadExtensions = /\.pdf$/;
  } else if (data.type === 'static_foi') {
    downloadExtensions = /\.csv$|.xls$|.doc$|.pdf$|.zip$/;
  } else if (data.type === 'static_page') {
    downloadExtensions = /\.csv$|.xls$|.doc$|.pdf$|.zip$/;
  } else if (data.type === 'dataset' || data.type === 'timeseries_dataset') {
    downloadExtensions = /\.csv$|.xls$|.doc$|.pdf$|.zip$/;
  } else {
    sweetAlert("This file type is not valid", "Contact an administrator if you need to add this type of file in this document", "info");
  }

  $('#add-' + idField).one('click', function () {
      var position = $(".workspace-edit").scrollTop();
      Ermintrude.globalVars.pagePos = position + 200;
      $('#sortable-' + idField).append(
        '<div id="' + lastIndex + '" class="edit-section__item">' +
        '  <form id="UploadForm">' +
        '    <input type="file" title="Select a file and click Submit" name="files">' +
        '    <br>' +
        '    <button type="submit" form="UploadForm" value="submit">Submit</button>' +
        '    <button class="btn-page-cancel" id="file-cancel">Cancel</button>' +
        '  </form>' +
        '  <div id="response"></div>' +
        '  <ul id="list"></ul>' +
        '</div>');

      $('#file-cancel').one('click', function (e) {
        e.preventDefault();
        $('#' + lastIndex).remove();
        addFile(collectionId, data, field, idField);
      });

      $('#UploadForm').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var formdata = new FormData();

        function showUploadedItem(source) {
          $('#list').append(source);
        }

        var file = this[0].files[0];
        if(!file) {
          sweetAlert("Please select a file to upload");
          return;
        }

        document.getElementById("response").innerHTML = "Uploading . . .";

        var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
        uriUpload = data.uri + "/" + fileNameNoSpace;
        var safeUriUpload = checkPathSlashes(uriUpload);

        if (data[field] && data[field].length > 0) {
          $(data[field]).each(function (i, filesUploaded) {
            if (filesUploaded.file == safeUriUpload) {
              sweetAlert('This file already exists');
              $('#' + lastIndex).remove();
              addFile(collectionId, data, field, idField);
              return;
            }
          });
        }
        if (!!file.name.match(downloadExtensions)) {
          showUploadedItem(fileNameNoSpace);
          if (formdata) {
            formdata.append("name", file);
          }
        } else {
          sweetAlert("This file type is not supported");
          $('#' + lastIndex).remove();
          addFile(collectionId, data, field, idField);
          return;
        }

        if (formdata) {
          $.ajax({
            url: "/zebedee/content/" + collectionId + "?uri=" + safeUriUpload,
            type: 'POST',
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: function () {
              document.getElementById("response").innerHTML = "File uploaded successfully";
              if (!data[field]) {
                data[field] = [];
              }
              data[field].push({title: '', file: fileNameNoSpace});
              updateContent(collectionId, data.uri, JSON.stringify(data));
            }
          });
        }
      });
    }
  );

  $(function () {
    $('.add-tooltip').tooltip({
      items: '.add-tooltip',
      content: 'Type title here and click Save to add it to the page',
      show: "slideDown", // show immediately
      open: function (event, ui) {
        ui.tooltip.hover(
          function () {
            $(this).fadeTo("slow", 0.5);
          });
      }
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }

  sortable();
}

/**
 * Manages file with description
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function addFileWithDetails(collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorDownloadsWithSummary(dataTemplate);
  $('#' + idField).replaceWith(html);
  var uriUpload;
  var downloadExtensions;

  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);

  // Edit
  if (!data[field] || data[field].length === 0) {
    var lastIndex = 0;
  } else {
    $(data[field]).each(function (index) {
      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        swal ({
          title: "Warning",
          text: "Are you sure you want to delete this file?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function(result) {
          if (result === true) {
            swal({
              title: "Deleted",
              text: "This alert has been deleted",
              type: "success",
              timer: 2000
            });
            var position = $(".workspace-edit").scrollTop();
            Ermintrude.globalVars.pagePos = position;
            $(this).parent().remove();
            $.ajax({
              url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + data[field][index].file,
              type: "DELETE",
              success: function (res) {
                console.log(res);
              },
              error: function (res) {
                console.log(res);
              }
            });
            data[field].splice(index, 1);
            updateContent(collectionId, data.uri, JSON.stringify(data));
          }
        });
      });

      // Edit
      $('#' + idField + '-edit_' + index).click(function () {
        var editedSectionValue = {
          "title": $('#' + idField + '-title_' + index).val(),
          "markdown": $('#' + idField + '-summary_' + index).val()
        };

        var saveContent = function (updatedContent) {
          data[field][index].fileDescription = updatedContent;
          data[field][index].title = $('#' + idField + '-title_' + index).val();
          updateContent(collectionId, data.uri, JSON.stringify(data));
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data);
      });

    });
  }

  //Add
  if (data.type === 'compendium_data') {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  } else {
    sweetAlert("This file type is not valid", "Contact an administrator if you need to add this type of file in this document", "info");
  }

  $('#add-' + idField).one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Ermintrude.globalVars.pagePos = position + 200;
    $('#sortable-' + idField).append(
      '<div id="' + lastIndex + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <input type="file" title="Select a file and click Submit" name="files">' +
      '    <br>' +
      '    <button type="submit" form="UploadForm" value="submit">Submit</button>' +
      '    <button class="btn-page-cancel" id="file-cancel">Cancel</button>' +
      '  </form>' +
      '  <div id="response"></div>' +
      '  <ul id="list"></ul>' +
      '</div>');

    $('#file-cancel').one('click', function (e) {
      e.preventDefault();
      $('#' + lastIndex).remove();
      addFileWithDetails(collectionId, data, field, idField);
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var file = this[0].files[0];
      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = fileNameNoSpace;    //make file path relative

      if (data[field].length > 0) {
        $(data[field]).each(function (i, filesUploaded) {
          if (filesUploaded.file === uriUpload) {
              sweetAlert('This file already exists');
            $('#' + lastIndex).remove();
            addFileWithDetails(collectionId, data, field, idField);
            return;
          }
          else if (filesUploaded.file === data.uri + '/' + uriUpload) {   //case for old uri
            alert('This file already exists');
            $('#' + lastIndex).remove();
            addFileWithDetails(collectionId, data, field, idField);
            return;
          }
        });
      }
      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        sweetAlert("This file type is not supported");
        $('#' + lastIndex).remove();
        addFileWithDetails(collectionId, data, field, idField);
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + '/' + uriUpload,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function (res) {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            data[field].push({title: '', file: uriUpload});
            updateContent(collectionId, data.uri, JSON.stringify(data));
          }
        });
      }
    });
  });

  $(function () {
    $('.add-tooltip').tooltip({
      items: '.add-tooltip',
      content: 'Type title here and click Edit to add a description',
      show: "slideDown", // show immediately
      open: function (event, ui) {
        ui.tooltip.hover(
          function () {
            $(this).fadeTo("slow", 0.5);
          });
      }
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }

  sortable();
}

/**
 * Manages alerts
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editAlert(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorAlert(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseAlert(collectionId, data, templateData, field, idField);
  // New alert
  $("#add-" + idField).click(function () {
    if (!data[field]) {
      data[field] = [];
      templateData[field] = [];
    }
    var tmpDate = (new Date()).toISOString();
    data[field].push({markdown: "", date: tmpDate, type: "alert"});
    templateData[field].push({markdown: "", date: tmpDate, type: "alert"});
    saveAlert(collectionId, data.uri, data, templateData, field, idField);
  });
  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);
}

function refreshAlert(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorAlert(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseAlert(collectionId, data, templateData, field, idField);
}

function initialiseAlert(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].date;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].date = new Date($('#date_' + index).datepicker('getDate')).toISOString();
      templateData[field][index].date = new Date($('#date_' + index).datepicker('getDate')).toISOString();
    });
    $('#' + idField + '-edit_' + index).click(function () {
      var editedSectionValue = {title: 'Alert notice', markdown: data[field][index].markdown};
      //var editedSectionValue = data[field][index].markdown;
      var saveContent = function (updatedContent) {
        data[field][index].markdown = updatedContent;
        templateData[field][index].markdown = updatedContent;
        saveAlert(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });

    var correctionCheck;
    if (data[field][index].type === 'correction') {
      correctionCheck = 'checked';
    } else if (data[field][index].type === 'alert') {
      correctionCheck = 'unchecked';
    }

    if (data.type === 'dataset_landing_page' || data.type === 'compendium_landing_page') {
      $('#correction-container_' + index).append('<label for="correction-alert_' + index + '">Correction' +
        '<input id="correction-alert_' + index + '" type="checkbox" value="value" ' + correctionCheck + '/></label>');
    }

    $('#correction-alert_' + index).change(function () {
      if ($(this).prop('checked') === true) {
        data[field][index].type = 'correction';
      }
      else {
        data[field][index].type = 'alert';
      }
      saveAlert(collectionId, data.uri, data, templateData, field, idField);
    });

    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      swal ({
        title: "Warning",
        text: "Are you sure you want to delete this alert?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result) {
        if (result === true) {
          swal({
            title: "Deleted",
            text: "This alert has been deleted",
            type: "success",
            timer: 2000
          });
          var position = $(".workspace-edit").scrollTop();
          Ermintrude.globalVars.pagePos = position;
          $(this).parent().remove();
          data[field].splice(index, 1);
          templateData[field].splice(index, 1);
          saveAlert(collectionId, data.uri, data, templateData, field, idField);
        }
      });
    });
  });
  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }

  sortable();

}

function saveAlert(collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function () {
      Ermintrude.Editor.isDirty = false;
      refreshAlert(collectionId, data, templateData, field, idField);
      refreshPreview(data.uri);
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

function editCollection (collection) {

  var editPublishTime, newCollectionDate, toIsoDate;
  var collDetails = $('.section-content').detach();
  var html = templates.collectionEdit(collection);
  $('.section-head').after(html);
  $('.collection-selected .btn-collection-edit').off();

  $('#collection-editor-name').on('input', function () {
    collection.name = $('#collection-editor-name').val();
  });

  if (!collection.publishDate) {
    $('#collection-editor-date').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      toIsoDate = $('#collection-editor-date').datepicker("getDate");
    });
  } else {
    dateTmp = collection.publishDate;
    toIsoDate = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#collection-editor-date').val(toIsoDate).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      toIsoDate = $('#collection-editor-date').datepicker("getDate");
    });
  }

  //initial value
  if (collection.type === "manual") {
    $('#collection-editor-date-block').hide();
  } else {
    $('#collection-editor-date-block').show();
  }

  $('input[type=radio]').click(function () {
    if ($(this).val() === 'manualCollection') {
      collection.type = "manual";
      $('#collection-editor-date-block').hide();
    } else if ($(this).val() === 'scheduledCollection') {
      collection.type = "scheduled";
      $('#collection-editor-date-block').show();
    }
  });

  //More functionality to be added here
  // When scheduled, do we change all the dates in the files in the collection?


  //Save
  $('.btn-collection-editor-save').click(function () {
    //save date and time to collection
    if (collection.type === 'scheduled') {
      editPublishTime = parseInt($('#collection-editor-hour').val()) + parseInt($('#collection-editor-min').val());
      collection.publishDate = new Date(parseInt(new Date(toIsoDate).getTime()) + editPublishTime).toISOString();
    } else {}
    //check validity
    if (collection.name === '') {
      sweetAlert('This is not a valid collection name', "A collection name can't be empty");
      return true;
    } if (collection.name.match(/\./)) {
      sweetAlert('This is not a valid collection name', "You can't use fullstops");
      return true;
    } if ((collection.type === 'scheduled') && (Date.parse(collection.publishDate) < new Date())) {
      sweetAlert('This is not a valid date. Date cannot be in the past');
      return true;
    } else {
      // Update the collection
      $.ajax({
        url: "/zebedee/collection/" + collection.id,
        dataType: 'json',
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(collection),
        success: function (updatedCollection) {
          Ermintrude.setActiveCollection(updatedCollection);
          createWorkspace('', updatedCollection.id, 'browse');
        },
        error: function (response) {
          if(response.status === 409) {
            sweetAlert("Error", response.responseJSON.message, "error");
          }
          else {
            handleApiError(response);
          }
        }
      });
    }
  });

  //Cancel
  $('.btn-collection-editor-cancel').click(function () {
    $('.collection-selected .btn-collection-edit').click(function () {
      editCollection(collection);
    });
    $('.collection-editor').remove();
    $('.section-head').after(collDetails);
  });

  setCollectionEditorHeight();
}

  function setCollectionEditorHeight(){
    var panelHeight = parseInt($('.collection-selected').height());

    var headHeight = parseInt($('.section-head').height());
    var headPadding = parseInt($('.section-head').css('padding-bottom'));

    var contentHeight = panelHeight - (headHeight + headPadding);
    $('.collection-editor__editor').css('height', contentHeight);
  }

/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key ('versions')
 * @param idField - HTML id for the template ('version' or 'correction')
 */

function editDatasetVersion(collectionId, data, field, idField) {
  var downloadExtensions, uriUpload, file;
  var lastIndex;
  if (data[field]) {
    lastIndex = data[field].length;
  } else {
    lastIndex = 0;
    data[field] = [];
  }
  var uploadedNotSaved = {uploaded: false, saved: false, fileUrl: "", oldLabel: data.description.versionLabel};
  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);
  //Add
  if (data.type === 'timeseries_dataset') {
    downloadExtensions = /\.csdb$/;
  } else if (data.type === 'dataset') {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  }

  var ajaxRequest = [];
  var templateData = $.extend(true, {}, data);
  $(templateData[field]).each(function (index, version) {
    var dfd = $.Deferred();
    if (version.correctionNotice) {
      templateData[field][index].type = true;
    } else {
      templateData[field][index].type = false;
    }
    templateData[field][index].label = version.label;
    dfd.resolve();
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    var html = templates.editorCorrection({idField: idField});
    $('#' + idField).replaceWith(html);
    initialiseDatasetVersion(collectionId, data, templateData, field, idField);
  });

  $("#add-" + idField).one('click', function () {
    addTheVersion();
  });

  function addTheVersion() {
    var position = $(".workspace-edit").scrollTop();
    Ermintrude.globalVars.pagePos = position + 200;

    // todo: Move this HTML into a handlebars template.
    $('#' + idField + '-section').append(
      '<div id="' + lastIndex + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <textarea class="auto-size" type="text" placeholder="Add a label here (E.g. Revised, Final, etc" id="label"></textarea>' +
      '    <input type="file" title="Select a file and click Submit" name="files">' +
      '    <br>' +
      '    <button type="submit" form="UploadForm" value="submit">Submit</button>' +
      '    <button class="btn-page-cancel" id="file-cancel">Cancel</button>' +
      '  </form>' +
      '  <div id="response"></div>' +
      '  <ul id="list"></ul>' +
      '</div>');

    // The label field is not used for corrections, just use existing version label.
    if (idField === "correction") {
      var $versionLabel = $('#UploadForm #label')
      $versionLabel.text(uploadedNotSaved.oldLabel);
      $versionLabel.hide();
    }

    $('#file-cancel').one('click', function (e) {
      e.preventDefault();
      $('#' + lastIndex).remove();
      if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
        data.description.versionLabel = uploadedNotSaved.oldLabel;
        deleteContent(collectionId, uploadedNotSaved.fileUrl,
          onSuccess = function () {
          },
          onError = function (error) {
            handleApiError(error);
          }
        );
      }
      initialiseDatasetVersion(collectionId, data, templateData, field, idField);
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      var versionLabel = this[0].value;
      file = this[1].files[0];
      if (!file) {
        sweetAlert('Please select a file to upload');
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = data.uri + '/' + fileNameNoSpace;
      var safeUriUpload = checkPathSlashes(uriUpload);

      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        sweetAlert('This file type is not supported');
        $('#' + lastIndex).remove();
        editDatasetVersion(collectionId, data, field, idField);
        return;
      }

      if (versionLabel.length < 4) {
        sweetAlert("This is not a valid file title");
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + safeUriUpload,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function () {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            uploadedNotSaved.uploaded = true;
            uploadedNotSaved.fileUrl = safeUriUpload;
            // create the new version/correction
            saveNewCorrection(collectionId, data.uri,
              function (response) {
                var tmpDate = (new Date()).toISOString();           // it could use releaseDate
                if (idField === "correction") {
                  data[field].push({
                    correctionNotice: " ",
                    updateDate: data.description.releaseDate,
                    uri: response,
                    label: versionLabel
                  });
                } else {
                  data[field].push({
                    correctionNotice: "",
                    updateDate: data.description.releaseDate,
                    uri: response,
                    label: versionLabel
                  });
                  data.description.versionLabel = versionLabel; // only update the version label for versions not corrections.
                }
                data.downloads = [{file: fileNameNoSpace}];
                data.description.releaseDate = tmpDate;
                uploadedNotSaved.saved = true;
                $("#" + idField).find('.edit-section__content').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');
                $("#" + idField + '-section').remove();
                saveDatasetVersion(collectionId, data.uri, data, field, idField);
              }, function (response) {
                if (response.status === 409) {
                  sweetAlert("You can add only one " + idField + " before publishing.");
                  deleteContent(collectionId, uploadedNotSaved.fileUrl);
                }
                else if (response.status === 404) {
                  sweetAlert("You can only add " + idField + "s to content that has been published.");
                  deleteContent(collectionId, uploadedNotSaved.fileUrl);
                }
                else {
                  handleApiError(response);
                }
              }
            );
          },
          error: function (response) {
            console.log("Error in uploading this file");
            handleApiError(response);
          }
        });
      }
    });
  }
}

function refreshDatasetVersion(collectionId, data, field, idField) {
  var ajaxRequest = [];
  var templateData = $.extend(true, {}, data);
  $(templateData[field]).each(function (index, version) {
    var dfd = $.Deferred();
    if (version.correctionNotice) {
      templateData[field][index].type = true;
    } else {
      templateData[field][index].type = false;
    }
    templateData[field][index].label = version.label;
    dfd.resolve();
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    initialiseDatasetVersion(collectionId, data, templateData, field, idField);
  });

}

function initialiseDatasetVersion(collectionId, data, templateData, field, idField) {
  // Load
  var list = templateData[field];
  var correction;
  if (idField === 'correction') {
    correction = true;
  } else {
    correction = false;
  }
  var dataTemplate = {list: list, idField: idField, correction: correction};
  var html = templates.workEditT8VersionList(dataTemplate);
  $('#sortable-' + idField).replaceWith(html);
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#' + idField + '-date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#' + idField + '-date_' + index).datepicker('getDate')).toISOString();
      saveDatasetVersion(collectionId, data.uri, data, field, idField);
    });
    if (idField === 'correction') {
      $('#' + idField + '-edit_' + index).click(function () {
        var markdown = $('#' + idField + '-markdown_' + index).val();
        var editedSectionValue = {title: 'Correction notice', markdown: markdown};
        var saveContent = function (updatedContent) {
          data[field][index].correctionNotice = updatedContent;
          saveDatasetVersion(collectionId, data.uri, data, field, idField);
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
      });
    }
    $('#' + idField + '-edit-label_' + index).click(function () {
      var markdown = $('#' + idField + '-markdown-label_' + index).val();
      var editedSectionValue = {title: 'Label content', markdown: markdown};
      var saveContent = function (updatedContent) {
        data[field][index].label = updatedContent;
        saveDatasetVersion(collectionId, data.uri, data, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });
    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      swal ({
        title: "Warning",
        text: "This will revert all changes you have made in this file. Are you sure you want to delete this " + idField + "?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result){
        if (result === true) {
          swal({
            title: "Deleted",
            text: "This " + idField + " version has been deleted",
            type: "success",
            timer: 2000
          });
          var pathToDelete = data.uri;
          var fileToDelete = pathToDelete + data.downloads[0].file;  //Saves always the latest
          var uriToDelete = $(this).parent().children('#' + idField + '-edition_' + index).attr(idField + '-url');
          deleteUnpublishedVersion(collectionId, uriToDelete, function () {
            var position = $(".workspace-edit").scrollTop();
            Ermintrude.globalVars.pagePos = position;
            $(this).parent().remove();
            // delete uploaded file
            deleteContent(collectionId, fileToDelete, function () {
              console.log("File deleted");
            }, function (error) {
              handleApiError(error);
            });
            // delete modified data.json and revert to pubished
            deleteContent(collectionId, pathToDelete, function () {
              loadPageDataIntoEditor(pathToDelete, collectionId);
              refreshPreview(pathToDelete);
            }, function (error) {
              handleApiError(error);
            });
          }, function (response) {
            if (response.status === 404) {
              sweetAlert("You cannot delete a " + idField + " that has been published.");
            }
            else {
              handleApiError(response);
            }
          });
        }
      });
    });
  });
}

function saveDatasetVersion(collectionId, path, data, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    function () {
      Ermintrude.Editor.isDirty = false;
      refreshDatasetVersion(collectionId, data, field, idField);
      refreshPreview(path);
    },
    function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

/**
 * Manages dates for release calendar
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editDate(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  runDatePicker(dataTemplate);
  var html = templates.editorDate(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseNoteMarkdown(collectionId, data, templateData, field, idField);
}

function runDatePicker(dataTemplate) {
  if(dataTemplate && dataTemplate.list) {
    var countSections = dataTemplate.list.length;
    var i = 0;
    while (i < countSections) {
      var tmpDate = dataTemplate.list[i].previousDate;
      dataTemplate.list[i].previousDate = $.datepicker.formatDate('dd MM yy', new Date(tmpDate));
      i++;
    }
  }
}

function refreshNoteMarkdown(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  runDatePicker(dataTemplate);
  var html = templates.editorDate(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseNoteMarkdown(collectionId, data, templateData, field, idField)
}

function initialiseNoteMarkdown(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    $('#' + idField + '-note_' + index).click(function () {
      var markdown = $('#' + idField + '-markdown_' + index).val();
      var editedSectionValue = {title: 'Note', markdown: markdown};
      var saveContent = function (updatedContent) {
        data[field][index].changeNotice = updatedContent;
        templateData[field][index].changeNotice = updatedContent;
        saveNoteMarkdown(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });
  });
}

function saveNoteMarkdown(collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function () {
      Ermintrude.Editor.isDirty = false;
      refreshNoteMarkdown(collectionId, data, templateData, field, idField);
      refreshPreview(data.uri);
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

/**
 * Manage correction of documents with files attached (compendium_data, article_download)
 * @param collectionId
 * @param data
 * @param field - JSON data key ('versions')
 * @param idField - HTML id for the template ('correction')
 */

function editDocWithFilesCorrection(collectionId, data, field, idField) {
  var downloadExtensions, file;
  if (!data[field]) {
    data[field] = [];
  }
  var oldFile = $.extend(true, {}, data);
  var uploadedNotSaved = {uploaded: false, saved: false, files: oldFile.downloads};
  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);
  //Add file types
  if (data.type === 'compendium_data'){
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  }
  else if (data.type === 'article_download'){
    downloadExtensions = /\.pdf$/;
  }

  refreshDocWithFilesCorrection(collectionId, data, field, idField);


  $("#add-" + idField).one('click', function () {

    $("#add-" + idField).parent().append('<button class="btn-page-delete"' +
      ' id="cancel-correction">Cancel</button>');
    //Display the list of uploaded files in the ref table
    var list = data.downloads;
    var html = templates.editorDocWithFiles(list);
    $('#sortable-correction').append(html);

    //Update the files to be corrected
    $(data.downloads).each(function (index) {
      $('#correction-upload_' + index).click(function () {
        fileCorrection(index);
      }).children().click(function (e) {
        e.stopPropagation();
      });
    });

    //Cancel the correction
    $('#cancel-correction').click(function () {
      //Check the files uploaded
      var filesToDelete = checkFilesUploaded (uploadedNotSaved.files, data.downloads);
      if (filesToDelete) {
        _.each(filesToDelete, function (file) {
          var fileToDelete = data.uri + file;
          deleteContent(collectionId, fileToDelete);
        });
      }
      loadPageDataIntoEditor(data.uri, collectionId);
      refreshPreview(data.uri);
    });

    //Save the correction
    $("#add-" + idField).html("Save correction").on().click(function () {
      saveNewCorrection(collectionId, data.uri,
        function (response) {
          var tmpDate = (new Date()).toISOString();           // it could use releaseDate
          data[field].push({
            correctionNotice: "",
            updateDate: tmpDate,
            uri: response
          });
          uploadedNotSaved.saved = true;
          $("#add-" + idField).parents('.edit-section__content').remove('#sortable-' + idField)
            .find('.text-center').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');  //check .after()
          // Enter a notice
          var editedSectionValue = {title: 'Enter correction notice', markdown: ''};
          var saveContent = function (updatedContent) {
            data[field][data[field].length - 1].correctionNotice = updatedContent;
            saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
          };
          loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
          //saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
        }, function (response) {
          if (response.status === 409) {
            //Revert to condition before error
            var filesToDelete = checkFilesUploaded(uploadedNotSaved.files, data.downloads);
            if (filesToDelete) {
              _.each(filesToDelete, function (download) {
                var fileToDelete = data.uri + '/' + download;
                deleteContent(collectionId, fileToDelete);
              });
            }
            sweetAlert("You can add only one " + idField + " before publishing.");
            refreshDocWithFilesCorrection(collectionId, data, field, idField);
          }
          else if (response.status === 404) {
            //Revert to condition before error
            var filesToDelete = checkFilesUploaded(uploadedNotSaved.files, data.downloads);
            if (filesToDelete) {
              _.each(filesToDelete, function (download) {
                var fileToDelete = data.uri + '/' + download;
                deleteContent(collectionId, fileToDelete);
              });
            }
            data.downloads = uploadedNotSaved.files;
            sweetAlert("You can only add " + idField + "s to content that has been published.");
            refreshDocWithFilesCorrection(collectionId, data, field, idField);
          }
          else {
            //Revert to condition before error
            var filesToDelete = checkFilesUploaded(uploadedNotSaved.files, data.downloads);
            if (filesToDelete) {
              _.each(filesToDelete, function (download) {
                var fileToDelete = data.uri + '/' + download;
                deleteContent(collectionId, fileToDelete);
              });
            }
            handleApiError(response);
            refreshDocWithFilesCorrection(collectionId, data, field, idField);
          }
        }
      );
    });
  });

  function fileCorrection(index) {
    var position = $(".workspace-edit").scrollTop();
    Ermintrude.globalVars.pagePos = position + 200;
    $('#correction-filename_show_' + index).append(
      '<div id="file-added_' + index + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <input type="file" title="Select a file and click Submit" name="files">' +
      '    <br>' +
      '    <button type="submit" form="UploadForm" value="submit">Submit</button>' +
      '    <button class="btn-page-cancel" id="file-cancel">Cancel</button>' +
      '  </form>' +
      '  <div id="response"></div>' +
      '  <ul id="list"></ul>' +
      '</div>');

    $('#file-cancel').one('click', function (e) {
      e.preventDefault();
      $('#file-added_' + index).remove();
      if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
        data.downloads[index].file = uploadedNotSaved.files[index].file;
        var fileToDelete = data.uri + '/' + uploadedNotSaved.files[index].file;
        deleteContent(collectionId, fileToDelete);
      }
      refreshDocWithFilesCorrection(collectionId, data, field, idField);
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      file = this[0].files[0];
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();

      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        alert('This file type is not supported');
        $('#' + index).remove();
        editDocWithFilesCorrection(collectionId, data, field, idField);
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + '/' + fileNameNoSpace,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function () {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            uploadedNotSaved.uploaded = true;
            $('#file-added_' + index).remove();
            $('#correction-filename_show_' + index).replaceWith('<p id="correction-filename_show_' + index + '">' + fileNameNoSpace + '</p>');
            data.downloads[index].file = fileNameNoSpace;
          },
          error: function (response) {
            handleApiError(response);
          }
        });
      }
    });
  }
}

function refreshDocWithFilesCorrection(collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseDocWithFilesCorrection(collectionId, data, field, idField)
}

function initialiseDocWithFilesCorrection(collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#' + idField + '-date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#' + idField + '-date_' + index).datepicker('getDate')).toISOString();
      saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
    });
    if (idField === 'correction') {
      $('#' + idField + '-edit_' + index).click(function () {
        var markdown = $('#' + idField + '-markdown_' + index).val();
        var editedSectionValue = {title: 'Correction notice', markdown: markdown};
        var saveContent = function (updatedContent) {
          data[field][index].correctionNotice = updatedContent;
          saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
      });
    }

    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      var result = confirm("This will revert all changes you have made in this file. Are you sure you want to delete" +
        " this " + idField + "?");
      if (result === true) {
        var pathToDelete = data.uri;
        var filesToDelete = data.downloads;  //Delete all files in directory
        var uriToDelete = $(this).parent().children('#' + idField + '-edition_' + index).attr(idField + '-url');
        deleteUnpublishedVersion(collectionId, uriToDelete, function () {
          var position = $(".workspace-edit").scrollTop();
          Ermintrude.globalVars.pagePos = position;
          $(this).parent().remove();
          //delete uploaded files in this directory
          _.each(filesToDelete, function (download) {
            fileToDelete = data.uri + '/' + download.file;
            deleteContent(collectionId, fileToDelete);
          });
          // delete modified data.json and revert to pubished
          deleteContent(collectionId, pathToDelete, function () {
            loadPageDataIntoEditor(pathToDelete, collectionId);
            refreshPreview(pathToDelete);
          }, function (error) {
            handleApiError(error);
          });
        }, function (response) {
          if (response.status === 404) {
            sweetAlert("You cannot delete a " + idField + " that has been published.");

          }
          else {
            handleApiError(response);
          }
        });
      }
    });
  });
}

function saveDocWithFilesCorrection(collectionId, path, data, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    function () {
      Ermintrude.Editor.isDirty = false;
      refreshDocWithFilesCorrection(collectionId, data, field, idField);
      refreshPreview(path);
    },
    function (response) {
      if (response.status === 400) {
        alert("Cannot edit this page. It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

function checkFilesUploaded (oldFiles, newFiles) {
  var diff = [];
  _.each(oldFiles, function (oldFile, i) {
    if (oldFile.file !== newFiles[i].file) {
      diff.push(newFiles[i].file);
    }
  });
  return diff;
}

/**
 * Manages corrections (versions)
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editDocumentCorrection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseCorrection(collectionId, data, templateData, field, idField);
  // New correction
  $("#add-" + idField).one('click', function () {
    if (!data[field]) {
      data[field] = [];
      templateData[field] = [];
    }
    saveNewCorrection(collectionId, data.uri, function (response) {
      var tmpDate = (new Date()).toISOString();
      data[field].push({correctionNotice: "", updateDate: tmpDate, uri: response});
      templateData[field].push({correctionNotice: "", updateDate: tmpDate, uri: response});
      // Enter a notice
      var editedSectionValue = {title: 'Correction notice', markdown: ''};
      var saveContent = function (updatedContent) {
        data[field][data[field].length - 1].correctionNotice = updatedContent;
        saveCorrection(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
      $("#add-" + idField).remove();
    }, function (response) {
      if (response.status === 409) {
        sweetAlert("You can add only one correction before publishing.");
      }
      else {
        handleApiError(response);
      }
    });
  });
  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);
}

function refreshCorrection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseCorrection(collectionId, data, templateData, field, idField);
}

function initialiseCorrection(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    // ORIGINAL TIME PICKER CODE
    // var dateTmpCorr = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    // $('#correction-date_' + index).val(dateTmpCorr).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
    //  data[field][index].updateDate = new Date($('#correction-date_' + index).datepicker('getDate')).toISOString();
    //  templateData[field][index].updateDate = new Date($('#correction-date_' + index).datepicker('getDate')).toISOString();
    //  saveCorrection(collectionId, data.uri, data, templateData, field, idField);
    // });


    var monthName = new Array();
    monthName[0] = "January";
    monthName[1] = "February";
    monthName[2] = "March";
    monthName[3] = "April";
    monthName[4] = "May";
    monthName[5] = "June";
    monthName[6] = "July";
    monthName[7] = "August";
    monthName[8] = "September";
    monthName[9] = "October";
    monthName[10] = "November";
    monthName[11] = "December";
    //var n = monthName[theDateTime.getMonth()];

    theDateTime = new Date(dateTmp);
    theYear = theDateTime.getFullYear();
    theMonth = monthName[theDateTime.getMonth()];
    theDay = addLeadingZero(theDateTime.getDate());
    theHours = addLeadingZero(theDateTime.getHours());
    theMinutes = theDateTime.getMinutes();
    //console.log(theHours +':'+ theMinutes);

    var dateTimeInputString = theDay + ' ' + theMonth + ' ' + theYear + ' ' + theHours +':' + theMinutes;

    function addLeadingZero(number){
      var number = '0' + number;
      number = number.slice(-2);
      return number;
    }

    $('#correction-date_' + index).val(dateTimeInputString).datetimepicker({
        dateFormat: 'dd MM yy',
        controlType: 'select',
        oneLine: true,
        timeFormat: 'HH:mm'
      });
    //$('#correction-date_' + index).datetimepicker('setDate', new Date(dateTmp));



    ///////////look at me

    $('body').on('click', '#done-button', function () {
      data[field][index].updateDate = new Date($('#correction-date_' + index).datetimepicker('getDate')).toISOString();
      templateData[field][index].updateDate = new Date($('#correction-date_' + index).datetimepicker('getDate')).toISOString();
      saveCorrection(collectionId, data.uri, data, templateData, field, idField);
    });



    $('#' + idField + '-edit_' + index).click(function () {
      var markdown = $('#' + idField + '-markdown_' + index).val();
      var editedSectionValue = {title: 'Correction notice', markdown: markdown};
      var saveContent = function (updatedContent) {
        data[field][index].correctionNotice = updatedContent;
        templateData[field][index].correctionNotice = updatedContent;
        saveCorrection(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });
    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      swal ({
        title: "Warning",
        text: "Are you sure you want to delete this correction?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result){
        if (result === true) {
          deleteUnpublishedVersion(collectionId, data[field][index].uri, function () {
            var position = $(".workspace-edit").scrollTop();
            Ermintrude.globalVars.pagePos = position;
            $(this).parent().remove();
            data[field].splice(index, 1);
            templateData[field].splice(index, 1);
            saveCorrection(collectionId, data.uri, data, templateData, field, idField);
            swal({
              title: "Deleted",
              text: "This correction has been deleted",
              type: "success",
              timer: 2000
            });
          }, function (response) {
            if (response.status === 400) {
              sweetAlert("You cannot delete a correction that has been published.");
            }
            else {
              handleApiError(response);
            }
          });
        }
      });
    });
  });
}

function saveCorrection(collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    function () {
      Ermintrude.Editor.isDirty = false;
      refreshCorrection(collectionId, data, templateData, field, idField);
      refreshPreview(data.uri);
    },
    function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

/**
 * Manages links
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editLink (collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorLinks(dataTemplate);
  $('#'+ idField).replaceWith(html);

  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-edit_'+index).click(function() {
      var editedSectionValue = {
        "title": $('#' + idField +'-uri_' + index).val(),
        "markdown": $('#' + idField + '-markdown_' + index).val()
      };

      var saveContent = function(updatedContent) {
        data[field][index].title = updatedContent;                         //markdown
        data[field][index].uri = $('#' + idField +'-uri_' + index).val();
        saveLink (collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      swal ({
        title: "Warning",
        text: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result) {
        if (result === true) {
          var position = $(".workspace-edit").scrollTop();
          Ermintrude.globalVars.pagePos = position + 300;
          $(this).parent().remove();
          data[field].splice(index, 1);
          saveLink(collectionId, data.uri, data, field, idField);
          refreshPreview(data.uri);
          swal({
            title: "Deleted",
            text: "This link has been deleted",
            type: "success",
            timer: 2000
          });
        }
      });
    });
  });

  //Add
  $('#add-' + idField).click(function () {
    var position = $(".workspace-edit").scrollTop();
    Ermintrude.globalVars.pagePos = position + 300;

      //TODO This function breaking when adding related link
      console.log(data);
      console.log(data[field]);

    data[field].push({uri:"", title:""});
    saveLink (collectionId, data.uri, data, field, idField);
  });

  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }
  sortable();
}

function saveLink (collectionId, path, data, field, idField) {
    putContent(collectionId, path, JSON.stringify(data),
        success = function (response) {
            Ermintrude.Editor.isDirty = false;
            editLink (collectionId, data, field, idField);
        },
        error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}/**
 * Manages markdown content
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editMarkdown (collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorContent(dataTemplate);
  $('#'+ idField).replaceWith(html);
  initialiseMarkdown(collectionId, data, field, idField)
}

function refreshMarkdown (collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorContent(dataTemplate);
  $('#sortable-'+ idField).replaceWith($(html).find('#sortable-'+ idField));
  initialiseMarkdown(collectionId, data, field, idField)
}

function initialiseMarkdown(collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-edit_'+index).click(function() {
      var editedSectionValue = {
        "title": $('#' + idField +'-title_' + index).val(),
        "markdown": $('#' + idField + '-markdown_' + index).val()
      };

      var saveContent = function(updatedContent) {
        data[field][index].markdown = updatedContent;
        data[field][index].title = $('#' + idField +'-title_' + index).val();
        saveMarkdown (collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      swal ({
        title: "Warning",
        text: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result) {
        if (result === true) {
          var position = $(".workspace-edit").scrollTop();
          Ermintrude.globalVars.pagePos = position + 300;
          $(this).parent().remove();
          data[field].splice(index, 1);
          saveMarkdown(collectionId, data.uri, data, field, idField);
          refreshPreview(data.uri);
          console.log(idField);
          swal({
            title: "Deleted",
            text: "This " + idField + " has been deleted",
            type: "success",
            timer: 2000
          });
        }
      });
    });
  });

  //Add
  $('#add-' + idField).off().one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Ermintrude.globalVars.pagePos = position + 300;
    data[field].push({markdown:"", title:""});
    saveMarkdown(collectionId, data.uri, data, field, idField);
  });

  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }
  sortable();
}

function saveMarkdown (collectionId, path, data, field, idField) {
    putContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Ermintrude.Editor.isDirty = false;
            refreshMarkdown (collectionId, data, field, idField);
            refreshChartList(collectionId, data);
            refreshTablesList(collectionId, data);
        },
        error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}

/**
 * Manages markdown content (saves an object)
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param title - header to appear in the editor
 */

function editMarkdownOneObject (collectionId, data, field, title) {
  var list = data[field];

  var dataTemplate;
  if (title) {
    dataTemplate = {list: list, header: title};
  } else {
    dataTemplate = {list: list, header: 'Content'};
  }

  var html = templates.editorContentOne(dataTemplate);
  $('#one').replaceWith(html);
  // Load
  $('#one-edit').click(function() {
    var markdown = $('#one-markdown').val();
    var editedSectionValue = {title: 'Content', markdown: markdown};
    var saveContent = function(updatedContent) {
      data[field].markdown = updatedContent;
      saveMarkdownOne (collectionId, data.uri, data, field);
    };

    loadMarkdownEditor(editedSectionValue, saveContent, data);
  });

  // Delete
  $('#one-delete').click(function() {
    swal ({
      title: "Warning",
      text: "Are you sure you want to delete?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false
    }, function(result) {
      if (result === true) {
        $(this).parent().remove();
        data[field] = {};
        saveMarkdownOne(collectionId, data.uri, data, field);
        swal({
          title: "Deleted",
          text: "This " + idField + " has been deleted",
          type: "success",
          timer: 2000
        });
      }
    });
  });
}

function saveMarkdownOne (collectionId, path, data, field) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function () {
      Ermintrude.Editor.isDirty = false;
      editMarkdownOneObject (collectionId, data, field);
    },
    error = function (response) {
      if (response.status === 400) {
          sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

/**
 * Manages markdown content (saves an array)
 * @param collectionId
 * @param data
 * @param field - JSON data key
 */

function editMarkdownWithNoTitle (collectionId, data, field, idField) {
  var list = data[field];

  var dataTemplate;
  if (idField === 'note') {
    dataTemplate = {list: list, idField: idField, header: 'Notes'};
  } else if (idField === 'prerelease') {
    dataTemplate = {list: list, idField: idField, header: 'Pre-release access'};
  } else {
    dataTemplate = {list: list, idField: idField, header: 'Content'};
  }

  var html = templates.editorContentNoTitle(dataTemplate);
  $('#' + idField).replaceWith(html);
  // Load
  $('#content-edit').click(function() {
    var markdown = $('#content-markdown').val();
    var editedSectionValue = {title: 'Content', markdown: markdown};
    var saveContent = function(updatedContent) {
      data[field] = [updatedContent];
      saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
    };
    loadMarkdownEditor(editedSectionValue, saveContent, data);
  });

  // Delete
  $('#content-delete').click(function() {
    swal ({
      title: "Warning",
      text: "Are you sure you want to delete?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false
    }, function(result){
      if (result === true) {
        $(this).parent().remove();
        data[field] = [];
        saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
        swal({
          title: "Deleted",
          text: "This " + idField + " has been deleted",
          type: "success",
          timer: 2000
        });
      }
    });
  });

}

function saveMarkdownNoTitle (collectionId, path, data, field, idField) {
    putContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Ermintrude.Editor.isDirty = false;
            editMarkdownWithNoTitle(collectionId, data, field, idField);
        },
        error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}

/**
 * Manages related data
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editRelated(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = createRelatedTemplate(idField, list);
  var html = templates.editorRelated(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseRelated(collectionId, data, templateData, field, idField);
  resolveTitle(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);
}

function refreshRelated(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = createRelatedTemplate(idField, list);
  var html = templates.editorRelated(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseRelated(collectionId, data, templateData, field, idField);
}

function createRelatedTemplate(idField, list) {
  var dataTemplate;
  if (idField === 'article') {
    dataTemplate = {list: list, idField: idField, idPlural: 'articles (DO NOT USE. TO BE DELETED)'};
  } else if (idField === 'bulletin') {
    dataTemplate = {list: list, idField: idField, idPlural: 'bulletins (DO NOT USE. TO BE DELETED)'};
  } else if (idField === 'dataset') {
    dataTemplate = {list: list, idField: idField, idPlural: 'datasets'};
  } else if (idField === 'document') {
    dataTemplate = {list: list, idField: idField, idPlural: 'bulletins | articles | compendia'};
  } else if (idField === 'qmi') {
    dataTemplate = {list: list, idField: idField, idPlural: 'QMIs'};
  } else if (idField === 'methodology') {
    dataTemplate = {list: list, idField: idField, idPlural: 'methodologies'};
  } else {
    dataTemplate = {list: list, idField: idField};
  }
  return dataTemplate;
}

function initialiseRelated(collectionId, data, templateData, field, idField) {
  // Load
  if (!data[field] || data[field].length === 0) {
    editRelated['lastIndex' + field] = 0;
  } else {
    $(data[field]).each(function (index) {
      editRelated['lastIndex' + field] = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        swal({
          title: "Warning",
          text: "Are you sure you want to delete this link?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function(result) {
          if (result === true) {
            swal({
              title: "Deleted",
              text: "This " + idField + " has been deleted",
              type: "success",
              timer: 2000
            });
            var position = $(".workspace-edit").scrollTop();
            Ermintrude.globalVars.pagePos = position;
            $(this).parent().remove();
            data[field].splice(index, 1);
            templateData[field].splice(index, 1);
            putContent(collectionId, data.uri, JSON.stringify(data),
              success = function () {
                Ermintrude.Editor.isDirty = false;
                refreshPreview(data.uri);
                refreshRelated(collectionId, data, templateData, field, idField);
              },
              error = function (response) {
                if (response.status === 400) {
                    sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                  handleApiError(response);
                }
              }
            );
          }
        });
      });
    });
  }

  //Add
  $('#add-' + idField).off().one('click', function () {
    var hasLatest = {hasLatest : false}; //Set to true if 'latest' checkbox should show
    var latestCheck; //Populated with true/false later to check state of checkbox
    var position = $(".workspace-edit").scrollTop();

    if (idField === 'article' || idField === 'bulletin' || idField === 'articles' || idField === 'bulletins' || idField === 'document' || idField === 'highlights') {
    hasLatest = {hasLatest : true};
  }

    Ermintrude.globalVars.pagePos = position;
    var modal = templates.relatedModal(hasLatest);
    $('.workspace-menu').append(modal);

    //Modal click events
    $('.btn-uri-cancel').off().one('click', function () {
      createWorkspace(data.uri, collectionId, 'edit');
    });

    $('.btn-uri-get').off().one('click', function () {
      var pastedUrl = $('#uri-input').val();
      var dataUrl = checkPathParsed(pastedUrl);
      var latestCheck = $('input[id="latest"]').prop('checked');
      getPage(collectionId, data, templateData, field, idField, latestCheck, dataUrl);
      $('.modal').remove();
    });

    $('.btn-uri-browse').off().one('click', function () {
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.removeEventListener('click', Ermintrude.Handler, true);
      createWorkspace(data.uri, collectionId, '', true);
      $('.modal').remove();

      //Disable the editor
      $('body').append(
          "<div class='col col--5 panel disabled'></div>"
      );

      //Add buttons to iframe window
      var iframeNav = templates.iframeNav(hasLatest);
      $(iframeNav).hide().appendTo('.browser').fadeIn(600);

      //Take iframe window to homepage/root
       $('#iframe').attr('src', '/');

      $('.btn-browse-cancel').off().one('click', function () {
        createWorkspace(data.uri, collectionId, 'edit');
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      //Remove added markup if user navigates away from editor screen
      $('a:not(.btn-browse-get)').click(function (){
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      $('.btn-browse-get').off().one('click', function () {
        var dataUrl = getPathNameTrimLast();
        var latestCheck = $('input[id="latest"]').prop('checked');
        $('.iframe-nav').remove();
        $('.disabled').remove();
        getPage(collectionId, data, templateData, field, idField, latestCheck, dataUrl);
      });
    });
  });

  // Make sections sortable
  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }
  sortable();
}

function getPage(collectionId, data, templateData, field, idField, latestCheck, dataUrl) {

  var dataUrlData = dataUrl + "/data";
  var latestUrl;
  if (latestCheck) {
    var tempUrl = dataUrl.split('/');
    tempUrl.pop();
    tempUrl.push('latest');
    latestUrl = tempUrl.join('/');
  } else {
    latestUrl = dataUrl;
  }


  $.ajax({
    url: dataUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (result) {
      if ((field === 'relatedBulletins' || field === 'statsBulletins') && result.type === 'bulletin') {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }
      else if ((field === 'relatedDatasets' || field === 'datasets') && (result.type === 'dataset' || result.type === 'timeseries_dataset')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }
      else if (field === 'relatedArticles' && (result.type === 'article' || result.type === 'article_download' || result.type === 'compendium_landing_page')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'relatedDocuments') && (result.type === 'article' || result.type === 'article_download' || result.type === 'bulletin' || result.type === 'compendium_landing_page')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'relatedDatasets' || field === 'datasets') && (result.type === 'dataset_landing_page' || result.type === 'compendium_data')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'items') && (result.type === 'timeseries')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'relatedData') && (result.type === 'dataset_landing_page' || result.type === 'timeseries' || result.type === 'compendium_data')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if (field === 'relatedMethodology' && (result.type === 'static_qmi')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if (field === 'relatedMethodologyArticle' && (result.type === 'static_methodology' || result.type === 'static_methodology_download')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if (field === 'highlightedLinks' && (result.type === 'bulletin')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else {
        sweetAlert("This is not a valid document");
        createWorkspace(data.uri, collectionId, 'edit');
        return;
      }

      data[field].push({uri: latestUrl});
      templateData[field].push({uri: latestUrl});
      saveRelated(collectionId, data.uri, data, templateData, field, idField);

    },
    error: function () {
      console.log('No page data returned');
    }
  });
}

function resolveTitle(collectionId, data, templateData, field, idField) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var latest = eachUri.match(/\/latest\/?$/) ? true : false;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      success = function (response) {
        templateData[field][index].description.title = latest ? '(Latest) ' + response.title : response.title;
        if (response.edition) {
          templateData[field][index].description.edition = response.edition;
        }
        dfd.resolve();
      },
      error = function () {
        sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    refreshRelated(collectionId, data, templateData, field, idField);
  });
}
/**
 * Manages topics to appear in list pages
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editTopics(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorTopics(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseTopics(collectionId, data, templateData, field, idField);
  resolveTopicTitle(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Ermintrude.globalVars.pagePos);
}

function refreshTopics(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorTopics(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseTopics(collectionId, data, templateData, field, idField);
}

function initialiseTopics(collectionId, data, templateData, field, idField) {
  // Load
  if (!data[field] || data[field].length === 0) {
    editTopics['lastIndex' + field] = 0;
  } else {
    $(data[field]).each(function (index) {
      editTopics['lastIndex' + field] = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        swal ({
          title: "Warning",
          text: "Are you sure you want to delete this link?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function(result){
          if (result === true) {
            swal({
              title: "Deleted",
              text: "This " + idField + " has been deleted",
              type: "success",
              timer: 2000
            });
            var position = $(".workspace-edit").scrollTop();
            Ermintrude.globalVars.pagePos = position;
            $(this).parent().remove();
            data[field].splice(index, 1);
            templateData[field].splice(index, 1);
            putContent(collectionId, data.uri, JSON.stringify(data),
              success = function () {
                Ermintrude.Editor.isDirty = false;
                refreshPreview(data.uri);
                refreshTopics(collectionId, data, templateData, field, idField)
              },
              error = function (response) {
                if (response.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                  handleApiError(response);
                }
              }
            );
          }
        });
      });
    });
  }

  //Add
  $('#add-' + idField).off().one('click', function () {
    var hasLatest; //Latest markup doesn't need to show in handlebars template
    var position = $(".workspace-edit").scrollTop();

    Ermintrude.globalVars.pagePos = position;
    var modal = templates.relatedModal(hasLatest);
    $('.workspace-menu').append(modal);

    //Modal click events
    $('.btn-uri-cancel').off().one('click', function () {
      createWorkspace(data.uri, collectionId, 'edit');
    });

    $('.btn-uri-get').off().one('click', function () {
      var pastedUrl = $('#uri-input').val();
      var dataUrl = checkPathParsed(pastedUrl);
      getTopic(collectionId, data, templateData, field, idField, dataUrl);
      $('.modal').remove();
    });

    $('.btn-uri-browse').off().one('click', function () {
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.removeEventListener('click', Ermintrude.Handler, true);
      createWorkspace(data.uri, collectionId, '', true);
      $('.modal').remove();

      //Disable the editor
      $('body').append(
          "<div class='col col--5 panel disabled'></div>"
      );

      //Add buttons to iframe window
      var iframeNav = templates.iframeNav(hasLatest);
      $(iframeNav).hide().appendTo('.browser').fadeIn(500);

      $('.btn-browse-cancel').off().one('click', function () {
        createWorkspace(data.uri, collectionId, 'edit');
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      //Remove added markup if user navigates away from editor screen
      $('a:not(.btn-browse-get)').click(function (){
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      $('.btn-browse-get').off().one('click', function () {
        var dataUrl = getPathNameTrimLast();
        $('.iframe-nav').remove();
        $('.disabled').remove();
        getTopic(collectionId, data, templateData, field, idField, dataUrl);
      });
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }
  sortable();

}

function getTopic(collectionId, data, templateData, field, idField, dataUrl) {
  var dataUrlData = dataUrl + "/data";

    $.ajax({
      url: dataUrlData,
      dataType: 'json',
      crossDomain: true,
      success: function (result) {
        if (result.type === 'product_page') {
          if (!data[field]) {
            data[field] = [];
            templateData[field] = [];
          }
        }

        else {
          sweetAlert("This is not a valid document");
          createWorkspace(data.uri, collectionId, 'edit');
          return;
        }

        data[field].push({uri: result.uri});
        templateData[field].push({uri: result.uri});
        saveTopics(collectionId, data.uri, data, templateData, field, idField);

      },
      error: function () {
        console.log('No page data returned');
      }
    });
}

function resolveTopicTitle(collectionId, data, templateData, field, idField) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      success = function (response) {
        templateData[field][index].description.title = response.title;
        dfd.resolve();
      },
      error = function () {
        sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    refreshTopics(collectionId, data, templateData, field, idField);
  });
}

function saveTopics (collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function (response) {
      console.log("Updating completed " + response);
      Ermintrude.Editor.isDirty = false;
      resolveTopicTitle(collectionId, data, templateData, field, idField);
      refreshPreview(path);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.addEventListener('click', Ermintrude.Handler, true);
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
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
/**
 * Gives the last position when on a page
 */

function getLastPosition () {
  var position = Ermintrude.globalVars.pagePos;
  if (position > 0) {
    setTimeout(function() {
      $(".workspace-edit").scrollTop(position + 100);
    }, 200);
  }
}

/**
 * Gets the JSON file for the page
 * @param collectionId
 * @param path
 * @param success
 * @param error
 * @returns {*}
 */

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
function getPageDataDescription(collectionId, path, success, error) {
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + path + '&description',
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

function getPageDataTitle(collectionId, path, success, error) {
  return $.ajax({
    url: "/zebedee/data/" + collectionId + "?uri=" + path + '&title',
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

function getPageResource(collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  return $.ajax({
    url: "/zebedee/resource/" + collectionId + "?uri=" + safePath,
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

function getParentPage (url) {
  var checkedUrl = checkPathSlashes(url);
  var contentUrlTmp = checkedUrl.split('/');
  contentUrlTmp.splice(-1, 1);
  var contentUrl = contentUrlTmp.join('/');
  return contentUrl;
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
 * Http post to the zebedee API to get a list of users.
 * @param success
 * @param error
 * @param userId
 * @returns {*}
 */
function getUsers(success, error, userId) {

  var url = "/zebedee/users";

  if(userId) {
    url += '?email=' + userId;
  }

  return $.ajax({
    url: url,
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
function initialiseLastNoteMarkdown(collectionId, data, field, field2) {
  // Load
  var lastIndex = data[field].length - 1;
  var editedSectionValue = '';
  var saveContent = function (updatedContent) {
    data[field][lastIndex][field2] = updatedContent;
    putContent(collectionId, data.uri, JSON.stringify(data),
      success = function () {
        Ermintrude.Editor.isDirty = false;
        loadPageDataIntoEditor(data.uri, collectionId);
        refreshPreview(data.uri);
      },
      error = function (response) {
        if (response.status === 400) {
          sweetAlert("Cannot edit this page", "It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  };
  loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
}
function loadBrowseScreen(collectionId, click) {

  return $.ajax({
    url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      var browserContent = $('#iframe')[0].contentWindow;
      var baseURL = Ermintrude.tredegarBaseUrl;
      var html = templates.workBrowse(response);
      $('.workspace-menu').html(html);
      $('.workspace-browse').css("overflow", "scroll");

      //page-list
      $('.page-item').click(function () {

        var uri = $(this).closest('li').attr('data-url');

        if(uri) {
          var newURL = baseURL + uri;

          $('.page-list li').removeClass('selected');
          $(this).parent('li').addClass('selected');

          $('.page-options').hide();
          $(this).next('.page-options').show();

          //change iframe location
          browserContent.location.href = newURL;
          Ermintrude.globalVars.pagePath = uri;
          $('.browser-location').val(newURL);
        }

        //page-list-tree
        $('.tree-nav-holder ul').removeClass('active');
        $(this).parents('ul').addClass('active');
        $(this).closest('li').children('ul').addClass('active');
        
        $(this).closest('li').find('.page-item--directory').removeClass('page-item--directory--selected');
        if ($(this).hasClass('page-item--directory')) {
          $('.page-item--directory').removeClass('page-item--directory--selected');
          $(this).addClass('page-item--directory--selected');
        }
      });

      if (click) {
        var url = getPathName();
        if (url === "/blank") {
          setTimeout(treeNodeSelect('/'), 500);
        } else {
          treeNodeSelect(url);
        }
      } else {
        treeNodeSelect('/');
      }

    },
    error: function (response) {
      handleApiError(response);
    }
  });
}

function loadChartBuilder(pageData, onSave, chart) {
  var chart = chart;
  var pageUrl = pageData.uri;
  var html = templates.chartBuilder(chart);
  $('body').append(html);
  $('.chart-builder').css("display", "block");

  if (chart) {
    $('#chart-data').val(toTsv(chart));
    refreshExtraOptions();
  }

  renderText();
  renderChart();

  function refreshExtraOptions() {
    var template = getExtraOptionsTemplate(chart.chartType);
    if (template) {
      var html = template(chart);
      $('#extras').html(html);
    } else {
      $('#extras').empty();
    }
  }

  function getExtraOptionsTemplate(chartType) {
    switch (chartType) {
      case 'barline':
      case 'rotated-barline':
        return templates.chartEditBarlineExtras;
      case 'dual-axis':
        return templates.chartEditDualAxisExtras;
      case 'line':
        return templates.chartEditLineChartExtras;
      default:
        return;
    }
  }

  $('.refresh-chart').on('input', function () {
    chart = buildChartObject();
    refreshExtraOptions();
    renderChart();
  });

  $('.refresh-chart').on('change', ':checkbox', function () {
    chart = buildChartObject();
    refreshExtraOptions();
    renderChart();
  });


  $('.refresh-text').on('input', function () {
    renderText();
  });

  $('.btn-chart-builder-cancel').on('click', function () {
    $('.chart-builder').stop().fadeOut(200).remove();
  });

  $('.btn-chart-builder-create').on('click', function () {

    chart = buildChartObject();

    var jsonPath = chart.uri + ".json";
    $.ajax({
      url: "/zebedee/content/" + Ermintrude.collection.id + "?uri=" + jsonPath,
      type: 'POST',
      data: JSON.stringify(chart),
      processData: false,
      contentType: 'application/json',
      success: function (res) {

        if (!pageData.charts) {
          pageData.charts = []
        }

        existingChart = _.find(pageData.charts, function (existingChart) {
          return existingChart.filename === chart.filename
        });

        if (existingChart) {
          existingChart.title = chart.title;
        } else {
          pageData.charts.push({
            title: chart.title,
            filename: chart.filename,
            uri: chart.uri
          });
        }

        if (onSave) {
          onSave(chart.filename, '<ons-chart path="' + chart.uri + '" />');
        }
        $('.chart-builder').stop().fadeOut(200).remove();
      }
    });
  });

  setShortcuts('#chart-title');
  setShortcuts('#chart-subtitle');
  setShortcuts('#chart-data');
  setShortcuts('#chart-x-axis-label');
  setShortcuts('#chart-notes');

  //Renders html outside actual chart area (title, subtitle, source, notes etc.)
  function renderText() {
    var title = doSuperscriptAndSubscript($('#chart-title').val());
    var subtitle = doSuperscriptAndSubscript($('#chart-subtitle').val());
    $('#chart-source-preview').html($('#chart-source').val());
    $('#chart-title-preview').html(title);
    $('#chart-subtitle-preview').html(subtitle);
    $('#chart-notes-preview').html(toMarkdown($('#chart-notes').val()));
  }

  function toMarkdown(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.getSanitizingConverter();
      Markdown.Extra.init(converter, {
        extensions: "all"
      });
      return converter.makeHtml(text)
    }
    return '';
  }

  function isMarkdownAvailable() {
    return typeof Markdown !== 'undefined'
  }

  function doSuperscriptAndSubscript(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.Converter();
      return converter._DoSubscript(converter._DoSuperscript(text));
    }
    return text;

  }

  // Builds, parses, and renders our chart in the chart editor
  function renderChart() {
    chart = buildChartObject();
    var preview = $('#chart');
    var chartHeight = preview.width() * chart.aspectRatio;
    var chartWidth = preview.width();
    renderChartObject('chart', chart, chartHeight, chartWidth);
  }

  function buildChartObject() {
    var json = $('#chart-data').val();
    if (!chart) {
      chart = {};
    }

    chart.type = "chart";
    chart.title = $('#chart-title').val();
    chart.filename = chart.filename ? chart.filename : StringUtils.randomId(); //  chart.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if (Ermintrude.globalVars.welsh) {
      if (pageUrl.match(/\/cy\/?$/)) {
        chart.uri = pageUrl + "/" + chart.filename;
      } else {
        chart.uri = pageUrl + "/cy/" + chart.filename;
      }
    } else {
      chart.uri = pageUrl + "/" + chart.filename;
    }
    chart.subtitle = $('#chart-subtitle').val();
    chart.unit = $('#chart-unit').val();
    chart.source = $('#chart-source').val();

    chart.decimalPlaces = $('#chart-decimal-places').val();
    chart.labelInterval = $('#chart-label-interval').val();

    chart.notes = $('#chart-notes').val();
    chart.altText = $('#chart-alt-text').val();
    chart.xAxisLabel = $('#chart-x-axis-label').val();
    chart.startFromZero = $('#start-from-zero').prop('checked');

    if (chart.title === '') {
      chart.title = '[Title]'
    }

    chart.data = tsvJSON(json);
    chart.headers = tsvJSONHeaders(json);
    chart.series = tsvJSONColNames(json);
    chart.categories = tsvJSONRowNames(json);

    chart.aspectRatio = $('#aspect-ratio').val();

    if (isShowBarLineSelection(chart.chartType)) {
      var types = {};
      var groups = [];
      var group = [];
      var seriesData = chart.series;
      $.each(seriesData, function (index) {
        types[seriesData[index]] = $('#types_' + index).val() || 'bar';
      });
      (function () {
        $('#extras input:checkbox:checked').each(function () {
          group.push($(this).val());
        });
        groups.push(group);
        return groups;
      })();
      chart.chartTypes = types;
      chart.groups = groups;
    }

    chart.chartType = $('#chart-type').val();

    //console.log(chart);
    parseChartObject(chart);

    chart.files = [];
    //chart.files.push({ type:'download-png', filename:chart.filename + '-download.png' });
    //chart.files.push({ type:'png', filename:chart.filename + '.png' });

    return chart;
  }

  //Determines if selected chart type is barline or rotated bar line
  function isShowBarLineSelection(chartType) {
    return (chartType === 'barline' || chartType === "rotated-barline" || chartType === "dual-axis");
  }

  function parseChartObject(chart) {

    // Determine if we have a time series
    var timeSeries = axisAsTimeSeries(chart.categories);
    if (timeSeries && timeSeries.length > 0) {
      chart.isTimeSeries = true;

      // We create data specific to time
      timeData = [];
      _.each(timeSeries, function (time) {
        var item = chart.data[time['row']];
        item.date = time['date'];
        item.label = time['label'];
        timeData.push(item);
      });

      chart.timeSeries = timeData;
    }
  }

  //// Converts chart to highcharts configuration by posting Babbage /chartconfig endpoint and to the rendering with fetched configuration
  function renderChartObject(bindTag, chart, chartHeight, chartWidth) {

    var jqxhr = $.post("/chartconfig", {
        data: JSON.stringify(chart),
        width: chartWidth
      },
      function () {
        var chartConfig = window["chart-" + chart.filename];
        console.debug("Refreshing the chart, config:", chartConfig);
        if (chartConfig) {
          chartConfig.chart.renderTo = "chart";
          new Highcharts.Chart(chartConfig);
          delete window["chart-" + chart.filename]; //clear data from window object after rendering
        }
      }, "script")
      .fail(function (data, err) {
        console.error(err);
        console.log("Failed reading chart configuration from server", chart);
        $("#chart").empty();
      });
  }

  // Data load from text box functions
  function tsvJSON(input) {
    var lines = input.split("\n");
    var result = [];
    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",").join("").split("\t");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result; //JSON
  }

  function toTsv(data) {
    var output = "";

    for (var i = 0; i < data.headers.length; i++) {
      if (i === data.headers.length - 1) {
        output += data.headers[i];
      } else {
        output += data.headers[i] + "\t";
      }
    }

    for (var i = 0; i < data.categories.length; i++) {
      output += "\n" + toTsvLine(data.data[i], data.headers);
    }

    return output;
  }

  function toTsvLine(data, headers) {

    var output = "";

    for (var i = 0; i < headers.length; i++) {
      if (i === headers.length - 1) {
        output += data[headers[i]];
      } else {
        output += data[headers[i]] + "\t";
      }
    }
    return output;
  }

  function tsvJSONRowNames(input) {
    var lines = input.split("\n");
    var result = [];

    for (var i = 1; i < lines.length; i++) {
      var currentline = lines[i].split("\t");
      result.push(currentline[0]);
    }
    return result
  }

  function tsvJSONColNames(input) {
    var lines = input.split("\n");
    var headers = lines[0].split("\t");
    headers.shift();
    return headers;
  }

  function tsvJSONHeaders(input) {
    var lines = input.split("\n");
    var headers = lines[0].split("\t");
    return headers;
  }

  function exportToSVG(sourceSelector) {
    var svgContainer = $(sourceSelector);
    var svg = svgContainer.find('svg');

    var styleContent = "\n";
    for (var i = 0; i < document.styleSheets.length; i++) {
      str = document.styleSheets[i].href.split("/");
      if (str[str.length - 1] == "c3.css") {
        var rules = document.styleSheets[i].rules;
        for (var j = 0; j < rules.length; j++) {
          styleContent += (rules[j].cssText + "\n");
        }
        break;
      }
    }

    //var style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    //$(style).textContent += "\n<![CDATA[\n" + styleContent + "\n]]>\n";
    //
    //svg.prepend(style);
    //svg[0].getElementsByTagName("defs")[0].appendChild(style);


    svg.prepend("\n<style type='text/css'></style>");
    svg.find("style").textContent += "\n<![CDATA[" + styleContent + "]]>\n";


    //if ($('#chart-type').val() === 'line') {
    //  $('.c3 line').css("fill", "none");
    //  console.log($('.c3 line'))
    //}

    var source = (new XMLSerializer).serializeToString(svg[0]);
    //console.log(source);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    //add padding
    source = source.replace(/style="overflow: hidden;"/, 'style="overflow: hidden; padding: 50px;"');

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    return source;
  }


  // Steps through time series points
  function axisAsTimeSeries(axis) {
    var result = [];
    var rowNumber = 0;

    _.each(axis, function (tryTimeString) {
      var time = convertTimeString(tryTimeString);
      if (time) {
        time.row = rowNumber;
        rowNumber = rowNumber + 1;

        result.push(time);
      } else {
        return null;
      }
    });
    return result;
  }

  function convertTimeString(timeString) {
    // First time around parse the time string according to rules from regular timeseries
    var result = {};
    result.label = timeString;

    // Format time string
    // Check for strings that will turn themselves into a strange format
    twoDigitYearEnd = timeString.match(/\W\d\d$/);
    if (twoDigitYearEnd !== null) {
      year = parseInt(timeString.substr(timeString.length - 2, timeString.length));
      prefix = timeString.substr(0, timeString.length - 2).trim();

      if (year >= 40) {
        timeString = prefix + " 19" + year;
      } else {
        timeString = prefix + " 20" + year;
      }
    }

    // Check for quarters
    quarter = timeString.match(/Q\d/);
    year = timeString.match(/\d\d\d\d/);
    if ((quarter !== null) && (year !== null)) {
      months = ["February ", "May ", "August ", "November "];
      quarterMid = parseInt(quarter[0][1]);
      timeString = months[quarterMid - 1] + year[0];
    }

    // We are going with all times in a common format
    var date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      result.date = date;
      result.period = 'other';
      return result;
    }

    return (null);
  }

  function generatePng(sourceSelector, canvasSelector, fileSuffix) {

    var preview = $(sourceSelector);
    var chartHeight = preview.height();
    var chartWidth = preview.width();

    var content = exportToSVG(sourceSelector).trim();

    var $canvas = $(canvasSelector);
    $canvas.width(chartWidth);
    $canvas.height(chartHeight);

    var canvas = $canvas.get(0);

    // Draw svg on canvas
    canvg(canvas, content);

    // get data url from canvas.
    var dataUrl = canvas.toDataURL('image/png');
    var pngData = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
    //console.log(dataUrl);

    var raw = window.atob(pngData);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }

    var suffix = "";

    if (fileSuffix) {
      suffix = fileSuffix
    }

    var pngUri = pageUrl + "/" + chart.filename + suffix + ".png";
    $.ajax({
      url: "/zebedee/content/" + Ermintrude.collection.id + "?uri=" + pngUri,
      type: 'POST',
      data: new Blob([array], {
        type: 'image/png'
      }),
      contentType: "image/png",
      processData: false,
      success: function (res) {
        //console.log('png uploaded!');
      }
    });
  }
}// fully load the charts list from scratch
function loadChartsList(collectionId, data) {
  var html = templates.workEditCharts(data);
  $('#charts').replaceWith(html);
  initialiseChartList(collectionId, data);
}

// refresh only the list of charts - leaving the container div that accordion works from.
function refreshChartList(collectionId, data) {
  var html = templates.workEditCharts(data);
  $('#chart-list').replaceWith($(html).find('#chart-list'));
  initialiseChartList(collectionId, data);
}

// do all the wiring up of buttons etc once the template has been rendered.
function initialiseChartList(collectionId, data) {

  $(data.charts).each(function (index, chart) {

    var basePath = data.uri;
    var chartPath = basePath + '/' + chart.filename;
    var chartJson = chartPath;

    var client = new ZeroClipboard($("#chart-copy_" + index));
    client.on("copy", function (event) {
      var clipboard = event.clipboardData;
      clipboard.setData("text/plain", $('#chart-to-be-copied_' + index).text());
    });

    $("#chart-edit_" + index).click(function () {
      getPageData(collectionId, chartJson,
        onSuccess = function (chartData) {

          loadChartBuilder(data, function () {
            refreshPreview();

            putContent(collectionId, basePath, JSON.stringify(data),
              success = function () {
                Ermintrude.Editor.isDirty = false;
                refreshPreview();
                refreshChartList(collectionId, data);
              },
              error = function (response) {
                handleApiError(response);
              }
            );
          }, chartData);
        })
    });

    $("#chart-delete_" + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this chart?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          $(this).parent().remove();
          data.charts = _(data.charts).filter(function (item) {
            return item.filename !== chart.filename
          });
          putContent(collectionId, basePath, JSON.stringify(data),
            success = function () {
              deleteContent(collectionId, chartJson + '.json', onSuccess = function () {
              }, onError = function () {
              });
              Ermintrude.Editor.isDirty = false;
              swal({
                title: "Deleted",
                text: "This chart has been deleted",
                type: "success",
                timer: 2000
              });
              refreshChartList(collectionId, data);
            },
            error = function (response) {
              handleApiError(response);
            }
          );
        }
      });
    });
  });
  // Make sections sortable
  function sortable() {
    $('#sortable-chart').sortable();
  }

  sortable();
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}


function loadCreateScreen(parentUrl, collectionId, type) {
  var html = templates.workCreate;
  $('.workspace-menu').html(html);
  loadCreator(parentUrl, collectionId, type);
}
function loadCreator (parentUrl, collectionId, type) {
  var pageType, releaseDate;

  getCollection(collectionId,
    success = function (response) {
      if (!response.publishDate) {
        releaseDate = null;
      } else {
        releaseDate = response.publishDate;
      }
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  //releaseDate = Ermintrude.collection.date;             //to be added back to scheduled collections

  if (type === 'bulletin' || type === 'article') {
    $('#pagetype').val(type).change();
    loadT4Creator(collectionId, releaseDate, type, parentUrl);
  } else if (type === 'compendium_landing_page') {
    $('#pagetype').val(type).change();
    loadT6Creator(collectionId, releaseDate, type, parentUrl);
  } else {
    $('select').off().change(function () {
      pageType = $(this).val();
      $('.edition').empty();

      if (pageType === 'bulletin' || pageType === 'article' || pageType === 'article_download') {
        loadT4Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType.match(/compendium_.+/)) {
        loadT6Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType.match(/static_.+/)) {
        loadT7Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType === 'dataset_landing_page' || pageType === 'timeseries_landing_page') {
        loadT8Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType === 'release') {
        loadT16Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else {
        sweetAlert("Error", 'Page type not recognised. Contact an administrator', "error");
      }
    });
  }

}

/**
 * Load the image builder screen. This screen is for adding images that cannot be built using the chart
 * builder, hence the additional parameters in the builder that imitate a chart.
 * @param pageData - The data for the page the image is being added to.
 * @param onSave - The function to call when the image is saved and the image builder is closed.
 * @param image - The existing image object if an existing image is being edited.
 */
function loadImageBuilder(pageData, onSave, image) {
  var pageUrl = pageData.uri;
  var previewImage;

  // render the template for the image builder screen
  var html = templates.imageBuilder(image);
  $('body').append(html);

  // The files uploaded as part of the image creation are stored in an array on the image object.
  // These keys identify the different types of files that can be added.
  var imageFileKey = "uploaded-image"; // The actual image shown on screen
  var dataFileKey = "uploaded-data"; // The associated data file for the image.

  // if we are passing an existing image to the builder, go ahead and show it.
  if (image) {
    renderImage(getImageUri(image));
    renderText();
  }

  // If any text fields on the form are changed, update them.
  $('.refresh-text').on('input', function () {
    renderText();
  });

  $('#upload-image-form').submit(function (event) {
    $(this).find(':submit').attr('disabled', 'disabled');
    event.preventDefault();
    event.stopImmediatePropagation();

    var formData = new FormData($(this)[0]);
    var file = this[0].files[0];
    if (!file) {
      sweetAlert('Please select a file to upload.');
      return;
    }

    if (!/\.png|.jpeg$|.jpg$|/.test(file)) {
      sweetAlert('The data file upload is limited to PNG and JPEG.', "", "info");
      return;
    }

    var fileExtension = file.name.split('.').pop();
    previewImage = buildJsonObjectFromForm(previewImage);
    var imagePath = previewImage.uri + '.' + fileExtension;
    var imageFileName = previewImage.filename + '.' + fileExtension;
    var fileExists = getExistingFileName(previewImage, imageFileKey);

    uploadFile(
      imagePath,
      formData,
      success = function () {
        if (!fileExists) {
          previewImage.files.push({type: imageFileKey, filename: imageFileName, fileType: fileExtension});
        }
        renderImage(getImageUri(previewImage));
      });

    return false;
  });

  $('#upload-data-form').submit(function (event) {
    $(this).find(':submit').attr('disabled', 'disabled');
    event.preventDefault();
    event.stopImmediatePropagation();

    var formData = new FormData($(this)[0]);
    var file = this[0].files[0];
    if (!file) {
      sweetAlert('Please select a file to upload.');
      return;
    }

    if (!/\.csv$|.xls$|.xlsx$|/.test(file)) {
      sweetAlert('The data file upload is limited to CSV, XLS, or XLSX.');
      return;
    }

    var fileExtension = file.name.split('.').pop();
    previewImage = buildJsonObjectFromForm(previewImage);
    var filePath = previewImage.uri + '.' + fileExtension;
    var fileName = previewImage.filename + '.' + fileExtension;
    var fileExists = getExistingFileName(previewImage, dataFileKey);

    uploadFile(
      filePath,
      formData,
      success = function () {
        if (!fileExists) {
          swal({
            title: "Upload complete",
            text: "Upload complete",
            type: "success",
            timer: 2000
          });
          previewImage.files.push({type: dataFileKey, filename: fileName, fileType: fileExtension});
        }
      });

    return false;
  });


  function mapImageJsonValues(from, to) {
    to = buildJsonObjectFromForm(to);

    $(from.files).each(function (fromIndex, fromFile) {
      var fileExistsInImage = false;

      $(to.files).each(function (toIndex, toFile) {
        if (fromFile.type == toFile.type) {
          fileExistsInImage = true;
          toFile.fileName = fromFile.fileName;
          toFile.fileType = fromFile.fileType;
        }
      });

      if(!fileExistsInImage) {
        to.files.push(fromFile);
      }
    });

    return to;
  }

  $('.btn-image-builder-create').on('click', function () {

    previewImage = buildJsonObjectFromForm(previewImage);

    if (!previewImage.title) {
      sweetAlert("Please enter a title for the image.");
      return;
    }

    var imageFileName = getExistingFileName(previewImage, imageFileKey);
    if (!imageFileName && image)
      imageFileName = getExistingFileName(image, imageFileKey);
    if (!imageFileName) {
      sweetAlert("Please upload an image");
      return;
    }

    // if there is an image that exists already, overwrite it.
    if (image) {

      // map preview image values onto image
      image = mapImageJsonValues(previewImage, image);

      $(previewImage.files).each(function (index, file) {
        var fromFile = pageUrl + '/' + file.filename;
        var toFile = pageUrl + '/' + file.filename.replace(previewImage.filename, image.filename);
        if (fromFile != toFile){
          console.log("moving... table file: " + fromFile + " to: " + toFile);
          moveContent(Ermintrude.collection.id, fromFile, toFile,
            onSuccess = function () {
              console.log("Moved table file: " + fromFile + " to: " + toFile);
            });
        }
      });
    } else { // just use the preview files
      image = previewImage;
      addImageToPageJson(image);
    }

    saveImageJson(image, success=function() {
      if (onSave) {
        onSave(image.filename, '<ons-image path="' + image.filename + '" />', pageData);
      }
      closeImageBuilderScreen();
    });
  });

  $('.btn-image-builder-cancel').on('click', function () {

    closeImageBuilderScreen();

    if (previewImage) {
      $(previewImage.files).each(function (index, file) {

        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Ermintrude.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted image file: " + fileToDelete);
          });
      });
    }
  });

  function closeImageBuilderScreen() {
    $('.image-builder').stop().fadeOut(200).remove();
  }

  setShortcuts('#image-title');
  setShortcuts('#image-subtitle');

  function renderText() {
    var title = doSuperscriptAndSubscript($('#image-title').val());
    var subtitle = doSuperscriptAndSubscript($('#image-subtitle').val());
    $('#image-title-preview').html(title);
    $('#image-subtitle-preview').html(subtitle);
    $('#image-source-preview').html($('#image-source').val());
    $('#image-notes-preview').html(toMarkdown($('#image-notes').val()));
  }

  function renderImage(imageUri) {
    var iframeMarkup = '<iframe id="preview-frame" frameBorder ="0" scrolling = "yes" src="' + '/zebedee/resource/' + Ermintrude.collection.id + '?uri=' + imageUri + '"></iframe>';
    $('#image').html(iframeMarkup);
    var iframe = document.getElementById('preview-frame');
    iframe.height = "500px";
    iframe.width = "100%";
    setTimeout(
      function () {
        body = $('#preview-frame').contents().find('body');
        $(body).children().css('height', '100%');
      }, 100);
  }

  function toMarkdown(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.getSanitizingConverter();
      Markdown.Extra.init(converter, {
        extensions: "all"
      });
      return converter.makeHtml(text)
    }
    return '';
  }

  function isMarkdownAvailable() {
    return typeof Markdown !== 'undefined'
  }

  function doSuperscriptAndSubscript(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.Converter();
      return converter._DoSubscript(converter._DoSuperscript(text));
    }
    return text;

  }


  function uploadFile(path, formData, success) {
    $.ajax({
      url: "/zebedee/content/" + Ermintrude.collection.id + "?uri=" + path,
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        if (success) {
          success();
        }
      }
    });
  }

  function getImageUri(image) {
    return pageData.uri + '/' + getImageFilename(image);
  }

  function getImageFilename(image) {
    return getExistingFileName(image, imageFileKey)
  }

  // for any figure object, iterate the files and return the file path for the given key.
  function getExistingFileName(object, key) {
    var result;
    _.each(object.files, function (file) {
      if (key === file.type) {
        result = file.filename;
      }
    });
    return result;
  }

  function saveImageJson(image, success, error) {
    var noExtension = image.uri.match(/^(.+?)(\.[^.]*$|$)/);
    var imageJson = noExtension[1] + ".json";

    $.ajax({
      url: "/zebedee/content/" + Ermintrude.collection.id + "?uri=" + imageJson,
      type: 'POST',
      data: JSON.stringify(image),
      processData: false,
      contentType: 'application/json',
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

  function addImageToPageJson(image) {
    if (!pageData.images) {
      pageData.images = [];
    } else {

      var existingImage = _.find(pageData.images, function (existingImage) {
        return existingImage.filename === image.filename;
      });

      if (existingImage) {
        existingImage.title = image.title;
        return;
      }
    }

    pageData.images.push({title: image.title, filename: image.filename, uri: image.uri});
  }

  function buildJsonObjectFromForm(image) {
    if (!image) {
      image = {};
    }

    image.type = "image";
    // give the image a unique ID if it does not already have one.
    image.filename = image.filename ? image.filename : StringUtils.randomId();
    image.title = $('#image-title').val();
    image.uri = pageUrl + "/" + image.filename;
    image.subtitle = $('#image-subtitle').val();
    image.source = $('#image-source').val();
    image.notes = $('#image-notes').val();
    image.altText = $('#image-alt-text').val();

    if (!image.files) {
        image.files = [];
    }

    return image;
  }
}


function loadImagesList(collectionId, data) {
  var html = templates.workEditImages(data);
  $('#images').replaceWith(html);
  initialiseImagesList(collectionId, data);
}

function refreshImagesList(collectionId, data) {
  var html = templates.workEditImages(data);
  $('#image-list').replaceWith($(html).find('#image-list'));
  initialiseImagesList(collectionId, data);
}

function initialiseImagesList(collectionId, data) {

  $(data.images).each(function (index, image) {
    var basePath = data.uri;
    var noExtension = image.uri.match(/^(.+?)(\.[^.]*$|$)/);
    var imageJson = noExtension[1] + '.json';

    $("#image-copy_" + index).click(function () {
      copyToClipboard('#image-to-be-copied_' + index);
    });

    $("#image-edit_" + index).click(function () {
      getPageResource(collectionId, imageJson,
        onSuccess = function (imageData) {
          loadImageBuilder(data, function () {
            Ermintrude.Editor.isDirty = false;
            //refreshPreview();
            refreshImagesList(collectionId, data);
          }, imageData);
        }
      );
    });

    $("#image-delete_" + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this image?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          $(this).parent().remove();
          // delete any files associated with the image.
          getPageResource(collectionId, imageJson,
            onSuccess = function (imageData) {
              if (imageData.files) {
                _.each(imageData.files, function (file) {
                  var fileUri = basePath + '/' + file.filename;
                  //console.log('deleting ' + fileUri);
                  deleteContent(collectionId, fileUri, function () {
                  }, function () {
                  });
                });
              } else {
                //console.log('deleting ' + image.uri);
                deleteContent(collectionId, image.uri);
              }
            });

          // remove the image from the page json when its deleted
          data.images = _(data.images).filter(function (item) {
            return item.filename !== image.filename;
          });

          // save the updated page json
          putContent(collectionId, basePath, JSON.stringify(data),
            success = function () {
              Ermintrude.Editor.isDirty = false;

              swal({
                title: "Deleted",
                text: "This image has been deleted",
                type: "success",
                timer: 2000
              });

              refreshImagesList(collectionId, data);

              // delete the image json file
              deleteContent(collectionId, imageJson,
                onSuccess = function () {
                },
                error = function (response) {
                  if (response.status !== 404)
                    handleApiError(response);
                });
            },
            error = function (response) {
              handleApiError(response);
            }
          );
        }
      });
    });
  });
  // Make sections sortable
  function sortable() {
    $('#sortable-image').sortable();
  }
  sortable();
}
/**
 * Manages markdown editor
 * @param content
 * @param onSave
 * @param pageData
 * @param notEmpty - if present, markdown cannot be left empty
 */

function loadMarkdownEditor(content, onSave, pageData, notEmpty) {

  if (content.title == undefined) {
    var html = templates.markdownEditorNoTitle(content);
    $('body').append(html);
    $('.markdown-editor').stop().fadeIn(200);
    $('#wmd-input').focus();
  } else {
    var html = templates.markdownEditor(content);
    $('body').append(html);
    $('.markdown-editor').stop().fadeIn(200);
    $('#wmd-input').focus();
  }

  markdownEditor();

  if (notEmpty) {
    var markdown = $('#wmd-input').val();
  }

  if (notEmpty === true || markdown === '') {
    $('.btn-markdown-editor-cancel').hide();
  } else {
    $('.btn-markdown-editor-cancel').on('click', function () {
      $('.markdown-editor').stop().fadeOut(200).remove();
      clearTimeout(timeoutId);
    });
  }

  $(".btn-markdown-editor-save").click(function () {
    onSave(markdown);
    clearTimeout(timeoutId);
  });

  if (notEmpty) {
    $(".btn-markdown-editor-exit").click(function () {
      var markdown = $('#wmd-input').val();
      if (markdown === '') {
        sweetAlert('Please add some text', "This can't be left empty");
      } else {
        onSave(markdown);
        clearTimeout(timeoutId);
        $('.markdown-editor').stop().fadeOut(200).remove();
      }
    });
  } else {
    $(".btn-markdown-editor-exit").click(function () {
      var markdown = $('#wmd-input').val();
      onSave(markdown);
      clearTimeout(timeoutId);
      $('.markdown-editor').stop().fadeOut(200).remove();
    });
  }

  var onInsertSave = function(name, markdown) {
    insertAtCursor($('#wmd-input')[0], markdown);
    Ermintrude.Editor.markdownEditor.refreshPreview();
  };

  $(".btn-markdown-editor-chart").click(function(){
    loadChartBuilder(pageData, onInsertSave);
  });

  $(".btn-markdown-editor-table").click(function(){
    loadTableBuilder(pageData, onInsertSave);
  });

  $(".btn-markdown-editor-image").click(function(){
    loadImageBuilder(pageData, function(name, markdown, pageData) {
      onInsertSave(name, markdown);
      refreshImagesList(Ermintrude.collection.id, pageData)
    });
  });

  $("#wmd-input").on('click', function () {
    markDownEditorSetLines();
  });

  $("#wmd-input").on('keyup', function () {
    markDownEditorSetLines();
  });

  $("#wmd-input").on('input', function () {
    autoSave(onSave);
  });

  // http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
  $("#wmd-input").keydown(function(e) {
    if(e.keyCode === 9) { // tab was pressed
      // get caret position/selection
      var start = this.selectionStart;
      var end = this.selectionEnd;

      var $this = $(this);
      var value = $this.val();

      // set textarea value to: text before caret + tab + text after caret
      $this.val(value.substring(0, start)
      + "\t"
      + value.substring(end));

      // put caret at right position again (add one for the tab)
      this.selectionStart = this.selectionEnd = start + 1;

      // prevent the focus lose
      e.preventDefault();
    }
  });

  // http://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
  function insertAtCursor(field, value) {
    //IE support
    if (document.selection) {
      field.focus();
      sel = document.selection.createRange();
      sel.text = value;
    }
    //MOZILLA and others
    else if (field.selectionStart || field.selectionStart == '0') {
      var startPos = field.selectionStart;
      var endPos = field.selectionEnd;
      field.value = field.value.substring(0, startPos)
      + value
      + field.value.substring(endPos, field.value.length);
      field.selectionStart = startPos + value.length;
      field.selectionEnd = startPos + value.length;
    } else {
      field.value += value;
    }
  }
}


function markdownEditor() {

  var converter = new Markdown.getSanitizingConverter();

  // output chart tag as text instead of the actual tag.
  converter.hooks.chain("preBlockGamut", function (text) {
    var newText = text.replace(/(<ons-chart\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
      var path = $(match).attr('path');
      return '[chart path="' + path + '" ]';
    });
    return newText;
  });

  // output table tag as text instead of the actual tag.
  converter.hooks.chain("preBlockGamut", function (text) {
    var newText = text.replace(/(<ons-table\spath="[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"?\s?\/>)/ig, function (match) {
      var path = $(match).attr('path');
      return '[table path="' + path + '" ]';
    });
    return newText;
  });

  Markdown.Extra.init(converter, {
    extensions: "all"
  });

  var editor = new Markdown.Editor(converter);
  Ermintrude.Editor.markdownEditor = editor;

  editor.hooks.chain("onPreviewRefresh", function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  });

  editor.run();
  markDownEditorSetLines();
}

var timeoutId;
function autoSave (onSave) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function() {
    // Runs 5 second (5000 ms) after the last change
    var markdown = $('#wmd-input').val();
    onSave(markdown);
  }, 5000);
}

/**
 * Editor data loader
 * @param path
 * @param collectionId
 * @param click - if present checks the page url to keep in sync with iframe
 */

function loadPageDataIntoEditor(path, collectionId, click) {

  if (Ermintrude.globalVars.welsh) {
    if (path === '/') {       //add whatever needed to read content in Welsh
      var pageUrlData = path + '&lang=cy';
      var toApproveUrlData = '/data_cy.json';
    } else {
      var pageUrlData = path + '&lang=cy';
      var toApproveUrlData = path + '/data_cy.json';
    }
  } else {
    if (path === '/') {       //add whatever needed to read content in English
      var pageUrlData = path;
      var toApproveUrlData = '/data.json';
    } else {
      var pageUrlData = path;
      var toApproveUrlData = path + '/data.json';
    }
  }

  var pageData, isPageComplete;
  var ajaxRequests = [];

  ajaxRequests.push(
    getPageData(collectionId, pageUrlData,
      success = function (response) {
        pageData = response;
      },
      error = function (response) {
        handleApiError(response);
      }
    )
  );

  ajaxRequests.push(
    getCollection(collectionId,
      success = function (response) {
        var lastCompletedEvent = getLastCompletedEvent(response, toApproveUrlData);
        isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === Ermintrude.Authentication.loggedInEmail());
      },
      error = function (response) {
        handleApiError(response);
      })
  );

  $.when.apply($, ajaxRequests).then(function () {
    if (click) {
      var iframe = getPathName();
      if (iframe !== pageData.uri) {
        setTimeout(loadPageDataIntoEditor(path, collectionId), 200);
      } else {
        makeEditSections(collectionId, pageData, isPageComplete);
      }
    } else {
      makeEditSections(collectionId, pageData, isPageComplete);
    }
  });
}
function loadParentLink(collectionId, data, parentUrl) {

  getPageDataTitle(collectionId, parentUrl,
      function (response) {
        var parentTitle = response.title;
        $('.child-page__title').append(parentTitle);
      },
      function () {
        sweetAlert("Error", "Could not find parent that this is a sub page of", "error");
      }
  );

  //Add link back to parent page
  $('.child-page').append("<a class='child-page__link'>Back to parent page</a>");

  //Take user to parent edit screen on link click
  $('.child-page__link').click(function () {
    //If there are edits check whether user wants to continue
    if (Ermintrude.Editor.isDirty) {
      swal ({
        title: "Warning",
        text: "You have unsaved changes. Are you sure you want to continue?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel"
      }, function (result) {
        if (result === true) {
          Ermintrude.Editor.isDirty = false;
          //Return to parent if user confirms it
          updateContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
          return true;
        }
      });
    } else {
      //Return to parent without saving
      createWorkspace(parentUrl, collectionId, 'edit');
    }
  });

}/**
 * Creates releases' JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT16Creator(collectionId, releaseDate, pageType, parentUrl) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageType, pageTitle, uriSection, pageTitleTrimmed;
  var parentUrlData = "/data"; //home page
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      //Checks page is built in correct location
      if (checkData.type === 'home_page') {
        submitFormHandler();
        return true;
      } else {
        sweetAlert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler() {
    $('.edition').append(
      '<label for="releaseDate">Release date</label>' +
      '<input id="releaseDate" type="text" placeholder="day month year" />' +
      '<div class="select-wrap select-wrap--half">' +
      '<select id="hour">' +
      '  <option value="0">00</option>' +
      '  <option value="3600000">01</option>' +
      '  <option value="7200000">02</option>' +
      '  <option value="10800000">03</option>' +
      '  <option value="14400000">04</option>' +
      '  <option value="18000000">05</option>' +
      '  <option value="21600000">06</option>' +
      '  <option value="25200000">07</option>' +
      '  <option value="28800000">08</option>' +
      '  <option value="32400000" selected="selected">09</option>' +
      '  <option value="36000000">10</option>' +
      '  <option value="39600000">11</option>' +
      '  <option value="43200000">12</option>' +
      '  <option value="46800000">13</option>' +
      '  <option value="50400000">14</option>' +
      '  <option value="54000000">15</option>' +
      '  <option value="57600000">16</option>' +
      '  <option value="61200000">17</option>' +
      '  <option value="64800000">18</option>' +
      '  <option value="68400000">19</option>' +
      '  <option value="72000000">20</option>' +
      '  <option value="75600000">21</option>' +
      '  <option value="79200000">22</option>' +
      '  <option value="82800000">23</option>' +
      '</select>' +
      '</div>' +
      '<div class="select-wrap select-wrap--half">' +
      '<select id="min">' +
      '  <option value="0">00</option>' +
      '  <option value="1800000" selected="selected">30</option>' +
      '</select>' +
      '</div>'
    );
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});

    //Submits inherited and added information to JSON
    $('form').submit(function (e) {
      //Check for reserved words
      if ($('#pagename').val().toLowerCase() === 'current' || $('#pagename').val().toLowerCase() === 'latest' || $('#pagename').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for a title');
        $('#pagename').val('');
        return false;
      }

      pageData = pageTypeDataT16(pageType);
      var publishTime  = parseInt($('#hour').val()) + parseInt($('#min').val());
      var toIsoDate = $('#releaseDate').datepicker("getDate");
      pageData.description.releaseDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
      pageData.description.edition = $('#edition').val();
      pageTitle = $('#pagename').val();
      pageData.description.title = pageTitle;
      uriSection = "releases";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
      safeNewUri = checkPathSlashes(newUri);

      if (!pageData.description.releaseDate) {
        sweetAlert('Release date can not be empty');
        return true;
      }
      if (pageTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        return true;
      } else {
        Ermintrude.globalVars.pagePath = safeNewUri;
        saveContent(collectionId, safeNewUri, pageData);
      }
      e.preventDefault();
    });
  }
}

function pageTypeDataT16(pageType) {
  return {
    "description": {
      "releaseDate": "",
      "provisionalDate": "",
      "finalised": false,
      "nextRelease": "", //does not make sense
      "contact": {
        "name": "",
        "email": "",
        "telephone": ""
      },
      "summary": "",
      "title": "",
      "nationalStatistic": false,
      "cancelled": false,
      "cancellationNotice": [],
      "published": false
    },
    "markdown": [],
    "relatedDatasets": [],
    "relatedDocuments": [],
    type: pageType,
    "dateChanges": []
  };
}

/**
 * Creates article and bulletin JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT4Creator (collectionId, releaseDate, pageType, parentUrl) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageType, pageTitle, uriSection, pageTitleTrimmed, pageEditionTrimmed, releaseDateManual,
    isInheriting, newUri, pageData, natStat, contactName, contactEmail,
    contactTel, keyWords, metaDescr, relatedData, summary, relatedMethodology;
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.type === 'product_page' && !Ermintrude.globalVars.welsh) {
        var checkedUrl = checkPathSlashes(checkData.uri);
        submitFormHandler(checkedUrl);
        return true;
      } if ((checkData.type === 'bulletin' && pageType === 'bulletin') || (checkData.type === 'article' && pageType === 'article') || (checkData.type === 'article_download' && pageType === 'article_download')) {
        var checkedUrl = checkPathSlashes(checkData.uri);
        var safeParentUrl = getParentPage(checkedUrl);
        natStat = checkData.description.nationalStatistic;
        contactName = checkData.description.contact.name;
        contactEmail = checkData.description.contact.email;
        contactTel = checkData.description.contact.telephone;
        pageTitle = checkData.description.title;
        keyWords = checkData.description.keywords;
        summary = checkData.description.summary;
        metaDescr = checkData.description.metaDescription;
        relatedMethodology = checkData.relatedMethodology;
        if (checkData.type === 'bulletin' && pageType === 'bulletin') {
          relatedData = checkData.relatedData;
        }
        isInheriting = true;
        submitFormHandler (safeParentUrl, pageTitle, isInheriting);
        return true;
      } else {
        sweetAlert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler (parentUrl, title, isInheriting) {

    $('.edition').append(
      '<label for="edition">Edition</label>' +
      '<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />'
    );
    if (!releaseDate) {
      $('.edition').append(
        '<br>' +
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    }
    if (title) {
      pageTitle = title;
      $('#pagename').val(title);
    }

    $('form').submit(function (e) {
      releaseDateManual = $('#releaseDate').val();
      //Check for reserved words
      if ($('#pagename').val().toLowerCase() === 'current' || $('#pagename').val().toLowerCase() === 'latest' || $('#pagename').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for a title');
        $('#pagename').val('');
        return false;
      }
      if ($('#edition').val().toLowerCase() === 'current' || $('#edition').val().toLowerCase() === 'latest' || $('#edition').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for an edition');
        $('#edition').val('');
        return false;
      }
      pageData = pageTypeDataT4(pageType);
      pageData.description.edition = $('#edition').val();
      if (title) {
        //do nothing;
      } else {
        pageTitle = $('#pagename').val();
      }
      pageData.description.title = pageTitle;
      if (pageType === 'article_download') {
       uriSection = 'articles';
      } else {
        uriSection = pageType + "s";
      }
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      if (pageData.description.edition) {
        pageEditionTrimmed = pageData.description.edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        var releaseUri = pageEditionTrimmed;
      }

      if (!pageData.description.edition && releaseDateManual) {                          //Manual collections
        date = $.datepicker.parseDate("dd MM yy", releaseDateManual);
        releaseUri = $.datepicker.formatDate('yy-mm-dd', date);
      } else if (!pageData.description.edition && !releaseDateManual) {
        releaseUri = $.datepicker.formatDate('yy-mm-dd', new Date(releaseDate));
      }

      if (!releaseDate) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      if (isInheriting) {
        pageData.description.nationalStatistic = natStat;
        pageData.description.contact.name = contactName;
        pageData.description.contact.email = contactEmail;
        pageData.description.contact.telephone = contactTel;
        pageData.description.keywords = keyWords;
        pageData.description.metaDescription = metaDescr;
        pageData.relatedMethodology = relatedMethodology;
        if (pageType === 'bulletin') {
          pageData.description.summary = summary;
          pageData.relatedData = relatedData;
        }
        newUri = makeUrl(parentUrl, releaseUri);
      } else {
        newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed, releaseUri);
      }
      var safeNewUri = checkPathSlashes(newUri);

      if (pageType === 'bulletin' && !pageData.description.edition) {
        sweetAlert('Edition can not be empty');
        return true;
      } if (!pageData.description.releaseDate) {
        sweetAlert('Release date can not be empty');
        return true;
      } if (pageTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        return true;
      }
      else {
        saveContent(collectionId, safeNewUri, pageData);
      }
      e.preventDefault();
    });
  }

  function pageTypeDataT4(pageType) {

    if (pageType === "bulletin") {
      return {
        "description": {
          "title": "",
          "edition": "",
          "summary": "",
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "nationalStatistic": false,
          "headline1": "",
          "headline2": "",
          "headline3": "",
          "keywords": [],
          "metaDescription": "",
        },
        "sections": [],
        "accordion": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "topics": [],
        "links": [],
        "charts": [],
        "tables": [],
        "images": [],
        "alerts": [],
        "versions": [],
        type: pageType
      };
    }

    else if (pageType === "article") {
      return {
        "description": {
          "title": "",
          "edition": "",
          "_abstract": "",
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "nationalStatistic": false,
          "keywords": [],
          "metaDescription": "",
        },
        "sections": [],
        "accordion": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "topics": [],
        "links": [],
        "charts": [],
        "tables": [],
        "images": [],
        "alerts": [],
        "versions": [],
        type: pageType
      };
    }

    else if (pageType === "article_download") {
      return {
        "description": {
          "title": "",
          "_abstract": "",
          "edition": "",
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "nationalStatistic": false,
          "keywords": [],
          "metaDescription": ""
        },
        "markdown": [],
        "downloads": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "topics": [],
        "links": [],
        "charts": [],
        "tables": [],
        "images": [],
        "alerts": [],
        "versions": [],
        type: pageType
      };
    }

    else {
      sweetAlert('Unsupported page type. This is not an article or a bulletin');
    }
  }
}

/**
 * Creates compendium documents
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 * @param pageTitle
 */

function loadT6Creator (collectionId, releaseDate, pageType, parentUrl, pageTitle) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageType, pageTitle, pageEdition, uriSection, pageTitleTrimmed, pageEditionTrimmed, releaseDateManual, isInheriting, newUri, pageData, parentData;
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      parentData = $.extend(true, {}, checkData);
      if ((checkData.type === 'product_page' && pageType === 'compendium_landing_page' && !Ermintrude.globalVars.welsh) ||
          (checkData.type === 'compendium_landing_page' && pageType === 'compendium_chapter') ||
          (checkData.type === 'compendium_landing_page' && pageType === 'compendium_data')) {
        parentUrl = checkData.uri;
        pageData = pageTypeDataT6(pageType, checkData);
        if (pageTitle) {
          submitNoForm (parentUrl, pageTitle);
        } else {
          submitFormHandler(parentUrl);
        }
        return true;
      } if (checkData.type === 'compendium_landing_page' && pageType === 'compendium_landing_page') {
        parentUrl = getParentPage(checkData.uri);
        pageTitle = checkData.description.title;
        isInheriting = true;
        pageData = pageTypeDataT6(pageType, checkData);
        submitFormHandler(parentUrl, pageTitle, isInheriting);
        return true;
      } else {
        sweetAlert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler (parentUrl, title, isInheriting) {
    $('.edition').empty();
    if (pageType === 'compendium_landing_page') {
      $('.edition').append(
        '<label for="edition">Edition</label>' +
        '<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />' +
        '<br>' +
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    }
    if (title) {
      pageTitle = title;
      $('#pagename').val(title);
    }

    $('form').submit(function (e) {
      releaseDateManual = $('#releaseDate').val();
      //Check for reserved words
      if ($('#pagename').val().toLowerCase() === 'current' || $('#pagename').val().toLowerCase() === 'latest' || $('#pagename').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for a title');
        $('#pagename').val('');
        return false;
      }
      if ($('#edition').val().toLowerCase() === 'current' || $('#edition').val().toLowerCase() === 'latest' || $('#edition').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for an edition');
        $('#edition').val('');
        return false;
      }
      if (pageType === 'compendium_landing_page') {
        pageData.description.edition = $('#edition').val();
      }
      if (!title) {
        pageTitle = $('#pagename').val();
      }

      pageData.description.title = pageTitle;
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      pageEdition = pageData.description.edition;
      pageEditionTrimmed = pageEdition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      if (pageType === 'compendium_landing_page' && releaseDate == null) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      }
      else if (pageType === 'compendium_landing_page' && releaseDate) {
        pageData.description.releaseDate = releaseDate;
      }

      if (isInheriting && pageType === 'compendium_landing_page') {
        newUri = makeUrl(parentUrl, pageEditionTrimmed);
      }
      else if (pageType === 'compendium_landing_page') {
        uriSection = "compendium";
        newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed, pageEditionTrimmed);
      }
      else if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
        newUri = makeUrl(parentUrl, pageTitleTrimmed);
      }
      else {
        sweetAlert('Oops! Something went the wrong.', "", "error");
        loadCreateScreen(collectionId);
      }
      var safeNewUri = checkPathSlashes(newUri);

      if ((pageType === 'compendium_landing_page') && (!pageData.description.edition)) {
        sweetAlert('Edition can not be empty');
        e.preventDefault();
        return true;
      } if ((pageType === 'compendium_landing_page') && (!pageData.description.releaseDate)) {
        sweetAlert('Release date can not be empty');
        e.preventDefault();
        return true;
      } if (pageTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        e.preventDefault();
        return true;
      } if (pageTitle.toLowerCase() === 'current' || pageTitle.toLowerCase() === 'latest') {
        alert("This is not a valid file title");
        e.preventDefault();
        return true;
      }
      else {
        putContent(collectionId, safeNewUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            if (pageData.type === 'compendium_landing_page') {
              viewWorkspace(safeNewUri, collectionId, 'edit');
              refreshPreview(safeNewUri);
              return true;
            }
            else if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
              updateParentLink (safeNewUri);
              return true;
            }
          },
          error = function (response) {
            if (response.status === 409) {
              sweetAlert("Cannot create this page", "It already exists.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      }
      e.preventDefault();
    });
  }

function submitNoForm (parentUrl, title) {

    pageData.description.title = title;
    pageTitleTrimmed = title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
      newUri = makeUrl(parentUrl, pageTitleTrimmed);
    } else {
      sweetAlert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }

  var safeNewUri = checkPathSlashes(newUri);

    // check if the page exists
    getPageData(collectionId, safeNewUri,
      success = function() {
        sweetAlert('This page already exists');
      },
      // if the page does not exist, create it
      error = function() {
        putContent(collectionId, safeNewUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            updateParentLink (safeNewUri);
          },
          error = function (response) {
            if (response.status === 400) {
              sweetAlert("Cannot edit this page. It is already part of another collection.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      }
    );
  }

  function pageTypeDataT6(pageType, checkData) {

    if (pageType === "compendium_landing_page") {
      return {
        "description": {
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "summary": "",
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "title": "",
          "edition": ""
        },
        "datasets": [],
        "chapters": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "topics": [],
        "alerts": [],
        type: pageType
      };
    }

    else if (pageType === 'compendium_chapter') {
      return {
        "description": {
          "releaseDate": checkData.description.releaseDate || "",
          "nextRelease": checkData.description.nextRelease || "",
          "contact": {
            "name": checkData.description.contact.name || "",
            "email": checkData.description.contact.email || "",
            "telephone": checkData.description.contact.telephone || ""
          },
          "_abstract": "",
          "authors": [],
          "keywords": checkData.description.keywords || [],
          "metaDescription": checkData.description.metaDescription || "",
          "nationalStatistic": checkData.description.nationalStatistic,
          "title": "",
          "headline": "",
        },
        "sections": [],
        "accordion": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "externalLinks": [],
        "charts": [],
        "tables": [],
        "images": [],
        "versions": [],
        "alerts": [],
        type: pageType
      };
    }

    else if (pageType === 'compendium_data') {
      return {
        "description": {
          "releaseDate": checkData.description.releaseDate || "",
          "nextRelease": checkData.description.nextRelease || "",
          "contact": {
            "name": checkData.description.contact.name || "",
            "email": checkData.description.contact.email || "",
            "telephone": checkData.description.contact.telephone || ""
          },
          "summary": "",
          "datasetId": "",
          "keywords": checkData.description.keywords || [],
          "metaDescription": checkData.description.metaDescription || "",
          "nationalStatistic": checkData.description.nationalStatistic,
          "title": ""
        },
        "downloads": [],
        "versions": [], //{date, uri, correctionNotice}
        "relatedDocuments": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        type: pageType
      };
    }

    else {
      sweetAlert('Unsupported page type. This is not a compendium file type');
    }
  }

  function updateParentLink (childUri) {
    if (pageType === "compendium_chapter") {
      parentData.chapters.push({uri: childUri})
    }
    else if (pageType === 'compendium_data') {
      parentData.datasets.push({uri: childUri})
    }
    else
    {
      sweetAlert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }
    putContent(collectionId, parentUrl, JSON.stringify(parentData),
      success = function (message) {
        viewWorkspace(childUri, collectionId, 'edit');
        refreshPreview(childUri);
        console.log("Parent link updating completed " + message);
      },
      error = function (response) {
        if (response.status === 400) {
          sweetAlert("Cannot edit this page. It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }
}

/**
 * Creates static pages' JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT7Creator(collectionId, releaseDate, pageType, parentUrl) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageName, pageNameTrimmed, newUri, pageData, isNumber;
  if (parentUrl === '/') {        //to check home page
    parentUrl = '';
  }
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (pageType === 'static_landing_page' && checkData.type === 'home_page' ||
        (pageType === 'static_qmi' || pageType === 'static_adhoc' || pageType === 'static_methodology' || pageType === 'static_methodology_download') && checkData.type === 'product_page') {
        submitFormHandler();
        return true;
      } else if ((pageType === 'static_foi' || pageType === 'static_page' || pageType === 'static_landing_page') && checkData.type.match(/static_.+/)) {
        submitFormHandler();
        return true;
      } else {
        sweetAlert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler() {
    if (pageType === 'static_qmi' || pageType === 'static_methodology') {
      $('.edition').append(
        '<br>' +
        '<label for="releaseDate">Last revised</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );

      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    } else if (pageType === 'static_adhoc') {
      $('.edition').append(
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />' +
        '<br>' +
        '<label for="adhoc-reference">Reference</label>' +
        '<input id="adhoc-reference" type="text" placeholder="Reference number" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
      $('#adhoc-reference').on('input', function () {
        isNumber = $(this).val();
        if (!isNumber.match(/^\d+$/)) {
          sweetAlert('This needs to be a number');
          $(this).val('');
        }
      });
    }
    else if (!releaseDate && !(pageType === 'static_page' || pageType === 'static_landing_page')) {
      $('.edition').append(
        '<br>' +
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    }

    $('form').submit(function (e) {
      e.preventDefault();
      //Check for reserved words
      if ($('#pagename').val().toLowerCase() === 'current' || $('#pagename').val().toLowerCase() === 'latest' || $('#pagename').val().toLowerCase() === 'data') {
        alert('That is not an accepted value for a title');
        $('#pagename').val('');
        return false;
      }
      pageData = pageTypeDataT7(pageType);
      pageName = $('#pagename').val().trim();
      pageData.description.title = pageName;
      pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      pageData.fileName = pageNameTrimmed;
      pageData.description.reference = isNumber;
      var adHocUrl = isNumber + pageNameTrimmed;
      if (pageType === 'static_qmi' && !Ermintrude.globalVars.welsh) {
        newUri = makeUrl(parentUrl, 'qmis', pageNameTrimmed);
      } else if (pageType === 'static_adhoc' && !Ermintrude.globalVars.welsh) {
        newUri = makeUrl(parentUrl, 'adhocs', adHocUrl);
      } else if ((pageType === 'static_methodology' || pageType === 'static_methodology_download') && !Ermintrude.globalVars.welsh) {
        newUri = makeUrl(parentUrl, 'methodologies', pageNameTrimmed);
      } else if (!Ermintrude.globalVars.welsh) {
        newUri = makeUrl(parentUrl, pageNameTrimmed);
      } else {
        sweetAlert('You can not perform that operation in Welsh.');
      }
      var safeNewUri = checkPathSlashes(newUri);
      if (releaseDate && (pageType === 'static_qmi')) {
        date = new Date(releaseDate);
        pageData.description.lastRevised = $.datepicker.formatDate('dd/mm/yy', date);
      } else if (releaseDate && (pageType !== 'static_page' || pageType !== 'static_landing_page')) {
        date = new Date(releaseDate);
        pageData.description.releaseDate = $.datepicker.formatDate('dd/mm/yy', date);
      } else if (!releaseDate && (pageType === 'static_qmi' || pageType === 'static_methodology')) {
        pageData.description.lastRevised = new Date($('#releaseDate').val()).toISOString();
      } else if (!releaseDate && !(pageType === 'static_page' || pageType === 'static_landing_page')) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      }

      if (pageName.length < 5) {
        sweetAlert("This is not a valid file name");
      } else {
        saveContent(collectionId, safeNewUri, pageData);
      }
    });
  }
}

function pageTypeDataT7(pageType) {

  if (pageType === "static_page") {
    return {
      "description": {
        "title": "",
        "summary": "",
        "keywords": [],
        "metaDescription": ""
      },
      "markdown": [],
      "downloads": [],
      type: pageType,
      "links": []
    };
  } else if (pageType === "static_landing_page") {
    return {
      "description": {
        "title": "",
        "summary": "",
        "keywords": [],
        "metaDescription": "",
      },
      "sections": [],
      "markdown": [],
      type: pageType,
      "links": []
    };
  }
  else if (pageType === "static_methodology") {
    return {
      "description": {
        "title": "",
        "summary": "",
        "releaseDate": "",
        "contact": {
          "name": "",
          "email": "",
          "telephone": ""
        },
        "keywords": [],
        "metaDescription": ""
      },
      "sections": [],
      "accordion": [],
      "relatedDocuments": [],
      "relatedDatasets": [],
      "charts": [],
      "tables": [],
      "images": [],
      "downloads": [],
      "links": [],
      "alerts": [],
      type: pageType
    };
  } else if (pageType === "static_methodology_download") {
    return {
      "description": {
        "title": "",
        "contact": {
          "name": "",
          "email": "",
          "phone": ""
        },
        "releaseDate": "",
        "keywords": [],
        "metaDescription": ""
      },
      "markdown": [],
      "downloads": [],
      "relatedDocuments": [],
      "relatedDatasets": [],
      "links": [],
      "alerts": [],
      type: pageType
    };
  } else if (pageType === "static_qmi") {
    return {
      "description": {
        "title": "",
        "contact": {
          "name": "",
          "email": "",
          "phone": ""
        },
        "surveyName": "",
        "frequency": "",
        "compilation": "",
        "geographicCoverage": "",
        "sampleSize": null,
        "lastRevised": "",
        "nationalStatistic": false,
        "keywords": [],
        "metaDescription": ""
      },
      "markdown": [],
      "downloads": [],
      "relatedDocuments": [],
      "relatedDatasets": [],
      "links": [],
      type: pageType
    };
  } else if (pageType === "static_foi") {
    return {
      "description": {
        "title": "",
        "releaseDate": "",
        "keywords": [],
        "metaDescription": ""
      },
      "downloads": [],
      "markdown": [],
      "links": [],
      type: pageType
    };
  } else if (pageType === "static_adhoc") {
    return {
      "description": {
        "title": "",
        "releaseDate": "",
        "reference": null,
        "keywords": [],
        "metaDescription": ""
      },
      "downloads": [],
      "markdown": [],
      "links": [],
      type: pageType
    };
  } else {
    sweetAlert('Unsupported page type', 'This is not a static page', "info");
  }
}/**
 * Creates data JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

//function loadT8Creator (collectionId, releaseDate, pageType, parentUrl, pageTitle) {
//  var releaseDate = null;             //overwrite scheduled collection date
//  var uriSection, pageTitleTrimmed, releaseDateManual, newUri, pageData;
//  var parentUrlData = parentUrl + "/data";
//  // will add this var in dataset_landing_page
//  var timeseries = false;
//  if (pageType === 'timeseries_landing_page') {
//    timeseries = true;
//    pageType = 'dataset_landing_page';
//  }
//
//  $.ajax({
//    url: parentUrlData,
//    dataType: 'json',
//    crossDomain: true,
//    success: function (checkData) {
//      if (checkData.type === 'product_page' && !Florence.globalVars.welsh) {
//        submitFormHandler();
//        return true;
//      } else {
//        alert("This is not a valid place to create this page.");
//        loadCreateScreen(collectionId);
//      }
//    },
//    error: function () {
//      console.log('No page data returned');
//    }
//  });
//
//  function submitFormHandler () {
//
//    if (!releaseDate) {
//      $('.edition').append(
//        '<label for="releaseDate">Release date</label>' +
//        '<input id="releaseDate" type="text" placeholder="day month year" />'
//      );
//      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
//    }
//
//    $('form').submit(function (e) {
//      releaseDateManual = $('#releaseDate').val()
//      pageData = pageTypeDataT8(pageType);
//      pageTitle = $('#pagename').val();
//      pageData.description.title = pageTitle;
//      pageData.timeseries = timeseries;
//      uriSection = "datasets";
//      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
//
//      if (!releaseDate) {
//        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
//      } else {
//        pageData.description.releaseDate = releaseDate;
//      }
//      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
//      var safeNewUri = checkPathSlashes(newUri);
//
//      if (!pageData.description.releaseDate) {
//        alert('Release date can not be empty');
//        return true;
//      } if (pageTitle.length < 5) {
//        alert("This is not a valid file title");
//        return true;
//      }
//       else {
//        saveContent(collectionId, safeNewUri, pageData);
//      }
//      e.preventDefault();
//    });
//  }
//
//  function pageTypeDataT8(pageType) {
//
//    if (pageType === "dataset_landing_page") {
//      return {
//        "description": {
//          "releaseDate": "",
//          "nextRelease": "",
//          "contact": {
//            "name": "",
//            "email": "",
//            "telephone": ""
//          },
//          "summary": "",
//          "datasetId": "",
//          "keywords": [],
//          "metaDescription": "",
//          "nationalStatistic": false,
//          "title": ""
//        },
//        "timeseries": false,
//        "datasets": [],
//        "section": {},      //notes
//        "corrections": [],
//        "relatedDatasets": [],
//        "relatedDocuments": [],
//        "relatedMethodology": [],
//        "topics": [],
//        type: pageType
//      };
//    }
//    else {
//      alert('Unsupported page type. This is not a dataset type');
//    }
//  }
//}

/**
 * Creates data JSON
 * @param collectionId
 * @param data
 * @param pageType
 * @param pageEdition
 * @param downloadUrl
 */

function loadT8EditionCreator (collectionId, data, pageType, pageEdition, downloadUrl, versionLabel) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageEditionTrimmed, newUri, pageData;

  pageData = pageTypeDataT8(pageType, data);
  submitNoForm(data.uri, pageEdition, downloadUrl, versionLabel);

  function submitNoForm (parentUrl, edition, downloadUrl) {
    pageData.description.edition = edition;
    pageData.description.versionLabel = versionLabel;
    pageData.downloads.push({file: downloadUrl});
    pageEditionTrimmed = edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if ((pageType === 'dataset') || (pageType === 'timeseries_dataset')) {
      newUri = makeUrl(parentUrl, pageEditionTrimmed);
    } else {
      sweetAlert('Oops! Something went the wrong.');
      loadCreateScreen(collectionId);
    }

    var safeNewUri = checkPathSlashes(newUri);

    putContent(collectionId, safeNewUri, JSON.stringify(pageData),
      success = function () {
        updateContent(collectionId, data.uri, JSON.stringify(data));
      },
      error = function (response) {
        if (response.status === 409) {
          sweetAlert("Cannot create this page", "It already exists.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }

  function pageTypeDataT8(pageType, parentData) {

    if (pageType === "dataset") {
      return {
        "description": {
          "releaseDate": parentData.description.releaseDate || "",
          "edition": "",
          "versionLabel": ""
        },
        "versions": [], //{updateDate, uri, correctionNotice, label}
        "downloads": [],
        "supplementaryFiles": [],
        type: pageType
      };
    }

    else if (pageType === "timeseries_dataset") {
      return {
        "description": {
          "releaseDate": parentData.description.releaseDate || "",
          "edition": "",
          "versionLabel": ""
        },
        "versions": [], //{updateDate, uri, correctionNotice, label}
        "downloads": [],
        "supplementaryFiles": [],
        type: pageType
      };
    }

    else {
      sweetAlert('Unsupported page type', 'This is not a dataset type');
    }
  }
}

/**
 * Creates data JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT8Creator (collectionId, releaseDate, pageType, parentUrl, pageTitle) {
  var releaseDate = null;             //overwrite scheduled collection date
  var uriSection, pageTitleTrimmed, releaseDateManual, newUri, pageData;
  var parentUrlData = parentUrl + "/data";
  // will add this var in dataset_landing_page
  var timeseries = false;
  if (pageType === 'timeseries_landing_page') {
    timeseries = true;
    pageType = 'dataset_landing_page';
  }

  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.type === 'product_page' && !Ermintrude.globalVars.welsh) {
        submitFormHandler();
        return true;
      } else {
        sweetAlert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler () {

    if (!releaseDate) {
      $('.edition').append(
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    }

    $('form').submit(function (e) {
      //Check for reserved words
      if ($('#pagename').val().toLowerCase() === 'current' || $('#pagename').val().toLowerCase() === 'latest' || $('#pagename').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for a title');
        $('#pagename').val('');
        return false;
      }

      releaseDateManual = $('#releaseDate').val()
      pageData = pageTypeDataT8(pageType);
      pageTitle = $('#pagename').val();
      pageData.description.title = pageTitle;
      pageData.timeseries = timeseries;
      uriSection = "datasets";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      if (!releaseDate) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
      var safeNewUri = checkPathSlashes(newUri);

      if (!pageData.description.releaseDate) {
        sweetAlert('Release date can not be empty');
        return true;
      } if (pageTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        return true;
      }
      else {
        saveContent(collectionId, safeNewUri, pageData);
      }
      e.preventDefault();
    });
  }

  function pageTypeDataT8(pageType) {

    if (pageType === "dataset_landing_page") {
      return {
        "description": {
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "summary": "",
          "datasetId": "",
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "title": ""
        },
        "timeseries": false,
        "datasets": [],
        "section": {},      //notes
        "corrections": [],
        "relatedDatasets": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "topics": [],
        "alerts": [],
        type: pageType
      };
    }
    else {
      sweetAlert('Unsupported page type. This is not a dataset type');
    }
  }
}

function loadTableBuilder(pageData, onSave, table) {
  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var previewTable;

  $('body').append(html);

  if (table) {
    renderTable(table.uri);
  }

  $('#upload-table-form').submit(function (event) {
    var formData = new FormData($(this)[0]);
    previewTable = buildJsonObjectFromForm(previewTable);
    var path = previewTable.uri;
    var xlsPath = path + ".xls";
    var htmlPath = path + ".html";

    // send xls file to zebedee
    $.ajax({
      url: "/zebedee/content/" + Ermintrude.collection.id + "?uri=" + xlsPath,
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        createTableHtml(previewTable);
      }
    });

    function createTableHtml(previewTable) {
      $.ajax({
        url: "/zebedee/table/" + Ermintrude.collection.id + "?uri=" + xlsPath,
        type: 'POST',
        success: function (html) {
          saveTableJson(previewTable, success = function () {
            saveTableHtml(html);
          });
        }
      });
    }

    function saveTableHtml(data) {
      $.ajax({
        url: "/zebedee/content/" + Ermintrude.collection.id + "?uri=" + htmlPath,
        type: 'POST',
        data: data,
        processData: false,
        success: function () {
          previewTable.files.push({type: 'download-xls', filename: previewTable.filename + '.xls'});
          previewTable.files.push({type: 'html', filename: previewTable.filename + '.html'});
          renderTable(path);
        }
      });
    }

    return false;
  });

  setShortcuts('#table-title');

  function renderTable(path) {
    var iframeMarkup = '<iframe id="preview-frame" style="opacity:0" frameBorder ="0" scrolling = "yes" src="' + path + '"></iframe>';
    console.log(iframeMarkup);
    $('#preview-table').html(iframeMarkup);
    var iframe = $('#preview-frame');
    iframe.load(function () {
      var contents = iframe.contents();
      contents.find('body').css("background", "transparent");
      contents.find('body').css("width", "480px");
      iframe.height(contents.find('html').height());
      iframe.css("opacity", "1");
    });

  }

  $('.btn-table-builder-cancel').on('click', function () {

    $('.table-builder').stop().fadeOut(200).remove();

    // delete the preview table
    if (previewTable) {
      deleteContent(Ermintrude.collection.id, previewTable.uri + ".json");
      $(previewTable.files).each(function (index, file) {
        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Ermintrude.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted table file: " + fileToDelete);
          });
      });
    }
  });


  function saveTableJson(table, success) {

    var tableJson = table.uri + ".json";

    $.ajax({
      url: "/zebedee/content/" + Ermintrude.collection.id + "?uri=" + tableJson,
      type: 'POST',
      data: JSON.stringify(table),
      processData: false,
      contentType: 'application/json',
      success: function () {
        if (success) {
          success();
        }
      }
    });
  }

  function addTableToPageJson(table) {
    if (!pageData.tables) {
      pageData.tables = []
    } else {

      var existingTable = _.find(pageData.tables, function (existingTable) {
        return existingTable.filename === table.filename;
      });

      if (existingTable) {
        existingTable.title = table.title;
        return;
      }
    }

    pageData.tables.push({title: table.title, filename: table.filename, uri: table.uri});
  }

  $('.btn-table-builder-create').on('click', function () {

    // if uploaded = true rename the preview table
    previewTable = buildJsonObjectFromForm(previewTable);

    // if a table exists, rename the preview to its name
    if (table) {
      table = mapJsonValues(previewTable, table);

      $(previewTable.files).each(function (index, file) {
        var fromFile = pageUrl + '/' + file.filename;
        var toFile = pageUrl + '/' + file.filename.replace(previewTable.filename, table.filename);
        console.log("moving... table file: " + fromFile + " to: " + toFile);
        moveContent(Ermintrude.collection.id, fromFile, toFile,
          onSuccess = function () {
            console.log("Moved table file: " + fromFile + " to: " + toFile);
          });
      });
      deleteContent(Ermintrude.collection.id, previewTable.uri + ".json", function(){}, function(){});
    } else { // just keep the preview files
      table = previewTable;
      addTableToPageJson(table);
    }

    saveTableJson(table, success=function() {
      if (onSave) {
        onSave(table.filename, '<ons-table path="' + table.uri + '" />');
      }
      $('.table-builder').stop().fadeOut(200).remove();
    });
  });

  function mapJsonValues(from, to) {
    to = buildJsonObjectFromForm(to);

    $(from.files).each(function (fromIndex, fromFile) {
      var fileExistsInImage = false;

      $(to.files).each(function (toIndex, toFile) {
        if (fromFile.type == toFile.type) {
          fileExistsInImage = true;
          toFile.fileName = fromFile.fileName;
          toFile.fileType = fromFile.fileType;
        }
      });

      if(!fileExistsInImage) {
        to.files.push(fromFile);
      }

    });

    return to;
  }


  function buildJsonObjectFromForm(table) {
    if (!table) {
      table = {};
    }

    table.type = 'table';
    table.title = $('#table-title').val();
    table.filename = table.filename ? table.filename : StringUtils.randomId();

    table.uri = pageUrl + "/" + table.filename;

    if (table.title === '') {
      table.title = '[Title]';
    }

    if (!table.files) {
      table.files = [];
    }

    return table;
  }
}

function loadTablesList(collectionId, data) {
  var html = templates.workEditTables(data);
  $('#tables').replaceWith(html);
  initialiseTablesList(collectionId, data);
}

function refreshTablesList(collectionId, data) {
  var html = templates.workEditTables(data);
  $('#table-list').replaceWith($(html).find('#table-list'));
  initialiseTablesList(collectionId, data);
}

function initialiseTablesList(collectionId, data) {

  $(data.tables).each(function (index, table) {
    var basePath = data.uri;
    var tablePath = basePath + '/' + table.filename;
    var tableJson = tablePath;

    $("#table-copy_" + index).click(function () {
      copyToClipboard('#table-to-be-copied_' + index);
    });

    $("#table-edit_" + index).click(function () {
      getPageData(collectionId, tableJson,
        onSuccess = function (tableData) {
          loadTableBuilder(data, function () {
            Ermintrude.Editor.isDirty = false;
            refreshPreview();
            refreshTablesList(collectionId, data);
          }, tableData);
        })
    });

    $("#table-delete_" + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this table?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          $(this).parent().remove();
          // delete any files associated with the table.
          var extraFiles = [table.filename + '.html', table.filename + '.xls'];
          _(extraFiles).each(function (file) {
            var fileToDelete = basePath + '/' + file;
            deleteContent(collectionId, fileToDelete,
              onSuccess = function () {
              },
              onError = function (error) {
              });
          });

          // remove the table from the page json when its deleted
          data.tables = _(data.tables).filter(function (item) {
            return item.filename !== table.filename
          });
          // save the updated page json
          putContent(collectionId, basePath, JSON.stringify(data),
            success = function () {

              // delete the table json file
              deleteContent(collectionId, tableJson + '.json', onSuccess = function () {}, onError = function (error) {});

              Ermintrude.Editor.isDirty = false;
              refreshTablesList(collectionId, data);

              swal({
                title: "Deleted",
                text: "This table has been deleted",
                type: "success",
                timer: 2000
              });
            },
            error = function (response) {
              if (response.status !== 404)
                handleApiError(response);
            }
          );


        }
      });
    });
  });
  // Make sections sortable
  function sortable() {
    $('#sortable-table').sortable();
  }
  sortable();
}/**
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
 * Manages the editor menus
 * @param collectionId
 * @param pageData
 * @param isPageComplete - if present page has been approved
 */

function makeEditSections(collectionId, pageData, isPageComplete) {

  var templateData = jQuery.extend(true, {}, pageData); // clone page data to add template related properties.
  templateData.isPageComplete = isPageComplete;

  if (pageData.type === 'home_page') {
    var html = templates.workEditT1(templateData);
    $('.workspace-menu').html(html);
    accordion();
    t1Editor(collectionId, pageData, templateData);   //templateData used to resolve section titles
  }

  else if (pageData.type === 'taxonomy_landing_page') {
    var html = templates.workEditT2(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'highlightedLinks', 'highlights');
    accordion();
    t2Editor(collectionId, pageData);
  }

  else if (pageData.type === 'product_page') {
    var html = templates.workEditT3(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'items', 'timeseries');
    editRelated (collectionId, pageData, templateData, 'statsBulletins', 'bulletins');
    editRelated (collectionId, pageData, templateData, 'relatedArticles', 'articles');
    editRelated (collectionId, pageData, templateData, 'datasets', 'datasets');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    accordion();
    t3Editor(collectionId, pageData);
  }

  else if (pageData.type === 'bulletin') {
    var html = templates.workEditT4Bulletin(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedBulletins', 'bulletin');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editLink (collectionId, pageData, 'links', 'link');
    editDocumentCorrection(collectionId, pageData, templateData, 'versions', 'correction');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    bulletinEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article') {
    var html = templates.workEditT4Article(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedArticles', 'article');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editLink (collectionId, pageData, 'links', 'link');
    editDocumentCorrection(collectionId, pageData, templateData, 'versions', 'correction');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    articleEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article_download') {
    var html = templates.workEditT4ArticleDownload(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    addFile(collectionId, pageData, 'downloads', 'file');
    editLink (collectionId, pageData, 'links', 'link');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    editDocWithFilesCorrection(collectionId, pageData, 'versions', 'correction');
    accordion();
    ArticleDownloadEditor(collectionId, pageData);
  }

  else if (pageData.type === 'timeseries') {
    var html = templates.workEditT5(templateData);
    $('.workspace-menu').html(html);
    editMarkdownOneObject (collectionId, pageData, 'section');
    editMarkdownWithNoTitle (collectionId, pageData, 'notes', 'note');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'timeseries');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    timeseriesEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium_landing_page') {
    var html = templates.workEditT6(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    compendiumEditor(collectionId, pageData, templateData);     //templateData used to resolve chapter titles
  }

  else if (pageData.type === 'compendium_chapter') {
    var html = templates.workEditT4Compendium(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editLink (collectionId, pageData, 'links', 'link');
    editDocumentCorrection(collectionId, pageData, templateData, 'versions', 'correction');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    compendiumChapterEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium_data') {
    var html = templates.workEditT8Compendium(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    addFileWithDetails (collectionId, pageData, 'downloads', 'file');
    editDocWithFilesCorrection(collectionId, pageData, 'versions', 'correction');
    accordion();
    compendiumDataEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_landing_page') {
    var html = templates.workEditT7Landing(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    accordion();
    staticLandingPageEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_page') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile(collectionId, pageData, 'downloads', 'file');
    editLink (collectionId, pageData, 'links', 'link');
    accordion();
    staticPageEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_qmi') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile(collectionId, pageData, 'downloads', 'file');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    accordion();
    qmiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_foi') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile (collectionId, pageData, 'downloads', 'file');
    accordion();
    foiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_adhoc') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile (collectionId, pageData, 'downloads', 'file');
    accordion();
    adHocEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_methodology') {
    var html = templates.workEditT4Methodology(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    methodologyEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_methodology_download') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile(collectionId, pageData, 'downloads', 'file');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    methodologyDownloadEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset_landing_page') {
    var html = templates.workEditT8LandingPage(templateData);
    $('.workspace-menu').html(html);
    editMarkdownOneObject (collectionId, pageData, 'section', 'Notes');
    addDataset (collectionId, pageData, 'datasets', 'edition');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    datasetLandingEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset') {
    var html = templates.workEditT8(templateData);
    $('.workspace-menu').html(html);
    editDatasetVersion(collectionId, pageData, 'versions', 'version');
    addFile (collectionId, pageData, 'supplementaryFiles', 'supplementary-files');
    editDatasetVersion(collectionId, pageData, 'versions', 'correction');
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else if (pageData.type === 'timeseries_dataset') {
    var html = templates.workEditT8(templateData);
    $('.workspace-menu').html(html);
    editDatasetVersion(collectionId, pageData, 'versions', 'version');
    addFile (collectionId, pageData, 'supplementaryFiles', 'supplementary-files');
    editDatasetVersion(collectionId, pageData, 'versions', 'correction');
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else if (pageData.type === 'release') {
    var html = templates.workEditT16(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'prerelease');
    editDate (collectionId, pageData, templateData, 'dateChanges', 'changeDate');
    //editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    //editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'data');
    accordion();
    releaseEditor(collectionId, pageData, templateData);
  }

  else {

    var workspace_menu_sub_edit =
      '<section class="workspace-edit">' +
      '  <p style="font-size:20px; color:red;">Page: ' + pageData.type + ' is not supported.</p>' +
      '  <textarea class="fl-editor__headline" name="fl-editor__headline" style="height: 728px" cols="104"></textarea>' +
      '  <nav class="edit-nav">' +
      '  </nav>' +
      '</section>';

    $('.workspace-menu').html(workspace_menu_sub_edit);
    $('.fl-editor__headline').val(JSON.stringify(pageData, null, 2));

    refreshEditNavigation();

    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {
      pageData = $('.fl-editor__headline').val();
      updateContent(collectionId, pageData.uri, pageData);
    });

    // complete
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      pageData = $('.fl-editor__headline').val();
      saveAndCompleteContent(collectionId, pageData.uri, pageData);
    });

    // review
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      pageData = $('.fl-editor__headline').val();
      saveAndReviewContent(collectionId, pageData.uri, pageData);
    });
  }

  // Listen on all input within the workspace edit panel for dirty checks.
  $('.workspace-edit :input').on('input', function () {
    Ermintrude.Editor.isDirty = true;
    // remove the handler now we know content has changed.
    //$(':input').unbind('input');
    //console.log('Changes detected.');
  });
}

function refreshEditNavigation() {
  getCollection(Ermintrude.collection.id,
    success = function (collection) {
      var pagePath = getPathName();
      var pageFile = pagePath + '/data.json';
      var lastCompletedEvent = getLastCompletedEvent(collection, pageFile);
      var isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === Ermintrude.Authentication.loggedInEmail());

      var editNav = templates.editNav({isPageComplete: isPageComplete});
      $('.edit-nav').html(editNav);
    },
    error = function (response) {
      handleApiError(response);
    })
}function makeUrl(args) {
  var accumulator;
  accumulator = [];
  for(var i=0; i < arguments.length; i++) {
    accumulator =  accumulator.concat(arguments[i]
                              .split('/')
                              .filter(function(argument){return argument !== "";}));
  }
  return accumulator.join('/');
}

function markDownEditorSetLines() {
  var textarea = $("#wmd-input");
  // var linesHolder = $('.markdown-editor-line-numbers');
  var textareaWidth = textarea.width();
  var charWidth = 7;
  var lineHeight = 21;
  var textareaMaxChars = Math.floor(textareaWidth / charWidth);
  var lines = textarea.val().split('\n');
  var linesLi = '';
  var cursorEndPos = textarea.prop('selectionEnd');
  var charMapArray = [];
  var charMapArrayJoin = [];
  var lineLengthArray = [];
  var contentLength = textarea.val().length;
  var cumulativeLineLength = 0;
  // var cursorLine = textarea.prop('selectionStart').split('\n').length;
  $.each(lines, function(index){
    var lineNumber = index + 1;
    var lineLength = this.length;
    var lineWrap = Math.round(lineLength / textareaMaxChars);
    // var lineWrap = Math.floor(lineLength / textareaMaxChars);
    // var lineWrap = Math.ceil(lineLength / textareaMaxChars);

    //console.log('max chars: ' + textareaMaxChars);
    //console.log('line length: ' + lineLength);

    var numberOfLinesCovered = StringUtils.textareaLines(this, textareaMaxChars, 0, 0);
    var liPaddingBottom = numberOfLinesCovered * lineHeight;

    if(lineNumber === 1) {
      cumulativeLineLength += lineLength;
    } else {
      cumulativeLineLength += lineLength + 1;
      // console.log('+1');
    }

    linesLi += '<li id="markdownEditorLine-' + lineNumber + '" style="padding-bottom:' + liPaddingBottom +'px">&nbsp;</li>';
    lineLengthArray.push(cumulativeLineLength);

    //push to charmap
    // charMapArray.push(this.replace(this.split(''), lineNumber));
    // console.log(this.selectionStart);
    //console.log('line wrap: ' + lineWrap + ' (' + lineLength / textareaMaxChars + ')');
  });

  if(linesLi) {
    var linesOl = '<ol>' + linesLi + '</ol>';
    $('.markdown-editor-line-numbers').html(linesOl);
    // console.log(linesOl);
  }

  //sync scroll
  // $('.markdown-editor-line-numbers ol').css('margin-top', -textarea.scrollTop());
  // textarea.on('scroll', function () {
  //   // var editorHeight = $('.wmd-input').height();
  //   // var previewHeight = $('.wmd-preview').height();
  //   // console.log(editorHeight);
  //   var marginTop = $(this).scrollTop();
  //   $('.markdown-editor-line-numbers ol').css('margin-top', -marginTop);
  //   $('.wmd-preview').scrollTop(marginTop);
  // });


  //proportional scroll
  //var $wmdscrollsync = $('.wmd-input, .wmd-preview');
  //var wmdsync = function(e){
  //    var $other = $wmdscrollsync.not(this).off('scroll'), other = $other.get(0);
  //    var percentage = this.scrollTop / (this.scrollHeight - this.offsetHeight);
  //    other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight);
  //    setTimeout( function(){ $other.on('scroll', wmdsync ); },10);
  //}
  //$wmdscrollsync.on( 'scroll', wmdsync);



  for (var i = 0; i < lineLengthArray.length; i++) {
    if(cursorEndPos <= lineLengthArray[i]) {
      // console.log(i + 1);
      var activeLine = i + 1;
      $('#markdownEditorLine-' + activeLine).addClass('active');
      break;
    }
    // console.log(lineLengthArray[i]);
    //Do something
  }



}
function moveContent(collectionId, path, newPath, success, error) {
  $.ajax({
    url: "/zebedee/contentmove/" + collectionId + "?uri=" + checkPathSlashes(path) + "&toUri=" + checkPathSlashes(newPath),
    type: 'POST',
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

function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}

function postApproveCollection(collectionId) {
  $.ajax({
    url: "/zebedee/approve/" + collectionId,
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    type: 'POST',
    success: function (response) {
      //console.log(response);
      //console.log(collectionId + ' collection is now approved');
      $('.over').remove();
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
      // Wait until the animation ends
      setTimeout(function(){
        viewController('collections');
      }, 500);
    },
    error: function (response) {
      $('.over').remove();
      if (response.status === 409) {
        sweetAlert("Cannot approve this collection", "It contains files that have not been approved.");
      }
      else {
        handleApiError(response);
      }
    }
  });
}
function saveAndCompleteContent(collectionId, path, content, redirectToPath) {
  putContent(collectionId, path, content,
    success = function () {
      Ermintrude.Editor.isDirty = false;
      if (redirectToPath) {
        completeContent(collectionId, path, redirectToPath);
      } else {
        completeContent(collectionId, path);
      }
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    });
}

function completeContent(collectionId, path, redirectToPath) {
  var redirect = redirectToPath;
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Ermintrude.globalVars.welsh) {
    var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data_cy.json";
  } else {
    var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data.json";
  }
  // Update content
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    success: function () {
      if (redirect) {
        createWorkspace(redirect, collectionId, 'edit');
        return;
      } else {
        viewCollections(collectionId);
      }
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}
function postContent(collectionId, path, content, overwriteExisting, success, error) {
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Ermintrude.globalVars.welsh) {
    var url = "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data_cy.json";
    var toAddLang = JSON.parse(content);
    toAddLang.description.language = 'cy';
    content = JSON.stringify(toAddLang);
  } else {
    var url = "/zebedee/content/" + collectionId + "?uri=" + safePath + "/data.json";
  }

  var url = url + '&overwriteExisting=' + overwriteExisting;

  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: content,
    success: function (response) {
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
}function saveAndReviewContent(collectionId, path, content, redirectToPath) {
  putContent(collectionId, path, content,
    success = function (response) {
      Ermintrude.Editor.isDirty = false;
      if (redirectToPath) {
        postReview(collectionId, path, redirectToPath);
      } else {
        postReview(collectionId, path);
      }
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    });
}

function postReview(collectionId, path, redirectToPath) {
  var redirect = redirectToPath;
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Ermintrude.globalVars.welsh) {
    var url = "/zebedee/review/" + collectionId + "?uri=" + safePath + "/data_cy.json";
  } else {
    var url = "/zebedee/review/" + collectionId + "?uri=" + safePath + "/data.json";
  }
  // Open the file for editing
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    success: function () {
      if (redirect) {
        createWorkspace(redirect, collectionId, 'edit');
        return;
      } else {
        viewCollections(collectionId);
      }
    },
    error: function () {
      console.log('Error');
    }
  });
}
function postUser(name, email, password) {

  $.ajax({
    url: "/zebedee/users",
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({
      name: name,
      email: email
    }),
    success: function () {
      console.log('User created');
      setPassword();
    },
    error: function (response) {
      handleUserPostError(response);
    }
  });

  /**
   * Once the user is created do a seperate post to the zebedee API
   * to set the password.
   */
  function setPassword() {
    postPassword(
      success = function () {
        console.log('Password set');
        setPermissions()
      },
      error = null,
      email,
      password);
  }

  /**
   * Once the user is created and the password is set, set the permissions for the user.
   */
  function setPermissions() {
    postPermission(
      success = function () {
        sweetAlert("User created", "User '" + email + "' has been created", "success");
        viewController('users');
      },
      error = null,
      email = email,
      admin = false,
      editor = true);
  }

  /**
   * Handle error response from creating the user.
   * @param response
   */
  function handleUserPostError(response) {
    if (response.status === 403 || response.status === 401) {
      sweetAlert("You are not permitted to create users.")
    }
    else if (response.status === 409) {
      sweetAlert("Error", response.responseJSON.message, "error")
    } else {
      handleApiError(response);
    }
  }
}function publish(collectionId) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/publish/" + collectionId,
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    type: 'POST',
    success: function (response) {
      $('.over').remove();

      if(response) {
        sweetAlert("Published!", "Your collection has successfully published", "success");

        $('.publish-selected').animate({right: "-50%"}, 500);
        // Wait until the animation ends
        setTimeout(function () {
          viewController('publish');
        }, 500);
      } else {
        console.log('An error has occurred during the publish process, please contact an administrator. ' + response);
        sweetAlert("Oops!", 'An error has occurred during the publish process, please contact an administrator.', "error");
      }
    },
    error: function (response) {
      $('.over').remove();
      handleApiError(response);
    }
  });
}

function unlock(collectionId) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/unlock/" + collectionId,
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    type: 'POST',
    success: function () {
      sweetAlert("Unlocked!", "Your collection has be unlocked from publishing", "success");
      $('.publish-selected').animate({right: "-50%"}, 500);
      // Wait until the animation ends
      setTimeout(function () {
        viewController('publish');
      }, 500);
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}

function putContent(collectionId, path, content, success, error) {
  postContent(collectionId, path, content, true,
    onSuccess = function () {
      if(success) {
        success();
      }
    },
    onError = function (response) {
      if (error) {
        error(response);
      }
      else {
        handleApiError(response);
      }
    }
  );
}
function refreshPreview(url) {

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

function renameCompendiumChildren (arrayToRename, titleNoSpace, editionNoSpace) {
  arrayToRename.forEach(function (elem, index, array) {
    var x = elem.uri.split("/");
    x.splice([x.length - 3], 2, titleNoSpace, editionNoSpace);
    elem.uri = x.join("/");
  });
  return arrayToRename;
}

function renameDatasetChildren (arrayToRename, titleNoSpace) {
  arrayToRename.forEach(function (elem, index, array) {
    var x = elem.uri.split("/");
    x.splice([x.length - 2], 1, titleNoSpace);
    elem.uri = x.join("/");
  });
  return arrayToRename;
}

/**
 * Save new content.
 * @param collectionId
 * @param uri
 * @param data
 */
function saveContent(collectionId, uri, data) {
  postContent(collectionId, uri, JSON.stringify(data), false,
    success = function (message) {
      console.log("Updating completed " + message);
      createWorkspace(uri, collectionId, 'edit');
    },
    error = function (response) {
      if (response.status === 409) {
        sweetAlert("Cannot create this page", "It already exists.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}
function saveNewCorrection (collectionId, path, success, error) {
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  var url = "/zebedee/version/" + collectionId + "?uri=" + safePath;

  // Update content
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    success: function (response) {
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

function saveRelated (collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function (response) {
      console.log("Updating completed " + response);
      Ermintrude.Editor.isDirty = false;
      resolveTitle(collectionId, data, templateData, field, idField);
      refreshPreview(path);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.addEventListener('click', Ermintrude.Handler, true);
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

function setShortcuts(field) {
  $(field).select(function (e) {
    $(field).on('keydown', null, 'ctrl+m', function (ev) {
      var inputValue = $(field).val();
      var start = e.target.selectionStart;
      var end = e.target.selectionEnd;
      var outputValue = [inputValue.slice(0, start), "^", inputValue.slice(start, end), "^", inputValue.slice(end)].join('');
      $(field).val(outputValue);
      ev.stopImmediatePropagation();
      ev.preventDefault();
    });
    $(field).on('keyup', null, 'ctrl+q', function (ev) {
      var inputValue = $(field).val();
      var start = e.target.selectionStart;
      var end = e.target.selectionEnd;
      var outputValue = [inputValue.slice(0, start), "~", inputValue.slice(start, end), "~", inputValue.slice(end)].join('');
      $(field).val(outputValue);
      ev.stopImmediatePropagation();
    });
  });
}function setupErmintrude() {
  window.templates = Handlebars.templates;
  Handlebars.registerPartial("browseNode", templates.browseNode);
  Handlebars.registerPartial("editNav", templates.editNav);
  Handlebars.registerPartial("editNavChild", templates.editNavChild);
  Handlebars.registerPartial("selectorHour", templates.selectorHour);
  Handlebars.registerPartial("selectorMinute", templates.selectorMinute);
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
  Handlebars.registerHelper('lastEditedBy', function(array) {
    if(array) {
      var event = array[array.length - 1];
      return 'Last edited ' + StringUtils.formatIsoDateString(new Date(event.date)) + " by " + event.email;
    }
    return '';
  });
  Handlebars.registerHelper('createdBy', function(array) {
    if(array) {
      var event = getCollectionCreatedEvent(array);
      if (event) {
        return 'Created ' + StringUtils.formatIsoDateString(new Date(event.date)) + " by " + event.email + '';
      } else {
        return "";
      }
    }
    return "";
  });




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
    } else if (menuItem.hasClass("nav--admin__item--users")) {
      viewController('users');
    } else if (menuItem.hasClass("nav--admin__item--publish")) {
      viewController('publish');
    } else if (menuItem.hasClass("nav--admin__item--reports")) {
        viewController('reports');
    } else if (menuItem.hasClass("nav--admin__item--login")) {
      viewController('login');
    } else if (menuItem.hasClass("nav--admin__item--logout")) {
      logout();
      viewController();
    }
  }
}

function releaseEditor(collectionId, data) {
  var setActiveTab, getActiveTab;
  var timeoutId;
  var renameUri = false;
  var pageDataRequests = [];
  var pages = {};

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  processCollection(collectionId, 'noSave');

  $("#title").on('input', function () {
    renameUri = true;
    data.description.title = $(this).val();
  });
  $("#provisionalDate").on('input', function () {
    data.description.provisionalDate = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  var dateTmp = data.description.releaseDate;
  var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
  $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'});
  if (!data.description.finalised) {
    $('.release-date').on('change', function () {
      var publishTime  = parseInt($('#release-hour').val()) + parseInt($('#release-min').val());
      var toIsoDate = $('#releaseDate').datepicker("getDate");
      data.description.releaseDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    $('.release-date').on('change', function () {
      swal ({
        title: "Warning",
        text: "You will need to add an explanation for this change. Are you sure you want to proceed?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel"
      }, function(result){
        if (result === true) {
          saveOldDate(collectionId, data, dateTmp);
          var publishTime  = parseInt($('#release-hour').val()) + parseInt($('#release-min').val());
          var toIsoDate = $('#releaseDate').datepicker("getDate");
          data.description.releaseDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
        } else {
          $('#releaseDate').val(dateTmpFormatted);
        }
      });
    });
  }

  var date = new Date(data.description.releaseDate);
  var hour = date.getHours();
  $('#release-hour').val(hour*3600000);

  var minutes = date.getMinutes();
  $('#release-min').val(minutes*60000);

  $("#nextRelease").on('input', function () {
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function (id) {
    if (id === 'natStat') {
      if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
        return false;
      } else {
        return true;
      }
    } else if (id === 'cancelled') {
      if (data.description.cancelled === "false" || data.description.cancelled === false) {
        return false;
      } else {
        return true;
      }
    } else if (id === 'finalised') {
      if (data.description.finalised === "false" || data.description.finalised === false) {
        return false;
      } else {
        return true;
      }
    }
  };

  // Gets status of checkbox and sets JSON to match
  $("#natStat input[type='checkbox']").prop('checked', checkBoxStatus($('#natStat').attr('id'))).click(function () {
    data.description.nationalStatistic = $("#natStat input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $("#cancelled input[type='checkbox']").prop('checked', checkBoxStatus($('#cancelled').attr('id'))).click(function () {
    data.description.cancelled = $("#cancelled input[type='checkbox']").prop('checked') ? true : false;
    if (data.description.cancelled) {
      var editedSectionValue = {};
      editedSectionValue.title = "Please enter the reason for the cancellation";
      var saveContent = function (updatedContent) {
        data.description.cancellationNotice = [updatedContent];
        putContent(collectionId, data.uri, JSON.stringify(data),
          success = function () {
            Ermintrude.Editor.isDirty = false;
            loadPageDataIntoEditor(data.uri, collectionId);
            refreshPreview(data.uri);
          },
          error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    } else {
      data.description.cancellationNotice = [];
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  if (data.description.finalised) {
    $("#finalised input[type='checkbox']").prop('checked', checkBoxStatus($('#finalised').attr('id'))).click(function (e) {
      sweetAlert('You cannot change this field once it is finalised.');
      e.preventDefault();
    });
  } else {
    $("#finalised input[type='checkbox']").prop('checked', checkBoxStatus($('#finalised').attr('id'))).click(function () {
      swal ({
        title: "Warning",
        text: "You will not be able reset the date to provisional once you've done this. Are you sure you want to proceed?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel"
      }, function(result){
        if (result) {
          data.description.finalised = $("#finalised input[type='checkbox']").prop('checked') ? true : false;
          if (data.description.finalised) {
            // remove provisional date
            data.description.provisionalDate = "";
            $('.provisional-date').remove();
            $('#finalised').remove();
          }
          clearTimeout(timeoutId);
          timeoutId = setTimeout(function () {
            autoSaveMetadata(collectionId, data);
          }, 3000);
        } else {
          $("#finalised input[type='checkbox']").prop('checked', false);
        }
      });
    });
  }

  $("#dateChange").on('input', function () {
    data.dateChanges.previousDate = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  function saveOldDate(collectionId, data, oldDate) {
    data.dateChanges.push({previousDate: oldDate, changeNotice: ""});
    initialiseLastNoteMarkdown(collectionId, data, 'dateChanges', 'changeNotice');
  }

  $('#add-preview').click(function () {
    //Check if it is article, bulletin or dataset
    processCollection(collectionId);
  });

  function processCollection(collectionId, noSave) {
    pageDataRequests.push(
      getCollectionDetails(collectionId,
        success = function (response) {
          pages = response;
        },
        error = function (response) {
          handleApiError(response);
        }
      )
    );
    $.when.apply($, pageDataRequests).then(function () {
      processPreview(data, pages);
      if (noSave) {
        putContent(collectionId, data.uri, JSON.stringify(data),
          success = function () {
            Ermintrude.Editor.isDirty = false;
            refreshPreview(data.uri);
          },
          error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            } else {
              handleApiError(response);
            }
          }
        );
      } else {
        updateContent(collectionId, data.uri, JSON.stringify(data));
      }
    });
  }

  //Add uri to relatedDocuments or relatedDatasets
  function processPreview(data, pages) {
    data.relatedDocuments = [];
    data.relatedDatasets = [];
    _.each(pages.inProgress, function (page) {
      if (page.type === 'article' || page.type === 'bulletin' || page.type === 'compendium_landing_page') {
        data.relatedDocuments.push({uri: page.uri});
        console.log(page.uri);
      } else if (page.type === 'dataset_landing_page') {
        data.relatedDatasets.push({uri: page.uri});
      }
    });
    _.each(pages.complete, function (page) {
      if (page.type === 'article' || page.type === 'bulletin' || page.type === 'compendium_landing_page') {
        data.relatedDocuments.push({uri: page.uri});
        console.log(page.uri);
      } else if (page.type === 'dataset_landing_page') {
        data.relatedDatasets.push({uri: page.uri});
      }
    });
    _.each(pages.reviewed, function (page) {
      if (page.type === 'article' || page.type === 'bulletin' || page.type === 'compendium_landing_page') {
        data.relatedDocuments.push({uri: page.uri});
        console.log(page.uri);
      } else if (page.type === 'dataset_landing_page') {
        data.relatedDatasets.push({uri: page.uri});
      }
    });
  }

  //Save and update preview page
  //Get collection content

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function t1Editor(collectionId, data, templateData) {

  var newSections = [];
  var setActiveTab, getActiveTab;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);

  resolveTitleT1(collectionId, data, templateData, 'sections');

  // Metadata edition and saving
  if (Ermintrude.globalVars.welsh) {
    $("#title").on('input', function () {
      $(this).textareaAutoSize();
      data.description.title = $(this).val();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    $(".title").remove();
  }
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });


  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, '', JSON.stringify(data));
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    //pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionId, '', JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, '', JSON.stringify(data));
  });

  function save() {
    // sections
    var orderSections = $("#sortable-section").sortable('toArray');
    $(orderSections).each(function (indexS, nameS) {
      var uri = data.sections[parseInt(nameS)].statistics.uri;
      var safeUri = checkPathSlashes(uri);
      var link = data.sections[parseInt(nameS)].theme.uri;
      newSections[parseInt(indexS)] = {
        theme: {uri: link},
        statistics: {uri: safeUri}
      };
    });
    data.sections = newSections;
  }
}

function resolveTitleT1(collectionId, data, templateData, field) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    var eachUri = path.statistics.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      success = function (response) {
        templateData[field][index].statistics.title = response.title;
        dfd.resolve();
      },
      error = function () {
        sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    var dataTemplate = templateData[field];
    var html = templates.workEditT1Sections(dataTemplate);
    $('#to-populate').replaceWith(html);

    //Edit section
    $(data.sections).each(function (index, section) {
//  lastIndexSections = index + 1;
      $("#section-edit_" + index).on('click', function () {
        swal ({
          title: "Warning",
          text: "If you do not come back to this page, you will lose any unsaved changes",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel"
        }, function(result) {
          if (result === true) {
            var iframeEvent = document.getElementById('iframe').contentWindow;
            iframeEvent.removeEventListener('click', Ermintrude.Handler, true);
            createWorkspace('/', collectionId, '', true);

            $('#' + index).replaceWith(
              '<div id="' + index + '" class="edit-section__sortable-item">' +
              '  <textarea id="uri_' + index + '" placeholder="Go to the related document and click Get"></textarea>' +
              '  <button class="btn-page-get" id="section-get_' + index + '">Get</button>' +
              '  <button class="btn-page-cancel" id="section-cancel_' + index + '">Cancel</button>' +
              '</div>');
            $("#section-cancel_" + index).hide();

            $("#section-get_" + index).one('click', function () {
              var pastedUrl = $('#uri_' + index).val();
              if (!pastedUrl) {
                pastedUrl = getPathNameTrimLast();
              } else {
                pastedUrl = checkPathParsed(pastedUrl);
              }
              var sectionUrlData = pastedUrl + "/data";

              $.ajax({
                url: sectionUrlData,
                dataType: 'json',
                crossDomain: true,
                success: function (sectionData) {
                  if (sectionData.type === 'timeseries') {
                    data.sections.splice(index, 1,
                      {
                        theme: {uri: getTheme(sectionData.uri)},
                        statistics: {uri: sectionData.uri}
                      });
                    putContent(collectionId, '', JSON.stringify(data),
                      success = function (response) {
                        console.log("Updating completed " + response);
                        Ermintrude.Editor.isDirty = false;
                        createWorkspace('/', collectionId, 'edit');
                      },
                      error = function (response) {
                        if (response.status === 400) {
                          sweetAlert("Cannot edit this page", "It is already part of another collection.");
                        }
                        else {
                          handleApiError(response);
                        }
                      }
                    );
                  } else {
                    sweetAlert("This is not a time series");
                  }
                },
                error: function () {
                  console.log('No page data returned');
                }
              });
            });

            $("#section-cancel_" + index).show().one('click', function () {
              createWorkspace('', collectionId, 'edit');
            });
          }
        });
      });
    });

    function sortableSections() {
      $("#sortable-section").sortable();
    }

    sortableSections();

  });
}

function getTheme(uri) {
  var parts = uri.split('/');
  var theme = parts.splice(0, 2);
  return theme.join('/');
}
function t2Editor(collectionId, data) {

  var newHighlights = [];
  var setActiveTab, getActiveTab;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });

  function save() {
    // Highligths
    var orderHighlights = $("#sortable-highlights").sortable('toArray');
    $(orderHighlights).each(function (indexH, titleH) {
      var uri = data.highlightedLinks[parseInt(titleH)].uri;
      var safeUri = checkPathSlashes(uri);
      newHighlights[indexH] = {uri: safeUri};
    });
    data.highlightedLinks = newHighlights;
  }
}

function t3Editor(collectionId, data) {

  var newTimeseries = [], newBulletins = [], newArticles = [], newDatasets = [], newRelatedQmi = [], newRelatedMethodology = [];
  var setActiveTab, getActiveTab;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });


  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    //pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });

  function save() {
    // Timeseries
    var orderTimeseries = $("#sortable-timeseries").sortable('toArray');
    $(orderTimeseries).each(function (indexT, titleT) {
      var uri = data.items[parseInt(titleT)].uri;
      var safeUri = checkPathSlashes(uri);
      newTimeseries[indexT] = {uri: safeUri};
    });
    data.items = newTimeseries;
    // Bulletins
    var orderBulletins = $("#sortable-bulletins").sortable('toArray');
    $(orderBulletins).each(function (indexB, titleB) {
      var uri = data.statsBulletins[parseInt(titleB)].uri;
      var safeUri = checkPathSlashes(uri);
      newBulletins[indexB] = {uri: safeUri};
    });
    data.statsBulletins = newBulletins;
    // Articles
    var orderArticles = $("#sortable-articles").sortable('toArray');
    $(orderArticles).each(function (indexA, titleA) {
      var uri = data.relatedArticles[parseInt(titleA)].uri;
      var safeUri = checkPathSlashes(uri);
      newArticles[indexA] = {uri: safeUri};
    });
    data.relatedArticles = newArticles;
    // Datasets
    var orderDatasets = $("#sortable-datasets").sortable('toArray');
    $(orderDatasets).each(function (indexD, titleD) {
      var uri = data.datasets[parseInt(titleD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDatasets[indexD] = {uri: safeUri};
    });
    data.datasets = newDatasets;
    // qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;
  }
}

function ArticleDownloadEditor(collectionId, data) {

//  var index = data.release;
  var newFiles = [], newChart = [], newTable = [], newImage = [], newData = [], newLinks = [], newRelatedQmi = [], newRelatedMethodology = [], newDocuments = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });
  //if (!Ermintrude.collection.date) {                        //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    //dateTmp = $('#releaseDate').val();
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#abstract").on('input', function () {
    $(this).textareaAutoSize();
    data.description._abstract = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    }
    return true;
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $('#add-chart').click(function () {
    loadChartBuilder(data, function () {
      refreshPreview();

      putContent(collectionId, data.uri, JSON.stringify(data),
        success = function () {
          Ermintrude.Editor.isDirty = false;
          refreshPreview();
          refreshChartList(collectionId, data);
        },
        error = function (response) {
          handleApiError(response);
        }
      );
    });
  });

  $('#add-table').click(function () {
    loadTableBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      refreshPreview();
      refreshTablesList(collectionId, data);
    });
  });

  $('#add-image').click(function () {
    loadImageBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      //refreshPreview();
      refreshImagesList(collectionId, data);
    });
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    data.markdown = [$('#content-markdown').val()];
    // charts
    var orderChart = $("#sortable-chart").sortable('toArray');
    $(orderChart).each(function (indexCh, nameCh) {
      var uri = data.charts[parseInt(nameCh)].uri;
      var title = data.charts[parseInt(nameCh)].title;
      var filename = data.charts[parseInt(nameCh)].filename;
      var safeUri = checkPathSlashes(uri);
      newChart[indexCh] = {uri: safeUri, title: title, filename: filename};
    });
    data.charts = newChart;
    // tables
    var orderTable = $("#sortable-table").sortable('toArray');
    $(orderTable).each(function (indexTable, nameTable) {
      var uri = data.tables[parseInt(nameTable)].uri;
      var title = data.tables[parseInt(nameTable)].title;
      var filename = data.tables[parseInt(nameTable)].filename;
      var safeUri = checkPathSlashes(uri);
      newTable[indexTable] = {uri: safeUri, title: title, filename: filename};
    });
    data.tables = newTable;
    // images
    var orderImage = $("#sortable-image").sortable('toArray');
    $(orderImage).each(function (indexImage, nameImage) {
      var uri = data.images[parseInt(nameImage)].uri;
      var title = data.images[parseInt(nameImage)].title;
      var filename = data.images[parseInt(nameImage)].filename;
      var safeUri = checkPathSlashes(uri);
      newImage[indexImage] = {uri: safeUri, title: title, filename: filename};
    });
    data.images = newImage;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocuments[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newDocuments;
    // Related data
    var orderData = $("#sortable-data").sortable('toArray');
    $(orderData).each(function (indexDat, nameDat) {
      var uri = data.relatedData[parseInt(nameDat)].uri;
      var safeUri = checkPathSlashes(uri);
      newData[indexDat] = {uri: safeUri};
    });
    data.relatedData = newData;
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#file-title_' + nameF).val();
      var file = data.downloads[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.downloads = newFiles;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = $('#link-markdown_' + nameL).val();
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;
    // Related qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}


function articleEditor(collectionId, data) {

  var newSections = [], newTabs = [], newChart = [], newTable = [], newImage = [], newArticle = [], newDocuments = [], newData = [], newLinks = [], newRelatedQmi = [], newRelatedMethodology = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });

  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#abstract").on('input', function () {
    $(this).textareaAutoSize();
    data.description._abstract = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $('#add-chart').click(function () {
    loadChartBuilder(data, function () {
      refreshPreview();

      putContent(collectionId, data.uri, JSON.stringify(data),
        success = function () {
          Ermintrude.Editor.isDirty = false;
          refreshPreview();
          refreshChartList(collectionId, data);
        },
        error = function (response) {
          handleApiError(response);
        }
      );
    });
  });

  $('#add-table').click(function () {
    loadTableBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      refreshPreview();
      refreshTablesList(collectionId, data);
    });
  });

  $('#add-image').click(function () {
    loadImageBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      //refreshPreview();
      refreshImagesList(collectionId, data);
    });
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var markdown = data.sections[parseInt(nameS)].markdown;
      var title = $('#section-title_' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $("#sortable-tab").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab-title_' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    // charts
    var orderChart = $("#sortable-chart").sortable('toArray');
    $(orderChart).each(function (indexCh, nameCh) {
      var uri = data.charts[parseInt(nameCh)].uri;
      var title = data.charts[parseInt(nameCh)].title;
      var filename = data.charts[parseInt(nameCh)].filename;
      var safeUri = checkPathSlashes(uri);
      newChart[indexCh] = {uri: safeUri, title: title, filename: filename};
    });
    data.charts = newChart;
    // tables
    var orderTable = $("#sortable-table").sortable('toArray');
    $(orderTable).each(function (indexTable, nameTable) {
      var uri = data.tables[parseInt(nameTable)].uri;
      var title = data.tables[parseInt(nameTable)].title;
      var filename = data.tables[parseInt(nameTable)].filename;
      var safeUri = checkPathSlashes(uri);
      newTable[indexTable] = {uri: safeUri, title: title, filename: filename};
    });
    data.tables = newTable;
    // images
    var orderImage = $("#sortable-image").sortable('toArray');
    $(orderImage).each(function (indexImage, nameImage) {
      var uri = data.images[parseInt(nameImage)].uri;
      var title = data.images[parseInt(nameImage)].title;
      var filename = data.images[parseInt(nameImage)].filename;
      var safeUri = checkPathSlashes(uri);
      newImage[indexImage] = {uri: safeUri, title: title, filename: filename};
    });
    data.images = newImage;
    // Related articles TO BE DELETED
    var orderArticle = $("#sortable-article").sortable('toArray');
    $(orderArticle).each(function (indexA, nameA) {
      var uri = data.relatedArticles[parseInt(nameA)].uri;
      var safeUri = checkPathSlashes(uri);
      newArticle[indexA] = {uri: safeUri};
    });
    data.relatedArticles = newArticle;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexDoc, nameDoc) {
      var uri = data.relatedDocuments[parseInt(nameDoc)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocuments[indexDoc] = {uri: safeUri};
    });
    data.relatedDocuments = newDocuments;
    // Related data
    var orderData = $("#sortable-data").sortable('toArray');
    $(orderData).each(function (indexD, nameD) {
      var uri = data.relatedData[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newData[indexD] = {uri: safeUri};
    });
    data.relatedData = newData;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = $('#link-markdown_' + nameL).val();
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;
    // Related qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function bulletinEditor(collectionId, data) {

//  var index = data.release;
  var newSections = [], newTabs = [], newChart = [], newTable = [], newImage = [], newBulletin = [], newDocuments = [], newData = [], newLinks = [], newRelatedQmi = [], newRelatedMethodology = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });
  //if (!Ermintrude.collection.date) {                        //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    //dateTmp = $('#releaseDate').val();
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#headline1").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline1 = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#headline2").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline2 = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#headline3").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline3 = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    }
    return true;
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $('#add-chart').click(function () {
    loadChartBuilder(data, function () {
      refreshPreview();

      putContent(collectionId, data.uri, JSON.stringify(data),
        success = function () {
          Ermintrude.Editor.isDirty = false;
          refreshPreview();
          refreshChartList(collectionId, data);
        },
        error = function (response) {
          handleApiError(response);
        }
      );
    });
  });

  $('#add-table').click(function () {
    loadTableBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      refreshPreview();
      refreshTablesList(collectionId, data);
    });
  });

  $('#add-image').click(function () {
    loadImageBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      //refreshPreview();
      refreshImagesList(collectionId, data);
    });
  });


  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var markdown = data.sections[parseInt(nameS)].markdown;
      var title = $('#section-title_' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $("#sortable-tab").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab-title_' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    // charts
    var orderChart = $("#sortable-chart").sortable('toArray');
    $(orderChart).each(function (indexCh, nameCh) {
      var uri = data.charts[parseInt(nameCh)].uri;
      var title = data.charts[parseInt(nameCh)].title;
      var filename = data.charts[parseInt(nameCh)].filename;
      var safeUri = checkPathSlashes(uri);
      newChart[indexCh] = {uri: safeUri, title: title, filename: filename};
    });
    data.charts = newChart;
    // tables
    var orderTable = $("#sortable-table").sortable('toArray');
    $(orderTable).each(function (indexTable, nameTable) {
      var uri = data.tables[parseInt(nameTable)].uri;
      var title = data.tables[parseInt(nameTable)].title;
      var filename = data.tables[parseInt(nameTable)].filename;
      var safeUri = checkPathSlashes(uri);
      newTable[indexTable] = {uri: safeUri, title: title, filename: filename};
    });
    data.tables = newTable;
    // images
    var orderImage = $("#sortable-image").sortable('toArray');
    $(orderImage).each(function (indexImage, nameImage) {
      var uri = data.images[parseInt(nameImage)].uri;
      var title = data.images[parseInt(nameImage)].title;
      var filename = data.images[parseInt(nameImage)].filename;
      var safeUri = checkPathSlashes(uri);
      newImage[indexImage] = {uri: safeUri, title: title, filename: filename};
    });
    data.images = newImage;
    // Related bulletins TO BE DELETED
    var orderBulletin = $("#sortable-bulletin").sortable('toArray');
    $(orderBulletin).each(function (indexB, nameB) {
      var uri = data.relatedBulletins[parseInt(nameB)].uri;
      var safeUri = checkPathSlashes(uri);
      newBulletin[indexB] = {uri: safeUri};
    });
    data.relatedBulletins = newBulletin;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexDoc, nameDoc) {
      var uri = data.relatedDocuments[parseInt(nameDoc)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocuments[indexDoc] = {uri: safeUri};
    });
    data.relatedDocuments = newDocuments;
    // Related data
    var orderData = $("#sortable-data").sortable('toArray');
    $(orderData).each(function (indexD, nameD) {
      var uri = data.relatedData[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newData[indexD] = {uri: safeUri};
    });
    data.relatedData = newData;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = $('#link-markdown_' + nameL).val();
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;
    // qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function timeseriesEditor(collectionId, data) {

  var newDocument = [], newRelated = [], newTimeseries = [], newRelatedQmi = [], newRelatedMethodology = [];
  var setActiveTab, getActiveTab;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#number").on('input', function () {
    $(this).textareaAutoSize();
    data.description.number = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keyNote").on('input', function () {
    $(this).textareaAutoSize();
    data.description.keyNote = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#unit").on('input', function () {
    $(this).textareaAutoSize();
    data.description.unit = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#preUnit").on('input', function () {
    $(this).textareaAutoSize();
    data.description.preUnit = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#source").on('input', function () {
    $(this).textareaAutoSize();
    data.description.source = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };

  $("#metadata-list #natStat input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list #natStat input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  var isIndexStatus = function () {
    if (data.description.isIndex === true) {
      return true;
    } else {
      return false;
    }
  };

  $("#metadata-list #isIndex input[type='checkbox']").prop('checked', isIndexStatus).click(function () {
    data.description.isIndex = $("#metadata-list #isIndex input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    if (Ermintrude.globalVars.welsh) {
      sweetAlert('You cannot perform this operation in Welsh.');
    } else {
      save();
      updateContent(collectionId, data.uri, JSON.stringify(data));
    }
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    if (Ermintrude.globalVars.welsh) {
      sweetAlert('You cannot perform this operation in Welsh.');
    } else {
      save();
      saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
    }
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });


  function save() {
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocument[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newDocument;
    // Related timeseries
    var orderTimeseries = $("#sortable-timeseries").sortable('toArray');
    $(orderTimeseries).each(function (indexT, nameT) {
      var uri = data.relatedData[parseInt(nameT)].uri;
      var safeUri = checkPathSlashes(uri);
      newTimeseries[indexT] = {uri: safeUri};
    });
    data.relatedData = newTimeseries;
    // Related datasets
    var orderDataset = $("#sortable-dataset").sortable('toArray');
    $(orderDataset).each(function (indexD, nameD) {
      var uri = data.relatedDatasets[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelated[indexD] = {uri: safeUri};
    });
    data.relatedDatasets = newRelated;
    // Related qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;
  }
}

function compendiumChapterEditor(collectionId, data) {

  var newSections = [], newTabs = [], newChart = [], newTable = [], newImage = [], newRelatedDocuments = [], newLinks = [], newRelatedQmi = [], newRelatedMethodology = [];
  var parentUrl = getParentPage(data.uri);
  var setActiveTab, getActiveTab;
  var timeoutId;

  //Add parent link onto page
  loadParentLink(collectionId, data, parentUrl);


  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    sweetAlert("Cannot remame this page here", "Go back to parent page and use the rename function there");
  });
  $("#headline").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  //if (!Ermintrude.collection.date) {                    //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#abstract").on('input', function () {
    $(this).textareaAutoSize();
    data.description._abstract = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $('#add-chart').click(function () {
    loadChartBuilder(data, function () {
      refreshPreview();

      putContent(collectionId, data.uri, JSON.stringify(data),
        success = function () {
          Ermintrude.Editor.isDirty = false;
          refreshPreview();
          refreshChartList(collectionId, data);
        },
        error = function (response) {
          handleApiError(response);
        }
      );
    });
  });

  $('#add-table').click(function () {
    loadTableBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      refreshPreview();
      refreshTablesList(collectionId, data);
    });
  });

  $('#add-image').click(function () {
    loadImageBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      //refreshPreview();
      refreshImagesList(collectionId, data);
    });
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  //editNav.on('click', '#save-and-exit', function () {
  //  save();
  //  updateContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  //});

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  });


  function save() {
    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var markdown = data.sections[parseInt(nameS)].markdown;
      var title = $('#section-title_' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $("#sortable-tab").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab-title_' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    // charts
    var orderChart = $("#sortable-chart").sortable('toArray');
    $(orderChart).each(function (indexCh, nameCh) {
      var uri = data.charts[parseInt(nameCh)].uri;
      var title = data.charts[parseInt(nameCh)].title;
      var filename = data.charts[parseInt(nameCh)].filename;
      var safeUri = checkPathSlashes(uri);
      newChart[indexCh] = {uri: safeUri, title: title, filename: filename};
    });
    data.charts = newChart;
    // tables
    var orderTable = $("#sortable-table").sortable('toArray');
    $(orderTable).each(function (indexTable, nameTable) {
      var uri = data.tables[parseInt(nameTable)].uri;
      var title = data.tables[parseInt(nameTable)].title;
      var filename = data.tables[parseInt(nameTable)].filename;
      var safeUri = checkPathSlashes(uri);
      newTable[indexTable] = {uri: safeUri, title: title, filename: filename};
    });
    data.tables = newTable;
    // images
    var orderImage = $("#sortable-image").sortable('toArray');
    $(orderImage).each(function (indexImage, nameImage) {
      var uri = data.images[parseInt(nameImage)].uri;
      var title = data.images[parseInt(nameImage)].title;
      var filename = data.images[parseInt(nameImage)].filename;
      var safeUri = checkPathSlashes(uri);
      newImage[indexImage] = {uri: safeUri, title: title, filename: filename};
    });
    data.images = newImage;
    // Related documents
    var orderArticle = $("#sortable-document").sortable('toArray');
    $(orderArticle).each(function (indexB, nameB) {
      var uri = data.relatedDocuments[parseInt(nameB)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedDocuments[indexB] = {uri: safeUri};
    });
    data.relatedDocuments = newRelatedDocuments;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = $('#link-markdown_' + nameL).val();
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;
    // Related qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;
  }
}

function compendiumDataEditor(collectionId, data) {

  var newFiles = [], newRelatedDocuments = [], newRelatedData = [], newRelatedQmi = [], newRelatedMethodology = [];
  var parentUrl = getParentPage(data.uri);
  var setActiveTab, getActiveTab;
  var timeoutId;

  //Add parent link onto page
  loadParentLink(collectionId, data, parentUrl);


  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    sweetAlert("Cannot remame this page here", "Go back to parent page and use the rename function there");
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  //if (!Ermintrude.collection.date) {                    //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#datasetId").on('input', function () {
    $(this).textareaAutoSize();
    data.description.datasetId = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };
  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '#save', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  //editNav.on('click', '#save-and-exit', function () {
  //  save();
  //  updateContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  //});

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    //pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  });

  function save() {
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#file-title_' + nameF).val();
      var fileDescription = $("#file-summary_" + nameF).val();
      var file = data.downloads[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, fileDescription: fileDescription, file: file};
    });
    data.downloads = newFiles;
    // Related documents
    var orderRelatedDocument = $("#sortable-document").sortable('toArray');
    $(orderRelatedDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedDocuments[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newRelatedDocuments;
    // Related datasets
    var orderRelatedDataset = $("#sortable-dataset").sortable('toArray');
    $(orderRelatedDataset).each(function (indexDt, nameDt) {
      var uri = data.relatedDatasets[parseInt(nameDt)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedData[indexDt] = {uri: safeUri};
    });
    data.relatedDatasets = newRelatedData;
    // Related qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;
  }
}

function compendiumEditor(collectionId, data, templateData) {

//  var index = data.release;
  var newChapters = [], newRelatedQmi = [], newRelatedMethodology = [], newDocuments = [], newData = [];
  var lastIndexChapter, lastIndexDataset;
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  resolveTitleT6(collectionId, data, templateData, 'chapters');
  resolveTitleT6(collectionId, data, templateData, 'datasets');

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });
  //if (!Ermintrude.collection.date) {                    //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //  $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#headline").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    }
    return true;
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  //Add new chapter
  $("#add-chapter").one('click', function () {
    var chapterTitle;
    $('#sortable-chapter').append(
      '<div id="' + lastIndexChapter + '" class="edit-section__sortable-item">' +
      '<textarea class="auto-size" id="new-chapter-title" placeholder="Type title here and click add"></textarea>' +
      '<div class="edit-section__buttons">' +
      '<button class="btn-markdown-edit" id="chapter-add">Edit chapter</button>' +
      '</div>' +
      '</div>');
    $('#new-chapter-title').on('input', function () {
      $(this).textareaAutoSize();
      chapterTitle = $(this).val();
    });
    $('#chapter-add').on('click', function () {
      if (chapterTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        return true;
      } else {
        loadT6Creator(collectionId, data.description.releaseDate, 'compendium_chapter', data.uri, chapterTitle);
      }
    });
  });

  //Add new table (only one per compendium)
  if (!data.datasets || data.datasets.length === 0) {
    $("#add-compendium-data").one('click', function () {
      var tableTitle;
      $('#sortable-compendium-data').append(
        '<div id="' + lastIndexDataset + '" class="edit-section__item">' +
        '<textarea class="auto-size" id="new-compendium-data-title" placeholder="Type title here and click add"></textarea>' +
        '<div class="edit-section__buttons">' +
        '<button class="btn-markdown-edit" id="compendium-data-add">Edit data</button>' +
        '</div>' +
        '</div>');
      $('#new-compendium-data-title').on('input', function () {
        $(this).textareaAutoSize();
        tableTitle = $(this).val();
      });
      $('#compendium-data-add').on('click', function () {
        if (tableTitle.length < 5) {
          sweetAlert("This is not a valid file title");
          return true;
        } else {
          loadT6Creator(collectionId, data.description.releaseDate, 'compendium_data', data.uri, tableTitle);
        }
      });
    });
  } else {
    $('#add-compendium-data').hide().one('click', function () {
      sweetAlert('At the moment you can have one section here.');
    });
  }

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Chapters
    var orderRelatedChapter = $("#sortable-chapter").sortable('toArray');
    $(orderRelatedChapter).each(function (indexC, nameC) {
      var uri = data.chapters[parseInt(nameC)].uri;
      var safeUri = checkPathSlashes(uri);
      newChapters[indexC] = {uri: safeUri};
    });
    data.chapters = newChapters;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocuments[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newDocuments;
    // Related data
    var orderData = $("#sortable-data").sortable('toArray');
    $(orderData).each(function (indexDat, nameDat) {
      var uri = data.relatedData[parseInt(nameDat)].uri;
      var safeUri = checkPathSlashes(uri);
      newData[indexDat] = {uri: safeUri};
    });
    data.relatedData = newData;
    // Related qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function resolveTitleT6(collectionId, data, templateData, field) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      function (response) {
        templateData[field][index].description.title = response.title;
        dfd.resolve();
      },
      function () {
        sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    var dataTemplate = templateData[field];
    if (field === 'datasets') {
      var html = templates.workEditT6Dataset(dataTemplate);
    } else {
      var html = templates.workEditT6Chapter(dataTemplate);
    }
    $('#' + field).replaceWith(html);

    if (field === 'datasets') {
      editData(collectionId, data);
    } else {
      editChapters(collectionId, data);
    }
  });
}

function editChapters(collectionId, data) {
  // Edit chapters
  // Load chapter to edit
  $(data.chapters).each(function (index) {
    lastIndexChapter = index + 1;

    //open document
    $("#chapter-edit_" + index).click(function () {
      var selectedChapter = data.chapters[index].uri;
      createWorkspace(selectedChapter, collectionId, 'edit');
    });

    $('#chapter-edit-label_' + index).click(function () {
      var selectedChapter = data.chapters[index].uri;
      getPageData(collectionId, selectedChapter,
        function (pageData) {
          var markdown = pageData.description.title;
          var editedSectionValue = {title: 'Compendium chapter title', markdown: markdown};
          var saveContent = function (updatedContent) {
            pageData.description.title = updatedContent;
            var childTitle = updatedContent.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            putContent(collectionId, pageData.uri, JSON.stringify(pageData),
              function () {
                //save children change and move
                checkRenameUri(collectionId, pageData, true, updateContent);
                //update dataset uri in parent and save
                data.chapters[index].uri = data.uri + "/" + childTitle;
                putContent(collectionId, data.uri, JSON.stringify(data),
                  function () {
                  },
                  function (response) {
                    if (response.status === 409) {
                      sweetAlert("Cannot edit this page", "It is already part of another collection.");
                    } else {
                      handleApiError(response);
                    }
                  }
                );
              },
              function (message) {
                if (message.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                  handleApiError(message);
                }
              }
            );
          };
          loadMarkdownEditor(editedSectionValue, saveContent, pageData);
        },
        function (message) {
          handleApiError(message);
        }
      );
    });

    // Delete
    $("#chapter-delete_" + index).click(function () {
      swal({
        title: "Warning",
        text: "You are going to delete the chapter this link refers to. Are you sure you want to proceed?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          var selectedChapter = data.chapters[index].uri;
          var path = data.uri;
          $("#" + index).remove();
          data.chapters.splice(index, 1);
          putContent(collectionId, path, JSON.stringify(data),
            function () {
              swal({
                title: "Deleted",
                text: "This file has been deleted",
                type: "success",
                timer: 2000
              });
              Ermintrude.Editor.isDirty = false;
              deleteContent(collectionId, selectedChapter, function () {
                refreshPreview(path);
                loadPageDataIntoEditor(path, collectionId);
              }, error);
            },
            function (response) {
              if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
              }
              else {
                handleApiError(response);
              }
            }
          );
        }
      });
    });
  });

  function sortableSections() {
    $("#sortable-chapter").sortable();
  }

  sortableSections();
}

function editData(collectionId, data) {
  // Edit data reference table
  // Load table to edit
  if (!data.datasets || data.datasets.length === 0) {
    lastIndexDataset = 0;
  } else {
    $(data.datasets).each(function (index) {
      //open document
      var selectedData = data.datasets[index].uri;
      $("#compendium-data-edit_" + index).click(function () {
        refreshPreview(selectedData);
        viewWorkspace(selectedData, collectionId, 'edit');
      });

      $('#compendium-data-edit-label_' + index).click(function () {
        getPageData(collectionId, selectedData,
          function (pageData) {
            var markdown = pageData.description.title;
            var editedSectionValue = {title: 'Compendium dataset title', markdown: markdown};
            var saveContent = function (updatedContent) {
              pageData.description.title = updatedContent;
              var childTitle = updatedContent.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
              putContent(collectionId, pageData.uri, JSON.stringify(pageData),
                function () {
                  //save children changes
                  //move
                  checkRenameUri(collectionId, pageData, true, updateContent);
                  //update dataset uri in parent and save
                  data.datasets[index].uri = data.uri + "/" + childTitle;
                  putContent(collectionId, data.uri, JSON.stringify(data),
                    function () {
                    },
                    function (response) {
                      if (response.status === 409) {
                        sweetAlert("Cannot edit this page", "It is already part of another collection.");
                      } else {
                        handleApiError(response);
                      }
                    }
                  );
                },
                function (message) {
                  if (message.status === 400) {
                    sweetAlert("Cannot edit this page", "It is already part of another collection.");
                  }
                  else {
                    handleApiError(message);
                  }
                }
              );
            };
            loadMarkdownEditor(editedSectionValue, saveContent, pageData);
          },
          function (message) {
            handleApiError(message);
          }
        );
      });

      // Delete
      $("#compendium-data-delete_" + index).click(function () {
        //var result = confirm("You are going to delete the chapter this link refers to. Are you sure you want to proceed?");
        swal({
          title: "Warning",
          text: "You are going to delete the chapter this link refers to. Are you sure you want to proceed?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function (result) {
          if (result === true) {
            var selectedData = data.datasets[index].uri;
            var path = data.uri;
            $("#" + index).remove();
            data.datasets.splice(index, 1);
            putContent(collectionId, path, JSON.stringify(data),
              function () {
                swal({
                  title: "Deleted",
                  text: "This file has been deleted",
                  type: "success",
                  timer: 2000
                });
                Ermintrude.Editor.isDirty = false;
                deleteContent(collectionId, selectedData, function () {
                  refreshPreview(path);
                  loadPageDataIntoEditor(path, collectionId);
                }, error);
              },
              function (response) {
                if (response.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                  handleApiError(response);
                }
              }
            );
          }
        });
      });
    });
  }
}

function adHocEditor(collectionId, data) {

  var newFiles = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  $("#metadata-f").remove();
  $("#metadata-md").remove();
  $("#metadata-q").remove();
  $("#metadata-s").remove();
  $("#summary-p").remove();
  $("#contact-p").remove();
  $("#natStat").remove();
  $("#survey-p").remove();
  $("#frequency-p").remove();
  $("#compilation-p").remove();
  $("#geoCoverage-p").remove();
  $("#sampleSize-p").remove();
  $(".lastRevised-p").remove();

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  //if (!Ermintrude.collection.date) {                    //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#reference").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    var isNumber = $(this).val();
    if (isNumber.match(/^\d+$/)) {
      data.description.reference = isNumber;
    } else {
      sweetAlert('This needs to be a number');
    }
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    data.markdown = [$('#content-markdown').val()];
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#file-title_' + nameF).val();
      var file = data.downloads[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.downloads = newFiles;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function foiEditor(collectionId, data) {

  var newFiles = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  $("#metadata-ad").remove();
  $("#metadata-md").remove();
  $("#metadata-q").remove();
  $("#metadata-s").remove();
  $("#summary-p").remove();
  $("#contact-p").remove();
  $("#natStat").remove();
  $("#survey-p").remove();
  $("#frequency-p").remove();
  $("#compilation-p").remove();
  $("#geoCoverage-p").remove();
  $("#sampleSize-p").remove();
  $(".lastRevised-p").remove();
  $("#reference-p").remove();

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  //if (!Ermintrude.collection.date) {                    //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    data.markdown = [$('#content-markdown').val()];
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#file-title_' + nameF).val();
      var file = data.downloads[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.downloads = newFiles;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function methodologyDownloadEditor(collectionId, data) {

  var newFiles = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  $("#metadata-ad").remove();
  $("#metadata-f").remove();
  $("#metadata-q").remove();
  $("#metadata-s").remove();
  $("#summary-p").remove();
  $("#natStat").remove();
  $("#survey-p").remove();
  $("#frequency-p").remove();
  $("#compilation-p").remove();
  $("#geoCoverage-p").remove();
  $("#sampleSize-p").remove();
  $(".lastRevised-p").remove();
  $("#reference-p").remove();

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    data.markdown = [$('#content-markdown').val()];
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#file-title_' + nameF).val();
      var file = data.downloads[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.downloads = newFiles;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}


function methodologyEditor(collectionId, data) {

  var newSections = [], newTabs = [], newChart = [], newTable = [], newImage = [], newDocuments = [], newDatasets = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  //if (!Ermintrude.collection.date) {                        //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    //dateTmp = $('#releaseDate').val();
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $('#add-chart').click(function () {
    loadChartBuilder(data, function () {
      refreshPreview();

      putContent(collectionId, data.uri, JSON.stringify(data),
        success = function () {
          Ermintrude.Editor.isDirty = false;
          refreshPreview();
          refreshChartList(collectionId, data);
        },
        error = function (response) {
          handleApiError(response);
        }
      );
    });
  });

  $('#add-table').click(function () {
    loadTableBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      refreshPreview();
      refreshTablesList(collectionId, data);
    });
  });

  $('#add-image').click(function () {
    loadImageBuilder(data, function () {
      Ermintrude.Editor.isDirty = false;
      //refreshPreview();
      refreshImagesList(collectionId, data);
    });
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var markdown = data.sections[parseInt(nameS)].markdown;
      var title = $('#section-title_' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $("#sortable-tab").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab-title_' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    // charts
    var orderChart = $("#sortable-chart").sortable('toArray');
    $(orderChart).each(function (indexCh, nameCh) {
      var uri = data.charts[parseInt(nameCh)].uri;
      var title = data.charts[parseInt(nameCh)].title;
      var filename = data.charts[parseInt(nameCh)].filename;
      var safeUri = checkPathSlashes(uri);
      newChart[indexCh] = {uri: safeUri, title: title, filename: filename};
    });
    data.charts = newChart;
    // tables
    var orderTable = $("#sortable-table").sortable('toArray');
    $(orderTable).each(function (indexTable, nameTable) {
      var uri = data.tables[parseInt(nameTable)].uri;
      var title = data.tables[parseInt(nameTable)].title;
      var filename = data.tables[parseInt(nameTable)].filename;
      var safeUri = checkPathSlashes(uri);
      newTable[indexTable] = {uri: safeUri, title: title, filename: filename};
    });
    data.tables = newTable;
    // images
    var orderImage = $("#sortable-image").sortable('toArray');
    $(orderImage).each(function (indexImage, nameImage) {
      var uri = data.images[parseInt(nameImage)].uri;
      var title = data.images[parseInt(nameImage)].title;
      var filename = data.images[parseInt(nameImage)].filename;
      var safeUri = checkPathSlashes(uri);
      newImage[indexImage] = {uri: safeUri, title: title, filename: filename};
    });
    data.images = newImage;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocuments[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newDocuments;
    // Related dataset
    var orderDataset = $("#sortable-dataset").sortable('toArray');
    $(orderDataset).each(function (indexData, nameData) {
      var uri = data.relatedDatasets[parseInt(nameData)].uri;
      var safeUri = checkPathSlashes(uri);
      newDatasets[indexData] = {uri: safeUri};
    });
    data.relatedDatasets = newDatasets;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function qmiEditor(collectionId, data) {

  var newFiles = [], newDocument = [], newDataset = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  $("#metadata-ad").remove();
  $("#metadata-f").remove();
  $("#metadata-md").remove();
  $("#metadata-s").remove();
  $("#summary-p").remove();
  $(".release-date").remove();
  $("#reference-p").remove();

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#survey").on('input', function () {
    $(this).textareaAutoSize();
    data.description.surveyName = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#frequency").on('input', function () {
    $(this).textareaAutoSize();
    data.description.frequency = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#compilation").on('input', function () {
    $(this).textareaAutoSize();
    data.description.compilation = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#geoCoverage").on('input', function () {
    $(this).textareaAutoSize();
    data.description.geographicCoverage = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#sampleSize").on('input', function () {
    $(this).textareaAutoSize();
    data.description.sampleSize = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.lastRevised) {
    $('#lastRevised').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.lastRevised = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.lastRevised;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#lastRevised').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.lastRevised = new Date($('#lastRevised').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    }
    return true;
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    data.markdown = [$('#content-markdown').val()];
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#file-title_' + nameF).val();
      var file = data.downloads[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.downloads = newFiles;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocument[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newDocument;
    // Related dataset
    var orderDataset = $("#sortable-dataset").sortable('toArray');
    $(orderDataset).each(function (indexData, nameData) {
      var uri = data.relatedDatasets[parseInt(nameData)].uri;
      var safeUri = checkPathSlashes(uri);
      newDataset[indexData] = {uri: safeUri};
    });
    data.relatedDatasets = newDataset;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function staticLandingPageEditor(collectionId, data) {

  var newSections = [], newLinks = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;
  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);


  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Edit content
  // Load and edition
  $(data.sections).each(function (index) {

    $('#section-uri_' + index).on('paste', function () {
      setTimeout(function () {
        var pastedUrl = $('#section-uri_' + index).val();
        var safeUrl = checkPathParsed(pastedUrl);
        $('#section-uri_' + index).val(safeUrl);
      }, 50);
    });

    if (!$('#section-uri_' + index).val()) {
      $('<button class="btn-edit-save-and-submit-for-review" id="section-get_' + index + '">Go to</button>').insertAfter('#section-uri_' + index);

      $('#section-get_' + index).click(function () {
        var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Ermintrude.Handler, true);
        createWorkspace(data.uri, collectionId, '', true);
        $('#section-get_' + index).html('Copy link').off().one('click', function () {
          var uriCheck = getPathNameTrimLast();
          var uriChecked = checkPathSlashes(uriCheck);
          data.sections[index].uri = uriChecked;
          putContent(collectionId, data.uri, JSON.stringify(data),
            success = function (response) {
              console.log("Updating completed " + response);
              Ermintrude.Editor.isDirty = false;
              viewWorkspace(data.uri, collectionId, 'edit');
              refreshPreview(data.uri);
              var iframeEvent = document.getElementById('iframe').contentWindow;
              iframeEvent.addEventListener('click', Ermintrude.Handler, true);
            },
            error = function (response) {
              if (response.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
              }
              else {
                handleApiError(response);
              }
            }
          );
        });
      });
    }

    $("#section-edit_" + index).click(function () {
      var editedSectionValue = {
        "title": $('#section-title_' + index).val(),
        "markdown": $("#section-markdown_" + index).val()
      };

      var saveContent = function (updatedContent) {
        data.sections[index].summary = updatedContent;
        data.sections[index].title = $('#section-title_' + index).val();
        data.sections[index].uri = $('#section-uri_' + index).val();
        updateContent(collectionId, data.uri, JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#section-delete_" + index).click(function () {
      $("#" + index).remove();
      data.sections.splice(index, 1);
      updateContent(collectionId, data.uri, JSON.stringify(data));
    });

      // Tooltips
    $(function () {
      $('#section-uri_' + index).tooltip({
        items: '#section-uri_' + index,
        content: 'Copy link or click Go to, navigate to page and click Copy link. Then add a title and click Edit',
        show: "slideDown", // show immediately
        open: function (event, ui) {
          ui.tooltip.hover(
            function () {
              $(this).fadeTo("slow", 0.5);
            });
        }
      });
    });

    $(function () {
      $('#section-title_' + index).tooltip({
        items: '#section-title_' + index,
        content: 'Type a title and click Edit',
        show: "slideDown", // show immediately
        open: function (event, ui) {
          ui.tooltip.hover(
            function () {
              $(this).fadeTo("slow", 0.5);
            });
        }
      });
    });
  });

  //Add new content
  $("#add-section").one('click', function () {
    swal ({
      title: "Warning",
      text: "If you do not come back to this page, you will lose any unsaved changes",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel"
    }, function(result) {
      if (result === true) {
        data.sections.push({uri: "", title: "", summary: ""});
        updateContent(collectionId, data.uri, JSON.stringify(data));
      } else {
        loadPageDataIntoEditor(data.uri, collectionId);
      }
    });
  });

  function sortableContent() {
    $("#sortable-section").sortable();
  }

  sortableContent();

  editLink(collectionId, data, 'links', 'link');

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {

    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var summary = data.sections[parseInt(nameS)].summary;
        // Fixes title or uri not saving unless markdown edited
        var title = $('#section-title_' + nameS).val();
        var uri = $('#section-uri_' + nameS).val();
      //var title = data.sections[parseInt(nameS)].title;
      //var uri = data.sections[parseInt(nameS)].uri;
      var uriChecked = checkPathSlashes(uri);
      newSections[indexS] = {uri: uriChecked, title: title, summary: summary};
    });
    data.sections = newSections;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = $('#link-markdown_' + nameL).val();
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function staticPageEditor(collectionId, data) {

  var newLinks = [], newFiles = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;
  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);

  $("#metadata-ad").remove();
  $("#metadata-f").remove();
  $("#metadata-md").remove();
  $("#metadata-q").remove();
  $("#contact-p").remove();
  $("#natStat").remove();
  $("#survey-p").remove();
  $("#frequency-p").remove();
  $("#compilation-p").remove();
  $("#geoCoverage-p").remove();
  $("#sampleSize-p").remove();
  $(".lastRevised-p").remove();
  $(".release-date").remove();
  $("#reference-p").remove();

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    data.markdown = [$('#content-markdown').val()];
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#file-title_' + nameF).val();
      var file = data.downloads[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.downloads = newFiles;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = $('#link-markdown_' + nameL).val();
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function datasetEditor(collectionId, data) {

  var newFiles = [];
  var setActiveTab, getActiveTab;
  var parentUrl = getParentPage(data.uri);

  //Add parent link onto page
  loadParentLink(collectionId, data, parentUrl);


  $(".edit-accordion").on('accordionactivate', function () {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    //pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  });

  function save() {
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-supplementary-files").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#supplementary-files-title_' + nameF).val();
      var file = data.supplementaryFiles[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.supplementaryFiles = newFiles;
    // Notes
    data.section = {markdown: $('#one-markdown').val()};
  }
}function datasetLandingEditor(collectionId, data) {

  var newDatasets = [], newRelatedDocuments = [], newRelatedQmi = [], newRelatedMethodology = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Ermintrude.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Ermintrude.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  resolveTitleT8(collectionId, data, 'datasets');

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  //if (!Ermintrude.collection.date) {                      //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#datasetId").on('input', function () {
    $(this).textareaAutoSize();
    data.description.datasetId = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };
  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Datasets are uploaded. Save metadata
    var orderDataset = $("#sortable-edition").sortable('toArray');
    $(orderDataset).each(function (indexF, nameF) {
      var file = data.datasets[parseInt(nameF)].uri;
      newDatasets[indexF] = {uri: file};
    });
    data.datasets = newDatasets;
    // Used in links
    var orderUsedIn = $("#sortable-document").sortable('toArray');
    $(orderUsedIn).each(function (indexU, nameU) {
      var uri = data.relatedDocuments[parseInt(nameU)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedDocuments[indexU] = {uri: safeUri};
    });
    data.relatedDocuments = newRelatedDocuments;
    // Related qmi
    var orderRelatedQmi = $("#sortable-qmi").sortable('toArray');
    $(orderRelatedQmi).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedQmi[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedQmi;
    // methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodologyArticle[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodologyArticle = newRelatedMethodology;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

function resolveTitleT8(collectionId, data, field) {
  var ajaxRequest = [];
  var templateData = $.extend(true, {}, data);
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      function (response) {
        templateData[field][index].description.edition = response.edition;
        templateData[field][index].uri = eachUri;
        dfd.resolve();
      },
      function () {
        sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    var dataTemplate = templateData[field];
    var html = templates.workEditT8LandingDatasetList(dataTemplate);
    $('#edition').replaceWith(html);
    addEditionEditButton(collectionId, data, templateData);
  });
}

function addEditionEditButton(collectionId, data, templateData) {
  // Load dataset to edit
  $(templateData.datasets).each(function (index) {
    //open document
    $("#edition-edit_" + index).click(function () {
      var selectedEdition = data.datasets[index].uri;
      createWorkspace(selectedEdition, collectionId, 'edit');
    });

    $('#edition-edit-label_' + index).click(function () {
      var selectedEdition = data.datasets[index].uri;
      getPageData(collectionId, selectedEdition,
        function (pageData) {
          var markdown = pageData.description.edition;
          var editedSectionValue = {title: 'Edition title', markdown: markdown};
          var saveContent = function (updatedContent) {
            pageData.description.edition = updatedContent;
            var childTitle = updatedContent.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
            putContent(collectionId, pageData.uri, JSON.stringify(pageData),
              function () {
                //save children changes and move
                checkRenameUri(collectionId, pageData, true, updateContent);
                //update dataset uri in parent and save
                data.datasets[index].uri = data.uri + "/" + childTitle;
                putContent(collectionId, data.uri, JSON.stringify(data),
                  function () {},
                  function (response) {
                    if (response.status === 409) {
                      sweetAlert("Cannot edit this page", "It is already part of another collection.");
                    } else {
                      handleApiError(response);
                    }
                  }
                );
              },
              function (message) {
                if (message.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                  handleApiError(message);
                }
              }
            );
          };
          loadMarkdownEditor(editedSectionValue, saveContent, pageData);
        },
        function (message) {
          handleApiError(message);
        }
      );
    });

    // Delete (assuming datasets in makeEditSection - not dynamic fields here)
    $('#edition-delete_' + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this edition?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          swal({
            title: "Deleted",
            text: "This edition has been deleted",
            type: "success",
            timer: 2000
          });
          var position = $(".workspace-edit").scrollTop();
          Ermintrude.globalVars.pagePos = position;
          $('#edition-delete_' + index).parent().remove();
          $.ajax({
            url: "/zebedee/content/" + collectionId + "?uri=" + data.datasets[index].uri,
            type: "DELETE",
            success: function (res) {
              console.log(res);
            },
            error: function (res) {
              console.log(res);
            }
          });
          data.datasets.splice(index, 1);
          updateContent(collectionId, data.uri, JSON.stringify(data));
        }
      });
    });
  });

  function sortableSections() {
    $("#sortable-edition").sortable();
  }

  sortableSections();
}

function transfer(source, destination, uri) {
  var transferRequest = {
    source: source,
    destination: destination,
    uri: uri
  };
  $.ajax({
    url: "/zebedee/transfer",
    type: "POST",
    dataType: "json",
    contentType: 'application/json',
    data: JSON.stringify(transferRequest),
    success: function() {
      console.log(' file has been moved');
    },
    error: function() {
      console.log('error moving file');
    }
  });
}

function treeNodeSelect(url){

  var urlPart = url.replace(Ermintrude.tredegarBaseUrl, '');
  var selectedListItem = $('[data-url="' + urlPart + '"]'); //get first li with data-url with url
  $('.page-list li').removeClass('selected');
  $('.page-options').hide();

  $(selectedListItem).addClass('selected');
  $(selectedListItem).children('.page-options').show();

  //page-list-tree
  $('.tree-nav-holder ul').removeClass('active');
  $(selectedListItem).parents('ul').addClass('active');
  $(selectedListItem).closest('li').children('ul').addClass('active');
}
function uiTidyUp() {
	//wrap selects with <div class="select-wrap">
	// $('select').wrap('<span class="select-wrap"></span>');
	console.log('uiTidyup');
	$(function() {
 
    $( 'select' )
      .selectmenu()
      .selectmenu( "menuWidget" )
        .addClass( "overflow" );
  });
}function updateContent(collectionId, path, content, redirectToPath) {
  var redirect = redirectToPath;
  putContent(collectionId, path, content,
    success = function () {
      Ermintrude.Editor.isDirty = false;
      if (redirect) {
        createWorkspace(redirect, collectionId, 'edit');
        return;
      } else {
        //createWorkspace(path, collectionId, 'edit');
        refreshPreview(path);
        loadPageDataIntoEditor(path, collectionId);
      }
    },
    error = function (response) {
      if (response.status === 409) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      } else {
        handleApiError(response);
      }
    }
  );
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
      populateCollectionDetails(response, collectionId);
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  function populateCollectionDetails(collection, collectionId) {

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
    $('.collection-selected').html(collectionHtml).animate({right: "0%"}, 500);

    var deleteButton = $('#collection-delete');
    if (collection.inProgress.length === 0
      && collection.complete.length === 0
      && collection.reviewed.length === 0) {
        deleteButton.show().click(function () {
          swal ({
            title: "Warning",
            text: "Are you sure you want to delete this collection?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel",
            closeOnConfirm: false
          }, function(result) {
            if (result === true) {
              deleteCollection(collectionId,
              function () {
              swal ({
                title: "Collection deleted",
                type: "success",
                timer: 2000
              })
              viewCollections();
              },
              function (error) {
                viewCollectionDetails(collectionId);
                sweetAlert('File has not been deleted. Contact an administrator', error, "error");
              })
            } else {}
          });
        });
      } else {
        deleteButton.hide();
      }

    var approve = $('.btn-collection-approve');
    if (collection.inProgress.length === 0
      && collection.complete.length === 0
      && collection.reviewed.length > 0) {
      approve.show().click(function () {
        $('.js').prepend(
          "<div class='over'>" +
          "<div class='hourglass'>" +
          "<div class='top'></div>" +
          "<div class='bottom'></div>" +
          "</div>" +
          "</div>");
        postApproveCollection(collection.id);
      });
    }
    else {
      // You can't approve collections unless there is nothing left to be reviewed
      approve.hide();
    }

    //edit collection
    $('.collection-selected .btn-collection-edit').click(function () {
     editCollection(collection);
    });

    //page-list
    $('.page-item').click(function () {
      $('.page-list li').removeClass('selected');
      $('.page-options').hide();

      $(this).parent('li').addClass('selected');
      $(this).next('.page-options').show();
    });

    $('.btn-page-edit').click(function () {
      var path = $(this).attr('data-path');
      var language = $(this).attr('data-language');
      if (language === 'cy') {
        var safePath = checkPathSlashes(path);
        Ermintrude.globalVars.welsh = true;
      } else {
        var safePath = checkPathSlashes(path);
        Ermintrude.globalVars.welsh = false;
      }
      getPageDataDescription(collectionId, safePath,
        success = function () {
          createWorkspace(safePath, collectionId, 'edit');
        },
        error = function (response) {
          handleApiError(response);
        }
      );
    });

    $('.page-delete').click(function () {
      var path = $(this).attr('data-path');
      var language = $(this).attr('data-language');

      //Shows relevant alert text - SweetAlert doesn't return a true or false in same way that confirm() does so have to write each alert with delete function called after it
      function deleteAlert(text) {
        swal ({
          title: "Warning",
          text: text,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function(result) {
          if (result === true) {
            if (language === 'cy' && !(path.match(/\/bulletins\//) || path.match(/\/articles\//))) {
              path = path + '/data_cy.json';
            }
            deleteContent(collectionId, path, function() {
              viewCollectionDetails(collectionId);
              swal({
                title: "Page deleted",
                text: "This page has been deleted",
                type: "success",
                timer: 2000
              });
                }, function(error) {
                  handleApiError(error);
                }
            );
          }
        });
      }

      if (path.match(/\/bulletins\//) || path.match(/\/articles\//)) {
        deleteAlert("This will delete the English and Welsh content of this page, if any. Are you sure you want to delete this page from the collection?");
      } else if (language === 'cy') {
        deleteAlert("Are you sure you want to delete this page from the collection?");
      } else {
        deleteAlert("This will delete the English and Welsh content of this page, if any. Are you sure you want to delete this page from the collection?");
      }
    });

    $('.collection-selected .btn-collection-cancel').click(function () {
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
      // Wait until the animation ends
      setTimeout(function () {
        //viewController('collections');
      }, 500);
    });

    $('.btn-collection-work-on').click(function () {
      Ermintrude.globalVars.welsh = false;
      createWorkspace('', collectionId, 'browse');
    });

    setCollectionDetailsHeight();
  }

  function ProcessPages(pages) {
    _.sortBy(pages, 'uri');
    _.each(pages, function (page) {
      page.uri = page.uri.replace('/data.json', '');
      return page;
    });
  }

  function setCollectionDetailsHeight(){
    var panelHeight = parseInt($('.collection-selected').height());

    var headHeight = parseInt($('.section-head').height());
    var headPadding = parseInt($('.section-head').css('padding-bottom'));
    
    var contentPadding = parseInt($('.section-content').css('padding-bottom'));
    
    var navHeight = parseInt($('.section-nav').height());
    var navPadding = (parseInt($('.section-nav').css('padding-bottom')))+(parseInt($('.section-nav').css('padding-top')));

    var contentHeight = panelHeight-(headHeight+headPadding+contentPadding+navHeight+navPadding);
    $('.section-content').css('height', contentHeight);
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
      viewCollectionDetails(collectionId);
    }

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var collectionId = $(this).attr('data-id');
      viewCollectionDetails(collectionId);
    });

    $('form input[type=radio]').click(function () {

      if ($(this).val() === 'manual') {
        $('#scheduledPublishOptions').hide();
      } else if ($(this).val() === 'scheduled') {
        $('#scheduledPublishOptions').show();
      } else if ($(this).val() === 'custom') {
        $('#customScheduleOptions').show();
        $('#releaseScheduleOptions').hide();
      } else if ($(this).val() === 'release') {
        $('#customScheduleOptions').hide();
        $('#releaseScheduleOptions').show();
      }
    });

    var noBefore = function (date) {
      if (date < new Date()) {
        return [false];
      }
      return [true];
    }


    $(function () {
      var today = new Date();
      $('#date').datepicker({
        minDate: today,
        dateFormat: 'dd/mm/yy',
        constrainInput: true,
        beforeShowDay: noBefore
      });
    });


    $('.btn-select-release').on("click", function (e) {
      e.preventDefault();
      viewReleaseSelector();
    });

    $('.form-create-collection').submit(function (e) {
      e.preventDefault();
      createCollection();
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

function viewPublish() {
var manual = '[manual collection]';

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    crossDomain: true,
    success: function (collections) {
    $(collections).each(function (i) {
      if (!collections[i].type || (collections[i].type === 'manual')) {
        collections[i].publishDate = manual;
      }
    });
      populatePublishTable(collections);
    },
    error: function (response) {
      handleApiError(response);
    }
  });

  var result = [];
  function populatePublishTable(collections) {


    var collectionsByDate = _.chain(collections)
      .filter( function(collection) { return collection.approvedStatus; })
      .sortBy('publishDate')
      .groupBy('publishDate')
      .value();

    for (var key in collectionsByDate) {
      var response = [];
      if (key === manual) {
        var formattedDate = manual;
      } else {
        var formattedDate = StringUtils.formatIsoFull(key);
      }
      $(collectionsByDate[key]).each(function (n) {
        var id = collectionsByDate[key][n].id;
        response.push(id);
      });
      result.push({date: formattedDate, ids: response});
    }

    var publishList = templates.publishList(result);
    $('.section').html(publishList);

    $('.publish-select-table tbody tr').click(function(){
      var collections = $(this).attr('data-collections').split(',');
      Ermintrude.collectionToPublish.publishDate = $(this).find('td').html();
      viewPublishDetails(collections);

      $('.publish-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      $('.publish-selected').animate({right: "0%"}, 800);
      $('.publish-select').animate({marginLeft: "0%"}, 500);
    });
  }
}

function viewPublishDetails(collections) {

  var manual = '[manual collection]';
  var result = {
    date: Ermintrude.collectionToPublish.publishDate,
    subtitle: '',
    collectionDetails: [],
  }
  var pageDataRequests = []; // list of promises - one for each ajax request to load page data.
  var onlyOne = 0;

  $.each(collections, function (i, collectionId) {
    onlyOne += 1;
    pageDataRequests.push(
      getCollectionDetails(collectionId,
        success = function (response) {
          if (result.date === manual) {
            result.collectionDetails.push({id: response.id, name: response.name, pageDetails: response.reviewed, pageType: 'manual'});
          } else {
            result.collectionDetails.push({id: response.id, name: response.name, pageDetails: response.reviewed});
          }
        },
        error = function (response) {
          handleApiError(response);
        }
      )
    );
  });

  if (onlyOne < 2) {
    result.subtitle = 'The following collection has been approved'
  } else {
    result.subtitle = 'The following collections have been approved'
  }

  $.when.apply($, pageDataRequests).then(function () {
//  console.log(result)
    var publishDetails = templates.publishDetails(result);
    $('.publish-selected').html(publishDetails);
    $('.collections-accordion').accordion({
      header: '.collections-section__head',
      heightStyle: "content",
      active: false,
      collapsible: true
    });

    $('.btn-collection-publish').click(function () {
      $('.js').prepend(
        "<div class='over'>" +
        "<div class='hourglass'>" +
        "<div class='top'></div>" +
        "<div class='bottom'></div>" +
        "</div>" +
        "</div>");
      var collection = $(this).closest('.collections-section').find('.collection-name').attr('data-id');
      publish(collection);
    });

    $('.btn-collection-unlock').click(function () {
      var collection = $(this).closest('.collections-section').find('.collection-name').attr('data-id');
      unlock(collection);
    });

    //page-list
    $('.page-item').click(function () {
      $('.page-list li').removeClass('selected');
      $('.page-options').hide();

      $(this).parent('li').addClass('selected');
      $(this).next('.page-options').show();
    });
    $('.publish-selected .btn-collection-cancel').click(function () {
      $('.publish-selected').animate({right: "-50%"}, 500);
      $('.publish-select').animate({marginLeft: "25%"}, 800);
      $('.publish-select-table tbody tr').removeClass('selected');
    });
  });
}
function viewReportDetails(collection) {

  if(!collection.publishResults || collection.publishResults.length === 0) { return; }

  var success = collection.publishResults[collection.publishResults.length - 1];
  var duration = (function () {
    var start = new Date(success.transaction.startDate);
    var end = new Date(success.transaction.endDate);
    return end - start;
  })();
  var starting = StringUtils.formatIsoFullSec(success.transaction.startDate);
  var verifiedCount = collection.verifiedCount;
  var verifyFailedCount = collection.verifyFailedCount;
  var verifyInprogressCount = collection.verifyInprogressCount;
  var details = {name: collection.name, verifiedCount: verifiedCount, verifyInprogressCount: verifyInprogressCount, verifyFailedCount:verifyFailedCount, date: collection.formattedDate, starting: starting, duration: duration, success: success};

  var reportDetails = templates.reportDetails(details);
  $('.publish-selected').html(reportDetails);
  $('.collections-accordion').accordion({
    header: '.collections-section__head',
    heightStyle: "content",
    active: false,
    collapsible: true
  });

  // order table
  $('th').click(function() {
    var table = $(this).parents('table').eq(0);
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc;
    if (!this.asc) {
      rows = rows.reverse();
    }
    for (var i = 0; i < rows.length; i++) {
      table.append(rows[i]);
    }
  });

  function comparer(index) {
    return function(a, b) {
      var valA = getCellValue(a, index), valB = getCellValue(b, index);
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    }
  }

  function getCellValue(row, index) {
    return $(row).children('td').eq(index).html()
  }

  $('.publish-selected .btn-collection-cancel').click(function () {
    $('.publish-selected').animate({right: "-50%"}, 500);
    $('.publish-select').animate({marginLeft: "25%"}, 800);
    $('.publish-select-table tbody tr').removeClass('selected');
  });
}

function viewReports() {

  $.ajax({
    url: "/zebedee/publishedcollections",
    type: "get",
    crossDomain: true,
    success: function (collections) {

      populatePublishTable(collections);
    },
    error: function (response) {
      handleApiError(response);
    }
  });

  function populatePublishTable(collections) {

    var filteredCollections = _.chain(collections)
      .filter(function (collection) {
        return collection.publishResults && collection.publishResults.length > 0;
      })
      .value();

    $(filteredCollections).each(function (i) {
      filteredCollections[i].order = i;
    });

    $(filteredCollections).each(function (n, coll) {
      if(coll.publishResults && coll.publishResults.length > 0) {
        var date = coll.publishResults[coll.publishResults.length - 1].transaction.startDate;
        filteredCollections[n].formattedDate = StringUtils.formatIsoFull(date);
      }
    });

    var reportList = templates.reportList(filteredCollections);
    $('.section').html(reportList);

    $('.publish-select-table tbody tr').click(function () {
      var i = $(this).attr('data-collections-order');
      viewReportDetails(filteredCollections[i]);

      $('.publish-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      $('.publish-selected').animate({right: "0%"}, 800);
      $('.publish-select').animate({marginLeft: "0%"}, 500);
    });
  }
}
/**
 * Display the details of the user with the given email.
 * @param email
 */
function viewUserDetails(email) {

  getUsers(
    success = function (user) {
      populateUserDetails(user, email);
    },
    error = function (response) {
      handleApiError(response);
    },
    email
  );

  function populateUserDetails(user, email) {

    var html = window.templates.userDetails(user);
    $('.collection-selected').html(html).animate({right: "0%"}, 500);

    $('.btn-user-change-password').click(function () {
      var currentPasswordRequired = false;

      if(email == Ermintrude.Authentication.loggedInEmail()) {
        currentPasswordRequired = true;
      }

      viewChangePassword(email, currentPasswordRequired);
    });

    $('.btn-user-delete').click(function () {
      swal ({
        title: "Confirm deletion",
        text: "Please enter the email address of the user you want to delete",
        type: "input",
        inputPlaceHolder: "Email address",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "Delete",
        animation: "slide-from-top"
      }, function(result) {
        console.log(result);
        if (result) {
          if (result === email) {
            swal ({
              title: "User deleted",
              text: "This user has been deleted",
              type: "success",
              timer: 2000
            });
            deleteUser(email);
          } else {
            sweetAlert("Oops!", 'The email you entered did not match the user you want to delete.')
          }
        }
      });
    });

    $('.collection-selected .btn-collection-cancel').click(function () {
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
      // Wait until the animation ends
      setTimeout(function () {
        //viewController('users');
      }, 500);
    });
  }
}function viewUsers(view) {

  getUsers(
    success = function (data) {
      //console.log(data);
      populateUsersTable(data);
    },
    error = function (jqxhr) {
      handleApiError(jqxhr);
    }
  );

  function populateUsersTable(data) {

    var usersHtml = templates.userList(data);
    $('.section').html(usersHtml);

    //if (collectionId) {
    //  $('.collections-select-table tr[data-id="' + collectionId + '"]')
    //    .addClass('selected');
    //  viewCollectionDetails(collectionId);
    //}

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var userId = $(this).attr('data-id');
      viewUserDetails(userId);
    });

    $('.form-create-user').submit(function (e) {
      e.preventDefault();

      var username = $('#create-user-username').val();
      var email = $('#create-user-email').val();
      var password = $('#create-user-password').val();

      if (username.length < 1) {
        sweetAlert("Please enter the users name.");
        return;
      }

      if (email.length < 1) {
        sweetAlert("Please enter the users name.");
        return;
      }

      if (password.length < 1) {
        sweetAlert("Please enter the users password.");
        return;
      }

      postUser(username, email, password);
    });
  }
}

function viewWorkspace(path, collectionId, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  Ermintrude.globalVars.pagePath = currentPath;

  if (menu === 'browse') {
    $('.nav--workspace li').removeClass('selected');
    $("#browse").addClass('selected');
    loadBrowseScreen(collectionId, 'click');
  }
  else if (menu === 'create') {
    $('.nav--workspace li').removeClass('selected');
    $("#create").addClass('selected');
    loadCreateScreen(currentPath, collectionId);
  }
  else if (menu === 'edit') {
    $('.nav--workspace li').removeClass('selected');
    $("#edit").addClass('selected');
    loadPageDataIntoEditor(currentPath, collectionId);
  }
}

