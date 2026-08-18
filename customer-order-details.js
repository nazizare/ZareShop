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
// Check Order ID
// =========================

if (!orderId) {

    window.location.href =
        "my-orders.html";

}


// =========================
// Check Customer Login
// =========================

const savedCustomer =
    localStorage.getItem(
        "nazafarinCustomer"
    );


if (!savedCustomer) {

    window.location.href =
        "login.html";

}


// =========================
// Elements
// =========================

const orderIdElement =
    document.querySelector(
        "#orderId"
    );


const orderStatus =
    document.querySelector(
        "#orderStatus"
    );


const customerDetails =
    document.querySelector(
        "#customerDetails"
    );


const shippingDetails =
    document.querySelector(
        "#shippingDetails"
    );


const orderItems =
    document.querySelector(
        "#orderItems"
    );


const orderTotal =
    document.querySelector(
        "#orderTotal"
    );


// =========================
// Load Order
// =========================

async function loadCustomerOrder() {

    try {

        const response =
            await fetch(
                `get_customer_order.php?id=${orderId}`
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error
            );

        }


        const order =
            result.order;


        const items =
            result.items;


        // =========================
        // Order ID
        // =========================

        orderIdElement.textContent =
            order.id;


        // =========================
        // Status
        // =========================

        const status =
            order.status || "Pending";


        orderStatus.textContent =
            status;


        orderStatus.className =
            "order-status " +
            status.toLowerCase();


        // =========================
        // Customer
        // =========================

        customerDetails.innerHTML = `

            <div class="order-info-grid">

                <div>

                    <span>
                        Name
                    </span>

                    <strong>
                        ${order.first_name}
                        ${order.last_name}
                    </strong>

                </div>


                <div>

                    <span>
                        Email
                    </span>

                    <strong>
                        ${order.email}
                    </strong>

                </div>


                <div>

                    <span>
                        Phone
                    </span>

                    <strong>
                        ${order.phone}
                    </strong>

                </div>

            </div>

        `;


        // =========================
        // Shipping
        // =========================

        shippingDetails.innerHTML = `

            <div class="order-info-grid">

                <div>

                    <span>
                        Address
                    </span>

                    <strong>
                        ${order.address}
                    </strong>

                </div>


                <div>

                    <span>
                        City
                    </span>

                    <strong>
                        ${order.city}
                    </strong>

                </div>


                <div>

                    <span>
                        Postal Code
                    </span>

                    <strong>
                        ${order.postal_code}
                    </strong>

                </div>

            </div>

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
                    document.createElement(
                        "div"
                    );


                itemElement.className =
                    "customer-order-item";


                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                itemElement.innerHTML = `

                    <div class="customer-order-product">

                        <img
                            src="${item.image}"
                            alt="${item.name}">

                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <span>
                                Quantity:
                                ${item.quantity}
                            </span>

                            <span>
                                Unit Price:
                                $${Number(
                                    item.price
                                ).toFixed(2)}
                            </span>

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


        console.log(
            "Customer Order:",
            result
        );


    } catch (error) {

        console.error(
            "Error loading customer order:",
            error
        );


        orderStatus.textContent =
            "Error";


        customerDetails.innerHTML = `

            <p>
                Could not load order.
            </p>

            <p>
                ${error.message}
            </p>

        `;


        shippingDetails.innerHTML =
            "";


        orderItems.innerHTML =
            "";


        orderTotal.textContent =
            "$0.00";

    }

}


// =========================
// Start
// =========================

loadCustomerOrder();