// Initialize EmailJS with your User ID (Public Key) - optional if you no longer need EmailJS
(function() {
    emailjs.init("H1NlmM-K_eGlclzfa"); // Replace with your actual User ID (Public Key), if needed
})();

// Google Apps Script URL and Deployment ID
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzz75Xa1s_lTr782mNss8iAKHdcL6lfT9IwAvWn-HhMrX69nle_PA8KUHbCPJRhRkS3/exec";

// Function to generate the reference number (YearMonthDayHourMinute)
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
let referenceNo = generateReferenceNo();
let dateTime = getCurrentDateTime();
resetForm();  // Ensure all fields except Reference No and Date/Time are empty

// Function to reset the form while keeping Reference No, Date, and Checker name
function resetForm() {
    referenceNo = generateReferenceNo();  // Generate new reference no
    dateTime = getCurrentDateTime();      // Generate new date and time
    document.getElementById('referenceNo').value = referenceNo;
    document.getElementById('dateTime').value = dateTime;
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

// Store form data, clear relevant fields, and send to Google Sheets
function storeFormData() {
    const formData = {
        referenceNo: document.getElementById('referenceNo').value,
        datetime: document.getElementById('dateTime').value,
        Checker: document.getElementById('checkerName').value,  // "Checker" field
        locator: document.getElementById('locator').value,       // "Locator" field
        LPN: document.getElementById('lpnNo').value              // "LPN NO" field
    };

    sendFormDataToGoogleSheet(formData);  // Send the data to Google Sheets

    // Clear Locator and LPN NO after saving data
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
    document.getElementById('locator').focus();  // Move focus back to Locator
}

// Event listener for the Submit button to store form data
document.getElementById('submitBtn').addEventListener('click', function() {
    storeFormData();  // Save and send data to Google Sheets
});

// Set up field navigation on page load
window.onload = function() {
    document.getElementById('checkerName').focus();  // Automatically focus on Checker name field when form loads
};
