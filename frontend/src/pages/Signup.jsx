import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import { signup as apiSignup } from "../services/api";
import "../assets/auth.css";

const Signup = () => {
    const navigate = useNavigate();
    const { token, setToken } = useContext(AuthContext);

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Se l’utente è già loggato, reindirizza subito
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
            const res = await apiSignup(form);
            const token = res.data.token;
            setToken(token);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Errore nella registrazione"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup">
            <h2>
                Crea il tuo account su
                <div className="home-logo">Budgetly!</div>
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
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
                    {loading ? "Registrazione in corso..." : "Registrati"}
                </button>
            </form>

            <p className="text-center mt-3">
                Hai già un account?{" "}
                <Link to="/login" className="link-login">
                    Accedi
                </Link>
            </p>
        </div>
    );
};

export default Signup;
