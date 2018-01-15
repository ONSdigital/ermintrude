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
        ProcessPages(collection.datasets);
        ProcessPages(collection.datasetVersions);
        
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

    function renderList(){
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

            refreshPreview(path);

        });

    }

    function ProcessPages(pages) {
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
                            renderList();                 
           
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
                    renderList();                 
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
                        renderList();                 
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
                renderList();                 
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

