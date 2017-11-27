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

        ProcessPages(collection.inProgress);
        ProcessPages(collection.complete);
        ProcessPages(collection.reviewed);

        var sorted = _.sortBy(resultToSort, 'name');

        var collectionHtml = window.templates.mainNavSelect(sorted);
        $('#mainNavSelect').html(collectionHtml);

        //page-list
        //$('.page-item').click(function () {
        //  $('.page-list li').removeClass('selected');
        //  $('.page-options').hide();
        //  var path = $(this).parent('li').attr('data-path');
        //  $(this).parent('li').addClass('selected');
        //  $(this).next('.page-options').show();
        //  refreshPreview(path);
        //});

        $('select#docs-list').change(function () {
            var $selectedOption = $('#docs-list option:selected')
            var path = $selectedOption.val();
            var lang = $selectedOption.attr('data-lang');

            if (lang) {
                document.cookie = "lang=" + lang + ";path=/";
            }
            
            getPageData(collectionId, path,
                success = function (response) {
                  if(response.apiDatasetId) {
                    var datasetID = response.apiDatasetId;
                    path = '/datasets/' + datasetID;
                    refreshPreview(path);
                  } else {
                    refreshPreview(path);
                  }
                },
                error = function (response) {
                    handleApiError(response);
                }
            );
        });
    }

    function ProcessPages(pages) {
        _.each(pages, function (page) {
            page.uri = page.uri.replace('/data.json', '');
            page.name = page.description.title ? page.description.title : page.description.edition;
            resultToSort.push(page);
        });
    }
}

function formatIsoFull(input) {
    var date = new Date(input);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var formattedDate = $.datepicker.formatDate('DD dd MM yy', date) + ' ' + date.getHours() + ':' + minutes;
    return formattedDate;
}

