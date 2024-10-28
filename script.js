// Function to generate a unique reference number (YearMonthDayHourMinute)
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
    return now.toLocaleString(); // Returns date and time in local format
}

// Initialize form fields with reference number and current date/time
function initializeForm() {
    const referenceNo = generateReferenceNo();
    const dateTime = getCurrentDateTime();

    document.getElementById('referenceNo').value = referenceNo;
    document.getElementById('dateTime').value = dateTime;
    document.getElementById('checkerName').focus();  // Set focus on Checker Name
}

// Function to reset only LPN No and refresh Date and Time
function resetLPNAndDate() {
    document.getElementById('dateTime').value = getCurrentDateTime(); // Refresh date and time
    document.getElementById('lpnNo').value = ''; // Clear only LPN No field
    document.getElementById('lpnNo').focus();  // Set focus back to LPN No for new entry
}

// Function to save form data to Google Sheets
function storeFormData() {
    const newEntry = {
        referenceNo: document.getElementById('referenceNo').value,
        dateTime: document.getElementById('dateTime').value,
        checkerName: document.getElementById('checkerName').value,
        locator: document.getElementById('locator').value,
        lpnNo: document.getElementById('lpnNo').value
    };

    // Send data to Google Sheets using the Web App URL
    fetch("https://script.google.com/macros/s/AKfycbzC583yhPSWu4f6DljPD5Ia56EFg4cqHqNxPr2ZywLdSxKs4e_jHVR39hMFwivgTg6Q/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEntry)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "success") {
            console.log("Data saved to Google Sheets successfully");
            alert("Data has been saved to Google Sheets!"); // Notify the user
            resetLPNAndDate();  // Clear only the LPN No field and refresh Date/Time
        } else {
            console.error("Failed to save data:", data.message);
            alert("Failed to save data to Google Sheets. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error occurred during fetch request:", error);
        alert("An error occurred while saving data. Please check your connection or try again.");
    });
}

// Set up field navigation and auto-submit on LPN No entry
function setupFieldNavigation() {
    const checkerNameField = document.getElementById('checkerName');
    const locatorField = document.getElementById('locator');
    const lpnNoField = document.getElementById('lpnNo');

    // Move focus from Checker Name to Locator
    checkerNameField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            locatorField.focus();
        }
    });

    // Move focus from Locator to LPN No
    locatorField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            lpnNoField.focus();
        }
    });

    // When LPN No is entered, submit form data and reset LPN No
    lpnNoField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            storeFormData();  // Save data and reset only the LPN No field
        }
    });
}

// Initialize the form on page load and set up navigation
window.onload = function() {
    initializeForm();
    setupFieldNavigation();
};
