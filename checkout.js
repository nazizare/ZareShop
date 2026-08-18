// =========================
// Load Cart
// =========================

let cart =
    JSON.parse(
        localStorage.getItem("nazafarinCart")
    ) || [];


// =========================
// Elements
// =========================

const checkoutItems =
    document.querySelector("#checkoutItems");

const checkoutTotal =
    document.querySelector("#checkoutTotal");

const placeOrderButton =
    document.querySelector("#placeOrderButton");


// =========================
// Render Checkout
// =========================

function renderCheckout() {

    checkoutItems.innerHTML = "";

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p class="empty-checkout">
                Your cart is empty.
            </p>
        `;

        checkoutTotal.textContent = "$0.00";

        return;
    }


    cart.forEach((item) => {

        const checkoutItem =
            document.createElement("div");

        checkoutItem.classList.add(
            "checkout-item"
        );


        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        checkoutItem.innerHTML = `

            <div class="checkout-item-info">

                <strong>
                    ${item.name}
                </strong>

                <span>
                    Quantity: ${item.quantity}
                </span>

            </div>

            <strong>
                $${itemTotal.toFixed(2)}
            </strong>

        `;


        checkoutItems.appendChild(
            checkoutItem
        );

    });


    updateCheckoutTotal();

}


// =========================
// Calculate Total
// =========================

function updateCheckoutTotal() {

    const total =
        cart.reduce(
            (sum, item) => {

                return (
                    sum +
                    Number(item.price) *
                    Number(item.quantity)
                );

            },
            0
        );


    checkoutTotal.textContent =
        `$${total.toFixed(2)}`;

}


// =========================
// Start
// =========================

renderCheckout();


// =========================
// Place Order
// =========================

placeOrderButton.addEventListener(
    "click",
    async () => {

        // =========================
        // Get Customer Information
        // =========================

        const firstName =
            document
                .querySelector("#firstName")
                .value
                .trim();


        const lastName =
            document
                .querySelector("#lastName")
                .value
                .trim();


        const email =
            document
                .querySelector("#email")
                .value
                .trim()
                .toLowerCase();


        const phone =
            document
                .querySelector("#phone")
                .value
                .trim();


        const address =
            document
                .querySelector("#address")
                .value
                .trim();


        const city =
            document
                .querySelector("#city")
                .value
                .trim();


        const postalCode =
            document
                .querySelector("#postalCode")
                .value
                .trim();


        // =========================
        // Check Empty Fields
        // =========================

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !postalCode
        ) {

            alert(
                "Please fill in all fields."
            );

            return;

        }


        // =========================
        // Check Cart
        // =========================

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        // =========================
        // Email Validation
        // =========================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            alert(
                "Please enter a valid email address."
            );

            return;

        }


        // =========================
        // Phone Validation
        // =========================

        const phonePattern =
            /^[0-9+\-\s]{8,15}$/;


        if (
            !phonePattern.test(phone)
        ) {

            alert(
                "Please enter a valid phone number."
            );

            return;

        }


        // =========================
        // Postal Code Validation
        // =========================

        const postalPattern =
            /^[0-9]{5,10}$/;


        if (
            !postalPattern.test(postalCode)
        ) {

            alert(
                "Please enter a valid postal code."
            );

            return;

        }


        // =========================
        // Create Order
        // =========================

        const order = {

            customer: {

                firstName:
                    firstName,

                lastName:
                    lastName,

                email:
                    email,

                phone:
                    phone,

                address:
                    address,

                city:
                    city,

                postalCode:
                    postalCode

            },

            items:
                cart

        };


        // =========================
        // Disable Button
        // =========================

        placeOrderButton.disabled =
            true;

        placeOrderButton.textContent =
            "Processing...";


        try {

            // =========================
            // Save Order
            // =========================

            const response =
                await fetch(
                    "save_order.php",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(order)

                    }
                );


            const result =
                await response.json();


            console.log(
                "Save Order Result:",
                result
            );


            // =========================
            // Check Result
            // =========================

            if (!result.success) {

                throw new Error(
                    result.error ||
                    "Order could not be saved."
                );

            }


            // =========================
            // Save Latest Order ID
            // =========================

            localStorage.setItem(
                "nazafarinOrderId",
                result.order_id
            );


            // =========================
            // Save Customer Info
            // =========================

            const customerInfo = {

                id:
                    result.customer_id,

                first_name:
                    firstName,

                last_name:
                    lastName,

                email:
                    email,

                phone:
                    phone

            };


            localStorage.setItem(
                "nazafarinCustomer",
                JSON.stringify(
                    customerInfo
                )
            );


            // =========================
            // Clear Cart
            // =========================

            localStorage.removeItem(
                "nazafarinCart"
            );


            // Update local variable
            cart = [];


            // =========================
            // Go To Success
            // =========================

            window.location.href =
                "success.html";


        } catch (error) {

            console.error(
                "Order error:",
                error
            );


            alert(
                error.message ||
                "Something went wrong while placing your order."
            );


            // Enable button again

            placeOrderButton.disabled =
                false;

            placeOrderButton.textContent =
                "Place Order";

        }

    }
);


// =========================
// Mobile Menu
// =========================

const menuToggle =
    document.querySelector("#menuToggle");

const navigation =
    document.querySelector(".navigation");


if (
    menuToggle &&
    navigation
) {

    menuToggle.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "mobile-open"
            );

        }
    );

}