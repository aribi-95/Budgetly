import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    categories: {
        type: [String],
        default: ["Casa", "Trasporti", "Spesa", "Tempo libero"],
    },
});

// Hash della password prima di salvare
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Verifica password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
