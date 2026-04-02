import { Router } from "express";
import {
  calculate,
  getAvailableRides,
  bookRide,
  createRide,
} from "../controllers/carsharing.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

// Rota de cálculo de histórico (POST)
router.post("/calculate", auth, calculate);

// Rota para ver as boleias disponíveis (GET)
router.get("/available", auth, getAvailableRides);

// Rota para reservar (PATCH) - :id é o parâmetro que passamos do Angular
router.patch("/book/:id", auth, bookRide);

router.post("/create", auth, createRide);

export default router;
