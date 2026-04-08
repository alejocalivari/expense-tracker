const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const {
  DATA_FILE_PATH,
  createUser,
  findUserByEmail,
  getPlannerState,
  isValidPlannerStatePayload,
  normalizeEmail,
  savePlannerState,
} = require("./store");

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
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
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
console.log(`[backend] Data file: ${DATA_FILE_PATH}`);

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

const getBasicAuthCredentials = (authorizationHeader) => {
  if (typeof authorizationHeader !== "string" || !authorizationHeader.startsWith("Basic ")) {
    return null;
  }

  try {
    const encodedCredentials = authorizationHeader.slice("Basic ".length).trim();
    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex < 0) {
      return null;
    }

    return {
      email: decodedCredentials.slice(0, separatorIndex),
      password: decodedCredentials.slice(separatorIndex + 1),
    };
  } catch (error) {
    return null;
  }
};

const authenticatePlannerRequest = async (req, res, next) => {
  const credentials = getBasicAuthCredentials(req.headers.authorization);

  if (!credentials?.email || !credentials?.password) {
    res.set("WWW-Authenticate", 'Basic realm="Cashflow Salary Tracker Planner"');
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = findUserByEmail(credentials.email);

  if (!user) {
    res.set("WWW-Authenticate", 'Basic realm="Cashflow Salary Tracker Planner"');
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

  if (!isPasswordValid) {
    res.set("WWW-Authenticate", 'Basic realm="Cashflow Salary Tracker Planner"');
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.authenticatedUser = user;
  return next();
};

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
  const user = createUser({
    fullName,
    email: normalizeEmail(email),
    passwordHash: hashedPassword,
  });

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

  const user = findUserByEmail(email);

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

app.get("/planner", authenticatePlannerRequest, (req, res) => {
  const plannerState = getPlannerState(req.authenticatedUser.id);
  res.json(plannerState);
});

app.put("/planner", authenticatePlannerRequest, (req, res) => {
  if (!isValidPlannerStatePayload(req.body)) {
    return res.status(400).json({ error: "Invalid planner state payload" });
  }

  const plannerState = savePlannerState(req.authenticatedUser.id, req.body);

  if (!plannerState) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(plannerState);
});

const server = app.listen(PORT, () => {
  console.log(`[backend] Server running on http://localhost:${PORT}`);
  console.log("[backend] Available routes: GET /health, POST /register, POST /login, GET /planner, PUT /planner");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`[backend] Port ${PORT} is already in use.`);
  } else {
    console.error("[backend] Server failed to start:", error);
  }

  process.exit(1);
});

module.exports = {
  app,
  server,
};
