// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
const EXCLUDE = 'iIl1o0O';

// Get DOM elements
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const specialCheckbox = document.getElementById('special');
const excludeCheckbox = document.getElementById('exclude');
const lengthInput = document.getElementById('length');
const quantityInput = document.getElementById('quantity');
const generateButton = document.getElementById('generate');
const outputTextarea = document.getElementById('output');
const lengthDecrease = document.getElementById('length-decrease');
const lengthIncrease = document.getElementById('length-increase');
const quantityDecrease = document.getElementById('quantity-decrease');
const quantityIncrease = document.getElementById('quantity-increase');
const copyNotification = document.getElementById('copy-notification');

// Event listeners for length and quantity buttons
lengthDecrease.addEventListener('click', () => adjustValue(lengthInput, -1, 8, 512));
lengthIncrease.addEventListener('click', () => adjustValue(lengthInput, 1, 8, 512));
quantityDecrease.addEventListener('click', () => adjustValue(quantityInput, -1, 1, 999));
quantityIncrease.addEventListener('click', () => adjustValue(quantityInput, 1, 1, 999));

// Generate password on button click
generateButton.addEventListener('click', () => {
    generatePasswords();
});

// Copy to clipboard on textarea click
outputTextarea.addEventListener('click', () => {
    if (outputTextarea.value.trim() !== "") { // Make sure the text box has content before triggering copy
        outputTextarea.select();
        document.execCommand('copy');
        // Show a popup and hide it after 1 second
        copyNotification.style.display = 'block';
        setTimeout(() => {
            copyNotification.style.display = 'none';
        },1000);
    }
});

// Adjust input values with min/max constraints
function adjustValue(input, change, min, max) {
    let value = parseInt(input.value) + change;
    if (value < min) value = min;
    if (value > max) value = max;
    input.value = value;
}

// Generate passwords
function generatePasswords() {
    const length = parseInt(lengthInput.value);
    const quantity = parseInt(quantityInput.value);
    let passwords = [];

    for (let i = 0; i < quantity; i++) {
        let password;
        do {
            password = generateSinglePassword(length);
        } while (!isValidPassword(password));
        passwords.push(password);
    }

    outputTextarea.value = passwords.join('\n');
}

// Generate a single password
function generateSinglePassword(length) {
    let chars = '';
    if (uppercaseCheckbox.checked) chars += UPPERCASE;
    if (lowercaseCheckbox.checked) chars += LOWERCASE;
    if (numbersCheckbox.checked) chars += NUMBERS;
    if (specialCheckbox.checked) chars += SPECIAL;
    if (excludeCheckbox.checked) chars = chars.split('').filter(c => !EXCLUDE.includes(c)).join('');

    let password = '';
    const alpha = (uppercaseCheckbox.checked ? UPPERCASE : '') + (lowercaseCheckbox.checked ? LOWERCASE : '');

    // First and last characters must be letters
    password += alpha[Math.floor(Math.random() * alpha.length)];
    for (let i = 1; i < length - 1; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    password += alpha[Math.floor(Math.random() * alpha.length)];

    // Ensure all required types are present
    if (uppercaseCheckbox.checked && !/[A-Z]/.test(password)) password = insertRandomChar(password, UPPERCASE);
    if (lowercaseCheckbox.checked && !/[a-z]/.test(password)) password = insertRandomChar(password, LOWERCASE);
    if (numbersCheckbox.checked && !/[0-9]/.test(password)) password = insertRandomChar(password, NUMBERS);
    if (specialCheckbox.checked && !/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)) password = insertRandomChar(password, SPECIAL);

    return password;
}

// Insert a random character from a set into a random position (not first or last)
function insertRandomChar(password, charSet) {
    const pos = Math.floor(Math.random() * (password.length - 2)) + 1;
    return password.slice(0, pos) + charSet[Math.floor(Math.random() * charSet.length)] + password.slice(pos);
}

// Validate password according to rules
function isValidPassword(password) {
    // Check if first and last characters are letters
    const alpha = UPPERCASE + LOWERCASE;
    if (!alpha.includes(password[0]) || !alpha.includes(password[password.length - 1])) return false;

    // Check if all required types are present
    if (uppercaseCheckbox.checked && !/[A-Z]/.test(password)) return false;
    if (lowercaseCheckbox.checked && !/[a-z]/.test(password)) return false;
    if (numbersCheckbox.checked && !/[0-9]/.test(password)) return false;
    if (specialCheckbox.checked && !/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)) return false;

    // Check for no more than 2 consecutive characters of the same type
    for (let i = 0; i < password.length - 2; i++) {
        if (
            (UPPERCASE.includes(password[i]) && UPPERCASE.includes(password[i + 1]) && UPPERCASE.includes(password[i + 2])) ||
            (LOWERCASE.includes(password[i]) && LOWERCASE.includes(password[i + 1]) && LOWERCASE.includes(password[i + 2])) ||
            (NUMBERS.includes(password[i]) && NUMBERS.includes(password[i + 1]) && NUMBERS.includes(password[i + 2])) ||
            (SPECIAL.includes(password[i]) && SPECIAL.includes(password[i + 1]) && SPECIAL.includes(password[i + 2]))
        ) return false;
    }

    // Check excluded characters
    if (excludeCheckbox.checked && EXCLUDE.split('').some(c => password.includes(c))) return false;

    return true;
}