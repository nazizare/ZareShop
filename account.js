// =========================
// Load Customer Account
// =========================

const savedCustomer =
    localStorage.getItem(
        "nazafarinCustomer"
    );


// =========================
// Check Login
// =========================

if (!savedCustomer) {

    window.location.href =
        "login.html";

} else {

    try {

        const customer =
            JSON.parse(
                savedCustomer
            );


        displayCustomer(
            customer
        );


        // =========================
        // Edit Profile
        // =========================

        setupEditProfile(
            customer
        );


    } catch (error) {

        console.error(
            "Customer data error:",
            error
        );

        localStorage.removeItem(
            "nazafarinCustomer"
        );

        window.location.href =
            "login.html";

    }

}


// =========================
// Display Customer
// =========================

function displayCustomer(
    customer
) {

    document.querySelector(
        "#accountFirstName"
    ).textContent =
        customer.first_name || "-";


    document.querySelector(
        "#accountLastName"
    ).textContent =
        customer.last_name || "-";


    document.querySelector(
        "#accountEmail"
    ).textContent =
        customer.email || "-";


    document.querySelector(
        "#accountPhone"
    ).textContent =
        customer.phone || "";

}


// =========================
// Edit Profile
// =========================

function setupEditProfile(
    customer
) {

    const editButton =
        document.querySelector(
            "#editProfileButton"
        );


    const profileView =
        document.querySelector(
            "#profileView"
        );


    const editForm =
        document.querySelector(
            "#editProfileForm"
        );


    const cancelButton =
        document.querySelector(
            "#cancelEditProfile"
        );


    const firstNameInput =
        document.querySelector(
            "#editFirstName"
        );


    const lastNameInput =
        document.querySelector(
            "#editLastName"
        );


    const emailInput =
        document.querySelector(
            "#editEmail"
        );


    const phoneInput =
        document.querySelector(
            "#editPhone"
        );


    editButton.addEventListener(
        "click",
        () => {

            firstNameInput.value =
                customer.first_name || "";


            lastNameInput.value =
                customer.last_name || "";


            emailInput.value =
                customer.email || "";


            phoneInput.value =
                customer.phone || "";


            profileView.style.display =
                "none";


            editForm.style.display =
                "block";

        }
    );


    cancelButton.addEventListener(
        "click",
        () => {

            editForm.style.display =
                "none";


            profileView.style.display =
                "grid";

        }
    );


    // =========================
    // Save Profile
    // =========================

    editForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const updatedCustomer = {

                first_name:
                    firstNameInput.value.trim(),

                last_name:
                    lastNameInput.value.trim(),

                phone:
                    phoneInput.value.trim()

            };


            try {

                const response =
                    await fetch(
                        "update_customer.php",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    updatedCustomer
                                )

                        }
                    );


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.error
                    );

                }


                // Update Local Storage

                localStorage.setItem(
                    "nazafarinCustomer",
                    JSON.stringify(
                        result.customer
                    )
                );


                // Update UI

                displayCustomer(
                    result.customer
                );


                customer =
                    result.customer;


                editForm.style.display =
                    "none";


                profileView.style.display =
                    "grid";


                alert(
                    "Profile updated successfully."
                );


            } catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}


// =========================
// Change Password
// =========================

const changePasswordForm =
    document.querySelector(
        "#changePasswordForm"
    );


if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const currentPassword =
                document.querySelector(
                    "#currentPassword"
                ).value;


            const newPassword =
                document.querySelector(
                    "#newPassword"
                ).value;


            const confirmPassword =
                document.querySelector(
                    "#confirmPassword"
                ).value;


            if (
                newPassword !==
                confirmPassword
            ) {

                alert(
                    "New passwords do not match."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "change_password.php",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                current_password:
                                    currentPassword,

                                new_password:
                                    newPassword,

                                confirm_password:
                                    confirmPassword

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


                changePasswordForm.reset();


                alert(
                    "Password changed successfully."
                );


            } catch (error) {

                console.error(
                    "Password change error:",
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}


// =========================
// Logout
// =========================

const logoutButton =
    document.querySelector(
        "#accountLogoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {

                return;

            }


            try {

                const response =
                    await fetch(
                        "customer_logout.php"
                    );


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.error ||
                        "Logout failed."
                    );

                }


                localStorage.removeItem(
                    "nazafarinCustomer"
                );


                localStorage.removeItem(
                    "nazafarinOrderId"
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Could not logout."
                );

            }

        }
    );

}