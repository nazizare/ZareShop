// =========================
// Products
// =========================



// =========================
// Get Product ID
// =========================

const params =
    new URLSearchParams(window.location.search);

const productId =
    Number(params.get("id"));

let product = null;


// =========================
// Elements
// =========================

const productName =
    document.querySelector("#productName");

const productPrice =
    document.querySelector("#productPrice");

const productCategory =
    document.querySelector("#productCategory");

const productDescription =
    document.querySelector("#productDescription");

const productQuantity =
    document.querySelector("#productQuantity");

const increaseQuantity =
    document.querySelector("#increaseQuantity");

const decreaseQuantity =
    document.querySelector("#decreaseQuantity");

const addProductToCart =
    document.querySelector("#addProductToCart");


// =========================
// Load Product From Database
// =========================

async function loadProduct() {

    try {

        const response =
            await fetch(
                `get_product.php?id=${productId}`
            );

        if (!response.ok) {

            throw new Error(
                "Product not found."
            );

        }

        product =
            await response.json();


        // Display Product

        productName.textContent =
            product.name;

        productPrice.textContent =
            `$${Number(product.price).toFixed(2)}`;

        productCategory.textContent =
            product.category;

        productDescription.textContent =
            product.description;


        const productImage =
            document.querySelector("#productImage");

        productImage.src =
            product.image;

        productImage.alt =
            product.name;


        console.log(
            "Product loaded from Database:",
            product
        );

    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );

    }

}

loadProduct();


// =========================
// Quantity
// =========================

let quantity = 1;


increaseQuantity.addEventListener("click", () => {

    quantity += 1;

    productQuantity.textContent =
        quantity;

});


decreaseQuantity.addEventListener("click", () => {

    if (quantity > 1) {

        quantity -= 1;

        productQuantity.textContent =
            quantity;

    }

});


// =========================
// Add To Cart
// =========================

addProductToCart.addEventListener("click", () => {

    let cart =
        JSON.parse(
            localStorage.getItem("nazafarinCart")
        ) || [];


    const existingProduct =
        cart.find(
            (item) => item.id === product.id
        );


    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        cart.push({

            ...product,

            quantity: quantity

        });

    }


    localStorage.setItem(
        "nazafarinCart",
        JSON.stringify(cart)
    );


    alert(
        `${product.name} added to cart!`
    );

});

// =========================
// Mobile Menu
// =========================

const menuToggle =
    document.querySelector("#menuToggle");

const navigation =
    document.querySelector(".navigation");

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {

        navigation.classList.toggle("mobile-open");

    });

}