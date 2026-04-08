const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_ALLOWED_ORIGINS = [
  "http://127.0.0.1:5501",
  "http://localhost:5501",
];
const CONFIGURED_ALLOWED_ORIGINS = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = new Set([
  ...DEFAULT_ALLOWED_ORIGINS,
  ...CONFIGURED_ALLOWED_ORIGINS,
]);
const corsOptions = {
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
};

process.on("uncaughtException", (error) => {
  console.error("[backend] Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[backend] Unhandled rejection:", reason);
  process.exit(1);
});

console.log("[backend] Booting backend...");
console.log(`[backend] Requested port: ${PORT}`);
console.log(`[backend] Allowed origins: ${Array.from(ALLOWED_ORIGINS).join(", ")}`);

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

let users = [];

app.get("/health", (req, res) => {
  res.json({ ok: true, port: PORT });
});

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
    password: hashedPassword,
  };

  users.push(user);

  res.json({
    user: {
      fullName: user.fullName,
      email: user.email,
    },
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((candidate) => candidate.email === email);

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
      email: user.email,
    },
  });
});

const server = app.listen(PORT, () => {
  console.log(`[backend] Server running on http://localhost:${PORT}`);
  console.log("[backend] Available routes: GET /health, POST /register, POST /login");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`[backend] Port ${PORT} is already in use.`);
  } else {
    console.error("[backend] Server failed to start:", error);
  }

  process.exit(1);
});
