import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
        try {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        } catch (e) {
            console.error("Failed to parse stored user or token", e);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
        }
    }
  }, []);

  const register = async (email, password, role = 'admin') => {
    try {
        const response = await authAPI.registerUser(email, password, role);
        const { token: receivedToken, _id, email: userEmail, role: userRole } = response.data;

        localStorage.setItem('jwtToken', receivedToken);
        localStorage.setItem('user', JSON.stringify({ _id, email: userEmail, role: userRole }));

        setToken(receivedToken);
        setUser({ _id, email: userEmail, role: userRole });

        navigate('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Registration failed:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
        const response = await authAPI.loginUser(email, password);
        const { token: receivedToken, _id, email: userEmail, role } = response.data;

        localStorage.setItem('jwtToken', receivedToken);
        localStorage.setItem('user', JSON.stringify({ _id, email: userEmail, role }));

        setToken(receivedToken);
        setUser({ _id, email: userEmail, role });

        navigate('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // The value provided by the context to consuming components
  const authContextValue = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user, // Helper to check if user is logged in
    isAdmin: user && user.role === 'admin' // Helper to check if user is admin
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook to consume the context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};