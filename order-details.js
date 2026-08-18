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

const orderStatus =
    document.querySelector(
        "#orderStatus"
    );

const saveStatusButton =
    document.querySelector(
        "#saveStatusButton"
    );


// =========================
// Load Order
// =========================

async function loadOrder() {

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

        if (orderStatus) {

            orderStatus.value =
                order.status || "Pending";

        }


        const items =
            result.items;


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
        // Items
        // =========================

        orderItems.innerHTML = "";


        items.forEach((item) => {

            const itemElement =
                document.createElement(
                    "div"
                );


            itemElement.className =
                "admin-order-item";


            itemElement.innerHTML = `

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        Quantity:
                        ${item.quantity}
                    </p>

                </div>

                <strong>
                    $${(
                        Number(item.price) *
                        Number(item.quantity)
                    ).toFixed(2)}
                </strong>

            `;


            orderItems.appendChild(
                itemElement
            );

        });


        // =========================
        // Total
        // =========================

        orderTotal.textContent =
            `$${Number(
                order.total
            ).toFixed(2)}`;


        console.log(
            "Order details:",
            result
        );


    } catch (error) {

        console.error(
            "Error loading order:",
            error
        );


        customerDetails.innerHTML =
            "Failed to load order.";

        shippingDetails.innerHTML =
            "";

        orderItems.innerHTML =
            "";

    }

}

// =========================
// Update Order Status
// =========================

if (saveStatusButton) {

    saveStatusButton.addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        "update_order_status.php",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                order_id:
                                    orderId,

                                status:
                                    orderStatus.value

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


                alert(
                    "Order status updated successfully."
                );


            } catch (error) {

                console.error(
                    "Status update error:",
                    error
                );


                alert(
                    "Failed to update order status."
                );

            }

        }
    );

}