document.addEventListener('DOMContentLoaded', () => {
    const otpInputsContainer = document.getElementById('otp-inputs');
    const inputs = otpInputsContainer.querySelectorAll('.otp-digit');
    const form = document.getElementById('otp-form');
    const messageArea = document.getElementById('message-area');
    const CORRECT_OTP = "1230"; // The valid OTP for this demo

    // Function to handle auto-focusing to the next input
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            // If a digit is entered and it's not the last input, focus the next one
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Function to handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        let enteredOtp = '';
        inputs.forEach(input => {
            enteredOtp += input.value;
        });

        // Reset previous states
        otpInputsContainer.classList.remove('valid', 'invalid');
        messageArea.textContent = '';
        messageArea.classList.remove('success');

        // Validate the OTP
        if (enteredOtp === CORRECT_OTP) {
            otpInputsContainer.classList.add('valid');
            messageArea.textContent = 'Success! Your email has been verified.';
            messageArea.classList.add('success');
        } else {
            otpInputsContainer.classList.add('invalid');
            // As per requirement, show an alert for invalid OTP
            alert('Invalid OTP');
        }
    });
});