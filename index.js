// Fetching custom attributes made in HTML file
const wordInput = document.querySelector("[data-wordInput]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

// Set password length
function handleSlider() {
    const inputSlider = document.querySelector("[data-lengthSlider]");
    inputSlider.value = passwordLength;
    inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        updateLengthDisplay();
    });
    updateLengthDisplay();
}

// Update the password length display
function updateLengthDisplay() {
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    lengthDisplay.innerText = passwordLength;
}

// Set color of strength indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

// Generate a random integer within a range
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generate a random number
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

// Generate a random lowercase letter
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

// Generate a random uppercase letter
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// Generate a random symbol
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Calculate the strength of the password
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// Copy the password to the clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Handle checkbox change events
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Generate password based on the word input
function generatePassword() {
    const word = wordInput.value.trim();
    if (word === '') {
        return ''; // Empty word, return empty password
    }

    let funArr = [];

    if (uppercaseCheck.checked) {
        funArr.push(generateUpperCase);
    }

    if (lowercaseCheck.checked) {
        funArr.push(generateLowerCase);
    }

    if (numbersCheck.checked) {
        funArr.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        funArr.push(generateSymbol);
    }

    password = '';

    for (let i = 0; i < word.length; i++) {
        password += word[i].toLowerCase(); // Add lowercase version of each character in the word
    }

    for (let i = 0; i < passwordLength - word.length; i++) {
        const randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    password = shuffleArray(Array.from(password));
    return password;
}

// Update the password field with the generated password
function updatePasswordField() {
    passwordDisplay.value = generatePassword();
    calcStrength();
}

generateBtn.addEventListener('click', updatePasswordField);

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});
