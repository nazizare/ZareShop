// =========================
// Admin Sidebar
// =========================

function createAdminSidebar() {

    const sidebar =
        document.querySelector("#adminSidebar");


    if (!sidebar) {

        console.error(
            "Admin sidebar container not found."
        );

        return;

    }


    sidebar.innerHTML = `

        <div class="admin-logo">
            Nazafarin
        </div>


        <nav class="admin-nav">

            <a
                href="admin.html"
                data-page="admin.html">

                🏠 Dashboard

            </a>


            <a
                href="admin-orders.html"
                data-page="admin-orders.html">

                📦 Orders

            </a>


            <a
                href="admin-products.html"
                data-page="admin-products.html">

                🛍 Products

            </a>


            <a
                href="#"
                data-page="customers">

                👥 Customers

            </a>


            <a
                href="#"
                data-page="settings">

                ⚙️ Settings

            </a>


            <button
                type="button"
                id="adminLogoutButton">

                🚪 Logout

            </button>

        </nav>

    `;


    // =========================
    // Active Page
    // =========================

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const navLinks =
        sidebar.querySelectorAll(
            ".admin-nav a"
        );


    navLinks.forEach(link => {

        const page =
            link.dataset.page;


        if (page === currentPage) {

            link.classList.add("active");

        }

    });


    // =========================
    // Logout
    // =========================

    const logoutButton =
        document.querySelector(
            "#adminLogoutButton"
        );


    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        "logout.php"
                    );


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        "Logout failed."
                    );

                }


                window.location.href =
                    "admin-login.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


createAdminSidebar();