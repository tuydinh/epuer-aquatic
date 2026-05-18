// ================== SWITCH FORM ==================
function showRegister(){
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
}

function showLogin(){
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
}

// ================== HIỂN THỊ LỖI ==================
function setError(input, message){
    input.classList.add("input-error");
    input.nextElementSibling.innerText = message;
}

function clearError(input){
    input.classList.remove("input-error");
    input.nextElementSibling.innerText = "";
}

// ================== ĐĂNG KÝ ==================
document.querySelectorAll(".main-btn")[1].onclick = function () {

    const name = document.getElementById("regName");
    const phone = document.getElementById("regPhone");
    const pass = document.getElementById("regPass");

    let valid = true;

    [name,phone,pass].forEach(clearError);

    if(!name.value.trim()){
        setError(name,"Không được để trống");
        valid = false;
    }

    const phoneRegex = /^\d{10}$/;
    if(!phone.value.trim()){
        setError(phone,"Không được để trống");
        valid = false;
    } else if(!phoneRegex.test(phone.value)){
        setError(phone,"SĐT phải đủ 10 số");
        valid = false;
    }

    if(!pass.value.trim()){
        setError(pass,"Không được để trống");
        valid = false;
    }

    if(!valid) return;

    // ❌ chống trùng SĐT
    if(localStorage.getItem("phone") === phone.value){
        setError(phone,"SĐT đã tồn tại");
        return;
    }

    localStorage.setItem("username", name.value);
    localStorage.setItem("phone", phone.value);
    localStorage.setItem("password", pass.value);

    alert("Đăng ký thành công!");
    showLogin();
}

// ================== ĐĂNG NHẬP ==================
document.querySelectorAll(".main-btn")[0].onclick = function () {

    const input = document.getElementById("loginInput");
    const pass = document.getElementById("loginPass");

    clearError(input);
    clearError(pass);

    let valid = true;

    if(!input.value.trim()){
        setError(input,"Không được để trống");
        valid = false;
    }

    if(!pass.value.trim()){
        setError(pass,"Không được để trống");
        valid = false;
    }

    if(!valid) return;

    const savedPhone = localStorage.getItem("phone");
    const savedPass = localStorage.getItem("password");

    if(input.value === savedPhone && pass.value === savedPass){
        localStorage.setItem("isLoggedIn","true");
        alert("Đăng nhập thành công!");
        window.location.href = "index.html";
    } else {
        setError(input,"Sai SĐT hoặc mật khẩu");
    }
}
