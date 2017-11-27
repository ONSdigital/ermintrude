function viewCollections(collectionId) {

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
