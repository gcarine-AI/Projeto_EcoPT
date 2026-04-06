import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Servidor a correr na porta ${PORT}`),
);

server.on("error", (err) => console.error("Server error:", err));
process.on("uncaughtException", (err) => console.error("Uncaught:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled:", err));
