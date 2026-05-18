const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const dynamicMenu = document.getElementById('dynamicMenu');

window.onload = function () {
    updateMenuContent();
    loadUserInfo();
    loadAvatar();
    loadOrders();
};

function updateMenuContent() {
    const username = localStorage.getItem("username") || "User";
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
        dynamicMenu.innerHTML = `
            <a>👋 Xin chào, ${username}</a>
            <a href="Giaodienhoso.html">👤 Hồ sơ</a>
            <a onclick="logout()" style="color:red;">🚪 Đăng xuất</a>
        `;

        // ✅ TẠO avatarURL (thiếu ở code bạn)
    const avatarURL = getAvatar();

        // Avatar header
        userBtn.src = avatarURL;

        // Avatar hồ sơ (đồng bộ)
        const profileAvatar = document.getElementById("profileAvatar");
        if (profileAvatar) {
            profileAvatar.src = avatarURL;
        }

    }
}
function logout(){
    // xoá trạng thái đăng nhập
    localStorage.removeItem("isLoggedIn");

    // quay về trang chủ
    window.location.href = "webca.html";
}

// Toggle menu
userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.style.display =
        (userDropdown.style.display === 'block') ? 'none' : 'block';
});

// Click ngoài để đóng
document.addEventListener('click', () => {
    userDropdown.style.display = 'none';
});
// 🔥 Load dữ liệu
function loadUserInfo(){
    document.getElementById("name").innerText =
        localStorage.getItem("username") || "Chưa có tên";

    document.getElementById("address").innerText =
        localStorage.getItem("address") || "Chưa có";

    document.getElementById("phone").innerText =
        localStorage.getItem("phone") || "Chưa có";

    document.getElementById("email").innerText =
        localStorage.getItem("email") || "Chưa có";
}

// 🔥 Mở form
function openForm(){
    document.getElementById("editForm").style.display = "flex"; // dùng flex cho đẹp

    // load text cũ
    document.getElementById("editName").value =
        localStorage.getItem("username") || "";

    document.getElementById("editAddress").value =
        localStorage.getItem("address") || "";

    document.getElementById("editPhone").value =
        localStorage.getItem("phone") || "";

    document.getElementById("editEmail").value =
        localStorage.getItem("email") || "";

    // 🔥 LOAD AVATAR ĐANG DÙNG
    const avatar = localStorage.getItem("avatar");
    const username = localStorage.getItem("username") || "User";

    const avatarURL = avatar 
        ? avatar 
        : "https://i.pravatar.cc/150?u=" + username;

    document.getElementById("previewAvatar").src = avatarURL;
}

function closeForm(){
    document.getElementById("editForm").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// 🔥 Lưu thông tin
function saveInfo(){
    localStorage.setItem("username", document.getElementById("editName").value);
    localStorage.setItem("address", document.getElementById("editAddress").value);
    localStorage.setItem("phone", document.getElementById("editPhone").value);
    localStorage.setItem("email", document.getElementById("editEmail").value);

    // 🔥 Avatar
    const file = document.getElementById("avatarInput").files[0];

    if(file){
    const reader = new FileReader();
    reader.onload = function(e){
        localStorage.setItem("avatar", e.target.result);

        loadUserInfo();
        loadAvatar();
        closeForm(); // 🔥 đóng form
    }
    reader.readAsDataURL(file);
} else {
    loadUserInfo();
    loadAvatar();
    closeForm(); // 🔥 đóng form
}
}

// 🔥 Load avatar + đồng bộ toàn web
function loadAvatar(){
    const avatarURL = getAvatar();

    document.getElementById("userBtn").src = avatarURL;
    document.getElementById("profileAvatar").src = avatarURL;
}

function changeAvatar(){
    document.getElementById("avatarInput").click();
}

document.getElementById("avatarInput").addEventListener("change", function(){
    const file = this.files[0];

    if(file){
        const reader = new FileReader();

        reader.onload = function(e){
            const imgData = e.target.result;

            // 🔥 HIỂN THỊ NGAY TRONG FORM
            document.getElementById("previewAvatar").src = getAvatar();

            // 🔥 cập nhật luôn ngoài giao diện
            document.getElementById("profileAvatar").src = imgData;
            document.getElementById("userBtn").src = imgData;

            // 🔥 lưu lại
            localStorage.setItem("avatar", imgData);
        }

        reader.readAsDataURL(file);
    }
});
function getAvatar(){
    const avatar = localStorage.getItem("avatar");
    const username = localStorage.getItem("username") || "User";
    return avatar ? avatar : "https://i.pravatar.cc/150?u=" + username;
}
window.addEventListener("storage", function(e){
    if(e.key === "avatar" || e.key === "username"){
        loadAvatar();
    }
});
function loadOrders(){
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const table = document.querySelectorAll("table")[0];

    let html = `
        <tr>
            <th>Đơn hàng</th>
            <th>Ngày</th>
            <th>Địa chỉ</th>
            <th>Giá trị</th>
            <th>TT thanh toán</th>
            <th>TT vận chuyển</th>
            <th>Xóa</th>
        </tr>
    `;

    if(orders.length === 0){
        html += `
        <tr>
            <td colspan="7" class="empty">Không có đơn hàng nào.</td>
        </tr>`;
    } else {
        orders.forEach(o=>{
            html += `
            <tr>
                <td>${o.id}</td>
                <td>${o.date}</td>
                <td>${localStorage.getItem("address") || "Chưa có"}</td>
                <td>${o.total.toLocaleString()}đ</td>
                <td>${o.statusPay}</td>
                <td>${o.statusShip}</td>
                <td>
    <span class="delete-x" onclick="deleteOrder('${o.id}')">❌</span>
</td>
            </tr>`;
        });
    }

    table.innerHTML = html;
}
function deleteOrder(id){
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // lọc bỏ đơn bị xóa
    orders = orders.filter(o => o.id !== id);

    // lưu lại
    localStorage.setItem("orders", JSON.stringify(orders));

    // load lại bảng
    loadOrders();
}
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show-menu");
});