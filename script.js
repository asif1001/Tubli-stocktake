// Google Apps Script URL for submitting data
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxnAk-7dtrl05p_iaQnoV4Rx-arFTfm322BL5YMA4KJ4Zq3I_wWgqvCu2Z4G1iQwfIe/exec";

let formQueue = []; // Array to store form data temporarily

// Function to generate a unique reference number (YearMonthDayHourMinuteSecondMillisecond)
function generateReferenceNo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}`;
}

// Function to get the current date and time
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
    document.getElementById('checkerName').value = '';
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
}

// Function to temporarily store form data in a queue
function storeFormData() {
    const currentDateTime = getCurrentDateTime();
    document.getElementById('dateTime').value = currentDateTime;

    const formData = {
        referenceNo: document.getElementById('referenceNo').value,
        datetime: currentDateTime,
        checkerName: document.getElementById('checkerName').value,
        locator: document.getElementById('locator').value,
        lpnNo: document.getElementById('lpnNo').value
    };

    formQueue.push(formData); // Add to the local queue

    document.getElementById('lastLpn').textContent = formData.lpnNo; // Display last entered LPN
    document.getElementById('lpnNo').value = ''; // Clear the LPN NO field
    document.getElementById('lpnNo').focus(); // Focus back on LPN NO field

    console.log('Form data queued:', formData);
}

// Function to send queued form data to Google Sheets
function sendQueuedData() {
    if (formQueue.length > 0) {
        const payload = JSON.stringify(formQueue); // Prepare batch payload

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', // Use POST method
            headers: {
                'Content-Type': 'application/json' // Ensure JSON content type
            },
            body: payload // Send queued data
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Data sent successfully.');
                formQueue = []; // Clear the queue on success
            } else {
                console.error('Error in response:', data.message);
            }
        })
        .catch(error => {
            console.error('Failed to send data:', error);
        });
    } else {
        console.log('No data to send.');
    }
}

// Function to change the locator without affecting other fields
function changeLocator() {
    document.getElementById('locator').value = '';
    document.getElementById('locator').focus();
}

// Initialize form on page load
window.onload = function() {
    initializeForm();
    document.getElementById('checkerName').focus();
};
