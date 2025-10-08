import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthsWithTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(authMiddleware); // Tutte le rotte sotto richiedono autenticazione

router.get("/months", getMonthsWithTransactions);
router.get("/", getTransactions);
router.post("/", addTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
