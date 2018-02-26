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
}