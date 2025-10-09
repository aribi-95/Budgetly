import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import { login as apiLogin } from "../services/api";
import "../auth.css";

const Login = () => {
    const navigate = useNavigate();
    const { token, setToken } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Se l’utente è già loggato, va direttamente alla dashboard
    useEffect(() => {
        if (token) navigate("/dashboard");
    }, [token, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await apiLogin(form);
            const token = res.data.token;
            setToken(token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Errore nel login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <h2>
                Benvenutə su
                <div className="logo">Budgetly!</div>
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Accesso in corso..." : "Accedi"}
                </button>
            </form>

            <p className="text-center mt-3">
                Non hai un account? <Link to="/signup">Registrati</Link>
            </p>
        </div>
    );
};

export default Login;
