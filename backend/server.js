const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

// REGISTER
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    fullName,
    email,
    password: hashedPassword
  };

  users.push(user);

  res.json({
    user: {
      fullName: user.fullName,
      email: user.email
    }
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(400).json({ error: "Wrong password" });
  }

  res.json({
    user: {
      fullName: user.fullName,
      email: user.email
    }
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});