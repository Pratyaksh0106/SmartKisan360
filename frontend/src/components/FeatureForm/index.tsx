import { useState, ReactNode } from 'react';
import './FeatureForm.css';

interface FeatureFormProps {
    title: string;
    subtitle: string;
    icon: string;
    children: ReactNode;
    onSubmit: () => Promise<void>;
    result: any;
    renderResult: (data: any) => ReactNode;
}

export default function FeatureForm({ title, subtitle, icon, children, onSubmit, result, renderResult }: FeatureFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onSubmit();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feature-page">
            <div className="feature-header">
                <span className="feature-icon">{icon}</span>
                <div>
                    <h1>{title}</h1>
                    <p className="feature-subtitle">{subtitle}</p>
                </div>
            </div>

            <div className="feature-content">
                <form className="feature-form" onSubmit={handleSubmit}>
                    {children}

                    {error && <div className="form-error">{error}</div>}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-small" />
                                Analyzing with AI...
                            </>
                        ) : (
                            <>🤖 Get AI Recommendation</>
                        )}
                    </button>
                </form>

                {result && (
                    <div className="feature-result">
                        <h2>📋 AI Analysis Results</h2>
                        {renderResult(result)}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Reusable form field components ──────────────────────────────────────────
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <fieldset className="form-section">
            <legend>{title}</legend>
            {children}
        </fieldset>
    );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="form-field">
            <label>{label}</label>
            {children}
        </div>
    );
}

export function FormRow({ children }: { children: ReactNode }) {
    return <div className="form-row">{children}</div>;
}
