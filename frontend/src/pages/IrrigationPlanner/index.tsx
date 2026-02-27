import { useState } from 'react';
import { irrigationApi } from '../../api';
import FeatureForm, { FormSection, FormField, FormRow } from '../../components/FeatureForm';

export default function IrrigationPlanner() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        cropName: '', growthStage: '', sowingDate: '',
        city: '', state: '',
        soilType: '', ph: '',
        season: '', landArea: '',
        waterType: '', waterAvailability: '',
    });

    const update = (key: string, val: string) => setForm({ ...form, [key]: val });

    const handleSubmit = async () => {
        const res = await irrigationApi.plan({
            crop: { name: form.cropName, growthStage: form.growthStage || undefined, sowingDate: form.sowingDate || undefined },
            location: { city: form.city, state: form.state },
            soil: { type: form.soilType, ph: form.ph ? +form.ph : undefined },
            season: form.season || undefined,
            landArea: form.landArea || undefined,
            waterSource: { type: form.waterType || undefined, availability: form.waterAvailability || undefined },
        });
        setResult(res.data);
    };

    return (
        <FeatureForm title="Irrigation Planner" subtitle="Get a week-by-week irrigation schedule for your crop" icon="💧" onSubmit={handleSubmit} result={result}
            renderResult={(data) => (
                <>
                    {data.irrigationPlan && (
                        <div className="result-card">
                            <h3>💧 {data.irrigationPlan.cropName} — Irrigation Plan</h3>
                            <p>Total Water: {data.irrigationPlan.totalWaterRequired}</p>
                            <p>Method: {data.irrigationPlan.irrigationMethod}</p>
                            {data.irrigationPlan.schedule?.map((s: any, i: number) => (
                                <div key={i} style={{ padding: '0.5rem 0', borderTop: '1px solid rgba(51,65,85,0.3)' }}>
                                    <p><strong>{s.stage}</strong> ({s.weekRange}) — Days {s.daysFromSowing}</p>
                                    <p>💧 {s.waterPerIrrigation} × {s.frequencyPerWeek}/week</p>
                                    {s.criticalNotes && <p style={{ color: '#facc15' }}>⚠️ {s.criticalNotes}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                    {data.waterSavingTips && <div className="result-card"><h3>💡 Water Saving Tips</h3><ul className="result-list">{data.waterSavingTips.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul></div>}
                    {data.seasonalAdvice && <div className="result-card"><h3>🌦️ Seasonal Advice</h3><p>{data.seasonalAdvice}</p></div>}
                </>
            )}
        >
            <FormSection title="🌾 Crop">
                <FormRow>
                    <FormField label="Crop Name *"><input value={form.cropName} onChange={e => update('cropName', e.target.value)} placeholder="e.g. Rice" required /></FormField>
                    <FormField label="Growth Stage"><input value={form.growthStage} onChange={e => update('growthStage', e.target.value)} placeholder="e.g. Vegetative" /></FormField>
                </FormRow>
            </FormSection>
            <FormSection title="📍 Location">
                <FormRow>
                    <FormField label="City *"><input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Lucknow" required /></FormField>
                    <FormField label="State *"><input value={form.state} onChange={e => update('state', e.target.value)} placeholder="e.g. Uttar Pradesh" required /></FormField>
                </FormRow>
            </FormSection>
            <FormSection title="🧪 Soil">
                <FormRow>
                    <FormField label="Soil Type *"><input value={form.soilType} onChange={e => update('soilType', e.target.value)} placeholder="e.g. Alluvial" required /></FormField>
                    <FormField label="Season"><select value={form.season} onChange={e => update('season', e.target.value)}><option value="">Select</option><option>Kharif</option><option>Rabi</option><option>Zaid</option></select></FormField>
                </FormRow>
            </FormSection>
        </FeatureForm>
    );
}
