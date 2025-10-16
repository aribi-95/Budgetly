import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

// Aggiungo token JWT a tutte le richieste
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Gestione errori
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token scaduto o non valido: logout automatico
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Auth
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);

// Transazioni
export const getTransactions = (month, year) =>
    api.get(`/transactions?month=${month}&year=${year}`);

export const getMonthsWithTransactions = () => api.get("/transactions/months");
export const getMonthlySummary = (month, year) =>
    api.get(`/transactions/summary?month=${month}&year=${year}`);
export const getYearTransactions = (year) =>
    api.get(`/transactions/year?year=${year}`);

export const addTransaction = (data) => api.post("/transactions", data);
export const updateTransaction = (id, data) =>
    api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// Categorie
export const getCategories = () => api.get("/categories");
export const addCategory = (data) => api.post("/categories", data);
export const deleteCategory = (name) => api.delete(`/categories/${name}`);

export default api;
