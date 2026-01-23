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
                text: 'A confirmation link has been sent to your email. Please check your inbox.',
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
                setError('Please confirm your email address. Check your inbox for the confirmation link.');
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

                {/* <div className="login-register-box">
                    <p className="register-text">First time setting up?</p>
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="register-btn"
                    >
                        Register as Admin
                    </button>

                </div> */}
            </motion.div>
        </div>
    );
};

export default Login;
