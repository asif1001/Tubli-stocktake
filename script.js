// Google Apps Script URL for submitting data
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx6yUcY_cMTgyRlcaboo73E8DvBalJvtQ9zM3K53b_9zD7Vqu1G6JgXr5QcnQBmgENu/exec";

// Function to generate a unique reference number with username
function generateReferenceNo(username) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${username}_${year}${month}${date}${hours}${minutes}`;
}

// Function to get the current date and time (used as a timestamp)
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString(); // Returns the date and time in local format
}

// Initialize form and reset values
function initializeForm() {
    const username = document.getElementById('usernameField').value || "defaultUser"; // Default username if empty
    document.getElementById('referenceNo').value = generateReferenceNo(username);
    document.getElementById('dateTime').value = getCurrentDateTime();
    resetForm();
}

// Function to reset the form fields except Reference No and Date/Time
function resetForm() {
    document.getElementById('checkerName').value = '';  // Reset Checker name
    document.getElementById('locator').value = '';      // Reset Locator
    document.getElementById('lpnNo').value = '';        // Reset LPN NO
}

// Function to send form data to Google Sheets via Apps Script Web App
function sendFormDataToGoogleSheet(data) {
    console.log('Sending Form Data:', data); // Debug log for form data
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
        alert('Data submitted successfully!');
    })
    .catch(error => {
        console.error('Error submitting data:', error);
        alert('Failed to submit data. Please try again.');
    });
}

// Store form data, clear LPN field, and send to Google Sheets
function storeFormData() {
    const currentDateTime = getCurrentDateTime();
    document.getElementById('dateTime').value = currentDateTime;

    const formData = {
        referenceNo: document.getElementById('referenceNo').value,
        datetime: currentDateTime,
        Checker: document.getElementById('checkerName').value,
        locator: document.getElementById('locator').value,
        LPN: document.getElementById('lpnNo').value,
    };

    sendFormDataToGoogleSheet(formData);

    document.getElementById('lastLpn').textContent = formData.LPN;
    document.getElementById('lpnNo').value = '';
    document.getElementById('lpnNo').focus();
}

// Event listeners for handling Enter key navigation and submission after entering LPN NO
document.getElementById('checkerName').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('locator').focus();
    }
});

document.getElementById('locator').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('lpnNo').focus();
    }
});

document.getElementById('lpnNo').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        storeFormData();
    }
});

// Set up initial form values and focus on Checker Name field on page load
window.onload = function() {
    initializeForm();
    document.getElementById('checkerName').focus();
};
