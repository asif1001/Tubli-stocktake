(function(){
    emailjs.init("H1NlmM-K_eGlclzfa"); // Replace with your actual User ID (Public Key)
})();

function generateReferenceNo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${date}${hours}${minutes}`;
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    return entries;
}

function saveEntries(entries) {
    localStorage.setItem('entries', JSON.stringify(entries));
}

let entries = loadEntries();
let referenceNo = generateReferenceNo();
let dateTime = getCurrentDateTime();
resetForm();

function resetForm() {
    referenceNo = generateReferenceNo();
    dateTime = getCurrentDateTime();
    document.getElementById('referenceNo').value = referenceNo;
    document.getElementById('dateTime').value = dateTime;
    document.getElementById('checkerName').value = '';
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
}

function storeFormData() {
    const newEntry = {
        referenceNo: document.getElementById('referenceNo').value,
        dateTime: document.getElementById('dateTime').value,
        checkerName: document.getElementById('checkerName').value,
        locator: document.getElementById('locator').value,
        lpnNo: document.getElementById('lpnNo').value
    };

    entries.push(newEntry);
    saveEntries(entries);
    document.getElementById('locator').value = '';
    document.getElementById('lpnNo').value = '';
    document.getElementById('locator').focus();
}

function generateTextContent() {
    let textContent = `SOP Binning Data:\n\n`;

    entries.forEach(entry => {
        textContent += `Reference No: ${entry.referenceNo}\n`;
        textContent += `Date/Time: ${entry.dateTime}\n`;
        textContent += `Checker Name: ${entry.checkerName}\n`;
        textContent += `Locator: ${entry.locator}\n`;
        textContent += `LPN No: ${entry.lpnNo}\n`;
        textContent += `-------------------------\n`;
    });

    return textContent;
}

function sendEmailWithText() {
    const referenceNo = document.getElementById('referenceNo').value;
    const emailContent = generateTextContent();

    const params = {
        to_email: "asif.s@ekkanoo.com.bh,Abdul.R@Ekkanoo.com.bh,enrico.b@Ekkanoo.com.bh,fadhel.h@Ekkanoo.com.bh",
        subject: `SOP-Binning ${referenceNo}`,
        message: emailContent
    };

    emailjs.send("service_s2ro656", "template_nox6zuh", params)
        .then(function(response) {
            console.log('Email sent successfully', response.status, response.text);
            alert("Email has been sent successfully!");
        }, function(error) {
            console.error('Failed to send email. Error details:', error);
            alert("Failed to send email. Please try again.");
        });
}

document.getElementById('submitBtn').addEventListener('click', function() {
    sendEmailWithText();
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const textContent = generateTextContent();
    downloadTextFile("form_data.txt", textContent);
});

function downloadTextFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function setupFieldNavigation() {
    const locatorField = document.getElementById('locator');
    const lpnNoField = document.getElementById('lpnNo');

    function handleKeyNavigation(event, nextField) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            nextField.focus();
        }
    }

    locatorField.addEventListener('keydown', function(event) {
        handleKeyNavigation(event, lpnNoField);
    });

    lpnNoField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            storeFormData();
        }
    });
}

window.onload = function() {
    document.getElementById('checkerName').focus();
    setupFieldNavigation();
};
