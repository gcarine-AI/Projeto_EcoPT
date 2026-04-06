import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import calculationsRoutes from "./routes/calculations.routes.js";
import tipsRoutes from "./routes/tips.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import carsharingRoutes from "./routes/carsharing.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js" 

const app = express();
console.log("--- TESTE DE AMBIENTE ---");
console.log("URL do Supabase:", process.env.SUPABASE_URL ? "✅ Configurada" : "❌ Vazia");
console.log("Porto definido:", process.env.PORT);
console.log("-------------------------");

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://projeto-eco-pt.vercel.app"
        : "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

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
app.use("/marketplace", marketplaceRoutes);
app.use("/notifications", notificationsRoutes);

// Handler de erros global
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
