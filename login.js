// =========================
// Login Form
// =========================

const loginForm =
    document.querySelector("#loginForm");

const loginMessage =
    document.querySelector("#loginMessage");


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // =========================
        // Get Values
        // =========================

        const email =
            document.querySelector("#email")
                .value
                .trim()
                .toLowerCase();


        const password =
            document.querySelector("#password")
                .value;


        // =========================
        // Validation
        // =========================

        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;

        }


        // =========================
        // Login
        // =========================

        try {

            const response =
                await fetch(
                    "login.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            email:
                                email,

                            password:
                                password

                        })

                    }
                );


            const result =
                await response.json();


            if (!result.success) {

                throw new Error(
                    result.error
                );

            }


            console.log(
                "Customer logged in:",
                result.customer
            );


            // =========================
            // Save Basic Customer Info
            // =========================

            localStorage.setItem(
                "nazafarinCustomer",
                JSON.stringify(
                    result.customer
                )
            );


            loginMessage.textContent =
                "Login successful!";


            // =========================
            // Go To Home
            // =========================

            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 700);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            loginMessage.textContent =
                error.message;

        }

    }
);