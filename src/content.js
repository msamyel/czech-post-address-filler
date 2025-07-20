/** @module main **/

/**
 * @file Content script that will run on "Poslat zásilku/Send consignment
" page and will feed values line after line into clipboard for faster input.
 * @author Matěj <matej94v@gmail.com>
 */


let clipboardFeed = []
let clipboardIndex = 0;
let ctrlDown = false;
let isListentingForCtrlV = false;
const ctrlKey = 17,
    cmdKey = 91,
    metaKey = 224 // MacOS, Firefox

/** Listen to Ctrl+V or Cmd+V (MacOS) */
function setUpControlVListener() {
    document.addEventListener('keydown', function (e) {
        if (!isListentingForCtrlV) {
            return;
        }
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey || e.keyCode == metaKey) {
            ctrlDown = true;
        }
        if (e.key === 'v' && ctrlDown) {
            loadNextLineToClipboard();
        }
    });
    document.addEventListener('keyup', function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
            ctrlDown = false;
        }
    });
}

/**
 * Load the first line from the clipboard feed to the clipboard.
 */
function loadFirstLineToClipboard() {
    navigator.clipboard.writeText(clipboardFeed[0]);
    markCurrentlyCopiedLine(0);
}

/**
 * Load the next line from the clipboard feed to the clipboard.
 * This is triggered immediately after the user presses Ctrl+V, so we add a small delay.
 */
function loadNextLineToClipboard() {
    setTimeout(() => {
        markAsPasted(clipboardIndex);
        clipboardIndex++;

        if (clipboardIndex >= clipboardFeed.length) {
            isListentingForCtrlV = false;
            return;
        }

        markCurrentlyCopiedLine(clipboardIndex);
        const line = clipboardFeed[clipboardIndex];
        navigator.clipboard.writeText(line);
    }, 100);
}

/**
* @desc Append a text area to the page where the user can paste the address.
*/
function appendExtensionHtml() {
    const containerDiv = document.createElement('div');
    containerDiv.id = 'cz-post-extension-container';

    const textarea = document.createElement('textarea');
    textarea.id = 'address-input';
    textarea.placeholder = 'Press Ctrl+V to paste the address';
    textarea.style.width = '70%';
    textarea.style.height = '180px';
    textarea.style.backgroundColor = 'lightyellow';
    textarea.addEventListener('input', function (e) {
        const address = e.target.value;
        onPasteToTextArea(address);
    });

    const targetElement = document.querySelector('h1').parentElement;

    const label = document.createElement('label');
    label.htmlFor = 'address-input';
    label.innerText = 'Paste address AFTER selecting country!';
    if (isSendingToCzechRepublic()) {
        label.innerText += ' When sending to the Czech Republic, set the address type to "Entering the address manually" first.';
    }

    const leftDiv = document.createElement('div');
    leftDiv.id = "cz-post-extension-container-left";

    leftDiv.appendChild(label);
    leftDiv.appendChild(textarea);

    const rightDiv = document.createElement('div');
    rightDiv.id = "cz-post-extension-container-right";
    const rightDivInfo = document.createElement('p');
    rightDivInfo.id = "cz-post-extension-container-right-info";
    rightDivInfo.innerText = "Clipboard (press Ctrl+V to paste the value after \"▶\"):";
    rightDiv.appendChild(rightDivInfo);
    const rightDivLineDisplay = document.createElement('ul');
    rightDivLineDisplay.id = "cz-post-extension-container-right-line-container";
    rightDiv.appendChild(rightDivLineDisplay);
    const resetButton = document.createElement('button');
    resetButton.innerText = "Reset";
    resetButton.addEventListener('click', resetAll);
    rightDiv.appendChild(resetButton);

    containerDiv.appendChild(leftDiv);
    containerDiv.appendChild(rightDiv);
    targetElement.appendChild(containerDiv);
    console.log("Appended text area!");
}

/**
 * @desc Reset all the values and clear the text area.
 */
function resetAll() {
    clipboardFeed = [];
    clipboardIndex = 0;
    isListentingForCtrlV = false;
    const targetElement = document.querySelector("#cz-post-extension-container-right-line-container");
    targetElement.innerHTML = "";
    const textArea = document.querySelector("#address-input");
    textArea.value = "";
}

/**
 * In the clipboard display, mark this line as already copied.
 * @param {number} lineIndex - Index of line that was copied from clipboard and pasted into the form.
 */
function markAsPasted(lineIndex) {
    const targetElement = document.querySelector('#cz-post-extension-container-right');
    const p = targetElement.querySelector(`li[data-line_index="${lineIndex}"]`);
    p.style.textDecoration = "line-through";
}

/**
 * In the clipboard display, signify to the user which line is currently copied in the clipboard.
 * @param {number} currentIndex - Index of the line that is currently copied in the clipboard. 
 */
function markCurrentlyCopiedLine(currentIndex) {
    const targetElements = document.querySelectorAll('#cz-post-extension-container-right-line-container > li');
    console.log(targetElements);
    targetElements.forEach((element, index) => {
        if (index === currentIndex) {
            element.classList.add("current");
        }
        else {
            element.classList.remove("current");
        }
    });
}

/**
 * When user pastes the address into the text area, split it into parts and display them in the right container.
 * @param {string} address - Contents pasted into the text area. 
 */
function onPasteToTextArea(address) {
    const isCzechia = isSendingToCzechRepublic();
    const [givenName, surname, streetAndAptNumber, town, postalCode, telephone] = splitAddress(address, isCzechia);

    // change order of elements to fit the Czech Post form
    if (isCzechia) {
        clipboardFeed = [givenName, surname, town, streetAndAptNumber, postalCode, telephone].filter(x => x);
    }
    else {
        clipboardFeed = [givenName, surname, town, streetAndAptNumber, postalCode, telephone].filter(x => x);
    }

    const targetElement = document.querySelector("#cz-post-extension-container-right-line-container");
    targetElement.innerHTML = "";

    [...clipboardFeed].forEach((line, index) => {
        const p = document.createElement('li');
        p.innerText = line;
        p.dataset["line_index"] = index;
        targetElement.appendChild(p);
    });

    isListentingForCtrlV = true;
    loadFirstLineToClipboard();
}

/**
 * For addresses inside Czechia, different form is generated, 
 * and we need the user to select the "Entering the address manually" option first.
 * @returns {boolean} True if the address is set to Czechia, false otherwise.
 */
function isSendingToCzechRepublic() {
    //if #addressee-type's parent is not hidden, this is a package within Czech Republic
    const addressInputGroup = document.querySelector("#addressee-type").parentElement;
    return !addressInputGroup.classList.contains("hidden");
}

/**
 * @desc Takes a comma separated string of address parts and splits it into an array, while making adjustments such as making sure apt. number is included in the street, if present.
 * @param {string} address - Comma-separated address as copied from Shopify. 
 * @param {boolean} isCzechia - If the address is being sent to Czechia, do not put '+' in front of the phone number.
 * @returns {string[]} Array of address parts ([givenName, surname, streetName, houseNumber, municipality, postalCodeWithoutSpaces, phoneNumericOnly]).
 */
function splitAddress(address, isCzechia = false) {
    const parts = address.split(/[\n,]+/).map(part => part.trim());
    //const exampleSpain = "name, street and number, [apt. number], post number + municipalit, region, country, telephone"
    //const exampleCanada = "name, street, municipality region postcode, country, telephone"
    const names = parts.shift();
    const streetAndAptNumber = takeStreetNameAndAptNumber(parts);
    const townAndPostalCode = takeMunicipalityAndPostalCode(parts);
    const country = parts.shift(); // not used
    const telephone = (parts.length == 0) ? '' : parts.shift();

    const [givenName, surname] = splitNames(names);
    // match any parts of TOWN containing a number
    const postalCode = townAndPostalCode.split(' ').filter(part => part.match(/\d+/)).join(' ');
    // TOWN without post code
    const municipality = townAndPostalCode.replace(postalCode, '').trim();
    // only NUMERIC parts of telephone
    const phoneNumber = formatPhoneNumber(telephone, isCzechia);
    // postal code should be without whitespaces
    const postalCodeWithoutSpaces = postalCode.replace(/\s/g, '');

    return [givenName, surname, streetAndAptNumber, municipality, postalCodeWithoutSpaces, phoneNumber].map(x => x.trim());
}

function takeStreetNameAndAptNumber(parts) {
    // Decision tree:
    // 1) take the first part (always a street), you can later parse out numbers from it
    // 2) check if only three parts are remaining (cityregionpostalcode, country and phone)
    //      TRUE => no more street parts, return immediately
    //      FALSE => check there could be [house number], city, region [postal code], phone
    //                                 or [house, number], city [postal code], phone
    //                                 or city, region [postal code], phone
    //                                  
    //               so 3) check if the next part contains no numbers (city)
    //                          TRUE => return immediately
    //                          FALSE => append the next part (house number) to the street and return

    let street = parts.shift();
    if (parts.length <= 3) {
        // only three parts remaining (cityregionpostalcode, country and phone) so return here
        return street;
    }

    if (parts[0].split(" ").every(part => isPartOfStreetName(part))) {
        // next part doesn't contain house number, so it should be the city. Return here.
        return street;
    }

    street += " " + parts.shift();
    return street;
}

function takeMunicipalityAndPostalCode(parts) {
    if (parts[0].match(/\d+/)) {
        return parts.shift();
    }
    let townAndPostalCode = parts.shift();
    while (parts.length > 0 && !parts[0].match(/\d+/)) {
        townAndPostalCode += ", " + parts.shift();
    }
    townAndPostalCode += " " + parts.shift();
    return townAndPostalCode;
}

/**
 * 
 * @param {string} phoneNumber: trimmed phone number to be formatted 
 * @param {*} isCzechia: if the address is being sent to Czechia, do not put '+' or '420' in front of the phone number.
 * @returns {string} formatted phone number
 */
function formatPhoneNumber(phoneNumber, isCzechia) {
    if (phoneNumber == '') {
        return '';
    }
    if (isCzechia) {
        return phoneNumber.replace(/^[+]?420/g, '').replace(/\D/g, '');
    }
    return "+" + phoneNumber.replace(/\D/g, '');
}

/**
 * @desc Determine if word is a part of streetname or house/appartment number.
 * @param {string} word - part of the address line separated by spaces. 
 * @returns true if word is part of street name, false if it is a house/appartment number
 */
function isPartOfStreetName(word) {
    const wordLower = word.toLowerCase();
    if (wordLower == "apt" || wordLower == "apartment" || wordLower == "apt." || wordLower == "suite") {
        return false;
    }
    if (wordLower == "po" || wordLower == "p.o." || wordLower == "box" || wordLower == "etage" || wordLower == "floor") {
        return false;
    }
    if (!word.match(/\d+/)) {
        // no numeric parts mean this is a part of street name
        return true;
    }
    if (word.match(/\d+\./)) {
        // ordinal numbers likely a part of street name, such as "17. listopadu"
        return true;
    }
    if (word.match(/1st|2nd|3rd|4th|5th|6th|7th|8th|9th|0th/)) {
        // ordinal numbers in English likely a part of street name, such as "3rd Avenue"
        return true;
    }
    // contains numeric parts which are not ordinal numbers, likely a house/appartment number number
    return false;
}

/**
 * @desc Divide full name into name and surname and paste them into the corresponding fields.
 * @param {string} name - Full name of recipient. 
 */
function splitNames(names) {
    const nameSplit = names.split(' ');
    let surname = "";
    const givenName = nameSplit.shift();

    if (nameSplit.length === 0) {
        // handle single name
        surname = givenName;
    }
    else {
        // handle middle names
        surname = nameSplit.join(' ');
    }

    return [givenName, surname];
}

/** 
 * @desc Entrypoint method. 
*/
async function start() {
    //setupMessageListeners();
    //handlePageLoaded();
    setUpControlVListener();
    appendExtensionHtml();
}

// This will only run in the Chrome environment (not in tests)
if (typeof chrome !== 'undefined' && chrome.runtime) {
    start();
}

module.exports = { isPartOfStreetName, splitNames, splitAddress, formatPhoneNumber };