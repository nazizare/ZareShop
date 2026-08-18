// =========================
// Wishlist
// =========================

let wishlist =
    JSON.parse(
        localStorage.getItem("nazafarinWishlist")
    ) || [];


// =========================
// Elements
// =========================

const wishlistItems =
    document.querySelector("#wishlistItems");

const wishlistCount =
    document.querySelector(".wishlist-count");


// =========================
// Update Wishlist Count
// =========================

function updateWishlistCount() {

    if (!wishlistCount) {
        return;
    }

    wishlistCount.textContent =
        wishlist.length;

}


// =========================
// Load Products From Database
// =========================

async function loadProductsFromDatabase() {

    try {

        const response =
            await fetch(
                "get_all_products.php"
            );


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error ||
                "Could not load products."
            );

        }


        return result.products;


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        throw error;

    }

}


// =========================
// Render Wishlist
// =========================

async function renderWishlist() {

    wishlistItems.innerHTML = "";


    // Update count

    updateWishlistCount();


    // =========================
    // Empty Wishlist
    // =========================

    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `

            <div class="empty-wishlist">

                <h2>
                    Your wishlist is empty ❤️
                </h2>

                <p>
                    Add products you love to your wishlist.
                </p>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>

        `;

        return;

    }


    try {

        // =========================
        // Get Latest Products
        // =========================

        const products =
            await loadProductsFromDatabase();


        // =========================
        // Find Wishlist Products
        // =========================

        const wishlistProducts =
            products.filter(
                (product) =>
                    wishlist.includes(
                        Number(product.id)
                    )
            );


        // =========================
        // Check Missing Products
        // =========================

        if (
            wishlistProducts.length === 0
        ) {

            wishlistItems.innerHTML = `

                <div class="empty-wishlist">

                    <h2>
                        Your wishlist is empty ❤️
                    </h2>

                    <p>
                        Add products you love to your wishlist.
                    </p>

                    <a href="index.html">
                        Continue Shopping
                    </a>

                </div>

            `;

            return;

        }


        // =========================
        // Render Products
        // =========================

        wishlistProducts.forEach(
            (product) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.classList.add(
                    "wishlist-card"
                );


                card.innerHTML = `

                    <div class="wishlist-image">

                        <a
                            href="product.html?id=${product.id}">

                            <img
                                src="${product.image}"
                                alt="${product.name}">

                        </a>

                    </div>


                    <div class="wishlist-info">

                        <span class="product-category">

                            ${product.category}

                        </span>


                        <h3>

                            <a
                                href="product.html?id=${product.id}">

                                ${product.name}

                            </a>

                        </h3>


                        <p class="product-price">

                            $${Number(
                                product.price
                            ).toFixed(2)}

                        </p>


                        <div class="wishlist-actions">

                            <button
                                type="button"
                                class="wishlist-add-cart"
                                data-id="${product.id}">

                                Add to Cart

                            </button>


                            <button
                                type="button"
                                class="wishlist-remove"
                                data-id="${product.id}">

                                Remove ❤️

                            </button>

                        </div>

                    </div>

                `;


                wishlistItems.appendChild(
                    card
                );

            }
        );


        // =========================
        // Add Events
        // =========================

        addWishlistEvents();


    } catch (error) {

        console.error(
            "Wishlist error:",
            error
        );


        wishlistItems.innerHTML = `

            <div class="empty-wishlist">

                <h2>
                    Could not load wishlist
                </h2>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


// =========================
// Wishlist Events
// =========================

function addWishlistEvents() {


    // =========================
    // Remove Buttons
    // =========================

    const removeButtons =
        document.querySelectorAll(
            ".wishlist-remove"
        );


    removeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    // Remove from Wishlist

                    wishlist =
                        wishlist.filter(
                            (item) =>
                                Number(item) !==
                                id
                        );


                    // Save

                    localStorage.setItem(
                        "nazafarinWishlist",
                        JSON.stringify(wishlist)
                    );


                    // Update count

                    updateWishlistCount();


                    // Re-render

                    renderWishlist();

                }
            );

        }
    );


    // =========================
    // Add To Cart Buttons
    // =========================

    const addCartButtons =
        document.querySelectorAll(
            ".wishlist-add-cart"
        );


    addCartButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                async () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    try {

                        // Get latest product data

                        const products =
                            await loadProductsFromDatabase();


                        const product =
                            products.find(
                                (item) =>
                                    Number(item.id) ===
                                    id
                            );


                        if (!product) {

                            throw new Error(
                                "Product not found."
                            );

                        }


                        // =========================
                        // Load Cart
                        // =========================

                        let cart =
                            JSON.parse(
                                localStorage.getItem(
                                    "nazafarinCart"
                                )
                            ) || [];


                        // =========================
                        // Check Existing Product
                        // =========================

                        const existingProduct =
                            cart.find(
                                (item) =>
                                    Number(item.id) ===
                                    id
                            );


                        if (existingProduct) {

                            existingProduct.quantity += 1;


                            // Update latest information

                            existingProduct.name =
                                product.name;

                            existingProduct.price =
                                Number(
                                    product.price
                                );

                            existingProduct.category =
                                product.category;

                            existingProduct.image =
                                product.image;

                        } else {

                            cart.push({

                                id:
                                    Number(
                                        product.id
                                    ),

                                name:
                                    product.name,

                                price:
                                    Number(
                                        product.price
                                    ),

                                category:
                                    product.category,

                                image:
                                    product.image,

                                quantity: 1

                            });

                        }


                        // =========================
                        // Save Cart
                        // =========================

                        localStorage.setItem(
                            "nazafarinCart",
                            JSON.stringify(cart)
                        );


                        // =========================
                        // Button Feedback
                        // =========================

                        button.textContent =
                            "Added ✓";


                        setTimeout(
                            () => {

                                button.textContent =
                                    "Add to Cart";

                            },
                            1500
                        );


                        console.log(
                            "Cart updated:",
                            cart
                        );


                    } catch (error) {

                        console.error(
                            "Add to cart error:",
                            error
                        );


                        alert(
                            "Could not add product to cart."
                        );

                    }

                }
            );

        }
    );

}


// =========================
// Start
// =========================

updateWishlistCount();

renderWishlist();


// =========================
// Mobile Menu
// =========================

const menuToggle =
    document.querySelector(
        "#menuToggle"
    );


const navigation =
    document.querySelector(
        ".navigation"
    );


if (
    menuToggle &&
    navigation
) {

    menuToggle.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "mobile-open"
            );

        }
    );

}