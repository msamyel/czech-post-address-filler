/** @module main **/

/**
 * @file Content script that will run on "Poslat zásilku" page and will fill in the form with the data from the order.
 * @author Matěj <matej94v@gmail.com>
 */


/**
 * Sets up message listeners to receive data from popup.
 */
function setupMessageListeners() {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action == "pasteAddress") {
                console.log(request.address);
            }
        }
    );
}

/** Entrypoint method. */
async function start() {
    setupMessageListeners();
}


start();
