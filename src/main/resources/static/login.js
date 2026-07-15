
const loggedUser = JSON.parse(localStorage.getItem("user"));

if (loggedUser) {

    window.location.replace("index.html");

}

// ===================================
// SHOW / HIDE PASSWORD
// ===================================

function togglePassword(inputId, iconId) {

    const input = document.getElementById(inputId);

    const icon = document.getElementById(iconId);

    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }
    else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}

async function login() {

    const loginData = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    if (!loginData.email || !loginData.password) {

        document.getElementById("result").innerHTML =
            "<div class='error-box'><h2>Please enter Email and Password</h2></div>";

        return;
    }

    try {

        const res = await fetch(BASE_URL + "/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)

        });

        const response = await res.text();

        if (!res.ok) {

            if (response === "USER_NOT_FOUND") {

                document.getElementById("result").innerHTML =
                    "<div class='error-box'><h2>User not found</h2></div>";

            }
            else if (response === "WRONG_PASSWORD") {

                document.getElementById("result").innerHTML =
                    "<div class='error-box'><h2>Incorrect Password</h2></div>";

            }
            else {

                document.getElementById("result").innerHTML =
                    "<div class='error-box'><h2>Login Failed</h2></div>";

            }

            return;
        }

        const user = JSON.parse(response);

        localStorage.setItem("user", JSON.stringify(user));

        document.getElementById("result").innerHTML =
            "<div class='success-box'><h2>LOGIN SUCCESSFUL</h2></div>";

        setTimeout(() => {

            localStorage.setItem("user", JSON.stringify(user));

            window.location.replace("index.html");

        }, 1000);

    }
    catch (error) {

        console.log(error);

        document.getElementById("result").innerHTML =
            "<div class='error-box'><h2>Server Error</h2></div>";

    }

}