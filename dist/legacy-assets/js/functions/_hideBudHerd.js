/*
 * Remove the BugHerd feedback button
 * @params timeout
 */

function hideBugHerd(timeout) {

    function ifIframeLoaded() {
        $('#iframe').ready(function () {
            console.log('iframe contents loaded');
            hideTheButton();
        });
    }

    function hideTheButton() {
        var $button = $('#iframe').contents().find('#bugherd-feedback');
        if ($button.length) {
            console.log('b length: ' + $button.length);
            $button.remove();
            return false;
        }
        setTimeout(hideTheButton, 10);
    }
    setTimeout(ifIframeLoaded, timeout);
}

