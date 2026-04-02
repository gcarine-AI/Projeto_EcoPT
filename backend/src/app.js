import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import calculationsRoutes from "./routes/calculations.routes.js";
import tipsRoutes from "./routes/tips.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import carsharingRoutes from "./routes/carsharing.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Rotas
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);
app.use("/auth", authRoutes);
app.use("/calculations", calculationsRoutes);
app.use("/tips", tipsRoutes);
app.use("/faq", faqRoutes);
app.use("/carsharing", carsharingRoutes);

// Handler de erros global
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
