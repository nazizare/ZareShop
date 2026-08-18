// =========================
// Admin Login
// =========================

const adminLoginForm =
    document.querySelector(
        "#adminLoginForm"
    );


const loginMessage =
    document.querySelector(
        "#loginMessage"
    );


adminLoginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const username =
            document.querySelector(
                "#username"
            ).value.trim();


        const password =
            document.querySelector(
                "#password"
            ).value;


        try {

            const response =
                await fetch(
                    "admin_login.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            username:
                                username,

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


            loginMessage.textContent =
                "Login successful!";


            window.location.href =
                "admin.html";


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