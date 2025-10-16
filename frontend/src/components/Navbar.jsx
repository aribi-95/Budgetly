import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../App";
import CategoryManager from "./CategoryManager";
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

const Navbar = ({
    monthsWithTransactions,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
}) => {
    const { setToken } = useContext(AuthContext);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);

    const monthDropdownRef = useRef(null);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                monthDropdownRef.current &&
                !monthDropdownRef.current.contains(event.target) &&
                showMonthDropdown
            ) {
                setShowMonthDropdown(false);
            }

            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target) &&
                showProfileDropdown
            ) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMonthDropdown, showProfileDropdown]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = "/login";
    };

    const handleSelectMonth = (year, month) => {
        setSelectedMonth(month);
        setSelectedYear(year);
        setShowMonthDropdown(false);
    };

    return (
        <>
            <nav className="navbar dashboard-navbar d-flex align-items-center justify-content-between px-3">
                <div
                    className="navbar-logo"
                    style={{ cursor: "pointer" }}
                    onClick={() => window.location.reload()}
                >
                    Budgetly
                </div>

                {/* Dropdown Mesi */}
                <div className="position-relative" ref={monthDropdownRef}>
                    <button
                        className="btn btn-light dropdown-toggle"
                        onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    >
                        {monthNames[selectedMonth - 1]} {selectedYear}
                    </button>
                    {showMonthDropdown && (
                        <div className="dropdown-menu show mt-1">
                            {monthsWithTransactions.length > 0 ? (
                                monthsWithTransactions.map((m) => (
                                    <button
                                        key={`${m._id.year}-${m._id.month}`}
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSelectMonth(
                                                m._id.year,
                                                m._id.month
                                            )
                                        }
                                    >
                                        {monthNames[m._id.month - 1]}{" "}
                                        {m._id.year}
                                    </button>
                                ))
                            ) : (
                                <button
                                    className="dropdown-item"
                                    onClick={() =>
                                        handleSelectMonth(
                                            selectedYear,
                                            selectedMonth
                                        )
                                    }
                                >
                                    {monthNames[selectedMonth - 1]}{" "}
                                    {selectedYear}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Menu Profilo */}
                <div
                    className="profile-menu position-relative"
                    ref={profileMenuRef}
                >
                    <button
                        className="btn btn-light profile-btn"
                        onClick={() =>
                            setShowProfileDropdown(!showProfileDropdown)
                        }
                    >
                        <i className="bi bi-person-circle fs-5"></i>
                    </button>
                    {showProfileDropdown && (
                        <div className="dropdown-menu show profile-dropdown">
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setShowCategoryModal(true);
                                    setShowProfileDropdown(false);
                                }}
                            >
                                <i className="bi bi-tags me-2"></i> Gestisci
                                categorie
                            </button>
                            <div className="dropdown-divider"></div>
                            <button
                                className="dropdown-item text-danger"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>{" "}
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {showCategoryModal && (
                <CategoryManager onClose={() => setShowCategoryModal(false)} />
            )}
        </>
    );
};

export default Navbar;
