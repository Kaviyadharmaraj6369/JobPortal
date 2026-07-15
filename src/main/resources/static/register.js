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

async function register() {

    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    const user = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        role: "USER"
    };

    if (!user.name || !user.email || !user.password || !confirmPassword) {

        document.getElementById("result").innerHTML = `
            <div class="error-box">
                PLEASE FILL ALL FIELDS
            </div>
        `;

        return;
    }

    if (user.password !== confirmPassword) {

        document.getElementById("result").innerHTML = `
            <div class="error-box">
                Passwords don't match. Please try again.
            </div>
        `;

        return;
    }

    try {

        const res = await fetch(BASE_URL + "/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        const message = await res.text();

        // ================= SUCCESS =================
        if (res.ok) {

            document.getElementById("result").innerHTML = `
                <div class="success-box">
                    REGISTRATION SUCCESSFUL
                </div>
            `;

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        }

        // ================= ERROR =================
        else {

            if (message === "EMAIL_EXISTS") {

                document.getElementById("result").innerHTML = `
            <div class="error-box">
                <h2>Email already registered.</h2>
                <p>Redirecting to Login...</p>
            </div>
        `;

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);

            } else {

                document.getElementById("result").innerHTML = `
            <div class="error-box">
                <h2>Registration Failed</h2>
            </div>
        `;

            }

        }

    } catch (error) {

        console.log(error);

        document.getElementById("result").innerHTML = `
            <div class="error-box">
                SERVER ERROR
            </div>
        `;
    }
}