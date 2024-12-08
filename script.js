// Google Apps Script URL for submitting data
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxnAk-7dtrl05p_iaQnoV4Rx-arFTfm322BL5YMA4KJ4Zq3I_wWgqvCu2Z4G1iQwfIe/exec";

let formQueue = []; // Array to temporarily store form data

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

// Function to temporarily store form data in a queue
function storeFormData() {
    const currentDateTime = getCurrentDateTime();
    document.getElementById('dateTime').value = currentDateTime;

    const formData = {
        referenceNo: document.getElementById('referenceNo').value,
        datetime: currentDateTime,  // Use the current timestamp here
        checkerName: document.getElementById('checkerName').value,  // Checker name field
        locator: document.getElementById('locator').value,          // Locator field
        lpnNo: document.getElementById('lpnNo').value               // LPN NO field
    };

    // Add form data to the local queue
    formQueue.push(formData);

    // Display the last entered LPN
    document.getElementById('lastLpn').textContent = formData.lpnNo;

    // Clear only the LPN NO field after saving data
    document.getElementById('lpnNo').value = '';
    document.getElementById('lpnNo').focus();  // Set focus back to LPN NO for next entry

    // Log the queued data for debugging
    console.log('Form data queued:', formData);
}

// Function to send queued form data to Google Sheets
function sendQueuedData() {
    if (formQueue.length > 0) {
        // Prepare batch payload
        const payload = JSON.stringify(formQueue);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Batch data sent successfully.');
                    formQueue = []; // Clear the queue after successful submission
                } else {
                    console.error('Error in response:', data);
                }
            })
            .catch(error => {
                console.error('Failed to send batch data:', error);
            });
    } else {
        console.log('No data to send.');
    }
}

// Function to change the locator without affecting other fields
function changeLocator() {
    document.getElementById('locator').value = ''; // Clear only the Locator field
    document.getElementById('locator').focus();    // Set focus back to Locator
}

// Set up initial form values on page load
window.onload = function() {
    initializeForm();
    document.getElementById('checkerName').focus();
};

