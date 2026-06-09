// src/App.jsx
import { useState } from 'react';
import Login from './Login';
import ShopDashboard from './Dashboard';  // Your existing Dashboard (rename if needed)
import DriverDashboard from './DriverDashboard';  // We will create next
import CustomerDashboard from './CustomerDashboard';  // We will create next

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [role, setRole] = useState(() => {
        return localStorage.getItem('user_role') || 'shop';
    });

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setRole(userData.role || 'shop');
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
        setUser(null);
        setRole('shop');
    };

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // Show different dashboard based on role
    if (role === 'shop') {
        return <ShopDashboard user={user} onLogout={handleLogout} />;
    }

    if (role === 'driver') {
        return <DriverDashboard user={user} onLogout={handleLogout} />;
    }

    if (role === 'customer') {
        return <CustomerDashboard user={user} onLogout={handleLogout} />;
    }

    // Default fallback
    return <ShopDashboard user={user} onLogout={handleLogout} />;
}

export default App;