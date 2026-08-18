// =========================
// Load Latest Order
// =========================

const orderId =
    localStorage.getItem("nazafarinOrderId");


console.log(
    "Latest Order ID:",
    orderId
);


// =========================
// Check Order ID
// =========================

if (!orderId) {

    document.body.innerHTML = `

        <h1 style="text-align:center; margin-top:100px;">
            No order found.
        </h1>

        <p style="text-align:center;">
            Please place an order first.
        </p>

    `;

} else {

    loadOrder(orderId);

}


// =========================
// Load Customer Order
// =========================

async function loadOrder(orderId) {

    try {

        const response =
            await fetch(
                `get_success_order.php?id=${encodeURIComponent(orderId)}`
            );


        const result =
            await response.json();


        console.log(
            "Order from Database:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.error ||
                "Order not found."
            );

        }


        const order =
            result.order;


        // =========================
        // Display Order
        // =========================

        const orderIdElement =
            document.querySelector(
                "#orderId"
            );


        const customerName =
            document.querySelector(
                "#customerName"
            );


        const orderTotal =
            document.querySelector(
                "#orderTotal"
            );


        if (orderIdElement) {

            orderIdElement.textContent =
                order.id;

        }


        if (customerName) {

            customerName.textContent =
                `${order.first_name} ${order.last_name}`;

        }


        if (orderTotal) {

            orderTotal.textContent =
                `$${Number(
                    order.total
                ).toFixed(2)}`;

        }


    } catch (error) {

        console.error(
            "Error loading order:",
            error
        );


        document.body.innerHTML = `

            <h1 style="text-align:center; margin-top:100px;">
                Could not load order.
            </h1>

            <p style="text-align:center;">
                ${error.message}
            </p>

        `;

    }

}


// =========================
// Mobile Menu
// =========================

const menuToggle =
    document.querySelector(
        "#menuToggle"
    );


const navigation =
    document.querySelector(
        ".navigation"
    );


if (menuToggle && navigation) {

    menuToggle.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "mobile-open"
            );

        }
    );

}