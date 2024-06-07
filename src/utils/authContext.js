
import { createContext, useContext, useState, useEffect } from "react";
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => 
{
    const [user, setUser] = useState(null);
    const navigation = Navigate();

    const authenticatedUser = (token) => {
        try {
            const decodedToken = jwt.decode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                setUser(decodedToken);
            } else {
                toast.error('Session Expired');
                localStorage.removeItem('token');
            }

        } catch (error) {
            console.error('Error decoding token', error);
            localStorage.removeItem('token');

        }

    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            authenticatedUser(storedToken);
        }
    }, []);

    useEffect(() => {
        console.log('user', user);
    })


    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigation.push('/login-register');
    };


    const contextValue = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
};