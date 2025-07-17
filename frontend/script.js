// Tab buttons
const signInBtn = document.getElementById("signInBtn");
const registerBtn = document.getElementById("registerBtn");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");

const API_BASE = "http://localhost:5000";

// Toggle forms
signInBtn.addEventListener("click", () => {
  signInBtn.classList.add("active");
  registerBtn.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  loginMessage.textContent = "";
  registerMessage.textContent = "";
});

registerBtn.addEventListener("click", () => {
  registerBtn.classList.add("active");
  signInBtn.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
  loginMessage.textContent = "";
  registerMessage.textContent = "";
});

// Register form submit
registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  registerMessage.textContent = "";
  registerMessage.classList.remove("success");
  
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    registerMessage.textContent = data.message;
    registerMessage.classList.add("success");
    registerForm.reset();
  } catch (err) {
    registerMessage.textContent = err.message;
  }
});

// Login form submit
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  loginMessage.textContent = "";
  loginMessage.classList.remove("success");

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("authToken", data.token);
    loginMessage.textContent = "Login successful! Redirecting...";
    loginMessage.classList.add("success");

    setTimeout(() => {
      window.location.href = "secured.html";
    }, 1500);
  } catch (err) {
    loginMessage.textContent = err.message;
  }
});
