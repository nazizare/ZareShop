checkAdminAuth();

// =========================
// Load Products
// =========================

const productsGrid =
    document.querySelector("#productsGrid");

const addProductButton =
    document.querySelector(
        "#addProductButton"
    );


const addProductForm =
    document.querySelector(
        "#addProductForm"
    );


const cancelAddProduct =
    document.querySelector(
        "#cancelAddProduct"
    );


const editProductForm =
    document.querySelector(
        "#editProductForm"
    );


const cancelEditProduct =
    document.querySelector(
        "#cancelEditProduct"
    );


async function loadProducts() {

    try {

        const response =
            await fetch(
                "get_all_products.php"
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error
            );

        }


        productsTableBody.innerHTML = "";


        if (result.products.length === 0) {

            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No products found.
                    </td>
                </tr>
            `;

            return;
        }


        result.products.forEach(
            (product) => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${product.id}
                    </td>

                    <td>
                        ${product.name}
                    </td>

                    <td>
                        ${product.category}
                    </td>

                    <td>
                        $${Number(
                            product.price
                        ).toFixed(2)}
                    </td>

                    <td>

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            width="80">

                    </td>

                    <td>

                        <button
                            class="edit-product-button"
                            data-id="${product.id}">

                            Edit

                        </button>


                        <button
                            class="delete-product-button"
                            data-id="${product.id}">

                            Delete

                        </button>

                    </td>

                `;


                productsTableBody.appendChild(
                    row
                );

                // =========================
                // Edit Product
                // =========================

                const editButton =
                    row.querySelector(
                        ".edit-product-button"
                    );


                editButton.addEventListener(
                    "click",
                    async () => {

                        try {

                            const response =
                                await fetch(
                                    `get_product_for_admin.php?id=${product.id}`
                                );


                            const result =
                                await response.json();


                            if (!result.success) {

                                throw new Error(
                                    result.error
                                );

                            }


                            const item =
                                result.product;


                            document.querySelector(
                                "#editProductId"
                            ).value =
                                item.id;


                            document.querySelector(
                                "#editProductName"
                            ).value =
                                item.name;


                            document.querySelector(
                                "#editProductCategory"
                            ).value =
                                item.category;


                            document.querySelector(
                                "#editProductPrice"
                            ).value =
                                item.price;


                            document.querySelector(
                                "#editProductImage"
                            ).value =
                                item.image;


                            document.querySelector(
                                "#editProductDescription"
                            ).value =
                                item.description || "";


                            editProductForm.style.display =
                                "block";


                            editProductForm.scrollIntoView({
                                behavior: "smooth"
                            });


                        } catch (error) {

                            console.error(
                                "Edit product error:",
                                error
                            );


                            alert(
                                "Failed to load product."
                            );

                        }

                    }
                );

                // =========================
                // Delete Product
                // =========================

                const deleteButton =
                    row.querySelector(
                        ".delete-product-button"
                    );


                deleteButton.addEventListener(
                    "click",
                    async () => {

                        const confirmed =
                            confirm(
                                `Are you sure you want to delete "${product.name}"?`
                            );


                        if (!confirmed) {

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    "delete_product.php",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body: JSON.stringify({

                                            product_id:
                                                product.id

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
                                "Product deleted successfully!"
                            );


                            loadProducts();


                        } catch (error) {

                            console.error(
                                "Delete product error:",
                                error
                            );


                            alert(
                                error.message
                            );

                        }

                    }
                );                

            }
        );


        console.log(
            "Products from Database:",
            result.products
        );


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        productsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load products.
                </td>
            </tr>
        `;

    }

}

// =========================
// Add Product Form
// =========================

addProductButton.addEventListener(
    "click",
    () => {

        addProductForm.style.display =
            "block";

    }
);


cancelAddProduct.addEventListener(
    "click",
    () => {

        addProductForm.reset();

        addProductForm.style.display =
            "none";

    }
);


// =========================
// Save Product
// =========================

addProductForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const product = {

            name:
                document.querySelector(
                    "#productName"
                ).value.trim(),

            category:
                document.querySelector(
                    "#productCategory"
                ).value.trim(),

            price:
                document.querySelector(
                    "#productPrice"
                ).value,

            image:
                document.querySelector(
                    "#productImage"
                ).value.trim(),

            description:
                document.querySelector(
                    "#productDescription"
                ).value.trim()

        };


        try {

            const response =
                await fetch(
                    "add_product.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                product
                            )

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
                "Product added successfully!"
            );


            addProductForm.reset();


            addProductForm.style.display =
                "none";


            loadProducts();


        } catch (error) {

            console.error(
                "Add product error:",
                error
            );


            alert(
                "Failed to add product."
            );

        }

    }
);

// =========================
// Cancel Edit
// =========================

cancelEditProduct.addEventListener(
    "click",
    () => {

        editProductForm.reset();

        editProductForm.style.display =
            "none";

    }
);

// =========================
// Update Product
// =========================

editProductForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const product = {

            id:
                document.querySelector(
                    "#editProductId"
                ).value,

            name:
                document.querySelector(
                    "#editProductName"
                ).value.trim(),

            category:
                document.querySelector(
                    "#editProductCategory"
                ).value.trim(),

            price:
                document.querySelector(
                    "#editProductPrice"
                ).value,

            image:
                document.querySelector(
                    "#editProductImage"
                ).value.trim(),

            description:
                document.querySelector(
                    "#editProductDescription"
                ).value.trim()

        };


        try {

            const response =
                await fetch(
                    "update_product.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                product
                            )

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
                "Product updated successfully!"
            );


            editProductForm.reset();


            editProductForm.style.display =
                "none";


            loadProducts();


        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


            alert(
                "Failed to update product."
            );

        }

    }
);

loadProducts();