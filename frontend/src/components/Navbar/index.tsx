import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/crop-recommender', label: 'Crop Advisor', icon: '🌱' },
    { path: '/irrigation-planner', label: 'Irrigation', icon: '💧' },
    { path: '/yield-predictor', label: 'Yield', icon: '📊' },
    { path: '/price-forecaster', label: 'Price', icon: '💰' },
    { path: '/risk-analyzer', label: 'Risk', icon: '⚠️' },
];

export default function Navbar() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/signin');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">
                    <span className="brand-icon">🌾</span>
                    <span className="brand-text">Smart Kisaan</span>
                </Link>
            </div>

            <div className="navbar-links">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        <span className="nav-label">{link.label}</span>
                    </Link>
                ))}
            </div>

            <div className="navbar-user">
                <span className="user-greeting">👋 {user?.name?.split(' ')[0]}</span>
                <button onClick={handleSignOut} className="btn-signout">Sign Out</button>
            </div>
        </nav>
    );
}
