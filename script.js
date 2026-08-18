console.log("DATABASE SCRIPT IS RUNNING");

// =========================
// Products
// =========================

const products = [
    {
        id: 1,
        name: "Classic Cotton T-Shirt",
        price: 29.99,
        category: "Fashion"
    },
    {
        id: 2,
        name: "Everyday Sneakers",
        price: 59.99,
        category: "Shoes"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 89.99,
        category: "Electronics"
    },
    {
        id: 4,
        name: "Minimal Leather Bag",
        price: 74.99,
        category: "Accessories",
    }
];


// =========================
// Cart
// =========================

let cart = JSON.parse(localStorage.getItem("nazafarinCart")) || [];


// =========================
// Elements
// =========================

const addToCartButtons = document.querySelectorAll(".add-to-cart");

const searchInput = document.querySelector("#searchInput");

const searchButton = document.querySelector("#searchButton");

const cartCount = document.querySelector(".cart-count");

// =========================
// Cart Elements
// =========================

const cartModal = document.querySelector("#cartModal");

const cartItems = document.querySelector("#cartItems");

const cartTotal = document.querySelector("#cartTotal");

const cartButton = document.querySelector(".cart");

const cartClose = document.querySelector(".cart-close");

const cartOverlay = document.querySelector(".cart-overlay");

const clearCartButton = document.querySelector(".clear-cart-button");

const checkoutButton = document.querySelector(".checkout-button");

console.log("Cart:", cartButton);
console.log("Cart Modal:", cartModal);
console.log("Cart Close:", cartClose);
console.log("Cart Overlay:", cartOverlay);
console.log("Clear Cart:", clearCartButton);
console.log("Checkout:", checkoutButton);


// =========================
// Open Cart
// =========================

cartButton.addEventListener("click", async (event) => {

    event.preventDefault();


    await refreshCartPrices();


    renderCart();


    cartModal.classList.add("active");

});


// =========================
// Close Cart
// =========================

cartClose.addEventListener("click", () => {

    cartModal.classList.remove("active");

});


cartOverlay.addEventListener("click", () => {

    cartModal.classList.remove("active");

});

// =========================
// Clear Cart
// =========================

clearCartButton.addEventListener("click", () => {

    cart = [];

    localStorage.removeItem("nazafarinCart");

    updateCartCount();

    renderCart();

});

// =========================
// Checkout
// =========================

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    window.location.href = "checkout.html";

});

// =========================
// Refresh Cart Prices
// =========================

async function refreshCartPrices() {

    if (cart.length === 0) {
        return;
    }

    try {

        const response =
            await fetch("get_all_products.php");

        const result =
            await response.json();

        if (!result.success) {
            throw new Error(result.error);
        }


        const products =
            result.products;


        cart.forEach((cartItem) => {

            const currentProduct =
                products.find(
                    (product) =>
                        Number(product.id) === Number(cartItem.id)
                );


            if (currentProduct) {

                cartItem.name =
                    currentProduct.name;

                cartItem.price =
                    Number(currentProduct.price);

                cartItem.image =
                    currentProduct.image;

                cartItem.category =
                    currentProduct.category;

            }

        });


        // Save updated prices
        localStorage.setItem(
            "nazafarinCart",
            JSON.stringify(cart)
        );


        console.log(
            "Cart prices refreshed:",
            cart
        );


    } catch (error) {

        console.error(
            "Error refreshing cart prices:",
            error
        );

    }

}

// =========================
// Render Cart
// =========================

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                Your cart is empty.
            </div>
        `;

        cartTotal.textContent = "$0.00";

        return;
    }


    cart.forEach((item) => {

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `

            <div>

                <div class="cart-item-name">
                    ${item.name}
                </div>

                <div class="cart-item-price">
                    $${item.price.toFixed(2)}
                </div>

            </div>


            <div class="cart-item-quantity">

                <button
                    class="quantity-button decrease"
                    data-id="${item.id}">
                    −
                </button>

                <span class="quantity-number">
                    ${item.quantity}
                </span>

                <button
                    class="quantity-button increase"
                    data-id="${item.id}">
                    +
                </button>

            </div>

            <button
                class="remove-cart-item"
                data-id="${item.id}"
                type="button">

                Remove

            </button>

        `;

        cartItems.appendChild(cartItem);

    });


    updateCartTotal();

}

// =========================
// Cart Total
// =========================

function updateCartTotal() {

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = `$${total.toFixed(2)}`;

}

// =========================
// Update Cart Count
// =========================

function updateCartCount() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}
updateCartCount();

// =========================
// Add To Cart - Dynamic Products
// =========================

document.addEventListener("click", (event) => {

    const button = event.target.closest(".add-to-cart");

    if (!button) {
        return;
    }

    event.preventDefault();

    const productId = Number(button.dataset.id);

    const product = products.find(
        (item) => Number(item.id) === productId
    );

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    const existingProduct = cart.find(
        (item) => Number(item.id) === productId
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    localStorage.setItem(
        "nazafarinCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    console.log("Cart:", cart);

});

// =========================
// Cart Item Actions
// =========================

cartItems.addEventListener("click", (event) => {

    // Remove Product
    const removeButton =
        event.target.closest(".remove-cart-item");

    if (removeButton) {

        const productId =
            Number(removeButton.dataset.id);

        cart = cart.filter(
            (item) => item.id !== productId
        );

        localStorage.setItem(
            "nazafarinCart",
            JSON.stringify(cart)
        );

        updateCartCount();

        renderCart();

        return;
    }


    // Quantity Buttons
    const button =
        event.target.closest(".quantity-button");

    if (!button) {
        return;
    }

    const productId =
        Number(button.dataset.id);

    const product =
        cart.find(
            (item) => item.id === productId
        );

    if (!product) {
        return;
    }


    // Increase
    if (button.classList.contains("increase")) {

        product.quantity += 1;

    }


    // Decrease
    if (button.classList.contains("decrease")) {

        product.quantity -= 1;

        if (product.quantity <= 0) {

            cart = cart.filter(
                (item) => item.id !== productId
            );

        }

    }


    localStorage.setItem(
        "nazafarinCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();

});

// =========================
// Search Products
// =========================

const productCards =
    document.querySelectorAll(".product-card");

function searchProducts() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    productCards.forEach((card) => {

        const productName =
            card.querySelector("h3").textContent.toLowerCase();

        const productCategory =
            card.querySelector(".product-category").textContent.toLowerCase();

        if (
            productName.includes(searchText) ||
            productCategory.includes(searchText)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


// Search while typing
searchInput.addEventListener(
    "input",
    searchProducts
);


// Search button
searchButton.addEventListener(
    "click",
    searchProducts
);

// =========================
// Category Filter
// =========================

const categoryCards =
    document.querySelectorAll(".category-card");


categoryCards.forEach((categoryCard) => {

    categoryCard.addEventListener("click", (event) => {

        event.preventDefault();


        const selectedCategory =
            categoryCard.dataset.category
                .toLowerCase()
                .trim();


        // Get current product cards
        // after products have been loaded from database

        const productCards =
            document.querySelectorAll(".product-card");


        productCards.forEach((card) => {

            const categoryElement =
                card.querySelector(".product-category");


            if (!categoryElement) {

                return;

            }


            const productCategory =
                categoryElement.textContent
                    .toLowerCase()
                    .trim();


            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });


        // Clear search

        if (searchInput) {

            searchInput.value = "";

        }

    });

});

// =========================
// Wishlist
// =========================

let wishlist =
    JSON.parse(localStorage.getItem("nazafarinWishlist")) || [];

// =========================
// Wishlist - Dynamic Products
// =========================

document.addEventListener("click", (event) => {

    const button =
        event.target.closest(".wishlist-button");

    if (!button) {
        return;
    }

    const productId =
        Number(button.dataset.id);

    if (wishlist.includes(productId)) {

        // Remove from wishlist

        wishlist =
            wishlist.filter(
                (id) => id !== productId
            );

        button.textContent = "♡";

    } else {

        // Add to wishlist

        wishlist.push(productId);

        button.textContent = "♥";

    }

    localStorage.setItem(
        "nazafarinWishlist",
        JSON.stringify(wishlist)
    );

    updateWishlistCount();

});

// =========================
// Wishlist Count
// =========================

const wishlistCount =
    document.querySelector(".wishlist-count");


function updateWishlistCount() {

    const wishlist =
        JSON.parse(
            localStorage.getItem(
                "nazafarinWishlist"
            )
        ) || [];

    wishlistCount.textContent =
        wishlist.length;
}


updateWishlistCount();

// =========================
// Mobile Menu
// =========================

const menuToggle =
    document.querySelector("#menuToggle");

const nav =
    document.querySelector("nav");


if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

        nav.classList.toggle("active");

    });

}

// =========================
// Shop Sale Filter
// =========================

const shopSaleButton =
    document.querySelector("#shopSaleButton");

const allProductCards =
    document.querySelectorAll(".product-card");

if (shopSaleButton) {

    shopSaleButton.addEventListener("click", (event) => {

        event.preventDefault();

        allProductCards.forEach((card) => {

            if (card.classList.contains("sale-product")) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

        document.querySelector("#products")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

}

// =========================
// Load Products From Database
// =========================

const productsGrid =
    document.querySelector("#productsGrid");


async function loadProductsFromDatabase() {

    try {

        const response =
            await fetch("get_all_products.php");


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error
            );

        }


        productsGrid.innerHTML = "";


        result.products.forEach((product) => {

            const productCard =
                document.createElement("article");


            productCard.className =
                "product-card";


            productCard.innerHTML = `

                <a
                    href="product.html?id=${product.id}"
                    class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="product-card-image">

                </a>


                <button
                    type="button"
                    class="wishlist-button"
                    data-id="${product.id}"
                    aria-label="Add to wishlist">

                    ♡

                </button>


                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>


                    <h3>

                        <a
                            href="product.html?id=${product.id}">

                            ${product.name}

                        </a>

                    </h3>


                    <div class="product-bottom">

                        <span class="product-price">

                            $${Number(
                                product.price
                            ).toFixed(2)}

                        </span>


                        <a
                            href="#"
                            class="add-to-cart"
                            data-id="${product.id}">

                            Add to Cart

                        </a>

                    </div>

                </div>

            `;


            productsGrid.appendChild(
                productCard
            );

        });


        console.log(
            "Products loaded from MySQL:",
            result.products
        );


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}

loadProductsFromDatabase();

// =========================
// Customer Account
// =========================

const accountButton =
    document.querySelector("#accountButton");

const accountMenu =
    document.querySelector("#accountMenu");

const loggedOutMenu =
    document.querySelector("#loggedOutMenu");

const loggedInMenu =
    document.querySelector("#loggedInMenu");

const accountWelcome =
    document.querySelector("#accountWelcome");

const logoutCustomerButton =
    document.querySelector("#logoutCustomerButton");


// =========================
// Load Customer Account
// =========================

function loadCustomerAccount() {

    const savedCustomer =
        localStorage.getItem(
            "nazafarinCustomer"
        );


    if (!savedCustomer) {

        loggedOutMenu.style.display =
            "block";

        loggedInMenu.style.display =
            "none";

        return;

    }


    try {

        const customer =
            JSON.parse(savedCustomer);


        loggedOutMenu.style.display =
            "none";

        loggedInMenu.style.display =
            "block";


        accountWelcome.textContent =
            `Hello, ${customer.first_name}!`;


    } catch (error) {

        console.error(
            "Customer data error:",
            error
        );


        localStorage.removeItem(
            "nazafarinCustomer"
        );

    }

}


// =========================
// Open / Close Account Menu
// =========================

if (accountButton && accountMenu) {

    accountButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            accountMenu.classList.toggle(
                "active"
            );

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                !accountMenu.contains(event.target) &&
                !accountButton.contains(event.target)
            ) {

                accountMenu.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =========================
// Customer Logout
// =========================

if (logoutCustomerButton) {

    logoutCustomerButton.addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        "customer_logout.php"
                    );


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.error ||
                        "Logout failed."
                    );

                }


                localStorage.removeItem(
                    "nazafarinCustomer"
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "Customer logout error:",
                    error
                );

                alert(
                    "Could not logout."
                );

            }

        }
    );

}


// =========================
// Start Account
// =========================

loadCustomerAccount();