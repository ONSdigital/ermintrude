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

