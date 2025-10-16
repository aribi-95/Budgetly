import React, { useState, useEffect, useRef } from "react";
import { deleteTransaction, getMonthlySummary } from "../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";

const TransactionsList = ({
    transactions,
    loading,
    onEdit,
    setTransactions,
    selectedMonth,
    selectedYear,
    setSummary,
    setLoadingSummary,
    refreshMonths,
    onDuplicate,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const perPage = 6;

    const openMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsideMenu =
                openMenuRef.current &&
                openMenuRef.current.contains(event.target);
            const clickedMenuButton = !!event.target.closest?.(".menu-btn");

            if (!clickedInsideMenu && !clickedMenuButton) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Vuoi eliminare questo movimento?")) return;
        try {
            await deleteTransaction(id);
            const updatedTransactions = transactions.filter(
                (t) => t._id !== id
            );
            setTransactions(updatedTransactions);

            setLoadingSummary(true);
            const summaryRes = await getMonthlySummary(
                selectedMonth,
                selectedYear
            );
            setSummary(summaryRes.data || summaryRes);
            setLoadingSummary(false);

            await refreshMonths();
        } catch (err) {
            console.error(err);
            alert("Errore durante l'eliminazione.");
        } finally {
            setOpenMenuId(null);
        }
    };

    const toggleRow = (id) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const toggleMenu = (id) => {
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

    const handleEditClick = (t) => {
        if (typeof onEdit === "function") onEdit(t);
        setOpenMenuId(null);
    };

    const handleDuplicateClick = (t) => {
        if (typeof onDuplicate === "function") onDuplicate(t);
        setOpenMenuId(null);
    };

    const totalPages = Math.ceil(transactions.length / perPage);
    const displayed = transactions.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    if (loading) return <div className="spinner-border" role="status"></div>;

    return (
        <div className="transactions-list table-responsive">
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th></th>
                        <th>Importo</th>
                        <th>Data</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {displayed.map((t) => (
                        <React.Fragment key={t._id}>
                            <tr>
                                <td>{t.category}</td>
                                <td>
                                    {t.description && (
                                        <button
                                            type="button"
                                            className="btn info-button"
                                            onClick={() => toggleRow(t._id)}
                                        >
                                            <i className="bi bi-info-lg"></i>
                                        </button>
                                    )}
                                </td>
                                <td
                                    className={
                                        t.type === "expense"
                                            ? "text-danger"
                                            : "text-success"
                                    }
                                >
                                    {t.type === "expense" ? "-" : "+"}
                                    {t.amount}€
                                </td>
                                <td>{new Date(t.date).toLocaleDateString()}</td>

                                {/* Menu azioni */}
                                <td className="text-center align-middle position-relative">
                                    <button
                                        type="button"
                                        className="btn btn-light menu-btn d-inline-flex justify-content-center align-items-center"
                                        onClick={() => toggleMenu(t._id)}
                                    >
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>

                                    {openMenuId === t._id && (
                                        <div
                                            className="dropdown-menu show action-dropdown"
                                            ref={(el) =>
                                                (openMenuRef.current = el)
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() =>
                                                    handleEditClick(t)
                                                }
                                            >
                                                <i className="bi bi-pencil me-2"></i>
                                                Modifica
                                            </button>

                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() =>
                                                    handleDuplicateClick(t)
                                                }
                                            >
                                                <i className="bi bi-files me-2"></i>
                                                Duplica
                                            </button>

                                            <div className="dropdown-divider"></div>

                                            <button
                                                type="button"
                                                className="dropdown-item text-danger"
                                                onClick={() =>
                                                    handleDelete(t._id)
                                                }
                                            >
                                                <i className="bi bi-trash me-2"></i>
                                                Elimina
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>

                            {expandedRows.includes(t._id) && t.description && (
                                <tr className="description-row">
                                    <td
                                        colSpan="5"
                                        className="text-muted fst-italic ps-5"
                                    >
                                        {t.description}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Paginazione */}
            <div className="d-flex justify-content-center align-items-center my-2">
                <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <span>
                    {currentPage}/{totalPages || 1}
                </span>
                <button
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default TransactionsList;
