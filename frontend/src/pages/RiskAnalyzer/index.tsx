import { useState } from 'react';
import { riskApi } from '../../api';
import FeatureForm, { FormSection, FormField, FormRow } from '../../components/FeatureForm';

export default function RiskAnalyzer() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        cropName: '', growthStage: '', investmentSoFar: '',
        city: '', state: '',
        soilType: '', ph: '',
        season: '', landArea: '',
        irrigationType: '', insurance: '',
        concerns: '',
    });

    const update = (key: string, val: string) => setForm({ ...form, [key]: val });

    const handleSubmit = async () => {
        const res = await riskApi.analyze({
            crop: { name: form.cropName, growthStage: form.growthStage || undefined, investmentSoFar: form.investmentSoFar || undefined },
            location: { city: form.city, state: form.state },
            soil: { type: form.soilType, ph: form.ph ? +form.ph : undefined },
            season: form.season || undefined,
            landArea: form.landArea || undefined,
            farmingPractices: { irrigationType: form.irrigationType || undefined, insurance: form.insurance || undefined },
            concerns: form.concerns ? form.concerns.split(',').map(c => c.trim()) : undefined,
        });
        setResult(res.data);
    };

    const severityColor = (s: string) => s === 'critical' || s === 'high' ? 'tag-red' : s === 'medium' ? 'tag-yellow' : 'tag-green';

    return (
        <FeatureForm title="Risk Analyzer" subtitle="Analyze all potential risks with mitigation strategies" icon="⚠️" onSubmit={handleSubmit} result={result}
            renderResult={(data) => (
                <>
                    {data.riskAssessment && (
                        <div className="result-card">
                            <h3>⚠️ Overall Risk: <span className={`result-tag ${severityColor(data.riskAssessment.overallRiskLevel)}`}>{data.riskAssessment.overallRiskLevel?.toUpperCase()}</span></h3>
                            <p>Risk Score: {data.riskAssessment.riskScore}/100</p>
                        </div>
                    )}
                    {data.risks?.map((risk: any, i: number) => (
                        <div className="result-card" key={i}>
                            <h3>{risk.riskName} <span className={`result-tag ${severityColor(risk.severity)}`}>{risk.severity}</span> <span className="result-tag tag-blue">{risk.category}</span></h3>
                            <p>{risk.description}</p>
                            {risk.earlyWarningSigns && <><p style={{ color: '#facc15' }}><strong>⚡ Warning Signs:</strong></p><ul className="result-list">{risk.earlyWarningSigns.map((s: string, j: number) => <li key={j}>{s}</li>)}</ul></>}
                            {risk.mitigation && <><p style={{ color: '#4ade80' }}><strong>🛡️ Mitigation:</strong></p>{risk.mitigation.map((m: any, j: number) => <p key={j}>→ {m.action} (Cost: {m.cost}, Effect: {m.effectiveness})</p>)}</>}
                        </div>
                    ))}
                    {data.insuranceAdvice && <div className="result-card"><h3>🛡️ Insurance Advice</h3><p><strong>Scheme:</strong> {data.insuranceAdvice.scheme}</p><p>{data.insuranceAdvice.coverage}</p><p>Premium: {data.insuranceAdvice.premium}</p></div>}
                    {data.generalAdvice && <div className="result-card"><h3>💡 Advice</h3><p>{data.generalAdvice}</p></div>}
                </>
            )}
        >
            <FormSection title="🌾 Crop">
                <FormRow>
                    <FormField label="Crop Name *"><input value={form.cropName} onChange={e => update('cropName', e.target.value)} placeholder="e.g. Cotton" required /></FormField>
                    <FormField label="Growth Stage"><input value={form.growthStage} onChange={e => update('growthStage', e.target.value)} placeholder="e.g. Flowering" /></FormField>
                </FormRow>
                <FormField label="Investment So Far (₹)"><input value={form.investmentSoFar} onChange={e => update('investmentSoFar', e.target.value)} placeholder="e.g. 45000" /></FormField>
            </FormSection>
            <FormSection title="📍 Location">
                <FormRow>
                    <FormField label="City *"><input value={form.city} onChange={e => update('city', e.target.value)} required /></FormField>
                    <FormField label="State *"><input value={form.state} onChange={e => update('state', e.target.value)} required /></FormField>
                </FormRow>
            </FormSection>
            <FormSection title="🧪 Soil & Season">
                <FormRow>
                    <FormField label="Soil Type *"><input value={form.soilType} onChange={e => update('soilType', e.target.value)} required /></FormField>
                    <FormField label="Season"><select value={form.season} onChange={e => update('season', e.target.value)}><option value="">Select</option><option>Kharif</option><option>Rabi</option><option>Zaid</option></select></FormField>
                </FormRow>
            </FormSection>
            <FormSection title="🔍 Concerns">
                <FormField label="Specific Concerns (comma-separated)">
                    <textarea value={form.concerns} onChange={e => update('concerns', e.target.value)} placeholder="e.g. Pink bollworm attack last year, Irregular rainfall" rows={3} />
                </FormField>
            </FormSection>
        </FeatureForm>
    );
}
