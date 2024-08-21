
function pasteAdress(address) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "action": "pasteAddress", "address": address });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('address-input');
    textarea.focus();
    textarea.placeholder = 'Press Ctrl+V to paste the address';
    textarea.style.backgroundColor = 'lightyellow';
    textarea.addEventListener('input', function () {
        const address = textarea.value;
        pasteAdress(address);
    });
});