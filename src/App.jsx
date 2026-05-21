// file: src/App.jsx
import { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
    // Check if user is already logged in (from localStorage)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        console.log('Saved user from localStorage:', savedUser);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // If no user is logged in, show the Login page
    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // If user is logged in, show the Dashboard
    return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;