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
      collection.date = '[manual collection] Originally scheduled for ' + StringUtils.formatIsoFull(collection.publishDate);
    } else {
      collection.date = StringUtils.formatIsoFull(collection.publishDate);
    }

    ProcessPages(collection.inProgress);
    ProcessPages(collection.complete);
    ProcessPages(collection.reviewed);

    var sorted = _.sortBy(resultToSort, 'name');

    var collectionHtml = window.templates.collectionDetails(sorted);
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
    _.each(pages, function (page) {
      page.uri = page.uri.replace('/data.json', '');
      page.name = page.description.title ? page.description.title : 'zz';
      resultToSort.push(page);
    });
  }
}