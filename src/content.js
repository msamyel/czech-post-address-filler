/** @module main **/

/**
 * @file Content script that will run on "Poslat zásilku/Send consignment
" page and will fill in the form with the data from the order.
 * @author Matěj <matej94v@gmail.com>
 */

//todo: implement a way to reset state?
let clipboardFeed = []
let clipboardIndex = 0;
let ctrlDown = false;
let isListentingForCtrlV = false;
const ctrlKey = 17,
    cmdKey = 91,
    vKey = 86,
    cKey = 67;

function setUpControlVListener() {
    document.addEventListener('keydown', function (e) {
        if (!isListentingForCtrlV) {
            return;
        }
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
            ctrlDown = true;
        }
        if (event.key === 'v' && ctrlDown) {
            console.log("Ctrl+V pressed.");
            loadNextLineToClipboard();
        }
    });
    document.addEventListener('keyup', function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
            ctrlDown = false;
        }
    });
}

function loadFirstLineToClipboard() {
    navigator.clipboard.writeText(clipboardFeed[0]);
}

function loadNextLineToClipboard() {
    setTimeout(() => {
        clipboardIndex++;
        const line = clipboardFeed[clipboardIndex];
        navigator.clipboard.writeText(line);
    }, 100);
}

function appendTextArea() {
    const textarea = document.createElement('textarea');
    textarea.id = 'address-input';
    textarea.placeholder = 'Press Ctrl+V to paste the address';
    textarea.style.backgroundColor = 'lightyellow';
    textarea.addEventListener('input', function (e) {
        const address = e.target.value;
        onPasteToTextArea(address);
    });

    const targetElement = document.querySelector('h1').parentElement;
    targetElement.appendChild(textarea);
    console.log("Appended text area!");
}

function onPasteToTextArea(address) {
    const [givenName, surname, street, houseNumber, town, postalCode, telephone] = splitAddress(address);

    // change order of elements to fit the Czech Post form
    clipboardFeed = [givenName, surname, town, street, houseNumber, postalCode, telephone];

    isListentingForCtrlV = true;
    loadFirstLineToClipboard();
}

/**
 * Replace country names used by Shopify with country names recognized by the Czech Post website.
 * @param {string} countryName 
 * @returns {string} Adjusted country name.
 */
function adjustCountryNameForShopify(countryName) {
    return countryName
        .replace('Czechia', 'Czech Republic')
        .replace('United States', 'United States of America');
}

/**
 * For addresses inside Czechia, different form is generated.
 * To allow the extension to fill in all the fields, we must first select "manual address input" in the input type dropdown.
 * @returns {void}
 */
function setManualAddressSelection() {
    //if #adresatTypAdresy is present, this is a package within Czech Republic
    const addressInputType = document.getElementById("adresatTypAdresy");
}

/**
 * @desc Takes a comma separated string of address parts and splits it into an array, while making adjustments such as making sure apt. number is included in the street, if present.
 * @param {string} address - Comma-separated address as copied from Shopify. 
 * @returns {string[]} Array of address parts ([name, street, town, country, telephone]).
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
    const streetName = street.split(' ').filter(part => !part.match(/\d+/)).join(' ');
    // match parts of STREET containing a number
    const houseNumber = street.split(' ').filter(part => part.match(/\d+/)).join(' ');
    // match any parts of TOWN containing a number
    const postalCode = townAndPostalCode.split(' ').filter(part => part.match(/\d+/)).join(' ');
    // TOWN without post code
    const municipality = townAndPostalCode.replace(postalCode, '').trim();
    // only NUMERIC parts of telephone
    const phoneNumericOnly = telephone.replace(/\D/g, '');

    return [givenName, surname, streetName, houseNumber, municipality, postalCode, phoneNumericOnly].map(x => x.trim());
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
 * Fill the fields for street name and number. When sending to Czechia, street number should be included in the street name field.
 * @param {string} street - Street name and number.
 */
function pasteStreetNameAndNumber(street) {
    // match parts of STREET not containing a number
    const streetName = street.split(' ').filter(part => !part.match(/\d+/)).join(' ');
    // match parts of STREET containing a number
    const streetNumber = street.split(' ').filter(part => part.match(/\d+/)).join(' ');
    const streetNoInput = document.getElementById('adresat.adresa.cpcoRucni');
    if (streetNoInput) {
    }
    else {
        clipboardFeed.push(streetName + " " + streetNumber);
    }
}



/** 
 * @desc Entrypoint method. 
*/
async function start() {
    //setupMessageListeners();
    //handlePageLoaded();
    setUpControlVListener();
    appendTextArea();
}

start();
