document.addEventListener("DOMContentLoaded", function () {
    const resetForm = document.getElementById('forgotPasswordForm');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const showPassword = document.getElementById('showPassword');

    showPassword.addEventListener("change", function () {
        const type = showPassword.checked ? "text" : "password";
        newPassword.setAttribute("type", type);
        confirmPassword.setAttribute("type", type);
    });

    newPassword.addEventListener('input', function () {
        if (newPassword.value.length < 6) {
            newPassword.setCustomValidity('Password must be at least 6 characters long.');
            newPassword.reportValidity();
        } else {
            newPassword.setCustomValidity('');
        }
    });

    ['copy', 'paste', 'cut'].forEach(event => {
        newPassword.addEventListener(event, function (e) {
            e.preventDefault();
        });
    });

    ['copy', 'paste', 'cut'].forEach(event => {
        confirmPassword.addEventListener(event, function (e) {
            e.preventDefault();
        });
    });

    resetForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const newPasswordValue = newPassword.value;
        const confirmPasswordValue = confirmPassword.value;

        if (!email || !newPasswordValue || !confirmPasswordValue) {
            Swal.fire({
                title: "Error",
                text: "All fields are required!",
                icon: "error",
                backdrop: false,
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        if (newPasswordValue.length < 6) {
            Swal.fire({
                title: "Error",
                text: "Password must be at least 6 characters long.",
                icon: "error",
                backdrop: false,
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        if (newPasswordValue !== confirmPasswordValue) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match!",
                icon: "error",
                backdrop: false,
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPasswordValue
                })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Password reset successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false
                }).then(() => {
                    window.location.href = './../pages/login.html';
                });
            } else if (data.message === 'Email not found') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Email not found!',
                    backdrop: false,
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed!',
                    text: 'Failed to reset password: ' + data.message,
                    backdrop: false
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while resetting the password.',
                backdrop: false
            });
        }
    });
});
