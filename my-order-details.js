// =========================
// Get Order ID
// =========================

const params =
    new URLSearchParams(
        window.location.search
    );


const orderId =
    Number(params.get("id"));


// =========================
// Elements
// =========================

const orderIdElement =
    document.querySelector("#orderId");

const orderDate =
    document.querySelector("#orderDate");

const orderStatus =
    document.querySelector("#orderStatus");

const customerDetails =
    document.querySelector("#customerDetails");

const shippingDetails =
    document.querySelector("#shippingDetails");

const orderItems =
    document.querySelector("#orderItems");

const orderTotal =
    document.querySelector("#orderTotal");

const orderMessage =
    document.querySelector("#orderMessage");


// =========================
// Validate Order ID
// =========================

if (!orderId) {

    showError(
        "Invalid order ID."
    );

} else {

    loadOrder();

}


// =========================
// Load Order
// =========================

async function loadOrder() {

    try {

        const response =
            await fetch(
                `get_customer_order.php?id=${encodeURIComponent(orderId)}`
            );


        const result =
            await response.json();


        console.log(
            "Customer Order:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.error ||
                "Could not load order."
            );

        }


        const order =
            result.order;


        const items =
            result.items;


        // =========================
        // Order Information
        // =========================

        orderIdElement.textContent =
            order.id;


        orderDate.textContent =
            formatDate(
                order.created_at
            );


        orderStatus.textContent =
            order.status || "Pending";


        // =========================
        // Customer
        // =========================

        customerDetails.innerHTML = `

            <p>
                <strong>Name:</strong>
                ${order.first_name}
                ${order.last_name}
            </p>

            <p>
                <strong>Email:</strong>
                ${order.email}
            </p>

            <p>
                <strong>Phone:</strong>
                ${order.phone}
            </p>

        `;


        // =========================
        // Shipping
        // =========================

        shippingDetails.innerHTML = `

            <p>
                <strong>Address:</strong>
                ${order.address}
            </p>

            <p>
                <strong>City:</strong>
                ${order.city}
            </p>

            <p>
                <strong>Postal Code:</strong>
                ${order.postal_code}
            </p>

        `;


        // =========================
        // Products
        // =========================

        orderItems.innerHTML = "";


        if (items.length === 0) {

            orderItems.innerHTML = `
                <p>
                    No products found.
                </p>
            `;

        } else {

            items.forEach((item) => {

                const itemElement =
                    document.createElement("div");


                itemElement.className =
                    "customer-order-item";


                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                itemElement.innerHTML = `

                    <div class="customer-order-product">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <p>
                                Quantity:
                                ${item.quantity}
                            </p>

                            <p>
                                Price:
                                $${Number(
                                    item.price
                                ).toFixed(2)}
                            </p>

                        </div>

                    </div>


                    <strong>
                        $${itemTotal.toFixed(2)}
                    </strong>

                `;


                orderItems.appendChild(
                    itemElement
                );

            });

        }


        // =========================
        // Total
        // =========================

        orderTotal.textContent =
            `$${Number(
                order.total
            ).toFixed(2)}`;


    } catch (error) {

        console.error(
            "Error loading customer order:",
            error
        );


        showError(
            error.message
        );

    }

}


// =========================
// Error
// =========================

function showError(message) {

    orderMessage.innerHTML = `

        <div class="order-error">

            ${message}

        </div>

    `;

}


// =========================
// Format Date
// =========================

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}