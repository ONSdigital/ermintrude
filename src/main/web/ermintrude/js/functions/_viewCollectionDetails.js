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

        $('select#docs-list').change(function () {
            var $selectedOption = $('#docs-list option:selected')
            var path = $selectedOption.val();
            var lang = $selectedOption.attr('data-lang');

            if (lang) {
                document.cookie = "lang=" + lang + ";path=/";
            }

            getPage(collection.id, path).then(response => {
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
            
            refreshPreview(path);

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

function bindVisFilesChange() {
    $('#vis-files__form').off().on('change', function() {
        refreshPreview($(this).find(":selected").val());
    });
}