// =========================
// Register Form
// =========================

const registerForm =
    document.querySelector("#registerForm");

const registerMessage =
    document.querySelector("#registerMessage");


registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // =========================
        // Get Values
        // =========================

        const firstName =
            document.querySelector("#firstName")
                .value
                .trim();

        const lastName =
            document.querySelector("#lastName")
                .value
                .trim();

        const email =
            document.querySelector("#email")
                .value
                .trim()
                .toLowerCase();

        const phone =
            document.querySelector("#phone")
                .value
                .trim();

        const password =
            document.querySelector("#password")
                .value;

        const confirmPassword =
            document.querySelector("#confirmPassword")
                .value;


        // =========================
        // Validation
        // =========================

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {

            registerMessage.textContent =
                "Please fill in all fields.";

            return;

        }


        if (password.length < 8) {

            registerMessage.textContent =
                "Password must be at least 8 characters.";

            return;

        }


        if (password !== confirmPassword) {

            registerMessage.textContent =
                "Passwords do not match.";

            return;

        }


        // =========================
        // Register
        // =========================

        try {

            const response =
                await fetch(
                    "register.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            firstName:
                                firstName,

                            lastName:
                                lastName,

                            email:
                                email,

                            phone:
                                phone,

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


            registerMessage.textContent =
                "Account created successfully!";


            registerForm.reset();


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            registerMessage.textContent =
                error.message;

        }

    }
);