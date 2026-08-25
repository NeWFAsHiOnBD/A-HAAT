/* ============================================================
   MyShop Marketplace
   app.js — PART 1A
   Core Application State + Utilities
   ============================================================ */

"use strict";


/* ============================================================
   GLOBAL APPLICATION STATE
   ============================================================ */

const MyShop = {

    /* --------------------------------------------------------
       Shopping Cart
       -------------------------------------------------------- */

    cart: [],


    /* --------------------------------------------------------
       Wishlist
       -------------------------------------------------------- */

    wishlist: [],


    /* --------------------------------------------------------
       Recently Viewed
       -------------------------------------------------------- */

    recentlyViewed: [],


    /* --------------------------------------------------------
       Notifications
       -------------------------------------------------------- */

    notifications: [],


    /* --------------------------------------------------------
       Current User
       -------------------------------------------------------- */

    user: null,


    /* --------------------------------------------------------
       Product State
       -------------------------------------------------------- */

    products: [],

    filteredProducts: [],


    /* --------------------------------------------------------
       UI State
       -------------------------------------------------------- */

    currentPage: 1,

    productsPerPage: 12,

    currentCategory: "all",

    currentSearch: "",

    currentSort: "default",


    /* --------------------------------------------------------
       Recommendation State
       -------------------------------------------------------- */

    recommendationFilter: "all",


    /* --------------------------------------------------------
       Best Selling State
       -------------------------------------------------------- */

    bestSellingCategory: "all",


    /* --------------------------------------------------------
       New Arrivals State
       -------------------------------------------------------- */

    newArrivalsCategory: "all",


    /* --------------------------------------------------------
       Flash Sale
       -------------------------------------------------------- */

    flashSaleSeconds: 5 * 60 * 60,


    /* --------------------------------------------------------
       Modal State
       -------------------------------------------------------- */

    activeModal: null,


    /* --------------------------------------------------------
       Application Initialization
       -------------------------------------------------------- */

    initialized: false

};


/* ============================================================
   STORAGE KEYS
   ============================================================ */

const STORAGE_KEYS = {

    cart: "myshop_cart",

    wishlist: "myshop_wishlist",

    recentlyViewed: "myshop_recently_viewed",

    notifications: "myshop_notifications",

    user: "myshop_user",

    flashSaleEnd: "myshop_flash_sale_end"

};


/* ============================================================
   SAFE LOCAL STORAGE HELPERS
   ============================================================ */

function readStorage(key, fallback = null) {

    try {

        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            `MyShop storage read failed for "${key}".`,
            error
        );

        return fallback;
    }

}


function writeStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.warn(
            `MyShop storage write failed for "${key}".`,
            error
        );

        return false;
    }

}


function removeStorage(key) {

    try {

        localStorage.removeItem(key);

    } catch (error) {

        console.warn(
            `MyShop storage remove failed for "${key}".`,
            error
        );

    }

}


/* ============================================================
   DOM HELPERS
   ============================================================ */

function $(selector, parent = document) {

    return parent.querySelector(selector);

}


function $$(selector, parent = document) {

    return Array.from(
        parent.querySelectorAll(selector)
    );

}


function getElement(id) {

    return document.getElementById(id);

}


/* ============================================================
   GENERAL UTILITIES
   ============================================================ */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function formatPrice(amount) {

    const number = Number(amount) || 0;

    return `৳${number.toLocaleString("en-BD")}`;

}


function generateId(prefix = "id") {

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;

}


function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


/* ============================================================
   SCROLL HELPER
   ============================================================ */

function scrollToElement(target) {

    if (!target) {
        return;
    }

    let element = null;

    if (typeof target === "string") {

        element =
            document.getElementById(target) ||
            document.querySelector(target);

    } else {

        element = target;

    }

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ============================================================
   TOAST SYSTEM
   ============================================================ */

function showToast(message, type = "success") {

    let container =
        getElement("toastContainer");

    if (!container) {

        container = document.createElement("div");

        container.id = "toastContainer";

        container.className =
            "toast-container";

        container.setAttribute(
            "aria-live",
            "polite"
        );

        document.body.appendChild(container);

    }


    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.setAttribute(
        "role",
        "status"
    );


    const iconMap = {

        success: "✓",

        error: "⚠",

        warning: "!",

        info: "i"

    };


    toast.innerHTML = `

        <span class="toast-icon">
            ${iconMap[type] || "i"}
        </span>

        <span class="toast-message">
            ${escapeHTML(message)}
        </span>

        <button
            type="button"
            class="toast-close"
            aria-label="Close notification"
        >
            ×
        </button>

    `;


    container.appendChild(toast);


    requestAnimationFrame(() => {

        toast.classList.add(
            "toast-visible"
        );

    });


    const closeButton =
        $(".toast-close", toast);


    const removeToast = () => {

        toast.classList.remove(
            "toast-visible"
        );

        setTimeout(() => {

            toast.remove();

        }, 250);

    };


    closeButton.addEventListener(
        "click",
        removeToast
    );


    setTimeout(
        removeToast,
        3500
    );

}


/* ============================================================
   SAVE APPLICATION STATE
   ============================================================ */

function saveCart() {

    writeStorage(
        STORAGE_KEYS.cart,
        MyShop.cart
    );

}


function saveWishlist() {

    writeStorage(
        STORAGE_KEYS.wishlist,
        MyShop.wishlist
    );

}


function saveRecentlyViewed() {

    writeStorage(
        STORAGE_KEYS.recentlyViewed,
        MyShop.recentlyViewed
    );

}


function saveNotifications() {

    writeStorage(
        STORAGE_KEYS.notifications,
        MyShop.notifications
    );

}


function saveUser() {

    writeStorage(
        STORAGE_KEYS.user,
        MyShop.user
    );

}


/* ============================================================
   LOAD APPLICATION STATE
   ============================================================ */

function loadApplicationState() {

    MyShop.cart =
        readStorage(
            STORAGE_KEYS.cart,
            []
        );


    MyShop.wishlist =
        readStorage(
            STORAGE_KEYS.wishlist,
            []
        );


    MyShop.recentlyViewed =
        readStorage(
            STORAGE_KEYS.recentlyViewed,
            []
        );


    MyShop.notifications =
        readStorage(
            STORAGE_KEYS.notifications,
            []
        );


    MyShop.user =
        readStorage(
            STORAGE_KEYS.user,
            null
        );


    if (!Array.isArray(MyShop.cart)) {
        MyShop.cart = [];
    }


    if (!Array.isArray(MyShop.wishlist)) {
        MyShop.wishlist = [];
    }


    if (!Array.isArray(MyShop.recentlyViewed)) {
        MyShop.recentlyViewed = [];
    }


    if (!Array.isArray(MyShop.notifications)) {
        MyShop.notifications = [];
    }

}


/* ============================================================
   GLOBAL CLICK DELEGATION
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const scrollTarget =
            event.target.closest(
                "[data-scroll-target]"
            );


        if (scrollTarget) {

            const target =
                scrollTarget.dataset.scrollTarget;

            if (target) {

                event.preventDefault();

                scrollToElement(target);

            }

        }

    }
);


/* ============================================================
   INITIAL BOOTSTRAP
   ============================================================ */

function initializeMyShopCore() {

    if (MyShop.initialized) {
        return;
    }

    loadApplicationState();

    MyShop.initialized = true;

}


/* ============================================================
   START CORE
   ============================================================ */

initializeMyShopCore();

/* ============================================================
   MyShop Marketplace
   app.js — PART 1B
   Product Catalogue + Product Data Layer
   ============================================================ */


/* ============================================================
   PRODUCT CATALOGUE
   ============================================================ */

const PRODUCT_CATALOGUE = [

    {
        id: "smartphone-pro",
        name: "Smartphone Pro",
        category: "Electronics",
        price: 18999,
        oldPrice: 22000,
        rating: 5,
        reviews: 124,
        emoji: "📱",
        badge: "Flash Sale",
        stock: 25,
        seller: "Tech World",
        tags: [
            "smartphone",
            "mobile",
            "phone",
            "electronics"
        ],
        isFlashSale: true,
        isBestSelling: true,
        isNewArrival: false
    },


    {
        id: "wireless-headphone",
        name: "Wireless Headphone",
        category: "Electronics",
        price: 1499,
        oldPrice: 2000,
        rating: 4,
        reviews: 89,
        emoji: "🎧",
        badge: "Hot Deal",
        stock: 42,
        seller: "Tech World",
        tags: [
            "headphone",
            "wireless",
            "audio",
            "electronics"
        ],
        isFlashSale: true,
        isBestSelling: true,
        isNewArrival: true
    },


    {
        id: "smart-watch",
        name: "Smart Watch",
        category: "Electronics",
        price: 2499,
        oldPrice: 3500,
        rating: 5,
        reviews: 176,
        emoji: "⌚",
        badge: "Popular",
        stock: 31,
        seller: "Tech World",
        tags: [
            "watch",
            "smartwatch",
            "wearable",
            "electronics"
        ],
        isFlashSale: true,
        isBestSelling: true,
        isNewArrival: true
    },


    {
        id: "sports-shoes",
        name: "Sports Shoes",
        category: "Fashion",
        price: 1999,
        oldPrice: 2800,
        rating: 4,
        reviews: 143,
        emoji: "👟",
        badge: "Trending",
        stock: 18,
        seller: "Fashion House",
        tags: [
            "shoes",
            "sports",
            "running",
            "fashion"
        ],
        isFlashSale: true,
        isBestSelling: true,
        isNewArrival: true
    },


    {
        id: "premium-tshirt",
        name: "Premium Cotton T-Shirt",
        category: "Fashion",
        price: 699,
        oldPrice: 950,
        rating: 4,
        reviews: 67,
        emoji: "👕",
        badge: "New",
        stock: 75,
        seller: "Fashion House",
        tags: [
            "tshirt",
            "cotton",
            "shirt",
            "fashion"
        ],
        isFlashSale: false,
        isBestSelling: true,
        isNewArrival: true
    },


    {
        id: "casual-backpack",
        name: "Casual Backpack",
        category: "Fashion",
        price: 1299,
        oldPrice: 1700,
        rating: 4,
        reviews: 54,
        emoji: "🎒",
        badge: "New",
        stock: 38,
        seller: "Fashion House",
        tags: [
            "bag",
            "backpack",
            "travel",
            "fashion"
        ],
        isFlashSale: false,
        isBestSelling: false,
        isNewArrival: true
    },


    {
        id: "home-lamp",
        name: "Modern Table Lamp",
        category: "Home & Living",
        price: 899,
        oldPrice: 1200,
        rating: 5,
        reviews: 92,
        emoji: "💡",
        badge: "Popular",
        stock: 44,
        seller: "Home & Living Store",
        tags: [
            "lamp",
            "light",
            "home",
            "decor"
        ],
        isFlashSale: false,
        isBestSelling: true,
        isNewArrival: true
    },


    {
        id: "decor-cushion",
        name: "Decorative Cushion Set",
        category: "Home & Living",
        price: 749,
        oldPrice: 999,
        rating: 4,
        reviews: 61,
        emoji: "🛋️",
        badge: "New",
        stock: 52,
        seller: "Home & Living Store",
        tags: [
            "cushion",
            "decor",
            "home",
            "living"
        ],
        isFlashSale: false,
        isBestSelling: false,
        isNewArrival: true
    },


    {
        id: "skincare-set",
        name: "Daily Skincare Set",
        category: "Beauty",
        price: 1599,
        oldPrice: 2100,
        rating: 5,
        reviews: 118,
        emoji: "💄",
        badge: "Top Rated",
        stock: 27,
        seller: "BeautyCare",
        tags: [
            "skincare",
            "beauty",
            "cosmetics"
        ],
        isFlashSale: false,
        isBestSelling: true,
        isNewArrival: true
    },


    {
        id: "beauty-mirror",
        name: "LED Beauty Mirror",
        category: "Beauty",
        price: 1199,
        oldPrice: 1600,
        rating: 4,
        reviews: 47,
        emoji: "🪞",
        badge: "New",
        stock: 33,
        seller: "BeautyCare",
        tags: [
            "mirror",
            "beauty",
            "led"
        ],
        isFlashSale: false,
        isBestSelling: false,
        isNewArrival: true
    },


    {
        id: "gaming-controller",
        name: "Wireless Gaming Controller",
        category: "Gaming",
        price: 2299,
        oldPrice: 3000,
        rating: 5,
        reviews: 153,
        emoji: "🎮",
        badge: "Popular",
        stock: 21,
        seller: "GameZone",
        tags: [
            "gaming",
            "controller",
            "console"
        ],
        isFlashSale: false,
        isBestSelling: true,
        isNewArrival: true
    },


    {
        id: "gaming-headset",
        name: "Gaming Headset",
        category: "Gaming",
        price: 1799,
        oldPrice: 2400,
        rating: 4,
        reviews: 81,
        emoji: "🕹️",
        badge: "New",
        stock: 29,
        seller: "GameZone",
        tags: [
            "gaming",
            "headset",
            "audio"
        ],
        isFlashSale: false,
        isBestSelling: false,
        isNewArrival: true
    },


    {
        id: "bestseller-novel",
        name: "Bestseller Novel",
        category: "Books",
        price: 499,
        oldPrice: 650,
        rating: 5,
        reviews: 203,
        emoji: "📚",
        badge: "Bestseller",
        stock: 64,
        seller: "BookWorld",
        tags: [
            "book",
            "novel",
            "reading"
        ],
        isFlashSale: false,
        isBestSelling: true,
        isNewArrival: false
    },


    {
        id: "study-notebook",
        name: "Premium Study Notebook",
        category: "Books",
        price: 299,
        oldPrice: 399,
        rating: 4,
        reviews: 35,
        emoji: "📓",
        badge: "New",
        stock: 100,
        seller: "BookWorld",
        tags: [
            "notebook",
            "study",
            "book",
            "stationery"
        ],
        isFlashSale: false,
        isBestSelling: false,
        isNewArrival: true
    }

];


/* ============================================================
   PRODUCT NORMALIZATION
   ============================================================ */

function normalizeProduct(product) {

    return {

        id: String(product.id),

        name: String(product.name || "Unnamed Product"),

        category:
            String(product.category || "Other"),

        price:
            Number(product.price) || 0,

        oldPrice:
            Number(product.oldPrice || product.price) || 0,

        rating:
            clamp(
                Number(product.rating) || 0,
                0,
                5
            ),

        reviews:
            Number(product.reviews) || 0,

        emoji:
            product.emoji || "🛍️",

        badge:
            product.badge || "",

        stock:
            Math.max(
                Number(product.stock) || 0,
                0
            ),

        seller:
            product.seller || "MyShop Seller",

        tags:
            Array.isArray(product.tags)
                ? product.tags.map(normalizeText)
                : [],

        isFlashSale:
            Boolean(product.isFlashSale),

        isBestSelling:
            Boolean(product.isBestSelling),

        isNewArrival:
            Boolean(product.isNewArrival)

    };

}


/* ============================================================
   LOAD PRODUCT CATALOGUE
   ============================================================ */

function initializeProductCatalogue() {

    MyShop.products =
        PRODUCT_CATALOGUE.map(
            normalizeProduct
        );

    MyShop.filteredProducts =
        [...MyShop.products];

}


/* ============================================================
   PRODUCT LOOKUP
   ============================================================ */

function getProductById(productId) {

    if (!productId) {
        return null;
    }

    return MyShop.products.find(
        product =>
            product.id === String(productId)
    ) || null;

}


/* ============================================================
   PRODUCT SEARCH
   ============================================================ */

function searchProducts(query) {

    const normalizedQuery =
        normalizeText(query);

    MyShop.currentSearch =
        normalizedQuery;

    if (!normalizedQuery) {

        MyShop.filteredProducts =
            [...MyShop.products];

        return MyShop.filteredProducts;

    }


    MyShop.filteredProducts =
        MyShop.products.filter(
            product => {

                const searchableText =
                    [
                        product.name,
                        product.category,
                        product.seller,
                        ...product.tags
                    ]
                    .join(" ")
                    .toLowerCase();


                return searchableText.includes(
                    normalizedQuery
                );

            }
        );


    MyShop.currentPage = 1;

    return MyShop.filteredProducts;

}


/* ============================================================
   CATEGORY FILTER
   ============================================================ */

function filterProductsByCategory(category) {

    const normalizedCategory =
        normalizeText(category);


    MyShop.currentCategory =
        normalizedCategory || "all";


    let products =
        [...MyShop.products];


    if (
        normalizedCategory &&
        normalizedCategory !== "all"
    ) {

        products =
            products.filter(
                product =>
                    normalizeText(
                        product.category
                    ) === normalizedCategory
            );

    }


    if (MyShop.currentSearch) {

        const query =
            MyShop.currentSearch;

        products =
            products.filter(
                product => {

                    const text =
                        [
                            product.name,
                            product.category,
                            product.seller,
                            ...product.tags
                        ]
                        .join(" ")
                        .toLowerCase();


                    return text.includes(
                        query
                    );

                }
            );

    }


    MyShop.filteredProducts =
        products;

    MyShop.currentPage = 1;

    return MyShop.filteredProducts;

}


/* ============================================================
   PRODUCT SORTING
   ============================================================ */

function sortProducts(
    products = MyShop.filteredProducts,
    sortType = MyShop.currentSort
) {

    const sorted =
        [...products];


    switch (sortType) {

        case "price-low":

            sorted.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            sorted.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;


        case "rating":

            sorted.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;


        case "popular":

            sorted.sort(
                (a, b) =>
                    b.reviews - a.reviews
            );

            break;


        case "newest":

            sorted.sort(
                (a, b) =>
                    Number(b.isNewArrival) -
                    Number(a.isNewArrival)
            );

            break;


        default:

            break;

    }


    MyShop.filteredProducts =
        sorted;

    MyShop.currentSort =
        sortType;


    return sorted;

}


/* ============================================================
   FLASH SALE PRODUCTS
   ============================================================ */

function getFlashSaleProducts() {

    return MyShop.products.filter(
        product =>
            product.isFlashSale
    );

}


/* ============================================================
   BEST SELLING PRODUCTS
   ============================================================ */

function getBestSellingProducts(
    category = "all"
) {

    let products =
        MyShop.products.filter(
            product =>
                product.isBestSelling
        );


    if (
        category &&
        normalizeText(category) !== "all"
    ) {

        products =
            products.filter(
                product =>
                    normalizeText(
                        product.category
                    ) === normalizeText(
                        category
                    )
            );

    }


    return products;

}


/* ============================================================
   NEW ARRIVAL PRODUCTS
   ============================================================ */

function getNewArrivalProducts(
    category = "all"
) {

    let products =
        MyShop.products.filter(
            product =>
                product.isNewArrival
        );


    if (
        category &&
        normalizeText(category) !== "all"
    ) {

        products =
            products.filter(
                product =>
                    normalizeText(
                        product.category
                    ) === normalizeText(
                        category
                    )
            );

    }


    return products;

}


/* ============================================================
   RECOMMENDED PRODUCTS
   ============================================================ */

function getRecommendedProducts(
    filter = "all"
) {

    const products =
        [...MyShop.products];


    switch (filter) {

        case "popular":

            return products
                .sort(
                    (a, b) =>
                        b.reviews - a.reviews
                )
                .slice(0, 12);


        case "trending":

            return products
                .filter(
                    product =>
                        product.badge === "Trending" ||
                        product.isNewArrival
                )
                .slice(0, 12);


        case "deals":

            return products
                .filter(
                    product =>
                        product.oldPrice >
                        product.price
                )
                .sort(
                    (a, b) => {

                        const discountA =
                            a.oldPrice > 0
                                ? (
                                    (a.oldPrice - a.price) /
                                    a.oldPrice
                                )
                                : 0;

                        const discountB =
                            b.oldPrice > 0
                                ? (
                                    (b.oldPrice - b.price) /
                                    b.oldPrice
                                )
                                : 0;

                        return discountB -
                            discountA;

                    }
                )
                .slice(0, 12);


        default:

            return products
                .sort(
                    (a, b) =>
                        b.rating - a.rating
                )
                .slice(0, 12);

    }

}


/* ============================================================
   DISCOUNT CALCULATION
   ============================================================ */

function getDiscountPercentage(product) {

    if (
        !product ||
        product.oldPrice <= product.price
    ) {
        return 0;
    }


    return Math.round(
        (
            (product.oldPrice - product.price) /
            product.oldPrice
        ) * 100
    );

}


/* ============================================================
   PRODUCT RATING HTML
   ============================================================ */

function getRatingHTML(rating) {

    const rounded =
        clamp(
            Math.round(Number(rating) || 0),
            0,
            5
        );


    let html = "";


    for (
        let index = 1;
        index <= 5;
        index++
    ) {

        html +=
            index <= rounded
                ? "⭐"
                : "☆";

    }


    return html;

}


/* ============================================================
   INITIALIZE CATALOGUE
   ============================================================ */

initializeProductCatalogue();

/* ============================================================
   MyShop Marketplace
   app.js — PART 2A
   Shopping Cart Core
   ============================================================ */


/* ============================================================
   CART ITEM LOOKUP
   ============================================================ */

function getCartItem(productId) {

    if (!productId) {
        return null;
    }


    return MyShop.cart.find(
        item =>
            String(item.productId) ===
            String(productId)
    ) || null;

}


/* ============================================================
   CART ITEM QUANTITY
   ============================================================ */

function getCartItemQuantity(productId) {

    const item =
        getCartItem(productId);


    return item
        ? Number(item.quantity) || 0
        : 0;

}


/* ============================================================
   CART TOTAL ITEM COUNT
   ============================================================ */

function getCartCount() {

    return MyShop.cart.reduce(
        (total, item) =>
            total +
            (Number(item.quantity) || 0),
        0
    );

}


/* ============================================================
   CART SUBTOTAL
   ============================================================ */

function getCartSubtotal() {

    return MyShop.cart.reduce(
        (total, item) => {

            const product =
                getProductById(
                    item.productId
                );


            if (!product) {
                return total;
            }


            const quantity =
                Number(item.quantity) || 0;


            return total +
                (
                    product.price *
                    quantity
                );

        },
        0
    );

}


/* ============================================================
   CART SHIPPING
   ============================================================ */

function getCartShipping() {

    const subtotal =
        getCartSubtotal();


    if (subtotal <= 0) {
        return 0;
    }


    /*
       This is intentionally kept as a separate
       calculation layer so the real delivery/
       checkout system can later replace it.
    */

    return subtotal >= 2000
        ? 0
        : 60;

}


/* ============================================================
   CART DISCOUNT
   ============================================================ */

function getCartDiscount() {

    /*
       Product-level discounts are already reflected
       in product.price versus product.oldPrice.

       Campaign / coupon discounts can be plugged
       into this function later without changing
       the cart architecture.
    */

    return 0;

}


/* ============================================================
   CART GRAND TOTAL
   ============================================================ */

function getCartTotal() {

    const subtotal =
        getCartSubtotal();


    const shipping =
        getCartShipping();


    const discount =
        getCartDiscount();


    return Math.max(
        0,
        subtotal +
        shipping -
        discount
    );

}


/* ============================================================
   ADD PRODUCT TO CART
   ============================================================ */

function addToCart(
    productOrId,
    price = null,
    quantity = 1
) {

    let product = null;


    /*
       Supports:

       addToCart("smartphone-pro")

       and the original HTML style:

       addToCart("Smartphone Pro", 18999)
    */


    if (
        typeof productOrId === "object" &&
        productOrId !== null
    ) {

        product =
            getProductById(
                productOrId.id
            );

    } else {

        product =
            getProductById(
                productOrId
            );


        /*
           Backward compatibility with the
           original inline HTML calls.

           Example:

           addToCart('Smartphone Pro', 18999)
        */

        if (!product) {

            product =
                MyShop.products.find(
                    item =>
                        normalizeText(
                            item.name
                        ) ===
                        normalizeText(
                            productOrId
                        )
                ) || null;

        }

    }


    /*
       If the product exists only as a name in
       legacy markup, preserve the supplied price
       instead of silently failing.
    */

    if (
        !product &&
        typeof productOrId === "string" &&
        price !== null
    ) {

        product = {

            id: normalizeText(
                productOrId
            ).replace(
                /\s+/g,
                "-"
            ),

            name:
                String(productOrId),

            category:
                "Other",

            price:
                Number(price) || 0,

            oldPrice:
                Number(price) || 0,

            rating: 0,

            reviews: 0,

            emoji: "🛍️",

            badge: "",

            stock: 999,

            seller: "MyShop Seller",

            tags: [],

            isFlashSale: false,

            isBestSelling: false,

            isNewArrival: false

        };

    }


    if (!product) {

        showToast(
            "Product could not be added.",
            "error"
        );

        return false;

    }


    const requestedQuantity =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const existingItem =
        getCartItem(
            product.id
        );


    const existingQuantity =
        existingItem
            ? Number(existingItem.quantity) || 0
            : 0;


    const maxStock =
        Number(product.stock) || 0;


    const newQuantity =
        existingQuantity +
        requestedQuantity;


    if (
        maxStock > 0 &&
        newQuantity > maxStock
    ) {

        showToast(
            `Only ${maxStock} item(s) available.`,
            "warning"
        );

        return false;

    }


    if (existingItem) {

        existingItem.quantity =
            newQuantity;

    } else {

        MyShop.cart.push({

            id:
                generateId("cart"),

            productId:
                product.id,

            quantity:
                requestedQuantity,

            addedAt:
                new Date().toISOString()

        });

    }


    saveCart();

    updateCartUI();


    showToast(
        `${product.name} added to cart.`,
        "success"
    );


    return true;

}


/* ============================================================
   REMOVE PRODUCT FROM CART
   ============================================================ */

function removeFromCart(productId) {

    const index =
        MyShop.cart.findIndex(
            item =>
                String(item.productId) ===
                String(productId)
        );


    if (index === -1) {

        return false;

    }


    const product =
        getProductById(
            productId
        );


    MyShop.cart.splice(
        index,
        1
    );


    saveCart();

    updateCartUI();


    if (product) {

        showToast(
            `${product.name} removed from cart.`,
            "info"
        );

    }


    return true;

}


/* ============================================================
   UPDATE CART QUANTITY
   ============================================================ */

function updateCartQuantity(
    productId,
    quantity
) {

    const item =
        getCartItem(
            productId
        );


    if (!item) {

        return false;

    }


    const product =
        getProductById(
            productId
        );


    let newQuantity =
        Number(quantity);


    if (
        !Number.isFinite(
            newQuantity
        )
    ) {

        newQuantity = 1;

    }


    newQuantity =
        Math.floor(
            newQuantity
        );


    if (
        newQuantity <= 0
    ) {

        return removeFromCart(
            productId
        );

    }


    if (
        product &&
        product.stock > 0 &&
        newQuantity > product.stock
    ) {

        newQuantity =
            product.stock;


        showToast(
            `Only ${product.stock} item(s) available.`,
            "warning"
        );

    }


    item.quantity =
        newQuantity;


    saveCart();

    updateCartUI();


    return true;

}


/* ============================================================
   INCREASE CART QUANTITY
   ============================================================ */

function increaseCartQuantity(
    productId
) {

    const current =
        getCartItemQuantity(
            productId
        );


    return updateCartQuantity(
        productId,
        current + 1
    );

}


/* ============================================================
   DECREASE CART QUANTITY
   ============================================================ */

function decreaseCartQuantity(
    productId
) {

    const current =
        getCartItemQuantity(
            productId
        );


    return updateCartQuantity(
        productId,
        current - 1
    );

}


/* ============================================================
   CLEAR ENTIRE CART
   ============================================================ */

function clearCart(
    showMessage = true
) {

    if (
        MyShop.cart.length === 0
    ) {

        return;

    }


    MyShop.cart = [];


    saveCart();

    updateCartUI();


    if (showMessage) {

        showToast(
            "Your cart has been cleared.",
            "info"
        );

    }

}

/* ============================================================
   MyShop Marketplace
   app.js — PART 2B
   Cart UI + Cart Modal
   ============================================================ */


/* ============================================================
   CART ITEM HTML
   ============================================================ */

function createCartItemHTML(item) {

    const product =
        getProductById(
            item.productId
        );


    if (!product) {
        return "";
    }


    const quantity =
        Math.max(
            1,
            Number(item.quantity) || 1
        );


    const lineTotal =
        product.price *
        quantity;


    return `

        <article
            class="cart-item"
            data-cart-product="${escapeHTML(product.id)}"
        >

            <div
                class="cart-item-image"
                aria-hidden="true"
            >
                ${product.emoji}
            </div>


            <div class="cart-item-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p class="cart-item-seller">
                    ${escapeHTML(product.seller)}
                </p>


                <strong class="cart-item-price">
                    ${formatPrice(product.price)}
                </strong>

            </div>


            <div class="cart-item-controls">

                <button
                    type="button"
                    class="quantity-button"
                    data-cart-decrease="${escapeHTML(product.id)}"
                    aria-label="Decrease quantity"
                >
                    −
                </button>


                <span
                    class="cart-item-quantity"
                    aria-label="Quantity"
                >
                    ${quantity}
                </span>


                <button
                    type="button"
                    class="quantity-button"
                    data-cart-increase="${escapeHTML(product.id)}"
                    aria-label="Increase quantity"
                >
                    +
                </button>

            </div>


            <strong class="cart-item-total">
                ${formatPrice(lineTotal)}
            </strong>


            <button
                type="button"
                class="cart-item-remove"
                data-cart-remove="${escapeHTML(product.id)}"
                aria-label="Remove ${escapeHTML(product.name)}"
                title="Remove item"
            >
                ×
            </button>

        </article>

    `;

}


/* ============================================================
   RENDER CART ITEMS
   ============================================================ */

function renderCartItems() {

    const container =
        getElement("cartItems");


    const emptyState =
        getElement("emptyCart");


    if (!container) {
        return;
    }


    if (
        !Array.isArray(
            MyShop.cart
        ) ||
        MyShop.cart.length === 0
    ) {

        container.innerHTML = "";


        if (emptyState) {
            emptyState.hidden = false;
        }


        return;

    }


    if (emptyState) {
        emptyState.hidden = true;
    }


    const validItems =
        MyShop.cart.filter(
            item =>
                getProductById(
                    item.productId
                )
        );


    if (
        validItems.length === 0
    ) {

        MyShop.cart = [];

        saveCart();

        container.innerHTML = "";

        if (emptyState) {
            emptyState.hidden = false;
        }

        return;

    }


    container.innerHTML =
        validItems
            .map(
                createCartItemHTML
            )
            .join("");

}


/* ============================================================
   UPDATE CART COUNT
   ============================================================ */

function updateCartCount() {

    const count =
        getCartCount();


    const countElements = [

        getElement("cartCount"),

        getElement("customerCartCount"),

        getElement("cartPreviewCount")

    ];


    countElements.forEach(
        element => {

            if (!element) {
                return;
            }

            element.textContent =
                count.toLocaleString(
                    "en-BD"
                );

        }
    );


    const headerCart =
        document.querySelector(
            '[onclick="openCart()"]'
        );


    if (headerCart) {

        headerCart.setAttribute(
            "aria-label",
            `Shopping cart, ${count} item${count === 1 ? "" : "s"}`
        );

    }

}


/* ============================================================
   UPDATE CART TOTALS
   ============================================================ */

function updateCartTotals() {

    const subtotal =
        getCartSubtotal();


    const shipping =
        getCartShipping();


    const discount =
        getCartDiscount();


    const total =
        getCartTotal();


    const subtotalElements = [

        getElement("cartPreviewSubtotal")

    ];


    subtotalElements.forEach(
        element => {

            if (element) {

                element.textContent =
                    formatPrice(
                        subtotal
                    );

            }

        }
    );


    const totalElements = [

        getElement("cartTotal"),

        getElement("cartPreviewTotal")

    ];


    totalElements.forEach(
        element => {

            if (element) {

                element.textContent =
                    formatPrice(
                        total
                    );

            }

        }
    );


    /*
       Optional elements can be added by CSS/HTML
       without breaking the application.
    */

    const shippingElement =
        getElement(
            "cartShipping"
        );


    if (shippingElement) {

        shippingElement.textContent =
            shipping === 0
                ? "FREE"
                : formatPrice(
                    shipping
                );

    }


    const discountElement =
        getElement(
            "cartDiscount"
        );


    if (discountElement) {

        discountElement.textContent =
            `-${formatPrice(discount)}`;

    }

}


/* ============================================================
   UPDATE CART PREVIEW
   ============================================================ */

function updateCartPreview() {

    const container =
        getElement(
            "cartPreviewItems"
        );


    if (!container) {
        return;
    }


    if (
        MyShop.cart.length === 0
    ) {

        container.innerHTML = `

            <div class="cart-preview-empty">

                <span aria-hidden="true">
                    🛒
                </span>

                <p>
                    Your cart is empty.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        MyShop.cart
            .map(
                item => {

                    const product =
                        getProductById(
                            item.productId
                        );


                    if (!product) {
                        return "";
                    }


                    const quantity =
                        Number(
                            item.quantity
                        ) || 1;


                    return `

                        <div
                            class="cart-preview-item"
                            data-preview-product="${escapeHTML(product.id)}"
                        >

                            <span
                                class="cart-preview-image"
                                aria-hidden="true"
                            >
                                ${product.emoji}
                            </span>


                            <div>

                                <strong>
                                    ${escapeHTML(product.name)}
                                </strong>

                                <small>
                                    ${quantity} ×
                                    ${formatPrice(product.price)}
                                </small>

                            </div>


                            <strong>
                                ${formatPrice(
                                    product.price *
                                    quantity
                                )}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ============================================================
   UPDATE COMPLETE CART UI
   ============================================================ */

function updateCartUI() {

    updateCartCount();

    updateCartTotals();

    updateCartPreview();

    renderCartItems();

}


/* ============================================================
   OPEN CART
   ============================================================ */

function openCart() {

    const modal =
        getElement(
            "cartModal"
        );


    if (!modal) {
        return;
    }


    updateCartUI();


    modal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "cart";


    const closeButton =
        $(".modal-close", modal);


    if (closeButton) {

        setTimeout(
            () => closeButton.focus(),
            50
        );

    }

}


/* ============================================================
   CLOSE CART
   ============================================================ */

function closeCart() {

    const modal =
        getElement(
            "cartModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden = true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "cart"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   CART EVENT HANDLER
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const increase =
            event.target.closest(
                "[data-cart-increase]"
            );


        if (increase) {

            event.preventDefault();


            increaseCartQuantity(
                increase.dataset.cartIncrease
            );


            return;

        }


        const decrease =
            event.target.closest(
                "[data-cart-decrease]"
            );


        if (decrease) {

            event.preventDefault();


            decreaseCartQuantity(
                decrease.dataset.cartDecrease
            );


            return;

        }


        const remove =
            event.target.closest(
                "[data-cart-remove]"
            );


        if (remove) {

            event.preventDefault();


            removeFromCart(
                remove.dataset.cartRemove
            );


            return;

        }


        const closeModal =
            event.target.closest(
                "[data-close-modal]"
            );


        if (
            closeModal &&
            MyShop.activeModal ===
                "cart"
        ) {

            closeCart();

        }

    }
);


/* ============================================================
   ESC KEY — CART
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "cart"
        ) {

            closeCart();

        }

    }
);


/* ============================================================
   INITIAL CART UI
   ============================================================ */

updateCartUI();

/* ============================================================
   MyShop Marketplace
   app.js — PART 3A
   Wishlist + Recently Viewed Core
   ============================================================ */


/* ============================================================
   WISHLIST LOOKUP
   ============================================================ */

function isInWishlist(productId) {

    if (!productId) {
        return false;
    }


    return MyShop.wishlist.some(
        item =>
            String(
                typeof item === "object"
                    ? item.productId
                    : item
            ) === String(productId)
    );

}


/* ============================================================
   WISHLIST COUNT
   ============================================================ */

function getWishlistCount() {

    return MyShop.wishlist.length;

}


/* ============================================================
   ADD TO WISHLIST
   ============================================================ */

function addToWishlist(productId) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        showToast(
            "Product could not be found.",
            "error"
        );

        return false;

    }


    if (
        isInWishlist(
            product.id
        )
    ) {

        showToast(
            `${product.name} is already in your wishlist.`,
            "info"
        );

        return false;

    }


    MyShop.wishlist.push({

        productId:
            product.id,

        addedAt:
            new Date().toISOString()

    });


    saveWishlist();

    updateWishlistUI();


    showToast(
        `${product.name} added to wishlist.`,
        "success"
    );


    return true;

}


/* ============================================================
   REMOVE FROM WISHLIST
   ============================================================ */

function removeFromWishlist(productId) {

    const index =
        MyShop.wishlist.findIndex(
            item =>
                String(
                    typeof item === "object"
                        ? item.productId
                        : item
                ) === String(productId)
        );


    if (index === -1) {
        return false;
    }


    const product =
        getProductById(
            productId
        );


    MyShop.wishlist.splice(
        index,
        1
    );


    saveWishlist();

    updateWishlistUI();


    if (product) {

        showToast(
            `${product.name} removed from wishlist.`,
            "info"
        );

    }


    return true;

}


/* ============================================================
   TOGGLE WISHLIST
   ============================================================ */

function toggleWishlist(productId) {

    if (
        isInWishlist(
            productId
        )
    ) {

        return removeFromWishlist(
            productId
        );

    }


    return addToWishlist(
        productId
    );

}


/* ============================================================
   CLEAR WISHLIST
   ============================================================ */

function clearWishlist(
    showMessage = true
) {

    if (
        MyShop.wishlist.length === 0
    ) {

        return;

    }


    MyShop.wishlist = [];


    saveWishlist();

    updateWishlistUI();


    if (showMessage) {

        showToast(
            "Wishlist cleared.",
            "info"
        );

    }

}


/* ============================================================
   WISHLIST PRODUCT OBJECTS
   ============================================================ */

function getWishlistProducts() {

    return MyShop.wishlist
        .map(
            item => {

                const productId =
                    typeof item === "object"
                        ? item.productId
                        : item;


                return getProductById(
                    productId
                );

            }
        )
        .filter(Boolean);

}


/* ============================================================
   RECENTLY VIEWED LOOKUP
   ============================================================ */

function isRecentlyViewed(
    productId
) {

    return MyShop.recentlyViewed.some(
        item =>
            String(
                typeof item === "object"
                    ? item.productId
                    : item
            ) === String(productId)
    );

}


/* ============================================================
   ADD RECENTLY VIEWED
   ============================================================ */

function addRecentlyViewed(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {
        return false;
    }


    /*
       Remove the old entry first so the
       latest viewed product always appears first.
    */

    MyShop.recentlyViewed =
        MyShop.recentlyViewed.filter(
            item =>
                String(
                    typeof item === "object"
                        ? item.productId
                        : item
                ) !== String(product.id)
        );


    MyShop.recentlyViewed.unshift({

        productId:
            product.id,

        viewedAt:
            new Date().toISOString()

    });


    /*
       Keep the list small and fast.
    */

    MyShop.recentlyViewed =
        MyShop.recentlyViewed.slice(
            0,
            12
        );


    saveRecentlyViewed();

    renderRecentlyViewed();


    return true;

}


/* ============================================================
   RECENTLY VIEWED PRODUCTS
   ============================================================ */

function getRecentlyViewedProducts() {

    return MyShop.recentlyViewed
        .map(
            item => {

                const productId =
                    typeof item === "object"
                        ? item.productId
                        : item;


                return getProductById(
                    productId
                );

            }
        )
        .filter(Boolean);

}


/* ============================================================
   CLEAR RECENTLY VIEWED
   ============================================================ */

function clearRecentlyViewed(
    showMessage = true
) {

    MyShop.recentlyViewed =
        [];


    saveRecentlyViewed();

    renderRecentlyViewed();


    if (showMessage) {

        showToast(
            "Recently viewed products cleared.",
            "info"
        );

    }

}


/* ============================================================
   WISHLIST COUNT UI
   ============================================================ */

function updateWishlistCount() {

    const count =
        getWishlistCount();


    $$(
        "[data-wishlist-count]"
    ).forEach(
        element => {

            element.textContent =
                count.toLocaleString(
                    "en-BD"
                );

        }
    );


    const wishlistButtons =
        $$(
            '[data-customer-action="wishlist"]'
        );


    wishlistButtons.forEach(
        button => {

            button.setAttribute(
                "aria-label",
                `Wishlist, ${count} saved item${count === 1 ? "" : "s"}`
            );

        }
    );

}


/* ============================================================
   WISHLIST BUTTON STATE
   ============================================================ */

function updateWishlistButtons() {

    $$(
        "[data-wishlist-product]"
    ).forEach(
        button => {

            const productId =
                button.dataset.wishlistProduct;


            const active =
                isInWishlist(
                    productId
                );


            button.classList.toggle(
                "active",
                active
            );


            button.setAttribute(
                "aria-pressed",
                active
            );


            const label =
                active
                    ? "Remove from wishlist"
                    : "Add to wishlist";


            button.setAttribute(
                "aria-label",
                label
            );


            const icon =
                $(
                    ".wishlist-icon",
                    button
                );


            if (icon) {

                icon.textContent =
                    active
                        ? "♥"
                        : "♡";

            }

        }
    );

}


/* ============================================================
   WISHLIST UI
   ============================================================ */

function updateWishlistUI() {

    updateWishlistCount();

    renderWishlist();

    updateWishlistButtons();

}


/* ============================================================
   PRODUCT CARD FOR WISHLIST
   ============================================================ */

function createWishlistCardHTML(
    product
) {

    if (!product) {
        return "";
    }


    const discount =
        getDiscountPercentage(
            product
        );


    const wished =
        isInWishlist(
            product.id
        );


    return `

        <article
            class="product-card wishlist-product-card"
            data-product-id="${escapeHTML(product.id)}"
        >

            <div class="product-card-image">

                ${
                    product.badge
                        ? `
                            <span class="product-badge">
                                ${escapeHTML(product.badge)}
                            </span>
                          `
                        : ""
                }


                <button
                    type="button"
                    class="wishlist-button ${
                        wished ? "active" : ""
                    }"
                    data-wishlist-product="${escapeHTML(product.id)}"
                    aria-label="${
                        wished
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }"
                    aria-pressed="${wished}"
                >

                    <span
                        class="wishlist-icon"
                        aria-hidden="true"
                    >
                        ${wished ? "♥" : "♡"}
                    </span>

                </button>


                <div
                    class="product-emoji"
                    aria-hidden="true"
                >
                    ${product.emoji}
                </div>

            </div>


            <div class="product-card-body">

                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>


                <h3 class="product-title">
                    ${escapeHTML(product.name)}
                </h3>


                <div class="product-rating">

                    <span>
                        ${getRatingHTML(product.rating)}
                    </span>

                    <small>
                        (${product.reviews})
                    </small>

                </div>


                <div class="product-price-row">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                    ${
                        product.oldPrice > product.price
                            ? `
                                <del class="product-old-price">
                                    ${formatPrice(product.oldPrice)}
                                </del>
                              `
                            : ""
                    }

                </div>


                ${
                    discount > 0
                        ? `
                            <span class="product-discount">
                                ${discount}% OFF
                            </span>
                          `
                        : ""
                }


                <div class="product-card-actions">

                    <button
                        type="button"
                        class="add-to-cart-button"
                        data-product-add-cart="${escapeHTML(product.id)}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* ============================================================
   RENDER WISHLIST
   ============================================================ */

function renderWishlist() {

    const grid =
        getElement(
            "wishlistGrid"
        );


    const emptyState =
        getElement(
            "wishlistEmpty"
        );


    if (!grid) {
        return;
    }


    const products =
        getWishlistProducts();


    if (
        products.length === 0
    ) {

        grid.innerHTML = "";


        if (emptyState) {
            emptyState.hidden = false;
        }


        return;

    }


    if (emptyState) {
        emptyState.hidden = true;
    }


    grid.innerHTML =
        products
            .map(
                createWishlistCardHTML
            )
            .join("");

}


/* ============================================================
   RECENTLY VIEWED CARD
   ============================================================ */

function createRecentlyViewedCardHTML(
    product
) {

    if (!product) {
        return "";
    }


    return `

        <article
            class="product-card recently-viewed-card"
            data-product-id="${escapeHTML(product.id)}"
        >

            <div class="product-card-image">

                <div
                    class="product-emoji"
                    aria-hidden="true"
                >
                    ${product.emoji}
                </div>

            </div>


            <div class="product-card-body">

                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>


                <h3 class="product-title">
                    ${escapeHTML(product.name)}
                </h3>


                <div class="product-price-row">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                </div>


                <button
                    type="button"
                    class="add-to-cart-button"
                    data-product-add-cart="${escapeHTML(product.id)}"
                >
                    Add to Cart
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   RENDER RECENTLY VIEWED
   ============================================================ */

function renderRecentlyViewed() {

    const section =
        getElement(
            "recently-viewed"
        );


    if (!section) {
        return;
    }


    const grid =
        $(
            "[data-product-list='recently-viewed']",
            section
        );


    if (!grid) {
        return;
    }


    const products =
        getRecentlyViewedProducts();


    grid.innerHTML =
        products
            .map(
                createRecentlyViewedCardHTML
            )
            .join("");

}


/* ============================================================
   WISHLIST / RECENTLY VIEWED EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const wishlistButton =
            event.target.closest(
                "[data-wishlist-product]"
            );


        if (wishlistButton) {

            event.preventDefault();

            event.stopPropagation();


            toggleWishlist(
                wishlistButton.dataset
                    .wishlistProduct
            );


            return;

        }


        const clearButton =
            event.target.closest(
                "[data-clear-wishlist]"
            );


        if (clearButton) {

            event.preventDefault();


            clearWishlist();

            return;

        }


        const addCartButton =
            event.target.closest(
                "[data-product-add-cart]"
            );


        if (addCartButton) {

            event.preventDefault();


            addToCart(
                addCartButton.dataset
                    .productAddCart
            );


            return;

        }

    }
);


/* ============================================================
   INITIAL WISHLIST UI
   ============================================================ */

updateWishlistUI();

renderRecentlyViewed();

/* ============================================================
   MyShop Marketplace
   app.js — PART 3B
   Product Interaction + Product Details
   ============================================================ */


/* ============================================================
   PRODUCT DETAILS MODAL
   ============================================================ */

function openProductDetails(productId) {

    const product =
        getProductById(productId);


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );

        return;

    }


    addRecentlyViewed(
        product.id
    );


    let modal =
        getElement(
            "productDetailsModal"
        );


    /*
       Create the modal only when it is actually needed.
       This keeps the original HTML clean and avoids
       duplicating product markup.
    */

    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "productDetailsModal";

        modal.className =
            "modal product-details-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const discount =
        getDiscountPercentage(
            product
        );


    const wished =
        isInWishlist(
            product.id
        );


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-product-modal-close
        ></div>


        <div class="modal-content product-details-content">

            <div class="modal-header">

                <div>

                    <p class="section-eyebrow">
                        PRODUCT DETAILS
                    </p>

                    <h2>
                        ${escapeHTML(product.name)}
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    data-product-modal-close
                    aria-label="Close product details"
                >
                    ×
                </button>

            </div>


            <div class="product-details-layout">


                <div class="product-details-visual">

                    ${
                        product.badge
                            ? `
                                <span class="product-badge">
                                    ${escapeHTML(product.badge)}
                                </span>
                              `
                            : ""
                    }


                    <div
                        class="product-details-emoji"
                        aria-hidden="true"
                    >
                        ${product.emoji}
                    </div>

                </div>


                <div class="product-details-info">

                    <p class="product-category">
                        ${escapeHTML(product.category)}
                    </p>


                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>


                    <div class="product-rating">

                        <span>
                            ${getRatingHTML(product.rating)}
                        </span>

                        <span>
                            ${product.rating.toFixed(1)}
                        </span>

                        <small>
                            (${product.reviews} reviews)
                        </small>

                    </div>


                    <div class="product-details-price">

                        <strong>
                            ${formatPrice(product.price)}
                        </strong>


                        ${
                            product.oldPrice > product.price
                                ? `
                                    <del>
                                        ${formatPrice(product.oldPrice)}
                                    </del>
                                  `
                                : ""
                        }


                        ${
                            discount > 0
                                ? `
                                    <span>
                                        ${discount}% OFF
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    <div class="product-details-meta">

                        <p>
                            <strong>
                                Seller:
                            </strong>

                            ${escapeHTML(product.seller)}
                        </p>


                        <p>
                            <strong>
                                Availability:
                            </strong>

                            ${
                                product.stock > 0
                                    ? `${product.stock} available`
                                    : "Out of stock"
                            }
                        </p>

                    </div>


                    <div class="product-details-actions">

                        <button
                            type="button"
                            class="wishlist-button ${
                                wished ? "active" : ""
                            }"
                            data-product-details-wishlist="${escapeHTML(product.id)}"
                            aria-label="${
                                wished
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }"
                        >

                            <span
                                class="wishlist-icon"
                                aria-hidden="true"
                            >
                                ${wished ? "♥" : "♡"}
                            </span>

                            <span>
                                Wishlist
                            </span>

                        </button>


                        <button
                            type="button"
                            class="add-to-cart-button"
                            data-product-details-cart="${escapeHTML(product.id)}"
                            ${
                                product.stock <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >
                            ${
                                product.stock > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"
                            }
                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "product-details";


    const closeButton =
        $(
            ".modal-close",
            modal
        );


    if (closeButton) {

        setTimeout(
            () => closeButton.focus(),
            50
        );

    }

}


/* ============================================================
   CLOSE PRODUCT DETAILS
   ============================================================ */

function closeProductDetails() {

    const modal =
        getElement(
            "productDetailsModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "product-details"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   PRODUCT DETAILS EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const productCard =
            event.target.closest(
                "[data-product-id]"
            );


        /*
           Do not open product details when the
           user clicked an action button inside
           the card.
        */

        const clickedAction =
            event.target.closest(
                "button, a, input"
            );


        if (
            productCard &&
            !clickedAction
        ) {

            const productId =
                productCard.dataset.productId;


            if (productId) {

                openProductDetails(
                    productId
                );

                return;

            }

        }


        const detailsWishlist =
            event.target.closest(
                "[data-product-details-wishlist]"
            );


        if (detailsWishlist) {

            event.preventDefault();


            const productId =
                detailsWishlist.dataset
                    .productDetailsWishlist;


            toggleWishlist(
                productId
            );


            /*
               Refresh the modal so its
               heart state stays synchronized.
            */

            openProductDetails(
                productId
            );


            return;

        }


        const detailsCart =
            event.target.closest(
                "[data-product-details-cart]"
            );


        if (detailsCart) {

            event.preventDefault();


            const productId =
                detailsCart.dataset
                    .productDetailsCart;


            const added =
                addToCart(
                    productId
                );


            if (added) {

                closeProductDetails();

            }


            return;

        }


        const closeDetails =
            event.target.closest(
                "[data-product-modal-close]"
            );


        if (closeDetails) {

            closeProductDetails();

        }

    }
);


/* ============================================================
   PRODUCT DETAILS — ESC KEY
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "product-details"
        ) {

            closeProductDetails();

        }

    }
);


/* ============================================================
   PRODUCT CARD QUICK ACTIONS
   ============================================================ */

function initializeProductCardInteractions() {

    /*
       Existing static product cards can use
       data-product-id and data-wishlist-product
       without needing duplicate inline JS.
    */

    $$(
        "[data-product-id]"
    ).forEach(
        card => {

            const productId =
                card.dataset.productId;


            if (!productId) {
                return;
            }


            card.setAttribute(
                "tabindex",
                "0"
            );


            card.setAttribute(
                "role",
                "article"
            );

        }
    );

}


/* ============================================================
   KEYBOARD PRODUCT CARD ACCESS
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {

            return;

        }


        const card =
            event.target.closest(
                "[data-product-id]"
            );


        if (!card) {
            return;
        }


        const interactive =
            event.target.closest(
                "button, a, input, select, textarea"
            );


        if (interactive) {
            return;
        }


        event.preventDefault();


        openProductDetails(
            card.dataset.productId
        );

    }
);


/* ============================================================
   RECENTLY VIEWED SECTION NAVIGATION
   ============================================================ */

function scrollToRecentlyViewed() {

    const target =
        getElement(
            "recently-viewed"
        );


    if (target) {

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return true;

    }


    showToast(
        "Recently viewed section is not available yet.",
        "info"
    );


    return false;

}


/* ============================================================
   INITIAL PRODUCT INTERACTIONS
   ============================================================ */

initializeProductCardInteractions();

renderRecentlyViewed();

/* ============================================================
   MyShop Marketplace
   app.js — PART 4A
   Search + Category Filter + Sorting
   ============================================================ */


/* ============================================================
   APPLY ALL PRODUCT FILTERS
   ============================================================ */

function applyProductFilters() {

    let products =
        [...MyShop.products];


    /* --------------------------------------------------------
       Category
       -------------------------------------------------------- */

    const category =
        normalizeText(
            MyShop.currentCategory
        );


    if (
        category &&
        category !== "all"
    ) {

        products =
            products.filter(
                product =>
                    normalizeText(
                        product.category
                    ) === category
            );

    }


    /* --------------------------------------------------------
       Search
       -------------------------------------------------------- */

    const query =
        normalizeText(
            MyShop.currentSearch
        );


    if (query) {

        products =
            products.filter(
                product => {

                    const searchableText =
                        [
                            product.name,
                            product.category,
                            product.seller,
                            ...product.tags
                        ]
                        .join(" ")
                        .toLowerCase();


                    return searchableText.includes(
                        query
                    );

                }
            );

    }


    /* --------------------------------------------------------
       Sorting
       -------------------------------------------------------- */

    switch (
        MyShop.currentSort
    ) {

        case "price-low":

            products.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            products.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;


        case "rating":

            products.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;


        case "popular":

            products.sort(
                (a, b) =>
                    b.reviews - a.reviews
            );

            break;


        case "newest":

            products.sort(
                (a, b) =>
                    Number(
                        b.isNewArrival
                    ) -
                    Number(
                        a.isNewArrival
                    )
            );

            break;


        default:

            break;

    }


    MyShop.filteredProducts =
        products;


    MyShop.currentPage =
        1;


    return products;

}


/* ============================================================
   SET SEARCH QUERY
   ============================================================ */

function setSearchQuery(query) {

    MyShop.currentSearch =
        normalizeText(
            query
        );


    applyProductFilters();


    renderProductDiscovery();


    updateSearchUI();


    return MyShop.filteredProducts;

}


/* ============================================================
   SET CATEGORY
   ============================================================ */

function setProductCategory(
    category
) {

    MyShop.currentCategory =
        normalizeText(
            category
        ) || "all";


    applyProductFilters();


    renderProductDiscovery();


    updateCategoryUI();


    return MyShop.filteredProducts;

}


/* ============================================================
   SET SORT
   ============================================================ */

function setProductSort(
    sortType
) {

    MyShop.currentSort =
        normalizeText(
            sortType
        ) || "default";


    applyProductFilters();


    renderProductDiscovery();


    updateSortUI();


    return MyShop.filteredProducts;

}


/* ============================================================
   SEARCH INPUT UI
   ============================================================ */

function updateSearchUI() {

    const searchInputs =
        $$(
            'input[type="search"], input[data-product-search]'
        );


    searchInputs.forEach(
        input => {

            if (
                document.activeElement !==
                input
            ) {

                input.value =
                    MyShop.currentSearch;

            }

        }
    );

}


/* ============================================================
   CATEGORY BUTTON UI
   ============================================================ */

function updateCategoryUI() {

    const buttons =
        $$(
            "[data-category]"
        );


    buttons.forEach(
        button => {

            const category =
                normalizeText(
                    button.dataset.category
                );


            const active =
                category ===
                normalizeText(
                    MyShop.currentCategory
                );


            button.classList.toggle(
                "active",
                active
            );


            button.setAttribute(
                "aria-pressed",
                String(active)
            );

        }
    );

}


/* ============================================================
   SORT UI
   ============================================================ */

function updateSortUI() {

    const selects =
        $$(
            "[data-product-sort]"
        );


    selects.forEach(
        select => {

            select.value =
                MyShop.currentSort;

        }
    );


    const buttons =
        $$(
            "[data-sort]"
        );


    buttons.forEach(
        button => {

            const sort =
                normalizeText(
                    button.dataset.sort
                );


            const active =
                sort ===
                normalizeText(
                    MyShop.currentSort
                );


            button.classList.toggle(
                "active",
                active
            );


            button.setAttribute(
                "aria-pressed",
                String(active)
            );

        }
    );

}


/* ============================================================
   SEARCH FORM SUBMISSION
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-search-form]"
            );


        if (!form) {
            return;
        }


        event.preventDefault();


        const input =
            $(
                'input[type="search"], input[data-product-search]',
                form
            );


        if (!input) {
            return;
        }


        setSearchQuery(
            input.value
        );


        const discovery =
            getElement(
                "product-discovery"
            );


        if (discovery) {

            discovery.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);


/* ============================================================
   SEARCH INPUT — LIVE FILTER
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const input =
            event.target.closest(
                'input[data-product-search], input[type="search"]'
            );


        if (!input) {
            return;
        }


        /*
           Avoid changing the catalogue on every
           keystroke when the input belongs to a
           non-product form.
        */

        if (
            input.closest(
                "[data-search-form]"
            ) ||
            input.dataset.productSearch !==
                undefined
        ) {

            MyShop.currentSearch =
                normalizeText(
                    input.value
                );


            applyProductFilters();


            renderProductDiscovery();

        }

    }
);


/* ============================================================
   CATEGORY CLICK EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const categoryButton =
            event.target.closest(
                "[data-category]"
            );


        if (!categoryButton) {
            return;
        }


        /*
           Ignore product cards or unrelated
           elements that happen to contain the
           same attribute.
        */

        if (
            categoryButton.matches(
                "button, a"
            )
        ) {

            event.preventDefault();

        }


        setProductCategory(
            categoryButton.dataset.category
        );

    }
);


/* ============================================================
   SORT SELECT EVENTS
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const select =
            event.target.closest(
                "[data-product-sort]"
            );


        if (!select) {
            return;
        }


        setProductSort(
            select.value
        );

    }
);


/* ============================================================
   SORT BUTTON EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-sort]"
            );


        if (!button) {
            return;
        }


        event.preventDefault();


        setProductSort(
            button.dataset.sort
        );

    }
);


/* ============================================================
   CLEAR SEARCH
   ============================================================ */

function clearProductSearch() {

    MyShop.currentSearch =
        "";


    applyProductFilters();


    updateSearchUI();


    renderProductDiscovery();

}


/* ============================================================
   SEARCH EMPTY STATE MESSAGE
   ============================================================ */

function getProductSearchMessage() {

    if (
        MyShop.currentSearch
    ) {

        return `
            No products found for
            <strong>
                "${escapeHTML(
                    MyShop.currentSearch
                )}"
            </strong>.
        `;

    }


    if (
        MyShop.currentCategory &&
        MyShop.currentCategory !==
            "all"
    ) {

        return `
            No products are currently
            available in this category.
        `;

    }


    return `
        No products are currently available.
    `;

}


/* ============================================================
   RESET ALL PRODUCT FILTERS
   ============================================================ */

function resetProductFilters() {

    MyShop.currentSearch =
        "";

    MyShop.currentCategory =
        "all";

    MyShop.currentSort =
        "default";


    applyProductFilters();


    updateSearchUI();

    updateCategoryUI();

    updateSortUI();


    renderProductDiscovery();

}


/* ============================================================
   INITIAL FILTER STATE
   ============================================================ */

applyProductFilters();

updateSearchUI();

updateCategoryUI();

updateSortUI();

/* ============================================================
   MyShop Marketplace
   app.js — PART 4B
   Product Rendering + Pagination
   ============================================================ */


/* ============================================================
   PRODUCT CARD HTML
   ============================================================ */

function createProductCardHTML(product) {

    if (!product) {
        return "";
    }


    const discount =
        getDiscountPercentage(product);


    const wished =
        isInWishlist(product.id);


    const outOfStock =
        product.stock <= 0;


    return `

        <article
            class="product-card"
            data-product-id="${escapeHTML(product.id)}"
            tabindex="0"
        >

            <div class="product-card-image">

                ${
                    product.badge
                        ? `
                            <span class="product-badge">
                                ${escapeHTML(product.badge)}
                            </span>
                          `
                        : ""
                }


                ${
                    discount > 0
                        ? `
                            <span class="product-discount-badge">
                                ${discount}% OFF
                            </span>
                          `
                        : ""
                }


                <button
                    type="button"
                    class="wishlist-button ${
                        wished ? "active" : ""
                    }"
                    data-wishlist-product="${escapeHTML(product.id)}"
                    aria-label="${
                        wished
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }"
                    aria-pressed="${wished}"
                >

                    <span
                        class="wishlist-icon"
                        aria-hidden="true"
                    >
                        ${wished ? "♥" : "♡"}
                    </span>

                </button>


                <div
                    class="product-emoji"
                    aria-hidden="true"
                >
                    ${product.emoji}
                </div>

            </div>


            <div class="product-card-body">

                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>


                <h3 class="product-title">
                    ${escapeHTML(product.name)}
                </h3>


                <div class="product-rating">

                    <span
                        aria-label="Rating ${
                            product.rating
                        } out of 5"
                    >
                        ${getRatingHTML(product.rating)}
                    </span>

                    <small>
                        (${product.reviews})
                    </small>

                </div>


                <div class="product-price-row">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>


                    ${
                        product.oldPrice >
                        product.price
                            ? `
                                <del class="product-old-price">
                                    ${formatPrice(product.oldPrice)}
                                </del>
                              `
                            : ""
                    }

                </div>


                ${
                    product.stock > 0 &&
                    product.stock <= 5
                        ? `
                            <p class="low-stock">
                                Only ${product.stock}
                                left
                            </p>
                          `
                        : ""
                }


                ${
                    outOfStock
                        ? `
                            <p class="out-of-stock">
                                Out of stock
                            </p>
                          `
                        : ""
                }


                <div class="product-card-actions">

                    <button
                        type="button"
                        class="add-to-cart-button"
                        data-product-add-cart="${escapeHTML(product.id)}"
                        ${
                            outOfStock
                                ? "disabled"
                                : ""
                        }
                    >

                        ${
                            outOfStock
                                ? "Out of Stock"
                                : "Add to Cart"
                        }

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* ============================================================
   PAGINATION HELPERS
   ============================================================ */

function getPaginatedProducts() {

    const perPage =
        Math.max(
            1,
            Number(
                MyShop.productsPerPage
            ) || 12
        );


    const total =
        MyShop.filteredProducts.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                total / perPage
            )
        );


    MyShop.totalPages =
        totalPages;


    if (
        MyShop.currentPage >
        totalPages
    ) {

        MyShop.currentPage =
            totalPages;

    }


    if (
        MyShop.currentPage < 1
    ) {

        MyShop.currentPage =
            1;

    }


    const start =
        (
            MyShop.currentPage - 1
        ) * perPage;


    const end =
        start + perPage;


    return MyShop.filteredProducts.slice(
        start,
        end
    );

}


/* ============================================================
   PAGINATION HTML
   ============================================================ */

function createPaginationHTML() {

    const totalPages =
        MyShop.totalPages;


    const currentPage =
        MyShop.currentPage;


    if (
        totalPages <= 1
    ) {

        return "";

    }


    let html = `

        <nav
            class="pagination"
            aria-label="Product pagination"
        >

            <button
                type="button"
                class="pagination-button"
                data-page="${currentPage - 1}"
                ${
                    currentPage <= 1
                        ? "disabled"
                        : ""
                }
            >
                Previous
            </button>

    `;


    const maxVisible =
        5;


    let startPage =
        Math.max(
            1,
            currentPage -
                Math.floor(
                    maxVisible / 2
                )
        );


    let endPage =
        Math.min(
            totalPages,
            startPage +
                maxVisible -
                1
        );


    if (
        endPage -
        startPage +
        1 <
        maxVisible
    ) {

        startPage =
            Math.max(
                1,
                endPage -
                    maxVisible +
                    1
            );

    }


    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {

        html += `

            <button
                type="button"
                class="pagination-button ${
                    page === currentPage
                        ? "active"
                        : ""
                }"
                data-page="${page}"
                ${
                    page === currentPage
                        ? 'aria-current="page"'
                        : ""
                }
            >
                ${page}
            </button>

        `;

    }


    html += `

            <button
                type="button"
                class="pagination-button"
                data-page="${currentPage + 1}"
                ${
                    currentPage >= totalPages
                        ? "disabled"
                        : ""
                }
            >
                Next
            </button>

        </nav>

    `;


    return html;

}


/* ============================================================
   EMPTY PRODUCT STATE
   ============================================================ */

function createProductEmptyStateHTML() {

    return `

        <div
            class="product-empty-state"
            role="status"
        >

            <div
                class="product-empty-icon"
                aria-hidden="true"
            >
                🔎
            </div>


            <h3>
                No products found
            </h3>


            <p>
                ${getProductSearchMessage()}
            </p>


            <button
                type="button"
                class="secondary-button"
                data-reset-product-filters
            >
                Clear Filters
            </button>

        </div>

    `;

}


/* ============================================================
   PRODUCT RESULT COUNT
   ============================================================ */

function updateProductResultCount() {

    const elements =
        $$(
            "[data-product-result-count]"
        );


    const count =
        MyShop.filteredProducts.length;


    elements.forEach(
        element => {

            element.textContent =
                count.toLocaleString(
                    "en-BD"
                );

        }
    );

}


/* ============================================================
   PRODUCT LIST RENDER
   ============================================================ */

function renderProductDiscovery() {

    const section =
        getElement(
            "product-discovery"
        );


    if (!section) {
        return;
    }


    const grid =
        $(
            "[data-product-list]",
            section
        ) ||
        $(
            ".product-grid",
            section
        );


    if (!grid) {
        return;
    }


    updateProductResultCount();


    const products =
        getPaginatedProducts();


    if (
        products.length === 0
    ) {

        grid.innerHTML =
            createProductEmptyStateHTML();


    } else {

        grid.innerHTML =
            products
                .map(
                    createProductCardHTML
                )
                .join("");

    }


    const paginationContainer =
        $(
            "[data-pagination]",
            section
        );


    if (paginationContainer) {

        paginationContainer.innerHTML =
            createPaginationHTML();

    }


    updateWishlistButtons();

}


/* ============================================================
   PRODUCT PAGE CHANGE
   ============================================================ */

function goToProductPage(
    page
) {

    const requestedPage =
        Math.floor(
            Number(page)
        );


    if (
        !Number.isFinite(
            requestedPage
        )
    ) {

        return;

    }


    const totalPages =
        Math.max(
            1,
            MyShop.totalPages
        );


    MyShop.currentPage =
        Math.min(
            Math.max(
                requestedPage,
                1
            ),
            totalPages
        );


    renderProductDiscovery();


    const section =
        getElement(
            "product-discovery"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* ============================================================
   PAGINATION EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const pageButton =
            event.target.closest(
                "[data-page]"
            );


        if (pageButton) {

            event.preventDefault();


            if (
                pageButton.disabled
            ) {

                return;

            }


            goToProductPage(
                pageButton.dataset.page
            );


            return;

        }


        const resetButton =
            event.target.closest(
                "[data-reset-product-filters]"
            );


        if (resetButton) {

            event.preventDefault();


            resetProductFilters();


            return;

        }

    }
);


/* ============================================================
   PRODUCTS PER PAGE
   ============================================================ */

function setProductsPerPage(
    value
) {

    const number =
        Math.floor(
            Number(value)
        );


    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {

        return;

    }


    MyShop.productsPerPage =
        number;


    MyShop.currentPage =
        1;


    renderProductDiscovery();

}


/* ============================================================
   PRODUCTS-PER-PAGE SELECT
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const select =
            event.target.closest(
                "[data-products-per-page]"
            );


        if (!select) {
            return;
        }


        setProductsPerPage(
            select.value
        );

    }
);


/* ============================================================
   INITIAL PRODUCT RENDER
   ============================================================ */

applyProductFilters();

renderProductDiscovery();

updateProductResultCount();

/* ============================================================
   MyShop Marketplace
   app.js — PART 5A
   Home Product Sections
   ============================================================ */


/* ============================================================
   GENERIC PRODUCT LIST RENDERER
   ============================================================ */

function renderProductListInto(
    container,
    products,
    emptyMessage = "No products available."
) {

    if (!container) {
        return;
    }


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        container.innerHTML = `

            <div
                class="product-list-empty"
                role="status"
            >
                ${escapeHTML(emptyMessage)}
            </div>

        `;

        return;

    }


    container.innerHTML =
        products
            .map(
                createProductCardHTML
            )
            .join("");

}


/* ============================================================
   FLASH SALE SECTION
   ============================================================ */

function renderFlashSaleSection() {

    const section =
        getElement(
            "flash-sale"
        );


    if (!section) {
        return;
    }


    const container =
        $(
            "[data-product-list]",
            section
        ) ||
        $(
            ".product-grid",
            section
        );


    if (!container) {
        return;
    }


    const products =
        getFlashSaleProducts();


    renderProductListInto(
        container,
        products,
        "No flash sale products available."
    );


    updateWishlistButtons();

}


/* ============================================================
   BEST SELLING SECTION
   ============================================================ */

function renderBestSellingSection() {

    const section =
        getElement(
            "best-selling"
        );


    if (!section) {
        return;
    }


    const container =
        $(
            "[data-product-list]",
            section
        ) ||
        $(
            ".product-grid",
            section
        );


    if (!container) {
        return;
    }


    const products =
        getBestSellingProducts();


    renderProductListInto(
        container,
        products,
        "Best selling products will appear here."
    );


    updateWishlistButtons();

}


/* ============================================================
   NEW ARRIVALS SECTION
   ============================================================ */

function renderNewArrivalsSection() {

    const section =
        getElement(
            "new-arrivals"
        );


    if (!section) {
        return;
    }


    const container =
        $(
            "[data-product-list]",
            section
        ) ||
        $(
            ".product-grid",
            section
        );


    if (!container) {
        return;
    }


    const products =
        getNewArrivalProducts();


    renderProductListInto(
        container,
        products,
        "New arrivals will appear here."
    );


    updateWishlistButtons();

}


/* ============================================================
   RECOMMENDED SECTION
   ============================================================ */

function renderRecommendedSection(
    filter = "all"
) {

    const section =
        getElement(
            "recommended"
        );


    if (!section) {
        return;
    }


    const container =
        $(
            "[data-product-list]",
            section
        ) ||
        $(
            ".product-grid",
            section
        );


    if (!container) {
        return;
    }


    const products =
        getRecommendedProducts(
            filter
        );


    renderProductListInto(
        container,
        products,
        "Recommended products will appear here."
    );


    updateWishlistButtons();

}


/* ============================================================
   GENERIC SECTION DISCOVERY
   ============================================================ */

function renderHomeProductSections() {

    renderFlashSaleSection();

    renderBestSellingSection();

    renderNewArrivalsSection();

    renderRecommendedSection();

    renderRecentlyViewed();

}


/* ============================================================
   HOME SECTION TABS
   ============================================================ */

function updateHomeSectionTabs(
    section
) {

    if (!section) {
        return;
    }


    const tabs =
        $$(
            "[data-product-filter]",
            section
        );


    tabs.forEach(
        tab => {

            const filter =
                normalizeText(
                    tab.dataset.productFilter
                );


            const active =
                filter ===
                normalizeText(
                    section.dataset.activeFilter ||
                    "all"
                );


            tab.classList.toggle(
                "active",
                active
            );


            tab.setAttribute(
                "aria-pressed",
                String(active)
            );

        }
    );

}


/* ============================================================
   RECOMMENDED FILTER
   ============================================================ */

function setRecommendedFilter(
    filter
) {

    const normalized =
        normalizeText(
            filter
        ) || "all";


    const section =
        getElement(
            "recommended"
        );


    if (section) {

        section.dataset.activeFilter =
            normalized;

    }


    renderRecommendedSection(
        normalized
    );


    updateHomeSectionTabs(
        section
    );

}


/* ============================================================
   HOME PRODUCT FILTER EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const filterButton =
            event.target.closest(
                "[data-product-filter]"
            );


        if (!filterButton) {
            return;
        }


        event.preventDefault();


        setRecommendedFilter(
            filterButton.dataset.productFilter
        );

    }
);


/* ============================================================
   HOME SECTION SCROLL HELPERS
   ============================================================ */

function scrollToProductSection(
    sectionId
) {

    if (!sectionId) {
        return false;
    }


    const section =
        getElement(
            sectionId
        );


    if (!section) {
        return false;
    }


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    return true;

}


/* ============================================================
   QUICK NAVIGATION EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const navigation =
            event.target.closest(
                "[data-scroll-section]"
            );


        if (!navigation) {
            return;
        }


        event.preventDefault();


        scrollToProductSection(
            navigation.dataset.scrollSection
        );

    }
);


/* ============================================================
   PRODUCT SECTION REFRESH
   ============================================================ */

function refreshHomeProductSections() {

    /*
       All home sections use the same
       MyShop.products catalogue, so any
       wishlist or product state change
       can refresh them without creating
       another product data source.
    */

    renderFlashSaleSection();

    renderBestSellingSection();

    renderNewArrivalsSection();

    const recommended =
        getElement(
            "recommended"
        );


    const activeFilter =
        recommended?.dataset
            .activeFilter ||
        "all";


    renderRecommendedSection(
        activeFilter
    );

    renderRecentlyViewed();

}


/* ============================================================
   INITIAL HOME SECTION RENDER
   ============================================================ */

renderHomeProductSections();

/* ============================================================
   MyShop Marketplace
   app.js — PART 5B
   Home Navigation + Category Sections
   ============================================================ */
/* ============================================================
   CATEGORY PRODUCT SECTION
   ============================================================ */

function renderCategoryProducts(
    category,
    container
) {

    if (!container) {
        return;
    }


    const normalizedCategory =
        normalizeText(
            category
        );


    let products =
        [...MyShop.products];


    if (
        normalizedCategory &&
        normalizedCategory !== "all"
    ) {

        products =
            products.filter(
                product =>
                    normalizeText(
                        product.category
                    ) === normalizedCategory
            );

    }


    renderProductListInto(
        container,
        products,
        "No products available in this category."
    );


    updateWishlistButtons();

}


/* ============================================================
   CATEGORY SECTION RENDER
   ============================================================ */

function renderCategorySection(
    category
) {

    const section =
        getElement(
            "category-products"
        );


    if (!section) {
        return;
    }


    const container =
        $(
            "[data-product-list]",
            section
        ) ||
        $(
            ".product-grid",
            section
        );


    if (!container) {
        return;
    }


    renderCategoryProducts(
        category,
        container
    );


    section.dataset.activeCategory =
        normalizeText(
            category
        ) || "all";


    updateCategorySectionTabs(
        section
    );

}


/* ============================================================
   CATEGORY SECTION TABS
   ============================================================ */

function updateCategorySectionTabs(
    section
) {

    if (!section) {
        return;
    }


    const activeCategory =
        normalizeText(
            section.dataset.activeCategory ||
            "all"
        );


    $$(
        "[data-home-category]",
        section
    ).forEach(
        button => {

            const category =
                normalizeText(
                    button.dataset.homeCategory
                );


            const active =
                category ===
                activeCategory;


            button.classList.toggle(
                "active",
                active
            );


            button.setAttribute(
                "aria-pressed",
                String(active)
            );

        }
    );

}


/* ============================================================
   HOME CATEGORY EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-home-category]"
            );


        if (!button) {
            return;
        }


        event.preventDefault();


        const category =
            button.dataset.homeCategory;


        renderCategorySection(
            category
        );


        /*
           Keep the global catalogue filter
           synchronized with the selected
           home category.
        */

        MyShop.currentCategory =
            normalizeText(
                category
            ) || "all";


        MyShop.currentSearch =
            "";


        MyShop.currentPage =
            1;


        updateSearchUI();

        updateCategoryUI();

    }
);


/* ============================================================
   HERO SEARCH CTA
   ============================================================ */

function focusProductSearch() {

    const input =
        $(
            'input[data-product-search], input[type="search"]'
        );


    if (!input) {

        scrollToProductSection(
            "product-discovery"
        );

        return false;

    }


    input.focus();


    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    return true;

}


/* ============================================================
   HERO CTA EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const searchCTA =
            event.target.closest(
                "[data-focus-search]"
            );


        if (!searchCTA) {
            return;
        }


        event.preventDefault();


        focusProductSearch();

    }
);


/* ============================================================
   HERO CATEGORY CTA
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const categoryCTA =
            event.target.closest(
                "[data-hero-category]"
            );


        if (!categoryCTA) {
            return;
        }


        event.preventDefault();


        const category =
            categoryCTA.dataset.heroCategory;


        if (category) {

            setProductCategory(
                category
            );

        }


        scrollToProductSection(
            "product-discovery"
        );

    }
);


/* ============================================================
   VIEW ALL PRODUCTS
   ============================================================ */

function viewAllProducts() {

    resetProductFilters();


    scrollToProductSection(
        "product-discovery"
    );

}


/* ============================================================
   VIEW ALL PRODUCTS EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const viewAll =
            event.target.closest(
                "[data-view-all-products]"
            );


        if (!viewAll) {
            return;
        }


        event.preventDefault();


        viewAllProducts();

    }
);


/* ============================================================
   FLASH SALE CTA
   ============================================================ */

function viewFlashSale() {

    const products =
        getFlashSaleProducts();


    MyShop.filteredProducts =
        [...products];


    MyShop.currentSearch =
        "";

    MyShop.currentCategory =
        "all";

    MyShop.currentSort =
        "default";

    MyShop.currentPage =
        1;


    updateSearchUI();

    updateCategoryUI();

    updateSortUI();


    renderProductDiscovery();


    scrollToProductSection(
        "product-discovery"
    );

}


/* ============================================================
   FLASH SALE CTA EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const flashSaleCTA =
            event.target.closest(
                "[data-view-flash-sale]"
            );


        if (!flashSaleCTA) {
            return;
        }


        event.preventDefault();


        viewFlashSale();

    }
);


/* ============================================================
   HOME SECTION "SEE MORE"
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const sectionLink =
            event.target.closest(
                "[data-section-filter]"
            );


        if (!sectionLink) {
            return;
        }


        event.preventDefault();


        const filter =
            sectionLink.dataset
                .sectionFilter;


        if (
            filter ===
            "flash-sale"
        ) {

            viewFlashSale();

            return;

        }


        if (
            filter ===
            "best-selling"
        ) {

            MyShop.filteredProducts =
                getBestSellingProducts();

        }


        else if (
            filter ===
            "new-arrivals"
        ) {

            MyShop.filteredProducts =
                getNewArrivalProducts();

        }


        else {

            MyShop.filteredProducts =
                getRecommendedProducts(
                    filter || "all"
                );

        }


        MyShop.currentPage =
            1;


        renderProductDiscovery();


        scrollToProductSection(
            "product-discovery"
        );

    }
);


/* ============================================================
   CATEGORY QUICK LINKS
   ============================================================ */

function initializeCategoryQuickLinks() {

    $$(
        "[data-category-link]"
    ).forEach(
        link => {

            const category =
                link.dataset.categoryLink;


            if (!category) {
                return;
            }


            link.setAttribute(
                "data-category",
                category
            );

        }
    );

}


/* ============================================================
   ACTIVE HOME SECTION STATE
   ============================================================ */

function initializeHomeSectionState() {

    const recommended =
        getElement(
            "recommended"
        );


    if (recommended) {

        if (
            !recommended.dataset.activeFilter
        ) {

            recommended.dataset.activeFilter =
                "all";

        }


        updateHomeSectionTabs(
            recommended
        );

    }


    const categorySection =
        getElement(
            "category-products"
        );


    if (categorySection) {

        if (
            !categorySection.dataset.activeCategory
        ) {

            categorySection.dataset.activeCategory =
                "all";

        }


        updateCategorySectionTabs(
            categorySection
        );

    }

}


/* ============================================================
   HOME NAVIGATION INITIALIZATION
   ============================================================ */

initializeCategoryQuickLinks();

initializeHomeSectionState();

/* ============================================================
   MyShop Marketplace
   app.js — PART 6A
   Authentication State + Login/Register
   ============================================================ */


/* ============================================================
   AUTH STATE
   ============================================================ */

function isUserLoggedIn() {

    return Boolean(
        MyShop.user &&
        MyShop.user.loggedIn
    );

}


/* ============================================================
   GET CURRENT USER
   ============================================================ */

function getCurrentUser() {

    return MyShop.user || null;

}


/* ============================================================
   NORMALIZE USER
   ============================================================ */

function normalizeUser(user) {

    if (!user) {
        return null;
    }


    return {

        id:
            String(
                user.id ||
                generateId("user")
            ),

        name:
            String(
                user.name ||
                "MyShop Customer"
            ).trim(),

        email:
            String(
                user.email ||
                ""
            ).trim().toLowerCase(),

        phone:
            String(
                user.phone ||
                ""
            ).trim(),

        loggedIn:
            Boolean(
                user.loggedIn
            ),

        createdAt:
            user.createdAt ||
            new Date().toISOString()

    };

}


/* ============================================================
   AUTH VALIDATION
   ============================================================ */

function validateEmail(
    email
) {

    const value =
        String(
            email || ""
        ).trim();


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(value);

}


function validatePassword(
    password
) {

    const value =
        String(
            password || ""
        );


    return value.length >= 6;

}


function validateName(
    name
) {

    return String(
        name || ""
    ).trim().length >= 2;

}


/* ============================================================
   LOGIN VALIDATION
   ============================================================ */

function validateLoginData(
    data
) {

    const errors = [];


    if (
        !validateEmail(
            data.email
        )
    ) {

        errors.push(
            "Please enter a valid email address."
        );

    }


    if (
        !validatePassword(
            data.password
        )
    ) {

        errors.push(
            "Password must be at least 6 characters."
        );

    }


    return errors;

}


/* ============================================================
   REGISTER VALIDATION
   ============================================================ */

function validateRegisterData(
    data
) {

    const errors = [];


    if (
        !validateName(
            data.name
        )
    ) {

        errors.push(
            "Please enter your full name."
        );

    }


    if (
        !validateEmail(
            data.email
        )
    ) {

        errors.push(
            "Please enter a valid email address."
        );

    }


    if (
        !validatePassword(
            data.password
        )
    ) {

        errors.push(
            "Password must be at least 6 characters."
        );

    }


    if (
        data.password !==
        data.confirmPassword
    ) {

        errors.push(
            "Passwords do not match."
        );

    }


    return errors;

}


/* ============================================================
   AUTH ERROR DISPLAY
   ============================================================ */

function showAuthError(
    message,
    form = null
) {

    const target =
        form
            ? $(
                "[data-auth-error]",
                form
            )
            : getElement(
                "authError"
            );


    if (!target) {

        showToast(
            message,
            "error"
        );

        return;

    }


    target.textContent =
        message;


    target.hidden =
        false;


    target.setAttribute(
        "role",
        "alert"
    );

}


/* ============================================================
   CLEAR AUTH ERROR
   ============================================================ */

function clearAuthError(
    form = null
) {

    const target =
        form
            ? $(
                "[data-auth-error]",
                form
            )
            : getElement(
                "authError"
            );


    if (!target) {
        return;
    }


    target.textContent =
        "";


    target.hidden =
        true;

}


/* ============================================================
   LOGIN USER
   ============================================================ */

function loginUser(
    email,
    password
) {

    const data = {

        email:
            String(
                email || ""
            ).trim().toLowerCase(),

        password:
            String(
                password || ""
            )

    };


    const errors =
        validateLoginData(
            data
        );


    if (
        errors.length > 0
    ) {

        showAuthError(
            errors[0]
        );

        return false;

    }


    /*
       This frontend layer intentionally does not
       pretend to authenticate against a real server.

       If a backend/API is connected later, this
       function becomes the single authentication
       entry point.
    */

    const savedUser =
        loadFromStorage(
            STORAGE_KEYS.user,
            null
        );


    if (
        savedUser &&
        savedUser.email ===
            data.email
    ) {

        MyShop.user =
            normalizeUser({
                ...savedUser,
                loggedIn: true
            });

    } else {

        /*
           Demo/local account fallback.
        */

        MyShop.user =
            normalizeUser({

                id:
                    generateId("user"),

                name:
                    data.email
                        .split("@")[0],

                email:
                    data.email,

                phone:
                    "",

                loggedIn:
                    true

            });

    }


    saveUser();


    updateAuthUI();

    closeAuthModal();


    showToast(
        `Welcome back, ${MyShop.user.name}!`,
        "success"
    );


    return true;

}


/* ============================================================
   REGISTER USER
   ============================================================ */

function registerUser(
    name,
    email,
    password,
    confirmPassword
) {

    const data = {

        name:
            String(
                name || ""
            ).trim(),

        email:
            String(
                email || ""
            ).trim().toLowerCase(),

        password:
            String(
                password || ""
            ),

        confirmPassword:
            String(
                confirmPassword || ""
            )

    };


    const errors =
        validateRegisterData(
            data
        );


    if (
        errors.length > 0
    ) {

        showAuthError(
            errors[0]
        );

        return false;

    }


    const existingUser =
        loadFromStorage(
            STORAGE_KEYS.user,
            null
        );


    /*
       Keep the local frontend behaviour predictable.
       A real backend can later replace this check.
    */

    if (
        existingUser &&
        existingUser.email ===
            data.email
    ) {

        showAuthError(
            "An account with this email already exists."
        );

        return false;

    }


    MyShop.user =
        normalizeUser({

            id:
                generateId("user"),

            name:
                data.name,

            email:
                data.email,

            phone:
                "",

            loggedIn:
                true,

            createdAt:
                new Date().toISOString()

        });


    saveUser();


    updateAuthUI();

    closeAuthModal();


    showToast(
        `Welcome to MyShop, ${MyShop.user.name}!`,
        "success"
    );


    return true;

}


/* ============================================================
   LOGOUT USER
   ============================================================ */

function logoutUser() {

    if (
        !isUserLoggedIn()
    ) {

        return false;

    }


    const previousName =
        MyShop.user.name;


    MyShop.user =
        null;


    saveUser();


    updateAuthUI();


    showToast(
        `Goodbye, ${previousName}!`,
        "info"
    );


    return true;

}


/* ============================================================
   AUTH MODAL OPEN
   ============================================================ */

function openAuthModal(
    mode = "login"
) {

    let modal =
        getElement(
            "authModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "authModal";

        modal.className =
            "modal auth-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const loginMode =
        mode === "login";


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-auth-close
        ></div>


        <div class="modal-content auth-modal-content">

            <div class="modal-header">

                <div>

                    <p class="section-eyebrow">
                        MYSHOP ACCOUNT
                    </p>

                    <h2>
                        ${
                            loginMode
                                ? "Welcome Back"
                                : "Create Account"
                        }
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    data-auth-close
                    aria-label="Close"
                >
                    ×
                </button>

            </div>


            <div
                class="auth-tabs"
                role="tablist"
            >

                <button
                    type="button"
                    class="${
                        loginMode
                            ? "active"
                            : ""
                    }"
                    data-auth-mode="login"
                >
                    Login
                </button>


                <button
                    type="button"
                    class="${
                        !loginMode
                            ? "active"
                            : ""
                    }"
                    data-auth-mode="register"
                >
                    Register
                </button>

            </div>


            <form
                class="auth-form"
                data-auth-form
                data-auth-form-mode="${
                    loginMode
                        ? "login"
                        : "register"
                }"
            >

                <div
                    class="auth-error"
                    data-auth-error
                    hidden
                ></div>


                ${
                    !loginMode
                        ? `
                            <label>
                                Full Name

                                <input
                                    type="text"
                                    name="name"
                                    autocomplete="name"
                                    required
                                >
                            </label>
                          `
                        : ""
                }


                <label>
                    Email

                    <input
                        type="email"
                        name="email"
                        autocomplete="email"
                        required
                    >
                </label>


                <label>
                    Password

                    <input
                        type="password"
                        name="password"
                        autocomplete="${
                            loginMode
                                ? "current-password"
                                : "new-password"
                        }"
                        minlength="6"
                        required
                    >
                </label>


                ${
                    !loginMode
                        ? `
                            <label>
                                Confirm Password

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    autocomplete="new-password"
                                    minlength="6"
                                    required
                                >
                            </label>
                          `
                        : ""
                }


                <button
                    type="submit"
                    class="primary-button auth-submit"
                >
                    ${
                        loginMode
                            ? "Login"
                            : "Create Account"
                    }
                </button>

            </form>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "auth";


    const firstInput =
        $(
            "input",
            modal
        );


    if (firstInput) {

        setTimeout(
            () => firstInput.focus(),
            50
        );

    }

}


/* ============================================================
   AUTH MODAL CLOSE
   ============================================================ */

function closeAuthModal() {

    const modal =
        getElement(
            "authModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "auth"
    ) {

        MyShop.activeModal =
            null;

    }

}

/* ============================================================
   MyShop Marketplace
   app.js — PART 6B
   Authentication UI + Events
   ============================================================ */


/* ============================================================
   AUTH UI
   ============================================================ */

function updateAuthUI() {

    const loggedIn =
        isUserLoggedIn();


    const user =
        getCurrentUser();


    /* --------------------------------------------------------
       Logged-in / logged-out elements
       -------------------------------------------------------- */

    $$(
        "[data-auth-logged-in]"
    ).forEach(
        element => {

            element.hidden =
                !loggedIn;

        }
    );


    $$(
        "[data-auth-logged-out]"
    ).forEach(
        element => {

            element.hidden =
                loggedIn;

        }
    );


    /* --------------------------------------------------------
       User name
       -------------------------------------------------------- */

    $$(
        "[data-user-name]"
    ).forEach(
        element => {

            element.textContent =
                user?.name ||
                "MyShop Customer";

        }
    );


    /* --------------------------------------------------------
       User email
       -------------------------------------------------------- */

    $$(
        "[data-user-email]"
    ).forEach(
        element => {

            element.textContent =
                user?.email ||
                "";

        }
    );


    /* --------------------------------------------------------
       Account button
       -------------------------------------------------------- */

    $$(
        "[data-account-button]"
    ).forEach(
        button => {

            button.setAttribute(
                "aria-label",
                loggedIn
                    ? `Account, ${user?.name || "Customer"}`
                    : "Login or create account"
            );

        }
    );


    /* --------------------------------------------------------
       Header account text
       -------------------------------------------------------- */

    $$(
        "[data-account-label]"
    ).forEach(
        element => {

            element.textContent =
                loggedIn
                    ? (
                        user?.name ||
                        "Account"
                    )
                    : "Login";

        }
    );


    /* --------------------------------------------------------
       Customer-only navigation
       -------------------------------------------------------- */

    $$(
        "[data-customer-only]"
    ).forEach(
        element => {

            element.hidden =
                !loggedIn;

        }
    );

}


/* ============================================================
   AUTH MODE SWITCH
   ============================================================ */

function switchAuthMode(
    mode
) {

    const normalized =
        mode === "register"
            ? "register"
            : "login";


    openAuthModal(
        normalized
    );

}


/* ============================================================
   AUTH FORM SUBMISSION
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-auth-form]"
            );


        if (!form) {
            return;
        }


        event.preventDefault();


        clearAuthError(
            form
        );


        const formData =
            new FormData(
                form
            );


        const mode =
            form.dataset.authFormMode;


        const email =
            formData.get(
                "email"
            );


        const password =
            formData.get(
                "password"
            );


        if (
            mode === "register"
        ) {

            const name =
                formData.get(
                    "name"
                );


            const confirmPassword =
                formData.get(
                    "confirmPassword"
                );


            const success =
                registerUser(
                    name,
                    email,
                    password,
                    confirmPassword
                );


            if (!success) {

                const error =
                    getElement(
                        "authError"
                    );


                /*
                   If the dynamically created
                   global error element does not
                   exist, show the message inside
                   this form.
                */

                if (
                    !error ||
                    error.hidden
                ) {

                    const errors =
                        validateRegisterData({
                            name,
                            email,
                            password,
                            confirmPassword
                        });


                    if (
                        errors.length
                    ) {

                        showAuthError(
                            errors[0],
                            form
                        );

                    }

                }

            }


            return;

        }


        const success =
            loginUser(
                email,
                password
            );


        if (!success) {

            const errors =
                validateLoginData({
                    email,
                    password
                });


            if (
                errors.length
            ) {

                showAuthError(
                    errors[0],
                    form
                );

            }

        }

    }
);


/* ============================================================
   AUTH BUTTON EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const loginButton =
            event.target.closest(
                "[data-login]"
            );


        if (loginButton) {

            event.preventDefault();


            if (
                isUserLoggedIn()
            ) {

                return;

            }


            openAuthModal(
                "login"
            );


            return;

        }


        const registerButton =
            event.target.closest(
                "[data-register]"
            );


        if (registerButton) {

            event.preventDefault();


            if (
                isUserLoggedIn()
            ) {

                return;

            }


            openAuthModal(
                "register"
            );


            return;

        }


        const accountButton =
            event.target.closest(
                "[data-account-button]"
            );


        if (accountButton) {

            event.preventDefault();


            if (
                isUserLoggedIn()
            ) {

                const accountSection =
                    getElement(
                        "account"
                    );


                if (accountSection) {

                    accountSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                } else {

                    showToast(
                        `Signed in as ${MyShop.user.name}.`,
                        "info"
                    );

                }

            } else {

                openAuthModal(
                    "login"
                );

            }


            return;

        }


        const logoutButton =
            event.target.closest(
                "[data-logout]"
            );


        if (logoutButton) {

            event.preventDefault();


            logoutUser();


            return;

        }


        const authModeButton =
            event.target.closest(
                "[data-auth-mode]"
            );


        if (authModeButton) {

            event.preventDefault();


            switchAuthMode(
                authModeButton.dataset.authMode
            );


            return;

        }


        const closeButton =
            event.target.closest(
                "[data-auth-close]"
            );


        if (closeButton) {

            closeAuthModal();


            return;

        }

    }
);


/* ============================================================
   AUTH ESCAPE KEY
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "auth"
        ) {

            closeAuthModal();

        }

    }
);


/* ============================================================
   AUTH FORM LIVE VALIDATION
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const input =
            event.target.closest(
                "[data-auth-form] input"
            );


        if (!input) {
            return;
        }


        const form =
            input.closest(
                "[data-auth-form]"
            );


        if (!form) {
            return;
        }


        clearAuthError(
            form
        );


        /*
           Password confirmation gets a small
           visual validity hint without exposing
           any password value.
        */

        if (
            input.name ===
            "confirmPassword"
        ) {

            const password =
                $(
                    'input[name="password"]',
                    form
                );


            if (
                password &&
                input.value
            ) {

                input.setCustomValidity(
                    input.value ===
                        password.value
                        ? ""
                        : "Passwords do not match."
                );

            } else {

                input.setCustomValidity(
                    ""
                );

            }

        }

    }
);


/* ============================================================
   AUTH STATE INITIALIZATION
   ============================================================ */

function initializeAuthState() {

    const savedUser =
        loadFromStorage(
            STORAGE_KEYS.user,
            null
        );


    if (
        savedUser &&
        savedUser.loggedIn
    ) {

        MyShop.user =
            normalizeUser(
                savedUser
            );

    } else {

        MyShop.user =
            null;

    }


    updateAuthUI();

}


/* ============================================================
   AUTH STATE STARTUP
   ============================================================ */

initializeAuthState();

/* ============================================================
   MyShop Marketplace
   app.js — PART 7A
   Cart Core System
   ============================================================ */


/* ============================================================
   GET CART ITEM INDEX
   ============================================================ */

function getCartItemIndex(
    productId
) {

    return MyShop.cart.findIndex(
        item =>
            String(
                item.productId
            ) === String(
                productId
            )
    );

}


/* ============================================================
   GET CART ITEM
   ============================================================ */

function getCartItem(
    productId
) {

    const index =
        getCartItemIndex(
            productId
        );


    if (index === -1) {
        return null;
    }


    return MyShop.cart[index];

}


/* ============================================================
   GET CART QUANTITY
   ============================================================ */

function getCartQuantity(
    productId
) {

    const item =
        getCartItem(
            productId
        );


    return item
        ? Number(item.quantity)
        : 0;

}


/* ============================================================
   GET TOTAL CART ITEMS
   ============================================================ */

function getCartItemCount() {

    return MyShop.cart.reduce(
        (
            total,
            item
        ) =>
            total +
            Number(
                item.quantity
            ),
        0
    );

}


/* ============================================================
   GET UNIQUE CART ITEMS
   ============================================================ */

function getCartUniqueCount() {

    return MyShop.cart.length;

}


/* ============================================================
   GET CART SUBTOTAL
   ============================================================ */

function getCartSubtotal() {

    return MyShop.cart.reduce(
        (
            total,
            item
        ) => {

            const product =
                getProductById(
                    item.productId
                );


            if (!product) {
                return total;
            }


            return (
                total +
                (
                    Number(
                        product.price
                    ) *
                    Number(
                        item.quantity
                    )
                )
            );

        },
        0
    );

}


/* ============================================================
   GET CART DISCOUNT
   ============================================================ */

function getCartDiscount() {

    return MyShop.cart.reduce(
        (
            total,
            item
        ) => {

            const product =
                getProductById(
                    item.productId
                );


            if (!product) {
                return total;
            }


            const oldPrice =
                Number(
                    product.oldPrice ||
                    product.price
                );


            const price =
                Number(
                    product.price
                );


            const quantity =
                Number(
                    item.quantity
                );


            if (
                oldPrice <= price
            ) {

                return total;

            }


            return (
                total +
                (
                    oldPrice -
                    price
                ) *
                quantity
            );

        },
        0
    );

}


/* ============================================================
   ADD PRODUCT TO CART
   ============================================================ */

function addToCart(
    productId,
    quantity = 1
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        showToast(
            "Product could not be found.",
            "error"
        );

        return false;

    }


    if (
        Number(
            product.stock
        ) <= 0
    ) {

        showToast(
            `${product.name} is out of stock.`,
            "error"
        );

        return false;

    }


    const amount =
        Math.max(
            1,
            Math.floor(
                Number(quantity)
            ) || 1
        );


    const existing =
        getCartItem(
            product.id
        );


    const currentQuantity =
        existing
            ? Number(
                existing.quantity
            )
            : 0;


    const newQuantity =
        currentQuantity +
        amount;


    if (
        newQuantity >
        Number(
            product.stock
        )
    ) {

        showToast(
            `Only ${product.stock} units of ${product.name} are available.`,
            "error"
        );

        return false;

    }


    if (existing) {

        existing.quantity =
            newQuantity;

    } else {

        MyShop.cart.push({

            productId:
                product.id,

            quantity:
                amount,

            addedAt:
                new Date().toISOString()

        });

    }


    saveCart();

    updateCartUI();


    showToast(
        `${product.name} added to cart.`,
        "success"
    );


    return true;

}


/* ============================================================
   REMOVE PRODUCT FROM CART
   ============================================================ */

function removeFromCart(
    productId
) {

    const index =
        getCartItemIndex(
            productId
        );


    if (index === -1) {
        return false;
    }


    const product =
        getProductById(
            productId
        );


    MyShop.cart.splice(
        index,
        1
    );


    saveCart();

    updateCartUI();


    if (product) {

        showToast(
            `${product.name} removed from cart.`,
            "info"
        );

    }


    return true;

}


/* ============================================================
   UPDATE CART QUANTITY
   ============================================================ */

function updateCartQuantity(
    productId,
    quantity
) {

    const item =
        getCartItem(
            productId
        );


    if (!item) {
        return false;
    }


    const product =
        getProductById(
            productId
        );


    if (!product) {

        removeFromCart(
            productId
        );

        return false;

    }


    const amount =
        Math.floor(
            Number(quantity)
        );


    if (
        amount <= 0
    ) {

        return removeFromCart(
            productId
        );

    }


    if (
        amount >
        Number(
            product.stock
        )
    ) {

        showToast(
            `Only ${product.stock} units are available.`,
            "error"
        );

        updateCartUI();

        return false;

    }


    item.quantity =
        amount;


    saveCart();

    updateCartUI();


    return true;

}


/* ============================================================
   INCREASE CART QUANTITY
   ============================================================ */

function increaseCartQuantity(
    productId
) {

    const current =
        getCartQuantity(
            productId
        );


    return updateCartQuantity(
        productId,
        current + 1
    );

}


/* ============================================================
   DECREASE CART QUANTITY
   ============================================================ */

function decreaseCartQuantity(
    productId
) {

    const current =
        getCartQuantity(
            productId
        );


    return updateCartQuantity(
        productId,
        current - 1
    );

}


/* ============================================================
   CLEAR CART
   ============================================================ */

function clearCart(
    showMessage = true
) {

    if (
        MyShop.cart.length === 0
    ) {

        return;

    }


    MyShop.cart =
        [];


    saveCart();

    updateCartUI();


    if (showMessage) {

        showToast(
            "Cart cleared.",
            "info"
        );

    }

}


/* ============================================================
   GET COMPLETE CART PRODUCTS
   ============================================================ */

function getCartProducts() {

    return MyShop.cart
        .map(
            item => {

                const product =
                    getProductById(
                        item.productId
                    );


                if (!product) {
                    return null;
                }


                return {

                    ...product,

                    cartQuantity:
                        Number(
                            item.quantity
                        )

                };

            }
        )
        .filter(Boolean);

}


/* ============================================================
   CART SUMMARY
   ============================================================ */

function getCartSummary() {

    const subtotal =
        getCartSubtotal();


    const discount =
        getCartDiscount();


    const itemCount =
        getCartItemCount();


    return {

        subtotal,

        discount,

        itemCount,

        uniqueItems:
            getCartUniqueCount(),

        total:
            Math.max(
                0,
                subtotal
            )

    };

}


/* ============================================================
   CART INITIALIZATION
   ============================================================ */

function initializeCartState() {

    if (
        !Array.isArray(
            MyShop.cart
        )
    ) {

        MyShop.cart =
            [];

    }


    /*
       Remove invalid or duplicate cart
       records without changing valid items.
    */

    const normalized = [];


    MyShop.cart.forEach(
        item => {

            if (
                !item ||
                !item.productId
            ) {

                return;

            }


            const product =
                getProductById(
                    item.productId
                );


            if (!product) {
                return;
            }


            const quantity =
                Math.floor(
                    Number(
                        item.quantity
                    )
                );


            if (
                quantity <= 0
            ) {

                return;

            }


            const existing =
                normalized.find(
                    entry =>
                        String(
                            entry.productId
                        ) === String(
                            product.id
                        )
                );


            if (existing) {

                existing.quantity +=
                    quantity;

            } else {

                normalized.push({

                    productId:
                        product.id,

                    quantity:

                        Math.min(
                            quantity,
                            Number(
                                product.stock
                            )
                        ),

                    addedAt:
                        item.addedAt ||
                        new Date().toISOString()

                });

            }

        }
    );


    MyShop.cart =
        normalized;


    saveCart();

}


/* ============================================================
   START CART STATE
   ============================================================ */

initializeCartState();
updateCartUI();

/* ============================================================
   MyShop Marketplace
   app.js — PART 7B
   Cart UI + Cart Drawer
   ============================================================ */


/* ============================================================
   UPDATE CART COUNT
   ============================================================ */

function updateCartCount() {

    const count =
        getCartItemCount();


    $$(
        "[data-cart-count]"
    ).forEach(
        element => {

            element.textContent =
                count.toLocaleString(
                    "en-BD"
                );

        }
    );


    $$(
        "[data-cart-unique-count]"
    ).forEach(
        element => {

            element.textContent =
                getCartUniqueCount()
                    .toLocaleString(
                        "en-BD"
                    );

        }
    );

}


/* ============================================================
   UPDATE CART TOTALS
   ============================================================ */

function updateCartTotals() {

    const summary =
        getCartSummary();


    $$(
        "[data-cart-subtotal]"
    ).forEach(
        element => {

            element.textContent =
                formatPrice(
                    summary.subtotal
                );

        }
    );


    $$(
        "[data-cart-discount]"
    ).forEach(
        element => {

            element.textContent =
                formatPrice(
                    summary.discount
                );

        }
    );


    $$(
        "[data-cart-total]"
    ).forEach(
        element => {

            element.textContent =
                formatPrice(
                    summary.total
                );

        }
    );


    $$(
        "[data-cart-item-count]"
    ).forEach(
        element => {

            element.textContent =
                summary.itemCount
                    .toLocaleString(
                        "en-BD"
                    );

        }
    );

}


/* ============================================================
   CART ITEM HTML
   ============================================================ */

function createCartItemHTML(
    item
) {

    if (!item) {
        return "";
    }


    const product =
        getProductById(
            item.productId
        );


    if (!product) {
        return "";
    }


    const quantity =
        Number(
            item.quantity
        );


    const lineTotal =
        Number(
            product.price
        ) *
        quantity;


    return `

        <article
            class="cart-item"
            data-cart-product="${escapeHTML(product.id)}"
        >

            <div
                class="cart-item-image"
                aria-hidden="true"
            >
                ${product.emoji}
            </div>


            <div class="cart-item-info">

                <h3 class="cart-item-name">
                    ${escapeHTML(product.name)}
                </h3>


                <p class="cart-item-category">
                    ${escapeHTML(product.category)}
                </p>


                <strong class="cart-item-price">
                    ${formatPrice(product.price)}
                </strong>


                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="quantity-button"
                        data-cart-decrease="${escapeHTML(product.id)}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <span
                        class="cart-item-quantity"
                        aria-label="Quantity"
                    >
                        ${quantity}
                    </span>


                    <button
                        type="button"
                        class="quantity-button"
                        data-cart-increase="${escapeHTML(product.id)}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

            </div>


            <div class="cart-item-right">

                <strong class="cart-item-total">
                    ${formatPrice(lineTotal)}
                </strong>


                <button
                    type="button"
                    class="cart-remove-button"
                    data-cart-remove="${escapeHTML(product.id)}"
                    aria-label="Remove ${
                        escapeHTML(product.name)
                    } from cart"
                >
                    Remove
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   CART EMPTY HTML
   ============================================================ */

function createCartEmptyHTML() {

    return `

        <div
            class="cart-empty-state"
            role="status"
        >

            <div
                class="cart-empty-icon"
                aria-hidden="true"
            >
                🛒
            </div>


            <h3>
                Your cart is empty
            </h3>


            <p>
                Add products to your cart
                and they will appear here.
            </p>


            <button
                type="button"
                class="primary-button"
                data-close-cart
            >
                Continue Shopping
            </button>

        </div>

    `;

}


/* ============================================================
   RENDER CART
   ============================================================ */

function renderCart() {

    const containers =
        $$(
            "[data-cart-list]"
        );


    const products =
        getCartProducts();


    containers.forEach(
        container => {

            if (
                products.length === 0
            ) {

                container.innerHTML =
                    createCartEmptyHTML();

                return;

            }


            container.innerHTML =
                MyShop.cart
                    .map(
                        createCartItemHTML
                    )
                    .join("");

        }
    );


    /*
       Toggle optional empty/full states.
    */

    $$(
        "[data-cart-empty]"
    ).forEach(
        element => {

            element.hidden =
                products.length !== 0;

        }
    );


    $$(
        "[data-cart-filled]"
    ).forEach(
        element => {

            element.hidden =
                products.length === 0;

        }
    );

}


/* ============================================================
   UPDATE CART UI
   ============================================================ */

function updateCartUI() {

    updateCartCount();

    updateCartTotals();

    renderCart();

}


/* ============================================================
   OPEN CART
   ============================================================ */

function openCart() {

    let drawer =
        getElement(
            "cartDrawer"
        );


    if (!drawer) {

        drawer =
            document.createElement(
                "aside"
            );

        drawer.id =
            "cartDrawer";

        drawer.className =
            "cart-drawer";

        drawer.setAttribute(
            "aria-label",
            "Shopping cart"
        );

        document.body.appendChild(
            drawer
        );

    }


    drawer.innerHTML = `

        <div
            class="cart-drawer-overlay"
            data-close-cart
        ></div>


        <div class="cart-drawer-content">

            <div class="cart-drawer-header">

                <div>

                    <p class="section-eyebrow">
                        MYSHOP
                    </p>

                    <h2>
                        Your Cart
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    data-close-cart
                    aria-label="Close cart"
                >
                    ×
                </button>

            </div>


            <div
                class="cart-drawer-body"
                data-cart-list
            ></div>


            <div
                class="cart-drawer-footer"
                data-cart-filled
            >

                <div class="cart-summary-row">

                    <span>
                        Subtotal
                    </span>

                    <strong data-cart-subtotal>
                        ${formatPrice(
                            getCartSubtotal()
                        )}
                    </strong>

                </div>


                <div class="cart-summary-row">

                    <span>
                        Savings
                    </span>

                    <strong data-cart-discount>
                        ${formatPrice(
                            getCartDiscount()
                        )}
                    </strong>

                </div>


                <div class="cart-summary-row cart-total-row">

                    <span>
                        Total
                    </span>

                    <strong data-cart-total>
                        ${formatPrice(
                            getCartSummary().total
                        )}
                    </strong>

                </div>


                <button
                    type="button"
                    class="primary-button checkout-button"
                    data-start-checkout
                >
                    Proceed to Checkout
                </button>


                <button
                    type="button"
                    class="secondary-button"
                    data-clear-cart
                >
                    Clear Cart
                </button>

            </div>

        </div>

    `;


    drawer.hidden =
        false;


    document.body.classList.add(
        "cart-open"
    );


    MyShop.activeModal =
        "cart";


    updateCartUI();

}


/* ============================================================
   CLOSE CART
   ============================================================ */

function closeCart() {

    const drawer =
        getElement(
            "cartDrawer"
        );


    if (!drawer) {
        return;
    }


    drawer.hidden =
        true;


    document.body.classList.remove(
        "cart-open"
    );


    if (
        MyShop.activeModal ===
        "cart"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   CART BUTTON EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const cartButton =
            event.target.closest(
                "[data-cart-button]"
            );


        if (cartButton) {

            event.preventDefault();


            openCart();


            return;

        }


        const closeButton =
            event.target.closest(
                "[data-close-cart]"
            );


        if (closeButton) {

            event.preventDefault();


            closeCart();


            return;

        }


        const increase =
            event.target.closest(
                "[data-cart-increase]"
            );


        if (increase) {

            event.preventDefault();


            increaseCartQuantity(
                increase.dataset.cartIncrease
            );


            return;

        }


        const decrease =
            event.target.closest(
                "[data-cart-decrease]"
            );


        if (decrease) {

            event.preventDefault();


            decreaseCartQuantity(
                decrease.dataset.cartDecrease
            );


            return;

        }


        const remove =
            event.target.closest(
                "[data-cart-remove]"
            );


        if (remove) {

            event.preventDefault();


            removeFromCart(
                remove.dataset.cartRemove
            );


            return;

        }


        const clear =
            event.target.closest(
                "[data-clear-cart]"
            );


        if (clear) {

            event.preventDefault();


            clearCart();


            return;

        }


        const checkout =
            event.target.closest(
                "[data-start-checkout]"
            );


        if (checkout) {

            event.preventDefault();


            startCheckout();


            return;

        }

    }
);


/* ============================================================
   CART ESCAPE KEY
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "cart"
        ) {

            closeCart();

        }

    }
);


/* ============================================================
   CART UI STARTUP
   ============================================================ */

updateCartUI();

/* ============================================================
   MyShop Marketplace
   app.js — PART 8A
   Checkout Core + Delivery Information
   ============================================================ */


/* ============================================================
   CHECKOUT STATE
   ============================================================ */

function initializeCheckoutState() {

    if (
        !MyShop.checkout ||
        typeof MyShop.checkout !== "object"
    ) {

        MyShop.checkout = {};

    }


    MyShop.checkout.step =
        Number(
            MyShop.checkout.step
        ) || 1;


    MyShop.checkout.customer =
        MyShop.checkout.customer ||
        {

            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            postalCode: ""

        };


    MyShop.checkout.paymentMethod =
        MyShop.checkout.paymentMethod ||
        "cod";


    MyShop.checkout.deliveryMethod =
        MyShop.checkout.deliveryMethod ||
        "standard";


    MyShop.checkout.note =
        MyShop.checkout.note ||
        "";

}


/* ============================================================
   GET CHECKOUT DATA
   ============================================================ */

function getCheckoutData() {

    return {

        ...MyShop.checkout,

        customer: {
            ...MyShop.checkout.customer
        }

    };

}


/* ============================================================
   UPDATE CHECKOUT CUSTOMER
   ============================================================ */

function updateCheckoutCustomer(
    data
) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return false;

    }


    MyShop.checkout.customer = {

        ...MyShop.checkout.customer,

        ...(data.name !== undefined
            ? {
                name:
                    String(
                        data.name
                    ).trim()
            }
            : {}),

        ...(data.phone !== undefined
            ? {
                phone:
                    String(
                        data.phone
                    ).trim()
            }
            : {}),

        ...(data.email !== undefined
            ? {
                email:
                    String(
                        data.email
                    ).trim().toLowerCase()
            }
            : {}),

        ...(data.address !== undefined
            ? {
                address:
                    String(
                        data.address
                    ).trim()
            }
            : {}),

        ...(data.city !== undefined
            ? {
                city:
                    String(
                        data.city
                    ).trim()
            }
            : {}),

        ...(data.postalCode !== undefined
            ? {
                postalCode:
                    String(
                        data.postalCode
                    ).trim()
            }
            : {})

    };


    return true;

}


/* ============================================================
   CHECKOUT PHONE VALIDATION
   ============================================================ */

function validatePhone(
    phone
) {

    const value =
        String(
            phone || ""
        )
        .replace(
            /[\s\-()]/g,
            ""
        );


    /*
       Accept common Bangladesh-style
       and international phone formats.
    */

    return /^\+?\d{10,15}$/
        .test(value);

}


/* ============================================================
   CHECKOUT CUSTOMER VALIDATION
   ============================================================ */

function validateCheckoutCustomer() {

    const customer =
        MyShop.checkout.customer;


    const errors = [];


    if (
        !validateName(
            customer.name
        )
    ) {

        errors.push(
            "Please enter your full name."
        );

    }


    if (
        !validatePhone(
            customer.phone
        )
    ) {

        errors.push(
            "Please enter a valid phone number."
        );

    }


    if (
        customer.email &&
        !validateEmail(
            customer.email
        )
    ) {

        errors.push(
            "Please enter a valid email address."
        );

    }


    if (
        !customer.address ||
        customer.address.length < 5
    ) {

        errors.push(
            "Please enter your delivery address."
        );

    }


    if (
        !customer.city
    ) {

        errors.push(
            "Please enter your city."
        );

    }


    return errors;

}


/* ============================================================
   SET PAYMENT METHOD
   ============================================================ */

function setPaymentMethod(
    method
) {

    const allowed = [
        "cod",
        "card",
        "mobile-banking"
    ];


    const normalized =
        String(
            method || ""
        ).trim().toLowerCase();


    if (
        !allowed.includes(
            normalized
        )
    ) {

        return false;

    }


    MyShop.checkout.paymentMethod =
        normalized;


    updatePaymentMethodUI();


    return true;

}


/* ============================================================
   SET DELIVERY METHOD
   ============================================================ */

function setDeliveryMethod(
    method
) {

    const allowed = [
        "standard",
        "express"
    ];


    const normalized =
        String(
            method || ""
        ).trim().toLowerCase();


    if (
        !allowed.includes(
            normalized
        )
    ) {

        return false;

    }


    MyShop.checkout.deliveryMethod =
        normalized;


    updateCheckoutDeliveryUI();


    return true;

}


/* ============================================================
   DELIVERY CHARGE
   ============================================================ */

function getDeliveryCharge() {

    if (
        MyShop.checkout.deliveryMethod ===
        "express"
    ) {

        return 120;

    }


    /*
       Free standard delivery above the
       configured threshold.
    */

    const subtotal =
        getCartSubtotal();


    const freeThreshold =
        2000;


    if (
        subtotal >=
        freeThreshold
    ) {

        return 0;

    }


    return 60;

}


/* ============================================================
   CHECKOUT TOTAL
   ============================================================ */

function getCheckoutTotal() {

    const summary =
        getCartSummary();


    const delivery =
        getDeliveryCharge();


    return Math.max(
        0,
        summary.total +
        delivery
    );

}


/* ============================================================
   CHECKOUT SUMMARY
   ============================================================ */

function getCheckoutSummary() {

    const cart =
        getCartSummary();


    const delivery =
        getDeliveryCharge();


    return {

        subtotal:
            cart.subtotal,

        discount:
            cart.discount,

        delivery,

        total:
            Math.max(
                0,
                cart.total +
                delivery
            ),

        itemCount:
            cart.itemCount

    };

}


/* ============================================================
   START CHECKOUT
   ============================================================ */

function startCheckout() {

    if (
        MyShop.cart.length === 0
    ) {

        showToast(
            "Your cart is empty.",
            "error"
        );

        return false;

    }


    initializeCheckoutState();


    /*
       Logged-in customer information can
       pre-fill the checkout form.
    */

    if (
        isUserLoggedIn()
    ) {

        const user =
            getCurrentUser();


        if (
            !MyShop.checkout.customer.name
        ) {

            MyShop.checkout.customer.name =
                user.name || "";

        }


        if (
            !MyShop.checkout.customer.email
        ) {

            MyShop.checkout.customer.email =
                user.email || "";

        }


        if (
            !MyShop.checkout.customer.phone &&
            user.phone
        ) {

            MyShop.checkout.customer.phone =
                user.phone;

        }

    }


    MyShop.checkout.step =
        1;


    closeCart();

    openCheckout();


    return true;

}


/* ============================================================
   OPEN CHECKOUT
   ============================================================ */

function openCheckout() {

    let modal =
        getElement(
            "checkoutModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "checkoutModal";

        modal.className =
            "modal checkout-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    renderCheckoutModal();


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "checkout";

}


/* ============================================================
   CLOSE CHECKOUT
   ============================================================ */

function closeCheckout() {

    const modal =
        getElement(
            "checkoutModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "checkout"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   CHECKOUT STEP VALIDATION
   ============================================================ */

function validateCheckoutStep(
    step
) {

    if (
        Number(step) === 1
    ) {

        const errors =
            validateCheckoutCustomer();


        if (
            errors.length > 0
        ) {

            showToast(
                errors[0],
                "error"
            );

            return false;

        }

    }


    if (
        Number(step) === 2
    ) {

        if (
            !MyShop.checkout.paymentMethod
        ) {

            showToast(
                "Please select a payment method.",
                "error"
            );

            return false;

        }

    }


    if (
        MyShop.cart.length === 0
    ) {

        showToast(
            "Your cart is empty.",
            "error"
        );

        return false;

    }


    return true;

}


/* ============================================================
   CHECKOUT NEXT STEP
   ============================================================ */

function nextCheckoutStep() {

    const current =
        Number(
            MyShop.checkout.step
        );


    if (
        !validateCheckoutStep(
            current
        )
    ) {

        return false;

    }


    if (
        current >= 3
    ) {

        return false;

    }


    MyShop.checkout.step =
        current + 1;


    renderCheckoutModal();


    return true;

}


/* ============================================================
   CHECKOUT PREVIOUS STEP
   ============================================================ */

function previousCheckoutStep() {

    const current =
        Number(
            MyShop.checkout.step
        );


    if (
        current <= 1
    ) {

        return false;

    }


    MyShop.checkout.step =
        current - 1;


    renderCheckoutModal();


    return true;

}


/* ============================================================
   CHECKOUT INITIALIZATION
   ============================================================ */

initializeCheckoutState();

/* ============================================================
   MyShop Marketplace
   app.js — PART 8B
   Checkout UI + Delivery + Payment
   ============================================================ */


/* ============================================================
   CHECKOUT STEP INDICATOR
   ============================================================ */

function createCheckoutStepsHTML() {

    const current =
        Number(
            MyShop.checkout.step
        );


    return `

        <div
            class="checkout-steps"
            aria-label="Checkout progress"
        >

            <div class="checkout-step ${
                current >= 1
                    ? "active"
                    : ""
            }">

                <span>1</span>
                <small>Delivery</small>

            </div>


            <div class="checkout-step-line"></div>


            <div class="checkout-step ${
                current >= 2
                    ? "active"
                    : ""
            }">

                <span>2</span>
                <small>Payment</small>

            </div>


            <div class="checkout-step-line"></div>


            <div class="checkout-step ${
                current >= 3
                    ? "active"
                    : ""
            }">

                <span>3</span>
                <small>Review</small>

            </div>

        </div>

    `;

}


/* ============================================================
   DELIVERY FORM
   ============================================================ */

function createCheckoutDeliveryHTML() {

    const customer =
        MyShop.checkout.customer;


    return `

        <section
            class="checkout-panel"
            data-checkout-panel="delivery"
        >

            <h3>
                Delivery Information
            </h3>


            <p class="checkout-description">
                Enter the information needed
                to deliver your order.
            </p>


            <div class="checkout-form-grid">

                <label>
                    Full Name

                    <input
                        type="text"
                        name="checkoutName"
                        data-checkout-field="name"
                        value="${escapeHTML(
                            customer.name
                        )}"
                        autocomplete="name"
                        required
                    >
                </label>


                <label>
                    Phone Number

                    <input
                        type="tel"
                        name="checkoutPhone"
                        data-checkout-field="phone"
                        value="${escapeHTML(
                            customer.phone
                        )}"
                        autocomplete="tel"
                        required
                    >
                </label>


                <label>
                    Email
                    <span class="optional">
                        (optional)
                    </span>

                    <input
                        type="email"
                        name="checkoutEmail"
                        data-checkout-field="email"
                        value="${escapeHTML(
                            customer.email
                        )}"
                        autocomplete="email"
                    >
                </label>


                <label>
                    City

                    <input
                        type="text"
                        name="checkoutCity"
                        data-checkout-field="city"
                        value="${escapeHTML(
                            customer.city
                        )}"
                        autocomplete="address-level2"
                        required
                    >
                </label>


                <label class="checkout-full-width">
                    Delivery Address

                    <textarea
                        name="checkoutAddress"
                        data-checkout-field="address"
                        rows="3"
                        autocomplete="street-address"
                        required
                    >${escapeHTML(
                        customer.address
                    )}</textarea>
                </label>


                <label>
                    Postal Code
                    <span class="optional">
                        (optional)
                    </span>

                    <input
                        type="text"
                        name="checkoutPostalCode"
                        data-checkout-field="postalCode"
                        value="${escapeHTML(
                            customer.postalCode
                        )}"
                        autocomplete="postal-code"
                    >
                </label>

            </div>


            <h4 class="checkout-subheading">
                Delivery Method
            </h4>


            <div
                class="delivery-method-options"
                role="radiogroup"
            >

                <label
                    class="delivery-option ${
                        MyShop.checkout.deliveryMethod ===
                        "standard"
                            ? "active"
                            : ""
                    }"
                >

                    <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        ${
                            MyShop.checkout.deliveryMethod ===
                            "standard"
                                ? "checked"
                                : ""
                        }
                    >

                    <span>
                        <strong>
                            Standard Delivery
                        </strong>

                        <small>
                            ${
                                getDeliveryCharge() === 0
                                    ? "Free"
                                    : "৳60"
                            }
                        </small>
                    </span>

                </label>


                <label
                    class="delivery-option ${
                        MyShop.checkout.deliveryMethod ===
                        "express"
                            ? "active"
                            : ""
                    }"
                >

                    <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        ${
                            MyShop.checkout.deliveryMethod ===
                            "express"
                                ? "checked"
                                : ""
                        }
                    >

                    <span>
                        <strong>
                            Express Delivery
                        </strong>

                        <small>
                            ৳120
                        </small>
                    </span>

                </label>

            </div>

        </section>

    `;

}


/* ============================================================
   PAYMENT FORM
   ============================================================ */

function createCheckoutPaymentHTML() {

    const selected =
        MyShop.checkout.paymentMethod;


    return `

        <section
            class="checkout-panel"
            data-checkout-panel="payment"
        >

            <h3>
                Payment Method
            </h3>


            <p class="checkout-description">
                Select how you would like to
                pay for your order.
            </p>


            <div
                class="payment-method-options"
                role="radiogroup"
            >

                <label
                    class="payment-option ${
                        selected === "cod"
                            ? "active"
                            : ""
                    }"
                >

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        ${
                            selected === "cod"
                                ? "checked"
                                : ""
                        }
                    >

                    <span class="payment-icon">
                        💵
                    </span>

                    <span>

                        <strong>
                            Cash on Delivery
                        </strong>

                        <small>
                            Pay when your order arrives.
                        </small>

                    </span>

                </label>


                <label
                    class="payment-option ${
                        selected === "card"
                            ? "active"
                            : ""
                    }"
                >

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        ${
                            selected === "card"
                                ? "checked"
                                : ""
                        }
                    >

                    <span class="payment-icon">
                        💳
                    </span>

                    <span>

                        <strong>
                            Card Payment
                        </strong>

                        <small>
                            Secure card payment.
                        </small>

                    </span>

                </label>


                <label
                    class="payment-option ${
                        selected === "mobile-banking"
                            ? "active"
                            : ""
                    }"
                >

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="mobile-banking"
                        ${
                            selected === "mobile-banking"
                                ? "checked"
                                : ""
                        }
                    >

                    <span class="payment-icon">
                        📱
                    </span>

                    <span>

                        <strong>
                            Mobile Banking
                        </strong>

                        <small>
                            Pay using a mobile wallet.
                        </small>

                    </span>

                </label>

            </div>


            <div
                class="payment-notice"
                data-payment-notice
            >

                ${
                    selected === "cod"
                        ? `
                            Payment will be collected
                            when your order is delivered.
                          `
                        : selected === "card"
                            ? `
                                Card payment will be
                                handled securely at checkout.
                              `
                            : `
                                Mobile banking payment
                                instructions will appear
                                after order confirmation.
                              `
                }

            </div>

        </section>

    `;

}


/* ============================================================
   REVIEW HTML
   ============================================================ */

function createCheckoutReviewHTML() {

    const customer =
        MyShop.checkout.customer;


    const summary =
        getCheckoutSummary();


    const products =
        getCartProducts();


    const paymentLabels = {

        cod:
            "Cash on Delivery",

        card:
            "Card Payment",

        "mobile-banking":
            "Mobile Banking"

    };


    const deliveryLabels = {

        standard:
            "Standard Delivery",

        express:
            "Express Delivery"

    };


    return `

        <section
            class="checkout-panel"
            data-checkout-panel="review"
        >

            <h3>
                Review Your Order
            </h3>


            <div class="checkout-review">

                <div class="review-block">

                    <h4>
                        Delivery
                    </h4>

                    <p>
                        <strong>
                            ${escapeHTML(
                                customer.name
                            )}
                        </strong>
                    </p>

                    <p>
                        ${escapeHTML(
                            customer.phone
                        )}
                    </p>

                    ${
                        customer.email
                            ? `
                                <p>
                                    ${escapeHTML(
                                        customer.email
                                    )}
                                </p>
                              `
                            : ""
                    }

                    <p>
                        ${escapeHTML(
                            customer.address
                        )},
                        ${escapeHTML(
                            customer.city
                        )}
                        ${
                            customer.postalCode
                                ? ` - ${escapeHTML(
                                    customer.postalCode
                                )}`
                                : ""
                        }
                    </p>

                </div>


                <div class="review-block">

                    <h4>
                        Delivery Method
                    </h4>

                    <p>
                        ${
                            deliveryLabels[
                                MyShop.checkout.deliveryMethod
                            ]
                        }
                    </p>

                </div>


                <div class="review-block">

                    <h4>
                        Payment
                    </h4>

                    <p>
                        ${
                            paymentLabels[
                                MyShop.checkout.paymentMethod
                            ]
                        }
                    </p>

                </div>


                <div class="review-products">

                    <h4>
                        Items
                    </h4>

                    ${
                        products
                            .map(
                                product => `

                                    <div
                                        class="review-product"
                                    >

                                        <span>
                                            ${
                                                product.emoji
                                            }
                                            ${
                                                escapeHTML(
                                                    product.name
                                                )
                                            }
                                            ×
                                            ${
                                                product.cartQuantity
                                            }
                                        </span>

                                        <strong>
                                            ${formatPrice(
                                                product.price *
                                                product.cartQuantity
                                            )}
                                        </strong>

                                    </div>

                                `
                            )
                            .join("")
                    }

                </div>


                <div class="checkout-review-total">

                    <div>
                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${formatPrice(
                                summary.subtotal
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Savings
                        </span>

                        <strong>
                            -${formatPrice(
                                summary.discount
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Delivery
                        </span>

                        <strong>
                            ${
                                summary.delivery === 0
                                    ? "FREE"
                                    : formatPrice(
                                        summary.delivery
                                    )
                            }
                        </strong>
                    </div>


                    <div class="grand-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${formatPrice(
                                summary.total
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        </section>

    `;

}


/* ============================================================
   CHECKOUT FOOTER
   ============================================================ */

function createCheckoutFooterHTML() {

    const step =
        Number(
            MyShop.checkout.step
        );


    const summary =
        getCheckoutSummary();


    return `

        <div class="checkout-footer">

            <div class="checkout-footer-total">

                <span>
                    Total
                </span>

                <strong>
                    ${formatPrice(
                        summary.total
                    )}
                </strong>

            </div>


            <div class="checkout-footer-actions">

                ${
                    step > 1
                        ? `
                            <button
                                type="button"
                                class="secondary-button"
                                data-checkout-back
                            >
                                Back
                            </button>
                          `
                        : `
                            <button
                                type="button"
                                class="secondary-button"
                                data-checkout-close
                            >
                                Cancel

      </button>
                          `
                }


                ${
                    step < 3
                        ? `
                            <button
                                type="button"
                                class="primary-button"
                                data-checkout-next
                            >
                                Continue
                            </button>
                          `
                        : `
                            <button
                                type="button"
                                class="primary-button"
                                data-place-order
                            >
                                Place Order
                            </button>
                          `
                }

            </div>

        </div>

    `;

}


/* ============================================================
   RENDER CHECKOUT MODAL
   ============================================================ */

function renderCheckoutModal() {

    const modal =
        getElement(
            "checkoutModal"
        );


    if (!modal) {
        return;
    }


    const step =
        Number(
            MyShop.checkout.step
        );


    let panelHTML =
        "";


    if (
        step === 1
    ) {

        panelHTML =
            createCheckoutDeliveryHTML();

    }


    else if (
        step === 2
    ) {

        panelHTML =
            createCheckoutPaymentHTML();

    }


    else {

        panelHTML =
            createCheckoutReviewHTML();

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-checkout-close
        ></div>


        <div
            class="modal-content checkout-content"
        >

            <div class="modal-header">

                <div>

                    <p class="section-eyebrow">
                        CHECKOUT
                    </p>

                    <h2>
                        Complete Your Order
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    data-checkout-close
                    aria-label="Close checkout"
                >
                    ×
                </button>

            </div>


            ${createCheckoutStepsHTML()}


            <div class="checkout-body">

                ${panelHTML}

            </div>


            ${createCheckoutFooterHTML()}

        </div>

    `;


    updatePaymentMethodUI();

    updateCheckoutDeliveryUI();

}


/* ============================================================
   PAYMENT UI
   ============================================================ */

function updatePaymentMethodUI() {

    $$(
        ".payment-option"
    ).forEach(
        option => {

            const input =
                $(
                    "input[type='radio']",
                    option
                );


            if (!input) {
                return;
            }


            option.classList.toggle(
                "active",
                input.checked
            );

        }
    );


    const notice =
        $(
            "[data-payment-notice]"
        );


    if (!notice) {
        return;
    }


    const method =
        MyShop.checkout.paymentMethod;


    if (
        method === "card"
    ) {

        notice.textContent =
            "Card payment will be handled securely at checkout.";

    }


    else if (
        method === "mobile-banking"
    ) {

        notice.textContent =
            "Mobile banking payment instructions will appear after order confirmation.";

    }


    else {

        notice.textContent =
            "Payment will be collected when your order is delivered.";

    }

}


/* ============================================================
   DELIVERY UI
   ============================================================ */

function updateCheckoutDeliveryUI() {

    $$(
        ".delivery-option"
    ).forEach(
        option => {

            const input =
                $(
                    "input[type='radio']",
                    option
                );


            if (!input) {
                return;
            }


            option.classList.toggle(
                "active",
                input.checked
            );

        }
    );

}


/* ============================================================
   CHECKOUT FIELD EVENTS
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const field =
            event.target.closest(
                "[data-checkout-field]"
            );


        if (!field) {
            return;
        }


        updateCheckoutCustomer({

            [field.dataset.checkoutField]:
                field.value

        });

    }
);


/* ============================================================
   PAYMENT / DELIVERY EVENTS
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const payment =
            event.target.closest(
                "input[name='paymentMethod']"
            );


        if (payment) {

            setPaymentMethod(
                payment.value
            );

            renderCheckoutModal();

            return;

        }


        const delivery =
            event.target.closest(
                "input[name='deliveryMethod']"
            );


        if (delivery) {

            setDeliveryMethod(
                delivery.value
            );

            renderCheckoutModal();

        }

    }
);


/* ============================================================
   CHECKOUT NAVIGATION EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const next =
            event.target.closest(
                "[data-checkout-next]"
            );


        if (next) {

            event.preventDefault();

            nextCheckoutStep();

            return;

        }


        const back =
            event.target.closest(
                "[data-checkout-back]"
            );


        if (back) {

            event.preventDefault();

            previousCheckoutStep();

            return;

        }


        const close =
            event.target.closest(
                "[data-checkout-close]"
            );


        if (close) {

            event.preventDefault();

            closeCheckout();

        }

    }
);

/* ============================================================
   MyShop Marketplace
   app.js — PART 9A
   Order Creation + Order History
   ============================================================ */


/* ============================================================
   GENERATE ORDER NUMBER
   ============================================================ */

function generateOrderNumber() {

    const timestamp =
        Date.now()
            .toString()
            .slice(-8);


    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );


    return `MS-${timestamp}-${random}`;

}


/* ============================================================
   GET SAVED ORDERS
   ============================================================ */

function getOrders() {

    const orders =
        loadFromStorage(
            STORAGE_KEYS.orders,
            []
        );


    if (
        !Array.isArray(orders)
    ) {

        return [];

    }


    return orders;

}


/* ============================================================
   SAVE ORDERS
   ============================================================ */

function saveOrders(
    orders
) {

    return saveToStorage(
        STORAGE_KEYS.orders,
        Array.isArray(orders)
            ? orders
            : []
    );

}


/* ============================================================
   GET ORDER BY ID
   ============================================================ */

function getOrderById(
    orderId
) {

    const orders =
        getOrders();


    return (
        orders.find(
            order =>
                String(
                    order.id
                ) ===
                String(
                    orderId
                )
        ) ||
        null
    );

}


/* ============================================================
   CREATE ORDER ITEMS
   ============================================================ */

function createOrderItems() {

    return getCartProducts()
        .map(
            product => ({

                productId:
                    product.id,

                name:
                    product.name,

                category:
                    product.category,

                price:
                    Number(
                        product.price
                    ),

                quantity:
                    Number(
                        product.cartQuantity
                    ),

                emoji:
                    product.emoji,

                lineTotal:
                    Number(
                        product.price
                    ) *
                    Number(
                        product.cartQuantity
                    )

            })
        );

}


/* ============================================================
   CREATE ORDER OBJECT
   ============================================================ */

function buildOrderObject() {

    const checkout =
        getCheckoutData();


    const summary =
        getCheckoutSummary();


    const orderItems =
        createOrderItems();


    return {

        id:
            generateOrderNumber(),


        userId:
            MyShop.user?.id ||
            null,


        status:
            "pending",


        createdAt:
            new Date().toISOString(),


        customer: {

            name:
                checkout.customer.name,

            phone:
                checkout.customer.phone,

            email:
                checkout.customer.email,

            address:
                checkout.customer.address,

            city:
                checkout.customer.city,

            postalCode:
                checkout.customer.postalCode

        },


        deliveryMethod:
            checkout.deliveryMethod,


        paymentMethod:
            checkout.paymentMethod,


        note:
            checkout.note || "",


        items:
            orderItems,


        pricing: {

            subtotal:
                summary.subtotal,

            discount:
                summary.discount,

            delivery:
                summary.delivery,

            total:
                summary.total

        }

    };

}


/* ============================================================
   VALIDATE ORDER
   ============================================================ */

function validateOrderBeforePlacement() {

    if (
        MyShop.cart.length === 0
    ) {

        return {

            valid: false,

            message:
                "Your cart is empty."

        };

    }


    const customerErrors =
        validateCheckoutCustomer();


    if (
        customerErrors.length > 0
    ) {

        return {

            valid: false,

            message:
                customerErrors[0]

        };

    }


    if (
        !MyShop.checkout.paymentMethod
    ) {

        return {

            valid: false,

            message:
                "Please select a payment method."

        };

    }


    if (
        !MyShop.checkout.deliveryMethod
    ) {

        return {

            valid: false,

            message:
                "Please select a delivery method."

        };

    }


    return {

        valid: true,

        message: ""

    };

}


/* ============================================================
   SAVE NEW ORDER
   ============================================================ */

function saveNewOrder(
    order
) {

    if (
        !order ||
        !order.id
    ) {

        return false;

    }


    const orders =
        getOrders();


    orders.unshift(
        order
    );


    /*
       Keep the local order history
       reasonably sized.
    */

    const limitedOrders =
        orders.slice(
            0,
            100
        );


    return saveOrders(
        limitedOrders
    );

}


/* ============================================================
   UPDATE ORDER STATUS
   ============================================================ */

function updateOrderStatus(
    orderId,
    status
) {

    const allowedStatuses = [

        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"

    ];


    if (
        !allowedStatuses.includes(
            status
        )
    ) {

        return false;

    }


    const orders =
        getOrders();


    const index =
        orders.findIndex(
            order =>
                String(
                    order.id
                ) ===
                String(
                    orderId
                )
        );


    if (
        index === -1
    ) {

        return false;

    }


    orders[index].status =
        status;


    orders[index].updatedAt =
        new Date().toISOString();


    saveOrders(
        orders
    );


    return true;

}


/* ============================================================
   PLACE ORDER
   ============================================================ */

function placeOrder() {

    const validation =
        validateOrderBeforePlacement();


    if (
        !validation.valid
    ) {

        showToast(
            validation.message,
            "error"
        );

        return false;

    }


    /*
       Re-check stock before creating
       the final order.
    */

    const cartProducts =
        getCartProducts();


    for (
        const product
        of cartProducts
    ) {

        const requested =
            Number(
                product.cartQuantity
            );


        const available =
            Number(
                product.stock
            );


        if (
            requested >
            available
        ) {

            showToast(
                `Only ${available} units of ${product.name} are available.`,
                "error"
            );


            return false;

        }

    }


    const order =
        buildOrderObject();


    const saved =
        saveNewOrder(
            order
        );


    if (!saved) {

        showToast(
            "Unable to save your order.",
            "error"
        );

        return false;

    }


    /*
       Reduce local product stock.
    */

    cartProducts.forEach(
        product => {

            const stock =
                Number(
                    product.stock
                );


            const quantity =
                Number(
                    product.cartQuantity
                );


            product.stock =
                Math.max(
                    0,
                    stock - quantity
                );

        }
    );


    /*
       Persist product changes through
       the existing product storage flow.
    */

    saveProducts();


    /*
       Clear cart only after the order
       has successfully been saved.
    */

    clearCart(
        false
    );


    /*
       Store the most recent order so
       the success screen can access it.
    */

    MyShop.lastOrder =
        order;


    saveToStorage(
        "myshop_last_order",
        order
    );


    closeCheckout();


    showOrderSuccess(
        order
    );


    return true;

}


/* ============================================================
   ORDER SUCCESS SCREEN
   ============================================================ */

function showOrderSuccess(
    order
) {

    let modal =
        getElement(
            "orderSuccessModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderSuccessModal";

        modal.className =
            "modal order-success-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const total =
        order?.pricing?.total ||
        0;


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-order-success
        ></div>


        <div
            class="modal-content order-success-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-order-success
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="order-success-icon"
                aria-hidden="true"
            >
                ✓
            </div>


            <p class="section-eyebrow">
                ORDER CONFIRMED
            </p>


            <h2>
                Thank You!
            </h2>


            <p>
                Your order has been placed
                successfully.
            </p>


            <div class="order-success-number">

                <span>
                    Order Number
                </span>

                <strong>
                    ${escapeHTML(
                        order.id
                    )}
                </strong>

            </div>


            <div class="order-success-total">

                <span>
                    Order Total
                </span>

                <strong>
                    ${formatPrice(
                        total
                    )}
                </strong>

            </div>


            <p class="order-success-note">
                You can view your order details
                from your account.
            </p>


            <div class="order-success-actions">

                <button
                    type="button"
                    class="primary-button"
                    data-view-orders
                >
                    View My Orders
                </button>


                <button
                    type="button"
                    class="secondary-button"
                    data-close-order-success
                >
                    Continue Shopping
                </button>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "order-success";

}


/* ============================================================
   CLOSE ORDER SUCCESS
   ============================================================ */

function closeOrderSuccess() {

    const modal =
        getElement(
            "orderSuccessModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "order-success"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   ORDER SUCCESS EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const place =
            event.target.closest(
                "[data-place-order]"
            );


        if (place) {

            event.preventDefault();


            placeOrder();


            return;

        }


        const close =
            event.target.closest(
                "[data-close-order-success]"
            );


        if (close) {

            event.preventDefault();


            closeOrderSuccess();


            return;

        }


        const ordersButton =
            event.target.closest(
                "[data-view-orders]"
            );


        if (ordersButton) {

            event.preventDefault();


            closeOrderSuccess();


            openOrders();


        }

    }
);


/* ============================================================
   ORDER SUCCESS ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "order-success"
        ) {

            closeOrderSuccess();

        }

    }
);

/* ============================================================
   MyShop Marketplace
   app.js — PART 9B
   My Orders + Order History UI
   ============================================================ */


/* ============================================================
   ORDER STATUS LABEL
   ============================================================ */

function getOrderStatusLabel(
    status
) {

    const labels = {

        pending:
            "Pending",

        confirmed:
            "Confirmed",

        processing:
            "Processing",

        shipped:
            "Shipped",

        delivered:
            "Delivered",

        cancelled:
            "Cancelled"

    };


    return (
        labels[status] ||
        "Pending"
    );

}


/* ============================================================
   ORDER STATUS CLASS
   ============================================================ */

function getOrderStatusClass(
    status
) {

    const allowed = [

        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"

    ];


    return allowed.includes(
        status
    )
        ? status
        : "pending";

}


/* ============================================================
   FORMAT ORDER DATE
   ============================================================ */

function formatOrderDate(
    date
) {

    if (!date) {
        return "Date unavailable";
    }


    const parsed =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return parsed.toLocaleDateString(
        "en-BD",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );

}


/* ============================================================
   CREATE ORDER CARD
   ============================================================ */

function createOrderCardHTML(
    order
) {

    if (!order) {
        return "";
    }


    const itemCount =
        Array.isArray(
            order.items
        )
            ? order.items.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.quantity
                    ),
                0
            )
            : 0;


    const statusClass =
        getOrderStatusClass(
            order.status
        );


    const statusLabel =
        getOrderStatusLabel(
            order.status
        );


    return `

        <article
            class="order-card"
            data-order-id="${escapeHTML(
                order.id
            )}"
        >

            <div class="order-card-header">

                <div>

                    <span class="order-label">
                        Order
                    </span>

                    <strong class="order-number">
                        ${escapeHTML(
                            order.id
                        )}
                    </strong>

                </div>


                <span
                    class="order-status order-status-${statusClass}"
                >
                    ${statusLabel}
                </span>

            </div>


            <div class="order-card-meta">

                <span>
                    ${formatOrderDate(
                        order.createdAt
                    )}
                </span>


                <span>
                    ${itemCount}
                    ${
                        itemCount === 1
                            ? "item"
                            : "items"
                    }
                </span>


                <strong>
                    ${formatPrice(
                        order.pricing?.total ||
                        0
                    )}
                </strong>

            </div>


            <div class="order-card-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-order-details="${
                        escapeHTML(
                            order.id
                        )
                    }"
                >
                    View Details
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   EMPTY ORDERS HTML
   ============================================================ */

function createOrdersEmptyHTML() {

    return `

        <div
            class="orders-empty-state"
            role="status"
        >

            <div
                class="orders-empty-icon"
                aria-hidden="true"
            >
                📦
            </div>


            <h3>
                No orders yet
            </h3>


            <p>
                Your completed orders will
                appear here.
            </p>


            <button
                type="button"
                class="primary-button"
                data-close-orders
            >
                Continue Shopping
            </button>

        </div>

    `;

}


/* ============================================================
   GET CURRENT USER ORDERS
   ============================================================ */

function getCurrentUserOrders() {

    const orders =
        getOrders();


    if (
        !isUserLoggedIn()
    ) {

        return [];

    }


    const user =
        getCurrentUser();


    return orders.filter(
        order =>
            order.userId &&
            String(
                order.userId
            ) ===
            String(
                user.id
            )
    );

}


/* ============================================================
   RENDER ORDERS
   ============================================================ */

function renderOrders() {

    const container =
        getElement(
            "ordersList"
        );


    if (!container) {
        return;
    }


    const orders =
        getCurrentUserOrders();


    if (
        orders.length === 0
    ) {

        container.innerHTML =
            createOrdersEmptyHTML();

        return;

    }


    container.innerHTML =
        orders
            .map(
                createOrderCardHTML
            )
            .join("");

}


/* ============================================================
   OPEN ORDERS
   ============================================================ */

function openOrders() {

    if (
        !isUserLoggedIn()
    ) {

        openAuthModal(
            "login"
        );

        return;

    }


    let modal =
        getElement(
            "ordersModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "ordersModal";

        modal.className =
            "modal orders-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-orders
        ></div>


        <div class="modal-content orders-content">

            <div class="modal-header">

                <div>

                    <p class="section-eyebrow">
                        MYSHOP ACCOUNT
                    </p>

                    <h2>
                        My Orders
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    data-close-orders
                    aria-label="Close orders"
                >
                    ×
                </button>

            </div>


            <div
                class="orders-list"
                id="ordersList"
            ></div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "orders";


    renderOrders();

}


/* ============================================================
   CLOSE ORDERS
   ============================================================ */

function closeOrders() {

    const modal =
        getElement(
            "ordersModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "orders"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   ORDER DETAILS
   ============================================================ */

function openOrderDetails(
    orderId
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        showToast(
            "Order could not be found.",
            "error"
        );

        return;

    }


    let modal =
        getElement(
            "orderDetailsModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderDetailsModal";

        modal.className =
            "modal order-details-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    const paymentNames = {

        cod:
            "Cash on Delivery",

        card:
            "Card Payment",

        "mobile-banking":
            "Mobile Banking"

    };


    const deliveryNames = {

        standard:
            "Standard Delivery",

        express:
            "Express Delivery"

    };


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-order-details
        ></div>


        <div class="modal-content order-details-content">

            <div class="modal-header">

                <div>

                    <p class="section-eyebrow">
                        ORDER DETAILS
                    </p>

                    <h2>
                        ${escapeHTML(
                            order.id
                        )}
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    data-close-order-details
                    aria-label="Close"
                >
                    ×
                </button>

            </div>


            <div class="order-detail-status">

                <span
                    class="order-status order-status-${getOrderStatusClass(
                        order.status
                    )}"
                >
                    ${getOrderStatusLabel(
                        order.status
                    )}
                </span>


                <span>
                    ${formatOrderDate(
                        order.createdAt
                    )}
                </span>

            </div>


            <div class="order-detail-section">

                <h3>
                    Items
                </h3>


                <div class="order-detail-items">

                    ${
                        items
                            .map(
                                item => `

                                    <div
                                        class="order-detail-item"
                                    >

                                        <span>
                                            ${
                                                item.emoji ||
                                                "📦"
                                            }

                                            ${
                                                escapeHTML(
                                                    item.name
                                                )
                                            }

                                            ×
                                            ${
                                                Number(
                                                    item.quantity
                                                )
                                            }
                                        </span>


                                        <strong>
                                            ${formatPrice(
                                                item.lineTotal
                                            )}
                                        </strong>

                                    </div>

                                `
                            )
                            .join("")
                    }

                </div>

            </div>


            <div class="order-detail-section">

                <h3>
                    Delivery
                </h3>


                <p>
                    <strong>
                        ${escapeHTML(
                            order.customer?.name ||
                            ""
                        )}
                    </strong>
                </p>


                <p>
                    ${escapeHTML(
                        order.customer?.phone ||
                        ""
                    )}
                </p>


                <p>
                    ${escapeHTML(
                        order.customer?.address ||
                        ""
                    )},
                    ${escapeHTML(
                        order.customer?.city ||
                        ""
                    )}
                </p>


                <p>
                    ${
                        deliveryNames[
                            order.deliveryMethod
                        ] ||
                        "Standard Delivery"
                    }
                </p>

            </div>


            <div class="order-detail-section">

                <h3>
                    Payment
                </h3>


                <p>
                    ${
                        paymentNames[
                            order.paymentMethod
                        ] ||
                        "Cash on Delivery"
                    }
                </p>

            </div>


            <div class="order-detail-summary">

                <div>

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${formatPrice(
                            order.pricing?.subtotal ||
                            0
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Savings
                    </span>

                    <strong>
                        -${formatPrice(
                            order.pricing?.discount ||
                            0
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Delivery
                    </span>

                    <strong>
                        ${
                            Number(
                                order.pricing?.delivery
                            ) === 0
                                ? "FREE"
                                : formatPrice(
                                    order.pricing?.delivery ||
                                    0
                                )
                        }
                    </strong>

                </div>


                <div class="grand-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(
                            order.pricing?.total ||
                            0
                        )}
                    </strong>

                </div>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "order-details";

}


/* ============================================================
   CLOSE ORDER DETAILS
   ============================================================ */

function closeOrderDetails() {

    const modal =
        getElement(
            "orderDetailsModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "order-details"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   ORDER EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const ordersButton =
            event.target.closest(
                "[data-orders-button]"
            );


        if (ordersButton) {

            event.preventDefault();

            openOrders();

            return;

        }


        const detailsButton =
            event.target.closest(
                "[data-order-details]"
            );


        if (detailsButton) {

            event.preventDefault();

            openOrderDetails(
                detailsButton.dataset.orderDetails
            );

            return;

        }


        const closeOrdersButton =
            event.target.closest(
                "[data-close-orders]"
            );


        if (closeOrdersButton) {

            event.preventDefault();

            closeOrders();

            return;

        }


        const closeDetailsButton =
            event.target.closest(
                "[data-close-order-details]"
            );


        if (closeDetailsButton) {

            event.preventDefault();

            closeOrderDetails();

        }

    }
);


/* ============================================================
   ORDER MODAL ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "orders"
        ) {

            closeOrders();

            return;

        }


        if (
            MyShop.activeModal ===
            "order-details"
        ) {

            closeOrderDetails();

        }

    }
);

/* ============================================================
   MyShop Marketplace
   app.js — PART 10A
   Wishlist + Favorites
   ============================================================ */


/* ============================================================
   GET WISHLIST
   ============================================================ */

function getWishlist() {

    if (
        !Array.isArray(
            MyShop.wishlist
        )
    ) {

        MyShop.wishlist = [];

    }


    return MyShop.wishlist;

}


/* ============================================================
   SAVE WISHLIST
   ============================================================ */

function saveWishlist() {

    return saveToStorage(
        STORAGE_KEYS.wishlist,
        getWishlist()
    );

}


/* ============================================================
   CHECK WISHLIST ITEM
   ============================================================ */

function isInWishlist(
    productId
) {

    return getWishlist().some(
        id =>
            String(id) ===
            String(productId)
    );

}


/* ============================================================
   ADD TO WISHLIST
   ============================================================ */

function addToWishlist(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );

        return false;

    }


    if (
        isInWishlist(
            productId
        )
    ) {

        return false;

    }


    MyShop.wishlist.push(
        product.id
    );


    saveWishlist();

    updateWishlistUI();


    showToast(
        "Added to wishlist.",
        "success"
    );


    return true;

}


/* ============================================================
   REMOVE FROM WISHLIST
   ============================================================ */

function removeFromWishlist(
    productId
) {

    const before =
        MyShop.wishlist.length;


    MyShop.wishlist =
        getWishlist().filter(
            id =>
                String(id) !==
                String(productId)
        );


    const changed =
        before !==
        MyShop.wishlist.length;


    if (changed) {

        saveWishlist();

        updateWishlistUI();

    }


    return changed;

}


/* ============================================================
   TOGGLE WISHLIST
   ============================================================ */

function toggleWishlist(
    productId
) {

    if (
        isInWishlist(
            productId
        )
    ) {

        removeFromWishlist(
            productId
        );


        showToast(
            "Removed from wishlist.",
            "success"
        );


        return false;

    }


    return addToWishlist(
        productId
    );

}


/* ============================================================
   GET WISHLIST PRODUCTS
   ============================================================ */

function getWishlistProducts() {

    return getWishlist()
        .map(
            productId =>
                getProductById(
                    productId
                )
        )
        .filter(
            Boolean
        );

}


/* ============================================================
   UPDATE WISHLIST COUNT
   ============================================================ */

function updateWishlistCount() {

    const count =
        getWishlistProducts()
            .length;


    $$(
        "[data-wishlist-count]"
    ).forEach(
        element => {

            element.textContent =
                count.toLocaleString(
                    "en-BD"
                );

        }
    );


    $$(
        "[data-wishlist-unique-count]"
    ).forEach(
        element => {

            element.textContent =
                count.toLocaleString(
                    "en-BD"
                );

        }
    );

}


/* ============================================================
   UPDATE WISHLIST BUTTONS
   ============================================================ */

function updateWishlistButtons() {

    $$(
        "[data-wishlist-toggle]"
    ).forEach(
        button => {

            const productId =
                button.dataset
                    .wishlistToggle;


            const active =
                isInWishlist(
                    productId
                );


            button.classList.toggle(
                "active",
                active
            );


            button.setAttribute(
                "aria-pressed",
                active
                    ? "true"
                    : "false"
            );


            const label =
                active
                    ? "Remove from wishlist"
                    : "Add to wishlist";


            button.setAttribute(
                "aria-label",
                label
            );


            const text =
                $(
                    "[data-wishlist-text]",
                    button
                );


            if (text) {

                text.textContent =
                    active
                        ? "Saved"
                        : "Wishlist";

            }


            const icon =
                $(
                    "[data-wishlist-icon]",
                    button
                );


            if (icon) {

                icon.textContent =
                    active
                        ? "♥"
                        : "♡";

            }

        }
    );

}


/* ============================================================
   UPDATE WISHLIST UI
   ============================================================ */

function updateWishlistUI() {

    updateWishlistCount();

    updateWishlistButtons();


    const list =
        $(
            "[data-wishlist-list]"
        );


    if (!list) {
        return;
    }


    const products =
        getWishlistProducts();


    if (
        products.length === 0
    ) {

        list.innerHTML = `

            <div
                class="wishlist-empty-state"
            >

                <div
                    class="wishlist-empty-icon"
                    aria-hidden="true"
                >
                    ♡
                </div>


                <h3>
                    Your wishlist is empty
                </h3>


                <p>
                    Save products you love
                    and find them here later.
                </p>

            </div>

        `;


        return;

    }


    list.innerHTML =
        products
            .map(
                createWishlistItemHTML
            )
            .join("");

}


/* ============================================================
   CREATE WISHLIST ITEM
   ============================================================ */

function createWishlistItemHTML(
    product
) {

    if (!product) {
        return "";
    }


    const outOfStock =
        Number(
            product.stock
        ) <= 0;


    return `

        <article
            class="wishlist-item"
            data-wishlist-product="${
                escapeHTML(
                    product.id
                )
            }"
        >

            <div
                class="wishlist-item-image"
                aria-hidden="true"
            >
                ${product.emoji}
            </div>


            <div class="wishlist-item-info">

                <span class="product-category">
                    ${escapeHTML(
                        product.category
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        product.name
                    )}
                </h3>


                <strong class="wishlist-item-price">
                    ${formatPrice(
                        product.price
                    )}
                </strong>


                ${
                    outOfStock
                        ? `
                            <span
                                class="stock-warning"
                            >
                                Out of stock
                            </span>
                          `
                        : `
                            <span
                                class="stock-success"
                            >
                                In stock
                            </span>
                          `
                }

            </div>


            <div
                class="wishlist-item-actions"
            >

                <button
                    type="button"
                    class="primary-button"
                    data-wishlist-add-cart="${
                        escapeHTML(
                            product.id
                        )
                    }"
                    ${
                        outOfStock
                            ? "disabled"
                            : ""
                    }
                >
                    Add to Cart
                </button>


                <button
                    type="button"
                    class="secondary-button"
                    data-wishlist-remove="${
                        escapeHTML(
                            product.id
                        )
                    }"
                >
                    Remove
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   OPEN WISHLIST
   ============================================================ */

function openWishlist() {

    let modal =
        getElement(
            "wishlistModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "wishlistModal";

        modal.className =
            "modal wishlist-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-wishlist
        ></div>


        <div
            class="modal-content wishlist-content"
        >

            <div class="modal-header">

                <div>

                    <p class="section-eyebrow">
                        MYSHOP
                    </p>

                    <h2>
                        My Wishlist
                    </h2>

                </div>


                <button
                    type="button"
                    class="modal-close"
                    data-close-wishlist
                    aria-label="Close wishlist"
                >
                    ×
                </button>

            </div>


            <div
                class="wishlist-list"
                data-wishlist-list
            ></div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "wishlist";


    updateWishlistUI();

}


/* ============================================================
   CLOSE WISHLIST
   ============================================================ */

function closeWishlist() {

    const modal =
        getElement(
            "wishlistModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "wishlist"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   WISHLIST EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const toggle =
            event.target.closest(
                "[data-wishlist-toggle]"
            );


        if (toggle) {

            event.preventDefault();


            toggleWishlist(
                toggle.dataset
                    .wishlistToggle
            );


            return;

        }


        const open =
            event.target.closest(
                "[data-wishlist-button]"
            );


        if (open) {

            event.preventDefault();


            openWishlist();


            return;

        }


        const remove =
            event.target.closest(
                "[data-wishlist-remove]"
            );


        if (remove) {

            event.preventDefault();


            removeFromWishlist(
                remove.dataset
                    .wishlistRemove
            );


            showToast(
                "Removed from wishlist.",
                "success"
            );


            return;

        }


        const addCart =
            event.target.closest(
                "[data-wishlist-add-cart]"
            );


        if (addCart) {

            event.preventDefault();


            const productId =
                addCart.dataset
                    .wishlistAddCart;


            const added =
                addToCart(
                    productId,
                    1
                );


            if (added !== false) {

                removeFromWishlist(
                    productId
                );

            }


            updateWishlistUI();


            return;

        }


        const close =
            event.target.closest(
                "[data-close-wishlist]"
            );


        if (close) {

            event.preventDefault();


            closeWishlist();

        }

    }
);


/* ============================================================
   WISHLIST ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "wishlist"
        ) {

            closeWishlist();

        }

    }
);


/* ============================================================
   LOAD SAVED WISHLIST
   ============================================================ */

const savedWishlist =
    loadFromStorage(
        STORAGE_KEYS.wishlist,
        []
    );


MyShop.wishlist =
    Array.isArray(
        savedWishlist
    )
        ? savedWishlist
        : [];


updateWishlistUI();

/* ============================================================
   MyShop Marketplace
   app.js — PART 10B
   Search + Filter + Sort
   ============================================================ */


/* ============================================================
   SEARCH STATE
   ============================================================ */

function initializeSearchState() {

    if (
        !MyShop.search ||
        typeof MyShop.search !== "object"
    ) {

        MyShop.search = {};

    }


    MyShop.search.query =
        String(
            MyShop.search.query ||
            ""
        );


    MyShop.search.category =
        MyShop.search.category ||
        "all";


    MyShop.search.sort =
        MyShop.search.sort ||
        "default";


    MyShop.search.minPrice =
        Number.isFinite(
            Number(
                MyShop.search.minPrice
            )
        )
            ? Number(
                MyShop.search.minPrice
            )
            : 0;


    MyShop.search.maxPrice =
        Number.isFinite(
            Number(
                MyShop.search.maxPrice
            )
        )
            ? Number(
                MyShop.search.maxPrice
            )
            : Infinity;

}


/* ============================================================
   GET PRODUCT CATEGORIES
   ============================================================ */

function getProductCategories() {

    const products =
        getProducts();


    const categories =
        products
            .map(
                product =>
                    String(
                        product.category ||
                        ""
                    ).trim()
            )
            .filter(Boolean);


    return [
        ...new Set(
            categories
        )
    ]
    .sort(
        (a, b) =>
            a.localeCompare(
                b
            )
    );

}


/* ============================================================
   NORMALIZE SEARCH TEXT
   ============================================================ */

function normalizeSearchText(
    value
) {

    return String(
        value || ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /\s+/g,
        " "
    );

}


/* ============================================================
   MATCH PRODUCT SEARCH
   ============================================================ */

function productMatchesSearch(
    product,
    query
) {

    const normalized =
        normalizeSearchText(
            query
        );


    if (!normalized) {

        return true;

    }


    const searchableText = [

        product.name,

        product.category,

        product.description,

        product.brand,

        ...(Array.isArray(
            product.tags
        )
            ? product.tags
            : [])

    ]
    .filter(Boolean)
    .join(" ");


    return normalizeSearchText(
        searchableText
    )
    .includes(
        normalized
    );

}


/* ============================================================
   MATCH CATEGORY
   ============================================================ */

function productMatchesCategory(
    product,
    category
) {

    if (
        !category ||
        category === "all"
    ) {

        return true;

    }


    return normalizeSearchText(
        product.category
    ) ===
    normalizeSearchText(
        category
    );

}


/* ============================================================
   MATCH PRICE
   ============================================================ */

function productMatchesPrice(
    product,
    minPrice,
    maxPrice
) {

    const price =
        Number(
            product.price
        );


    const min =
        Number.isFinite(
            Number(
                minPrice
            )
        )
            ? Number(
                minPrice
            )
            : 0;


    const max =
        Number.isFinite(
            Number(
                maxPrice
            )
        )
            ? Number(
                maxPrice
            )
            : Infinity;


    return (
        price >= min &&
        price <= max
    );

}


/* ============================================================
   SORT PRODUCTS
   ============================================================ */

function sortProducts(
    products,
    sort
) {

    const result =
        [...products];


    switch (
        String(
            sort || "default"
        )
    ) {

        case "price-low":

            result.sort(
                (a, b) =>
                    Number(
                        a.price
                    ) -
                    Number(
                        b.price
                    )
            );

            break;


        case "price-high":

            result.sort(
                (a, b) =>
                    Number(
                        b.price
                    ) -
                    Number(
                        a.price
                    )
            );

            break;


        case "name-asc":

            result.sort(
                (a, b) =>
                    String(
                        a.name
                    )
                    .localeCompare(
                        String(
                            b.name
                        )
                    )
            );

            break;


        case "name-desc":

            result.sort(
                (a, b) =>
                    String(
                        b.name
                    )
                    .localeCompare(
                        String(
                            a.name
                        )
                    )
            );

            break;


        case "rating-high":

            result.sort(
                (a, b) =>
                    Number(
                        b.rating || 0
                    ) -
                    Number(
                        a.rating || 0
                    )
            );

            break;


        case "newest":

            result.sort(
                (a, b) =>
                    Number(
                        b.createdAt || 0
                    ) -
                    Number(
                        a.createdAt || 0
                    )
            );

            break;


        default:

            break;

    }


    return result;

}


/* ============================================================
   FILTER PRODUCTS
   ============================================================ */

function filterProducts(
    products,
    options = {}
) {

    const source =
        Array.isArray(
            products
        )
            ? products
            : getProducts();


    const query =
        options.query !== undefined
            ? options.query
            : MyShop.search.query;


    const category =
        options.category !== undefined
            ? options.category
            : MyShop.search.category;


    const minPrice =
        options.minPrice !== undefined
            ? options.minPrice
            : MyShop.search.minPrice;


    const maxPrice =
        options.maxPrice !== undefined
            ? options.maxPrice
            : MyShop.search.maxPrice;


    const filtered =
        source.filter(
            product => {

                if (
                    !productMatchesSearch(
                        product,
                        query
                    )
                ) {

                    return false;

                }


                if (
                    !productMatchesCategory(
                        product,
                        category
                    )
                ) {

                    return false;

                }


                if (
                    !productMatchesPrice(
                        product,
                        minPrice,
                        maxPrice
                    )
                ) {

                    return false;

                }


                return true;

            }
        );


    return sortProducts(
        filtered,
        options.sort !== undefined
            ? options.sort
            : MyShop.search.sort
    );

}


/* ============================================================
   UPDATE SEARCH STATE
   ============================================================ */

function updateSearchState(
    data = {}
) {

    if (
        data.query !== undefined
    ) {

        MyShop.search.query =
            String(
                data.query
            );

    }


    if (
        data.category !== undefined
    ) {

        MyShop.search.category =
            String(
                data.category
            );

    }


    if (
        data.sort !== undefined
    ) {

        MyShop.search.sort =
            String(
                data.sort
            );

    }


    if (
        data.minPrice !== undefined
    ) {

        MyShop.search.minPrice =
            Number(
                data.minPrice
            ) || 0;

    }


    if (
        data.maxPrice !== undefined
    ) {

        const max =
            Number(
                data.maxPrice
            );


        MyShop.search.maxPrice =
            Number.isFinite(
                max
            )
                ? max
                : Infinity;

    }


    return {
        ...MyShop.search
    };

}


/* ============================================================
   SEARCH RESULT COUNT
   ============================================================ */

function getSearchResultCount() {

    return filterProducts(
        getProducts()
    ).length;

}


/* ============================================================
   UPDATE SEARCH RESULT COUNT
   ============================================================ */

function updateSearchResultCount() {

    const count =
        getSearchResultCount();


    $$(
        "[data-search-result-count]"
    ).forEach(
        element => {

            element.textContent =
                count.toLocaleString(
                    "en-BD"
                );

        }
    );

}


/* ============================================================
   UPDATE SEARCH INPUTS
   ============================================================ */

function updateSearchInputs() {

    $$(
        "[data-search-input]"
    ).forEach(
        input => {

            if (
                input.value !==
                MyShop.search.query
            ) {

                input.value =
                    MyShop.search.query;

            }

        }
    );


    $$(
        "[data-category-filter]"
    ).forEach(
        select => {

            select.value =
                MyShop.search.category;

        }
    );


    $$(
        "[data-sort-filter]"
    ).forEach(
        select => {

            select.value =
                MyShop.search.sort;

        }
    );

}


/* ============================================================
   RENDER FILTERED PRODUCT LIST
   ============================================================ */

function renderFilteredProducts() {

    const products =
        filterProducts(
            getProducts()
        );


    const containers =
        $$(
            "[data-product-grid]"
        );


    containers.forEach(
        container => {

            if (
                products.length === 0
            ) {

                container.innerHTML = `

                    <div
                        class="search-empty-state"
                    >

                        <div
                            class="search-empty-icon"
                            aria-hidden="true"
                        >
                            🔎
                        </div>


                        <h3>
                            No products found
                        </h3>


                        <p>
                            Try a different
                            search or filter.
                        </p>


                        <button
                            type="button"
                            class="secondary-button"
                            data-clear-search
                        >
                            Clear Filters
                        </button>

                    </div>

                `;


                return;

            }


            container.innerHTML =
                products
                    .map(
                        createProductCardHTML
                    )
                    .join("");

        }
    );


    updateWishlistButtons();

    updateSearchResultCount();

}


/* ============================================================
   CATEGORY FILTER OPTIONS
   ============================================================ */

function populateCategoryFilters() {

    const categories =
        getProductCategories();


    $$(
        "[data-category-filter]"
    ).forEach(
        select => {

            const current =
                select.value ||
                MyShop.search.category;


            select.innerHTML = `

                <option value="all">
                    All Categories
                </option>

                ${
                    categories
                        .map(
                            category => `

                                <option
                                    value="${escapeHTML(
                                        category
                                    )}"
                                >
                                    ${escapeHTML(
                                        category
                                    )}
                                </option>

                            `
                        )
                        .join("")
                }

            `;


            const exists =
                [
                    "all",
                    ...categories
                ]
                .includes(
                    current
                );


            select.value =
                exists
                    ? current
                    : "all";

        }
    );

}


/* ============================================================
   SEARCH INPUT EVENTS
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const searchInput =
            event.target.closest(
                "[data-search-input]"
            );


        if (!searchInput) {
            return;
        }


        updateSearchState({

            query:
                searchInput.value

        });


        renderFilteredProducts();

    }
);


/* ============================================================
   SEARCH CHANGE EVENTS
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const category =
            event.target.closest(
                "[data-category-filter]"
            );


        if (category) {

            updateSearchState({

                category:
                    category.value

            });


            renderFilteredProducts();


            return;

        }


        const sort =
            event.target.closest(
                "[data-sort-filter]"
            );


        if (sort) {

            updateSearchState({

                sort:
                    sort.value

            });


            renderFilteredProducts();


            return;

        }


        const minPrice =
            event.target.closest(
                "[data-min-price]"
            );


        if (minPrice) {

            updateSearchState({

                minPrice:
                    minPrice.value

            });


            renderFilteredProducts();


            return;

        }


        const maxPrice =
            event.target.closest(
                "[data-max-price]"
            );


        if (maxPrice) {

            updateSearchState({

                maxPrice:
                    maxPrice.value

            });


            renderFilteredProducts();

        }

    }
);


/* ============================================================
   CLEAR SEARCH
   ============================================================ */

function clearSearchFilters() {

    updateSearchState({

        query:
            "",

        category:
            "all",

        sort:
            "default",

        minPrice:
            0,

        maxPrice:
            Infinity

    });


    updateSearchInputs();

    renderFilteredProducts();

}


/* ============================================================
   SEARCH CLEAR EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const clear =
            event.target.closest(
                "[data-clear-search]"
            );


        if (clear) {

            event.preventDefault();

            clearSearchFilters();

        }

    }
);


/* ============================================================
   SEARCH SUBMIT
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-search-form]"
            );


        if (!form) {
            return;
        }


        event.preventDefault();


        const input =
            $(
                "[data-search-input]",
                form
            );


        if (input) {

            updateSearchState({

                query:
                    input.value

            });

        }


        renderFilteredProducts();

    }
);


/* ============================================================
   INITIALIZE SEARCH
   ============================================================ */

initializeSearchState();

populateCategoryFilters();

updateSearchInputs();

updateSearchResultCount();


/* ============================================================
   MyShop Marketplace
   app.js — PART 11A
   Product Details + Quick View
   ============================================================ */


/* ============================================================
   PRODUCT DETAILS MODAL
   ============================================================ */

function openProductDetails(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );

        return;

    }


    let modal =
        getElement(
            "productDetailsModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "productDetailsModal";

        modal.className =
            "modal product-details-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const rating =
        Number(
            product.rating || 0
        );


    const reviews =
        Number(
            product.reviews || 0
        );


    const stock =
        Number(
            product.stock || 0
        );


    const inStock =
        stock > 0;


    const wishlistActive =
        isInWishlist(
            product.id
        );


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-product-details
        ></div>


        <div
            class="modal-content product-details-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-product-details
                aria-label="Close product details"
            >
                ×
            </button>


            <div class="product-details-layout">

                <div
                    class="product-details-image"
                    aria-hidden="true"
                >

                    <span>
                        ${product.emoji}
                    </span>

                </div>


                <div class="product-details-info">

                    <span class="product-category">
                        ${escapeHTML(
                            product.category
                        )}
                    </span>


                    <h2>
                        ${escapeHTML(
                            product.name
                        )}
                    </h2>


                    <div
                        class="product-rating"
                        aria-label="Rating ${
                            rating
                        } out of 5"
                    >

                        <span>
                            ${"★".repeat(
                                Math.round(
                                    rating
                                )
                            )}${"☆".repeat(
                                5 -
                                Math.round(
                                    rating
                                )
                            )}
                        </span>

                        <small>
                            ${
                                rating.toFixed(1)
                            }
                            ${
                                reviews
                                    ? `(${reviews} reviews)`
                                    : ""
                            }
                        </small>

                    </div>


                    <div class="product-details-price">

                        <strong>
                            ${formatPrice(
                                product.price
                            )}
                        </strong>

                        ${
                            product.oldPrice &&
                            Number(
                                product.oldPrice
                            ) >
                            Number(
                                product.price
                            )
                                ? `
                                    <del>
                                        ${formatPrice(
                                            product.oldPrice
                                        )}
                                    </del>
                                  `
                                : ""
                        }

                    </div>


                    <p class="product-details-description">

                        ${escapeHTML(
                            product.description ||
                            "A quality product from MyShop."
                        )}

                    </p>


                    <div class="product-stock">

                        ${
                            inStock
                                ? `
                                    <span
                                        class="stock-success"
                                    >
                                        ✓ In Stock
                                    </span>

                                    <small>
                                        ${stock}
                                        available
                                    </small>
                                  `
                                : `
                                    <span
                                        class="stock-warning"
                                    >
                                        Out of Stock
                                    </span>
                                  `
                        }

                    </div>


                    <div class="product-detail-actions">

                        <div
                            class="quantity-selector"
                            data-detail-quantity
                        >

                            <button
                                type="button"
                                data-detail-quantity-decrease
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>


                            <span
                                data-detail-quantity-value
                            >
                                1
                            </span>


                            <button
                                type="button"
                                data-detail-quantity-increase
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>


                        <button
                            type="button"
                            class="primary-button product-detail-add"
                            data-detail-add-cart="${
                                escapeHTML(
                                    product.id
                                )
                            }"
                            ${
                                !inStock
                                    ? "disabled"
                                    : ""
                            }
                        >
                            Add to Cart
                        </button>


                        <button
                            type="button"
                            class="wishlist-detail-button ${
                                wishlistActive
                                    ? "active"
                                    : ""
                            }"
                            data-detail-wishlist="${
                                escapeHTML(
                                    product.id
                                )
                            }"
                            aria-pressed="${
                                wishlistActive
                                    ? "true"
                                    : "false"
                            }"
                        >

                            <span
                                data-detail-wishlist-icon
                            >
                                ${
                                    wishlistActive
                                        ? "♥"
                                        : "♡"
                                }
                            </span>

                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "product-details";


    MyShop.detailProductId =
        product.id;


    MyShop.detailQuantity =
        1;

}


/* ============================================================
   CLOSE PRODUCT DETAILS
   ============================================================ */

function closeProductDetails() {

    const modal =
        getElement(
            "productDetailsModal"
        );


    if (!modal) {
        return;
    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    MyShop.detailProductId =
        null;


    MyShop.detailQuantity =
        1;


    if (
        MyShop.activeModal ===
        "product-details"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   UPDATE DETAIL QUANTITY
   ============================================================ */

function updateDetailQuantity(
    value
) {

    const product =
        getProductById(
            MyShop.detailProductId
        );


    if (!product) {
        return;
    }


    const stock =
        Math.max(
            0,
            Number(
                product.stock || 0
            )
        );


    let quantity =
        Number(
            value
        );


    if (
        !Number.isFinite(
            quantity
        )
    ) {

        quantity =
            1;

    }


    quantity =
        Math.max(
            1,
            Math.min(
                quantity,
                Math.max(
                    stock,
                    1
                )
            )
        );


    MyShop.detailQuantity =
        quantity;


    const display =
        $(
            "[data-detail-quantity-value]"
        );


    if (display) {

        display.textContent =
            quantity;

    }

}


/* ============================================================
   DETAIL QUANTITY INCREASE
   ============================================================ */

function increaseDetailQuantity() {

    updateDetailQuantity(
        Number(
            MyShop.detailQuantity ||
            1
        ) + 1
    );

}


/* ============================================================
   DETAIL QUANTITY DECREASE
   ============================================================ */

function decreaseDetailQuantity() {

    updateDetailQuantity(
        Number(
            MyShop.detailQuantity ||
            1
        ) - 1
    );

}


/* ============================================================
   DETAIL WISHLIST UI
   ============================================================ */

function updateDetailWishlistUI() {

    const productId =
        MyShop.detailProductId;


    if (!productId) {
        return;
    }


    const active =
        isInWishlist(
            productId
        );


    const button =
        $(
            "[data-detail-wishlist]"
        );


    if (button) {

        button.classList.toggle(
            "active",
            active
        );


        button.setAttribute(
            "aria-pressed",
            active
                ? "true"
                : "false"
        );

    }


    const icon =
        $(
            "[data-detail-wishlist-icon]"
        );


    if (icon) {

        icon.textContent =
            active
                ? "♥"
                : "♡";

    }

}


/* ============================================================
   PRODUCT DETAILS EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const openButton =
            event.target.closest(
                "[data-product-details]"
            );


        if (openButton) {

            event.preventDefault();


            openProductDetails(
                openButton.dataset
                    .productDetails
            );


            return;

        }


        const closeButton =
            event.target.closest(
                "[data-close-product-details]"
            );


        if (closeButton) {

            event.preventDefault();


            closeProductDetails();


            return;

        }


        const increase =
            event.target.closest(
                "[data-detail-quantity-increase]"
            );


        if (increase) {

            event.preventDefault();


            increaseDetailQuantity();


            return;

        }


        const decrease =
            event.target.closest(
                "[data-detail-quantity-decrease]"
            );


        if (decrease) {

            event.preventDefault();


            decreaseDetailQuantity();


            return;

        }


        const addButton =
            event.target.closest(
                "[data-detail-add-cart]"
            );


        if (addButton) {

            event.preventDefault();


            const quantity =
                Number(
                    MyShop.detailQuantity ||
                    1
                );


            const added =
                addToCart(
                    addButton.dataset
                        .detailAddCart,
                    quantity
                );


            if (
                added !== false
            ) {

                closeProductDetails();

            }


            return;

        }


        const wishlistButton =
            event.target.closest(
                "[data-detail-wishlist]"
            );


        if (wishlistButton) {

            event.preventDefault();


            toggleWishlist(
                wishlistButton.dataset
                    .detailWishlist
            );


            updateDetailWishlistUI();

        }

    }
);


/* ============================================================
   PRODUCT DETAILS ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "product-details"
        ) {

            closeProductDetails();

        }

    }
);

    

/* ============================================================
   MyShop Marketplace
   app.js — PART 11B
   Recently Viewed + Related Products
   ============================================================ */


/* ============================================================
   RECENTLY VIEWED
   ============================================================ */

function getRecentlyViewed() {

    if (
        !Array.isArray(
            MyShop.recentlyViewed
        )
    ) {

        MyShop.recentlyViewed = [];

    }


    return MyShop.recentlyViewed;

}


/* ============================================================
   SAVE RECENTLY VIEWED
   ============================================================ */

function saveRecentlyViewed() {

    return saveToStorage(
        STORAGE_KEYS.recentlyViewed,
        getRecentlyViewed()
    );

}


/* ============================================================
   ADD RECENTLY VIEWED
   ============================================================ */

function addRecentlyViewed(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {
        return false;
    }


    const current =
        getRecentlyViewed()
            .filter(
                id =>
                    String(id) !==
                    String(product.id)
            );


    current.unshift(
        product.id
    );


    MyShop.recentlyViewed =
        current.slice(
            0,
            12
        );


    saveRecentlyViewed();

    return true;

}


/* ============================================================
   GET RECENTLY VIEWED PRODUCTS
   ============================================================ */

function getRecentlyViewedProducts() {

    return getRecentlyViewed()
        .map(
            id =>
                getProductById(
                    id
                )
        )
        .filter(
            Boolean
        );

}


/* ============================================================
   PRODUCT VIEW TRACKING
   ============================================================ */

function trackProductView(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {
        return;
    }


    addRecentlyViewed(
        product.id
    );


    /*
       Increment local view count
       without breaking the original
       product object structure.
    */

    if (
        typeof product.views !==
        "number"
    ) {

        product.views =
            Number(
                product.views || 0
            );

    }


    product.views += 1;


    saveProducts();

}


/* ============================================================
   GET RELATED PRODUCTS
   ============================================================ */

function getRelatedProducts(
    productId,
    limit = 4
) {

    const current =
        getProductById(
            productId
        );


    if (!current) {
        return [];
    }


    const all =
        getProducts();


    const sameCategory =
        all.filter(
            product =>

                String(
                    product.id
                ) !==
                String(
                    current.id
                ) &&

                normalizeSearchText(
                    product.category
                ) ===
                normalizeSearchText(
                    current.category
                )
        );


    const fallback =
        all.filter(
            product =>
                String(
                    product.id
                ) !==
                String(
                    current.id
                )
        );


    const combined = [
        ...sameCategory,
        ...fallback
    ];


    const unique = [];


    const used =
        new Set();


    combined.forEach(
        product => {

            const key =
                String(
                    product.id
                );


            if (
                used.has(
                    key
                )
            ) {

                return;

            }


            used.add(
                key
            );


            unique.push(
                product
            );

        }
    );


    return unique.slice(
        0,
        Math.max(
            1,
            Number(
                limit
            ) || 4
        )
    );

}


/* ============================================================
   CREATE RECENT PRODUCT CARD
   ============================================================ */

function createRecentProductHTML(
    product
) {

    if (!product) {
        return "";
    }


    const saved =
        isInWishlist(
            product.id
        );


    const stock =
        Number(
            product.stock || 0
        );


    return `

        <article
            class="mini-product-card"
            data-product-id="${
                escapeHTML(
                    product.id
                )
            }"
        >

            <button
                type="button"
                class="mini-product-image"
                data-product-details="${
                    escapeHTML(
                        product.id
                    )
                }"
                aria-label="View ${
                    escapeHTML(
                        product.name
                    )
                }"
            >
                ${product.emoji}
            </button>


            <div class="mini-product-info">

                <span>
                    ${escapeHTML(
                        product.category
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        product.name
                    )}
                </h3>


                <strong>
                    ${formatPrice(
                        product.price
                    )}
                </strong>

            </div>


            <div class="mini-product-actions">

                <button
                    type="button"
                    class="mini-wishlist-button ${
                        saved
                            ? "active"
                            : ""
                    }"
                    data-wishlist-toggle="${
                        escapeHTML(
                            product.id
                        )
                    }"
                    aria-pressed="${
                        saved
                            ? "true"
                            : "false"
                    }"
                >
                    ${
                        saved
                            ? "♥"
                            : "♡"
                    }
                </button>


                <button
                    type="button"
                    class="mini-cart-button"
                    data-recent-add-cart="${
                        escapeHTML(
                            product.id
                        )
                    }"
                    ${
                        stock <= 0
                            ? "disabled"
                            : ""
                    }
                >
                    +
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   RENDER RECENTLY VIEWED
   ============================================================ */

function renderRecentlyViewed() {

    const containers =
        $$(
            "[data-recently-viewed]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    const products =
        getRecentlyViewedProducts();


    containers.forEach(
        container => {

            if (
                products.length === 0
            ) {

                container.innerHTML = "";

                container.hidden =
                    true;

                return;

            }


            container.hidden =
                false;


            container.innerHTML =
                products
                    .map(
                        createRecentProductHTML
                    )
                    .join("");

        }
    );

}


/* ============================================================
   RENDER RELATED PRODUCTS
   ============================================================ */

function renderRelatedProducts(
    productId
) {

    const containers =
        $$(
            "[data-related-products]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    const products =
        getRelatedProducts(
            productId,
            4
        );


    containers.forEach(
        container => {

            container.innerHTML =
                products
                    .map(
                        createProductCardHTML
                    )
                    .join("");

        }
    );


    updateWishlistButtons();

}


/* ============================================================
   UPDATE PRODUCT DETAIL VIEW
   ============================================================ */

function updateProductDetailTracking(
    productId
) {

    trackProductView(
        productId
    );


    renderRecentlyViewed();

    renderRelatedProducts(
        productId
    );

}


/* ============================================================
   RECENT PRODUCT ADD TO CART
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-recent-add-cart]"
            );


        if (!button) {
            return;
        }


        event.preventDefault();


        const productId =
            button.dataset
                .recentAddCart;


        const added =
            addToCart(
                productId,
                1
            );


        if (
            added !== false
        ) {

            showToast(
                "Added to cart.",
                "success"
            );

        }

    }
);


/* ============================================================
   WRAP PRODUCT DETAILS OPENING
   ============================================================ */

const originalOpenProductDetails =
    openProductDetails;


openProductDetails =
    function (
        productId
    ) {

        originalOpenProductDetails(
            productId
        );


        if (
            MyShop.activeModal ===
            "product-details"
        ) {

            updateProductDetailTracking(
                productId
            );

        }

    };


/* ============================================================
   INITIALIZE RECENTLY VIEWED
   ============================================================ */

const savedRecentlyViewed =
    loadFromStorage(
        STORAGE_KEYS.recentlyViewed,
        []
    );


MyShop.recentlyViewed =
    Array.isArray(
        savedRecentlyViewed
    )
        ? savedRecentlyViewed
        : [];


renderRecentlyViewed();
/* ============================================================
   MyShop Marketplace
   app.js — PART 12A
   Coupon + Promo Code System
   ============================================================ */


/* ============================================================
   COUPON DATABASE
   ============================================================ */

const MYSHOP_COUPONS = [

    {
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minimum: 500,
        maximumDiscount: 500,
        title: "10% Welcome Discount"
    },

    {
        code: "SAVE200",
        type: "fixed",
        value: 200,
        minimum: 1000,
        maximumDiscount: 200,
        title: "৳200 Discount"
    },

    {
        code: "MYSHOP15",
        type: "percentage",
        value: 15,
        minimum: 1500,
        maximumDiscount: 750,
        title: "15% MyShop Discount"
    },

    {
        code: "FREESHIP",
        type: "shipping",
        value: 100,
        minimum: 800,
        maximumDiscount: 100,
        title: "Free Delivery"
    }

];


/* ============================================================
   INITIALIZE COUPON STATE
   ============================================================ */

function initializeCouponState() {

    if (
        !MyShop.coupon ||
        typeof MyShop.coupon !== "object"
    ) {

        MyShop.coupon = {

            code: "",

            applied: false,

            discount: 0,

            title: ""

        };

    }


    if (
        typeof MyShop.coupon.code !==
        "string"
    ) {

        MyShop.coupon.code = "";

    }


    MyShop.coupon.applied =
        Boolean(
            MyShop.coupon.applied
        );


    MyShop.coupon.discount =
        Number(
            MyShop.coupon.discount || 0
        );


    MyShop.coupon.title =
        String(
            MyShop.coupon.title || ""
        );

}


/* ============================================================
   FIND COUPON
   ============================================================ */

function findCoupon(
    code
) {

    const normalized =
        String(
            code || ""
        )
        .trim()
        .toUpperCase();


    if (!normalized) {

        return null;

    }


    return (
        MYSHOP_COUPONS.find(
            coupon =>
                coupon.code ===
                normalized
        ) ||
        null
    );

}


/* ============================================================
   GET CART SUBTOTAL FOR COUPON
   ============================================================ */

function getCouponSubtotal() {

    const summary =
        getCheckoutSummary();


    return Number(
        summary?.subtotal || 0
    );

}


/* ============================================================
   CALCULATE COUPON DISCOUNT
   ============================================================ */

function calculateCouponDiscount(
    coupon,
    subtotal
) {

    if (
        !coupon ||
        subtotal <= 0
    ) {

        return 0;

    }


    if (
        subtotal <
        Number(
            coupon.minimum || 0
        )
    ) {

        return 0;

    }


    let discount =
        0;


    if (
        coupon.type ===
        "percentage"
    ) {

        discount =
            subtotal *
            (
                Number(
                    coupon.value
                ) /
                100
            );

    }


    else if (
        coupon.type ===
        "fixed"
    ) {

        discount =
            Number(
                coupon.value || 0
            );

    }


    else if (
        coupon.type ===
        "shipping"
    ) {

        discount =
            0;

    }


    const maximum =
        Number(
            coupon.maximumDiscount
        );


    if (
        Number.isFinite(
            maximum
        ) &&
        maximum > 0
    ) {

        discount =
            Math.min(
                discount,
                maximum
            );

    }


    discount =
        Math.min(
            discount,
            subtotal
        );


    return Math.max(
        0,
        Math.round(
            discount * 100
        ) / 100
    );

}


/* ============================================================
   CHECK COUPON ELIGIBILITY
   ============================================================ */

function validateCoupon(
    code
) {

    const coupon =
        findCoupon(
            code
        );


    if (!coupon) {

        return {

            valid: false,

            coupon: null,

            message:
                "Invalid promo code."

        };

    }


    const subtotal =
        getCouponSubtotal();


    const minimum =
        Number(
            coupon.minimum || 0
        );


    if (
        subtotal <
        minimum
    ) {

        return {

            valid: false,

            coupon,

            message:
                `Minimum order value is ${formatPrice(
                    minimum
                )}.`

        };

    }


    return {

        valid: true,

        coupon,

        message:
            ""

    };

}


/* ============================================================
   APPLY COUPON
   ============================================================ */

function applyCoupon(
    code
) {

    initializeCouponState();


    const validation =
        validateCoupon(
            code
        );


    if (
        !validation.valid
    ) {

        MyShop.coupon = {

            code:
                "",

            applied:
                false,

            discount:
                0,

            title:
                ""

        };


        saveToStorage(
            "myshop_coupon",
            MyShop.coupon
        );


        updateCouponUI();


        showToast(
            validation.message,
            "error"
        );


        return false;

    }


    const coupon =
        validation.coupon;


    const subtotal =
        getCouponSubtotal();


    const discount =
        calculateCouponDiscount(
            coupon,
            subtotal
        );


    MyShop.coupon = {

        code:
            coupon.code,

        applied:
            true,

        discount,

        title:
            coupon.title

    };


    saveToStorage(
        "myshop_coupon",
        MyShop.coupon
    );


    updateCouponUI();


    showToast(
        `${coupon.title} applied.`,
        "success"
    );


    return true;

}


/* ============================================================
   REMOVE COUPON
   ============================================================ */

function removeCoupon() {

    MyShop.coupon = {

        code:
            "",

        applied:
            false,

        discount:
            0,

        title:
            ""

    };


    saveToStorage(
        "myshop_coupon",
        MyShop.coupon
    );


    updateCouponUI();


    showToast(
        "Promo code removed.",
        "success"
    );

}


/* ============================================================
   GET ACTIVE COUPON
   ============================================================ */

function getActiveCoupon() {

    initializeCouponState();


    if (
        !MyShop.coupon.applied ||
        !MyShop.coupon.code
    ) {

        return null;

    }


    return findCoupon(
        MyShop.coupon.code
    );

}


/* ============================================================
   GET ACTIVE COUPON DISCOUNT
   ============================================================ */

function getActiveCouponDiscount() {

    const coupon =
        getActiveCoupon();


    if (!coupon) {

        return 0;

    }


    const subtotal =
        getCouponSubtotal();


    const discount =
        calculateCouponDiscount(
            coupon,
            subtotal
        );


    /*
       Keep the state synchronized
       with the latest cart subtotal.
    */

    MyShop.coupon.discount =
        discount;


    return discount;

}


/* ============================================================
   UPDATE COUPON UI
   ============================================================ */

function updateCouponUI() {

    initializeCouponState();


    const active =
        getActiveCoupon();


    $$(
        "[data-coupon-input]"
    ).forEach(
        input => {

            if (
                active
            ) {

                input.value =
                    active.code;

            }

        }
    );


    $$(
        "[data-coupon-applied]"
    ).forEach(
        element => {

            element.hidden =
                !active;

        }
    );


    $$(
        "[data-coupon-not-applied]"
    ).forEach(
        element => {

            element.hidden =
                Boolean(
                    active
                );

        }
    );


    $$(
        "[data-coupon-code]"
    ).forEach(
        element => {

            element.textContent =
                active
                    ? active.code
                    : "";

        }
    );


    $$(
        "[data-coupon-title]"
    ).forEach(
        element => {

            element.textContent =
                active
                    ? active.title
                    : "";

        }
    );


    $$(
        "[data-coupon-discount]"
    ).forEach(
        element => {

            element.textContent =
                active
                    ? `-${formatPrice(
                        getActiveCouponDiscount()
                    )}`
                    : "";

        }
    );

}


/* ============================================================
   COUPON FORM SUBMIT
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-coupon-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const input =
            $(
                "[data-coupon-input]",
                form
            );


        if (!input) {

            return;

        }


        applyCoupon(
            input.value
        );


        /*
           Recalculate checkout UI
           after applying the coupon.
        */

        if (
            typeof updateCheckoutUI ===
            "function"
        ) {

            updateCheckoutUI();

        }

    }
);


/* ============================================================
   COUPON REMOVE EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const remove =
            event.target.closest(
                "[data-remove-coupon]"
            );


        if (!remove) {

            return;

        }


        event.preventDefault();


        removeCoupon();


        if (
            typeof updateCheckoutUI ===
            "function"
        ) {

            updateCheckoutUI();

        }

    }
);


/* ============================================================
   LOAD SAVED COUPON
   ============================================================ */

const savedCoupon =
    loadFromStorage(
        "myshop_coupon",
        null
    );


if (
    savedCoupon &&
    typeof savedCoupon ===
        "object"
) {

    MyShop.coupon = {

        code:
            String(
                savedCoupon.code ||
                ""
            ),

        applied:
            Boolean(
                savedCoupon.applied
            ),

        discount:
            Number(
                savedCoupon.discount ||
                0
            ),

        title:
            String(
                savedCoupon.title ||
                ""
            )

    };

}


initializeCouponState();

updateCouponUI();

/* ============================================================
   MyShop Marketplace
   app.js — PART 12B
   Checkout Pricing + Coupon Integration
   ============================================================ */


/* ============================================================
   GET BASE DELIVERY FEE
   ============================================================ */

function getBaseDeliveryFee() {

    const deliveryMethod =
        MyShop.checkout?.deliveryMethod ||
        "standard";


    if (
        deliveryMethod ===
        "express"
    ) {

        return 150;

    }


    return 80;

}


/* ============================================================
   GET CHECKOUT DELIVERY FEE
   ============================================================ */

function getCheckoutDeliveryFee() {

    const coupon =
        getActiveCoupon();


    const baseFee =
        getBaseDeliveryFee();


    /*
       FREESHIP removes the standard
       delivery charge.
    */

    if (
        coupon &&
        coupon.type ===
            "shipping"
    ) {

        const subtotal =
            getCouponSubtotal();


        if (
            subtotal >=
            Number(
                coupon.minimum || 0
            )
        ) {

            return 0;

        }

    }


    return baseFee;

}


/* ============================================================
   CALCULATE CHECKOUT PRICING
   ============================================================ */

function calculateCheckoutPricing() {

    const cartProducts =
        getCartProducts();


    const subtotal =
        cartProducts.reduce(
            (
                total,
                product
            ) => {

                const price =
                    Number(
                        product.price || 0
                    );


                const quantity =
                    Number(
                        product.cartQuantity || 0
                    );


                return (
                    total +
                    price *
                    quantity
                );

            },
            0
        );


    const coupon =
        getActiveCoupon();


    let discount =
        0;


    if (coupon) {

        discount =
            calculateCouponDiscount(
                coupon,
                subtotal
            );

    }


    const delivery =
        getCheckoutDeliveryFee();


    const total =
        Math.max(
            0,
            subtotal -
            discount +
            delivery
        );


    return {

        subtotal:
            Math.round(
                subtotal * 100
            ) / 100,

        discount:
            Math.round(
                discount * 100
            ) / 100,

        delivery:
            Math.round(
                delivery * 100
            ) / 100,

        total:
            Math.round(
                total * 100
            ) / 100

    };

}


/* ============================================================
   CHECKOUT SUMMARY
   ============================================================ */

function getCheckoutSummary() {

    return calculateCheckoutPricing();

}


/* ============================================================
   FORMAT CHECKOUT MONEY
   ============================================================ */

function setCheckoutMoney(
    selector,
    value
) {

    $$(selector).forEach(
        element => {

            element.textContent =
                formatPrice(
                    Number(
                        value || 0
                    )
                );

        }
    );

}


/* ============================================================
   UPDATE CHECKOUT TOTALS
   ============================================================ */

function updateCheckoutTotals() {

    const summary =
        calculateCheckoutPricing();


    setCheckoutMoney(
        "[data-checkout-subtotal]",
        summary.subtotal
    );


    setCheckoutMoney(
        "[data-checkout-discount]",
        summary.discount
    );


    setCheckoutMoney(
        "[data-checkout-delivery]",
        summary.delivery
    );


    setCheckoutMoney(
        "[data-checkout-total]",
        summary.total
    );


    $$(
        "[data-checkout-savings]"
    ).forEach(
        element => {

            element.textContent =
                summary.discount >
                0
                    ? `You saved ${formatPrice(
                        summary.discount
                    )}`
                    : "";

        }
    );


    $$(
        "[data-checkout-delivery-label]"
    ).forEach(
        element => {

            element.textContent =
                summary.delivery === 0
                    ? "FREE"
                    : formatPrice(
                        summary.delivery
                    );

        }
    );

}


/* ============================================================
   UPDATE CHECKOUT UI
   ============================================================ */

function updateCheckoutUI() {

    updateCheckoutTotals();

    updateCouponUI();

    updateCartUI();

}


/* ============================================================
   DELIVERY METHOD UI
   ============================================================ */

function updateDeliveryMethodUI() {

    const method =
        MyShop.checkout?.deliveryMethod ||
        "standard";


    $$(
        "[data-delivery-method]"
    ).forEach(
        option => {

            const selected =
                option.dataset
                    .deliveryMethod ===
                method;


            option.classList.toggle(
                "active",
                selected
            );


            option.setAttribute(
                "aria-checked",
                selected
                    ? "true"
                    : "false"
            );


            const radio =
                $(
                    "input[type='radio']",
                    option
                );


            if (radio) {

                radio.checked =
                    selected;

            }

        }
    );


    $$(
        "[data-delivery-fee]"
    ).forEach(
        element => {

            const value =
                method ===
                "express"
                    ? 150
                    : 80;


            element.textContent =
                formatPrice(
                    value
                );

        }
    );

}


/* ============================================================
   SET DELIVERY METHOD
   ============================================================ */

function setDeliveryMethod(
    method
) {

    const allowed = [

        "standard",
        "express"

    ];


    if (
        !allowed.includes(
            method
        )
    ) {

        method =
            "standard";

    }


    if (
        !MyShop.checkout
    ) {

        MyShop.checkout = {};

    }


    MyShop.checkout.deliveryMethod =
        method;


    saveToStorage(
        "myshop_checkout",
        MyShop.checkout
    );


    updateDeliveryMethodUI();

    updateCheckoutUI();

}


/* ============================================================
   DELIVERY METHOD EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const option =
            event.target.closest(
                "[data-delivery-method]"
            );


        if (!option) {

            return;

        }


        event.preventDefault();


        setDeliveryMethod(
            option.dataset
                .deliveryMethod
        );

    }
);


/* ============================================================
   PAYMENT METHOD UI
   ============================================================ */

function updatePaymentMethodUI() {

    const method =
        MyShop.checkout?.paymentMethod ||
        "";


    $$(
        "[data-payment-method]"
    ).forEach(
        option => {

            const selected =
                option.dataset
                    .paymentMethod ===
                method;


            option.classList.toggle(
                "active",
                selected
            );


            option.setAttribute(
                "aria-checked",
                selected
                    ? "true"
                    : "false"
            );


            const radio =
                $(
                    "input[type='radio']",
                    option
                );


            if (radio) {

                radio.checked =
                    selected;

            }

        }
    );

}


/* ============================================================
   SET PAYMENT METHOD
   ============================================================ */

function setPaymentMethod(
    method
) {

    const allowed = [

        "cod",
        "card",
        "mobile-banking"

    ];


    if (
        !allowed.includes(
            method
        )
    ) {

        return false;

    }


    if (
        !MyShop.checkout
    ) {

        MyShop.checkout = {};

    }


    MyShop.checkout.paymentMethod =
        method;


    saveToStorage(
        "myshop_checkout",
        MyShop.checkout
    );


    updatePaymentMethodUI();


    return true;

}


/* ============================================================
   PAYMENT METHOD EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const option =
            event.target.closest(
                "[data-payment-method]"
            );


        if (!option) {

            return;

        }


        event.preventDefault();


        setPaymentMethod(
            option.dataset
                .paymentMethod
        );

    }
);


/* ============================================================
   CHECKOUT PAYMENT CHANGE
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const radio =
            event.target.closest(
                "input[data-payment-method]"
            );


        if (!radio) {

            return;

        }


        setPaymentMethod(
            radio.dataset
                .paymentMethod
        );

    }
);


/* ============================================================
   REFRESH CHECKOUT WHEN CART CHANGES
   ============================================================ */

document.addEventListener(
    "myshop:cart-updated",
    function () {

        updateCheckoutUI();

    }
);


/* ============================================================
   CHECKOUT PRICE REFRESH
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const checkoutField =
            event.target.closest(
                "[data-checkout-field]"
            );


        if (!checkoutField) {

            return;

        }


        if (
            !MyShop.checkout
        ) {

            MyShop.checkout = {};

        }


        MyShop.checkout[
            checkoutField.name
        ] =
            checkoutField.value;


        saveToStorage(
            "myshop_checkout",
            MyShop.checkout
        );

    }
);


/* ============================================================
   INITIAL CHECKOUT STATE
   ============================================================ */

if (
    !MyShop.checkout ||
    typeof MyShop.checkout !==
        "object"
) {

    MyShop.checkout = {};

}


if (
    !MyShop.checkout.deliveryMethod
) {

    MyShop.checkout.deliveryMethod =
        "standard";

}


if (
    !MyShop.checkout.paymentMethod
) {

    MyShop.checkout.paymentMethod =
        "cod";

}


updateDeliveryMethodUI();

updatePaymentMethodUI();

updateCheckoutUI();

/* ============================================================
   MyShop Marketplace
   app.js — PART 13A
   Checkout Customer Information + Validation
   ============================================================ */


/* ============================================================
   CHECKOUT DATA INITIALIZER
   ============================================================ */

function initializeCheckoutData() {

    if (
        !MyShop.checkout ||
        typeof MyShop.checkout !== "object"
    ) {

        MyShop.checkout = {};

    }


    const defaults = {

        name: "",

        phone: "",

        email: "",

        address: "",

        city: "",

        postalCode: "",

        note: "",

        deliveryMethod: "standard",

        paymentMethod: "cod"

    };


    Object.keys(
        defaults
    ).forEach(
        key => {

            if (
                MyShop.checkout[key] ===
                undefined ||
                MyShop.checkout[key] ===
                null
            ) {

                MyShop.checkout[key] =
                    defaults[key];

            }

        }
    );

}


/* ============================================================
   GET CHECKOUT DATA
   ============================================================ */

function getCheckoutData() {

    initializeCheckoutData();


    return {
        ...MyShop.checkout
    };

}


/* ============================================================
   SAVE CHECKOUT DATA
   ============================================================ */

function saveCheckoutData() {

    initializeCheckoutData();


    return saveToStorage(
        "myshop_checkout",
        MyShop.checkout
    );

}


/* ============================================================
   SET CHECKOUT FIELD
   ============================================================ */

function setCheckoutField(
    field,
    value
) {

    initializeCheckoutData();


    if (
        !Object.prototype.hasOwnProperty.call(
            MyShop.checkout,
            field
        )
    ) {

        return false;

    }


    MyShop.checkout[field] =
        String(
            value ?? ""
        );


    saveCheckoutData();


    return true;

}


/* ============================================================
   GET CHECKOUT FIELD
   ============================================================ */

function getCheckoutField(
    field
) {

    initializeCheckoutData();


    return String(
        MyShop.checkout[field] ||
        ""
    );

}


/* ============================================================
   UPDATE CHECKOUT FORM
   ============================================================ */

function updateCheckoutForm() {

    initializeCheckoutData();


    $$(
        "[data-checkout-field]"
    ).forEach(
        field => {

            const name =
                field.name ||
                field.dataset
                    .checkoutField;


            if (!name) {

                return;

            }


            const value =
                getCheckoutField(
                    name
                );


            if (
                field.value !==
                value
            ) {

                field.value =
                    value;

            }

        }
    );


    updateDeliveryMethodUI();

    updatePaymentMethodUI();

}


/* ============================================================
   VALIDATE NAME
   ============================================================ */

function validateCustomerName(
    value
) {

    const name =
        String(
            value || ""
        ).trim();


    if (!name) {

        return "Please enter your full name.";

    }


    if (
        name.length < 2
    ) {

        return "Name must contain at least 2 characters.";

    }


    return "";

}


/* ============================================================
   VALIDATE PHONE
   ============================================================ */

function validateCustomerPhone(
    value
) {

    const phone =
        String(
            value || ""
        )
        .trim()
        .replace(
            /[\s()-]/g,
            ""
        );


    if (!phone) {

        return "Please enter your phone number.";

    }


    /*
       Supports common Bangladeshi
       and international formats.
    */

    const valid =
        /^(?:\+?8801|01)\d{9}$/
            .test(
                phone
            );


    if (!valid) {

        return "Please enter a valid phone number.";

    }


    return "";

}


/* ============================================================
   VALIDATE EMAIL
   ============================================================ */

function validateCustomerEmail(
    value
) {

    const email =
        String(
            value || ""
        )
        .trim()
        .toLowerCase();


    if (!email) {

        return "Please enter your email address.";

    }


    const valid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(
                email
            );


    if (!valid) {

        return "Please enter a valid email address.";

    }


    return "";

}


/* ============================================================
   VALIDATE ADDRESS
   ============================================================ */

function validateCustomerAddress(
    value
) {

    const address =
        String(
            value || ""
        ).trim();


    if (!address) {

        return "Please enter your delivery address.";

    }


    if (
        address.length < 5
    ) {

        return "Please enter a more complete address.";

    }


    return "";

}


/* ============================================================
   VALIDATE CITY
   ============================================================ */

function validateCustomerCity(
    value
) {

    const city =
        String(
            value || ""
        ).trim();


    if (!city) {

        return "Please enter your city.";

    }


    return "";

}


/* ============================================================
   VALIDATE POSTAL CODE
   ============================================================ */

function validateCustomerPostalCode(
    value
) {

    const postal =
        String(
            value || ""
        ).trim();


    if (!postal) {

        return "Please enter your postal code.";

    }


    if (
        !/^\d{4,6}$/.test(
            postal
        )
    ) {

        return "Please enter a valid postal code.";

    }


    return "";

}


/* ============================================================
   VALIDATE CHECKOUT CUSTOMER
   ============================================================ */

function validateCheckoutCustomer() {

    initializeCheckoutData();


    const errors = [];


    const nameError =
        validateCustomerName(
            MyShop.checkout.name
        );


    if (nameError) {

        errors.push(
            nameError
        );

    }


    const phoneError =
        validateCustomerPhone(
            MyShop.checkout.phone
        );


    if (phoneError) {

        errors.push(
            phoneError
        );

    }


    const emailError =
        validateCustomerEmail(
            MyShop.checkout.email
        );


    if (emailError) {

        errors.push(
            emailError
        );

    }


    const addressError =
        validateCustomerAddress(
            MyShop.checkout.address
        );


    if (addressError) {

        errors.push(
            addressError
        );

    }


    const cityError =
        validateCustomerCity(
            MyShop.checkout.city
        );


    if (cityError) {

        errors.push(
            cityError
        );

    }


    const postalError =
        validateCustomerPostalCode(
            MyShop.checkout.postalCode
        );


    if (postalError) {

        errors.push(
            postalError
        );

    }


    return errors;

}


/* ============================================================
   SHOW CHECKOUT FIELD ERROR
   ============================================================ */

function showCheckoutFieldError(
    field,
    message
) {

    if (!field) {

        return;

    }


    field.classList.add(
        "input-error"
    );


    field.setAttribute(
        "aria-invalid",
        "true"
    );


    let error =
        field.parentElement
            ?.querySelector(
                "[data-field-error]"
            );


    if (!error) {

        error =
            document.createElement(
                "small"
            );

        error.dataset.fieldError =
            "true";

        error.className =
            "field-error";


        field.parentElement
            ?.appendChild(
                error
            );

    }


    error.textContent =
        message;

}


/* ============================================================
   CLEAR CHECKOUT FIELD ERROR
   ============================================================ */

function clearCheckoutFieldError(
    field
) {

    if (!field) {

        return;

    }


    field.classList.remove(
        "input-error"
    );


    field.removeAttribute(
        "aria-invalid"
    );


    const error =
        field.parentElement
            ?.querySelector(
                "[data-field-error]"
            );


    if (error) {

        error.remove();

    }

}


/* ============================================================
   VALIDATE CHECKOUT FORM
   ============================================================ */

function validateCheckoutForm(
    form
) {

    initializeCheckoutData();


    if (!form) {

        return false;

    }


    const fields = {

        name:
            form.elements
                .namedItem(
                    "name"
                ),

        phone:
            form.elements
                .namedItem(
                    "phone"
                ),

        email:
            form.elements
                .namedItem(
                    "email"
                ),

        address:
            form.elements
                .namedItem(
                    "address"
                ),

        city:
            form.elements
                .namedItem(
                    "city"
                ),

        postalCode:
            form.elements
                .namedItem(
                    "postalCode"
                )

    };


    const validators = {

        name:
            validateCustomerName,

        phone:
            validateCustomerPhone,

        email:
            validateCustomerEmail,

        address:
            validateCustomerAddress,

        city:
            validateCustomerCity,

        postalCode:
            validateCustomerPostalCode

    };


    let valid =
        true;


    let firstError =
        null;


    Object.keys(
        validators
    ).forEach(
        key => {

            const field =
                fields[key];


            if (!field) {

                return;

            }


            const message =
                validators[key](
                    field.value
                );


            if (message) {

                valid =
                    false;


                showCheckoutFieldError(
                    field,
                    message
                );


                if (!firstError) {

                    firstError =
                        field;

                }

            }

            else {

                clearCheckoutFieldError(
                    field
                );

            }

        }
    );


    if (
        firstError
    ) {

        firstError.focus();

    }


    return valid;

}


/* ============================================================
   CHECKOUT FORM INPUT EVENTS
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const field =
            event.target.closest(
                "[data-checkout-field]"
            );


        if (!field) {

            return;

        }


        const name =
            field.name;


        if (!name) {

            return;

        }


        setCheckoutField(
            name,
            field.value
        );


        clearCheckoutFieldError(
            field
        );

    }
);


/* ============================================================
   CHECKOUT FORM SUBMIT VALIDATION
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-checkout-form]"
            );


        if (!form) {

            return;

        }


        if (
            !validateCheckoutForm(
                form
            )
        ) {

            event.preventDefault();


            showToast(
                "Please complete the required information.",
                "error"
            );

        }

    }
);


/* ============================================================
   LOAD SAVED CHECKOUT DATA
   ============================================================ */

const savedCheckout =
    loadFromStorage(
        "myshop_checkout",
        null
    );


if (
    savedCheckout &&
    typeof savedCheckout ===
        "object"
) {

    MyShop.checkout = {

        ...MyShop.checkout,

        ...savedCheckout

    };

}


initializeCheckoutData();

updateCheckoutForm();

/* ============================================================
   MyShop Marketplace
   app.js — PART 13B
   Order Review + Order Preparation
   ============================================================ */


/* ============================================================
   ORDER STATE
   ============================================================ */

function initializeOrderState() {

    if (
        !MyShop.order ||
        typeof MyShop.order !== "object"
    ) {

        MyShop.order = {

            current: null,

            lastOrderId: null,

            status: "idle"

        };

    }


    if (
        !MyShop.order.status
    ) {

        MyShop.order.status =
            "idle";

    }

}


/* ============================================================
   GET ORDERS
   ============================================================ */

function getOrders() {

    const orders =
        loadFromStorage(
            "myshop_orders",
            []
        );


    return Array.isArray(
        orders
    )
        ? orders
        : [];

}


/* ============================================================
   SAVE ORDERS
   ============================================================ */

function saveOrders(
    orders
) {

    return saveToStorage(
        "myshop_orders",
        Array.isArray(
            orders
        )
            ? orders
            : []
    );

}


/* ============================================================
   GENERATE ORDER ID
   ============================================================ */

function generateOrderId() {

    const now =
        new Date();


    const date =
        now
            .toISOString()
            .slice(
                0,
                10
            )
            .replace(
                /-/g,
                ""
            );


    const random =
        Math.floor(
            100000 +
            Math.random() *
            900000
        );


    return `MS-${date}-${random}`;

}


/* ============================================================
   GET CART SNAPSHOT
   ============================================================ */

function getCartSnapshot() {

    const products =
        getCartProducts();


    return products.map(
        product => {

            const quantity =
                Number(
                    product.cartQuantity ||
                    0
                );


            const price =
                Number(
                    product.price ||
                    0
                );


            return {

                id:
                    product.id,

                name:
                    product.name,

                price,

                quantity,

                emoji:
                    product.emoji || "",

                category:
                    product.category || "",

                total:
                    price *
                    quantity

            };

        }
    );

}


/* ============================================================
   CREATE ORDER PREVIEW
   ============================================================ */

function createOrderPreview() {

    initializeOrderState();


    const customer =
        getCheckoutData();


    const items =
        getCartSnapshot();


    const pricing =
        calculateCheckoutPricing();


    const coupon =
        getActiveCoupon();


    const orderId =
        generateOrderId();


    return {

        id:
            orderId,

        customer: {

            name:
                customer.name,

            phone:
                customer.phone,

            email:
                customer.email,

            address:
                customer.address,

            city:
                customer.city,

            postalCode:
                customer.postalCode,

            note:
                customer.note

        },

        items,

        pricing: {

            subtotal:
                pricing.subtotal,

            discount:
                pricing.discount,

            delivery:
                pricing.delivery,

            total:
                pricing.total

        },

        coupon:
            coupon
                ? {

                    code:
                        coupon.code,

                    title:
                        coupon.title

                }
                : null,

        deliveryMethod:
            customer.deliveryMethod ||
            "standard",

        paymentMethod:
            customer.paymentMethod ||
            "cod",

        status:
            "pending",

        createdAt:
            new Date().toISOString()

    };

}


/* ============================================================
   VALIDATE ORDER PREVIEW
   ============================================================ */

function validateOrderPreview(
    order
) {

    const errors = [];


    if (
        !order ||
        typeof order !== "object"
    ) {

        errors.push(
            "Unable to create order."
        );


        return errors;

    }


    if (
        !Array.isArray(
            order.items
        ) ||
        order.items.length === 0
    ) {

        errors.push(
            "Your cart is empty."
        );

    }


    if (
        !order.customer ||
        !order.customer.name
    ) {

        errors.push(
            "Customer name is required."
        );

    }


    if (
        !order.customer ||
        !order.customer.phone
    ) {

        errors.push(
            "Phone number is required."
        );

    }


    if (
        !order.customer ||
        !order.customer.address
    ) {

        errors.push(
            "Delivery address is required."
        );

    }


    if (
        !Number.isFinite(
            Number(
                order.pricing?.total
            )
        )
    ) {

        errors.push(
            "Invalid order total."
        );

    }


    return errors;

}


/* ============================================================
   SAVE ORDER
   ============================================================ */

function saveOrder(
    order
) {

    const orders =
        getOrders();


    orders.unshift(
        order
    );


    const saved =
        saveOrders(
            orders
        );


    if (saved) {

        MyShop.order.current =
            order;

        MyShop.order.lastOrderId =
            order.id;

        MyShop.order.status =
            "pending";

    }


    return saved;

}


/* ============================================================
   GET ORDER BY ID
   ============================================================ */

function getOrderById(
    orderId
) {

    if (!orderId) {

        return null;

    }


    const orders =
        getOrders();


    return (
        orders.find(
            order =>
                String(
                    order.id
                ) ===
                String(
                    orderId
                )
        ) ||
        null
    );

}


/* ============================================================
   UPDATE ORDER STATUS
   ============================================================ */

function updateOrderStatus(
    orderId,
    status
) {

    const allowed = [

        "pending",

        "confirmed",

        "processing",

        "shipped",

        "delivered",

        "cancelled"

    ];


    if (
        !allowed.includes(
            status
        )
    ) {

        return false;

    }


    const orders =
        getOrders();


    const index =
        orders.findIndex(
            order =>
                String(
                    order.id
                ) ===
                String(
                    orderId
                )
        );


    if (
        index === -1
    ) {

        return false;

    }


    orders[index].status =
        status;


    orders[index].updatedAt =
        new Date().toISOString();


    const saved =
        saveOrders(
            orders
        );


    if (
        saved &&
        MyShop.order.current &&
        String(
            MyShop.order.current.id
        ) ===
        String(
            orderId
        )
    ) {

        MyShop.order.current =
            orders[index];

        MyShop.order.status =
            status;

    }


    return saved;

}


/* ============================================================
   RENDER ORDER REVIEW
   ============================================================ */

function renderOrderReview() {

    const containers =
        $$(
            "[data-order-review]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    const order =
        createOrderPreview();


    containers.forEach(
        container => {

            container.innerHTML = `

                <div
                    class="order-review-section"
                >

                    <h3>
                        Order Summary
                    </h3>


                    <div
                        class="order-review-items"
                    >

                        ${
                            order.items
                                .map(
                                    item => `

                                        <div
                                            class="order-review-item"
                                        >

                                            <span
                                                class="order-review-item-image"
                                            >
                                                ${
                                                    item.emoji
                                                }
                                            </span>


                                            <div
                                                class="order-review-item-info"
                                            >

                                                <strong>
                                                    ${escapeHTML(
                                                        item.name
                                                    )}
                                                </strong>

                                                <small>
                                                    Qty:
                                                    ${
                                                        item.quantity
                                                    }
                                                </small>

                                            </div>


                                            <strong>
                                                ${formatPrice(
                                                    item.total
                                                )}
                                            </strong>

                                        </div>

                                    `
                                )
                                .join("")
                        }

                    </div>


                    <div
                        class="order-review-pricing"
                    >

                        <div>

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${formatPrice(
                                    order.pricing.subtotal
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Discount
                            </span>

                            <strong>
                                -${formatPrice(
                                    order.pricing.discount
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Delivery
                            </span>

                            <strong>
                                ${
                                    order.pricing.delivery === 0
                                        ? "FREE"
                                        : formatPrice(
                                            order.pricing.delivery
                                        )
                                }
                            </strong>

                        </div>


                        <div
                            class="order-review-total"
                        >

                            <span>
                                Total
                            </span>

                            <strong>
                                ${formatPrice(
                                    order.pricing.total
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


/* ============================================================
   PREPARE ORDER FOR CHECKOUT
   ============================================================ */

function prepareOrder() {

    const errors =
        validateCheckoutCustomer();


    if (
        errors.length > 0
    ) {

        showToast(
            errors[0],
            "error"
        );


        return null;

    }


    const cart =
        getCartSnapshot();


    if (
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty.",
            "error"
        );


        return null;

    }


    const order =
        createOrderPreview();


    const orderErrors =
        validateOrderPreview(
            order
        );


    if (
        orderErrors.length > 0
    ) {

        showToast(
            orderErrors[0],
            "error"
        );


        return null;

    }


    MyShop.order.current =
        order;


    MyShop.order.status =
        "ready";


    return order;

}


/* ============================================================
   ORDER REVIEW EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const reviewButton =
            event.target.closest(
                "[data-review-order]"
            );


        if (!reviewButton) {

            return;

        }


        event.preventDefault();


        const order =
            prepareOrder();


        if (!order) {

            return;

        }


        renderOrderReview();


        showToast(
            "Order review is ready.",
            "success"
        );

    }
);


/* ============================================================
   INITIALIZE ORDER STATE
   ============================================================ */

initializeOrderState();


renderOrderReview();

/* ============================================================
   MyShop Marketplace
   app.js — PART 14A
   Place Order + Order Success
   ============================================================ */


/* ============================================================
   PLACE ORDER
   ============================================================ */

function placeOrder() {

    const order =
        prepareOrder();


    if (!order) {

        return false;

    }


    const saved =
        saveOrder(
            order
        );


    if (!saved) {

        showToast(
            "Unable to save your order. Please try again.",
            "error"
        );


        return false;

    }


    /*
       Keep the order ID before
       clearing the shopping cart.
    */

    const orderId =
        order.id;


    /*
       Clear cart only after the
       order has been successfully saved.
    */

    clearCart();


    /*
       Coupon is no longer needed
       after successful checkout.
    */

    removeCouponSilently();


    MyShop.order.status =
        "confirmed";


    if (
        MyShop.order.current
    ) {

        MyShop.order.current.status =
            "confirmed";

    }


    showOrderSuccess(
        order
    );


    return orderId;

}


/* ============================================================
   REMOVE COUPON WITHOUT TOAST
   ============================================================ */

function removeCouponSilently() {

    MyShop.coupon = {

        code:
            "",

        applied:
            false,

        discount:
            0,

        title:
            ""

    };


    saveToStorage(
        "myshop_coupon",
        MyShop.coupon
    );


    updateCouponUI();

}


/* ============================================================
   SHOW ORDER SUCCESS
   ============================================================ */

function showOrderSuccess(
    order
) {

    if (!order) {

        return;

    }


    let modal =
        getElement(
            "orderSuccessModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderSuccessModal";

        modal.className =
            "modal order-success-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-order-success
        ></div>


        <div
            class="modal-content order-success-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-order-success
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="order-success-icon"
                aria-hidden="true"
            >
                ✓
            </div>


            <h2>
                Order Confirmed!
            </h2>


            <p>
                Thank you for shopping with MyShop.
            </p>


            <div
                class="order-success-number"
            >

                <span>
                    Order ID
                </span>

                <strong>
                    ${escapeHTML(
                        order.id
                    )}
                </strong>

            </div>


            <div
                class="order-success-summary"
            >

                <div>

                    <span>
                        Items
                    </span>

                    <strong>
                        ${
                            order.items.reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    Number(
                                        item.quantity ||
                                        0
                                    ),
                                0
                            )
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Delivery
                    </span>

                    <strong>
                        ${
                            order.pricing.delivery === 0
                                ? "FREE"
                                : formatPrice(
                                    order.pricing.delivery
                                )
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(
                            order.pricing.total
                        )}
                    </strong>

                </div>

            </div>


            <div
                class="order-success-actions"
            >

                <button
                    type="button"
                    class="primary-button"
                    data-view-order="${
                        escapeHTML(
                            order.id
                        )
                    }"
                >
                    View Order
                </button>


                <button
                    type="button"
                    class="secondary-button"
                    data-close-order-success
                >
                    Continue Shopping
                </button>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "order-success";


    MyShop.lastOrder =
        order;

}


/* ============================================================
   CLOSE ORDER SUCCESS
   ============================================================ */

function closeOrderSuccess() {

    const modal =
        getElement(
            "orderSuccessModal"
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "order-success"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   ORDER SUCCESS EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const placeButton =
            event.target.closest(
                "[data-place-order]"
            );


        if (placeButton) {

            event.preventDefault();


            const orderId =
                placeOrder();


            if (orderId) {

                placeButton.blur();

            }


            return;

        }


        const closeButton =
            event.target.closest(
                "[data-close-order-success]"
            );


        if (closeButton) {

            event.preventDefault();


            closeOrderSuccess();


            return;

        }


        const viewButton =
            event.target.closest(
                "[data-view-order]"
            );


        if (viewButton) {

            event.preventDefault();


            const orderId =
                viewButton.dataset
                    .viewOrder;


            closeOrderSuccess();


            if (
                typeof openOrderDetails ===
                "function"
            ) {

                openOrderDetails(
                    orderId
                );

            }


            return;

        }

    }
);


/* ============================================================
   PLACE ORDER FORM
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-place-order-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const orderId =
            placeOrder();


        if (orderId) {

            form.reset();

            updateCheckoutForm();

        }

    }
);


/* ============================================================
   ESCAPE ORDER SUCCESS MODAL
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "order-success"
        ) {

            closeOrderSuccess();

        }

    }
);


/* ============================================================
   CHECKOUT BUTTON STATE
   ============================================================ */

function updatePlaceOrderButton() {

    const cart =
        getCartSnapshot();


    const hasItems =
        cart.length > 0;


    $$(
        "[data-place-order]"
    ).forEach(
        button => {

            button.disabled =
                !hasItems;


            button.setAttribute(
                "aria-disabled",
                hasItems
                    ? "false"
                    : "true"
            );

        }
    );

}


/* ============================================================
   CART UPDATE → CHECKOUT BUTTON
   ============================================================ */

document.addEventListener(
    "myshop:cart-updated",
    function () {

        updatePlaceOrderButton();

        renderOrderReview();

    }
);


/* ============================================================
   INITIAL CHECKOUT BUTTON STATE
   ============================================================ */

updatePlaceOrderButton();
renderOrderReview();

/* ============================================================
   MyShop Marketplace
   app.js — PART 14B
   Order History + Order Details + Cancel Order
   ============================================================ */


/* ============================================================
   RENDER ORDER HISTORY
   ============================================================ */

function renderOrderHistory() {

    const containers =
        $$(
            "[data-order-history]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    const orders =
        getOrders();


    containers.forEach(
        container => {

            if (
                orders.length === 0
            ) {

                container.innerHTML = `

                    <div
                        class="empty-orders"
                    >

                        <div
                            class="empty-orders-icon"
                        >
                            📦
                        </div>

                        <h3>
                            No Orders Yet
                        </h3>

                        <p>
                            Your completed orders
                            will appear here.
                        </p>

                    </div>

                `;


                return;

            }


            container.innerHTML =
                orders
                    .map(
                        order =>
                            createOrderHistoryHTML(
                                order
                            )
                    )
                    .join("");

        }
    );

}


/* ============================================================
   CREATE ORDER HISTORY ITEM
   ============================================================ */

function createOrderHistoryHTML(
    order
) {

    const itemCount =
        Array.isArray(
            order.items
        )
            ? order.items.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.quantity ||
                        0
                    ),
                0
            )
            : 0;


    const status =
        String(
            order.status ||
            "pending"
        );


    const created =
        order.createdAt
            ? formatOrderDate(
                order.createdAt
            )
            : "Unknown date";


    return `

        <article
            class="order-history-card"
            data-order-id="${
                escapeHTML(
                    order.id
                )
            }"
        >

            <div
                class="order-history-header"
            >

                <div>

                    <span
                        class="order-history-label"
                    >
                        Order ID
                    </span>

                    <strong>
                        ${escapeHTML(
                            order.id
                        )}
                    </strong>

                </div>


                <span
                    class="order-status order-status-${escapeHTML(
                        status
                    )}"
                >
                    ${formatOrderStatus(
                        status
                    )}
                </span>

            </div>


            <div
                class="order-history-body"
            >

                <div>

                    <span>
                        Date
                    </span>

                    <strong>
                        ${escapeHTML(
                            created
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Items
                    </span>

                    <strong>
                        ${itemCount}
                    </strong>

                </div>


                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(
                            Number(
                                order.pricing?.total ||
                                0
                            )
                        )}
                    </strong>

                </div>

            </div>


            <div
                class="order-history-actions"
            >

                <button
                    type="button"
                    class="secondary-button"
                    data-view-order="${
                        escapeHTML(
                            order.id
                        )
                    }"
                >
                    View Details
                </button>


                ${
                    [
                        "pending",
                        "confirmed"
                    ].includes(
                        status
                    )
                        ? `
                            <button
                                type="button"
                                class="danger-button"
                                data-cancel-order="${
                                    escapeHTML(
                                        order.id
                                    )
                                }"
                            >
                                Cancel Order
                            </button>
                          `
                        : ""
                }

            </div>

        </article>

    `;

}


/* ============================================================
   FORMAT ORDER DATE
   ============================================================ */

function formatOrderDate(
    value
) {

    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";

    }


    return date.toLocaleDateString(
        "en-BD",
        {

            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"

        }
    );

}


/* ============================================================
   FORMAT ORDER STATUS
   ============================================================ */

function formatOrderStatus(
    status
) {

    const labels = {

        pending:
            "Pending",

        confirmed:
            "Confirmed",

        processing:
            "Processing",

        shipped:
            "Shipped",

        delivered:
            "Delivered",

        cancelled:
            "Cancelled"

    };


    return (
        labels[status] ||
        "Pending"
    );

}


/* ============================================================
   OPEN ORDER DETAILS
   ============================================================ */

function openOrderDetails(
    orderId
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        showToast(
            "Order not found.",
            "error"
        );


        return;

    }


    let modal =
        getElement(
            "orderDetailsModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderDetailsModal";

        modal.className =
            "modal order-details-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-order-details
        ></div>


        <div
            class="modal-content order-details-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-order-details
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="order-details-top"
            >

                <div>

                    <span>
                        Order ID
                    </span>

                    <h2>
                        ${escapeHTML(
                            order.id
                        )}
                    </h2>

                </div>


                <span
                    class="order-status order-status-${escapeHTML(
                        order.status
                    )}"
                >
                    ${formatOrderStatus(
                        order.status
                    )}
                </span>

            </div>


            <div
                class="order-details-date"
            >
                ${formatOrderDate(
                    order.createdAt
                )}
            </div>


            <div
                class="order-details-items"
            >

                <h3>
                    Items
                </h3>


                ${
                    items
                        .map(
                            item => `

                                <div
                                    class="order-detail-item"
                                >

                                    <span
                                        class="order-detail-item-image"
                                    >
                                        ${
                                            item.emoji ||
                                            "📦"
                                        }
                                    </span>


                                    <div
                                        class="order-detail-item-info"
                                    >

                                        <strong>
                                            ${escapeHTML(
                                                item.name
                                            )}
                                        </strong>

                                        <small>
                                            Qty:
                                            ${
                                                item.quantity
                                            }
                                        </small>

                                    </div>


                                    <strong>
                                        ${formatPrice(
                                            Number(
                                                item.total ||
                                                0
                                            )
                                        )}
                                    </strong>

                                </div>

                            `
                        )
                        .join("")
                }

            </div>


            <div
                class="order-details-customer"
            >

                <h3>
                    Delivery Information
                </h3>


                <p>
                    <strong>
                        ${escapeHTML(
                            order.customer?.name ||
                            ""
                        )}
                    </strong>
                </p>


                <p>
                    ${escapeHTML(
                        order.customer?.phone ||
                        ""
                    )}
                </p>


                <p>
                    ${escapeHTML(
                        order.customer?.address ||
                        ""
                    )}
                    ${
                        order.customer?.city
                            ? `, ${escapeHTML(
                                order.customer.city
                            )}`
                            : ""
                    }
                    ${
                        order.customer?.postalCode
                            ? ` - ${escapeHTML(
                                order.customer.postalCode
                            )}`
                            : ""
                    }
                </p>

            </div>


            <div
                class="order-details-pricing"
            >

                <div>

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${formatPrice(
                            Number(
                                order.pricing?.subtotal ||
                                0
                            )
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Discount
                    </span>

                    <strong>
                        -${formatPrice(
                            Number(
                                order.pricing?.discount ||
                                0
                            )
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Delivery
                    </span>

                    <strong>
                        ${
                            Number(
                                order.pricing?.delivery ||
                                0
                            ) === 0
                                ? "FREE"
                                : formatPrice(
                                    Number(
                                        order.pricing?.delivery ||
                                        0
                                    )
                                )
                        }
                    </strong>

                </div>


                <div
                    class="order-details-total"
                >

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(
                            Number(
                                order.pricing?.total ||
                                0
                            )
                        )}
                    </strong>

                </div>

            </div>


            <div
                class="order-details-actions"
            >

                ${
                    [
                        "pending",
                        "confirmed"
                    ].includes(
                        order.status
                    )
                        ? `
                            <button
                                type="button"
                                class="danger-button"
                                data-cancel-order="${
                                    escapeHTML(
                                        order.id
                                    )
                                }"
                            >
                                Cancel Order
                            </button>
                          `
                        : ""
                }


                <button
                    type="button"
                    class="secondary-button"
                    data-close-order-details
                >
                    Close
                </button>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "order-details";


    MyShop.viewingOrderId =
        order.id;

}


/* ============================================================
   CLOSE ORDER DETAILS
   ============================================================ */

function closeOrderDetails() {

    const modal =
        getElement(
            "orderDetailsModal"
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "order-details"
    ) {

        MyShop.activeModal =
            null;

    }


    MyShop.viewingOrderId =
        null;

}


/* ============================================================
   CANCEL ORDER
   ============================================================ */

function cancelOrder(
    orderId
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        showToast(
            "Order not found.",
            "error"
        );


        return false;

    }


    if (
        ![
            "pending",
            "confirmed"
        ].includes(
            order.status
        )
    ) {

        showToast(
            "This order cannot be cancelled.",
            "error"
        );


        return false;

    }


    const confirmed =
        window.confirm(
            `Cancel order ${order.id}?`
        );


    if (!confirmed) {

        return false;

    }


    const updated =
        updateOrderStatus(
            order.id,
            "cancelled"
        );


    if (!updated) {

        showToast(
            "Unable to cancel order.",
            "error"
        );


        return false;

    }


    closeOrderDetails();

    renderOrderHistory();


    showToast(
        "Order cancelled successfully.",
        "success"
    );


    return true;

}


/* ============================================================
   ORDER HISTORY EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const view =
            event.target.closest(
                "[data-view-order]"
            );


        if (view) {

            event.preventDefault();


            openOrderDetails(
                view.dataset.viewOrder
            );


            return;

        }


        const cancel =
            event.target.closest(
                "[data-cancel-order]"
            );


        if (cancel) {

            event.preventDefault();


            cancelOrder(
                cancel.dataset
                    .cancelOrder
            );


            return;

        }


        const close =
            event.target.closest(
                "[data-close-order-details]"
            );


        if (close) {

            event.preventDefault();


            closeOrderDetails();

        }

    }
);


/* ============================================================
   ORDER DETAILS ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            MyShop.activeModal ===
                "order-details"
        ) {

            closeOrderDetails();

        }

    }
);


/* ============================================================
   ORDER STORAGE REFRESH
   ============================================================ */

document.addEventListener(
    "myshop:order-updated",
    function () {

        renderOrderHistory();

    }
);


/* ============================================================
   INITIAL ORDER HISTORY RENDER
   ============================================================ */

renderOrderHistory();

/* ============================================================
   MyShop Marketplace
   app.js — PART 15A
   User Profile + Account State
   ============================================================ */


/* ============================================================
   ACCOUNT STATE
   ============================================================ */

function initializeAccountState() {

    if (
        !MyShop.account ||
        typeof MyShop.account !== "object"
    ) {

        MyShop.account = {

            loggedIn: false,

            name: "",

            phone: "",

            email: "",

            avatar: "",

            joinedAt: null

        };

    }


    const defaults = {

        loggedIn: false,

        name: "",

        phone: "",

        email: "",

        avatar: "",

        joinedAt: null

    };


    Object.keys(
        defaults
    ).forEach(
        key => {

            if (
                MyShop.account[key] ===
                    undefined ||
                MyShop.account[key] ===
                    null
            ) {

                MyShop.account[key] =
                    defaults[key];

            }

        }
    );

}


/* ============================================================
   GET ACCOUNT
   ============================================================ */

function getAccount() {

    initializeAccountState();


    return {
        ...MyShop.account
    };

}


/* ============================================================
   SAVE ACCOUNT
   ============================================================ */

function saveAccount() {

    initializeAccountState();


    return saveToStorage(
        "myshop_account",
        MyShop.account
    );

}


/* ============================================================
   CHECK LOGIN STATE
   ============================================================ */

function isLoggedIn() {

    initializeAccountState();


    return Boolean(
        MyShop.account.loggedIn
    );

}


/* ============================================================
   LOGIN USER
   ============================================================ */

function loginUser(
    userData = {}
) {

    initializeAccountState();


    const name =
        String(
            userData.name ||
            ""
        ).trim();


    const phone =
        String(
            userData.phone ||
            ""
        ).trim();


    const email =
        String(
            userData.email ||
            ""
        ).trim()
        .toLowerCase();


    if (
        !name &&
        !phone &&
        !email
    ) {

        showToast(
            "Please provide your account information.",
            "error"
        );


        return false;

    }


    MyShop.account = {

        ...MyShop.account,

        loggedIn:
            true,

        name,

        phone,

        email,

        joinedAt:
            MyShop.account.joinedAt ||
            new Date().toISOString()

    };


    saveAccount();


    /*
       Keep checkout information
       synchronized with the account.
    */

    initializeCheckoutData();


    if (name) {

        MyShop.checkout.name =
            name;

    }


    if (phone) {

        MyShop.checkout.phone =
            phone;

    }


    if (email) {

        MyShop.checkout.email =
            email;

    }


    saveCheckoutData();


    updateAccountUI();

    updateCheckoutForm();


    showToast(
        `Welcome, ${name || "Customer"}!`,
        "success"
    );


    return true;

}


/* ============================================================
   LOGOUT USER
   ============================================================ */

function logoutUser() {

    initializeAccountState();


    MyShop.account.loggedIn =
        false;


    saveAccount();


    updateAccountUI();


    showToast(
        "You have been logged out.",
        "success"
    );


    return true;

}


/* ============================================================
   UPDATE ACCOUNT PROFILE
   ============================================================ */

function updateAccountProfile(
    data = {}
) {

    initializeAccountState();


    if (
        data.name !== undefined
    ) {

        MyShop.account.name =
            String(
                data.name
            ).trim();

    }


    if (
        data.phone !== undefined
    ) {

        MyShop.account.phone =
            String(
                data.phone
            ).trim();

    }


    if (
        data.email !== undefined
    ) {

        MyShop.account.email =
            String(
                data.email
            )
            .trim()
            .toLowerCase();

    }


    if (
        data.avatar !== undefined
    ) {

        MyShop.account.avatar =
            String(
                data.avatar
            ).trim();

    }


    saveAccount();


    initializeCheckoutData();


    MyShop.checkout.name =
        MyShop.account.name;


    MyShop.checkout.phone =
        MyShop.account.phone;


    MyShop.checkout.email =
        MyShop.account.email;


    saveCheckoutData();


    updateAccountUI();

    updateCheckoutForm();


    return true;

}


/* ============================================================
   ACCOUNT DISPLAY NAME
   ============================================================ */

function getAccountDisplayName() {

    initializeAccountState();


    if (
        MyShop.account.name
    ) {

        return MyShop.account.name;

    }


    if (
        MyShop.account.email
    ) {

        return MyShop.account.email;

    }


    return "Guest";

}


/* ============================================================
   ACCOUNT INITIALS
   ============================================================ */

function getAccountInitials() {

    const name =
        getAccountDisplayName();


    if (
        !name ||
        name === "Guest"
    ) {

        return "G";

    }


    const parts =
        name
            .trim()
            .split(
                /\s+/
            )
            .filter(
                Boolean
            );


    if (
        parts.length === 1
    ) {

        return parts[0]
            .slice(
                0,
                2
            )
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[
            parts.length - 1
        ][0]
    ).toUpperCase();

}


/* ============================================================
   UPDATE ACCOUNT UI
   ============================================================ */

function updateAccountUI() {

    initializeAccountState();


    const loggedIn =
        isLoggedIn();


    const displayName =
        getAccountDisplayName();


    const initials =
        getAccountInitials();


    $$(
        "[data-account-name]"
    ).forEach(
        element => {

            element.textContent =
                displayName;

        }
    );


    $$(
        "[data-account-initials]"
    ).forEach(
        element => {

            element.textContent =
                initials;

        }
    );


    $$(
        "[data-account-email]"
    ).forEach(
        element => {

            element.textContent =
                MyShop.account.email ||
                "";

        }
    );


    $$(
        "[data-account-phone]"
    ).forEach(
        element => {

            element.textContent =
                MyShop.account.phone ||
                "";

        }
    );


    $$(
        "[data-authenticated]"
    ).forEach(
        element => {

            element.hidden =
                !loggedIn;

        }
    );


    $$(
        "[data-guest-only]"
    ).forEach(
        element => {

            element.hidden =
                loggedIn;

        }
    );


    $$(
        "[data-logout]"
    ).forEach(
        element => {

            element.hidden =
                !loggedIn;

        }
    );


    $$(
        "[data-login]"
    ).forEach(
        element => {

            element.hidden =
                loggedIn;

        }
    );

}


/* ============================================================
   PROFILE FORM
   ============================================================ */

function updateProfileForm() {

    initializeAccountState();


    $$(
        "[data-profile-field]"
    ).forEach(
        field => {

            const name =
                field.name ||
                field.dataset
                    .profileField;


            if (!name) {

                return;

            }


            if (
                MyShop.account[name] !==
                    undefined
            ) {

                field.value =
                    MyShop.account[name] ||
                    "";

            }

        }
    );

}


/* ============================================================
   PROFILE FORM SUBMIT
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-profile-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const data = {};


        $$(
            "[data-profile-field]",
            form
        ).forEach(
            field => {

                const name =
                    field.name ||
                    field.dataset
                        .profileField;


                if (name) {

                    data[name] =
                        field.value;

                }

            }
        );


        updateAccountProfile(
            data
        );


        showToast(
            "Profile updated successfully.",
            "success"
        );

    }
);


/* ============================================================
   LOGIN FORM
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-login-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const name =
            form.elements
                .namedItem(
                    "name"
                )?.value ||
            "";


        const phone =
            form.elements
                .namedItem(
                    "phone"
                )?.value ||
            "";


        const email =
            form.elements
                .namedItem(
                    "email"
                )?.value ||
            "";


        const success =
            loginUser({

                name,

                phone,

                email

            });


        if (
            success
        ) {

            form.reset();

        }

    }
);


/* ============================================================
   LOGOUT EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const logout =
            event.target.closest(
                "[data-logout]"
            );


        if (!logout) {

            return;

        }


        event.preventDefault();


        logoutUser();

    }
);


/* ============================================================
   LOAD SAVED ACCOUNT
   ============================================================ */

const savedAccount =
    loadFromStorage(
        "myshop_account",
        null
    );


if (
    savedAccount &&
    typeof savedAccount ===
        "object"
) {

    MyShop.account = {

        ...MyShop.account,

        ...savedAccount

    };

}


initializeAccountState();

updateAccountUI();

updateProfileForm();

/* ============================================================
   MyShop Marketplace
   app.js — PART 15B
   Authentication + Account Modal UI
   ============================================================ */


/* ============================================================
   AUTH MODAL STATE
   ============================================================ */

function openAuthModal(
    mode = "login"
) {

    let modal =
        getElement(
            "authModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "authModal";

        modal.className =
            "modal auth-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const registerMode =
        mode ===
        "register";


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-auth
        ></div>


        <div
            class="modal-content auth-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-auth
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="auth-header"
            >

                <div
                    class="auth-icon"
                    aria-hidden="true"
                >
                    👤
                </div>


                <h2>
                    ${
                        registerMode
                            ? "Create Account"
                            : "Welcome Back"
                    }
                </h2>


                <p>
                    ${
                        registerMode
                            ? "Create your MyShop account."
                            : "Sign in to continue shopping."
                    }
                </p>

            </div>


            <form
                data-login-form
                class="auth-form"
            >

                ${
                    registerMode
                        ? `
                            <div
                                class="form-group"
                            >

                                <label
                                    for="authName"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="authName"
                                    type="text"
                                    name="name"
                                    autocomplete="name"
                                    placeholder="Enter your name"
                                    required
                                >

                            </div>
                          `
                        : ""
                }


                <div
                    class="form-group"
                >

                    <label
                        for="authEmail"
                    >
                        Email
                    </label>

                    <input
                        id="authEmail"
                        type="email"
                        name="email"
                        autocomplete="email"
                        placeholder="Enter your email"
                        required
                    >

                </div>


                <div
                    class="form-group"
                >

                    <label
                        for="authPhone"
                    >
                        Phone
                    </label>

                    <input
                        id="authPhone"
                        type="tel"
                        name="phone"
                        autocomplete="tel"
                        placeholder="01XXXXXXXXX"
                        required
                    >

                </div>


                <button
                    type="submit"
                    class="primary-button auth-submit"
                >
                    ${
                        registerMode
                            ? "Create Account"
                            : "Sign In"
                    }
                </button>

            </form>


            <div
                class="auth-switch"
            >

                <span>
                    ${
                        registerMode
                            ? "Already have an account?"
                            : "Don't have an account?"
                    }
                </span>


                <button
                    type="button"
                    class="text-button"
                    data-auth-switch="${
                        registerMode
                            ? "login"
                            : "register"
                    }"
                >
                    ${
                        registerMode
                            ? "Sign In"
                            : "Create Account"
                    }
                </button>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "auth";


    MyShop.authMode =
        mode;


    const firstInput =
        $(
            "input",
            modal
        );


    if (firstInput) {

        setTimeout(
            () =>
                firstInput.focus(),
            50
        );

    }

}


/* ============================================================
   CLOSE AUTH MODAL
   ============================================================ */

function closeAuthModal() {

    const modal =
        getElement(
            "authModal"
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "auth"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   OPEN ACCOUNT MODAL
   ============================================================ */

function openAccountModal() {

    if (
        !isLoggedIn()
    ) {

        openAuthModal(
            "login"
        );


        return;

    }


    let modal =
        getElement(
            "accountModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "accountModal";

        modal.className =
            "modal account-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const account =
        getAccount();


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-account
        ></div>


        <div
            class="modal-content account-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-account
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="account-profile-header"
            >

                <div
                    class="account-avatar"
                >
                    ${
                        account.avatar
                            ? `
                                <img
                                    src="${escapeHTML(
                                        account.avatar
                                    )}"
                                    alt=""
                                >
                              `
                            : `
                                <span>
                                    ${getAccountInitials()}
                                </span>
                              `
                    }
                </div>


                <div>

                    <h2>
                        ${escapeHTML(
                            getAccountDisplayName()
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(
                            account.email ||
                            account.phone ||
                            ""
                        )}
                    </p>

                </div>

            </div>


            <form
                data-profile-form
                class="profile-form"
            >

                <div
                    class="form-group"
                >

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        data-profile-field
                        value="${escapeHTML(
                            account.name
                        )}"
                        autocomplete="name"
                    >

                </div>


                <div
                    class="form-group"
                >

                    <label>
                        Phone
                    </label>

                    <input
                        type="tel"
                        name="phone"
                        data-profile-field
                        value="${escapeHTML(
                            account.phone
                        )}"
                        autocomplete="tel"
                    >

                </div>


                <div
                    class="form-group"
                >

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        data-profile-field
                        value="${escapeHTML(
                            account.email
                        )}"
                        autocomplete="email"
                    >

                </div>


                <button
                    type="submit"
                    class="primary-button"
                >
                    Save Changes
                </button>

            </form>


            <div
                class="account-menu"
            >

                <button
                    type="button"
                    data-account-orders
                >
                    📦
                    <span>
                        My Orders
                    </span>
                </button>


                <button
                    type="button"
                    data-account-wishlist
                >
                    ♥
                    <span>
                        Wishlist
                    </span>
                </button>


                <button
                    type="button"
                    data-account-close
                >
                    ✕
                    <span>
                        Close
                    </span>
                </button>

            </div>


            <button
                type="button"
                class="danger-button account-logout"
                data-logout
            >
                Log Out
            </button>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "account";

}


/* ============================================================
   CLOSE ACCOUNT MODAL
   ============================================================ */

function closeAccountModal() {

    const modal =
        getElement(
            "accountModal"
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "account"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   AUTH / ACCOUNT BUTTON EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const loginButton =
            event.target.closest(
                "[data-login]"
            );


        if (
            loginButton &&
            !isLoggedIn()
        ) {

            event.preventDefault();


            openAuthModal(
                "login"
            );


            return;

        }


        const registerButton =
            event.target.closest(
                "[data-register]"
            );


        if (registerButton) {

            event.preventDefault();


            openAuthModal(
                "register"
            );


            return;

        }


        const accountButton =
            event.target.closest(
                "[data-account]"
            );


        if (accountButton) {

            event.preventDefault();


            openAccountModal();


            return;

        }


        const closeAuth =
            event.target.closest(
                "[data-close-auth]"
            );


        if (closeAuth) {

            event.preventDefault();


            closeAuthModal();


            return;

        }


        const closeAccount =
            event.target.closest(
                "[data-close-account]"
            );


        if (closeAccount) {

            event.preventDefault();


            closeAccountModal();


            return;

        }


        const accountClose =
            event.target.closest(
                "[data-account-close]"
            );


        if (accountClose) {

            event.preventDefault();


            closeAccountModal();


            return;

        }


        const switchButton =
            event.target.closest(
                "[data-auth-switch]"
            );


        if (switchButton) {

            event.preventDefault();


            openAuthModal(
                switchButton.dataset
                    .authSwitch
            );


            return;

        }


        const ordersButton =
            event.target.closest(
                "[data-account-orders]"
            );


        if (ordersButton) {

            event.preventDefault();


            closeAccountModal();


            $$(
                "[data-order-history]"
            ).forEach(
                container => {

                    container.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }
            );


            return;

        }


        const wishlistButton =
            event.target.closest(
                "[data-account-wishlist]"
            );


        if (wishlistButton) {

            event.preventDefault();


            closeAccountModal();


            const wishlistSection =
                $(
                    "[data-wishlist-section]"
                );


            if (
                wishlistSection
            ) {

                wishlistSection.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }


            return;

        }

    }
);


/* ============================================================
   AUTH / ACCOUNT ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "auth"
        ) {

            closeAuthModal();


            return;

        }


        if (
            MyShop.activeModal ===
            "account"
        ) {

            closeAccountModal();

        }

    }
);


/* ============================================================
   REFRESH ACCOUNT UI AFTER LOGIN
   ============================================================ */

document.addEventListener(
    "myshop:account-updated",
    function () {

        updateAccountUI();

        updateProfileForm();

    }
);


/* ============================================================
   FINAL INITIALIZATION
   ============================================================ */

initializeAccountState();

updateAccountUI();

updateProfileForm();

/* ============================================================
   MyShop Marketplace
   app.js — PART 16A
   Wishlist System + Wishlist UI
   ============================================================ */


/* ============================================================
   WISHLIST STATE
   ============================================================ */

function initializeWishlistState() {

    if (
        !Array.isArray(
            MyShop.wishlist
        )
    ) {

        MyShop.wishlist = [];

    }

}


/* ============================================================
   GET WISHLIST
   ============================================================ */

function getWishlist() {

    initializeWishlistState();


    return [
        ...MyShop.wishlist
    ];

}


/* ============================================================
   SAVE WISHLIST
   ============================================================ */

function saveWishlist() {

    initializeWishlistState();


    return saveToStorage(
        "myshop_wishlist",
        MyShop.wishlist
    );

}


/* ============================================================
   CHECK WISHLIST
   ============================================================ */

function isInWishlist(
    productId
) {

    initializeWishlistState();


    return MyShop.wishlist.some(
        id =>
            String(id) ===
            String(productId)
    );

}


/* ============================================================
   ADD TO WISHLIST
   ============================================================ */

function addToWishlist(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );


        return false;

    }


    if (
        isInWishlist(
            product.id
        )
    ) {

        return true;

    }


    MyShop.wishlist.push(
        product.id
    );


    saveWishlist();

    updateWishlistUI();


    showToast(
        `${product.name} added to wishlist.`,
        "success"
    );


    return true;

}


/* ============================================================
   REMOVE FROM WISHLIST
   ============================================================ */

function removeFromWishlist(
    productId
) {

    initializeWishlistState();


    const before =
        MyShop.wishlist.length;


    MyShop.wishlist =
        MyShop.wishlist.filter(
            id =>
                String(id) !==
                String(productId)
        );


    const changed =
        before !==
        MyShop.wishlist.length;


    if (changed) {

        saveWishlist();

        updateWishlistUI();

    }


    return changed;

}


/* ============================================================
   TOGGLE WISHLIST
   ============================================================ */

function toggleWishlist(
    productId
) {

    if (
        isInWishlist(
            productId
        )
    ) {

        removeFromWishlist(
            productId
        );


        showToast(
            "Removed from wishlist.",
            "success"
        );


        return false;

    }


    addToWishlist(
        productId
    );


    return true;

}


/* ============================================================
   GET WISHLIST PRODUCTS
   ============================================================ */

function getWishlistProducts() {

    initializeWishlistState();


    return MyShop.wishlist
        .map(
            id =>
                getProductById(
                    id
                )
        )
        .filter(
            Boolean
        );

}


/* ============================================================
   WISHLIST COUNT
   ============================================================ */

function getWishlistCount() {

    return getWishlistProducts()
        .length;

}


/* ============================================================
   UPDATE WISHLIST COUNT
   ============================================================ */

function updateWishlistCount() {

    const count =
        getWishlistCount();


    $$(
        "[data-wishlist-count]"
    ).forEach(
        element => {

            element.textContent =
                count;

            element.hidden =
                count === 0;

        }
    );


    $$(
        "[data-wishlist-total]"
    ).forEach(
        element => {

            element.textContent =
                count;

        }
    );

}


/* ============================================================
   UPDATE WISHLIST BUTTONS
   ============================================================ */

function updateWishlistButtons() {

    $$(
        "[data-wishlist-toggle]"
    ).forEach(
        button => {

            const productId =
                button.dataset
                    .wishlistToggle;


            const active =
                isInWishlist(
                    productId
                );


            button.classList.toggle(
                "active",
                active
            );


            button.setAttribute(
                "aria-pressed",
                active
                    ? "true"
                    : "false"
            );


            const icon =
                button.querySelector(
                    "[data-wishlist-icon]"
                );


            if (icon) {

                icon.textContent =
                    active
                        ? "♥"
                        : "♡";

            }

        }
    );


    updateDetailWishlistUIIfAvailable();

}


/* ============================================================
   SAFE DETAIL WISHLIST UI UPDATE
   ============================================================ */

function updateDetailWishlistUIIfAvailable() {

    if (
        typeof updateDetailWishlistUI !==
        "function"
    ) {

        return;

    }


    if (
        !MyShop.detailProductId
    ) {

        return;

    }


    updateDetailWishlistUI();

}


/* ============================================================
   CREATE WISHLIST ITEM
   ============================================================ */

function createWishlistItemHTML(
    product
) {

    if (!product) {

        return "";

    }


    const stock =
        Number(
            product.stock || 0
        );


    return `

        <article
            class="wishlist-item"
            data-wishlist-product="${
                escapeHTML(
                    product.id
                )
            }"
        >

            <button
                type="button"
                class="wishlist-item-image"
                data-product-details="${
                    escapeHTML(
                        product.id
                    )
                }"
                aria-label="View ${
                    escapeHTML(
                        product.name
                    )
                }"
            >

                <span>
                    ${product.emoji}
                </span>

            </button>


            <div
                class="wishlist-item-info"
            >

                <span
                    class="product-category"
                >
                    ${escapeHTML(
                        product.category
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        product.name
                    )}
                </h3>


                <strong>
                    ${formatPrice(
                        product.price
                    )}
                </strong>


                ${
                    stock > 0
                        ? `
                            <small
                                class="stock-success"
                            >
                                In Stock
                            </small>
                          `
                        : `
                            <small
                                class="stock-warning"
                            >
                                Out of Stock
                            </small>
                          `
                }

            </div>


            <div
                class="wishlist-item-actions"
            >

                <button
                    type="button"
                    class="primary-button"
                    data-wishlist-add-cart="${
                        escapeHTML(
                            product.id
                        )
                    }"
                    ${
                        stock <= 0
                            ? "disabled"
                            : ""
                    }
                >
                    Add to Cart
                </button>


                <button
                    type="button"
                    class="remove-wishlist-button"
                    data-wishlist-remove="${
                        escapeHTML(
                            product.id
                        )
                    }"
                    aria-label="Remove from wishlist"
                >
                    ×
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   RENDER WISHLIST
   ============================================================ */

function renderWishlist() {

    const containers =
        $$(
            "[data-wishlist]"
        );


    if (
        containers.length === 0
    ) {

        updateWishlistCount();

        updateWishlistButtons();

        return;

    }


    const products =
        getWishlistProducts();


    containers.forEach(
        container => {

            if (
                products.length === 0
            ) {

                container.innerHTML = `

                    <div
                        class="empty-wishlist"
                    >

                        <div
                            class="empty-wishlist-icon"
                        >
                            ♡
                        </div>


                        <h3>
                            Your Wishlist is Empty
                        </h3>


                        <p>
                            Save products you love
                            and find them here later.
                        </p>

                    </div>

                `;


                return;

            }


            container.innerHTML =
                products
                    .map(
                        createWishlistItemHTML
                    )
                    .join("");

        }
    );


    updateWishlistCount();

    updateWishlistButtons();

}


/* ============================================================
   WISHLIST EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const toggle =
            event.target.closest(
                "[data-wishlist-toggle]"
            );


        if (toggle) {

            event.preventDefault();


            toggleWishlist(
                toggle.dataset
                    .wishlistToggle
            );


            renderWishlist();


            return;

        }


        const remove =
            event.target.closest(
                "[data-wishlist-remove]"
            );


        if (remove) {

            event.preventDefault();


            removeFromWishlist(
                remove.dataset
                    .wishlistRemove
            );


            renderWishlist();


            showToast(
                "Removed from wishlist.",
                "success"
            );


            return;

        }


        const addCart =
            event.target.closest(
                "[data-wishlist-add-cart]"
            );


        if (addCart) {

            event.preventDefault();


            const added =
                addToCart(
                    addCart.dataset
                        .wishlistAddCart,
                    1
                );


            if (
                added !== false
            ) {

                showToast(
                    "Added to cart.",
                    "success"
                );

            }


            return;

        }

    }
);


/* ============================================================
   WISHLIST STORAGE
   ============================================================ */

const savedWishlist =
    loadFromStorage(
        "myshop_wishlist",
        []
    );


MyShop.wishlist =
    Array.isArray(
        savedWishlist
    )
        ? savedWishlist
        : [];


initializeWishlistState();

renderWishlist();

updateWishlistCount();

updateWishlistButtons();


/* ============================================================
   MyShop Marketplace
   app.js — PART 16B
   Wishlist Modal + Wishlist Navigation
   ============================================================ */


/* ============================================================
   OPEN WISHLIST MODAL
   ============================================================ */

function openWishlistModal() {

    let modal =
        getElement(
            "wishlistModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "wishlistModal";

        modal.className =
            "modal wishlist-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-wishlist
        ></div>


        <div
            class="modal-content wishlist-modal-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-wishlist
                aria-label="Close wishlist"
            >
                ×
            </button>


            <div
                class="wishlist-modal-header"
            >

                <div>

                    <span
                        class="wishlist-modal-icon"
                    >
                        ♥
                    </span>

                </div>


                <div>

                    <h2>
                        My Wishlist
                    </h2>

                    <p>
                        <span
                            data-wishlist-total
                        >
                            0
                        </span>
                        saved products
                    </p>

                </div>

            </div>


            <div
                class="wishlist-modal-list"
                data-wishlist
            ></div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "wishlist";


    renderWishlist();

}


/* ============================================================
   CLOSE WISHLIST MODAL
   ============================================================ */

function closeWishlistModal() {

    const modal =
        getElement(
            "wishlistModal"
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "wishlist"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   WISHLIST NAVIGATION
   ============================================================ */

function navigateToWishlist() {

    /*
       If a wishlist section exists on
       the current page, scroll to it.
    */

    const section =
        $(
            "[data-wishlist-section]"
        );


    if (section) {

        section.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });


        return;

    }


    /*
       Otherwise open the modal.
    */

    openWishlistModal();

}


/* ============================================================
   WISHLIST BUTTON EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const wishlistButton =
            event.target.closest(
                "[data-open-wishlist]"
            );


        if (
            wishlistButton
        ) {

            event.preventDefault();


            navigateToWishlist();


            return;

        }


        const closeButton =
            event.target.closest(
                "[data-close-wishlist]"
            );


        if (
            closeButton
        ) {

            event.preventDefault();


            closeWishlistModal();


            return;

        }

    }
);


/* ============================================================
   PRODUCT DETAILS WISHLIST BUTTON
   ============================================================ */

function updateProductWishlistButton(
    button,
    productId
) {

    if (!button) {

        return;

    }


    const active =
        isInWishlist(
            productId
        );


    button.classList.toggle(
        "active",
        active
    );


    button.setAttribute(
        "aria-pressed",
        active
            ? "true"
            : "false"
    );


    const icon =
        button.querySelector(
            "[data-wishlist-icon]"
        );


    if (icon) {

        icon.textContent =
            active
                ? "♥"
                : "♡";

    }


    const label =
        button.querySelector(
            "[data-wishlist-label]"
        );


    if (label) {

        label.textContent =
            active
                ? "Remove from Wishlist"
                : "Add to Wishlist";

    }

}


/* ============================================================
   UPDATE ALL PRODUCT DETAIL WISHLIST UI
   ============================================================ */

function updateAllProductWishlistButtons() {

    $$(
        "[data-product-wishlist]"
    ).forEach(
        button => {

            const productId =
                button.dataset
                    .productWishlist;


            updateProductWishlistButton(
                button,
                productId
            );

        }
    );

}


/* ============================================================
   PRODUCT DETAIL WISHLIST EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-product-wishlist]"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        const productId =
            button.dataset
                .productWishlist;


        const active =
            toggleWishlist(
                productId
            );


        updateProductWishlistButton(
            button,
            productId
        );


        renderWishlist();


        /*
           active === true means the
           product has just been added.
        */

        if (active) {

            showToast(
                "Added to wishlist.",
                "success"
            );

        }
        else {

            showToast(
                "Removed from wishlist.",
                "success"
            );

        }

    }
);


/* ============================================================
   WISHLIST PRODUCT DETAILS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const productButton =
            event.target.closest(
                "[data-product-details]"
            );


        if (!productButton) {

            return;

        }


        const productId =
            productButton.dataset
                .productDetails;


        if (
            typeof openProductDetails ===
            "function"
        ) {

            openProductDetails(
                productId
            );

        }

    }
);


/* ============================================================
   WISHLIST MODAL ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "wishlist"
        ) {

            closeWishlistModal();

        }

    }
);


/* ============================================================
   WISHLIST UPDATE EVENT
   ============================================================ */

document.addEventListener(
    "myshop:wishlist-updated",
    function () {

        renderWishlist();

        updateWishlistCount();

        updateWishlistButtons();

        updateAllProductWishlistButtons();

    }
);


/* ============================================================
   DISPATCH WISHLIST UPDATE EVENT
   ============================================================ */

function notifyWishlistUpdated() {

    document.dispatchEvent(
        new CustomEvent(
            "myshop:wishlist-updated"
        )
    );

}


/* ============================================================
   PATCH WISHLIST ACTIONS
   ============================================================ */

function refreshWishlistAfterChange() {

    updateWishlistCount();

    updateWishlistButtons();

    updateAllProductWishlistButtons();

    renderWishlist();

}


/* ============================================================
   INITIAL WISHLIST UI
   ============================================================ */

initializeWishlistState();

refreshWishlistAfterChange();


/* ============================================================
   MyShop Marketplace
   app.js — PART 17A
   Search + Filter + Sort System
   ============================================================ */


/* ============================================================
   PRODUCT FILTER STATE
   ============================================================ */

function initializeFilterState() {

    if (
        !MyShop.filters ||
        typeof MyShop.filters !== "object"
    ) {

        MyShop.filters = {

            search: "",

            category: "all",

            minPrice: "",

            maxPrice: "",

            sort: "default",

            stockOnly: false

        };

    }


    const defaults = {

        search: "",

        category: "all",

        minPrice: "",

        maxPrice: "",

        sort: "default",

        stockOnly: false

    };


    Object.keys(
        defaults
    ).forEach(
        key => {

            if (
                MyShop.filters[key] ===
                    undefined ||
                MyShop.filters[key] ===
                    null
            ) {

                MyShop.filters[key] =
                    defaults[key];

            }

        }
    );

}


/* ============================================================
   GET FILTER STATE
   ============================================================ */

function getFilterState() {

    initializeFilterState();


    return {
        ...MyShop.filters
    };

}


/* ============================================================
   SET FILTER
   ============================================================ */

function setProductFilter(
    key,
    value
) {

    initializeFilterState();


    if (
        !Object.prototype.hasOwnProperty.call(
            MyShop.filters,
            key
        )
    ) {

        return false;

    }


    MyShop.filters[key] =
        value;


    return true;

}


/* ============================================================
   NORMALIZE SEARCH TEXT
   ============================================================ */

function normalizeSearchText(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );

}


/* ============================================================
   GET ALL PRODUCTS SAFELY
   ============================================================ */

function getAllProductsSafe() {

    if (
        typeof getProducts ===
        "function"
    ) {

        const products =
            getProducts();


        return Array.isArray(
            products
        )
            ? products
            : [];

    }


    if (
        Array.isArray(
            MyShop.products
        )
    ) {

        return [
            ...MyShop.products
        ];

    }


    return [];

}


/* ============================================================
   FILTER PRODUCTS
   ============================================================ */

function filterProducts(
    products,
    filters = getFilterState()
) {

    if (
        !Array.isArray(
            products
        )
    ) {

        return [];

    }


    const search =
        normalizeSearchText(
            filters.search
        );


    const category =
        normalizeSearchText(
            filters.category
        );


    const minPrice =
        Number(
            filters.minPrice
        );


    const maxPrice =
        Number(
            filters.maxPrice
        );


    return products.filter(
        product => {

            const name =
                normalizeSearchText(
                    product.name
                );


            const description =
                normalizeSearchText(
                    product.description
                );


            const productCategory =
                normalizeSearchText(
                    product.category
                );


            const matchesSearch =
                !search ||
                name.includes(
                    search
                ) ||
                description.includes(
                    search
                ) ||
                productCategory.includes(
                    search
                );


            const matchesCategory =
                !category ||
                category === "all" ||
                productCategory ===
                    category;


            const price =
                Number(
                    product.price || 0
                );


            const matchesMinPrice =
                !Number.isFinite(
                    minPrice
                ) ||
                minPrice <= 0 ||
                price >= minPrice;


            const matchesMaxPrice =
                !Number.isFinite(
                    maxPrice
                ) ||
                maxPrice <= 0 ||
                price <= maxPrice;


            const stock =
                Number(
                    product.stock || 0
                );


            const matchesStock =
                !filters.stockOnly ||
                stock > 0;


            return (

                matchesSearch &&

                matchesCategory &&

                matchesMinPrice &&

                matchesMaxPrice &&

                matchesStock

            );

        }
    );

}


/* ============================================================
   SORT PRODUCTS
   ============================================================ */

function sortProducts(
    products,
    sort = "default"
) {

    if (
        !Array.isArray(
            products
        )
    ) {

        return [];

    }


    const result =
        [
            ...products
        ];


    switch (
        sort
    ) {

        case "price-low":

            result.sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        a.price || 0
                    ) -
                    Number(
                        b.price || 0
                    )
            );

            break;


        case "price-high":

            result.sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        b.price || 0
                    ) -
                    Number(
                        a.price || 0
                    )
            );

            break;


        case "name-az":

            result.sort(
                (
                    a,
                    b
                ) =>
                    String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        )
                    )
            );

            break;


        case "name-za":

            result.sort(
                (
                    a,
                    b
                ) =>
                    String(
                        b.name || ""
                    ).localeCompare(
                        String(
                            a.name || ""
                        )
                    )
            );

            break;


        case "rating":

            result.sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        b.rating || 0
                    ) -
                    Number(
                        a.rating || 0
                    )
            );

            break;


        case "newest":

            result.sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        b.createdAt || 0
                    ) -
                    Number(
                        a.createdAt || 0
                    )
            );

            break;


        default:

            break;

    }


    return result;

}


/* ============================================================
   GET FILTERED PRODUCTS
   ============================================================ */

function getFilteredProducts() {

    const products =
        getAllProductsSafe();


    const filters =
        getFilterState();


    const filtered =
        filterProducts(
            products,
            filters
        );


    return sortProducts(
        filtered,
        filters.sort
    );

}


/* ============================================================
   RENDER FILTERED PRODUCTS
   ============================================================ */

function renderFilteredProducts() {

    const containers =
        $$(
            "[data-product-results]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    const products =
        getFilteredProducts();


    containers.forEach(
        container => {

            if (
                products.length === 0
            ) {

                container.innerHTML = `

                    <div
                        class="empty-search-results"
                    >

                        <div
                            class="empty-search-icon"
                        >
                            🔍
                        </div>


                        <h3>
                            No Products Found
                        </h3>


                        <p>
                            Try changing your
                            search or filters.
                        </p>


                        <button
                            type="button"
                            class="secondary-button"
                            data-clear-filters
                        >
                            Clear Filters
                        </button>

                    </div>

                `;


                return;

            }


            if (
                typeof createProductCardHTML ===
                "function"
            ) {

                container.innerHTML =
                    products
                        .map(
                            product =>
                                createProductCardHTML(
                                    product
                                )
                        )
                        .join("");

            }

        }
    );


    updateWishlistButtons();

    updateWishlistCount();

}


/* ============================================================
   SEARCH INPUT EVENTS
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const input =
            event.target.closest(
                "[data-product-search]"
            );


        if (!input) {

            return;

        }


        setProductFilter(
            "search",
            input.value
        );


        renderFilteredProducts();

    }
);


/* ============================================================
   CATEGORY FILTER
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const category =
            event.target.closest(
                "[data-product-category-filter]"
            );


        if (
            category
        ) {

            setProductFilter(
                "category",
                category.value
            );


            renderFilteredProducts();


            return;

        }


        const sort =
            event.target.closest(
                "[data-product-sort]"
            );


        if (
            sort
        ) {

            setProductFilter(
                "sort",
                sort.value
            );


            renderFilteredProducts();


            return;

        }


        const stock =
            event.target.closest(
                "[data-stock-only]"
            );


        if (
            stock
        ) {

            setProductFilter(
                "stockOnly",
                Boolean(
                    stock.checked
                )
            );


            renderFilteredProducts();

        }

    }
);


/* ============================================================
   PRICE FILTER EVENTS
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const min =
            event.target.closest(
                "[data-min-price]"
            );


        if (min) {

            setProductFilter(
                "minPrice",
                min.value
            );


            renderFilteredProducts();


            return;

        }


        const max =
            event.target.closest(
                "[data-max-price]"
            );


        if (max) {

            setProductFilter(
                "maxPrice",
                max.value
            );


            renderFilteredProducts();

        }

    }
);


/* ============================================================
   CLEAR FILTERS
   ============================================================ */

function clearProductFilters() {

    MyShop.filters = {

        search: "",

        category: "all",

        minPrice: "",

        maxPrice: "",

        sort: "default",

        stockOnly: false

    };


    $$(
        "[data-product-search]"
    ).forEach(
        input => {

            input.value =
                "";

        }
    );


    $$(
        "[data-product-category-filter]"
    ).forEach(
        input => {

            input.value =
                "all";

        }
    );


    $$(
        "[data-product-sort]"
    ).forEach(
        input => {

            input.value =
                "default";

        }
    );


    $$(
        "[data-min-price]"
    ).forEach(
        input => {

            input.value =
                "";

        }
    );


    $$(
        "[data-max-price]"
    ).forEach(
        input => {

            input.value =
                "";

        }
    );


    $$(
        "[data-stock-only]"
    ).forEach(
        input => {

            input.checked =
                false;

        }
    );


    renderFilteredProducts();

}


/* ============================================================
   CLEAR FILTER BUTTON
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-clear-filters]"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        clearProductFilters();

    }
);


/* ============================================================
   SEARCH FORM SUBMIT
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-product-search-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const input =
            form.querySelector(
                "[data-product-search]"
            );


        if (input) {

            setProductFilter(
                "search",
                input.value
            );

        }


        renderFilteredProducts();

    }
);


/* ============================================================
   FILTER RESULT COUNT
   ============================================================ */

function updateFilterResultCount() {

    const count =
        getFilteredProducts()
            .length;


    $$(
        "[data-filter-result-count]"
    ).forEach(
        element => {

            element.textContent =
                count;

        }
    );

}


/* ============================================================
   FILTER UI UPDATE
   ============================================================ */

function updateFilterUI() {

    const filters =
        getFilterState();


    $$(
        "[data-product-search]"
    ).forEach(
        input => {

            if (
                input.value !==
                filters.search
            ) {

                input.value =
                    filters.search;

            }

        }
    );


    $$(
        "[data-product-category-filter]"
    ).forEach(
        input => {

            input.value =
                filters.category;

        }
    );


    $$(
        "[data-product-sort]"
    ).forEach(
        input => {

            input.value =
                filters.sort;

        }
    );


    $$(
        "[data-min-price]"
    ).forEach(
        input => {

            input.value =
                filters.minPrice;

        }
    );


    $$(
        "[data-max-price]"
    ).forEach(
        input => {

            input.value =
                filters.maxPrice;

        }
    );


    $$(
        "[data-stock-only]"
    ).forEach(
        input => {

            input.checked =
                Boolean(
                    filters.stockOnly
                );

        }
    );


    updateFilterResultCount();

}


/* ============================================================
   FILTER INITIALIZATION
   ============================================================ */

initializeFilterState();

updateFilterUI();

renderFilteredProducts();


/* ============================================================
   MyShop Marketplace
   app.js — PART 17B
   Search Suggestions + Recent Searches + Filter Drawer
   ============================================================ */


/* ============================================================
   RECENT SEARCH STATE
   ============================================================ */

function initializeRecentSearchState() {

    if (
        !Array.isArray(
            MyShop.recentSearches
        )
    ) {

        MyShop.recentSearches = [];

    }

}


/* ============================================================
   GET RECENT SEARCHES
   ============================================================ */

function getRecentSearches() {

    initializeRecentSearchState();


    return [
        ...MyShop.recentSearches
    ];

}


/* ============================================================
   SAVE RECENT SEARCHES
   ============================================================ */

function saveRecentSearches() {

    initializeRecentSearchState();


    return saveToStorage(
        "myshop_recent_searches",
        MyShop.recentSearches
    );

}


/* ============================================================
   ADD RECENT SEARCH
   ============================================================ */

function addRecentSearch(
    value
) {

    const search =
        String(
            value || ""
        ).trim();


    if (
        search.length < 2
    ) {

        return false;

    }


    initializeRecentSearchState();


    MyShop.recentSearches =
        MyShop.recentSearches.filter(
            item =>
                normalizeSearchText(
                    item
                ) !==
                normalizeSearchText(
                    search
                )
        );


    MyShop.recentSearches.unshift(
        search
    );


    /*
       Keep only the latest
       eight searches.
    */

    MyShop.recentSearches =
        MyShop.recentSearches.slice(
            0,
            8
        );


    saveRecentSearches();


    return true;

}


/* ============================================================
   REMOVE RECENT SEARCH
   ============================================================ */

function removeRecentSearch(
    value
) {

    initializeRecentSearchState();


    MyShop.recentSearches =
        MyShop.recentSearches.filter(
            item =>
                normalizeSearchText(
                    item
                ) !==
                normalizeSearchText(
                    value
                )
        );


    saveRecentSearches();

    renderSearchSuggestions();

}


/* ============================================================
   CLEAR RECENT SEARCHES
   ============================================================ */

function clearRecentSearches() {

    MyShop.recentSearches =
        [];


    saveRecentSearches();


    renderSearchSuggestions();

}


/* ============================================================
   GET SEARCH SUGGESTIONS
   ============================================================ */

function getSearchSuggestions(
    query = ""
) {

    const search =
        normalizeSearchText(
            query
        );


    const products =
        getAllProductsSafe();


    if (
        !search
    ) {

        return products
            .slice(
                0,
                6
            );

    }


    return products
        .filter(
            product => {

                const name =
                    normalizeSearchText(
                        product.name
                    );


                const category =
                    normalizeSearchText(
                        product.category
                    );


                const description =
                    normalizeSearchText(
                        product.description
                    );


                return (

                    name.includes(
                        search
                    ) ||

                    category.includes(
                        search
                    ) ||

                    description.includes(
                        search
                    )

                );

            }
        )
        .slice(
            0,
            7
        );

}


/* ============================================================
   SEARCH SUGGESTION HTML
   ============================================================ */

function createSearchSuggestionHTML(
    product
) {

    return `

        <button
            type="button"
            class="search-suggestion"
            data-suggestion-product="${
                escapeHTML(
                    product.id
                )
            }"
        >

            <span
                class="search-suggestion-icon"
            >
                ${product.emoji || "📦"}
            </span>


            <span
                class="search-suggestion-info"
            >

                <strong>
                    ${escapeHTML(
                        product.name
                    )}
                </strong>

                <small>
                    ${escapeHTML(
                        product.category ||
                        ""
                    )}
                </small>

            </span>


            <span
                class="search-suggestion-price"
            >
                ${formatPrice(
                    Number(
                        product.price || 0
                    )
                )}
            </span>

        </button>

    `;

}


/* ============================================================
   RECENT SEARCH HTML
   ============================================================ */

function createRecentSearchHTML(
    search
) {

    return `

        <div
            class="recent-search-item"
        >

            <button
                type="button"
                class="recent-search-value"
                data-recent-search="${
                    escapeHTML(
                        search
                    )
                }"
            >

                <span>
                    🕘
                </span>

                <span>
                    ${escapeHTML(
                        search
                    )}
                </span>

            </button>


            <button
                type="button"
                class="recent-search-remove"
                data-remove-recent-search="${
                    escapeHTML(
                        search
                    )
                }"
                aria-label="Remove recent search"
            >
                ×
            </button>

        </div>

    `;

}


/* ============================================================
   RENDER SEARCH SUGGESTIONS
   ============================================================ */

function renderSearchSuggestions(
    query = ""
) {

    const containers =
        $$(
            "[data-search-suggestions]"
        );


    if (
        containers.length === 0
    ) {

        return;

    }


    const search =
        String(
            query || ""
        ).trim();


    containers.forEach(
        container => {

            /*
               When there is no query,
               show recent searches first.
            */

            if (
                !search
            ) {

                const recent =
                    getRecentSearches();


                if (
                    recent.length > 0
                ) {

                    container.innerHTML = `

                        <div
                            class="search-suggestions-header"
                        >

                            <strong>
                                Recent Searches
                            </strong>


                            <button
                                type="button"
                                class="text-button"
                                data-clear-recent-searches
                            >
                                Clear
                            </button>

                        </div>


                        <div
                            class="recent-search-list"
                        >

                            ${
                                recent
                                    .map(
                                        createRecentSearchHTML
                                    )
                                    .join("")
                            }

                        </div>

                    `;


                    return;

                }

            }


            const suggestions =
                getSearchSuggestions(
                    search
                );


            if (
                suggestions.length ===
                0
            ) {

                container.innerHTML = `

                    <div
                        class="no-search-suggestions"
                    >
                        No matching products found.
                    </div>

                `;


                return;

            }


            container.innerHTML = `

                <div
                    class="search-suggestions-header"
                >

                    <strong>
                        ${
                            search
                                ? "Products"
                                : "Popular Products"
                        }
                    </strong>

                </div>


                <div
                    class="search-suggestion-list"
                >

                    ${
                        suggestions
                            .map(
                                createSearchSuggestionHTML
                            )
                            .join("")
                    }

                </div>

            `;

        }
    );

}


/* ============================================================
   SEARCH DROPDOWN OPEN
   ============================================================ */

function openSearchSuggestions(
    input
) {

    if (!input) {

        return;

    }


    const container =
        input.closest(
            "[data-search-wrapper]"
        );


    if (!container) {

        return;

    }


    const suggestions =
        $(
            "[data-search-suggestions]",
            container
        );


    if (!suggestions) {

        return;

    }


    suggestions.hidden =
        false;


    renderSearchSuggestions(
        input.value
    );

}


/* ============================================================
   SEARCH DROPDOWN CLOSE
   ============================================================ */

function closeSearchSuggestions() {

    $$(
        "[data-search-suggestions]"
    ).forEach(
        container => {

            container.hidden =
                true;

        }
    );

}


/* ============================================================
   SEARCH INPUT FOCUS
   ============================================================ */

document.addEventListener(
    "focusin",
    function (event) {

        const input =
            event.target.closest(
                "[data-product-search]"
            );


        if (!input) {

            return;

        }


        openSearchSuggestions(
            input
        );

    }
);


/* ============================================================
   SEARCH INPUT LIVE SUGGESTIONS
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const input =
            event.target.closest(
                "[data-product-search]"
            );


        if (!input) {

            return;

        }


        renderSearchSuggestions(
            input.value
        );


        openSearchSuggestions(
            input
        );

    }
);


/* ============================================================
   SEARCH SUBMIT — SAVE RECENT
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-product-search-form]"
            );


        if (!form) {

            return;

        }


        const input =
            $(
                "[data-product-search]",
                form
            );


        if (
            input &&
            input.value.trim()
        ) {

            addRecentSearch(
                input.value
            );

        }


        closeSearchSuggestions();

    }
);


/* ============================================================
   RECENT SEARCH CLICK
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const recent =
            event.target.closest(
                "[data-recent-search]"
            );


        if (!recent) {

            return;

        }


        event.preventDefault();


        const value =
            recent.dataset
                .recentSearch;


        $$(
            "[data-product-search]"
        ).forEach(
            input => {

                input.value =
                    value;

            }
        );


        setProductFilter(
            "search",
            value
        );


        addRecentSearch(
            value
        );


        renderFilteredProducts();

        updateFilterUI();

        closeSearchSuggestions();

    }
);


/* ============================================================
   REMOVE RECENT SEARCH
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const remove =
            event.target.closest(
                "[data-remove-recent-search]"
            );


        if (!remove) {

            return;

        }


        event.preventDefault();


        removeRecentSearch(
            remove.dataset
                .removeRecentSearch
        );

    }
);


/* ============================================================
   CLEAR RECENT SEARCHES EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const clear =
            event.target.closest(
                "[data-clear-recent-searches]"
            );


        if (!clear) {

            return;

        }


        event.preventDefault();


        clearRecentSearches();

    }
);


/* ============================================================
   SUGGESTION PRODUCT CLICK
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const suggestion =
            event.target.closest(
                "[data-suggestion-product]"
            );


        if (!suggestion) {

            return;

        }


        event.preventDefault();


        const productId =
            suggestion.dataset
                .suggestionProduct;


        const product =
            getProductById(
                productId
            );


        if (
            product
        ) {

            addRecentSearch(
                product.name
            );

        }


        closeSearchSuggestions();


        if (
            typeof openProductDetails ===
            "function"
        ) {

            openProductDetails(
                productId
            );

        }

    }
);


/* ============================================================
   OUTSIDE CLICK — CLOSE SEARCH
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const wrapper =
            event.target.closest(
                "[data-search-wrapper]"
            );


        if (
            !wrapper
        ) {

            closeSearchSuggestions();

        }

    }
);


/* ============================================================
   CATEGORY CHIP SELECTION
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const chip =
            event.target.closest(
                "[data-category-chip]"
            );


        if (!chip) {

            return;

        }


        event.preventDefault();


        const category =
            chip.dataset
                .categoryChip ||
            "all";


        setProductFilter(
            "category",
            category
        );


        $$(
            "[data-category-chip]"
        ).forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset
                        .categoryChip ===
                        category
                );

            }
        );


        updateFilterUI();

        renderFilteredProducts();

    }
);


/* ============================================================
   FILTER DRAWER
   ============================================================ */

function openFilterDrawer() {

    const drawer =
        $(
            "[data-filter-drawer]"
        );


    if (!drawer) {

        return;

    }


    drawer.hidden =
        false;


    drawer.classList.add(
        "open"
    );


    document.body.classList.add(
        "filter-drawer-open"
    );


    MyShop.filterDrawerOpen =
        true;

}


/* ============================================================
   CLOSE FILTER DRAWER
   ============================================================ */

function closeFilterDrawer() {

    const drawer =
        $(
            "[data-filter-drawer]"
        );


    if (!drawer) {

        return;

    }


    drawer.classList.remove(
        "open"
    );


    drawer.hidden =
        true;


    document.body.classList.remove(
        "filter-drawer-open"
    );


    MyShop.filterDrawerOpen =
        false;

}


/* ============================================================
   FILTER DRAWER EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const open =
            event.target.closest(
                "[data-open-filter]"
            );


        if (open) {

            event.preventDefault();


            openFilterDrawer();


            return;

        }


        const close =
            event.target.closest(
                "[data-close-filter]"
            );


        if (close) {

            event.preventDefault();


            closeFilterDrawer();


            return;

        }

    }
);


/* ============================================================
   FILTER APPLY
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const apply =
            event.target.closest(
                "[data-apply-filters]"
            );


        if (!apply) {

            return;

        }


        event.preventDefault();


        updateFilterUI();

        renderFilteredProducts();

        closeFilterDrawer();

    }
);


/* ============================================================
   FILTER RESET
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const reset =
            event.target.closest(
                "[data-reset-filters]"
            );


        if (!reset) {

            return;

        }


        event.preventDefault();


        clearProductFilters();

        closeFilterDrawer();

    }
);
/* ============================================================
   FILTER DRAWER ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape" &&
            MyShop.filterDrawerOpen
        ) {

            closeFilterDrawer();

        }

    }
);


/* ============================================================
   LOAD RECENT SEARCHES
   ============================================================ */

const savedRecentSearches =
    loadFromStorage(
        "myshop_recent_searches",
        []
    );


MyShop.recentSearches =
    Array.isArray(
        savedRecentSearches
    )
        ? savedRecentSearches
        : [];


initializeRecentSearchState();


/* ============================================================
   FINAL SEARCH INITIALIZATION
   ============================================================ */

$$(
    "[data-search-suggestions]"
).forEach(
    container => {

        container.hidden =
            true;

    }
);

/* ============================================================
   MyShop Marketplace
   app.js — PART 18A
   Product Details + Gallery + Quantity
   ============================================================ */


/* ============================================================
   PRODUCT DETAIL STATE
   ============================================================ */

function initializeProductDetailState() {

    if (
        MyShop.detailProductId ===
        undefined
    ) {

        MyShop.detailProductId =
            null;

    }


    if (
        MyShop.detailQuantity ===
        undefined
    ) {

        MyShop.detailQuantity =
            1;

    }

}


/* ============================================================
   OPEN PRODUCT DETAILS
   ============================================================ */

function openProductDetails(
    productId
) {

    initializeProductDetailState();


    const product =
        getProductById(
            productId
        );


    if (!product) {

        showToast(
            "Product not found.",
            "error"
        );


        return;

    }


    MyShop.detailProductId =
        product.id;


    MyShop.detailQuantity =
        1;


    let modal =
        getElement(
            "productDetailsModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "productDetailsModal";

        modal.className =
            "modal product-details-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const stock =
        Number(
            product.stock || 0
        );


    const rating =
        Number(
            product.rating || 0
        );


    const reviews =
        Number(
            product.reviews || 0
        );


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-product-details
        ></div>


        <div
            class="modal-content product-details-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-product-details
                aria-label="Close product details"
            >
                ×
            </button>


            <div
                class="product-details-layout"
            >

                <div
                    class="product-details-gallery"
                >

                    <div
                        class="product-details-main-image"
                    >

                        <span
                            data-detail-image
                        >
                            ${product.emoji || "📦"}
                        </span>

                    </div>


                    <div
                        class="product-details-thumbnails"
                    >

                        <button
                            type="button"
                            class="product-thumbnail active"
                            data-detail-thumb
                            data-detail-image-value="${
                                escapeHTML(
                                    product.emoji ||
                                    "📦"
                                )
                            }"
                        >
                            ${
                                product.emoji ||
                                "📦"
                            }
                        </button>


                        ${
                            Array.isArray(
                                product.images
                            )
                                ? product.images
                                    .slice(
                                        0,
                                        4
                                    )
                                    .map(
                                        image => `

                                            <button
                                                type="button"
                                                class="product-thumbnail"
                                                data-detail-thumb
                                                data-detail-image-value="${escapeHTML(
                                                    image
                                                )}"
                                            >
                                                <img
                                                    src="${escapeHTML(
                                                        image
                                                    )}"
                                                    alt=""
                                                >
                                            </button>

                                        `
                                    )
                                    .join("")
                                : ""
                        }

                    </div>

                </div>


                <div
                    class="product-details-info"
                >

                    <span
                        class="product-category"
                    >
                        ${escapeHTML(
                            product.category ||
                            ""
                        )}
                    </span>


                    <h2>
                        ${escapeHTML(
                            product.name
                        )}
                    </h2>


                    <div
                        class="product-rating"
                    >

                        <span>
                            ${"★".repeat(
                                Math.round(
                                    rating
                                )
                            )}
                        </span>

                        <span>
                            ${rating.toFixed(
                                1
                            )}
                        </span>

                        ${
                            reviews > 0
                                ? `
                                    <small>
                                        (${reviews}
                                        reviews)
                                    </small>
                                  `
                                : ""
                        }

                    </div>


                    <div
                        class="product-details-price"
                    >
                        ${formatPrice(
                            Number(
                                product.price ||
                                0
                            )
                        )}
                    </div>


                    ${
                        product.oldPrice &&
                        Number(
                            product.oldPrice
                        ) >
                        Number(
                            product.price
                        )
                            ? `
                                <div
                                    class="product-old-price"
                                >
                                    ${formatPrice(
                                        Number(
                                            product.oldPrice
                                        )
                                    )}
                                </div>
                              `
                            : ""
                    }


                    <p
                        class="product-details-description"
                    >
                        ${escapeHTML(
                            product.description ||
                            "No description available."
                        )}
                    </p>


                    <div
                        class="product-stock"
                    >

                        ${
                            stock > 0
                                ? `
                                    <span
                                        class="stock-success"
                                    >
                                        ✓
                                        ${stock}
                                        available
                                    </span>
                                  `
                                : `
                                    <span
                                        class="stock-warning"
                                    >
                                        Out of stock
                                    </span>
                                  `
                        }

                    </div>


                    <div
                        class="product-detail-actions"
                    >

                        <div
                            class="detail-quantity"
                        >

                            <button
                                type="button"
                                data-detail-quantity-minus
                                ${
                                    stock <= 0
                                        ? "disabled"
                                        : ""
                                }
                            >
                                −
                            </button>


                            <input
                                type="number"
                                min="1"
                                max="${
                                    Math.max(
                                        stock,
                                        1
                                    )
                                }"
                                value="1"
                                data-detail-quantity
                                ${
                                    stock <= 0
                                        ? "disabled"
                                        : ""
                                }
                            >


                            <button
                                type="button"
                                data-detail-quantity-plus
                                ${
                                    stock <= 0
                                        ? "disabled"
                                        : ""
                                }
                            >
                                +
                            </button>

                        </div>


                        <button
                            type="button"
                            class="primary-button detail-add-cart"
                            data-detail-add-cart
                            ${
                                stock <= 0
                                    ? "disabled"
                                    : ""
                            }
                        >
                            Add to Cart
                        </button>

                    </div>


                    <button
                        type="button"
                        class="wishlist-detail-button"
                        data-product-wishlist="${
                            escapeHTML(
                                product.id
                            )
                        }"
                        aria-pressed="false"
                    >

                        <span
                            data-wishlist-icon
                        >
                            ♡
                        </span>

                        <span
                            data-wishlist-label
                        >
                            Add to Wishlist
                        </span>

                    </button>


                    <div
                        class="product-details-meta"
                    >

                        ${
                            product.sku
                                ? `
                                    <div>
                                        <span>
                                            SKU
                                        </span>
                                        <strong>
                                            ${escapeHTML(
                                                product.sku
                                            )}
                                        </strong>
                                    </div>
                                  `
                                : ""
                        }


                        ${
                            product.brand
                                ? `
                                    <div>
                                        <span>
                                            Brand
                                        </span>
                                        <strong>
                                            ${escapeHTML(
                                                product.brand
                                            )}
                                        </strong>
                                    </div>
                                  `
                                : ""
                        }

                    </div>

                </div>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "product-details";


    updateProductWishlistButton(
        $(
            "[data-product-wishlist]",
            modal
        ),
        product.id
    );

}


/* ============================================================
   CLOSE PRODUCT DETAILS
   ============================================================ */

function closeProductDetails() {

    const modal =
        getElement(
            "productDetailsModal"
        );


    if (!modal) {

        return;

    }


    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "product-details"
    ) {

        MyShop.activeModal =
            null;

    }


    MyShop.detailProductId =
        null;


    MyShop.detailQuantity =
        1;

}


/* ============================================================
   UPDATE DETAIL QUANTITY
   ============================================================ */

function updateDetailQuantity(
    value
) {

    initializeProductDetailState();


    const product =
        getProductById(
            MyShop.detailProductId
        );


    if (!product) {

        return;

    }


    const stock =
        Number(
            product.stock || 0
        );


    if (
        stock <= 0
    ) {

        MyShop.detailQuantity =
            0;

        return;

    }


    let quantity =
        Number(
            value
        );


    if (
        !Number.isFinite(
            quantity
        )
    ) {

        quantity =
            1;

    }


    quantity =
        Math.floor(
            quantity
        );


    quantity =
        Math.max(
            1,
            quantity
        );


    quantity =
        Math.min(
            stock,
            quantity
        );


    MyShop.detailQuantity =
        quantity;


    const input =
        $(
            "[data-detail-quantity]",
            "#productDetailsModal"
        );


    if (input) {

        input.value =
            quantity;

    }

}


/* ============================================================
   DETAIL QUANTITY EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const minus =
            event.target.closest(
                "[data-detail-quantity-minus]"
            );


        if (minus) {

            event.preventDefault();


            updateDetailQuantity(
                MyShop.detailQuantity -
                1
            );


            return;

        }


        const plus =
            event.target.closest(
                "[data-detail-quantity-plus]"
            );


        if (plus) {

            event.preventDefault();


            updateDetailQuantity(
                MyShop.detailQuantity +
                1
            );


            return;

        }


        const addCart =
            event.target.closest(
                "[data-detail-add-cart]"
            );


        if (addCart) {

            event.preventDefault();


            const productId =
                MyShop.detailProductId;


            const quantity =
                MyShop.detailQuantity ||
                1;


            if (
                typeof addToCart ===
                "function"
            ) {

                const added =
                    addToCart(
                        productId,
                        quantity
                    );


                if (
                    added !== false
                ) {

                    showToast(
                        "Product added to cart.",
                        "success"
                    );


                    closeProductDetails();

                }

            }


            return;

        }


        const close =
            event.target.closest(
                "[data-close-product-details]"
            );


        if (close) {

            event.preventDefault();


            closeProductDetails();

            return;

        }

    }
);


/* ============================================================
   DETAIL QUANTITY INPUT
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const input =
            event.target.closest(
                "[data-detail-quantity]"
            );


        if (!input) {

            return;

        }


        updateDetailQuantity(
            input.value
        );

    }
);


/* ============================================================
   PRODUCT IMAGE THUMBNAILS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const thumbnail =
            event.target.closest(
                "[data-detail-thumb]"
            );


        if (!thumbnail) {

            return;

        }


        const value =
            thumbnail.dataset
                .detailImageValue;


        const main =
            $(
                "[data-detail-image]",
                "#productDetailsModal"
            );


        if (
            main &&
            value
        ) {

            if (
                /^https?:\/\//i.test(
                    value
                )
            ) {

                main.innerHTML = `

                    <img
                        src="${escapeHTML(
                            value
                        )}"
                        alt=""
                    >

                `;

            }
            else {

                main.textContent =
                    value;

            }

        }


        $$(
            "[data-detail-thumb]",
            "#productDetailsModal"
        ).forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item === thumbnail
                );
}
        );

    }
);


/* ============================================================
   PRODUCT DETAILS ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "product-details"
        ) {

            closeProductDetails();

        }

    }
);


/* ============================================================
   DETAIL PRODUCT INITIALIZATION
   ============================================================ */

initializeProductDetailState();

/* ============================================================
   MyShop Marketplace
   app.js — PART 18B
   Product Reviews + Share + Related Products
   ============================================================ */


/* ============================================================
   PRODUCT REVIEW STATE
   ============================================================ */

function initializeReviewState() {

    if (
        !MyShop.reviews ||
        typeof MyShop.reviews !==
            "object"
    ) {

        MyShop.reviews = {};

    }

}


/* ============================================================
   GET PRODUCT REVIEWS
   ============================================================ */

function getProductReviews(
    productId
) {

    initializeReviewState();


    const stored =
        MyShop.reviews[
            String(
                productId
            )
        ];


    if (
        Array.isArray(
            stored
        )
    ) {

        return [
            ...stored
        ];

    }


    const product =
        getProductById(
            productId
        );


    if (
        product &&
        Array.isArray(
            product.reviewsList
        )
    ) {

        return [
            ...product.reviewsList
        ];

    }


    return [];

}


/* ============================================================
   SAVE PRODUCT REVIEW
   ============================================================ */

function saveProductReview(
    productId,
    review
) {

    initializeReviewState();


    const key =
        String(
            productId
        );


    if (
        !Array.isArray(
            MyShop.reviews[key]
        )
    ) {

        MyShop.reviews[key] =
            [];

    }


    MyShop.reviews[key].unshift({

        id:
            `review_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        name:
            String(
                review.name ||
                getAccountDisplayName()
            ).trim(),

        rating:
            Math.min(
                5,
                Math.max(
                    1,
                    Number(
                        review.rating ||
                        5
                    )
                )
            ),

        text:
            String(
                review.text ||
                ""
            ).trim(),

        createdAt:
            new Date().toISOString()

    });


    saveToStorage(
        "myshop_reviews",
        MyShop.reviews
    );


    return true;

}


/* ============================================================
   RENDER PRODUCT REVIEWS
   ============================================================ */

function renderProductReviews(
    productId,
    container
) {

    if (!container) {

        return;

    }


    const reviews =
        getProductReviews(
            productId
        );


    if (
        reviews.length ===
        0
    ) {

        container.innerHTML = `

            <div
                class="empty-reviews"
            >

                <div>
                    ★
                </div>

                <h3>
                    No Reviews Yet
                </h3>

                <p>
                    Be the first to review
                    this product.
                </p>

            </div>

        `;


        return;

    }


    container.innerHTML =
        reviews
            .map(
                review => {

                    const rating =
                        Math.min(
                            5,
                            Math.max(
                                1,
                                Number(
                                    review.rating ||
                                    0
                                )
                            )
                        );


                    return `

                        <article
                            class="product-review"
                        >

                            <div
                                class="review-header"
                            >

                                <div
                                    class="review-avatar"
                                >
                                    ${escapeHTML(
                                        String(
                                            review.name ||
                                            "Customer"
                                        )
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>


                                <div
                                    class="review-author"
                                >

                                    <strong>
                                        ${escapeHTML(
                                            review.name ||
                                            "Customer"
                                        )}
                                    </strong>


                                    <div
                                        class="review-stars"
                                    >
                                        ${
                                            "★".repeat(
                                                rating
                                            )
                                        }${
                                            "☆".repeat(
                                                5 -
                                                rating
                                            )
                                        }
                                    </div>

                                </div>

                            </div>


                            <p
                                class="review-text"
                            >
                                ${escapeHTML(
                                    review.text ||
                                    ""
                                )}
                            </p>


                            ${
                                review.createdAt
                                    ? `
                                        <time
                                            datetime="${escapeHTML(
                                                review.createdAt
                                            )}"
                                        >
                                            ${formatReviewDate(
                                                review.createdAt
                                            )}
                                        </time>
                                      `
                                    : ""
                            }

                        </article>

                    `;

                }
            )
            .join("");

}


/* ============================================================
   REVIEW DATE FORMAT
   ============================================================ */

function formatReviewDate(
    value
) {

    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        undefined,
        {

            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"

        }
    );

}


/* ============================================================
   OPEN REVIEW FORM
   ============================================================ */

function openReviewForm(
    productId
) {

    const modal =
        getElement(
            "productDetailsModal"
        );


    if (!modal) {

        return;

    }


    const existing =
        $(
            "[data-review-form]",
            modal
        );


    if (existing) {

        existing.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });


        return;

    }


    const reviewsSection =
        $(
            "[data-product-reviews]",
            modal
        );


    if (!reviewsSection) {

        return;

    }


    const form =
        document.createElement(
            "form"
        );


    form.className =
        "product-review-form";


    form.setAttribute(
        "data-review-form",
        ""
    );


    form.innerHTML = `

        <div
            class="review-form-header"
        >

            <h3>
                Write a Review
            </h3>

        </div>


        <div
            class="form-group"
        >

            <label>
                Your Name
            </label>

            <input
                type="text"
                name="name"
                value="${escapeHTML(
                    getAccountDisplayName() ===
                    "Guest"
                        ? ""
                        : getAccountDisplayName()
                )}"
                required
            >

        </div>


        <div
            class="form-group"
        >

            <label>
                Rating
            </label>

            <select
                name="rating"
                required
            >

                <option value="5">
                    5 — Excellent
                </option>

                <option value="4">
                    4 — Good
                </option>

                <option value="3">
                    3 — Average
                </option>

                <option value="2">
                    2 — Poor
                </option>

                <option value="1">
                    1 — Very Poor
                </option>

            </select>

        </div>


        <div
            class="form-group"
        >

            <label>
                Review
            </label>

            <textarea
                name="text"
                rows="4"
                maxlength="1000"
                placeholder="Share your experience..."
                required
            ></textarea>

        </div>


        <button
            type="submit"
            class="primary-button"
        >
            Submit Review
        </button>

    `;


    reviewsSection
        .prepend(
            form
        );


    form.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}


/* ============================================================
   REVIEW FORM SUBMIT
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-review-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const productId =
            MyShop.detailProductId;


        if (!productId) {

            return;

        }


        const name =
            form.elements
                .namedItem(
                    "name"
                )?.value
                ?.trim() ||
            "Customer";


        const rating =
            Number(
                form.elements
                    .namedItem(
                        "rating"
                    )?.value ||
                5
            );


        const text =
            form.elements
                .namedItem(
                    "text"
                )?.value
                ?.trim() ||
            "";


        if (
            !text
        ) {

            showToast(
                "Please write a review.",
                "error"
            );


            return;

        }


        saveProductReview(
            productId,
            {

                name,

                rating,

                text

            }
        );


        form.remove();


        const reviewContainer =
            $(
                "[data-product-reviews-list]",
                "#productDetailsModal"
            );


        renderProductReviews(
            productId,
            reviewContainer
        );


        showToast(
            "Review submitted successfully.",
            "success"
        );

    }
);


/* ============================================================
   RELATED PRODUCTS
   ============================================================ */

function getRelatedProducts(
    productId,
    limit = 4
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        return [];

    }


    const category =
        normalizeSearchText(
            product.category
        );


    const all =
        getAllProductsSafe();


    return all
        .filter(
            item =>
                String(
                    item.id
                ) !==
                String(
                    product.id
                )
        )
        .sort(
            (
                a,
                b
            ) => {

                const aMatch =
                    normalizeSearchText(
                        a.category
                    ) ===
                    category
                        ? 1
                        : 0;


                const bMatch =
                    normalizeSearchText(
                        b.category
                    ) ===
                    category
                        ? 1
                        : 0;


                return (
                    bMatch -
                    aMatch
                );

            }
        )
        .slice(
            0,
            limit
        );

}


/* ============================================================
   RENDER RELATED PRODUCTS
   ============================================================ */

function renderRelatedProducts(
    productId,
    container
) {

    if (!container) {

        return;

    }


    const products =
        getRelatedProducts(
            productId
        );


    if (
        products.length ===
        0
    ) {

        container.innerHTML =
            "";


        return;

    }


    if (
        typeof createProductCardHTML ===
        "function"
    ) {

        container.innerHTML =
            products
                .map(
                    product =>
                        createProductCardHTML(
                            product
                        )
                )
                .join("");

    }


    updateWishlistButtons();

}


/* ============================================================
   PRODUCT SHARE
   ============================================================ */

async function shareProduct(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        return false;

    }


    const shareUrl =
        window.location.href;


    const shareData = {

        title:
            product.name,

        text:
            `Check out ${product.name} on MyShop.`,

        url:
            shareUrl

    };


    /*
       Use the native share sheet
       when the browser supports it.
    */

    if (
        typeof navigator.share ===
        "function"
    ) {

        try {

            await navigator.share(
                shareData
            );


            return true;

        }
        catch (
            error
        ) {

            if (
                error?.name ===
                "AbortError"
            ) {

                return false;

            }

        }

    }


    /*
       Fallback: copy product URL.
    */

    try {

        await navigator.clipboard.writeText(
            shareUrl
        );


        showToast(
            "Product link copied.",
            "success"
        );


        return true;

    }
    catch (
        error
    ) {

        showToast(
            "Unable to share this product.",
            "error"
        );


        return false;

    }

}


/* ============================================================
   SHARE BUTTON
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const share =
            event.target.closest(
                "[data-share-product]"
            );


        if (!share) {

            return;

        }


        event.preventDefault();


        const productId =
            share.dataset
                .shareProduct ||
            MyShop.detailProductId;


        if (
            productId
        ) {

            shareProduct(
                productId
            );

        }

    }
);


/* ============================================================
   REVIEW / RELATED SECTION EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const review =
            event.target.closest(
                "[data-write-review]"
            );


        if (review) {

            event.preventDefault();


            openReviewForm(
                MyShop.detailProductId
            );


            return;

        }

    }
);


/* ============================================================
   LOAD STORED REVIEWS
   ============================================================ */

const savedReviews =
    loadFromStorage(
        "myshop_reviews",
        {}
    );


MyShop.reviews =
    savedReviews &&
    typeof savedReviews ===
        "object" &&
    !Array.isArray(
        savedReviews
    )
        ? savedReviews
        : {};


initializeReviewState();

/* ============================================================
   MyShop Marketplace
   app.js — PART 19A
   Cart Drawer + Cart Calculations
   ============================================================ */


/* ============================================================
   CART DRAWER STATE
   ============================================================ */

function initializeCartDrawerState() {

    if (
        MyShop.cartDrawerOpen ===
        undefined
    ) {

        MyShop.cartDrawerOpen =
            false;

    }

}


/* ============================================================
   GET CART ITEMS SAFELY
   ============================================================ */

function getCartItemsSafe() {

    if (
        typeof getCart ===
        "function"
    ) {

        const items =
            getCart();


        return Array.isArray(
            items
        )
            ? items
            : [];

    }


    if (
        Array.isArray(
            MyShop.cart
        )
    ) {

        return [
            ...MyShop.cart
        ];

    }


    return [];

}


/* ============================================================
   CART SUBTOTAL
   ============================================================ */

function getCartSubtotal() {

    const items =
        getCartItemsSafe();


    return items.reduce(
        (
            total,
            item
        ) => {

            const product =
                getProductById(
                    item.productId ||
                    item.id
                );


            if (!product) {

                return total;

            }


            const quantity =
                Math.max(
                    0,
                    Number(
                        item.quantity ||
                        0
                    )
                );


            const price =
                Number(
                    item.price ??
                    product.price ??
                    0
                );


            return (
                total +
                price *
                quantity
            );

        },
        0
    );

}


/* ============================================================
   CART SHIPPING
   ============================================================ */

function getCartShipping(
    subtotal = getCartSubtotal()
) {

    if (
        subtotal <= 0
    ) {

        return 0;

    }


    /*
       Free shipping above the
       configured threshold.
    */

    const threshold =
        Number(
            MyShop.freeShippingThreshold ??
            2000
        );


    if (
        subtotal >=
        threshold
    ) {

        return 0;

    }


    const shipping =
        Number(
            MyShop.shippingFee ??
            80
        );


    return Math.max(
        0,
        shipping
    );

}


/* ============================================================
   CART DISCOUNT
   ============================================================ */

function getCartDiscount(
    subtotal = getCartSubtotal()
) {

    if (
        subtotal <= 0
    ) {

        return 0;

    }


    /*
       Existing discount/coupon
       values are respected when
       available.
    */

    const coupon =
        MyShop.appliedCoupon;


    if (
        coupon &&
        typeof coupon ===
            "object"
    ) {

        if (
            coupon.type ===
            "percentage"
        ) {

            const percentage =
                Number(
                    coupon.value ||
                    0
                );


            return Math.min(
                subtotal,
                subtotal *
                Math.max(
                    0,
                    percentage
                ) /
                100
            );

        }


        if (
            coupon.type ===
            "fixed"
        ) {

            return Math.min(
                subtotal,
                Math.max(
                    0,
                    Number(
                        coupon.value ||
                        0
                    )
                )
            );

        }

    }


    /*
       No coupon means no
       discount.
    */

    return 0;

}


/* ============================================================
   CART TOTAL
   ============================================================ */

function getCartTotal() {

    const subtotal =
        getCartSubtotal();


    const discount =
        getCartDiscount(
            subtotal
        );


    const shipping =
        getCartShipping(
            subtotal
        );


    return Math.max(
        0,
        subtotal -
        discount +
        shipping
    );

}


/* ============================================================
   CART SUMMARY
   ============================================================ */

function getCartSummary() {

    const subtotal =
        getCartSubtotal();


    const discount =
        getCartDiscount(
            subtotal
        );


    const shipping =
        getCartShipping(
            subtotal
        );


    const total =
        Math.max(
            0,
            subtotal -
            discount +
            shipping
        );


    return {

        subtotal,

        discount,

        shipping,

        total

    };

}


/* ============================================================
   CART ITEM HTML
   ============================================================ */

function createCartItemHTML(
    item
) {

    const product =
        getProductById(
            item.productId ||
            item.id
        );


    if (!product) {

        return "";

    }


    const quantity =
        Math.max(
            1,
            Number(
                item.quantity ||
                1
            )
        );


    const price =
        Number(
            item.price ??
            product.price ??
            0
        );


    const lineTotal =
        price *
        quantity;


    return `

        <article
            class="cart-item"
            data-cart-item="${
                escapeHTML(
                    product.id
                )
            }"
        >

            <button
                type="button"
                class="cart-item-image"
                data-product-details="${
                    escapeHTML(
                        product.id
                    )
                }"
                aria-label="View ${
                    escapeHTML(
                        product.name
                    )
                }"
            >

                <span>
                    ${product.emoji || "📦"}
                </span>

            </button>


            <div
                class="cart-item-info"
            >

                <h3>
                    ${escapeHTML(
                        product.name
                    )}
                </h3>


                <span
                    class="cart-item-category"
                >
                    ${escapeHTML(
                        product.category ||
                        ""
                    )}
                </span>


                <strong
                    class="cart-item-price"
                >
                    ${formatPrice(
                        price
                    )}
                </strong>


                <div
                    class="cart-item-controls"
                >

                    <button
                        type="button"
                        data-cart-minus="${
                            escapeHTML(
                                product.id
                            )
                        }"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <input
                        type="number"
                        min="1"
                        value="${quantity}"
                        data-cart-quantity="${
                            escapeHTML(
                                product.id
                            )
                        }"
                        aria-label="Quantity"
                    >


                    <button
                        type="button"
                        data-cart-plus="${
                            escapeHTML(
                                product.id
                            )
                        }"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

            </div>


            <div
                class="cart-item-right"
            >

                <strong>
                    ${formatPrice(
                        lineTotal
                    )}
                </strong>


                <button
                    type="button"
                    class="cart-remove-button"
                    data-cart-remove="${
                        escapeHTML(
                            product.id
                        )
                    }"
                    aria-label="Remove from cart"
                >
                    ×
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   RENDER CART DRAWER
   ============================================================ */

function renderCartDrawer() {

    const containers =
        $$(
            "[data-cart-drawer]"
        );


    const items =
        getCartItemsSafe();


    const summary =
        getCartSummary();


    containers.forEach(
        container => {

            if (
                items.length ===
                0
            ) {

                container.innerHTML = `

                    <div
                        class="empty-cart"
                    >

                        <div
                            class="empty-cart-icon"
                        >
                            🛒
                        </div>


                        <h3>
                            Your Cart is Empty
                        </h3>


                        <p>
                            Add products to
                            start shopping.
                        </p>


                        <button
                            type="button"
                            class="primary-button"
                            data-close-cart
                        >
                            Continue Shopping
                        </button>

                    </div>

                `;


                return;

            }


            container.innerHTML = `

                <div
                    class="cart-items-list"
                >

                    ${
                        items
                            .map(
                                createCartItemHTML
                            )
                            .join("")
                    }

                </div>


                <div
                    class="cart-summary"
                >

                    <div
                        class="cart-summary-row"
                    >

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${formatPrice(
                                summary.subtotal
                            )}
                        </strong>

                    </div>


                    ${
                        summary.discount >
                        0
                            ? `
                                <div
                                    class="cart-summary-row discount-row"
                                >

                                    <span>
                                        Discount
                                    </span>

                                    <strong>
                                        −${formatPrice(
                                            summary.discount
                                        )}
                                    </strong>

                                </div>
                              `
                            : ""
                    }


                    <div
                        class="cart-summary-row"
                    >

                        <span>
                            Shipping
                        </span>

                        <strong>
                            ${
                                summary.shipping ===
                                0
                                    ? "Free"
                                    : formatPrice(
                                        summary.shipping
                                    )
                            }
                        </strong>

                    </div>


                    <div
                        class="cart-summary-total"
                    >

                        <span>
                            Total
                        </span>

                        <strong>
                            ${formatPrice(
                                summary.total
                            )}
                        </strong>

                    </div>


                    <button
                        type="button"
                        class="primary-button cart-checkout-button"
                        data-go-checkout
                    >
                        Proceed to Checkout
                    </button>


                    <button
                        type="button"
                        class="secondary-button"
                        data-close-cart
                    >
                        Continue Shopping
                    </button>

                </div>

            `;

        }
    );


    if (
        typeof updateCartCount ===
        "function"
    ) {

        updateCartCount();

    }

}


/* ============================================================
   OPEN CART DRAWER
   ============================================================ */

function openCartDrawer() {

    initializeCartDrawerState();


    const drawer =
        $(
            "[data-cart-panel]"
        );


    if (!drawer) {

        /*
           If the page has no dedicated
           cart panel, fall back to a modal.
        */

        openCartFallbackModal();

        return;

    }


    renderCartDrawer();


    drawer.hidden =
        false;


    drawer.classList.add(
        "open"
    );


    document.body.classList.add(
        "cart-drawer-open"
    );


    MyShop.cartDrawerOpen =
        true;

}


/* ============================================================
   CLOSE CART DRAWER
   ============================================================ */

function closeCartDrawer() {

    const drawer =
        $(
            "[data-cart-panel]"
        );


    if (
        drawer
    ) {

        drawer.classList.remove(
            "open"
        );


        drawer.hidden =
            true;

    }


    document.body.classList.remove(
        "cart-drawer-open"
    );


    MyShop.cartDrawerOpen =
        false;

}


/* ============================================================
   CART FALLBACK MODAL
   ============================================================ */

function openCartFallbackModal() {

    let modal =
        getElement(
            "cartModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "cartModal";

        modal.className =
            "modal cart-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-cart
        ></div>


        <div
            class="modal-content cart-modal-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-cart
                aria-label="Close cart"
            >
                ×
            </button>


            <div
                class="cart-modal-header"
            >

                <h2>
                    Shopping Cart
                </h2>

            </div>


            <div
                data-cart-drawer
            ></div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "cart";


    renderCartDrawer();

}


/* ============================================================
   CART CLICK EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const open =
            event.target.closest(
                "[data-open-cart]"
            );


        if (open) {

            event.preventDefault();


            openCartDrawer();


            return;

        }


        const close =
            event.target.closest(
                "[data-close-cart]"
            );


        if (close) {

            event.preventDefault();


            closeCartDrawer();


            const modal =
                getElement(
                    "cartModal"
                );


            if (modal) {

                modal.hidden =
                    true;

            }


            document.body.classList.remove(
                "modal-open"
            );


            if (
                MyShop.activeModal ===
                "cart"
            ) {

                MyShop.activeModal =
                    null;

            }


            return;

        }


        const minus =
            event.target.closest(
                "[data-cart-minus]"
            );


        if (minus) {

            event.preventDefault();


            changeCartItemQuantity(
                minus.dataset
                    .cartMinus,
                -1
            );


            return;

        }


        const plus =
            event.target.closest(
                "[data-cart-plus]"
            );


        if (plus) {

            event.preventDefault();


            changeCartItemQuantity(
                plus.dataset
                    .cartPlus,
                1
            );


            return;

        }


        const remove =
            event.target.closest(
                "[data-cart-remove]"
            );


        if (remove) {

            event.preventDefault();


            removeCartItemByProductId(
                remove.dataset
                    .cartRemove
            );


            return;

        }


        const checkout =
            event.target.closest(
                "[data-go-checkout]"
            );


        if (checkout) {

            event.preventDefault();


            closeCartDrawer();


            if (
                typeof openCheckout ===
                "function"
            ) {

                openCheckout();

            }


            return;

        }

    }
);


/* ============================================================
   CHANGE CART QUANTITY
   ============================================================ */

function changeCartItemQuantity(
    productId,
    delta
) {

    const items =
        getCartItemsSafe();


    const item =
        items.find(
            cartItem =>
                String(
                    cartItem.productId ||
                    cartItem.id
                ) ===
                String(
productId
                )
        );


    if (!item) {

        return false;

    }


    const product =
        getProductById(
            productId
        );


    if (!product) {

        return false;

    }


    const current =
        Number(
            item.quantity ||
            1
        );


    const stock =
        Number(
            product.stock ||
            0
        );


    let next =
        current +
        Number(
            delta ||
            0
        );


    next =
        Math.max(
            1,
            next
        );


    if (
        stock > 0
    ) {

        next =
            Math.min(
                stock,
                next
            );

    }


    if (
        typeof updateCartItemQuantity ===
        "function"
    ) {

        updateCartItemQuantity(
            productId,
            next
        );

    }
    else {

        item.quantity =
            next;

        MyShop.cart =
            items;

        saveToStorage(
            "myshop_cart",
            MyShop.cart
        );

    }


    renderCartDrawer();


    return true;

}


/* ============================================================
   REMOVE CART ITEM
   ============================================================ */

function removeCartItemByProductId(
    productId
) {

    if (
        typeof removeFromCart ===
        "function"
    ) {

        removeFromCart(
            productId
        );

    }
    else {

        MyShop.cart =
            getCartItemsSafe().filter(
                item =>
                    String(
                        item.productId ||
                        item.id
                    ) !==
                    String(
                        productId
                    )
            );


        saveToStorage(
            "myshop_cart",
            MyShop.cart
        );

    }


    renderCartDrawer();


    showToast(
        "Product removed from cart.",
        "success"
    );

}


/* ============================================================
   CART QUANTITY INPUT
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const input =
            event.target.closest(
                "[data-cart-quantity]"
            );


        if (!input) {

            return;

        }


        const productId =
            input.dataset
                .cartQuantity;


        const quantity =
            Number(
                input.value
            );


        const current =
            getCartItemsSafe()
                .find(
                    item =>
                        String(
                            item.productId ||
                            item.id
                        ) ===
                        String(
                            productId
                        )
                );


        if (!current) {

            return;

        }


        const oldQuantity =
            Number(
                current.quantity ||
                1
            );


        changeCartItemQuantity(
            productId,
            quantity -
            oldQuantity
        );

    }
);


/* ============================================================
   CART ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            MyShop.cartDrawerOpen
        ) {

            closeCartDrawer();

        }


        if (
            MyShop.activeModal ===
            "cart"
        ) {

            const modal =
                getElement(
                    "cartModal"
                );


            if (modal) {

                modal.hidden =
                    true;

            }


            document.body.classList.remove(
                "modal-open"
            );


            MyShop.activeModal =
                null;

        }

    }
);


/* ============================================================
   CART UPDATE EVENT
   ============================================================ */

document.addEventListener(
    "myshop:cart-updated",
    function () {

        renderCartDrawer();

    }
);


/* ============================================================
   INITIAL CART DRAWER STATE
   ============================================================ */

initializeCartDrawerState();

renderCartDrawer();


	/* ============================================================
   MyShop Marketplace
   app.js — PART 19B
   Coupon + Shipping Progress + Cart Enhancements
   ============================================================ */


/* ============================================================
   COUPON STATE
   ============================================================ */

function initializeCouponState() {

    if (
        MyShop.appliedCoupon ===
        undefined
    ) {

        MyShop.appliedCoupon =
            null;

    }

}


/* ============================================================
   AVAILABLE COUPONS
   ============================================================ */

function getAvailableCoupons() {

    if (
        Array.isArray(
            MyShop.coupons
        )
    ) {

        return MyShop.coupons;

    }


    return [

        {
            code:
                "WELCOME10",

            type:
                "percentage",

            value:
                10,

            minOrder:
                500
        },

        {
            code:
                "SAVE200",

            type:
                "fixed",

            value:
                200,

            minOrder:
                1500
        }

    ];

}


/* ============================================================
   FIND COUPON
   ============================================================ */

function findCoupon(
    code
) {

    const normalized =
        String(
            code || ""
        )
            .trim()
            .toUpperCase();


    if (
        !normalized
    ) {

        return null;

    }


    return getAvailableCoupons()
        .find(
            coupon =>
                String(
                    coupon.code ||
                    ""
                )
                    .trim()
                    .toUpperCase() ===
                normalized
        ) || null;

}


/* ============================================================
   APPLY COUPON
   ============================================================ */

function applyCoupon(
    code
) {

    initializeCouponState();


    const coupon =
        findCoupon(
            code
        );


    if (!coupon) {

        showToast(
            "Invalid promo code.",
            "error"
        );


        return false;

    }


    const subtotal =
        getCartSubtotal();


    const minimum =
        Number(
            coupon.minOrder ||
            0
        );


    if (
        subtotal <
        minimum
    ) {

        showToast(
            `Minimum order is ${formatPrice(
                minimum
            )}.`,
            "error"
        );


        return false;

    }


    MyShop.appliedCoupon = {

        code:
            String(
                coupon.code
            ),

        type:
            coupon.type ===
            "fixed"
                ? "fixed"
                : "percentage",

        value:
            Number(
                coupon.value ||
                0
            ),

        minOrder:
            minimum

    };


    saveToStorage(
        "myshop_coupon",
        MyShop.appliedCoupon
    );


    renderCartDrawer();

    updateCartEnhancements();


    showToast(
        `Coupon ${coupon.code} applied.`,
        "success"
    );


    return true;

}


/* ============================================================
   REMOVE COUPON
   ============================================================ */

function removeCoupon() {

    MyShop.appliedCoupon =
        null;


    saveToStorage(
        "myshop_coupon",
        null
    );


    renderCartDrawer();

    updateCartEnhancements();


    showToast(
        "Coupon removed.",
        "success"
    );

}


/* ============================================================
   COUPON FORM
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-coupon-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const input =
            form.querySelector(
                "[data-coupon-input]"
            );


        if (!input) {

            return;

        }


        applyCoupon(
            input.value
        );

    }
);


/* ============================================================
   REMOVE COUPON BUTTON
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-remove-coupon]"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        removeCoupon();

    }
);


/* ============================================================
   FREE SHIPPING PROGRESS
   ============================================================ */

function getShippingProgress() {

    const subtotal =
        getCartSubtotal();


    const threshold =
        Number(
            MyShop.freeShippingThreshold ??
            2000
        );


    if (
        threshold <=
        0
    ) {

        return {

            subtotal,

            threshold,

            remaining:
                0,

            percentage:
                100,

            qualified:
                true

        };

    }


    const remaining =
        Math.max(
            0,
            threshold -
            subtotal
        );


    const percentage =
        Math.min(
            100,
            (
                subtotal /
                threshold
            ) *
            100
        );


    return {

        subtotal,

        threshold,

        remaining,

        percentage,

        qualified:
            remaining ===
            0

    };

}


/* ============================================================
   FREE SHIPPING HTML
   ============================================================ */

function createShippingProgressHTML() {

    const progress =
        getShippingProgress();


    if (
        progress.qualified
    ) {

        return `

            <div
                class="shipping-progress free-shipping-qualified"
            >

                <div
                    class="shipping-progress-message"
                >
                    🚚
                    <strong>
                        You've unlocked FREE shipping!
                    </strong>
                </div>


                <div
                    class="shipping-progress-track"
                >

                    <span
                        style="width:100%"
                    ></span>

                </div>

            </div>

        `;

    }


    return `

        <div
            class="shipping-progress"
        >

            <div
                class="shipping-progress-message"
            >

                🚚

                <span>
                    Add
                    <strong>
                        ${formatPrice(
                            progress.remaining
                        )}
                    </strong>
                    more for
                    <strong>
                        FREE shipping
                    </strong>
                </span>

            </div>


            <div
                class="shipping-progress-track"
            >

                <span
                    style="width:${progress.percentage}%"
                ></span>

            </div>

        </div>

    `;

}


/* ============================================================
   UPDATE SHIPPING PROGRESS
   ============================================================ */

function updateShippingProgress() {

    $$(
        "[data-shipping-progress]"
    ).forEach(
        container => {

            container.innerHTML =
                createShippingProgressHTML();

        }
    );

}


/* ============================================================
   COUPON STATUS HTML
   ============================================================ */

function createCouponStatusHTML() {

    initializeCouponState();


    const coupon =
        MyShop.appliedCoupon;


    if (!coupon) {

        return `

            <form
                class="coupon-form"
                data-coupon-form
            >

                <label
                    for="couponInput"
                >
                    Promo Code
                </label>


                <div
                    class="coupon-input-row"
                >

                    <input
                        id="couponInput"
                        type="text"
                        placeholder="Enter code"
                        autocomplete="off"
                        data-coupon-input
                    >


                    <button
                        type="submit"
                        class="secondary-button"
                    >
                        Apply
                    </button>

                </div>

            </form>

        `;

    }


    const discount =
        getCartDiscount();


    return `

        <div
            class="applied-coupon"
        >

            <div>

                <span>
                    🏷️
                </span>

                <strong>
                    ${escapeHTML(
                        coupon.code
                    )}
                </strong>

                <small>
                    −${formatPrice(
                        discount
                    )}
                </small>

            </div>


            <button
                type="button"
                class="text-button"
                data-remove-coupon
            >
                Remove
            </button>

        </div>

    `;

}


/* ============================================================
   UPDATE CART ENHANCEMENTS
   ============================================================ */

function updateCartEnhancements() {

    updateShippingProgress();


    $$(
        "[data-coupon-container]"
    ).forEach(
        container => {

            container.innerHTML =
                createCouponStatusHTML();

        }
    );


    $$(
        "[data-cart-subtotal]"
    ).forEach(
        element => {

            element.textContent =
                formatPrice(
                    getCartSubtotal()
                );

        }
    );


    $$(
        "[data-cart-discount]"
    ).forEach(
        element => {

            element.textContent =
                formatPrice(
                    getCartDiscount()
                );

        }
    );


    $$(
        "[data-cart-shipping]"
    ).forEach(
        element => {

            const shipping =
                getCartShipping();


            element.textContent =
                shipping === 0
                    ? "Free"
                    : formatPrice(
                        shipping
                    );

        }
    );


    $$(
        "[data-cart-total]"
    ).forEach(
        element => {

            element.textContent =
                formatPrice(
                    getCartTotal()
                );

        }
    );

}


/* ============================================================
   ENHANCE EXISTING CART DRAWER
   ============================================================ */

function enhanceCartDrawer() {

    const drawer =
        $(
            "[data-cart-drawer]"
        );


    if (!drawer) {

        updateCartEnhancements();

        return;

    }


    const items =
        getCartItemsSafe();


    if (
        items.length ===
        0
    ) {

        updateCartEnhancements();

        return;

    }


    /*
       Insert shipping progress
       before cart items when the
       markup supports it.
    */

    let shipping =
        $(
            "[data-shipping-progress]",
            drawer
        );


    if (!shipping) {

        shipping =
            document.createElement(
                "div"
            );

        shipping.setAttribute(
            "data-shipping-progress",
            ""
        );


        drawer.prepend(
            shipping
        );

    }


    /*
       Insert coupon container
       before the summary.
    */

    let coupon =
        $(
            "[data-coupon-container]",
            drawer
        );


    if (!coupon) {

        coupon =
            document.createElement(
                "div"
            );

        coupon.setAttribute(
            "data-coupon-container",
            ""
        );


        const summary =
            $(
                ".cart-summary",
                drawer
            );


        if (
            summary
        ) {

            summary.prepend(
                coupon
            );

        }
        else {

            drawer.append(
                coupon
            );

        }

    }


    updateCartEnhancements();

}


/* ============================================================
   CART DRAWER OPEN OVERRIDE
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const open =
            event.target.closest(
                "[data-open-cart]"
            );


        if (!open) {

            return;

        }


        setTimeout(
            () => {

                enhanceCartDrawer();

            },
            0
        );

    }
);


/* ============================================================
   CART UPDATE HOOK
   ============================================================ */

document.addEventListener(
    "myshop:cart-updated",
    function () {

        setTimeout(
            () => {

                enhanceCartDrawer();

                updateCartEnhancements();

            },
            0
        );

    }
);


/* ============================================================
   LOAD SAVED COUPON
   ============================================================ */

const savedCoupon =
    loadFromStorage(
        "myshop_coupon",
        null
    );


if (
    savedCoupon &&
    typeof savedCoupon ===
        "object"
) {

    MyShop.appliedCoupon =
        savedCoupon;

}
else {

    MyShop.appliedCoupon =
        null;

}


initializeCouponState();

updateCartEnhancements();

/* ============================================================
   MyShop Marketplace
   app.js — PART 20A
   Checkout Flow + Customer Information
   ============================================================ */


/* ============================================================
   CHECKOUT STATE
   ============================================================ */

function initializeCheckoutState() {

    if (
        !MyShop.checkout ||
        typeof MyShop.checkout !==
            "object"
    ) {

        MyShop.checkout = {};

    }


    if (
        MyShop.checkout.step ===
        undefined
    ) {

        MyShop.checkout.step =
            1;

    }


    if (
        MyShop.checkout.customer ===
        undefined
    ) {

        MyShop.checkout.customer = {

            name:
                "",

            email:
                "",

            phone:
                "",

            address:
                "",

            city:
                "",

            postalCode:
                "",

            note:
                ""

        };

    }

}


/* ============================================================
   GET CHECKOUT CUSTOMER
   ============================================================ */

function getCheckoutCustomer() {

    initializeCheckoutState();


    return {

        ...MyShop.checkout.customer

    };

}


/* ============================================================
   SAVE CHECKOUT CUSTOMER
   ============================================================ */

function saveCheckoutCustomer(
    customer
) {

    initializeCheckoutState();


    MyShop.checkout.customer = {

        ...MyShop.checkout.customer,

        ...customer

    };


    saveToStorage(
        "myshop_checkout_customer",
        MyShop.checkout.customer
    );


    return true;

}


/* ============================================================
   CHECKOUT VALIDATION
   ============================================================ */

function validateCheckoutCustomer(
    customer
) {

    const errors = [];


    if (
        !String(
            customer.name ||
            ""
        ).trim()
    ) {

        errors.push(
            "Please enter your name."
        );

    }


    const email =
        String(
            customer.email ||
            ""
        ).trim();


    if (
        !email
    ) {

        errors.push(
            "Please enter your email."
        );

    }
    else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(
                email
            )
    ) {

        errors.push(
            "Please enter a valid email."
        );

    }


    const phone =
        String(
            customer.phone ||
            ""
        ).trim();


    if (
        !phone
    ) {

        errors.push(
            "Please enter your phone number."
        );

    }


    if (
        !String(
            customer.address ||
            ""
        ).trim()
    ) {

        errors.push(
            "Please enter your delivery address."
        );

    }


    if (
        !String(
            customer.city ||
            ""
        ).trim()
    ) {

        errors.push(
            "Please enter your city."
        );

    }


    return {

        valid:
            errors.length ===
            0,

        errors

    };

}


/* ============================================================
   CHECKOUT TOTALS
   ============================================================ */

function getCheckoutTotals() {

    const summary =
        getCartSummary();


    return {

        subtotal:
            summary.subtotal,

        discount:
            summary.discount,

        shipping:
            summary.shipping,

        total:
            summary.total

    };

}


/* ============================================================
   CHECKOUT ORDER SUMMARY HTML
   ============================================================ */

function createCheckoutSummaryHTML() {

    const items =
        getCartItemsSafe();


    const totals =
        getCheckoutTotals();


    if (
        items.length ===
        0
    ) {

        return `

            <div
                class="checkout-empty"
            >

                <div>
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some products before
                    continuing to checkout.
                </p>

            </div>

        `;

    }


    return `

        <div
            class="checkout-order-items"
        >

            ${
                items
                    .map(
                        item => {

                            const product =
                                getProductById(
                                    item.productId ||
                                    item.id
                                );


                            if (!product) {

                                return "";

                            }


                            const quantity =
                                Number(
                                    item.quantity ||
                                    1
                                );


                            const price =
                                Number(
                                    item.price ??
                                    product.price ??
                                    0
                                );


                            return `

                                <div
                                    class="checkout-order-item"
                                >

                                    <div
                                        class="checkout-order-product"
                                    >

                                        <span
                                            class="checkout-product-image"
                                        >
                                            ${
                                                product.emoji ||
                                                "📦"
                                            }
                                        </span>


                                        <div>

                                            <strong>
                                                ${escapeHTML(
                                                    product.name
                                                )}
                                            </strong>

                                            <small>
                                                Qty:
                                                ${quantity}
                                            </small>

                                        </div>

                                    </div>


                                    <strong>
                                        ${formatPrice(
                                            price *
                                            quantity
                                        )}
                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }

        </div>


        <div
            class="checkout-totals"
        >

            <div>
                <span>
                    Subtotal
                </span>

                <strong>
                    ${formatPrice(
                        totals.subtotal
                    )}
                </strong>
            </div>


            ${
                totals.discount >
                0
                    ? `
                        <div
                            class="discount-row"
                        >

                            <span>
                                Discount
                            </span>

                            <strong>
                                −${formatPrice(
                                    totals.discount
                                )}
                            </strong>

                        </div>
                      `
                    : ""
            }


            <div>
                <span>
                    Shipping
                </span>

                <strong>
                    ${
                        totals.shipping ===
                        0
                            ? "Free"
                            : formatPrice(
                                totals.shipping
                            )
                    }
                </strong>
            </div>


            <div
                class="checkout-grand-total"
            >

                <span>
                    Total
                </span>

                <strong>
                    ${formatPrice(
                        totals.total
                    )}
                </strong>

            </div>

        </div>

    `;

}


/* ============================================================
   CHECKOUT MODAL
   ============================================================ */

function openCheckout() {

    initializeCheckoutState();


    const items =
        getCartItemsSafe();


    if (
        items.length ===
        0
    ) {

        showToast(
            "Your cart is empty.",
            "error"
        );


        return;

    }


    let modal =
        getElement(
            "checkoutModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "checkoutModal";

        modal.className =
            "modal checkout-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const customer =
        getCheckoutCustomer();


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-checkout
        ></div>


        <div
            class="modal-content checkout-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-checkout
                aria-label="Close checkout"
            >
                ×
            </button>


            <div
                class="checkout-header"
            >

                <span>
                    Secure Checkout
                </span>

                <h2>
                    Complete Your Order
                </h2>

            </div>


            <div
                class="checkout-layout"
            >

                <div
                    class="checkout-form-column"
                >

                    <form
                        data-checkout-form
                        novalidate
                    >

                        <section
                            class="checkout-section"
                        >

                            <h3>
                                Contact Information
                            </h3>


                            <div
                                class="form-grid"
                            >

                                <div
                                    class="form-group"
                                >

                                    <label
                                        for="checkoutName"
                                    >
                                        Full Name *
                                    </label>

                                    <input
                                        id="checkoutName"
                                        name="name"
                                        type="text"
                                        value="${escapeHTML(
                                            customer.name ||
                                            ""
                                        )}"
                                        autocomplete="name"
                                        required
                                    >

                                </div>


                                <div
                                    class="form-group"
                                >

                                    <label
                                        for="checkoutEmail"
                                    >
                                        Email *
                                    </label>

                                    <input
                                        id="checkoutEmail"
                                        name="email"
                                        type="email"
                                        value="${escapeHTML(
                                            customer.email ||
                                            ""
                                        )}"
                                        autocomplete="email"
                                        required
                                    >

                                </div>


                                <div
                                    class="form-group"
                                >

                                    <label
                                        for="checkoutPhone"
                                    >
                                        Phone *
                                    </label>

                                    <input
                                        id="checkoutPhone"
                                        name="phone"
                                        type="tel"
                                        value="${escapeHTML(
                                            customer.phone ||
                                            ""
                                        )}"
                                        autocomplete="tel"
                                        required
                                    >

                                </div>

                            </div>

                        </section>


                        <section
                            class="checkout-section"
                        >

                            <h3>
                                Delivery Address
                            </h3>


                            <div
                                class="form-group"
                            >

                                <label
                                    for="checkoutAddress"
                                >
                                    Address *
                                </label>

                                <textarea
                                    id="checkoutAddress"
                                    name="address"
                                    rows="3"
                                    autocomplete="street-address"
                                    required
                                >${escapeHTML(
                                    customer.address ||
                                    ""
                                )}</textarea>

                            </div>


                            <div
                                class="form-grid"
                            >

                                <div
                                    class="form-group"
                                >

                                    <label
                                        for="checkoutCity"
                                    >
                                        City *
                                    </label>

                                    <input
                                        id="checkoutCity"
                                        name="city"
                                        type="text"
                                        value="${escapeHTML(
                                            customer.city ||
                                            ""
                                        )}"
                                        autocomplete="address-level2"
                                        required
                                    >

                                </div>


                                <div
                                    class="form-group"
                                >

                                    <label
                                        for="checkoutPostalCode"
                                    >
                                        Postal Code
                                    </label>

                                    <input
                                        id="checkoutPostalCode"
                                        name="postalCode"
                                        type="text"
                                        value="${escapeHTML(
                                            customer.postalCode ||
                                            ""
                                        )}"
                                        autocomplete="postal-code"
                                    >

                                </div>

                            </div>


                            <div
                                class="form-group"
                            >

                                <label
                                    for="checkoutNote"
                                >
                                    Order Note
                                    <small>
                                        Optional
                                    </small>
                                </label>

                                <textarea
                                    id="checkoutNote"
                                    name="note"
                                    rows="3"
                                    placeholder="Any special delivery instructions?"
                                >${escapeHTML(
                                    customer.note ||
                                    ""
                                )}</textarea>

                            </div>

                        </section>


                        <div
                            class="checkout-form-actions"
                        >

                            <button
                                type="button"
                                class="secondary-button"
                                data-close-checkout
                            >
                                Back to Cart
                            </button>


                            <button
                                type="submit"
                                class="primary-button"
                            >
                                Continue to Payment
                            </button>

                        </div>


                        <div
                            class="checkout-form-errors"
                            data-checkout-errors
                            hidden
                        ></div>

                    </form>

                </div>


                <aside
                    class="checkout-summary-column"
                >

                    <h3>
                        Order Summary
                    </h3>


                    <div
                        data-checkout-summary
                    >
                        ${createCheckoutSummaryHTML()}
                    </div>

                </aside>
</div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "checkout";


    MyShop.checkout.step =
        1;

}


/* ============================================================
   CHECKOUT FORM SUBMIT
   ============================================================ */

document.addEventListener(
    "submit",
    function (event) {

        const form =
            event.target.closest(
                "[data-checkout-form]"
            );


        if (!form) {

            return;

        }


        event.preventDefault();


        const customer = {

            name:
                form.elements
                    .namedItem(
                        "name"
                    )
                    ?.value
                    ?.trim() ||
                "",

            email:
                form.elements
                    .namedItem(
                        "email"
                    )
                    ?.value
                    ?.trim() ||
                "",

            phone:
                form.elements
                    .namedItem(
                        "phone"
                    )
                    ?.value
                    ?.trim() ||
                "",

            address:
                form.elements
                    .namedItem(
                        "address"
                    )
                    ?.value
                    ?.trim() ||
                "",

            city:
                form.elements
                    .namedItem(
                        "city"
                    )
                    ?.value
                    ?.trim() ||
                "",

            postalCode:
                form.elements
                    .namedItem(
                        "postalCode"
                    )
                    ?.value
                    ?.trim() ||
                "",

            note:
                form.elements
                    .namedItem(
                        "note"
                    )
                    ?.value
                    ?.trim() ||
                ""

        };


        const validation =
            validateCheckoutCustomer(
                customer
            );


        const errors =
            $(
                "[data-checkout-errors]",
                form
            );


        if (
            !validation.valid
        ) {

            if (
                errors
            ) {

                errors.hidden =
                    false;


                errors.innerHTML = `

                    <ul>

                        ${
                            validation.errors
                                .map(
                                    error =>
                                        `<li>${escapeHTML(
                                            error
                                        )}</li>`
                                )
                                .join("")
                        }

                    </ul>

                `;

            }


            showToast(
                "Please complete the required fields.",
                "error"
            );


            return;

        }


        if (
            errors
        ) {

            errors.hidden =
                true;

        }


        saveCheckoutCustomer(
            customer
        );


        MyShop.checkout.step =
            2;


        if (
            typeof openPaymentStep ===
            "function"
        ) {

            openPaymentStep();

        }
        else {

            showToast(
                "Customer information saved.",
                "success"
            );

        }

    }
);


/* ============================================================
   CLOSE CHECKOUT
   ============================================================ */

function closeCheckout() {

    const modal =
        getElement(
            "checkoutModal"
        );


    if (
        modal
    ) {

        modal.hidden =
            true;

    }


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "checkout"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   CHECKOUT CLOSE EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const close =
            event.target.closest(
                "[data-close-checkout]"
            );


        if (!close) {

            return;

        }


        event.preventDefault();


        closeCheckout();

    }
);


/* ============================================================
   CHECKOUT ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "checkout"
        ) {

            closeCheckout();

        }

    }
);


/* ============================================================
   LOAD SAVED CHECKOUT CUSTOMER
   ============================================================ */

const savedCheckoutCustomer =
    loadFromStorage(
        "myshop_checkout_customer",
        null
    );


initializeCheckoutState();


if (
    savedCheckoutCustomer &&
    typeof savedCheckoutCustomer ===
        "object"
) {

    MyShop.checkout.customer = {

        ...MyShop.checkout.customer,

        ...savedCheckoutCustomer

    };

}

/* ============================================================
   MyShop Marketplace
   app.js — PART 20B
   Payment Step + Final Order Review
   ============================================================ */


/* ============================================================
   PAYMENT STATE
   ============================================================ */

function initializePaymentState() {

    initializeCheckoutState();


    if (
        MyShop.checkout.payment ===
        undefined
    ) {

        MyShop.checkout.payment = {

            method:
                "cash_on_delivery",

            transactionId:
                ""

        };

    }

}


/* ============================================================
   PAYMENT METHODS
   ============================================================ */

function getPaymentMethods() {

    return [

        {
            id:
                "cash_on_delivery",

            name:
                "Cash on Delivery",

            description:
                "Pay when your order arrives.",

            icon:
                "💵"

        },

        {
            id:
                "card",

            name:
                "Credit / Debit Card",

            description:
                "Pay securely using your card.",

            icon:
                "💳"

        },

        {
            id:
                "mobile_banking",

            name:
                "Mobile Banking",

            description:
                "Pay using your mobile banking service.",

            icon:
                "📱"

        }

    ];

}


/* ============================================================
   GET SELECTED PAYMENT
   ============================================================ */

function getSelectedPaymentMethod() {

    initializePaymentState();


    return (
        getPaymentMethods()
            .find(
                method =>
                    method.id ===
                    MyShop.checkout.payment.method
            ) ||
        getPaymentMethods()[0]
    );

}


/* ============================================================
   SAVE PAYMENT METHOD
   ============================================================ */

function savePaymentMethod(
    methodId
) {

    initializePaymentState();


    const method =
        getPaymentMethods()
            .find(
                item =>
                    item.id ===
                    methodId
            );


    if (!method) {

        return false;

    }


    MyShop.checkout.payment.method =
        method.id;


    saveToStorage(
        "myshop_payment_method",
        MyShop.checkout.payment
    );


    return true;

}


/* ============================================================
   PAYMENT STEP
   ============================================================ */

function openPaymentStep() {

    initializePaymentState();


    const modal =
        getElement(
            "checkoutModal"
        );


    if (!modal) {

        return;

    }


    const customer =
        getCheckoutCustomer();


    const totals =
        getCheckoutTotals();


    const selected =
        getSelectedPaymentMethod();


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-checkout
        ></div>


        <div
            class="modal-content checkout-content payment-step"
        >

            <button
                type="button"
                class="modal-close"
                data-close-checkout
                aria-label="Close checkout"
            >
                ×
            </button>


            <div
                class="checkout-header"
            >

                <span>
                    Step 2 of 2
                </span>

                <h2>
                    Payment Method
                </h2>

            </div>


            <div
                class="checkout-layout"
            >

                <div
                    class="checkout-form-column"
                >

                    <section
                        class="checkout-section"
                    >

                        <h3>
                            Choose Payment Method
                        </h3>


                        <div
                            class="payment-methods"
                        >

                            ${
                                getPaymentMethods()
                                    .map(
                                        method => `

                                            <label
                                                class="payment-method ${
                                                    method.id ===
                                                    selected.id
                                                        ? "selected"
                                                        : ""
                                                }"
                                            >

                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="${escapeHTML(
                                                        method.id
                                                    )}"
                                                    ${
                                                        method.id ===
                                                        selected.id
                                                            ? "checked"
                                                            : ""
                                                    }
                                                >


                                                <span
                                                    class="payment-method-icon"
                                                >
                                                    ${method.icon}
                                                </span>


                                                <span
                                                    class="payment-method-info"
                                                >

                                                    <strong>
                                                        ${escapeHTML(
                                                            method.name
                                                        )}
                                                    </strong>

                                                    <small>
                                                        ${escapeHTML(
                                                            method.description
                                                        )}
                                                    </small>

                                                </span>

                                            </label>

                                        `
                                    )
                                    .join("")
                            }

                        </div>

                    </section>


                    <section
                        class="checkout-section customer-review-section"
                    >

                        <div
                            class="section-heading-with-action"
                        >

                            <h3>
                                Delivery Information
                            </h3>


                            <button
                                type="button"
                                class="text-button"
                                data-back-customer
                            >
                                Edit
                            </button>

                        </div>


                        <div
                            class="checkout-customer-preview"
                        >

                            <strong>
                                ${escapeHTML(
                                    customer.name ||
                                    ""
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    customer.phone ||
                                    ""
                                )}
                            </span>

                            <span>
                                ${escapeHTML(
                                    customer.email ||
                                    ""
                                )}
                            </span>

                            <span>
                                ${escapeHTML(
                                    customer.address ||
                                    ""
                                )}
                            </span>

                            <span>
                                ${escapeHTML(
                                    customer.city ||
                                    ""
                                )}
                                ${
                                    customer.postalCode
                                        ? `, ${escapeHTML(
                                            customer.postalCode
                                        )}`
                                        : ""
                                }
                            </span>

                        </div>

                    </section>


                    <div
                        class="checkout-form-actions"
                    >

                        <button
                            type="button"
                            class="secondary-button"
                            data-back-customer
                        >
                            ← Back
                        </button>


                        <button
                            type="button"
                            class="primary-button"
                            data-review-order
                        >
                            Review Order
                        </button>

                    </div>

                </div>


                <aside
                    class="checkout-summary-column"
                >

                    <h3>
                        Order Summary
                    </h3>


                    <div
                        data-checkout-summary
                    >
                        ${createCheckoutSummaryHTML()}
                    </div>

                </aside>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "checkout";


    MyShop.checkout.step =
        2;

}


/* ============================================================
   PAYMENT METHOD CHANGE
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const input =
            event.target.closest(
                'input[name="paymentMethod"]'
            );


        if (!input) {

            return;

        }


        savePaymentMethod(
            input.value
        );


        $$(
            ".payment-method"
        ).forEach(
            label => {

                const radio =
                    $(
                        'input[name="paymentMethod"]',
                        label
                    );


                label.classList.toggle(
                    "selected",
                    radio?.checked ===
                        true
                );

            }
        );

    }
);


/* ============================================================
   BACK TO CUSTOMER INFORMATION
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const back =
            event.target.closest(
                "[data-back-customer]"
            );


        if (!back) {

            return;

        }


        event.preventDefault();


        openCheckout();

    }
);


/* ============================================================
   REVIEW ORDER
   ============================================================ */

function openOrderReview() {

    initializePaymentState();


    const modal =
        getElement(
            "checkoutModal"
        );


    if (!modal) {

        return;

    }


    const customer =
        getCheckoutCustomer();


    const payment =
        getSelectedPaymentMethod();


    const totals =
        getCheckoutTotals();


    const items =
        getCartItemsSafe();


    if (
        items.length ===
        0
    ) {

        showToast(
            "Your cart is empty.",
            "error"
        );


        closeCheckout();


        return;

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-checkout
        ></div>


        <div
            class="modal-content checkout-content order-review-step"
        >

            <button
                type="button"
                class="modal-close"
                data-close-checkout
                aria-label="Close checkout"
            >
                ×
            </button>


            <div
                class="checkout-header"
            >

                <span>
                    Final Review
                </span>

                <h2>
                    Review Your Order
                </h2>

            </div>


            <div
                class="order-review-layout"
            >

                <section
                    class="order-review-section"
                >

                    <h3>
                        Products
                    </h3>


                    <div
                        class="review-products"
                    >

                        ${
                            items
                                .map(
                                    item => {

                                        const product =
                                            getProductById(
                                                item.productId ||
                                                item.id
                                            );


                                        if (!product) {

                                            return "";

                                        }


                                        const quantity =
                                            Number(
                                                item.quantity ||
                                                1
                                            );


                                        const price =
                                            Number(
                                                item.price ??
                                                product.price ??
                                                0
                                            );


                                        return `

                                            <div
                                                class="review-product-row"
                                            >

                                                <div>

                                                    <span>
                                                        ${
                                                            product.emoji ||
                                                            "📦"
                                                        }
                                                    </span>

                                                    <div>

                                                        <strong>
                                                            ${escapeHTML(
                                                                product.name
                                                            )}
                                                        </strong>

                                                        <small>
                                                            Qty:
                                                            ${quantity}
                                                        </small>

                                                    </div>

                                                </div>


                                                <strong>
                                                    ${formatPrice(
                                                        price *
                                                        quantity
                                                    )}
                                                </strong>

                                            </div>

                                        `;

                                    }
                                )
                                .join("")
                        }

                    </div>

                </section>


                <section
                    class="order-review-section"
                >

                    <h3>
                        Delivery Address
                    </h3>


                    <div
                        class="review-info-card"
                    >

                        <strong>
                            ${escapeHTML(
                                customer.name ||
                                ""
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                customer.phone ||
                                ""
                            )}
                        </span>

                        <span>
                            ${escapeHTML(
                                customer.email ||
                                ""
                            )}
                        </span>

                        <span>
                            ${escapeHTML(
                                customer.address ||
                                ""
                            )}
                        </span>

                        <span>
                 ${escapeHTML(
                                customer.city ||
                                ""
                            )}
                            ${
                                customer.postalCode
                                    ? `, ${escapeHTML(
                                        customer.postalCode
                                    )}`
                                    : ""
                            }
                        </span>


                        ${
                            customer.note
                                ? `
                                    <div
                                        class="review-note"
                                    >

                                        <strong>
                                            Note:
                                        </strong>

                                        ${escapeHTML(
                                            customer.note
                                        )}

                                    </div>
                                  `
                                : ""
                        }

                    </div>

                </section>


                <section
                    class="order-review-section"
                >

                    <h3>
                        Payment
                    </h3>


                    <div
                        class="review-info-card"
                    >

                        <span
                            class="payment-review-icon"
                        >
                            ${payment.icon}
                        </span>

                        <strong>
                            ${escapeHTML(
                                payment.name
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                payment.description
                            )}
                        </small>

                    </div>

                </section>


                <section
                    class="order-review-total-section"
                >

                    <div>
                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${formatPrice(
                                totals.subtotal
                            )}
                        </strong>
                    </div>


                    ${
                        totals.discount >
                        0
                            ? `
                                <div>
                                    <span>
                                        Discount
                                    </span>

                                    <strong>
                                        −${formatPrice(
                                            totals.discount
                                        )}
                                    </strong>
                                </div>
                              `
                            : ""
                    }


                    <div>
                        <span>
                            Shipping
                        </span>

                        <strong>
                            ${
                                totals.shipping ===
                                0
                                    ? "Free"
                                    : formatPrice(
                                        totals.shipping
                                    )
                            }
                        </strong>
                    </div>       
						


                    <div
                        class="final-total"
                    >

                        <span>
                            Total
                        </span>

                        <strong>
                            ${formatPrice(
                                totals.total
                            )}
                        </strong>

                    </div>

                </section>


                <div
                    class="checkout-form-actions"
                >

                    <button
                        type="button"
                        class="secondary-button"
                        data-back-payment
                    >
                        ← Back
                    </button>


                    <button
                        type="button"
                        class="primary-button"
                        data-place-order
                    >
                        Place Order
                    </button>

                </div>

            </div>

        </div>

    `;


    MyShop.checkout.step =
        3;

}


/* ============================================================
   REVIEW ORDER BUTTON
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const review =
            event.target.closest(
                "[data-review-order]"
            );


        if (!review) {

            return;

        }


        event.preventDefault();


        openOrderReview();

    }
);


/* ============================================================
   BACK TO PAYMENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const back =
            event.target.closest(
                "[data-back-payment]"
            );


        if (!back) {

            return;

        }


        event.preventDefault();


        openPaymentStep();

    }
);


/* ============================================================
   PAYMENT INITIALIZATION
   ============================================================ */

const savedPayment =
    loadFromStorage(
        "myshop_payment_method",
        null
    );


initializePaymentState();


if (
    savedPayment &&
    typeof savedPayment ===
        "object"
) {

    MyShop.checkout.payment = {

        ...MyShop.checkout.payment,

        ...savedPayment

    };

}


/* ============================================================
   CHECKOUT STEP RESTORE
   ============================================================ */

initializeCheckoutState();


if (
    MyShop.checkout.step <
    1 ||
    MyShop.checkout.step >
    3
) {

    MyShop.checkout.step =
        1;

}
/* ============================================================
   MyShop Marketplace
   app.js — PART 21A
   Order Creation + Order ID + Order Storage
   ============================================================ */


/* ============================================================
   ORDER STATE
   ============================================================ */

function initializeOrderState() {

    if (
        !Array.isArray(
            MyShop.orders
        )
    ) {

        MyShop.orders = [];

    }

}


/* ============================================================
   GENERATE ORDER ID
   ============================================================ */

function generateOrderId() {

    const now =
        new Date();


    const date =
        now.getFullYear()
        .toString()
        +
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        )
        +
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const time =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        )
        +
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        )
        +
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );


    const random =
        Math.random()
            .toString(
                36
            )
            .substring(
                2,
                7
            )
            .toUpperCase();


    return `MY-${date}-${time}-${random}`;

}


/* ============================================================
   GET CURRENT ORDER ITEMS
   ============================================================ */

function getOrderItemsSnapshot() {

    return getCartItemsSafe()
        .map(
            item => {

                const product =
                    getProductById(
                        item.productId ||
                        item.id
                    );


                if (!product) {

                    return null;

                }


                const quantity =
                    Math.max(
                        1,
                        Number(
                            item.quantity ||
                            1
                        )
                    );


                const price =
                    Number(
                        item.price ??
                        product.price ??
                        0
                    );


                return {

                    productId:
                        product.id,

                    name:
                        product.name,

                    category:
                        product.category ||
                        "",

                    emoji:
                        product.emoji ||
                        "📦",

                    price,

                    quantity,

                    lineTotal:
                        price *
                        quantity

                };

            }
        )
        .filter(
            Boolean
        );

}


/* ============================================================
   CREATE ORDER OBJECT
   ============================================================ */

function createOrderObject() {

    initializeOrderState();

    initializeCheckoutState();

    initializePaymentState();


    const items =
        getOrderItemsSnapshot();


    const customer =
        getCheckoutCustomer();


    const payment =
        getSelectedPaymentMethod();


    const totals =
        getCheckoutTotals();


    const orderId =
        generateOrderId();


    const createdAt =
        new Date()
            .toISOString();


    return {

        id:
            orderId,

        orderId:
            orderId,

        createdAt,

        updatedAt:
            createdAt,

        status:
            "pending",

        paymentStatus:
            payment.id ===
            "cash_on_delivery"
                ? "pending"
                : "awaiting_payment",

        customer: {

            name:
                customer.name,

            email:
                customer.email,

            phone:
                customer.phone,

            address:
                customer.address,

            city:
                customer.city,

            postalCode:
                customer.postalCode,

            note:
                customer.note

        },

        payment: {

            method:
                payment.id,

            methodName:
                payment.name,

            transactionId:
                MyShop.checkout
                    .payment
                    ?.transactionId ||
                ""

        },

        items,

        totals: {

            subtotal:
                totals.subtotal,

            discount:
                totals.discount,

            shipping:
                totals.shipping,

            total:
                totals.total

        },

        coupon:
            MyShop.appliedCoupon
                ? {
                    ...MyShop.appliedCoupon
                }
                : null

    };

}


/* ============================================================
   SAVE ORDER
   ============================================================ */

function saveOrder(
    order
) {

    initializeOrderState();


    MyShop.orders.push(
        order
    );


    saveToStorage(
        "myshop_orders",
        MyShop.orders
    );


    return order;

}


/* ============================================================
   LOAD ORDERS
   ============================================================ */

function loadOrders() {

    const stored =
        loadFromStorage(
            "myshop_orders",
            []
        );


    if (
        Array.isArray(
            stored
        )
    ) {

        MyShop.orders =
            stored;

    }
    else {

        MyShop.orders =
            [];

    }


    return MyShop.orders;

}


/* ============================================================
   GET ORDER BY ID
   ============================================================ */

function getOrderById(
    orderId
) {

    initializeOrderState();


    return MyShop.orders.find(
        order =>
            String(
                order.id ||
                order.orderId
            ) ===
            String(
                orderId
            )
    ) || null;

}


/* ============================================================
   UPDATE ORDER
   ============================================================ */

function updateOrder(
    orderId,
    updates
) {

    initializeOrderState();


    const index =
        MyShop.orders.findIndex(
            order =>
                String(
                    order.id ||
                    order.orderId
                ) ===
                String(
                    orderId
                )
        );


    if (
        index ===
        -1
    ) {

        return null;

    }


    MyShop.orders[index] = {

        ...MyShop.orders[index],

        ...updates,

        updatedAt:
            new Date()
                .toISOString()

    };


    saveToStorage(
        "myshop_orders",
        MyShop.orders
    );


    return MyShop.orders[index];

}


/* ============================================================
   PLACE ORDER
   ============================================================ */

function placeOrder() {

    initializeOrderState();

    initializeCheckoutState();

    initializePaymentState();


    const items =
        getOrderItemsSnapshot();


    if (
        items.length ===
        0
    ) {

        showToast(
            "Your cart is empty.",
            "error"
        );


        return null;

    }


    const customer =
        getCheckoutCustomer();


    const validation =
        validateCheckoutCustomer(
            customer
        );


    if (
        !validation.valid
    ) {

        showToast(
            "Please complete your delivery information.",
            "error"
        );


        openCheckout();


        return null;

    }


    const order =
        createOrderObject();


    saveOrder(
        order
    );


    /*
       Keep the order ID available
       for the success page and any
       later payment operation.
    */

    MyShop.lastOrderId =
        order.orderId;


    saveToStorage(
        "myshop_last_order_id",
        order.orderId
    );


    /*
       Notify other modules that a
       new order has been created.
    */

    document.dispatchEvent(
        new CustomEvent(
            "myshop:order-created",
            {
                detail: {
                    order
                }
            }
        )
    );


    return order;

}


/* ============================================================
   PLACE ORDER BUTTON
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-place-order]"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        /*
           Prevent accidental double
           submission.
        */

        if (
            button.dataset
                .processing ===
            "true"
        ) {

            return;

        }


        button.dataset.processing =
            "true";


        const originalText =
            button.innerHTML;


        button.disabled =
            true;


        button.innerHTML =
            "Processing...";


        try {

            const order =
                placeOrder();


            if (
                !order
            ) {

                return;

            }


            /*
               Payment handling is kept
               separate so Part 21B can
               continue the flow without
               changing order creation.
            */

            if (
                typeof handleOrderPayment ===
                "function"
            ) {

                handleOrderPayment(
                    order
                );

            }
            else {

                completeOrderFlow(
                    order
                );

            }

        }
        finally {

            setTimeout(
                () => {

                    button.dataset
                        .processing =
                        "false";

                    button.disabled =
                        false;

                    button.innerHTML =
                        originalText;

                },
                500
            );

        }

    }
);


/* ============================================================
   COMPLETE ORDER FLOW
   ============================================================ */

function completeOrderFlow(
    order
) {

    if (
        !order
    ) {

        return;

    }


    /*
       Remove purchased products
       from the active cart.
    */

    MyShop.cart = [];


    saveToStorage(
        "myshop_cart",
        []
    );


    /*
       Coupon should not remain
       active after a successful
       order.
    */

    MyShop.appliedCoupon =
        null;


    saveToStorage(
        "myshop_coupon",
        null
    );


    /*
       Reset checkout data while
       keeping the last order ID.
    */

    MyShop.checkout = {

        step:
            1,

        customer: {

            name:
                "",

            email:
                "",

            phone:
                "",

            address:
                "",

            city:
                "",

            postalCode:
                "",

            note:
                ""

        },

        payment: {

            method:
                "cash_on_delivery",

            transactionId:
                ""

        }

    };


    saveToStorage(
        "myshop_checkout_customer",
        MyShop.checkout.customer
    );


    /*
       Refresh cart-related UI.
    */

    document.dispatchEvent(
        new CustomEvent(
            "myshop:cart-updated"
        )
    );


    /*
       Close checkout before the
       success screen is displayed.
    */

    closeCheckout();


    if (
        typeof showOrderSuccess ===
        "function"
    ) {

        showOrderSuccess(
            order
        );

    }
    else {

        showToast(
            `Order ${order.orderId} placed successfully!`,
            "success"
        );

    }

}


/* ============================================================
   ORDER CREATED EVENT
   ============================================================ */

document.addEventListener(
    "myshop:order-created",
    function (event) {

        const order =
            event.detail
                ?.order;


        if (!order) {

            return;

        }


        /*
           Useful hook for analytics,
           inventory, notifications,
           or backend synchronization.
        */

        if (
            typeof window
                .onMyShopOrderCreated ===
            "function"
        ) {

            window
                .onMyShopOrderCreated(
                    order
                );

        }

    }
);


/* ============================================================
   INITIAL ORDER LOAD
   ============================================================ */

initializeOrderState();

loadOrders();


/* ============================================================
   RESTORE LAST ORDER ID
   ============================================================ */

const savedLastOrderId =
    loadFromStorage(
        "myshop_last_order_id",
        null
    );


if (
    savedLastOrderId
) {

    MyShop.lastOrderId =
        savedLastOrderId;

}
/* ============================================================
   MyShop Marketplace
   app.js — PART 21B
   Order Success + Confirmation + Tracking Summary
   ============================================================ */


/* ============================================================
   ORDER SUCCESS SCREEN
   ============================================================ */

function showOrderSuccess(
    order
) {

    if (!order) {

        return;

    }


    let modal =
        getElement(
            "orderSuccessModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderSuccessModal";

        modal.className =
            "modal order-success-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const customer =
        order.customer ||
        {};


    const payment =
        order.payment ||
        {};


    const totals =
        order.totals ||
        {};


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-order-success
        ></div>


        <div
            class="modal-content order-success-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-order-success
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="order-success-icon"
            >
                ✓
            </div>


            <span
                class="order-success-label"
            >
                Order Confirmed
            </span>


            <h2>
                Thank you for your order!
            </h2>


            <p
                class="order-success-message"
            >
                Your order has been received
                and is being prepared.
            </p>


            <div
                class="order-number-card"
            >

                <span>
                    Order Number
                </span>

                <strong>
                    ${escapeHTML(
                        order.orderId ||
                        order.id ||
                        ""
                    )}
                </strong>

            </div>


            <div
                class="order-success-details"
            >

                <div>

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${escapeHTML(
                            customer.name ||
                            ""
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Payment
                    </span>

                    <strong>
                        ${escapeHTML(
                            payment.methodName ||
                            "Payment"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(
                            Number(
                                totals.total ||
                                0
                            )
                        )}
                    </strong>

                </div>

            </div>


            <div
                class="order-success-actions"
            >

                <button
                    type="button"
                    class="primary-button"
                    data-view-order="${
                        escapeHTML(
                            order.orderId ||
                            order.id
                        )
                    }"
                >
                    View Order
                </button>


                <button
                    type="button"
                    class="secondary-button"
                    data-continue-shopping
                >
                    Continue Shopping
                </button>

            </div>


            <p
                class="order-success-email"
            >
                A confirmation has been prepared
                for ${escapeHTML(
                    customer.email ||
                    "your email"
                )}.
            </p>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "order-success";


    MyShop.lastOrderId =
        order.orderId ||
        order.id;


    return true;

}


/* ============================================================
   CLOSE SUCCESS MODAL
   ============================================================ */

function closeOrderSuccess() {

    const modal =
        getElement(
            "orderSuccessModal"
        );


    if (
        modal
    ) {

        modal.hidden =
            true;

    }


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "order-success"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   SUCCESS MODAL EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const close =
            event.target.closest(
                "[data-close-order-success]"
            );


        if (close) {

            event.preventDefault();


            closeOrderSuccess();


            return;

        }


        const shopping =
            event.target.closest(
                "[data-continue-shopping]"
            );


        if (shopping) {

            event.preventDefault();


            closeOrderSuccess();


            if (
                typeof showHomePage ===
                "function"
            ) {

                showHomePage();

            }


            return;

        }


        const viewOrder =
            event.target.closest(
                "[data-view-order]"
            );


        if (viewOrder) {

            event.preventDefault();


            const orderId =
                viewOrder.dataset
                    .viewOrder;


            closeOrderSuccess();


            openOrderDetails(
                orderId
            );

        }

    }
);


/* ============================================================
   ORDER STATUS CONFIG
   ============================================================ */

function getOrderStatusMeta(
    status
) {

    const normalized =
        String(
            status ||
            "pending"
        )
            .toLowerCase();


    const statuses = {

        pending: {

            label:
                "Order Placed",

            icon:
                "✓",

            description:
                "Your order has been received."

        },

        confirmed: {

            label:
                "Confirmed",

            icon:
                "✓",

            description:
                "Your order has been confirmed."

        },

        processing: {

            label:
                "Processing",

            icon:
                "⚙",

            description:
                "Your order is being prepared."

        },

        shipped: {

            label:
                "Shipped",

            icon:
                "🚚",

            description:
                "Your order is on the way."

        },

        delivered: {

            label:
                "Delivered",

            icon:
                "📦",

            description:
                "Your order has been delivered."

        },

        cancelled: {

            label:
                "Cancelled",

            icon:
                "×",

            description:
                "This order has been cancelled."

        }

    };


    return (
        statuses[
            normalized
        ] ||
        statuses.pending
    );

}


/* ============================================================
   ORDER TRACKING HTML
   ============================================================ */

function createOrderTrackingHTML(
    order
) {

    if (!order) {

        return "";

    }


    const status =
        String(
            order.status ||
            "pending"
        ).toLowerCase();


    const sequence = [

        "pending",

        "confirmed",

        "processing",

        "shipped",

        "delivered"

    ];


    const currentIndex =
        sequence.indexOf(
            status
        );


    if (
        status ===
        "cancelled"
    ) {

        return `

            <div
                class="order-tracking cancelled"
            >

                <div
                    class="tracking-step active"
                >

                    <span>
                        ×
                    </span>

                    <strong>
                        Cancelled
                    </strong>

                </div>

            </div>

        `;

    }


    return `

        <div
            class="order-tracking"
        >

            ${
                sequence
                    .map(
                        (
                            item,
                            index
                        ) => {

                            const meta =
                                getOrderStatusMeta(
                                    item
                                );


                            const completed =
                                index <=
                                currentIndex;


                            const active =
                                index ===
                                currentIndex;


                            return `

                                <div
                                    class="tracking-step ${
                                        completed
                                            ? "completed"
                                            : ""
                                    } ${
                                        active
                                            ? "active"
                                            : ""
                                    }"
                                >

                                    <div
                                        class="tracking-icon"
                                    >
                                        ${meta.icon}
                                    </div>


                                    <div
                                        class="tracking-label"
                                    >

                                        <strong>
                                            ${meta.label}
                                        </strong>

                                        ${
                                            active
                                                ? `
                                                    <small>
                                                        ${meta.description}
                                                    </small>
                                                  `
                                                : ""
                                        }

                                    </div>

                                </div>

                                ${
                                    index <
                                    sequence.length -
                                    1
                                        ? `
                                            <div
                                                class="tracking-line ${
                                                    index <
                                                    currentIndex
                                                        ? "completed"
                                                        : ""
                                                }"
                                            ></div>
                                          `
                                        : ""
                                }

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* ============================================================
   ORDER DETAILS
   ============================================================ */

function openOrderDetails(
    orderId
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        showToast(
            "Order not found.",
            "error"
        );


        return;

    }


    let modal =
        getElement(
            "orderDetailsModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderDetailsModal";

        modal.className =
            "modal order-details-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    const totals =
        order.totals ||
        {};


    const customer =
        order.customer ||
        {};


    const payment =
        order.payment ||
        {};


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-order-details
        ></div>


        <div
            class="modal-content order-details-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-order-details
                aria-label="Close"
            >
                ×
            </button>


            <div
                class="order-details-header"
            >

                <span>
                    Order Details
                </span>

                <h2>
                    #${escapeHTML(
                        order.orderId ||
                        order.id ||
                        ""
                    )}
                </h2>

                <small>
                    ${formatReviewDate(
                        order.createdAt
                    )}
                </small>

            </div>


            <section
                class="order-details-section"
            >

                <h3>
                    Order Status
                </h3>


                ${createOrderTrackingHTML(
                    order
                )}

            </section>


            <section
                class="order-details-section"
            >

                <h3>
                    Products
                </h3>


                <div
                    class="order-details-products"
                >

                    ${
                        Array.isArray(
                            order.items
                        )
                            ? order.items
                                .map(
                                    item => `

                                        <div
                                            class="order-detail-product"
                                        >

                                            <span>
                                                ${
                                                    item.emoji ||
                                                    "📦"
                                                }
                                            </span>


                                            <div>

                                                <strong>
                                                    ${escapeHTML(
                                                        item.name ||
                                                        "Product"
                                                    )}
                                                </strong>

                                                <small>
                                                    Qty:
                                                    ${Number(
                                                        item.quantity ||
                                                        1
                                                    )}
                                                </small>

                                            </div>


                                            <strong>
                                                ${formatPrice(
                                                    Number(
                                                        item.lineTotal ||
                                                        0
                                                    )
                                                )}
                                            </strong>

                                        </div>

                                    `
                                )
                                .join("")
                            : ""
                    }

                </div>

            </section>


            <section
                class="order-details-section"
            >

                <h3>
                    Delivery
                </h3>


                <div
                    class="order-info-card"
                >

                    <strong>
                        ${escapeHTML(
                            customer.name ||
                            ""
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            customer.phone ||
                            ""
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            customer.address ||
                            ""
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            customer.city ||
                            ""
                        )}
                        ${
                            customer.postalCode
                                ? `, ${escapeHTML(
                                    customer.postalCode
                                )}`
                                : ""
                        }
                    </span>

                </div>

            </section>


            <section
                class="order-details-section"
            >

                <h3>
                    Payment
                </h3>


                <div
                    class="order-info-card"
                >

                    <strong>
                        ${escapeHTML(
                            payment.methodName ||
                            "Payment"
                        )}
                    </strong>

                    <span>
                        Status:
                        ${escapeHTML(
                            order.paymentStatus ||
                            "pending"
                        )}
                    </span>

                </div>

            </section>


                       <section
                class="order-details-total"
            >

                <div>
                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${formatPrice(
                            Number(
                                totals.subtotal ||
                                0
                            )
                        )}
                    </strong>
                </div>


                <div>
                    <span>
                        Discount
                    </span>

                    <strong>
                        −${formatPrice(
                            Number(
                                totals.discount ||
                                0
                            )
                        )}
                    </strong>
                </div>


                <div>
                    <span>
                        Shipping
                    </span>

                    <strong>
                        ${
                            Number(
                                totals.shipping ||
                                0
                            ) === 0
                                ? "Free"
                                : formatPrice(
                                    Number(
                                        totals.shipping
                                    )
                                )
                        }
                    </strong>
                </div>


                <div
                    class="order-detail-grand-total"
                >

                    <span>
                        Total
                    </span>

                    <strong>
                        ${formatPrice(
                            Number(
                                totals.total ||
                                0
                            )
                        )}
                    </strong>

                </div>

            </section>


            <div
                class="order-details-actions"
            >

                <button
                    type="button"
                    class="primary-button"
                    data-close-order-details
                >
                    Done
                </button>

            </div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "order-details";


    MyShop.currentOrderId =
        order.orderId ||
        order.id;

}


/* ============================================================
   CLOSE ORDER DETAILS
   ============================================================ */

function closeOrderDetails() {

    const modal =
        getElement(
            "orderDetailsModal"
        );


    if (
        modal
    ) {

        modal.hidden =
            true;

    }


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "order-details"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   ORDER DETAILS EVENTS
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const close =
            event.target.closest(
                "[data-close-order-details]"
            );


        if (!close) {

            return;

        }


        event.preventDefault();


        closeOrderDetails();

    }
);


/* ============================================================
   ORDER MODAL ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "order-details"
        ) {

            closeOrderDetails();

        }


        if (
            MyShop.activeModal ===
            "order-success"
        ) {

            closeOrderSuccess();

        }

    }
);


/* ============================================================
   ORDER HISTORY HELPER
   ============================================================ */

function getUserOrders() {

    initializeOrderState();


    return [
        ...MyShop.orders
    ].sort(
        (
            a,
            b
        ) => {

            return (
                new Date(
                    b.createdAt ||
                    0
                ).getTime()
                -
                new Date(
                    a.createdAt ||
                    0
                ).getTime()
            );

        }
    );

}


/* ============================================================
   CURRENT ORDER HELPER
   ============================================================ */

function getLastOrder() {

    const orderId =
        MyShop.lastOrderId;


    if (
        orderId
    ) {

        const order =
            getOrderById(
                orderId
            );


        if (
            order
        ) {

            return order;

        }

    }


    const orders =
        getUserOrders();


    return orders.length
        ? orders[0]
        : null;

}


/* ============================================================
   INITIALIZE ORDER MODULE
   ============================================================ */

initializeOrderState();

loadOrders();

/* ============================================================
   MyShop Marketplace
   app.js — PART 22A
   Order History + Search + Filter
   ============================================================ */


/* ============================================================
   ORDER HISTORY STATE
   ============================================================ */

function initializeOrderHistoryState() {

    if (
        !MyShop.orderHistory ||
        typeof MyShop.orderHistory !==
            "object"
    ) {

        MyShop.orderHistory = {};

    }


    if (
        MyShop.orderHistory.search ===
        undefined
    ) {

        MyShop.orderHistory.search =
            "";

    }


    if (
        MyShop.orderHistory.status ===
        undefined
    ) {

        MyShop.orderHistory.status =
            "all";

    }

}


/* ============================================================
   FILTER ORDERS
   ============================================================ */

function filterOrders(
    orders,
    search = "",
    status = "all"
) {

    const normalizedSearch =
        String(
            search ||
            ""
        )
            .trim()
            .toLowerCase();


    const normalizedStatus =
        String(
            status ||
            "all"
        )
            .trim()
            .toLowerCase();


    return orders.filter(
        order => {

            const orderId =
                String(
                    order.orderId ||
                    order.id ||
                    ""
                )
                    .toLowerCase();


            const customerName =
                String(
                    order.customer
                        ?.name ||
                    ""
                )
                    .toLowerCase();


            const matchesSearch =
                !normalizedSearch ||
                orderId.includes(
                    normalizedSearch
                ) ||
                customerName.includes(
                    normalizedSearch
                );


            const orderStatus =
                String(
                    order.status ||
                    "pending"
                )
                    .toLowerCase();


            const matchesStatus =
                normalizedStatus ===
                    "all" ||
                orderStatus ===
                    normalizedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        }
    );

}


/* ============================================================
   ORDER STATUS BADGE
   ============================================================ */

function createOrderStatusBadge(
    status
) {

    const meta =
        getOrderStatusMeta(
            status
        );


    return `

        <span
            class="order-status-badge status-${escapeHTML(
                String(
                    status ||
                    "pending"
                ).toLowerCase()
            )}"
        >

            <span>
                ${meta.icon}
            </span>

            ${escapeHTML(
                meta.label
            )}

        </span>

    `;

}


/* ============================================================
   FORMAT ORDER DATE
   ============================================================ */

function formatOrderDate(
    value
) {

    if (!value) {

        return "Date unavailable";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return date.toLocaleDateString(
        undefined,
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"
        }
    );

}


/* ============================================================
   ORDER HISTORY ITEM
   ============================================================ */

function createOrderHistoryItemHTML(
    order
) {

    const totals =
        order.totals ||
        {};


    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    const itemCount =
        items.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    Number(
                        item.quantity ||
                        0
                    )
                );

            },
            0
        );


    const orderId =
        order.orderId ||
        order.id ||
        "";


    return `

        <article
            class="order-history-item"
            data-order-history-item="${escapeHTML(
                orderId
            )}"
        >

            <div
                class="order-history-main"
            >

                <div
                    class="order-history-icon"
                >
                    📦
                </div>


                <div
                    class="order-history-info"
                >

                    <div
                        class="order-history-title"
                    >

                        <strong>
                            #${escapeHTML(
                                orderId
                            )}
                        </strong>


                        ${createOrderStatusBadge(
                            order.status
                        )}

                    </div>


                    <span
                        class="order-history-date"
                    >
                        ${formatOrderDate(
                            order.createdAt
                        )}
                    </span>


                    <span
                        class="order-history-count"
                    >
                        ${itemCount}
                        ${
                            itemCount ===
                            1
                                ? "item"
                                : "items"
                        }
                    </span>

                </div>

            </div>


            <div
                class="order-history-right"
            >

                <strong
                    class="order-history-total"
                >
                    ${formatPrice(
                        Number(
                            totals.total ||
                            0
                        )
                    )}
                </strong>


                <button
                    type="button"
                    class="secondary-button"
                    data-view-order="${escapeHTML(
                        orderId
                    )}"
                >
                    View Details
                </button>

            </div>

        </article>

    `;

}


/* ============================================================
   EMPTY ORDER HISTORY
   ============================================================ */

function createEmptyOrderHistoryHTML(
    filtered = false
) {

    if (filtered) {

        return `

            <div
                class="empty-order-history"
            >

                <div>
                    🔎
                </div>

                <h3>
                    No matching orders
                </h3>

                <p>
                    Try another search or
                    status filter.
                </p>

                <button
                    type="button"
                    class="secondary-button"
                    data-clear-order-filter
                >
                    Clear Filters
                </button>

            </div>

        `;

    }


    return `

        <div
            class="empty-order-history"
        >

            <div>
                📦
            </div>

            <h3>
                No orders yet
            </h3>

            <p>
                Your completed orders will
                appear here.
            </p>

            <button
                type="button"
                class="primary-button"
                data-continue-shopping
            >
                Start Shopping
            </button>

        </div>

    `;

}


/* ============================================================
   ORDER HISTORY HTML
   ============================================================ */

function createOrderHistoryHTML(
    orders
) {

    if (
        !orders.length
    ) {

        return createEmptyOrderHistoryHTML(
            true
        );

    }


    return `

        <div
            class="order-history-list"
        >

            ${
                orders
                    .map(
                        createOrderHistoryItemHTML
                    )
                    .join("")
            }

        </div>

    `;

}


/* ============================================================
   ORDER HISTORY FILTER BAR
   ============================================================ */

function createOrderHistoryFilterHTML() {

    initializeOrderHistoryState();


    return `

        <div
            class="order-history-filters"
        >

            <div
                class="order-search"
            >

                <label
                    for="orderHistorySearch"
                    class="sr-only"
                >
                    Search orders
                </label>

                <input
                    id="orderHistorySearch"
                    type="search"
                    placeholder="Search order number..."
                    value="${escapeHTML(
                        MyShop.orderHistory
                            .search ||
                        ""
                    )}"
                    data-order-search
                >

            </div>


            <div
                class="order-status-filter"
            >

                <label
                    for="orderStatusFilter"
                    class="sr-only"
                >
                    Filter by status
                </label>

                <select
                    id="orderStatusFilter"
                    data-order-status-filter
                >

                    <option
                        value="all"
                        ${
                            MyShop.orderHistory
                                .status ===
                            "all"
                                ? "selected"
                                : ""
                        }
                    >
                        All Orders
                    </option>


                    <option
                        value="pending"
                        ${
                            MyShop.orderHistory
                                .status ===
                            "pending"
                                ? "selected"
                                : ""
                        }
                    >
                        Pending
                    </option>


                    <option
                        value="confirmed"
                        ${
                            MyShop.orderHistory
                                .status ===
                            "confirmed"
                                ? "selected"
                                : ""
                        }
                    >
                        Confirmed
                    </option>


                    <option
                        value="processing"
                        ${
                            MyShop.orderHistory
                                .status ===
                            "processing"
                                ? "selected"
                                : ""
                        }
                    >
                        Processing
                    </option>


                    <option
                        value="shipped"
                        ${
                            MyShop.orderHistory
                                .status ===
                            "shipped"
                                ? "selected"
                                : ""
                        }
                    >
                        Shipped
                    </option>


                    <option
                        value="delivered"
                        ${
                            MyShop.orderHistory
                                .status ===
                            "delivered"
                                ? "selected"
                                : ""
                        }
                    >
                        Delivered
                    </option>


                    <option
                        value="cancelled"
                        ${
                            MyShop.orderHistory
                                .status ===
                            "cancelled"
                                ? "selected"
                                : ""
                        }
                    >
                        Cancelled
                    </option>

                </select>

            </div>

        </div>

    `;

}


/* ============================================================
   RENDER ORDER HISTORY
   ============================================================ */

function renderOrderHistory(
    container
) {

    if (!container) {

        return;

    }


    initializeOrderHistoryState();


    const orders =
        getUserOrders();


    const filtered =
        filterOrders(
            orders,
            MyShop.orderHistory
                .search,
            MyShop.orderHistory
                .status
        );


    container.innerHTML = `

        <div
            class="order-history-header"
        >

            <div>

                <span>
                    Account
                </span>

                <h2>
                    My Orders
                </h2>

            </div>


            <span
                class="order-history-total-count"
            >
                ${orders.length}
                ${
                    orders.length ===
                    1
                        ? "order"
                        : "orders"
                }
            </span>

        </div>


        ${createOrderHistoryFilterHTML()}


        <div
            data-order-history-results
        >

            ${
                filtered.length
                    ? createOrderHistoryHTML(
                        filtered
                    )
                    : createEmptyOrderHistoryHTML(
                        orders.length >
                        0
                    )
            }

        </div>

    `;

}


/* ============================================================
   OPEN ORDER HISTORY
   ============================================================ */

function openOrderHistory() {

    initializeOrderHistoryState();


    let modal =
        getElement(
            "orderHistoryModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "orderHistoryModal";

        modal.className =
            "modal order-history-modal";

        modal.setAttribute(
            "role",
            "dialog"
        );

        modal.setAttribute(
            "aria-modal",
            "true"
        );

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div
            class="modal-overlay"
            data-close-order-history
        ></div>


        <div
            class="modal-content order-history-content"
        >

            <button
                type="button"
                class="modal-close"
                data-close-order-history
                aria-label="Close orders"
            >
                ×
            </button>


            <div
                data-order-history-container
            ></div>

        </div>

    `;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );


    MyShop.activeModal =
        "order-history";


    renderOrderHistory(
        $(
            "[data-order-history-container]",
            modal
        )
    );

}


/* ============================================================
   CLOSE ORDER HISTORY
   ============================================================ */

function closeOrderHistory() {

    const modal =
        getElement(
            "orderHistoryModal"
        );


    if (
        modal
    ) {

        modal.hidden =
            true;

    }


    document.body.classList.remove(
        "modal-open"
    );


    if (
        MyShop.activeModal ===
        "order-history"
    ) {

        MyShop.activeModal =
            null;

    }

}


/* ============================================================
   ORDER HISTORY OPEN EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const open =
            event.target.closest(
                "[data-open-order-history]"
            );


        if (!open) {

            return;

        }


        event.preventDefault();


        openOrderHistory();

    }
);


/* ============================================================
   ORDER HISTORY CLOSE EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const close =
            event.target.closest(
                "[data-close-order-history]"
            );


        if (!close) {

            return;

        }


        event.preventDefault();


        closeOrderHistory();

    }
);


/* ============================================================
   ORDER SEARCH
   ============================================================ */

document.addEventListener(
    "input",
    function (event) {

        const input =
            event.target.closest(
                "[data-order-search]"
            );


        if (!input) {

            return;

        }


        initializeOrderHistoryState();


        MyShop.orderHistory.search =
            input.value;


        const modal =
            getElement(
                "orderHistoryModal"
            );


        if (!modal) {

            return;

        }


        const container =
            $(
                "[data-order-history-container]",
                modal
            );


        if (
            container
        ) {

            renderOrderHistory(
                container
            );

        }

    }
);


/* ============================================================
   ORDER STATUS FILTER
   ============================================================ */

document.addEventListener(
    "change",
    function (event) {

        const select =
            event.target.closest(
                "[data-order-status-filter]"
            );


        if (!select) {

            return;

        }


        initializeOrderHistoryState();


        MyShop.orderHistory.status =
            select.value;


        const modal =
            getElement(
                "orderHistoryModal"
            );


        if (!modal) {

            return;

        }


        const container =
            $(
                "[data-order-history-container]",
                modal
            );


        if (
            container
        ) {

            renderOrderHistory(
                container
            );

        }

    }
);

/* ============================================================
   CLEAR ORDER FILTER
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const clear =
            event.target.closest(
                "[data-clear-order-filter]"
            );


        if (!clear) {

            return;

        }


        event.preventDefault();


        initializeOrderHistoryState();


        MyShop.orderHistory.search =
            "";

        MyShop.orderHistory.status =
            "all";


        const modal =
            getElement(
                "orderHistoryModal"
            );


        if (!modal) {

            return;

        }


        const container =
            $(
                "[data-order-history-container]",
                modal
            );


        if (
            container
        ) {

            renderOrderHistory(
                container
            );

        }

    }
);


/* ============================================================
   ORDER HISTORY ESCAPE
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            MyShop.activeModal ===
            "order-history"
        ) {

            closeOrderHistory();

        }

    }
);


/* ============================================================
   INITIALIZE ORDER HISTORY
   ============================================================ */

initializeOrderHistoryState();

/* ============================================================
   MyShop Marketplace
   app.js — PART 22B
   Order Actions + Cancellation + Reorder
   ============================================================ */


/* ============================================================
   ORDER ACTION STATE
   ============================================================ */

function initializeOrderActionState() {

    if (
        !MyShop.orderActions ||
        typeof MyShop.orderActions !==
            "object"
    ) {

        MyShop.orderActions = {};

    }


    if (
        MyShop.orderActions.processing ===
        undefined
    ) {

        MyShop.orderActions.processing =
            false;

    }

}


/* ============================================================
   CAN CANCEL ORDER
   ============================================================ */

function canCancelOrder(
    order
) {

    if (!order) {

        return false;

    }


    const status =
        String(
            order.status ||
            "pending"
        ).toLowerCase();


    return [
        "pending",
        "confirmed"
    ].includes(
        status
    );

}


/* ============================================================
   CAN REORDER
   ============================================================ */

function canReorder(
    order
) {

    if (!order) {

        return false;

    }


    return (
        Array.isArray(
            order.items
        ) &&
        order.items.length >
        0
    );

}


/* ============================================================
   CANCEL ORDER
   ============================================================ */

function cancelOrder(
    orderId
) {

    initializeOrderActionState();


    if (
        MyShop.orderActions.processing
    ) {

        return null;

    }


    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        showToast(
            "Order not found.",
            "error"
        );


        return null;

    }


    if (
        !canCancelOrder(
            order
        )
    ) {

        showToast(
            "This order can no longer be cancelled.",
            "error"
        );


        return null;

    }


    MyShop.orderActions.processing =
        true;


    try {

        const updated =
            updateOrder(
                orderId,
                {

                    status:
                        "cancelled",

                    paymentStatus:
                        order.paymentStatus ===
                            "paid"
                            ? "refund_pending"
                            : "cancelled"

                }
            );


        if (
            updated
        ) {

            document.dispatchEvent(
                new CustomEvent(
                    "myshop:order-cancelled",
                    {
                        detail: {
                            order:
                                updated
                        }
                    }
                )
            );


            showToast(
                "Order cancelled successfully.",
                "success"
            );

        }


        return updated;

    }
    finally {

        MyShop.orderActions.processing =
            false;

    }

}


/* ============================================================
   CANCEL CONFIRMATION
   ============================================================ */

function confirmCancelOrder(
    orderId
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        return;

    }


    if (
        !canCancelOrder(
            order
        )
    ) {

        showToast(
            "This order cannot be cancelled.",
            "error"
        );


        return;

    }


    const confirmed =
        window.confirm(
            `Cancel order ${
                order.orderId ||
                order.id
            }?`
        );


    if (!confirmed) {

        return;

    }


    const updated =
        cancelOrder(
            orderId
        );


    if (
        updated
    ) {

        closeOrderDetails();


        /*
           Re-open the order details so
           the updated status is visible.
        */

        setTimeout(
            () => {

                openOrderDetails(
                    orderId
                );

            },
            0
        );

    }

}


/* ============================================================
   REORDER PRODUCTS
   ============================================================ */

function reorderItems(
    order
) {

    if (
        !canReorder(
            order
        )
    ) {

        showToast(
            "This order has no products to reorder.",
            "error"
        );


        return false;

    }


    let addedCount =
        0;


    order.items.forEach(
        item => {

            const product =
                getProductById(
                    item.productId
                );


            if (
                !product
            ) {

                return;

            }


            const quantity =
                Math.max(
                    1,
                    Number(
                        item.quantity ||
                        1
                    )
                );


            /*
               Use the existing cart API
               when available so cart
               rules remain centralized.
            */

            if (
                typeof addToCart ===
                "function"
            ) {

                for (
                    let i = 0;
                    i < quantity;
                    i++
                ) {

                    addToCart(
                        product.id
                    );

                }

            }
            else {

                if (
                    !Array.isArray(
                        MyShop.cart
                    )
                ) {

                    MyShop.cart =
                        [];

                }


                const existing =
                    MyShop.cart.find(
                        cartItem =>
                            String(
                                cartItem.productId ||
                                cartItem.id
                            ) ===
                            String(
                                product.id
                            )
                    );


                if (
                    existing
                ) {

                    existing.quantity =
                        Number(
                            existing.quantity ||
                            0
                        ) +
                        quantity;

                }
                else {

                    MyShop.cart.push(
                        {

                            productId:
                                product.id,

                            quantity

                        }
                    );

                }


                addedCount +=
                    quantity;

            }

        }
    );


    saveToStorage(
        "myshop_cart",
        MyShop.cart
    );


    document.dispatchEvent(
        new CustomEvent(
            "myshop:cart-updated"
        )
    );


    showToast(
        "Products added to your cart.",
        "success"
    );


    return true;

}


/* ============================================================
   ORDER ACTION BUTTONS
   ============================================================ */

function createOrderActionButtonsHTML(
    order
) {

    if (!order) {

        return "";

    }


    const orderId =
        order.orderId ||
        order.id;


    const buttons = [];


    if (
        canCancelOrder(
            order
        )
    ) {

        buttons.push(`

            <button
                type="button"
                class="secondary-button danger-button"
                data-cancel-order="${escapeHTML(
                    orderId
                )}"
            >
                Cancel Order
            </button>

        `);

    }


    if (
        canReorder(
            order
        )
    ) {

        buttons.push(`

            <button
                type="button"
                class="primary-button"
                data-reorder-order="${escapeHTML(
                    orderId
                )}"
            >
                Reorder
            </button>

        `);

    }


    return buttons.join("");

}


/* ============================================================
   ENHANCE ORDER DETAILS
   ============================================================ */

function refreshOrderDetailsActions(
    orderId
) {

    const modal =
        getElement(
            "orderDetailsModal"
        );


    if (!modal) {

        return;

    }


    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        return;

    }


    const existing =
        $(
            "[data-order-action-buttons]",
            modal
        );


    const html =
        createOrderActionButtonsHTML(
            order
        );


    if (
        existing
    ) {

        existing.innerHTML =
            html;

    }
    else if (
        html
    ) {

        const actions =
            $(
                ".order-details-actions",
                modal
            );


        if (
            actions
        ) {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "order-action-buttons";


            wrapper.dataset
                .orderActionButtons =
                "";


            wrapper.innerHTML =
                html;


            actions.prepend(
                wrapper
            );

        }

    }

}


/* ============================================================
   PATCH ORDER DETAILS ACTIONS
   ============================================================ */

document.addEventListener(
    "myshop:order-details-opened",
    function (event) {

        const orderId =
            event.detail
                ?.orderId;


        if (
            orderId
        ) {

            refreshOrderDetailsActions(
                orderId
            );

        }

    }
);


/* ============================================================
   CANCEL ORDER EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-cancel-order]"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        confirmCancelOrder(
            button.dataset
                .cancelOrder
        );

    }
);


/* ============================================================
   REORDER EVENT
   ============================================================ */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-reorder-order]"
            );


        if (!button) {

            return;

        }


        event.preventDefault();


        const order =
            getOrderById(
                button.dataset
                    .reorderOrder
            );


        if (!order) {

            showToast(
                "Order not found.",
                "error"
            );


            return;

        }


        reorderItems(
            order
        );

    }
);


/* ============================================================
   UPDATE ORDER HISTORY AFTER ACTION
   ============================================================ */

document.addEventListener(
    "myshop:order-cancelled",
    function (event) {

        const order =
            event.detail
                ?.order;


        if (!order) {

            return;

        }


        const historyModal =
            getElement(
                "orderHistoryModal"
            );


        if (
            historyModal &&
            !historyModal.hidden
        ) {

            const container =
                $(
                    "[data-order-history-container]",
                    historyModal
                );


            if (
                container
            ) {

                renderOrderHistory(
                    container
                );

            }

        }


        refreshOrderDetailsActions(
            order.orderId ||
            order.id
        );

    }
);


/* ============================================================
   ORDER DETAILS ACTIONS INITIALIZATION
   ============================================================ */

initializeOrderActionState();


/* ============================================================
   PATCH ORDER DETAILS RENDERING
   ============================================================ */

(function patchOrderDetailsActions() {

    if (
        typeof openOrderDetails !==
        "function"
    ) {

        return;

    }


    /*
       Keep the existing order-details
       renderer intact. The action area
       is injected after the original
       renderer finishes.
    */

    const originalOpenOrderDetails =
        openOrderDetails;


    window.openOrderDetails =
        function (
            orderId
        ) {

            originalOpenOrderDetails(
                orderId
            );


            const order =
                getOrderById(
                    orderId
                );


            if (!order) {

                return;

            }


            refreshOrderDetailsActions(
                orderId
            );


            document.dispatchEvent(
                new CustomEvent(
                    "myshop:order-details-opened",
                    {
                        detail: {
                            orderId
                        }
                    }
                )
            );

        };

})();


/* ============================================================
   MyShop Marketplace
   app.js — PART 23A
   Payment Handling + Final Completion Flow
   ============================================================ */


/* ============================================================
   PAYMENT PROCESSING STATE
   ============================================================ */

function initializePaymentProcessingState() {

    if (
        !MyShop.paymentProcessing ||
        typeof MyShop.paymentProcessing !==
            "object"
    ) {

        MyShop.paymentProcessing = {};

    }


    if (
        MyShop.paymentProcessing.active ===
        undefined
    ) {

        MyShop.paymentProcessing.active =
            false;

    }


    if (
        MyShop.paymentProcessing.orderId ===
        undefined
    ) {

        MyShop.paymentProcessing.orderId =
            null;

    }

}


/* ============================================================
   CREATE TRANSACTION ID
   ============================================================ */

function generateTransactionId() {

    const timestamp =
        Date.now()
            .toString(
                36
            )
            .toUpperCase();


    const random =
        Math.random()
            .toString(
                36
            )
            .substring(
                2,
                9
            )
            .toUpperCase();


    return `TXN-${timestamp}-${random}`;

}


/* ============================================================
   UPDATE PAYMENT INFORMATION
   ============================================================ */

function updateOrderPayment(
    orderId,
    paymentData
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        return null;

    }


    const currentPayment =
        order.payment ||
        {};


    const updatedPayment = {

        ...currentPayment,

        ...paymentData

    };


    return updateOrder(
        orderId,
        {

            payment:
                updatedPayment

        }
    );

}


/* ============================================================
   PROCESS CASH ON DELIVERY
   ============================================================ */

function processCashOnDelivery(
    order
) {

    if (!order) {

        return false;

    }


    updateOrderPayment(
        order.orderId,
        {

            transactionId:
                "",

            method:
                "cash_on_delivery",

            methodName:
                "Cash on Delivery"

        }
    );


    updateOrder(
        order.orderId,
        {

            paymentStatus:
                "pending",

            status:
                "confirmed"

        }
    );


    return true;

}


/* ============================================================
   PROCESS DIGITAL PAYMENT
   ============================================================ */

function processDigitalPayment(
    order
) {

    if (!order) {

        return false;

    }


    const transactionId =
        generateTransactionId();


    /*
       This local transaction reference
       represents the payment step in
       the frontend-only version.
    */

    updateOrderPayment(
        order.orderId,
        {

            transactionId,

            method:
                order.payment
                    ?.method ||
                "card"

        }
    );


    updateOrder(
        order.orderId,
        {

            paymentStatus:
                "paid",

            status:
                "confirmed"

        }
    );


    return true;

}


/* ============================================================
   HANDLE ORDER PAYMENT
   ============================================================ */

function handleOrderPayment(
    order
) {

    initializePaymentProcessingState();


    if (!order) {

        return;

    }


    if (
        MyShop.paymentProcessing.active
    ) {

        return;

    }


    MyShop.paymentProcessing.active =
        true;


    MyShop.paymentProcessing.orderId =
        order.orderId;


    try {

        const method =
            order.payment
                ?.method ||
            "cash_on_delivery";


        let success =
            false;


        if (
            method ===
            "cash_on_delivery"
        ) {

            success =
                processCashOnDelivery(
                    order
                );

        }
        else {

            success =
                processDigitalPayment(
                    order
                );

        }


        const updatedOrder =
            getOrderById(
                order.orderId
            );


        if (
            success &&
            updatedOrder
        ) {

            completeOrderFlow(
                updatedOrder
            );

        }
        else {

            showToast(
                "Unable to complete the order.",
                "error"
            );

        }

    }
    finally {

        MyShop.paymentProcessing.active =
            false;

        MyShop.paymentProcessing.orderId =
            null;

    }

}


/* ============================================================
   RETRY PAYMENT
   ============================================================ */

function retryOrderPayment(
    orderId
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        showToast(
            "Order not found.",
            "error"
        );


        return false;

    }


    const status =
        String(
            order.paymentStatus ||
            ""
        ).toLowerCase();


    if (
        status ===
        "paid"
    ) {

        showToast(
            "This order is already paid.",
            "success"
        );


        return true;

    }


    initializePaymentProcessingState();


    const updated =
        processDigitalPayment(
            order
        );


    if (
        updated
    ) {

        showToast(
            "Payment completed successfully.",
            "success"
        );


        return true;

    }


    showToast(
        "Payment could not be completed.",
        "error"
    );


    return false;

}


/* ============================================================
   PAYMENT STATUS LABEL
   ============================================================ */

function getPaymentStatusLabel(
    status
) {

    const normalized =
        String(
            status ||
            "pending"
        ).toLowerCase();


    const labels = {

        pending:
            "Payment Pending",

        awaiting_payment:
            "Awaiting Payment",

        paid:
            "Paid",

        cancelled:
            "Payment Cancelled",

        refund_pending:
            "Refund Pending",

        refunded:
            "Refunded"

    };


    return (
        labels[
            normalized
        ] ||
        "Payment Pending"
    );

}


/* ============================================================
   ORDER CONFIRMATION EVENT
   ============================================================ */

document.addEventListener(
    "myshop:order-created",
    function (event) {

        const order =
            event.detail
                ?.order;


        if (!order) {

            return;

        }


        /*
           Keep a lightweight reference
           for the current session.
        */

        MyShop.lastOrderId =
            order.orderId ||
            order.id;


        saveToStorage(
            "myshop_last_order_id",
            MyShop.lastOrderId
        );

    }
);


/* ============================================================
   PAYMENT STATUS UPDATE EVENT
   ============================================================ */

document.addEventListener(
    "myshop:payment-updated",
    function (event) {

        const orderId =
            event.detail
                ?.orderId;


        if (!orderId) {

            return;

        }


        const historyModal =
            getElement(
                "orderHistoryModal"
            );


        if (
            historyModal &&
            !historyModal.hidden
        ) {

            const container =
                $(
                    "[data-order-history-container]",
                    historyModal
                );


            if (
                container
            ) {

                renderOrderHistory(
                    container
                );

            }

        }

    }
);


/* ============================================================
   PAYMENT ACTION HELPER
   ============================================================ */

function markPaymentAsUpdated(
    orderId,
    status
) {

    const order =
        getOrderById(
            orderId
        );


    if (!order) {

        return null;

    }


    const updated =
        updateOrder(
            orderId,
            {

                paymentStatus:
                    status

            }
        );


    if (
        updated
    ) {

        document.dispatchEvent(
            new CustomEvent(
                "myshop:payment-updated",
                {
                    detail: {
                        orderId,
                        order:
                            updated
                    }
                }
            )
        );

    }


    return updated;

}


/* ============================================================
   ORDER PAYMENT SUMMARY
   ============================================================ */

function createPaymentSummaryHTML(
    order
) {

    if (!order) {

        return "";

    }


    const payment =
        order.payment ||
        {};


    return `

        <div
            class="payment-summary"
        >

            <div>

                <span>
                    Method
                </span>

                <strong>
                    ${escapeHTML(
                        payment.methodName ||
                        "Payment"
                    )}
                </strong>

            </div>


            <div>

                <span>
                    Status
                </span>

                <strong>
                    ${escapeHTML(
                        getPaymentStatusLabel(
                            order.paymentStatus
                        )
                    )}
                </strong>

            </div>


            ${
                payment.transactionId
                    ? `
                        <div>

                            <span>
                                Transaction
                            </span>

                            <strong>
                                ${escapeHTML(
                                    payment.transactionId
                                )}
                            </strong>

                        </div>
                      `
                    : ""
            }

        </div>

    `;

}


/* ============================================================
   PAYMENT PROCESSING INITIALIZATION
   ============================================================ */

initializePaymentProcessingState();

/* ============================================================
   MyShop Marketplace
   app.js — PART 23B — FINAL
   Final Integration + Cleanup + Initialization
   ============================================================ */


/* ============================================================
   FINAL APP STATE
   ============================================================ */

function initializeFinalAppState() {

    if (
        typeof MyShop !==
        "object" ||
        !MyShop
    ) {

        window.MyShop = {};

    }


    if (
        MyShop.initialized ===
        undefined
    ) {

        MyShop.initialized =
            false;

    }


    if (
        MyShop.ready ===
        undefined
    ) {

        MyShop.ready =
            false;

    }

}


/* ============================================================
   GLOBAL STORAGE SYNC
   ============================================================ */

function syncMyShopStorage() {

    try {

        if (
            Array.isArray(
                MyShop.cart
            )
        ) {

            saveToStorage(
                "myshop_cart",
                MyShop.cart
            );

        }


        if (
            Array.isArray(
                MyShop.orders
            )
        ) {

            saveToStorage(
                "myshop_orders",
                MyShop.orders
            );

        }


        if (
            MyShop.checkout &&
            MyShop.checkout.customer
        ) {

            saveToStorage(
                "myshop_checkout_customer",
                MyShop.checkout.customer
            );

        }


        if (
            MyShop.lastOrderId
        ) {

            saveToStorage(
                "myshop_last_order_id",
                MyShop.lastOrderId
            );

        }

    }
    catch (error) {

        console.warn(
            "MyShop storage sync failed:",
            error
        );

    }

}


/* ============================================================
   REFRESH CART UI
   ============================================================ */

function refreshCartUI() {

    document.dispatchEvent(
        new CustomEvent(
            "myshop:cart-updated"
        )
    );


    if (
        typeof updateCartCount ===
        "function"
    ) {

        updateCartCount();

    }


    if (
        typeof renderCart ===
        "function"
    ) {

        try {

            renderCart();

        }
        catch (
            error
        ) {

            console.warn(
                "Cart render skipped:",
                error
            );

        }

    }

}


/* ============================================================
   ORDER CREATED UI SYNC
   ============================================================ */

document.addEventListener(
    "myshop:order-created",
    function () {

        syncMyShopStorage();

        refreshCartUI();

    }
);


/* ============================================================
   CART UPDATE STORAGE SYNC
   ============================================================ */

document.addEventListener(
    "myshop:cart-updated",
    function () {

        try {

            if (
                Array.isArray(
                    MyShop.cart
                )
            ) {

                saveToStorage(
                    "myshop_cart",
                    MyShop.cart
                );

            }

        }
        catch (
            error
        ) {

            console.warn(
                "Cart storage sync failed:",
                error
            );

        }

    }
);


/* ============================================================
   PAGE VISIBILITY SYNC
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadOrders();

            syncMyShopStorage();

        }

    }
);


/* ============================================================
   BEFORE UNLOAD SYNC
   ============================================================ */

window.addEventListener(
    "beforeunload",
    function () {

        syncMyShopStorage();

    }
);


/* ============================================================
   GLOBAL ERROR PROTECTION
   ============================================================ */

window.addEventListener(
    "error",
    function (event) {

        /*
           Do not interrupt the user's
           shopping experience because of
           a non-critical UI error.
        */

        console.warn(
            "MyShop runtime warning:",
            event.error ||
            event.message
        );

    }
);


/* ============================================================
   UNHANDLED PROMISE PROTECTION
   ============================================================ */

window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.warn(
            "MyShop async warning:",
            event.reason
        );

    }
);


/* ============================================================
   FINAL APP INITIALIZATION
   ============================================================ */

function initializeMyShopApp() {

    initializeFinalAppState();


    /*
       Restore persisted application
       data one final time.
    */

    try {

        if (
            typeof loadOrders ===
            "function"
        ) {

            loadOrders();

        }


        if (
            typeof initializeCheckoutState ===
            "function"
        ) {

            initializeCheckoutState();

        }


        if (
            typeof initializePaymentState ===
            "function"
        ) {

            initializePaymentState();

        }


        if (
            typeof initializeOrderState ===
            "function"
        ) {

            initializeOrderState();

        }


        if (
            typeof initializeOrderHistoryState ===
            "function"
        ) {

            initializeOrderHistoryState();

        }


        if (
            typeof initializeOrderActionState ===
            "function"
        ) {

            initializeOrderActionState();

        }


        if (
            typeof initializePaymentProcessingState ===
            "function"
        ) {

            initializePaymentProcessingState();

        }


        /*
           Restore cart from storage if
           another part of the application
           has not already done so.
        */

        if (
            !Array.isArray(
                MyShop.cart
            )
        ) {

            const storedCart =
                loadFromStorage(
                    "myshop_cart",
                    []
                );


            MyShop.cart =
                Array.isArray(
                    storedCart
                )
                    ? storedCart
                    : [];

        }


        /*
           Restore the last order.
        */

        if (
            !MyShop.lastOrderId
        ) {

            MyShop.lastOrderId =
                loadFromStorage(
                    "myshop_last_order_id",
                    null
                );

        }


        syncMyShopStorage();


        MyShop.initialized =
            true;

        MyShop.ready =
            true;


        document.dispatchEvent(
            new CustomEvent(
                "myshop:ready"
            )
        );


        /*
           Refresh visible UI only after
           all persisted state is ready.
        */

        refreshCartUI();


        return true;

    }
    catch (
        error
    ) {

        MyShop.initialized =
            true;

        MyShop.ready =
            false;


        console.error(
            "MyShop initialization failed:",
            error
        );


        return false;

    }

}


/* ============================================================
   DOM READY
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMyShopApp,
        {
            once:
                true
        }
    );

}
else {

    initializeMyShopApp();

}


/* ============================================================
   FINAL READY HELPER
   ============================================================ */

function isMyShopReady() {

    return (
        MyShop.initialized ===
            true &&
        MyShop.ready ===
            true
    );

}


/* ============================================================
   FINAL GLOBAL API
   ============================================================ */

window.MyShopApp = {

    ready:
        isMyShopReady,

    getOrders:
        getUserOrders,

    getOrder:
        getOrderById,

    openOrders:
        openOrderHistory,

    openOrderDetails,

    cancelOrder,

    reorderItems,

    placeOrder,

    sync:
        syncMyShopStorage

};


/* ============================================================
   MyShop Marketplace
   app.js COMPLETE
   ============================================================ */

