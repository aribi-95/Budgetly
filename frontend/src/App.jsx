import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useMemo,
} from "react";
import { Outlet, Navigate } from "react-router-dom";

// Contesto di autenticazione
export const AuthContext = createContext({
    token: null,
    setToken: () => {},
});

const App = () => {
    // Inizializza il token leggendo da localStorage
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    // Sincronizza automaticamente localStorage quando il token cambia
    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
    }, [token]);

    // Evita ricreazioni inutili del valore del context
    const value = useMemo(() => ({ token, setToken }), [token]);

    return (
        <AuthContext.Provider value={value}>
            <Outlet />
        </AuthContext.Provider>
    );
};

// Rotta protetta: accesso consentito solo se esiste un token valido
export const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    if (!token) return <Navigate to="/login" replace />;
    return children;
};

export default App;
