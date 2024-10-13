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
    vKey = 86,
    cKey = 67;

/** Listen to Ctrl+V or Cmd+V (MacOS) */
function setUpControlVListener() {
    document.addEventListener('keydown', function (e) {
        if (!isListentingForCtrlV) {
            return;
        }
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
            ctrlDown = true;
        }
        if (event.key === 'v' && ctrlDown) {
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
    const [givenName, surname, street, houseNumber, town, postalCode, telephone] = splitAddress(address);

    // change order of elements to fit the Czech Post form
    if (isSendingToCzechRepublic()) {
        clipboardFeed = [givenName, surname, town, street + " " + houseNumber, postalCode, telephone];
    }
    else {
        clipboardFeed = [givenName, surname, town, street, houseNumber, postalCode, telephone];
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
 * @returns {string[]} Array of address parts ([givenName, surname, streetName, houseNumber, municipality, postalCodeWithoutSpaces, phoneNumericOnly]).
 */
function splitAddress(address) {
    const parts = address.split(/[\n,]+/);
    //const exampleSpain = "name, street and number, [apt. number], post number + municipalit, region, country, telephone"
    //const exampleCanada = "name, street, municipality region postcode, country, telephone"
    let index = 0;
    const names = parts[index++];
    let street = parts[index++];
    let isAptNumberSeparate = false;
    if (parts[index].trim().split(' ').length === 1) {
        // next part is probably apt. number
        isAptNumberSeparate = true;
        street += ", " + parts[index++];
    }
    const townAndPostalCode = parts[index++];
    let countryAndRegion = "";
    if (parts.length <= (5 + (isAptNumberSeparate ? 1 : 0))) {
        countryAndRegion = parts[index++];
    }
    else {
        countryAndRegion = parts[index++] + " " + parts[index++];
    }

    telephone = parts[index++];

    const [givenName, surname] = splitNames(names);
    // match parts of STREET not containing a number
    const streetName = street.split(' ').filter(part => isPartOfStreetName(part)).join(' ');
    // match parts of STREET containing a number
    const houseNumber = street.split(' ').filter(part => !isPartOfStreetName(part)).join(' ');
    // match any parts of TOWN containing a number
    const postalCode = townAndPostalCode.split(' ').filter(part => part.match(/\d+/)).join(' ');
    // TOWN without post code
    const municipality = townAndPostalCode.replace(postalCode, '').trim();
    // only NUMERIC parts of telephone
    const phoneNumericOnly = telephone.replace(/\D/g, '');
    const phoneNumber = '+' + phoneNumericOnly;
    // postal code should be without whitespaces
    const postalCodeWithoutSpaces = postalCode.replace(/\s/g, '');

    return [givenName, surname, streetName, houseNumber, municipality, postalCodeWithoutSpaces, phoneNumber].map(x => x.trim());
}

/**
 * @desc Determine if word is a part of streetname or house/appartment number.
 * @param {string} word - part of the address line separated by spaces. 
 * @returns true if word is part of street name, false if it is a house/appartment number
 */
function isPartOfStreetName(word) {
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
    let givenName = "";
    const surname = nameSplit.pop();

    if (nameSplit.length === 0) {
        // handle single name
        givenName = surname;
    }
    else {
        // handle middle names
        givenName = nameSplit.join(' ');
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

start();
