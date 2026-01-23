import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import '../../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            setLoading(true);
            setError('');
            await signup(email, password);
            Swal.fire({
                title: 'Registration Initiated!',
                text: 'Please check your email for a confirmation link (if enabled in Supabase) or try logging in if you have auto-confirm enabled.',
                icon: 'success',
                confirmButtonColor: '#D4AF37',
                background: '#111',
                color: '#fff'
            });
        } catch (err) {
            console.error("Registration error:", err);
            setError('Registration failed: ' + err.message);
        }
        setLoading(false);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error("Login error:", err);
            if (err.message === 'Email not confirmed') {
                setError('Please confirm your email address. Check your inbox for the confirmation link from Supabase.');
            } else if (err.status === 400) {
                setError('Invalid login credentials. Please check your email and password.');
            } else {
                setError('Login failed: ' + err.message);
            }
        }

        setLoading(false);
    }

    return (
        <div className="login-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card"
            >
                <h2 className="login-title">Atelier Access</h2>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            className="login-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter admin email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter secure password"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="login-btn"
                    >
                        {loading ? 'Accessing...' : 'Enter Studio'}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <p style={{ marginBottom: '10px', color: '#888' }}>First time setting up?</p>
                    <button
                        type="button"
                        onClick={handleRegister}
                        style={{
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '1px solid #D4AF37',
                            color: '#D4AF37',
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            marginTop: '5px'
                        }}
                    >
                        Register as Admin
                    </button>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                        Note: You must have Auth enabled in Supabase.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
