// Google Apps Script URL for submitting data
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzz75Xa1s_lTr782mNss8iAKHdcL6lfT9IwAvWn-HhMrX69nle_PA8KUHbCPJRhRkS3/exec";

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

// Function to get the current date and time
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString(); // This will return the date and time in local format
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
        alert("Data has been submitted successfully!"); // Success message
    }).catch(error => {
        console.error('Failed to send data to Google Sheets:', error);
        alert("Failed to submit data. Please try again."); // Failure message
    });
}

// Store form data and send to Google Sheets
function storeFormData() {
    const formData = {
        referenceNo: document.getElementById('referenceNo').value,
        datetime: document.getElementById('dateTime').value,
        Checker: document.getElementById('checkerName').value,  // Checker name field
        locator: document.getElementById('locator').value,       // Locator field
        LPN: document.getElementById('lpnNo').value              // LPN NO field
    };

    sendFormDataToGoogleSheet(formData);  // Send the data to Google Sheets

    // Clear Locator and LPN NO after saving data
    resetForm();
    document.getElementById('locator').focus();  // Move focus back to Locator
}

// Event listener for the Submit button to store form data
document.getElementById('submitBtn').addEventListener('click', function() {
    storeFormData();  // Save and send data to Google Sheets
});

// Set up initial form values on page load
window.onload = initializeForm;
