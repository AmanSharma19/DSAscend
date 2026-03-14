import React, { useState } from 'react';
import './AuthModal.css';
import { X, Lock, Mail, User } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLogin, initialType }) => {
    const [isLogin, setIsLogin] = useState(initialType === 'login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Update modal type and clear state if props change while closing/opening
    React.useEffect(() => {
        setIsLogin(initialType === 'login');
        setError('');
        if (!isOpen) {
            setName('');
            setEmail('');
            setPassword('');
        }
    }, [initialType, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && name.trim() === '') {
            setError('Full name is required.');
            return;
        }

        if (email.trim() === '') {
            setError('Email address is required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.trim() === '') {
            setError('Password is required.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin ? { email, password } : { username: name, email, password };
            
            // Note: In production you'd use an environment variable for the base URL
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Save token to localStorage
            localStorage.setItem('token', data.token);
            
            // Trigger parent login handler
            onLogin(data.user);
            
            // Clear fields
            setEmail('');
            setPassword('');
            setName('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>
                <div className="modal-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Log in to save your visualized algorithms.' : 'Sign up to unlock custom dashboard features.'}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe" 
                                    required={!isLogin} 
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                required 
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message" style={{ 
                            color: '#ef4444', 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                            padding: '10px', 
                            borderRadius: '6px',
                            marginTop: '12px', 
                            fontSize: '0.85rem', 
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn success full-width" style={{ marginTop: '16px', padding: '12px' }}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="toggle-link" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
