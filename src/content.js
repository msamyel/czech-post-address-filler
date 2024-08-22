/** @module main **/

/**
 * @file Content script that will run on "Poslat zásilku" page and will fill in the form with the data from the order.
 * @author Matěj <matej94v@gmail.com>
 */

countries = { "AF/": "Afghanistan", "AX/": "Aland Islands", "AL/": "Albania", "DZ/": "Algeria", "AS/": "American Samoa", "AD/": "Andorra", "AO/": "Angola", "AI/": "Anguilla", "AQ/": "Antarctica", "AG/": "Antigua and Barbuda", "AR/": "Argentina", "AM/": "Armenia", "AW/": "Aruba", "AU/ACT": "Australia Australian Capital Territory", "AU/NSW": "Australia New South Wales", "AU/NT": "Australia Northern Territory", "AU/QLD": "Australia Queensland", "AU/SA": "Australia South Australia", "AU/TAS": "Australia Tasmania", "AU/VIC": "Australia Victoria", "AU/WA": "Australia Western Australia", "AT/": "Austria", "AZ/": "Azerbaijan", "BS/": "Bahamas", "BH/": "Bahrain", "BD/": "Bangladesh", "BB/": "Barbados", "BY/": "Belarus", "BE/": "Belgium", "BZ/": "Belize", "BJ/": "Benin", "BM/": "Bermuda", "BT/": "Bhutan", "BO/": "Bolivia", "BA/": "Bosnia and Herzegovina", "BW/": "Botswana", "BV/": "Bouvet Island", "BR/AC": "Brazil Acre", "BR/AL": "Brazil Alagoas", "BR/AP": "Brazil Amapa", "BR/AM": "Brazil Amazonas", "BR/BA": "Brazil Bahia", "BR/CE": "Brazil Ceara", "BR/DF": "Brazil Distrito Federal", "BR/ES": "Brazil Espirito Santo", "BR/GO": "Brazil Goias", "BR/MA": "Brazil Maranhao", "BR/MT": "Brazil Mato Grosso", "BR/MS": "Brazil Mato Grosso do Sul", "BR/MG": "Brazil Minas Gerais", "BR/PA": "Brazil Para", "BR/PB": "Brazil Paraiba", "BR/PR": "Brazil Parana", "BR/PE": "Brazil Pernambuco", "BR/PI": "Brazil Piaui", "BR/RJ": "Brazil Rio de Janeiro", "BR/RN": "Brazil Rio Grande do Norte", "BR/RS": "Brazil Rio Grande do Sul", "BR/RO": "Brazil Rondonia", "BR/RR": "Brazil Roraima", "BR/SC": "Brazil Santa Catarina", "BR/SP": "Brazil Sao Paulo", "BR/SE": "Brazil Sergipe", "BR/TO": "Brazil Tocantins", "IO/": "British Indian Ocean Territory", "BN/": "Brunei Darussalam", "BG/": "Bulgaria", "BF/": "Burkina Faso", "BI/": "Burundi", "KH/": "Cambodia", "CM/": "Cameroon", "CA/AB": "Canada Alberta", "CA/BC": "Canada British Columbia", "CA/MB": "Canada Manitoba", "CA/NB": "Canada New Brunswick", "CA/NL": "Canada Newfoundland and Labrador", "CA/NT": "Canada Northwest Territories", "CA/NS": "Canada Nova Scotia", "CA/NU": "Canada Nunavut", "CA/ON": "Canada Ontario", "CA/PE": "Canada Prince Edward Island", "CA/QC": "Canada Quebec", "CA/SK": "Canada Saskatchewan", "CA/YT": "Canada Yukon", "IC/": "Canary Islands", "CV/": "Cape Verde", "BQ/": "Carribean part of the Netherlands", "KY/": "Cayman Islands", "CF/": "Central African Republic", "TD/": "Chad", "CL/": "Chile", "CN/": "China (People's Rep)", "CX/": "Christmas Islands", "CC/": "Cocos (Keeling) Islands", "CO/": "Colombia", "KM/": "Comoros", "CG/": "Congo", "CK/": "Cook Islands", "CR/": "Costa Rica", "CI/": "Cote d'Ivoire", "HR/": "Croatia", "CU/": "Cuba", "CW/": "Curacao", "CY/": "Cyprus", "CZ/": "Czech Republic", "KP/": "Democratic People's Republic of Korea", "DK/": "Denmark", "DJ/": "Djibouti", "DM/": "Dominica", "DO/": "Dominican Republic", "EC/": "Ecuador", "EG/": "Egypt", "SV/": "El Salvador", "GQ/": "Equatorial Guinea", "ER/": "Eritrea", "EE/": "Estonia", "ET/": "Ethiopia", "FK/": "Falkland Islands (Malvinas)", "FO/": "Faroe Islands", "FM/": "Federated States of Micronesia", "FJ/": "Fiji", "FI/": "Finland", "FR/": "France", "GF/": "French Guiana", "PF/": "French Polynesia", "TF/": "French Southern Territories", "GA/": "Gabon", "GM/": "Gambia", "GE/": "Georgia", "DE/": "Germany", "GH/": "Ghana", "GI/": "Gibraltar", "GR/": "Greece", "GL/": "Greenland", "GD/": "Grenada", "GP/": "Guadeloupe", "GU/": "Guam", "GT/": "Guatemala", "GG/": "Guernsey", "GN/": "Guinea", "GW/": "Guinea-Bissau", "GY/": "Guyana", "HT/": "Haiti", "HM/": "Heard Island and McDonald Islands", "VA/": "Holy See (Vatican City State)", "HN/": "Honduras", "HK/": "Hong Kong", "HU/": "Hungary", "IS/": "Iceland", "IN/": "India", "ID/": "Indonesia", "IQ/": "Iraq", "IE/": "Ireland", "IR/": "Islamic Republic of Iran", "IM/": "Isle of Man", "IL/": "Israel", "IT/": "Italy", "JM/": "Jamaica", "JP/": "Japan", "JE/": "Jersey", "JO/": "Jordan", "KZ/": "Kazakhstan", "KE/": "Kenya", "SZ/": "Kingdom of Eswatini", "KI/": "Kiribati", "XZ/": "Kosovo", "KW/": "Kuwait", "KG/": "Kyrgyzstan", "LA/": "Lao People's Democratic Republic", "LV/": "Latvia", "LB/": "Lebanon", "LS/": "Lesotho", "LR/": "Liberia", "LY/": "Libya Arab Jamahiriya", "LI/": "Liechtenstein", "LT/": "Lithuania", "LU/": "Luxembourg", "MO/": "Macao", "MK/": "Macedonia", "MG/": "Madagascar", "MW/": "Malawi", "MY/": "Malaysia", "MV/": "Maldives", "ML/": "Mali", "MT/": "Malta", "MH/": "Marshall Islands", "MQ/": "Martinique", "MR/": "Mauritania", "MU/": "Mauritius", "YT/": "Mayotte", "MX/AGU": "Mexico Aguascalientes", "MX/BCN": "Mexico Baja California", "MX/BCS": "Mexico Baja California Sur", "MX/CAM": "Mexico Campeche", "MX/CHP": "Mexico Chiapas", "MX/CHH": "Mexico Chihuahua", "MX/CMX": "Mexico Ciudad de Mexico", "MX/COA": "Mexico Coahuila de Zaragoza", "MX/COL": "Mexico Colima", "MX/DUR": "Mexico Durango", "MX/GUA": "Mexico Guanajuato", "MX/GRO": "Mexico Guerrero", "MX/HID": "Mexico Hidalgo", "MX/JAL": "Mexico Jalisco", "MX/MEX": "Mexico Mexico", "MX/MIC": "Mexico Michoacan de Ocampo", "MX/MOR": "Mexico Morelos", "MX/NAY": "Mexico Nayarit", "MX/NLE": "Mexico Nuevo Leon", "MX/OAX": "Mexico Oaxaca", "MX/PUE": "Mexico Puebla", "MX/QUE": "Mexico Queretaro", "MX/ROO": "Mexico Quintana Roo", "MX/SLP": "Mexico San Luis Potosi", "MX/SIN": "Mexico Sinaloa", "MX/SON": "Mexico Sonora", "MX/TAB": "Mexico Tabasco", "MX/TAM": "Mexico Tamaulipas", "MX/TLA": "Mexico Tlaxcala", "MX/VER": "Mexico Veracruz de Ignacio de la Llave", "MX/YUC": "Mexico Yucatan", "MX/ZAC": "Mexico Zacatecas", "MC/": "Monaco", "MN/": "Mongolia", "ME/": "Monte Negro, Rep", "MS/": "Montserrat", "MA/": "Morocco", "MZ/": "Mozambique", "MM/": "Myanmar", "NA/": "Namibia", "NR/": "Nauru", "NP/": "Nepal", "NL/": "Netherlands", "NC/": "New Caledonia", "NZ/": "New Zealand", "NI/": "Nicaragua", "NE/": "Niger", "NG/": "Nigeria", "NU/": "Niue", "NF/": "Norfolk Island", "MP/": "Northern Mariana Islands", "NO/": "Norway", "OM/": "Oman", "PK/": "Pakistan", "PW/": "Palau", "PS/": "Palestinian Territory, Occupied", "PA/": "Panama", "PG/": "Papua New Guinea", "PY/": "Paraguay", "PE/": "Peru", "PH/": "Philippines", "PN/": "Pitcairn", "PL/": "Poland", "PT/": "Portugal", "PR/": "Puerto Rico", "QA/": "Qatar", "KR/": "Republic of Korea", "MD/": "Republic of Moldova", "RE/": "Réunion", "RO/": "Romania", "RU/": "Russian Federation", "RW/": "Rwanda", "BL/": "Saint Barthélemy", "SH/": "Saint Helena (Ascencion, Tristan da Cunha)", "KN/": "Saint Kitts and Nevis", "LC/": "Saint Lucia", "MF/": "Saint Martin", "PM/": "Saint Pierre and Miquelon", "VC/": "Saint Vincent and the Grenadines", "WS/": "Samoa", "SM/": "San Marino", "ST/": "Sao Tome and Principe", "SA/": "Saudi Arabia", "SN/": "Senegal", "RS/": "Serbia, Rep.", "SC/": "Seychelles", "SL/": "Sierra Leone", "SG/": "Singapore", "SX/": "Sint Maarten", "SK/": "Slovakia", "SI/": "Slovenia", "SB/": "Solomon Islands", "SO/": "Somalia", "ZA/": "South Africa", "GS/": "South Georgia and the South Sandwich Islands", "SS/": "South Sudan", "ES/VI": "Spain Álava/Araba (Vitoria/Gasteiz)", "ES/AB": "Spain Albacete (Albacete)", "ES/A": "Spain Alicante/Alacant (Alicante/Alacant)", "ES/AL": "Spain Almería (Almería)", "ES/AN": "Spain Andalusie", "ES/AR": "Spain Aragonie", "ES/O": "Spain Asturias (Oviedo)", "ES/AS": "Spain Asturie", "ES/AV": "Spain Ávila (Ávila)", "ES/BA": "Spain Badajoz (Badajoz)", "ES/IB": "Spain Baleáry", "ES/PM": "Spain Baleáry (Islas Baleares/Illes Balears, Palma de Mallorca)", "ES/B": "Spain Barcelona (Barcelona)", "ES/PV": "Spain Baskicko", "ES/BU": "Spain Burgos (Burgos)", "ES/CC": "Spain Cáceres (Cáceres)", "ES/CA": "Spain Cádiz (Cádiz)", "ES/S": "Spain Cantabria (Santander)", "ES/CS": "Spain Castellón/Castelló (Castellón de la Plana/Castelló de la Plana)", "ES/CE": "Spain Ceuta (Ceuta)", "ES/CR": "Spain Ciudad Real (Ciudad Real)", "ES/CO": "Spain Córdoba (Córdoba)", "ES/CU": "Spain Cuenca (Cuenca)", "ES/EX": "Spain Extramadura", "ES/GA": "Spain Galicie", "ES/GI": "Spain Gerona/Girona (Gerona/Girona)", "ES/GR": "Spain Granada (Granada)", "ES/GU": "Spain Guadalajara (Guadalajara)", "ES/SS": "Spain Guipúzcoa/Gipuzkoa (San Sebastián/Donostia)", "ES/H": "Spain Huelva (Huelva)", "ES/HU": "Spain Huesca (Huesca)", "ES/J": "Spain Jaén (Jaén)", "ES/CB": "Spain Kantábrie", "ES/CL": "Spain Kastilie a León", "ES/CM": "Spain Kastilie – La Mancha", "ES/CT": "Spain Katalánsko", "ES/C": "Spain La Coruña/A Coruña (La Coruña/A Coruña)", "ES/RI": "Spain La Rioja", "ES/LO": "Spain La Rioja (Logroño)", "ES/GC": "Spain Las Palmas (Las Palmas de Gran Canaria)", "ES/LE": "Spain León (León)", "ES/L": "Spain Lérida/Lleida (Lérida/Lleida)", "ES/LU": "Spain Lugo (Lugo)", "ES/M": "Spain Madrid (Madrid)", "ES/MD": "Spain Madridské autonomní společenství", "ES/MA": "Spain Málaga (Málaga)", "ES/ML": "Spain Melilla (Melilla)", "ES/MU": "Spain Murcia (Murcia)", "ES/MC": "Spain Murcijský region", "ES/NC": "Spain Navarra", "ES/NA": "Spain Navarra (Pamplona)", "ES/OR": "Spain Orense/Ourense (Orense/Ourense)", "ES/P": "Spain Palencia (Palencia)", "ES/PO": "Spain Pontevedra (Pontevedra)", "ES/SA": "Spain Salamanca (Salamanca)", "ES/SG": "Spain Segovia (Segovia)", "ES/SE": "Spain Sevilla (Sevilla)", "ES/SO": "Spain Soria (Soria)", "ES/T": "Spain Tarragona (Tarragona)", "ES/TF": "Spain Tenerife (Santa Cruz De Tenerife)", "ES/TE": "Spain Teruel (Teruel)", "ES/TO": "Spain Toledo (Toledo)", "ES/V": "Spain Valencia/València (Valencia\València)", "ES/VC": "Spain Valencijské společenství", "ES/VA": "Spain Valladolid (Valladolid)", "ES/BI": "Spain Vizcaya/Bizkaia (Bilbao/Bilbo)", "ES/ZA": "Spain Zamora (Zamora)", "ES/Z": "Spain Zaragoza (Zaragoza)", "LK/": "Sri Lanka", "SD/": "Sudan", "SR/": "Suriname", "SJ/": "Svalbard and Jan Mayen", "SE/": "Sweden", "CH/": "Switzerland", "SY/": "Syrian Arab Republic", "TW/": "Taiwan", "TJ/": "Tajikistan", "TZ/": "Tanzania", "TH/": "Thailand", "CD/": "The democratic republic of Congo", "TL/": "Timor - Leste", "TG/": "Togo", "TK/": "Tokelau", "TO/": "Tonga", "TT/": "Trinidad and Tobago", "TN/": "Tunisia", "TR/": "Turkey", "TM/": "Turkmenistan", "TC/": "Turks and Caicos Islands", "TV/": "Tuvalu", "UG/": "Uganda", "UA/": "Ukraine", "AE/": "United Arab Emirates", "GB/": "United Kingdom", "UM/": "United States Minor Outlying Island", "US/AL": "United States of America Alabama", "US/AK": "United States of America Alaska", "US/AS": "United States of America Americká Samoa", "US/AZ": "United States of America Arizona", "US/AR": "United States of America Arkansas", "US/AA": "United States of America Armed Forces Americas", "US/AE": "United States of America Armed Forces Europe", "US/AP": "United States of America Armed Forces Pacific", "US/CA": "United States of America California", "US/CO": "United States of America Colorado", "US/CT": "United States of America Connecticut", "US/DE": "United States of America Delaware", "US/DC": "United States of America District of Columbia", "US/FM": "United States of America Federativní státy Mikronésie", "US/FL": "United States of America Florida", "US/GA": "United States of America Georgia", "US/GU": "United States of America Guam", "US/HI": "United States of America Hawaii", "US/ID": "United States of America Idaho", "US/IL": "United States of America Illinois", "US/IN": "United States of America Indiana", "US/IA": "United States of America Iowa", "US/KS": "United States of America Kansas", "US/KY": "United States of America Kentucky", "US/LA": "United States of America Louisiana", "US/ME": "United States of America Maine", "US/MD": "United States of America Maryland", "US/MA": "United States of America Massachusetts", "US/MI": "United States of America Michigan", "US/MN": "United States of America Minnesota", "US/MS": "United States of America Mississippi", "US/MO": "United States of America Missouri", "US/MT": "United States of America Montana", "US/NE": "United States of America Nebraska", "US/NV": "United States of America Nevada", "US/NH": "United States of America New Hampshire", "US/NJ": "United States of America New Jersey", "US/NM": "United States of America New Mexico", "US/NY": "United States of America New York", "US/NC": "United States of America North Carolina", "US/ND": "United States of America North Dakota", "US/OH": "United States of America Ohio", "US/OK": "United States of America Oklahoma", "US/OR": "United States of America Oregon", "US/VI": "United States of America Panenské ostrovy", "US/PA": "United States of America Pennsylvania", "US/PR": "United States of America Portorické společenství", "US/MH": "United States of America Republika Marshallovy ostrovy", "US/PW": "United States of America Republika Palau", "US/RI": "United States of America Rhode Island", "US/SC": "United States of America South Carolina", "US/SD": "United States of America South Dakota", "US/MP": "United States of America Společenství Severní Mariany", "US/TN": "United States of America Tennessee", "US/TX": "United States of America Texas", "US/UT": "United States of America Utah", "US/VT": "United States of America Vermont", "US/VA": "United States of America Virginia", "US/WA": "United States of America Washington", "US/WV": "United States of America West Virginia", "US/WI": "United States of America Wisconsin", "US/WY": "United States of America Wyoming", "UY/": "Uruguay", "UZ/": "Uzbekistan", "VU/": "Vanuatu", "VE/": "Venezuela", "VN/": "Viet Nam", "VI/": "Virgin Islands of the USA", "VG/": "Virgin Islands, British", "WF/": "Wallis and Futuna", "EH/": "Western Sahara", "YE/": "Yemen", "ZM/": "Zambia", "ZW/": "Zimbabwe", }

/**
 * Sets up message listeners to receive data from popup.
 */
function setupMessageListeners() {
    // listen for messages from popup
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action == "pasteAddress") {
                console.log("Received address: " + request.address);
                // Name Surname, No. Street, Town Region, Country, Telephone
                const [name, street, town, country, telephone] = splitAddress(request.address);
                const countryCode = getCountryCode(town + " " + country);
                console.log("Country code: " + countryCode);
                storeAddressInStorage(request.address).then(() => {
                    activateCountrySelection();
                    setTimeout(() => { selectCountry(countryCode); }, 1000);
                });
            }
        }
    );
}

function splitAddress(address) {
    return address.split(',');
}

function getCountryCode(address) {
    for (const [countryCode, countryName] of Object.entries(countries)) {
        const countryNameParts = countryName.split(' ');
        if (countryNameParts.every(part => address.includes(part))) {
            console.log("Country: " + countryName);
            return countryCode;
        }
    }
    return null;
}

function storeAddressInStorage(address) {
    return new Promise(resolve => {
        chrome.storage.local.set({ "address": address }, function () {
            resolve();
        });
    });
}

function removeAddressFromStorage() {
    return new Promise(resolve => {
        chrome.storage.local.remove("address", function () {
            resolve();
        });
    });
}

function getAddressFromStorage() {
    return new Promise(resolve => {
        chrome.storage.local.get("address", function (result) {
            resolve(result.address);
        });
    });
}

async function saveAddressToStorage(address) {
    await chrome.storage.sync.set({ 'address': address }, function () {
        console.log('Saved address to localStorage.');
    });
}

function handlePageLoaded() {
    console.log("Page loaded.");
    getAddressFromStorage().then(address => {
        console.log("Address from storage: " + address);
        if (!address) {
            // no address was saved, do nothing
            return;
        }
        // remove the address from local storage so it doesn't linger
        removeAddressFromStorage().then(() => {
            // paste the address into the form
            pasteAddressIntoForm(address);
        });
    });
}

function pasteAddressIntoForm(address) {
    const [name, street, town, country, telephone] = splitAddress(address);
    let [givenName, surname] = name.split(' ');
    if (!surname) {
        surname = givenName;
    }
    document.getElementById('adresat.jmeno').value = givenName;
    document.getElementById('adresat.prijmeni').value = surname;

    // match non-numeric parts of STREET
    const streetName = street.split(' ').filter(part => !part.match(/^\d+$/)).join(' ');
    // match numeric parts of STREET
    const streetNumber = street.split(' ').filter(part => part.match(/^\d+$/)).join(' ');
    document.getElementById('adresat.adresa.uliceRucni').value = streetName;
    document.getElementById('adresat.adresa.cpcoRucni').value = streetNumber;

    // match any parts of TOWN containing a number
    const postCode = town.split(' ').filter(part => part.match(/\d+/)).join(' ');
    document.getElementById('adresat.adresa.pscZahranicni').value = postCode;

    // TOWN without post code
    const municipality = town.replace(postCode, '').trim();
    document.getElementById('adresat.adresa.obecCastObceRucni').value = municipality;

    const phone = telephone.replace(/\D/g, '');
    document.getElementById('adresat.kontakt.telefon').value = "+" + phone;
}

function activateCountrySelection() {
    const countrySelection = document.getElementById('adresatZemeUrceni-selectized');
    countrySelection.click();
}

function selectCountry(countryCode) {
    const countriesList = document.querySelectorAll('.selectize-dropdown-content .option');
    countriesList.forEach(country => {
        if (country.dataset.value === countryCode) {
            console.log("Clicking on country: " + countryCode);
            country.click();
        }
    });
}

/** Entrypoint method. */
async function start() {
    setupMessageListeners();
    handlePageLoaded();
}


start();
