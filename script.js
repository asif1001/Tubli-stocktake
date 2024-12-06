// Google Apps Script URL for submitting data
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwq1CpE99xEfNA1FdBg263b783IdzVu6HZtq-CCNTeQJTKG6tHPx6GZx4P4nljPo0h3/exec";

// Function to generate a reference number (YearMonthDayHourMinute)
function generateReferenceNo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${date}${hours}${minutes}`;
}

// Function to get the current date and time (used as a timestamp)
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString(); // Returns the date and time in local format
}

// Initialize form and reset values
function initializeForm() {
    document.getElementById('referenceNo').value = generateReferenceNo();
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
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
    }).then(() => {
        console.log('Data sent to Google Sheets successfully.');
    }).catch(error => {
        console.error('Failed to send data to Google Sheets:', error);
    });
}

// Store form data, clear LPN field, and send to Google Sheets
function storeFormData() {
    // Update Date and Time with current timestamp each time data is saved
    const currentDateTime = getCurrentDateTime();
    document.getElementById('dateTime').value = currentDateTime;

    const formData = {
        referenceNo: document.getElementById('referenceNo').value,
        datetime: currentDateTime,  // Use the current timestamp here
        Checker: document.getElementById('checkerName').value,  // Checker name field
        locator: document.getElementById('locator').value,       // Locator field
        LPN: document.getElementById('lpnNo').value              // LPN NO field
    };

    sendFormDataToGoogleSheet(formData);  // Send the data to Google Sheets

    // Display the last entered LPN
    document.getElementById('lastLpn').textContent = formData.LPN;

    // Clear only the LPN NO field after saving data
    document.getElementById('lpnNo').value = '';
    document.getElementById('lpnNo').focus();  // Set focus back to LPN NO for next entry
}

// Function to change the locator without affecting other fields
function changeLocator() {
    document.getElementById('locator').value = ''; // Clear only the Locator field
    document.getElementById('locator').focus();    // Set focus back to Locator
}

// Event listeners for handling Enter key navigation and submission after entering LPN NO
document.getElementById('checkerName').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('locator').focus(); // Move to Locator field
    }
});

document.getElementById('locator').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('lpnNo').focus(); // Move to LPN NO field
    }
});

document.getElementById('lpnNo').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        storeFormData(); // Submit data after entering LPN NO
    }
});

// Set up initial form values and focus on Checker Name field on page load
window.onload = function() {
    initializeForm();
    document.getElementById('checkerName').focus();
};
