import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const features = [
    {
        path: '/crop-recommender',
        icon: '🌱',
        title: 'Crop Recommender',
        description: 'Get AI suggestions on the best crops to grow based on your soil, weather, and location.',
        color: '#22c55e',
    },
    {
        path: '/irrigation-planner',
        icon: '💧',
        title: 'Irrigation Planner',
        description: 'Plan your irrigation schedule with week-by-week water management advice.',
        color: '#3b82f6',
    },
    {
        path: '/yield-predictor',
        icon: '📊',
        title: 'Yield Predictor',
        description: 'Predict your expected crop yield and get tips to maximize production.',
        color: '#f59e0b',
    },
    {
        path: '/price-forecaster',
        icon: '💰',
        title: 'Price Forecaster',
        description: 'Forecast crop prices, find MSP info, and plan when to sell for maximum profit.',
        color: '#8b5cf6',
    },
    {
        path: '/risk-analyzer',
        icon: '⚠️',
        title: 'Risk Analyzer',
        description: 'Analyze pest, weather, market, and financial risks with mitigation strategies.',
        color: '#ef4444',
    },
];

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <div className="dashboard-hero">
                <h1>Namaste, {user?.name?.split(' ')[0]}! 🙏</h1>
                <p>Your AI-powered farming assistant is ready to help. Choose a feature below.</p>
            </div>

            <div className="features-grid">
                {features.map((f) => (
                    <Link to={f.path} key={f.path} className="feature-card" style={{ '--accent': f.color } as any}>
                        <span className="card-icon">{f.icon}</span>
                        <h3>{f.title}</h3>
                        <p>{f.description}</p>
                        <span className="card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
