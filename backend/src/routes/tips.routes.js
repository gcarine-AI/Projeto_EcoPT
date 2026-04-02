import { Router } from "express";
import { list, listByCategory } from "../controllers/tips.controller.js";

const router = Router();

router.get("/", list);
router.get("/category/:category", listByCategory);

export default router;
