import Transaction from "../models/Transaction.js";

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
