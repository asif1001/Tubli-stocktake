// Google Apps Script URL for submitting data
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx6yUcY_cMTgyRlcaboo73E8DvBalJvtQ9zM3K53b_9zD7Vqu1G6JgXr5QcnQBmgENu/exec";

// Function to generate a unique Reference Number with username
function generateReferenceNo(username) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${username}_${year}${month}${date}${hours}${minutes}${seconds}`;
}

// Function to get the current date and time (used as a timestamp)
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString(); // Returns the date and time in local format
}

// Initialize the form with default values
function initializeForm() {
    const username = document.getElementById('usernameField')?.value || "defaultUser"; // Default username if empty
    const referenceNoField = document.getElementById('referenceNo');
    const dateTimeField = document.getElementById('dateTime');

    if (referenceNoField && dateTimeField) {
        referenceNoField.value = generateReferenceNo(username);
        dateTimeField.value = getCurrentDateTime();
    } else {
        console.error("Reference number or date/time field is missing in the form.");
    }

    resetForm(); // Reset other fields
}

// Function to reset form fields except Reference No and Date/Time
function resetForm() {
    const checkerNameField = document.getElementById('checkerName');
    const locatorField = document.getElementById('locator');
    const lpnNoField = document.getElementById('lpnNo');

    if (checkerNameField) checkerNameField.value = '';
    if (locatorField) locatorField.value = '';
    if (lpnNoField) lpnNoField.value = '';
}

// Function to send form data to Google Sheets via Apps Script Web App
function sendFormDataToGoogleSheet(data) {
    console.log('Sending form data:', data);

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    })
        .then(response => response.text())
        .then(responseText => {
            console.log('Server Response:', responseText);

            // Parse the response to confirm success
            const jsonResponse = JSON.parse(responseText || "{}");
            if (jsonResponse.status === "success") {
                console.log('Data submitted successfully.');
            } else {
                console.error('Server returned an error:', jsonResponse.message);
            }
        })
        .catch(error => {
            console.error('Error submitting data:', error);
        });
}

// Store form data, clear the LPN field, and send to Google Sheets
function storeFormData() {
    const currentDateTime = getCurrentDateTime();

    const formData = {
        referenceNo: document.getElementById('referenceNo')?.value || "N/A",
        datetime: currentDateTime,
        Checker: document.getElementById('checkerName')?.value || "N/A",
        locator: document.getElementById('locator')?.value || "N/A",
        LPN: document.getElementById('lpnNo')?.value || "N/A",
    };

    console.log('Form Data to be sent:', formData);

    sendFormDataToGoogleSheet(formData);

    const lpnField = document.getElementById('lpnNo');
    if (lpnField) {
        document.getElementById('lastLpn').textContent = formData.LPN;
        lpnField.value = ''; // Clear LPN field after submission
        lpnField.focus();    // Set focus back to LPN field
    }
}

// Event listeners for Enter key navigation
document.getElementById('checkerName')?.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('locator')?.focus();
    }
});

document.getElementById('locator')?.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('lpnNo')?.focus();
    }
});

document.getElementById('lpnNo')?.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        storeFormData();
    }
});

// Set up initial form values and focus on Checker Name field on page load
window.onload = function () {
    initializeForm();
    document.getElementById('checkerName')?.focus();
};
