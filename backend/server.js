const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = "KHATABOOK_SECRET_KEY";
const MONGO_URI = "mongodb://127.0.0.1:27017/khatabook";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

const app = express();
app.use(cors());
app.use(express.json());

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

let customers = [];


app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/customers", auth, (req, res) => {
  res.json(customers.filter(c => c.userId === req.userId));
});

app.post("/customer", auth, (req, res) => {
  const { name } = req.body;

  const customer = {
    id: Date.now(),
    name,
    balance: 0,
    userId: req.userId
  };

  customers.push(customer);

  res.json(customers.filter(c => c.userId === req.userId));
});

app.post("/transaction", auth, (req, res) => {
  const { id, type, amount } = req.body;

  const customer = customers.find(
    c => c.id === id && c.userId === req.userId
  );

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  customer.balance += type === "credit" ? amount : -amount;

  res.json(customers.filter(c => c.userId === req.userId));
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
