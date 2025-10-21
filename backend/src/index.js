import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

// Carica variabili d'ambiente dal file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());

// Connessione a MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connesso!"))
    .catch((err) => console.error("Errore connessione MongoDB:", err));

// Rotta di test
app.get("/", (req, res) => {
    res.send("Budgetly Backend Online!");
});

// Avvio server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});

// Rotte
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
