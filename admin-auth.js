// =========================
// Check Admin Authentication
// =========================

async function checkAdminAuth() {

    try {

        const response =
            await fetch(
                "check_admin.php"
            );


        const result =
            await response.json();


        if (!result.success) {

            window.location.href =
                "admin-login.html";

            return false;

        }


        console.log(
            "Admin authenticated:",
            result.username
        );


        return true;


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        window.location.href =
            "admin-login.html";

        return false;

    }

}