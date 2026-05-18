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

userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", () => {
    userDropdown.style.display = "none";
});

window.onload = () => {
    updateMenuContent();
    loadCart();
};

/* ================= CART ================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cartBtn");
const checkoutBox = document.getElementById("checkoutBox");
const closeBox = document.getElementById("closeBox");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

let total = 0;

cartBtn.addEventListener("click", () => {
    renderCart();
    checkoutBox.style.display = "grid";
    fillCheckoutInfo(); // 🔥 thêm dòng này
});

closeBox.addEventListener("click", () => {
    checkoutBox.style.display = "none";
});

/* ================= QUANTITY ================= */

document.querySelectorAll(".product").forEach(product => {

    const minus = product.querySelector(".minus");
    const plus = product.querySelector(".plus");
    const qty = product.querySelector(".qty-number");

    let count = 1;

    plus.addEventListener("click", () => {
        count++;
        qty.innerText = count;
    });

    minus.addEventListener("click", () => {
        if (count > 1) {
            count--;
            qty.innerText = count;
        }
    });
});

/* ================= ADD CART (STACK TRÙNG) ================= */

document.querySelectorAll(".add-cart-btn").forEach(button => {

    button.addEventListener("click", () => {

        const product = button.closest(".product");

        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const qty = parseInt(product.querySelector(".qty-number").innerText);

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

        div.querySelector(".delete-item").addEventListener("click", () => {
            cart.splice(index, 1);
            saveCart();
            renderCart();
        });

        cartItems.appendChild(div);
    });

    totalPrice.innerText = total.toLocaleString() + "đ";
}

/* ================= SAVE ================= */

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= LOAD ================= */

function loadCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
}

/* ================= CHECKOUT ================= */

const payBtn = document.getElementById("payBtn");
const confirmBox = document.getElementById("confirmBox");
const confirmTitle = document.getElementById("confirmTitle");
const confirmText = document.getElementById("confirmText");
const confirmButtons = document.getElementById("confirmButtons");

payBtn.addEventListener("click", () => {

    if (cart.length === 0) {
        showMsg("Thông báo", "Chưa có đơn hàng!");
        return;
    }

    showConfirm();
});

function showMsg(title, text) {
    confirmBox.style.display = "flex";
    confirmTitle.innerText = title;
    confirmText.innerText = text;

    confirmButtons.innerHTML = `<button id="okBtn">Đóng</button>`;

    document.getElementById("okBtn").onclick = () => {
        confirmBox.style.display = "none";
    };
}

function showConfirm() {

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
    showMsg("Thành công", "Đặt hàng thành công!");
};

document.getElementById("confirmNo").onclick = () => {
    confirmBox.style.display = "none";
};
}
function saveOrderToHistory(){

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0) return;

    const payment = document.querySelector('input[name="payment"]:checked')?.value || "cash";

    const newOrder = {
        id: "#" + (orders.length + 1).toString().padStart(3, "0"),
        date: new Date().toLocaleDateString(),
        total: cart.reduce((sum,i)=>sum+i.total,0),

        statusPay: payment === "cash" ? "Tiền mặt" : "Chuyển khoản",
        statusShip: "Đang xử lý"
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
}
function fillCheckoutInfo() {
    document.getElementById("checkoutName").value = localStorage.getItem("username") || "";
    document.getElementById("checkoutPhone").value = localStorage.getItem("phone") || "";
    document.getElementById("checkoutEmail").value = localStorage.getItem("email") || "";
    document.getElementById("checkoutAddress").value = localStorage.getItem("address") || "";
}
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
});