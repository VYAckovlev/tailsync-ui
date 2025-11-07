import { createContext, useContext } from "react";
import { useAuthLogic } from "./hooks/useAuthLogic";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const authLogic = useAuthLogic();

    return (
        <AuthContext.Provider value={authLogic}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};