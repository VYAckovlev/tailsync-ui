import { createContext, useState, useContext } from "react";
import { userApi } from "../services/userApi";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, setUser } = useContext(AuthContext);

    const updateName = async (name) => {
        setError(null);
        setLoading(true);

        try {
            const response = await userApi.updateName(name);

            if (setUser) {
                setUser(prevUser => ({ ...prevUser, name }));
            }

            return { success: true, message: response.message };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (old_password, new_password) => {
        setError(null);
        setLoading(true);

        try {
            const response = await userApi.updatePassword(old_password, new_password);
            return { success: true, message: response.message };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        loading,
        error,
        updateName,
        updatePassword
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};