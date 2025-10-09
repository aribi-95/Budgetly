import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import "../dashboard.css";

const Dashboard = () => {
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
    };

    return (
        <div className="text-center">
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            <h1>Benvenuto su Budgetly!</h1>
        </div>
    );
};

export default Dashboard;
