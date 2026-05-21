import { useState } from 'react';
import { login } from './services/api';

function Login({ onLoginSuccess }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(phone, password);
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('auth_token', result.token || 'logged_in');
                onLoginSuccess(result.user);
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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>StockWise SSA Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08012345678"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;