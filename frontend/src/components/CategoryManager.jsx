import React, { useEffect, useState } from "react";
import { getCategories, addCategory, deleteCategory } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryManager = ({ onClose }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data || []);
            } catch (err) {
                console.error("Errore nel caricamento delle categorie:", err);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        const name = newCategory.trim();
        if (!name) return;

        try {
            const res = await addCategory({ name });
            setCategories(res.data || []);
            setNewCategory("");
        } catch (err) {
            console.error("Errore durante l'aggiunta della categoria:", err);
            alert("Errore durante l'aggiunta della categoria");
        }
    };

    const handleDelete = async (name) => {
        if (!window.confirm(`Vuoi eliminare la categoria "${name}"?`)) return;
        try {
            const res = await deleteCategory(name);
            setCategories(res.data || []);
        } catch (err) {
            console.error("Errore durante l'eliminazione:", err);
            alert("Errore durante l'eliminazione della categoria");
        }
    };

    return (
        <div className="category-modal-overlay">
            <div className="category-modal-window">
                <div className="modal-header mb-2">
                    <h5 className="modal-title m-0">Categorie attuali:</h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Chiudi"
                        onClick={onClose}
                    ></button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="text-center py-3">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            ></div>
                        </div>
                    ) : (
                        <>
                            <ul className="list-group mb-3">
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <li
                                            key={cat}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <span>{cat}</span>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    handleDelete(cat)
                                                }
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item text-center text-muted">
                                        Nessuna categoria trovata
                                    </li>
                                )}
                            </ul>

                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nuova categoria"
                                    value={newCategory}
                                    onChange={(e) =>
                                        setNewCategory(e.target.value)
                                    }
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAdd}
                                    title="Aggiungi categoria"
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
