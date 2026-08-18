// =========================
// Load Admin Dashboard
// =========================

async function loadAdminDashboard() {

    try {

        const response =
            await fetch(
                "get_admin_stats.php"
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error
            );

        }


        // =========================
        // Statistics
        // =========================

        const stats =
            result.stats;


        document.querySelector(
            "#totalOrders"
        ).textContent =
            stats.total_orders;


        document.querySelector(
            "#totalProducts"
        ).textContent =
            stats.total_products;


        document.querySelector(
            "#pendingOrders"
        ).textContent =
            stats.pending_orders;


        document.querySelector(
            "#totalSales"
        ).textContent =
            `$${Number(
                stats.total_sales
            ).toFixed(2)}`;


        // =========================
        // Recent Orders
        // =========================

        const recentOrdersBody =
            document.querySelector(
                "#recentOrdersBody"
            );


        if (!recentOrdersBody) {

            console.error(
                "Recent orders table not found."
            );

            return;

        }


        recentOrdersBody.innerHTML = "";


        if (
            !result.recent_orders ||
            result.recent_orders.length === 0
        ) {

            recentOrdersBody.innerHTML = `

                <tr>

                    <td colspan="6">
                        No orders found.
                    </td>

                </tr>

            `;

            return;

        }


        result.recent_orders.forEach(
            (order) => {

                const row =
                    document.createElement(
                        "tr"
                    );


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
                        $${Number(
                            order.total
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${order.status}
                    </td>

                    <td>
                        ${new Date(
                            order.created_at
                        ).toLocaleDateString()}
                    </td>

                `;


                recentOrdersBody.appendChild(
                    row
                );

            }
        );


        console.log(
            "Admin Dashboard:",
            result
        );


    } catch (error) {

        console.error(
            "Error loading admin dashboard:",
            error
        );

    }

}


loadAdminDashboard();