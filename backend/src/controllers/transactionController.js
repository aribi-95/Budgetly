import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const getMonthsWithTransactions = async (req, res) => {
    try {
        const months = await Transaction.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
        ]);
        res.json(months);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const { month, year } = req.query;
        let filter = { userId: req.user._id };

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            filter.date = { $gte: startDate, $lte: endDate };
        }

        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!transaction)
            return res.status(404).json({ message: "Movimento non trovato" });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!transaction)
            return res.status(404).json({ message: "Movimento non trovato" });
        res.json({ message: "Movimento eliminato" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getYearTransactions = async (req, res) => {
    try {
        const year = parseInt(req.query.year, 10) || new Date().getFullYear();
        const startYear = new Date(year, 0, 1);
        const endYear = new Date(year, 11, 31, 23, 59, 59, 999);

        const userId = req.user._id;

        // Tutte le transazioni dell'anno
        const transactions = await Transaction.find({
            userId,
            date: { $gte: startYear, $lte: endYear },
        }).sort({ date: -1 });

        // Totali annuali per tipo
        const totalsAgg = await Transaction.aggregate([
            {
                $match: {
                    userId: userId,
                    date: { $gte: startYear, $lte: endYear },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let totalIncome = 0;
        let totalExpense = 0;
        totalsAgg.forEach((t) => {
            if (t._id === "income") totalIncome = t.total;
            if (t._id === "expense") totalExpense = Math.abs(t.total);
        });

        res.json({
            transactions,
            totalIncome,
            totalExpense,
            annualBalance: totalIncome - totalExpense,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Breakdown spese per categoria in un mese (per il grafico a torta)
export const getMonthlySummary = async (req, res) => {
    try {
        const month = parseInt(req.query.month, 10);
        const year = parseInt(req.query.year, 10);

        // default: mese corrente
        const now = new Date();
        const qMonth = month || now.getMonth() + 1;
        const qYear = year || now.getFullYear();

        const startMonth = new Date(qYear, qMonth - 1, 1);
        const endMonth = new Date(qYear, qMonth, 0, 23, 59, 59, 999);
        const startYear = new Date(qYear, 0, 1);
        const endYear = new Date(qYear, 11, 31, 23, 59, 59, 999);

        const userId = req.user._id;

        // Breakdown spese per categoria (usiamo $abs su amount)
        const categoriesAgg = await Transaction.aggregate([
            {
                $match: {
                    userId: userId,
                    type: "expense",
                    date: { $gte: startMonth, $lte: endMonth },
                },
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: { $abs: "$amount" } }, // <--- somma assoluti
                },
            },
            { $project: { category: "$_id", total: 1, _id: 0 } },
            { $sort: { total: -1 } },
        ]);

        // Totali mensili (income, expense)
        const monthlyTotals = await Transaction.aggregate([
            {
                $match: {
                    userId: userId,
                    date: { $gte: startMonth, $lte: endMonth },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let monthlyIncome = 0;
        let monthlyExpense = 0;
        monthlyTotals.forEach((t) => {
            if (t._id === "income") monthlyIncome = t.total;
            if (t._id === "expense") monthlyExpense = Math.abs(t.total);
        });

        // Bilancio annuale
        const yearTotals = await Transaction.aggregate([
            {
                $match: {
                    userId: userId,
                    date: { $gte: startYear, $lte: endYear },
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        let yearIncome = 0;
        let yearExpense = 0;
        yearTotals.forEach((t) => {
            if (t._id === "income") yearIncome = t.total;
            if (t._id === "expense") yearExpense = Math.abs(t.total);
        });

        // Composizione finale
        const result = {
            categories: categoriesAgg,
            monthlyIncome,
            monthlyExpense,
            monthlyBalance: monthlyIncome - monthlyExpense,
            annualBalance: yearIncome - yearExpense,
        };

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
