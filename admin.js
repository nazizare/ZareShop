checkAdminAuth();

// =========================
// Load Orders
// =========================

const ordersTableBody =
    document.querySelector("#ordersTableBody");


async function loadOrders() {

    try {

        const response =
            await fetch("get_orders.php");


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error
            );

        }


        ordersTableBody.innerHTML = "";


        if (result.orders.length === 0) {

            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No orders found.
                    </td>
                </tr>
            `;

            return;
        }


        result.orders.forEach((order) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    #${order.id}
                </td>

                <td>
                    ${order.first_name}
                    ${order.last_name}
                </td>

                <td>
                    ${order.city}
                </td>

                <td>
                    $${Number(order.total).toFixed(2)}
                </td>

                <td>
                    ${new Date(
                        order.created_at
                    ).toLocaleDateString()}
                </td>

                <td>

                    <button
                        class="view-order-button"
                        data-id="${order.id}">

                        View

                    </button>

                    <button
                        class="delete-order-button"
                        data-id="${order.id}">

                        Delete

                    </button>

                </td>

            `;

            ordersTableBody.appendChild(row);

            const viewButton =
                row.querySelector(
                    ".view-order-button"
                );


            viewButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `order-details.html?id=${order.id}`;

                }
            );

            // =========================
            // Delete Order
            // =========================

            const deleteButton =
                row.querySelector(
                    ".delete-order-button"
                );


            deleteButton.addEventListener(
                "click",
                async () => {

                    const confirmed =
                        confirm(
                            `Are you sure you want to delete Order #${order.id}?`
                        );


                    if (!confirmed) {

                        return;

                    }


                    try {

                        const response =
                            await fetch(
                                "delete_order.php",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({

                                        order_id:
                                            order.id

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
                            "Order deleted successfully."
                        );


                        loadOrders();


                    } catch (error) {

                        console.error(
                            "Delete order error:",
                            error
                        );


                        alert(
                            "Failed to delete order."
                        );

                    }

                }
            );

        });


        console.log(
            "Orders from Database:",
            result.orders
        );


    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load orders.
                </td>
            </tr>
        `;

    }

}


loadOrders();