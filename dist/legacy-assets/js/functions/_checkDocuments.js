function checkDocuments(url){

  var urlPart = url.replace(Ermintrude.tredegarBaseUrl, '');
  var selectedListItem = $('[data-path="' + urlPart + '"]'); //get first li with data-url with url
  $('.page-list li').removeClass('selected');

  $(selectedListItem).addClass('selected');
  console.log(urlPart);
}

