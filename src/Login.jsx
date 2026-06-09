// src/Login.jsx
import { useState } from 'react';
import { login } from './services/api';

function Login({ onLoginSuccess }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('shop');  // Default role
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(phone, password);
            if (result.success) {
                // Store role with user data
                const userData = {
                    ...result.user,
                    role: role
                };
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('auth_token', result.token || 'logged_in');
                localStorage.setItem('user_role', role);
                onLoginSuccess(userData);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to connect to server: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Smart Supply Chain Platform</h2>
            
            {/* Role Selection */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ marginBottom: '10px' }}>Login as:</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <label style={{ padding: '8px 16px', backgroundColor: role === 'shop' ? '#3b82f6' : '#e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="role" value="shop" checked={role === 'shop'} onChange={(e) => setRole(e.target.value)} style={{ display: 'none' }} />
                        🏪 Shop Owner
                    </label>
                    <label style={{ padding: '8px 16px', backgroundColor: role === 'driver' ? '#3b82f6' : '#e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="role" value="driver" checked={role === 'driver'} onChange={(e) => setRole(e.target.value)} style={{ display: 'none' }} />
                        🚚 Driver
                    </label>
                    <label style={{ padding: '8px 16px', backgroundColor: role === 'customer' ? '#3b82f6' : '#e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                        <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={(e) => setRole(e.target.value)} style={{ display: 'none' }} />
                        🛒 Customer
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08012345678"
                        style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;