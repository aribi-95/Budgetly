import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
];

const MonthNavigator = ({
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
}) => {
    const prevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const nextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    return (
        <div className="month-navigator">
            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={prevMonth}
            >
                <i className="bi bi-caret-left-fill"></i>
            </button>
            <span className="title">
                {monthNames[selectedMonth - 1]} {selectedYear}
            </span>
            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={nextMonth}
            >
                <i className="bi bi-caret-right-fill"></i>
            </button>
        </div>
    );
};

export default MonthNavigator;
