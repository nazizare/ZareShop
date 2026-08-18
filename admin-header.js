// =========================
// Admin Header
// =========================

function createAdminHeader() {

    const header =
        document.querySelector(
            "#adminHeader"
        );


    if (!header) {

        console.error(
            "Admin header container not found."
        );

        return;

    }


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    let pageTitle =
        "Admin Panel";


    if (
        currentPage ===
        "admin.html"
    ) {

        pageTitle =
            "Dashboard";

    }


    else if (
        currentPage ===
        "admin-orders.html"
    ) {

        pageTitle =
            "Orders";

    }


    else if (
        currentPage ===
        "admin-products.html"
    ) {

        pageTitle =
            "Products";

    }


    header.innerHTML = `

        <div class="admin-header">

            <h1>
                ${pageTitle}
            </h1>


            <div class="admin-header-user">

                Administrator

            </div>

        </div>

    `;

}


createAdminHeader();