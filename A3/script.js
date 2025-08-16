document.addEventListener('DOMContentLoaded', () => {
    // Select all necessary elements from the DOM
    const passwordOutput = document.getElementById('password-output');
    const copyButton = document.getElementById('copy-button');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const generateButton = document.getElementById('generate-button');

    // Character sets for password generation
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // Update the length display when the slider is moved
    lengthSlider.addEventListener('input', (event) => {
        lengthValue.textContent = event.target.value;
    });

    // Function to generate the password
    const generatePassword = () => {
        const length = parseInt(lengthSlider.value);
        let characterPool = '';
        let generatedPassword = '';

        // Build the pool of characters based on selected options
        if (uppercaseCheck.checked) characterPool += charSets.uppercase;
        if (lowercaseCheck.checked) characterPool += charSets.lowercase;
        if (numbersCheck.checked) characterPool += charSets.numbers;
        if (symbolsCheck.checked) characterPool += charSets.symbols;

        // Handle case where no options are selected
        if (characterPool === '') {
            passwordOutput.textContent = 'Select an option!';
            return;
        }

        // Generate the password by picking random characters from the pool
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterPool.length);
            generatedPassword += characterPool[randomIndex];
        }

        passwordOutput.textContent = generatedPassword;
    };

    // Function to copy the password to the clipboard
    const copyPassword = () => {
        const password = passwordOutput.textContent;
        // Don't copy if it's an error message
        if (!password || password === 'Select an option!') return;

        navigator.clipboard.writeText(password).then(() => {
            // Provide user feedback on successful copy
            const originalIcon = copyButton.innerHTML;
            copyButton.innerHTML = `✔️`;
            setTimeout(() => {
                copyButton.innerHTML = originalIcon;
            }, 1500);
        });
    };

    // Add event listeners
    generateButton.addEventListener('click', generatePassword);
    copyButton.addEventListener('click', copyPassword);
});