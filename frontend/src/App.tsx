import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { SignIn, SignUp, ForgotPassword } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CropRecommender from './pages/CropRecommender';
import IrrigationPlanner from './pages/IrrigationPlanner';
import YieldPredictor from './pages/YieldPredictor';
import PriceForecaster from './pages/PriceForecaster';
import RiskAnalyzer from './pages/RiskAnalyzer';

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}

export default function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p>Loading Smart Kisaan...</p>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/crop-recommender" element={<ProtectedRoute><AppLayout><CropRecommender /></AppLayout></ProtectedRoute>} />
            <Route path="/irrigation-planner" element={<ProtectedRoute><AppLayout><IrrigationPlanner /></AppLayout></ProtectedRoute>} />
            <Route path="/yield-predictor" element={<ProtectedRoute><AppLayout><YieldPredictor /></AppLayout></ProtectedRoute>} />
            <Route path="/price-forecaster" element={<ProtectedRoute><AppLayout><PriceForecaster /></AppLayout></ProtectedRoute>} />
            <Route path="/risk-analyzer" element={<ProtectedRoute><AppLayout><RiskAnalyzer /></AppLayout></ProtectedRoute>} />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/signin'} />} />
        </Routes>
    );
}
