import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MonthNavigator from "../components/MonthNavigator";
import SummaryCards from "../components/SummaryCards";
import ExpensesChart from "../components/ExpensesChart";
import TransactionsList from "../components/TransactionsList";
import AddTransactionButton from "../components/AddTransactionButton";
import TransactionModal from "../components/TransactionModal";
import {
    getTransactions,
    getMonthlySummary,
    getMonthsWithTransactions,
    getCategories,
} from "../services/api";
import "../assets/dashboard.css";

const Dashboard = () => {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [monthsWithTransactions, setMonthsWithTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [duplicatingTransaction, setDuplicatingTransaction] = useState(null);

    const refreshMonths = async () => {
        try {
            const monthsRes = await getMonthsWithTransactions();
            setMonthsWithTransactions(monthsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [monthsRes, categoriesRes] = await Promise.all([
                    getMonthsWithTransactions(),
                    getCategories(),
                ]);
                setMonthsWithTransactions(monthsRes.data);
                setCategories(categoriesRes.data || categoriesRes);
            } catch (err) {
                console.error(err);
            }
        };
        fetchInitialData();
    }, []);

    const fetchDashboardData = async () => {
        setLoadingTransactions(true);
        setLoadingSummary(true);
        try {
            const [transactionsRes, summaryRes] = await Promise.all([
                getTransactions(selectedMonth, selectedYear),
                getMonthlySummary(selectedMonth, selectedYear),
            ]);
            setTransactions(transactionsRes.data);
            setSummary(summaryRes.data || summaryRes);
            await refreshMonths();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTransactions(false);
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [selectedMonth, selectedYear]);

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setDuplicatingTransaction(null);
        setShowModal(true);
    };

    const handleDuplicateTransaction = (transaction) => {
        const duplicated = {
            ...transaction,
            _id: undefined,
            date: new Date(transaction.date).toISOString().split("T")[0],
            description: `${transaction.description || ""}`,
        };
        setEditingTransaction(null);
        setDuplicatingTransaction(duplicated);
        setShowModal(true);
    };

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setDuplicatingTransaction(null);
        setShowModal(true);
    };

    const handleTransactionSaved = async () => {
        setShowModal(false);
        await fetchDashboardData();
        await refreshMonths();
    };

    return (
        <>
            <Navbar
                monthsWithTransactions={monthsWithTransactions}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}
            />

            <div className="dashboard-container container-fluid py-3">
                <MonthNavigator
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    setSelectedMonth={setSelectedMonth}
                    setSelectedYear={setSelectedYear}
                />{" "}
                <SummaryCards summary={summary} loading={loadingSummary} />
                <div className="dashboard-content">
                    <div className="dashboard-left">
                        <ExpensesChart
                            summary={summary}
                            categories={categories}
                            loading={loadingSummary}
                        />
                    </div>

                    <div className="dashboard-right">
                        <TransactionsList
                            transactions={transactions}
                            loading={loadingTransactions}
                            onEdit={handleEditTransaction}
                            onDuplicate={handleDuplicateTransaction}
                            setTransactions={setTransactions}
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            setSummary={setSummary}
                            setLoadingSummary={setLoadingSummary}
                            refreshMonths={refreshMonths}
                        />
                    </div>
                </div>
                <AddTransactionButton onClick={handleAddTransaction} />
                {showModal && (
                    <TransactionModal
                        categories={categories}
                        setCategories={setCategories}
                        onClose={() => setShowModal(false)}
                        transaction={
                            editingTransaction || duplicatingTransaction
                        }
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        setTransactions={setTransactions}
                        onSaved={handleTransactionSaved}
                    />
                )}
            </div>
        </>
    );
};

export default Dashboard;
