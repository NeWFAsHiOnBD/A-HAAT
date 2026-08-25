/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 1 / 10

   Main functions:
   - Cart system foundation
   - Product data
   - Search foundation
   - Cart counter
   - LocalStorage support
========================================================= */

const MyShop = {
    cart: [],
    wishlist: [],
    searchResults: [],
    products: [],
    initialized: false,
    account: { loggedIn: false, name: "", email: "" },
    flashSale: { duration: 5 * 60 * 60, remaining: 5 * 60 * 60, active: true },
    checkout: { customer: { name: "", phone: "", address: "", city: "" }, paymentMethod: "cod", orderId: null }
};

MyShop.products = [
    { id: 1, name: "Smartphone Pro", price: 18999, oldPrice: 22000, rating: 5, category: "Electronics", icon: "📱" },
    { id: 2, name: "Wireless Headphone", price: 1499, oldPrice: 2000, rating: 4, category: "Electronics", icon: "🎧" },
    { id: 3, name: "Smart Watch", price: 2499, oldPrice: 3500, rating: 5, category: "Electronics", icon: "⌚" },
    { id: 4, name: "Sports Shoes", price: 1999, oldPrice: 2800, rating: 4, category: "Fashion", icon: "👟" }
];

const STORAGE_KEYS = {
    cart: "myshop_cart",
    wishlist: "myshop_wishlist",
    user: "myshop_user",
    orders: "myshop_orders"
};

function loadSavedData() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEYS.cart);
        const savedWishlist = localStorage.getItem(STORAGE_KEYS.wishlist);

        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) MyShop.cart = parsedCart;
        }

        if (savedWishlist) {
            const parsedWishlist = JSON.parse(savedWishlist);
            if (Array.isArray(parsedWishlist)) MyShop.wishlist = parsedWishlist.map(Number);
        }
    } catch (error) {
        console.error("MyShop storage error:", error);
        MyShop.cart = [];
        MyShop.wishlist = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(MyShop.cart));
    } catch (error) {
        console.error("Unable to save cart:", error);
    }
}

function saveWishlist() {
    try {
        localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(MyShop.wishlist));
    } catch (error) {
        console.error("Unable to save wishlist:", error);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;

    const totalQuantity = MyShop.cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    cartCount.textContent = totalQuantity;
    cartCount.setAttribute("aria-label", `${totalQuantity} items in cart`);
}

function findProductByName(name) {
    if (!name) return null;
    return MyShop.products.find(product => product.name.toLowerCase() === name.toLowerCase()) || null;
}

function addToCart(name, price) {
    const existingItem = MyShop.cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        MyShop.cart.push({
            id: Date.now(),
            name: name,
            price: Number(price) || 0,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${name} added to cart`);
}

function initializeMyShop() {
    if (MyShop.initialized) return;

    loadSavedData();
    updateCartCount();
    MyShop.initialized = true;
    console.log("MyShop initialized successfully.");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMyShop);
} else {
    initializeMyShop();
}

/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 2 / 10

   Search System
========================================================= */

function getSearchInput() {
    return document.getElementById("searchInput");
}

function normalizeSearchText(text) {
    return String(text || "").trim().toLowerCase();
}

function searchProduct() {
    const input = getSearchInput();
    if (!input) return;

    const query = normalizeSearchText(input.value);

    if (!query) {
        MyShop.searchResults = [...MyShop.products];
        showAllProducts();
        return;
    }

    const results = MyShop.products.filter(product => {
        const name = normalizeSearchText(product.name);
        const category = normalizeSearchText(product.category);
        return name.includes(query) || category.includes(query);
    });

    MyShop.searchResults = results;
    renderSearchResults(results, query);
}

function enableLiveSearch() {
    const input = getSearchInput();
    if (!input) return;

    input.addEventListener("input", function () {
        const query = normalizeSearchText(input.value);
        if (!query) {
            MyShop.searchResults = [...MyShop.products];
            showAllProducts();
            return;
        }
        searchProduct();
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchProduct();
        }
    });
}

function renderSearchResults(products, query) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    if (!products.length) {
        grid.innerHTML = `
            <div class="search-empty">
                <div class="search-empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>No products matched "<strong>${escapeHTML(query)}</strong>"</p>
                <button class="add-cart" onclick="clearSearch()">View All Products</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(product => createProductCard(product)).join("");
}

function createProductCard(product) {
    const stars = createRatingStars(product.rating);
    return `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3>${escapeHTML(product.name)}</h3>
                <div class="rating">${stars}</div>
                <div class="price">৳${formatPrice(product.price)}</div>
                <div class="old-price">৳${formatPrice(product.oldPrice)}</div>
                <button class="add-cart" onclick="addToCart('${escapeJS(product.name)}', ${Number(product.price)})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function showAllProducts() {
    renderSearchResults(MyShop.products, "");
}

function clearSearch() {
    const input = getSearchInput();
    if (input) input.value = "";
    MyShop.searchResults = [...MyShop.products];
    showAllProducts();
}

function createRatingStars(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= safeRating ? "⭐" : "☆";
    }
    return stars;
}

function formatPrice(price) {
    const number = Number(price) || 0;
    return number.toLocaleString("en-BD");
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJS(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");
}

function initializeSearch() {
    enableLiveSearch();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSearch);
} else {
    initializeSearch();
}

/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 3 / 10

   Cart Modal & Management
========================================================= */

function openCart() {
    const existingCart = document.getElementById("myShopCartModal");
    if (existingCart) existingCart.remove();
    renderCartModal();
}

function closeCart() {
    const modal = document.getElementById("myShopCartModal");
    if (modal) modal.remove();
}

function getCartTotal() {
    return MyShop.cart.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
}

function getCartItemCount() {
    return MyShop.cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
}

function changeCartQuantity(itemId, change) {
    const item = MyShop.cart.find(product => String(product.id) === String(itemId));
    if (!item) return;

    item.quantity += Number(change);
    if (item.quantity <= 0) {
        MyShop.cart = MyShop.cart.filter(product => String(product.id) !== String(itemId));
    }

    saveCart();
    updateCartCount();
    renderCartModal();
}

function removeFromCart(itemId) {
    const item = MyShop.cart.find(product => String(product.id) === String(itemId));
    MyShop.cart = MyShop.cart.filter(product => String(product.id) !== String(itemId));

    saveCart();
    updateCartCount();
    renderCartModal();

    if (item) showNotification(`${item.name} removed from cart`);
}

function clearCart() {
    if (MyShop.cart.length === 0) return;
    const confirmed = window.confirm("Remove all items from your cart?");
    if (!confirmed) return;

    MyShop.cart = [];
    saveCart();
    updateCartCount();
    renderCartModal();
    showNotification("Cart cleared");
}

function renderCartModal() {
    const total = getCartTotal();
    const itemCount = getCartItemCount();
    const modal = document.createElement("div");

    modal.id = "myShopCartModal";
    modal.className = "myshop-modal-overlay";
    modal.innerHTML = `
        <div class="myshop-modal cart-modal" role="dialog" aria-modal="true" aria-labelledby="cartModalTitle">
            <div class="myshop-modal-header">
                <h2 id="cartModalTitle">🛒 Your Cart</h2>
                <button type="button" class="myshop-close" onclick="closeCart()" aria-label="Close cart">×</button>
            </div>
            <div class="myshop-modal-body">
                ${MyShop.cart.length ? renderCartItems() : renderEmptyCart()}
            </div>
            ${MyShop.cart.length ? `
                <div class="cart-summary">
                    <div class="cart-summary-row"><span>Items</span><strong>${itemCount}</strong></div>
                    <div class="cart-summary-row cart-total"><span>Total</span><strong>৳${formatPrice(total)}</strong></div>
                    <button type="button" class="myshop-checkout-btn" onclick="openCheckout()">Proceed to Checkout →</button>
                    <button type="button" class="myshop-clear-cart" onclick="clearCart()">Clear Cart</button>
                </div>
            ` : ""}
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeCart();
    });
}

function renderCartItems() {
    return MyShop.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">🛍️</div>
            <div class="cart-item-info">
                <h3>${escapeHTML(item.name)}</h3>
                <p>৳${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-controls">
                <button type="button" onclick="changeCartQuantity('${escapeJS(item.id)}', -1)">−</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="changeCartQuantity('${escapeJS(item.id)}', 1)">+</button>
            </div>
            <button type="button" class="cart-remove" onclick="removeFromCart('${escapeJS(item.id)}')" aria-label="Remove item">🗑️</button>
        </div>
    `).join("");
}

function renderEmptyCart() {
    return `
        <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started.</p>
            <button type="button" class="myshop-empty-cart-btn" onclick="closeCart()">Continue Shopping</button>
        </div>
    `;
}

/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 4 / 10

   Account & Notification System
========================================================= */

function openLogin() {
    const existing = document.getElementById("myShopLoginModal");
    if (existing) existing.remove();
    renderLoginModal();
}

function closeLogin() {
    const modal = document.getElementById("myShopLoginModal");
    if (modal) modal.remove();
}

function renderLoginModal() {
    const modal = document.createElement("div");
    modal.id = "myShopLoginModal";
    modal.className = "myshop-modal-overlay";
    modal.innerHTML = `
        <div class="myshop-modal login-modal" role="dialog" aria-modal="true" aria-labelledby="loginModalTitle">
            <div class="myshop-modal-header">
                <h2 id="loginModalTitle">👤 Login to MyShop</h2>
                <button type="button" class="myshop-close" onclick="closeLogin()" aria-label="Close login">×</button>
            </div>
            <div class="myshop-modal-body">
                <form id="myShopLoginForm" onsubmit="handleLogin(event)">
                    <label for="loginEmail" class="myshop-label">Email</label>
                    <input id="loginEmail" name="email" type="email" class="myshop-input" placeholder="Enter your email" autocomplete="email" required>
                    <label for="loginPassword" class="myshop-label">Password</label>
                    <input id="loginPassword" name="password" type="password" class="myshop-input" placeholder="Enter your password" autocomplete="current-password" required>
                    <button type="submit" class="myshop-login-btn">Login</button>
                </form>
                <div class="login-divider">OR</div>
                <button type="button" class="myshop-register-btn" onclick="openRegister()">Create New Account</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeLogin();
    });
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    if (!email || !password || !email.value.trim() || !password.value) {
        showNotification("Please enter your email and password.", "warning");
        return;
    }

    const userData = { loggedIn: true, email: email.value.trim(), name: email.value.trim().split('@')[0] };
    saveUserSession(userData);
    closeLogin();
    showNotification("Login successful");
}

function openRegister() {
    closeLogin();
    showNotification("Registration module will be connected to the backend.");
}

function showNotification(message, type = "success") {
    const oldNotification = document.querySelector(".myshop-notification");
    if (oldNotification) oldNotification.remove();

    const notification = document.createElement("div");
    notification.className = `myshop-notification ${type}`;
    notification.setAttribute("role", "status");

    const icon = type === "error" || type === "warning" ? "⚠️" : "✓";
    notification.innerHTML = `
        <span class="myshop-notification-icon">${icon}</span>
        <span class="myshop-notification-text">${escapeHTML(message)}</span>
        <button type="button" class="myshop-notification-close" aria-label="Close notification">×</button>
    `;

    document.body.appendChild(notification);
    const closeButton = notification.querySelector(".myshop-notification-close");
    if (closeButton) {
        closeButton.addEventListener("click", function () { notification.remove(); });
    }

    setTimeout(function () {
        if (notification.isConnected) notification.remove();
    }, 3000);
}

function injectModalStyles() {
    if (document.getElementById("myShopModalStyles")) return;
    const style = document.createElement("style");
    style.id = "myShopModalStyles";
    style.textContent = `
        .myshop-modal-overlay { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0,0,0,0.55); }
        .myshop-modal { width: min(460px, 100%); max-height: 90vh; overflow-y: auto; background: #fff; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
        .myshop-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #eee; }
        .myshop-modal-header h2 { margin: 0; font-size: 20px; }
        .myshop-close { width: 36px; height: 36px; border: none; border-radius: 50%; background: #f5f5f5; font-size: 24px; cursor: pointer; }
        .myshop-modal-body { padding: 20px; }
        .myshop-label { display: block; margin: 0 0 6px; font-size: 13px; font-weight: 600; }
        .myshop-input { width: 100%; height: 44px; margin-bottom: 15px; padding: 0 12px; border: 1px solid #ddd; border-radius: 5px; outline: none; }
        .myshop-input:focus { border-color: #f85606; }
        .myshop-login-btn, .myshop-register-btn { width: 100%; min-height: 44px; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; }
        .myshop-login-btn { background: #f85606; color: #fff; }
        .myshop-register-btn { background: #f5f5f5; color: #333; }
        .login-divider { margin: 18px 0; text-align: center; color: #999; font-size: 12px; }
        .myshop-notification { position: fixed; right: 20px; bottom: 20px; z-index: 20000; display: flex; align-items: center; gap: 10px; max-width: 360px; padding: 13px 15px; border-radius: 7px; background: #222; color: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
        .myshop-notification-close { border: none; background: transparent; color: #fff; font-size: 18px; cursor: pointer; }
        @media (max-width: 480px) {
            .myshop-modal-overlay { padding: 10px; }
            .myshop-notification { left: 10px; right: 10px; bottom: 10px; max-width: none; }
        }
    `;
    document.head.appendChild(style);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectModalStyles);
} else {
    injectModalStyles();
}


/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 5 / 10

   Wishlist, Category & Navigation
========================================================= */

function toggleWishlist(productId) {
    const pId = Number(productId);
    const index = MyShop.wishlist.indexOf(pId);

    if (index === -1) {
        MyShop.wishlist.push(pId);
        showNotification("Added to wishlist");
    } else {
        MyShop.wishlist.splice(index, 1);
        showNotification("Removed from wishlist");
    }

    saveWishlist();
}

function getWishlistCount() {
    return MyShop.wishlist.length;
}

function filterByCategory(categoryName) {
    const category = normalizeSearchText(categoryName);
    if (!category) {
        showAllProducts();
        return;
    }

    const results = MyShop.products.filter(product => normalizeSearchText(product.category) === category);
    MyShop.searchResults = results;
    renderSearchResults(results, categoryName);
    scrollToProducts();
}

function scrollToProducts() {
    const productSection = document.getElementById("productGrid");
    if (!productSection) return;
    const section = productSection.closest(".section") || productSection;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function shopNow() {
    scrollToProducts();
}

function viewAllCategories() {
    const categoryGrid = document.querySelector(".category-grid");
    if (!categoryGrid) return;
    categoryGrid.classList.toggle("show-all-categories");
    if (categoryGrid.classList.contains("show-all-categories")) {
        showNotification("All categories are now available.");
    }
}

function handleNavigation(destination) {
    const target = normalizeSearchText(destination);

    switch (target) {
        case "home":
            window.scrollTo({ top: 0, behavior: "smooth" });
            break;
        case "categories":
            scrollToCategories();
            break;
        case "flash sale":
            showFlashSale();
            break;
        case "best selling":
            showBestSelling();
            break;
        case "new arrivals":
            showNewArrivals();
            break;
        case "become a seller":
            openSellerPanel();
            break;
        default:
            window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function scrollToCategories() {
    const categoryGrid = document.querySelector(".category-grid");
    if (!categoryGrid) return;
    const section = categoryGrid.closest(".section") || categoryGrid;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openSellerPanel() {
    const existing = document.getElementById("myShopSellerModal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "myShopSellerModal";
    modal.className = "myshop-modal-overlay";
    modal.innerHTML = `
        <div class="myshop-modal seller-modal" role="dialog" aria-modal="true">
            <div class="myshop-modal-header">
                <h2>🏪 Become a Seller</h2>
                <button type="button" class="myshop-close" onclick="closeSellerPanel()">×</button>
            </div>
            <div class="myshop-modal-body">
                <p style="margin-bottom:18px;color:#666;line-height:1.6;">Start selling your products on MyShop.</p>
                <form onsubmit="submitSellerApplication(event)">
                    <label class="myshop-label" for="sellerName">Full Name</label>
                    <input id="sellerName" class="myshop-input" type="text" placeholder="Your full name" required>
                    <label class="myshop-label" for="sellerPhone">Phone Number</label>
                    <input id="sellerPhone" class="myshop-input" type="tel" placeholder="01XXXXXXXXX" required>
                    <label class="myshop-label" for="sellerBusiness">Business Name</label>
                    <input id="sellerBusiness" class="myshop-input" type="text" placeholder="Your business name" required>
                    <button type="submit" class="myshop-login-btn">Apply to Become a Seller</button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeSellerPanel();
    });
}

function closeSellerPanel() {
    const modal = document.getElementById("myShopSellerModal");
    if (modal) modal.remove();
}

function submitSellerApplication(event) {
    event.preventDefault();
    const name = document.getElementById("sellerName")?.value.trim();
    const phone = document.getElementById("sellerPhone")?.value.trim();
    const business = document.getElementById("sellerBusiness")?.value.trim();

    if (!name || !phone || !business) {
        showNotification("Please complete all seller information.", "warning");
        return;
    }

    closeSellerPanel();
    showNotification("Seller application submitted successfully.");
}

function initializePartFive() {
    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("click", function () {
            const text = category.querySelector("p")?.textContent?.trim();
            if (text) filterByCategory(text);
        });
    });

    document.querySelectorAll(".navigation a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            handleNavigation(link.textContent.trim());
        });
    });

    const shopBtn = document.querySelector(".shop-btn");
    if (shopBtn) shopBtn.addEventListener("click", function (e) { e.preventDefault(); shopNow(); });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePartFive);
} else {
    initializePartFive();
}


/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 6 / 10

   Flash Sale Timer & Product Sorting
========================================================= */

function formatCountdown(totalSeconds) {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    return [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0")
    ].join(":");
}

function updateFlashSaleTimer() {
    const timer = document.getElementById("timer");
    if (!timer) return;

    timer.textContent = formatCountdown(MyShop.flashSale.remaining);

    if (MyShop.flashSale.remaining <= 0) {
        MyShop.flashSale.active = false;
        timer.textContent = "00:00:00";
        handleFlashSaleEnd();
        return;
    }
    MyShop.flashSale.remaining--;
}

function startFlashSaleTimer() {
    updateFlashSaleTimer();
    setInterval(updateFlashSaleTimer, 1000);
}

function handleFlashSaleEnd() {
    const saleHeader = document.querySelector(".sale-header");
    if (saleHeader) saleHeader.classList.add("sale-ended");
}

function sortProductsByPrice(direction = "low") {
    const products = [...MyShop.products];
    products.sort((a, b) => direction === "high" ? b.price - a.price : a.price - b.price);
    MyShop.searchResults = products;
    renderSearchResults(products, "Price Filter");
}

function showBestSelling() {
    const bestSellingIds = [1, 3, 2, 4];
    const products = bestSellingIds.map(id => MyShop.products.find(p => p.id === id)).filter(Boolean);
    MyShop.searchResults = products;
    renderSearchResults(products, "Best Selling");
    scrollToProducts();
}

function showNewArrivals() {
    const products = [...MyShop.products].reverse();
    MyShop.searchResults = products;
    renderSearchResults(products, "New Arrivals");
    scrollToProducts();
}

function showFlashSale() {
    const products = MyShop.products.filter(p => p.oldPrice > p.price);
    MyShop.searchResults = products;
    renderSearchResults(products, "Flash Sale");
    scrollToProducts();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startFlashSaleTimer);
} else {
    startFlashSaleTimer();
}



/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 7 / 10

   Product Interactions & Accessibility
========================================================= */

function getProductById(productId) {
    return MyShop.products.find(product => Number(product.id) === Number(productId)) || null;
}

function openProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existing = document.getElementById("myShopProductModal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "myShopProductModal";
    modal.className = "myshop-modal-overlay";
    modal.innerHTML = `
        <div class="myshop-modal product-detail-modal" role="dialog" aria-modal="true">
            <div class="myshop-modal-header">
                <h2>Product Details</h2>
                <button type="button" class="myshop-close" onclick="closeProductDetails()" aria-label="Close">×</button>
            </div>
            <div class="myshop-modal-body">
                <div style="text-align:center;font-size:90px;padding:15px;">${product.icon}</div>
                <h2 style="margin:10px 0;">${escapeHTML(product.name)}</h2>
                <div style="margin-bottom:10px;">${createRatingStars(product.rating)}</div>
                <div style="color:#f85606;font-size:24px;font-weight:bold;">৳${formatPrice(product.price)}</div>
                <div style="color:#999;text-decoration:line-through;margin:5px 0 15px;">৳${formatPrice(product.oldPrice)}</div>
                <p style="color:#666;line-height:1.6;margin-bottom:18px;">Discover more information about this product on MyShop.</p>
                <button type="button" class="myshop-login-btn" onclick="addToCart('${escapeJS(product.name)}', ${Number(product.price)}); closeProductDetails();">🛒 Add to Cart</button>
                <button type="button" class="myshop-register-btn" style="margin-top:10px;" onclick="toggleWishlist(${Number(product.id)})">♡ Add to Wishlist</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeProductDetails();
    });
}

function closeProductDetails() {
    const modal = document.getElementById("myShopProductModal");
    if (modal) modal.remove();
}

function openWishlist() {
    const existing = document.getElementById("myShopWishlistModal");
    if (existing) existing.remove();
    renderWishlistModal();
}

function closeWishlist() {
    const modal = document.getElementById("myShopWishlistModal");
    if (modal) modal.remove();
}

function renderWishlistModal() {
    const products = MyShop.wishlist.map(id => getProductById(id)).filter(Boolean);
    const modal = document.createElement("div");
    modal.id = "myShopWishlistModal";
    modal.className = "myshop-modal-overlay";
    modal.innerHTML = `
        <div class="myshop-modal wishlist-modal" role="dialog" aria-modal="true">
            <div class="myshop-modal-header">
                <h2>♡ Wishlist</h2>
                <button type="button" class="myshop-close" onclick="closeWishlist()">×</button>
            </div>
            <div class="myshop-modal-body">
                ${products.length ? products.map(product => `
                    <div class="cart-item">
                        <div class="cart-item-icon">${product.icon}</div>
                        <div class="cart-item-info">
                            <h3>${escapeHTML(product.name)}</h3>
                            <p>৳${formatPrice(product.price)}</p>
                        </div>
                        <button type="button" class="myshop-login-btn" style="width:auto;padding:8px 12px;" onclick="addToCart('${escapeJS(product.name)}', ${Number(product.price)})">Add</button>
                    </div>
                `).join("") : `
                    <div class="empty-cart" style="text-align:center;padding:25px 10px;">
                        <div style="font-size:55px;margin-bottom:10px;">♡</div>
                        <h3>Your wishlist is empty</h3>
                    </div>
                `}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeWishlist();
    });
}

function initializePartSeven() {
    const buttons = document.querySelectorAll(".header-actions button");
    if (buttons.length > 0) {
        buttons[0].addEventListener("click", function (e) { e.preventDefault(); openWishlist(); });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
            event.preventDefault();
            const input = getSearchInput();
            if (input) input.focus();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePartSeven);
} else {
    initializePartSeven();
}

/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 8 / 10

   UX Features & Utilities
========================================================= */

function createBackToTopButton() {
    if (document.getElementById("myShopBackToTop")) return;

    const button = document.createElement("button");
    button.id = "myShopBackToTop";
    button.type = "button";
    button.innerHTML = "↑";
    button.setAttribute("aria-label", "Back to top");
    button.style.cssText = "position:fixed;right:20px;bottom:75px;width:42px;height:42px;border:none;border-radius:50%;background:#f85606;color:#fff;font-size:20px;font-weight:bold;cursor:pointer;z-index:999;display:none;box-shadow:0 4px 15px rgba(0,0,0,.18);";

    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(button);
    window.addEventListener("scroll", function () {
        button.style.display = window.scrollY > 350 ? "block" : "none";
    }, { passive: true });
}

function initializePartEight() {
    createBackToTopButton();

    window.addEventListener("online", function () { showNotification("You are back online."); });
    window.addEventListener("offline", function () { showNotification("You are currently offline.", "warning"); });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePartEight);
} else {
    initializePartEight();
}

/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 9 / 10

   Checkout & Orders
========================================================= */

function createOrderId() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 900) + 100;
    return `MS-${timestamp}-${random}`;
}

function openCheckout() {
    if (MyShop.cart.length === 0) {
        showNotification("Your cart is empty.", "warning");
        return;
    }

    closeCart();
    const existing = document.getElementById("myShopCheckoutModal");
    if (existing) existing.remove();

    renderCheckoutModal();
}

function closeCheckout() {
    const modal = document.getElementById("myShopCheckoutModal");
    if (modal) modal.remove();
}

function renderCheckoutModal() {
    const total = getCartTotal();
    const modal = document.createElement("div");
    modal.id = "myShopCheckoutModal";
    modal.className = "myshop-modal-overlay";
    modal.innerHTML = `
        <div class="myshop-modal checkout-modal" role="dialog" aria-modal="true">
            <div class="myshop-modal-header">
                <h2>🧾 Checkout</h2>
                <button type="button" class="myshop-close" onclick="closeCheckout()">×</button>
            </div>
            <div class="myshop-modal-body">
                <form id="myShopCheckoutForm" onsubmit="placeOrder(event)">
                    <label class="myshop-label" for="checkoutName">Full Name</label>
                    <input id="checkoutName" class="myshop-input" type="text" required placeholder="Your full name">
                    <label class="myshop-label" for="checkoutPhone">Phone Number</label>
                    <input id="checkoutPhone" class="myshop-input" type="tel" required placeholder="01XXXXXXXXX">
                    <label class="myshop-label" for="checkoutAddress">Delivery Address</label>
                    <textarea id="checkoutAddress" class="myshop-input" required rows="3" placeholder="Enter delivery address" style="height:auto;padding-top:10px;"></textarea>
                    <label class="myshop-label" for="checkoutCity">City</label>
                    <input id="checkoutCity" class="myshop-input" type="text" required placeholder="City">
                    <label class="myshop-label" for="paymentMethod">Payment Method</label>
                    <select id="paymentMethod" class="myshop-input">
                        <option value="cod">Cash on Delivery</option>
                        <option value="online">Online Payment</option>
                    </select>
                    <div style="padding:15px;margin:10px 0 18px;background:#fff5ef;border-radius:6px;">
                        <strong>Order Total:</strong>
                        <span style="float:right;color:#f85606;font-weight:bold;">৳${formatPrice(total)}</span>
                    </div>
                    <button type="submit" class="myshop-login-btn">Place Order</button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeCheckout();
    });
}

function placeOrder(event) {
    event.preventDefault();
    const name = document.getElementById("checkoutName")?.value.trim();
    const phone = document.getElementById("checkoutPhone")?.value.trim();
    const address = document.getElementById("checkoutAddress")?.value.trim();
    const city = document.getElementById("checkoutCity")?.value.trim();
    const payment = document.getElementById("paymentMethod")?.value;

    if (!name || !phone || !address || !city) {
        showNotification("Please complete all delivery information.", "warning");
        return;
    }

    const orderId = createOrderId();
    const order = { id: orderId, customer: { name, phone, address, city }, paymentMethod: payment || "cod", items: [...MyShop.cart], total: getCartTotal(), createdAt: new Date().toISOString(), status: "Pending" };

    saveOrder(order);
    MyShop.cart = [];
    saveCart();
    updateCartCount();
    closeCheckout();
    showOrderSuccess(order);
}

function saveOrder(order) {
    try {
        const existing = localStorage.getItem(STORAGE_KEYS.orders);
        const orders = existing ? JSON.parse(existing) : [];
        if (!Array.isArray(orders)) return;
        orders.push(order);
        localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch (error) {
        console.error("Order storage error:", error);
    }
}

function showOrderSuccess(order) {
    const modal = document.createElement("div");
    modal.id = "myShopOrderSuccess";
    modal.className = "myshop-modal-overlay";
    modal.innerHTML = `
        <div class="myshop-modal" role="dialog" aria-modal="true">
            <div class="myshop-modal-header"><h2>🎉 Order Confirmed</h2></div>
            <div class="myshop-modal-body" style="text-align:center;">
                <div style="font-size:60px;margin-bottom:10px;">✓</div>
                <h3>Thank you for your order!</h3>
                <p style="margin:12px 0;color:#666;">Your order has been received successfully.</p>
                <p>Order ID: <strong>${escapeHTML(order.id)}</strong></p>
                <p style="margin-top:8px;color:#f85606;font-weight:bold;">Total: ৳${formatPrice(order.total)}</p>
                <button type="button" class="myshop-login-btn" style="margin-top:18px;" onclick="document.getElementById('myShopOrderSuccess')?.remove()">Continue Shopping</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/* =========================================================
   MYSHOP — JAVASCRIPT
   PART 10 / 10

   State Synchronization & Initialization
========================================================= */

function saveUserSession(user) {
    try {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        MyShop.account.loggedIn = true;
        MyShop.account.email = user.email;
    } catch (error) {
        console.error("User session save error:", error);
    }
}

function loadUserSession() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.user);
        if (!saved) return null;
        const user = JSON.parse(saved);
        MyShop.account.loggedIn = true;
        MyShop.account.email = user.email;
        return user;
    } catch (error) {
        console.error("User session load error:", error);
        return null;
    }
}

function logoutUser() {
    try {
        localStorage.removeItem(STORAGE_KEYS.user);
    } catch (error) {
        console.error("Logout error:", error);
    }
    MyShop.account.loggedIn = false;
    MyShop.account.email = "";
    showNotification("You have been logged out.");
    updateUserInterface();
}

function updateUserInterface() {
    const buttons = document.querySelectorAll(".header-actions button");
    if (!buttons.length) return;

    const accountButton = buttons[buttons.length - 1];
    if (!accountButton) return;

    if (MyShop.account.loggedIn) {
        accountButton.title = `Account: ${MyShop.account.email}`;
    } else {
        accountButton.title = "Login";
        accountButton.onclick = openLogin;
    }
}

function synchronizeApplicationData() {
    loadSavedData();
    loadUserSession();
    updateCartCount();
    updateUserInterface();
}

function initializeStorageSync() {
    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEYS.cart) {
            loadSavedData();
            updateCartCount();
        }
        if (event.key === STORAGE_KEYS.wishlist) {
            loadSavedData();
        }
        if (event.key === STORAGE_KEYS.user) {
            loadUserSession();
            updateUserInterface();
        }
    });
}

function initializeEscapeHandler() {
    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        document.querySelectorAll(".myshop-modal-overlay").forEach(modal => modal.remove());
    });
}

function initializeMyShopApplication() {
    synchronizeApplicationData();
    initializeStorageSync();
    initializeEscapeHandler();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMyShopApplication);
} else {
    initializeMyShopApplication();
}
