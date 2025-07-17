const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const JWT_SECRET = "19a92423d6c36201a85d74b1a92a5cb39be965c8d90f0d669d1c487651492362c5c3f29128857eba6a46ec561bdce155b77754b09e0f5d65c15b7c32a19ba59d";  // change this in production!

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, "users.json");

// Load users or create empty if file doesn't exist
let users = [];
if (fs.existsSync(usersFilePath)) {
  const data = fs.readFileSync(usersFilePath);
  users = JSON.parse(data);
} else {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

// Helper to save users
function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Register endpoint
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const userExists = users.find(u => u.username === username);
  if (userExists)
    return res.status(400).json({ message: "Username already taken" });

  users.push({ username, password });
  saveUsers();
  return res.json({ message: "User registered successfully" });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Create JWT token
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  return res.json({ token });
});

// Secured endpoint
app.get("/secured", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ message: `Welcome ${decoded.username}, this is a secured message!` });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
