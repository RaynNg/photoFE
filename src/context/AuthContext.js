import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import models from '../modelData/models';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);  // parse JSON
                if (userObj && userObj._id) {
                    models.userModel(userObj._id)
                        .then(user => {
                            setCurrentUser(user);
                        })
                        .catch(() => {
                            localStorage.removeItem('user');
                            setCurrentUser(null);
                        })
                        .finally(() => setLoading(false));
                } else {
                    setLoading(false);
                }
            } catch {
                localStorage.removeItem('user');
                setCurrentUser(null);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (userId) => {
        try {
            const user = await models.userModel(userId);
            if (user) {
                setCurrentUser(user);
                localStorage.setItem("advancedFeaturesEnabled", false);
                localStorage.setItem('user', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.clear();
        navigate('/login');
    };

    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
