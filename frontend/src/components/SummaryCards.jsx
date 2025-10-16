import React from "react";

const SummaryCards = ({ summary, loading }) => {
    if (loading)
        return (
            <div className="d-flex justify-content-center my-4">
                <div className="spinner-border" role="status"></div>
            </div>
        );

    const cards = [
        {
            label: "Entrate",
            value: summary?.monthlyIncome || 0,
            className: "income",
        },
        {
            label: "Uscite",
            value: summary?.monthlyExpense || 0,
            className: "expense",
        },
        {
            label: "Bilancio Mensile",
            value: summary?.monthlyBalance || 0,
            className: summary?.monthlyBalance < 0 ? "negative" : "positive",
        },
        {
            label: "Bilancio Annuale",
            value: summary?.annualBalance || 0,
            className: summary?.annualBalance < 0 ? "negative" : "positive",
        },
    ];

    return (
        <div className="summary-cards mb-3">
            {cards.map((c, idx) => (
                <div key={idx} className={`summary-card ${c.className}`}>
                    <div className="summary-value">
                        {c.value.toLocaleString()}€
                    </div>
                    <div className="summary-label">{c.label}</div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
