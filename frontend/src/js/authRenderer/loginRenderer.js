document.addEventListener("DOMContentLoaded", function () {
    const usernameOremailid = document.getElementById("usernameOremailid");
    const password = document.getElementById("password");
    const showPasswordCheckbox = document.getElementById("showPassword");

    ['copy', 'paste', 'cut'].forEach(event => {
        password.addEventListener(event, function (event) {
            event.preventDefault();
        });
    });

    showPasswordCheckbox.addEventListener("change", function () {
        const type = showPasswordCheckbox.checked ? "text" : "password";
        password.setAttribute("type", type);
    })


    loginBtn.addEventListener("click", async () => {
        const usernameORemailValue = usernameOremailid.value;
        const passwordValue = password.value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usernameOremailid: usernameORemailValue, password: passwordValue })
            })
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                // document.getElementById('message').innerText = 'Login successful!';
                Swal.fire({
                    title: "Success",
                    text: 'Login successful!',
                    icon: "success",
                    backdrop: false,
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = './../pages/createTask.html'
                })
            } else {
                // document.getElementById('message').innerText = data.message;
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                    backdrop: false,
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            console.error(err);
            // document.getElementById('message').innerText = `Error: ${err.message}`;
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
                backdrop: false,
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    })
})
