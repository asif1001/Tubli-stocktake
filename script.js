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
    return now.toLocaleString(); // This will return the date and time in local format
}

// Load form entries from local storage
function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    return entries;
}

// Save form entries to local storage
function saveEntries(entries) {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Initialize form and reset values
let entries = loadEntries();
let referenceNo = generateReferenceNo();
let dateTime = getCurrentDateTime();
resetForm();  // Ensure all fields except Reference No and Date/Time are empty

// Function to reset the form while keeping Reference No and Date/Time
function resetForm() {
    referenceNo = generateReferenceNo();  // Generate new reference no
    dateTime = getCurrentDateTime();      // Generate new date and time
    document.getElementById('referenceNo').value = referenceNo;
    document.getElementById('dateTime').value = dateTime;
    document.getElementById('checkerName').value = '';
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
}

// Function to save data to Google Sheets and local storage
function storeFormData() {
    const newEntry = {
        referenceNo: document.getElementById('referenceNo').value,
        dateTime: document.getElementById('dateTime').value,
        checkerName: document.getElementById('checkerName').value,
        locator: document.getElementById('locator').value,
        lpnNo: document.getElementById('lpnNo').value
    };

    entries.push(newEntry);  // Add a new entry to local storage entries
    saveEntries(entries);    // Save entries to local storage

    // Send data to Google Sheets
    fetch("YOUR_WEB_APP_URL", {  // Replace YOUR_WEB_APP_URL with the deployed Web App URL
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
        } else {
            console.error("Failed to save data to Google Sheets:", data.message);
            alert("Failed to save data to Google Sheets. Please try again.");
        }
    })
    .catch(error => console.error("Error:", error));

    // Clear Locator and LPN No fields after saving data
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
    document.getElementById('locator').focus();  // Move focus back to Locator
}

// Function to generate text content for the email
function generateTextContent() {
    let textContent = `SOP Binning Data:\n\n`;

    // Iterate over each saved entry and append it as key-value pairs
    entries.forEach(entry => {
        textContent += `Reference No: ${entry.referenceNo}\n`;
        textContent += `Date/Time: ${entry.dateTime}\n`;
        textContent += `Checker Name: ${entry.checkerName}\n`;
        textContent += `Locator: ${entry.locator}\n`;
        textContent += `LPN No: ${entry.lpnNo}\n`;
        textContent += `-------------------------\n`; // Separator for each entry
    });

    return textContent;
}

// Function to send email with the collected form data using EmailJS
function sendEmailWithText() {
    const referenceNo = document.getElementById('referenceNo').value;

    // Collect all form data and format it into key-value pairs
    const emailContent = generateTextContent();

    // EmailJS params for sending the email
    const params = {
        to_email: "asif.s@ekkanoo.com.bh,Abdul.R@Ekkanoo.com.bh,enrico.b@Ekkanoo.com.bh,fadhel.h@Ekkanoo.com.bh",
        subject: `SOP-Binning ${referenceNo}`,
        message: emailContent
    };

    // Use EmailJS to send the email
    emailjs.send("service_s2ro656", "template_nox6zuh", params)
        .then(function(response) {
            console.log('Email sent successfully', response.status, response.text);
            alert("Email has been sent successfully!");
        }, function(error) {
            console.error('Failed to send email. Error details:', error);
            alert("Failed to send email. Please try again.");
        });
}

// Event listener for the Submit button to send email
document.getElementById('submitBtn').addEventListener('click', function() {
    sendEmailWithText();  // Send the collected form data via email
});

// Function to download all saved data as a text file
document.getElementById('downloadBtn').addEventListener('click', function() {
    const textContent = generateTextContent(); // Generate text content for download
    downloadTextFile("form_data.txt", textContent); // Download the text file with all form data
});

// Helper function to trigger file download
function downloadTextFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Field navigation: from Locator -> LPN No
function setupFieldNavigation() {
    const locatorField = document.getElementById('locator');
    const lpnNoField = document.getElementById('lpnNo');

    // Helper function to handle Enter/Tab key navigation
    function handleKeyNavigation(event, nextField) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior
            nextField.focus(); // Move focus to the next field
        }
    }

    // Move from Locator to LPN No
    locatorField.addEventListener('keydown', function(event) {
        handleKeyNavigation(event, lpnNoField);
    });

    // Save data and move back to Locator from LPN No
    lpnNoField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior
            storeFormData();  // Save the data when LPN No is entered
        }
    });
}

// Set up field navigation on page load
window.onload = function() {
    document.getElementById('checkerName').focus();  // Automatically focus on Checker Name field when form loads
    setupFieldNavigation();  // Set up the sequence of cursor movement
};
