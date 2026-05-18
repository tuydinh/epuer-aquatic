/* ================= CART INIT ================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

/* ================= LOGIN ================= */

let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const dynamicMenu = document.getElementById('dynamicMenu');

function updateMenuContent() {
    const username = localStorage.getItem("username") || "User";
    const avatar = localStorage.getItem("avatar");

    if (isLoggedIn) {
        dynamicMenu.innerHTML = `
            <a>👋 Xin chào, ${username}</a>
            <a href="Giaodienhoso.html">👤 Hồ sơ</a>
            <a href="#" onclick="logout()" style="color:red;">🚪 Đăng xuất</a>
        `;

        userBtn.src = avatar || "https://i.pravatar.cc/150?u=" + username;

    } else {
        dynamicMenu.innerHTML = `
            <a href="Giaodiendangnhap.html">🔑 Đăng nhập / Đăng ký</a>
        `;
        userBtn.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
}

function logout() {
    localStorage.setItem("isLoggedIn", "false");
    isLoggedIn = false;
    updateMenuContent();
}

/* ================= INIT ================= */

window.onload = () => {
    updateMenuContent();
    renderCart();
};

/* ================= DROPDOWN ================= */

if (userBtn) {
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.style.display =
            userDropdown.style.display === 'block' ? 'none' : 'block';
    });
}

document.addEventListener('click', () => {
    if (userDropdown) userDropdown.style.display = 'none';
});

/* ================= CATEGORY SCROLL ================= */

document.querySelectorAll(".category-list a").forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const id = this.getAttribute("href").replace("#", "");
        const target = document.getElementById(id);

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: "smooth"
            });
        }
    });
});

/* ================= CART ================= */

const cartBtn = document.getElementById("cartBtn");
const checkoutBox = document.getElementById("checkoutBox");
const closeBox = document.getElementById("closeBox");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

if (cartBtn) {
   cartBtn.addEventListener("click", () => {
    renderCart();
    checkoutBox.style.display = "grid";
    fillCheckoutInfo(); // 🔥 thêm dòng này
});
}

if (closeBox) {
    closeBox.addEventListener("click", () => {
        checkoutBox.style.display = "none";
    });
}

/* ================= QUANTITY ================= */

document.querySelectorAll(".product").forEach(product => {

    const minus = product.querySelector(".minus");
    const plus = product.querySelector(".plus");
    const qty = product.querySelector(".qty-number");

    let count = 1;

    plus?.addEventListener("click", () => {
        count++;
        qty.innerText = count;
    });

    minus?.addEventListener("click", () => {
        if (count > 1) {
            count--;
            qty.innerText = count;
        }
    });
});

/* ================= ADD TO CART (STACK FIX) ================= */

document.querySelectorAll(".add-cart-btn").forEach(button => {

    button.addEventListener("click", () => {

        const product = button.closest(".product");

        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const qty = parseInt(product.querySelector(".qty-number").innerText);

        // 🔥 STACK TRÙNG
        const exist = cart.find(item => item.name === name);

        if (exist) {
            exist.qty += qty;
            exist.total = exist.price * exist.qty;
        } else {
            cart.push({
                name,
                price,
                qty,
                total: price * qty
            });
        }

        saveCart();
        renderCart();
    });
});

/* ================= RENDER CART ================= */

function renderCart() {

    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";
    total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart">Chưa có mặt hàng nào</div>`;
        totalPrice.innerText = "0đ";
        return;
    }

    cart.forEach((item, index) => {

        total += item.total;

        const div = document.createElement("div");
        div.classList.add("product-order");

        div.innerHTML = `
            <div>${item.name} x${item.qty}</div>
            <div style="display:flex;gap:10px;align-items:center;">
                <span>${item.total.toLocaleString()}đ</span>
                <button class="delete-item">✖</button>
            </div>
        `;

        div.querySelector(".delete-item").onclick = () => {
            cart.splice(index, 1);
            saveCart();
            renderCart();
        };

        cartItems.appendChild(div);
    });

    totalPrice.innerText = total.toLocaleString() + "đ";
}

/* ================= SAVE ================= */

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= CHECKOUT ================= */

const confirmBox = document.getElementById("confirmBox");
const confirmTitle = document.getElementById("confirmTitle");
const confirmText = document.getElementById("confirmText");
const confirmButtons = document.getElementById("confirmButtons");
const payBtn = document.getElementById("payBtn");

if (payBtn) {

    payBtn.addEventListener("click", () => {

        if (cart.length === 0) {

            confirmBox.style.display = "flex";
            confirmTitle.innerText = "Thông báo";
            confirmText.innerText = "Chưa có đơn hàng!";
            confirmButtons.innerHTML = `<button id="doneBtn">Đóng</button>`;

            document.getElementById("doneBtn").onclick = () => {
                confirmBox.style.display = "none";
            };

            return;
        }

        confirmBox.style.display = "flex";
        confirmTitle.innerText = "Xác nhận thanh toán?";
        confirmText.innerText = "Bạn có muốn đặt đơn hàng không?";

        confirmButtons.innerHTML = `
            <button id="confirmYes">Xác nhận</button>
            <button id="confirmNo">Hủy</button>
        `;

        document.getElementById("confirmYes").onclick = () => {
saveOrderToHistory();
            cart = [];
            saveCart();
            renderCart();

            confirmTitle.innerText = "Thành công";
            confirmText.innerText = "Đặt hàng thành công!";
            confirmButtons.innerHTML = `<button id="doneBtn">OK</button>`;

            document.getElementById("doneBtn").onclick = () => {
                confirmBox.style.display = "none";
                checkoutBox.style.display = "none";
            };
        };

        document.getElementById("confirmNo").onclick = () => {
            confirmBox.style.display = "none";
        };
    });
}
function saveOrderToHistory(){
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0) return;

    const newOrder = {
        id: "#" + (orders.length + 1).toString().padStart(3, "0"),
        date: new Date().toLocaleDateString(),
        total: cart.reduce((sum,i)=>sum+i.total,0),
        statusPay: "Đã thanh toán",
        statusShip: "Đang xử lý"
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
}
function toggleCategory() {
    const list = document.getElementById("categoryList");
    const icon = document.getElementById("toggleIcon");

    if (list.style.display === "block") {
        list.style.display = "none";
        icon.textContent = "+";
    } else {
        list.style.display = "block";
        icon.textContent = "-";
    }
}
const searchInput = document.getElementById("searchInput");
const priceRadios = document.querySelectorAll('input[name="price"]');

// ====== EVENT ======
searchInput.addEventListener("input", applyFilter);
priceRadios.forEach(radio => {
    radio.addEventListener("change", applyFilter);
});

// ====== FILTER FUNCTION ======
function applyFilter() {

    const keyword = searchInput.value.toLowerCase().trim();

    const selectedRadio = document.querySelector('input[name="price"]:checked');

    const titles = document.querySelectorAll(".title");

    titles.forEach(title => {

        const section = title.nextElementSibling;
        const products = section?.querySelectorAll(".product");

        let hasMatch = false;

        if (products) {

            products.forEach(product => {

                const name = product.querySelector("h4")?.innerText.toLowerCase();

                const priceText = product.querySelector(".price").innerText;
                const price = parseInt(priceText.replace(/\./g, "").replace("đ", "").trim());

                // ===== SEARCH =====
                const matchSearch = name.includes(keyword);

                // ===== PRICE =====
                let matchPrice = true;

                if (selectedRadio) {

                    const label = selectedRadio.parentElement.innerText.trim();

                    switch (label) {

                        case "Giá dưới 100.000đ":
                            matchPrice = price < 100000;
                            break;

                        case "100.000đ - 200.000đ":
                            matchPrice = price >= 100000 && price <= 200000;
                            break;

                        case "200.000đ - 300.000đ":
                            matchPrice = price >= 200000 && price <= 300000;
                            break;

                        case "300.000đ - 500.000đ":
                            matchPrice = price >= 300000 && price <= 500000;
                            break;

                        case "500.000đ - 1.000.000đ":
                            matchPrice = price >= 500000 && price <= 1000000;
                            break;

                        case "1.000.000đ - 1.500.000đ":
                            matchPrice = price >= 1000000 && price <= 1500000;
                            break;

                        case "1.500.000đ - 2.000.000đ":
                            matchPrice = price >= 1500000 && price <= 2000000;
                            break;
                    }
                }

                const show = matchSearch && matchPrice;

                product.style.display = show ? "block" : "none";

                if (show) hasMatch = true;
            });
        }

        // ===== FIX TITLE =====
        title.style.display = hasMatch ? "block" : "none";
    });
}
function fillCheckoutInfo() {
    document.getElementById("checkoutName").value = localStorage.getItem("username") || "";
    document.getElementById("checkoutPhone").value = localStorage.getItem("phone") || "";
    document.getElementById("checkoutEmail").value = localStorage.getItem("email") || "";
    document.getElementById("checkoutAddress").value = localStorage.getItem("address") || "";
}
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("show-menu");
});
document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove("show-menu");
    }
});