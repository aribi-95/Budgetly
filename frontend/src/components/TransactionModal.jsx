import React, { useState } from "react";
import {
    addTransaction,
    updateTransaction,
    addCategory,
} from "../services/api";

const TransactionModal = ({
    onClose,
    transaction,
    categories,
    setCategories,
    selectedMonth,
    selectedYear,
    setTransactions,
    onSaved,
}) => {
    const isEdit = !!(transaction && transaction._id);

    const [form, setForm] = useState({
        type: transaction?.type || "expense",
        category: transaction?.category || categories[0] || "",
        amount: transaction?.amount || "",
        description: transaction?.description || "",
        date: transaction?.date
            ? typeof transaction.date === "string"
                ? transaction.date.split("T")[0]
                : new Date(transaction.date).toISOString().split("T")[0]
            : `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`,
    });

    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let categoryToUse = form.category;

            if (form.category === "__new__") {
                if (!newCategory.trim()) {
                    alert("Inserisci il nome della nuova categoria");
                    setLoading(false);
                    return;
                }
                const addedCategoryRes = await addCategory({
                    name: newCategory,
                });
                if (addedCategoryRes?.data) {
                    setCategories(addedCategoryRes.data);
                } else if (typeof addedCategoryRes === "string") {
                    setCategories((prev) => [...prev, addedCategoryRes]);
                }
                categoryToUse = newCategory;
            }

            const payload = { ...form, category: categoryToUse };

            let res;
            if (isEdit) {
                res = await updateTransaction(transaction._id, payload);
            } else {
                res = await addTransaction(payload);
            }

            setTransactions((prev) => {
                if (isEdit)
                    return prev.map((t) =>
                        t._id === transaction._id ? res.data : t
                    );
                else return [res.data, ...prev];
            });

            onSaved();
        } catch (err) {
            console.error(err);
            alert("Errore durante il salvataggio. Riprova.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content shadow">
                <h3 className="modal-title">
                    {isEdit ? "Modifica Movimento" : "Nuovo Movimento"}
                </h3>
                <form onSubmit={handleSubmit} className="transaction-form">
                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                        >
                            <option value="income">Entrata</option>
                            <option value="expense">Uscita</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                            <option value="__new__">
                                Crea nuova categoria...
                            </option>
                        </select>
                        {form.category === "__new__" && (
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Nome nuova categoria"
                                className="new-category-input"
                                required
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label>Importo</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Importo"
                            required
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrizione</label>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descrizione (opzionale)"
                        />
                    </div>

                    <div className="form-group">
                        <label>Data</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="modal-actions mt-4 d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onClose}
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                                "Salva"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
