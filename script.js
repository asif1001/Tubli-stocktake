// Initialize EmailJS with your User ID (Public Key)
(function(){
    emailjs.init("H1NlmM-K_eGlclzfa"); // Replace with your actual User ID (Public Key)
})();

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
    return now.toLocaleString(); // Returns the date and time in local format
}

// Initialize form and reset values
let referenceNo = generateReferenceNo();
let dateTime = getCurrentDateTime();
initializeForm();  // Ensures all fields except Reference No and Date/Time are empty

// Function to reset only LPN No and refresh Date and Time
function resetLPNAndDate() {
    dateTime = getCurrentDateTime();  // Refresh date and time
    document.getElementById('dateTime').value = dateTime;
    document.getElementById('lpnNo').value = '';  // Clear only LPN No field
    document.getElementById('lpnNo').focus();  // Move focus back to LPN No
}

// Function to initialize the form with Reference No and Date/Time
function initializeForm() {
    referenceNo = generateReferenceNo();  // Generate new reference no
    dateTime = getCurrentDateTime();      // Generate new date and time
    document.getElementById('referenceNo').value = referenceNo;
    document.getElementById('dateTime').value = dateTime;
    document.getElementById('checkerName').value = '';
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
    document.getElementById('checkerName').focus();  // Start focus on Checker Name
}

// Function to save data to Google Sheets
function storeFormData() {
    const newEntry = {
        referenceNo: document.getElementById('referenceNo').value,
        dateTime: document.getElementById('dateTime').value,
        checkerName: document.getElementById('checkerName').value,
        locator: document.getElementById('locator').value,
        lpnNo: document.getElementById('lpnNo').value
    };

    // Send data to Google Sheets using the provided Web App URL
    fetch("https://script.google.com/macros/s/AKfycbzC583yhPSWu4f6DljPD5Ia56EFg4cqHqNxPr2ZywLdSxKs4e_jHVR39hMFwivgTg6Q/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEntry)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Data saved to Google Sheets successfully");
            alert("Data has been saved to Google Sheets!"); // Notify the user
            resetLPNAndDate();  // Reset only LPN No field and refresh Date/Time
        } else {
            console.error("Failed to save data to Google Sheets:", data.message);
            alert("Failed to save data to Google Sheets. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while saving data. Please check your connection or try again.");
    });
}

// Set up field navigation to control cursor flow
function setupFieldNavigation() {
    const checkerNameField = document.getElementById('checkerName');
    const locatorField = document.getElementById('locator');
    const lpnNoField = document.getElementById('lpnNo');

    // Move from Checker Name to Locator
    checkerNameField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            locatorField.focus();  // Move focus to Locator
        }
    });

    // Move from Locator to LPN No
    locatorField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            lpnNoField.focus();  // Move focus to LPN No
        }
    });

    // When LPN No is entered, store data and reset LPN No
    lpnNoField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            storeFormData();  // Save data and reset LPN No and Date/Time
        }
    });
}

// Initialize form and field navigation on page load
window.onload = function() {
    initializeForm();
    setupFieldNavigation();
};
