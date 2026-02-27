import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authApi.signIn({ email, password });
            signIn(res.data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span>🌾</span>
                    <h1>Smart Kisaan</h1>
                    <p>AI-Powered Farming Assistant</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <h2>Sign In</h2>

                    {error && <div className="auth-error">{error}</div>}

                    <div className="auth-field">
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="auth-links">
                        <Link to="/signup">Don't have an account? Sign Up</Link>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function SignUp() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'signup' | 'confirm'>('signup');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authApi.signUp(form);
            setUsername(res.data.username);
            setStep('confirm');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authApi.confirmSignUp({ username, confirmationCode: code });
            navigate('/signin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span>🌾</span>
                    <h1>Smart Kisaan</h1>
                    <p>AI-Powered Farming Assistant</p>
                </div>

                {step === 'signup' ? (
                    <form onSubmit={handleSignUp}>
                        <h2>Create Account</h2>
                        {error && <div className="auth-error">{error}</div>}

                        <div className="auth-field">
                            <label>Full Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rudransh Solanki" required />
                        </div>
                        <div className="auth-field">
                            <label>Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                        </div>
                        <div className="auth-field">
                            <label>Password</label>
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" required />
                        </div>
                        <div className="auth-field">
                            <label>Phone (optional)</label>
                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+919876543210" />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Creating...' : 'Sign Up'}
                        </button>

                        <div className="auth-links">
                            <Link to="/signin">Already have an account? Sign In</Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleConfirm}>
                        <h2>Verify Email</h2>
                        <p className="auth-info">We sent a verification code to <strong>{form.email}</strong></p>
                        {error && <div className="auth-error">{error}</div>}

                        <div className="auth-field">
                            <label>Verification Code</label>
                            <input value={code} onChange={e => setCode(e.target.value)} placeholder="123456" required />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authApi.forgotPassword({ email });
            setStep('reset');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authApi.resetPassword({ email, confirmationCode: code, newPassword });
            navigate('/signin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span>🌾</span>
                    <h1>Smart Kisaan</h1>
                </div>

                {step === 'request' ? (
                    <form onSubmit={handleRequest}>
                        <h2>Forgot Password</h2>
                        {error && <div className="auth-error">{error}</div>}
                        <div className="auth-field">
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                        <div className="auth-links"><Link to="/signin">Back to Sign In</Link></div>
                    </form>
                ) : (
                    <form onSubmit={handleReset}>
                        <h2>Reset Password</h2>
                        {error && <div className="auth-error">{error}</div>}
                        <div className="auth-field">
                            <label>Reset Code</label>
                            <input value={code} onChange={e => setCode(e.target.value)} required />
                        </div>
                        <div className="auth-field">
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
