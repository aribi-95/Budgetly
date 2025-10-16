import User from "../models/User.js";

export const getCategories = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("categories");
        res.json(user?.categories || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res
                .status(400)
                .json({ message: "Nome categoria richiesto" });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { categories: name } },
            { new: true }
        ).select("categories");

        res.status(201).json(user.categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { name } = req.params;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { categories: name } },
            { new: true }
        ).select("categories");

        res.json(user.categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
