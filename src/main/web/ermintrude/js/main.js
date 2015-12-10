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

///**
// * Return the last edited event for the given page, from the given collection.
// * @param collection
// * @param page
// * @returns {*}
// */
//function getLastEditedEvent(collection, page) {
//
//  var uri = page;
//  var safeUri = checkPathSlashes(uri);
//
//  var pageEvents = collection.eventsByUri[safeUri];
//
//  var lastEditedEvent = _.chain(pageEvents)
//    .filter(function (event) {
//      return event.type === 'EDITED';
//    })
//    .sortBy(function (event) {
//      return event.date;
//    })
//    .last()
//    .value();
//
//  return lastEditedEvent;
//}
//
///**
// * Return the collection created event from the given collection of events.
// * @param events
// * @returns {*}
// */
//function getCollectionCreatedEvent(events) {
//
//  var event = _.chain(events)
//    .filter(function (event) {
//      return event.type === 'CREATED';
//    })
//    .last()
//    .value();
//
//  return event;
//}
//
///**
// * Return the last completed event for the given page, from the given collection.
// * @param collection
// * @param page
// * @returns {*}
// */
//function getLastCompletedEvent(collection, page) {
//
//  var uri = page;
//  var safeUri = checkPathSlashes(uri);
//
//   var lastCompletedEvent;
//
//  if (collection.eventsByUri) {
//    var pageEvents = collection.eventsByUri[safeUri];
//    if (pageEvents) {
//      lastCompletedEvent = _.chain(pageEvents)
//        .filter(function (event) {
//          return event.type === 'COMPLETED';
//        })
//        .sortBy(function (event) {
//          return event.date;
//        })
//        .last()
//        .value();
//    }
//  }
//  return lastCompletedEvent;
//}
//
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

}function loadTableBuilder(pageData, onSave, table) {
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
}function postUser(name, email, password) {

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
function updateContent(collectionId, path, content, redirectToPath) {
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
    //$('.collection-selected').html(collectionHtml).animate({right: "0%"}, 500);
    $('.workspace-menu').html(collectionHtml);

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
    }
    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var collectionId = $(this).attr('data-id');
      //viewCollectionDetails(collectionId);
      createWorkspace('', collectionId, viewCollectionDetails(collectionId));
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

