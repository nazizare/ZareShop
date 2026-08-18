// =========================
// Elements
// =========================

const ordersContainer =
    document.querySelector(
        "#ordersContainer"
    );


// =========================
// Load Customer Orders
// =========================

async function loadCustomerOrders() {

    try {

        const response =
            await fetch(
                "get_customer_orders.php",
                {
                    credentials: "include"
                }
            );


        const result =
            await response.json();


        console.log(
            "Customer Orders:",
            result
        );


        // =========================
        // Check Login
        // =========================

        if (
            !result.success &&
            result.error === "Please login first."
        ) {

            localStorage.removeItem(
                "nazafarinCustomer"
            );

            window.location.href =
                "login.html";

            return;

        }


        if (!result.success) {

            throw new Error(
                result.error ||
                "Could not load orders."
            );

        }


        const orders =
            result.orders || [];


        // =========================
        // No Orders
        // =========================

        if (orders.length === 0) {

            ordersContainer.innerHTML = `

                <div class="empty-orders">

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a
                        href="index.html"
                        class="view-order-button">

                        Start Shopping →

                    </a>

                </div>

            `;

            return;

        }


        // =========================
        // Render Orders
        // =========================

        ordersContainer.innerHTML = "";


        orders.forEach((order) => {

            const orderCard =
                document.createElement(
                    "div"
                );


            orderCard.classList.add(
                "customer-order-card"
            );


            // =========================
            // Date
            // =========================

            const orderDate =
                new Date(
                    order.created_at
                ).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );


            // =========================
            // Status
            // =========================

            const status =
                order.status ||
                "Pending";


            const statusClass =
                status
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "-"
                    );


            // =========================
            // Card
            // =========================

            orderCard.innerHTML = `

                <div class="customer-order-header">

                    <div>

                        <span class="order-label">
                            Order
                        </span>

                        <h2>
                            #${order.id}
                        </h2>

                    </div>


                    <span
                        class="order-status ${statusClass}">

                        ${status}

                    </span>

                </div>


                <div class="customer-order-details">

                    <div>

                        <span>
                            Date
                        </span>

                        <strong>
                            ${orderDate}
                        </strong>

                    </div>


                    <div>

                        <span>
                            City
                        </span>

                        <strong>
                            ${order.city || "-"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Total
                        </span>

                        <strong>
                            $${Number(
                                order.total
                            ).toFixed(2)}
                        </strong>

                    </div>

                </div>


                <div class="customer-order-footer">

                    <span>
                        ${order.address || "-"}
                    </span>


                    <a
                        href="my-order-details.html?id=${order.id}"
                        class="view-order-button">

                        View Details →

                    </a>

                </div>

            `;


            ordersContainer.appendChild(
                orderCard
            );

        });

    } catch (error) {

        console.error(
            "Error loading customer orders:",
            error
        );


        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


// =========================
// Start
// =========================

loadCustomerOrders();