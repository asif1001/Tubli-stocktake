// Google Apps Script URL for submitting data
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_URL/exec";

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

// Function to get the current date and time
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

// Reset all form fields except Reference No and Date/Time
function resetForm() {
    document.getElementById('checkerName').value = '';
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
}

// Function to send form data to Google Sheets
function sendDataToGoogleSheets(data) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    })
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.status === "success") {
                console.log('Data submitted successfully:', responseJson.message);
                removeFromQueue(); // Remove successfully sent data from the queue
                processQueue();    // Process the next item in the queue
            } else {
                console.error('Server Error:', responseJson.message);
            }
        })
        .catch(error => {
            console.error('Error submitting data:', error);
        });
}

// Local storage queue management
function addToQueue(data) {
    const queue = JSON.parse(localStorage.getItem('dataQueue')) || [];
    queue.push(data);
    localStorage.setItem('dataQueue', JSON.stringify(queue));
    processQueue(); // Start processing the queue
}

function removeFromQueue() {
    const queue = JSON.parse(localStorage.getItem('dataQueue')) || [];
    queue.shift(); // Remove the first item
    localStorage.setItem('dataQueue', JSON.stringify(queue));
}

function processQueue() {
    const queue = JSON.parse(localStorage.getItem('dataQueue')) || [];
    if (queue.length > 0) {
        sendDataToGoogleSheets(queue[0]); // Send the first item in the queue
    }
}

// Store form data and add it to the local queue
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

    addToQueue(formData); // Add data to the queue
    document.getElementById('lastLpn').textContent = formData.LPN; // Display last entered LPN
    document.getElementById('lpnNo').value = '';
    document.getElementById('lpnNo').focus();
}

// Event listeners for Enter key navigation and submission
document.getElementById('checkerName').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('locator').focus();
    }
});

document.getElementById('locator').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('lpnNo').focus();
    }
});

document.getElementById('lpnNo').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        storeFormData();
    }
});

// Set up initial form values and focus on Checker Name field on page load
window.onload = function () {
    initializeForm();
    document.getElementById('checkerName').focus();
};
