import { useState } from 'react';
import { cropApi } from '../../api';
import FeatureForm, { FormSection, FormField, FormRow } from '../../components/FeatureForm';

export default function CropRecommender() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        city: '', state: '', lat: '', lon: '',
        soilType: '', ph: '', nitrogen: '', phosphorus: '', potassium: '',
        season: '', landArea: '', waterAvailability: '', irrigationType: '',
    });

    const update = (key: string, val: string) => setForm({ ...form, [key]: val });

    const handleSubmit = async () => {
        const res = await cropApi.recommend({
            location: { city: form.city, state: form.state, lat: form.lat ? +form.lat : undefined, lon: form.lon ? +form.lon : undefined },
            soil: { type: form.soilType, ph: form.ph ? +form.ph : undefined, nitrogen: form.nitrogen ? +form.nitrogen : undefined, phosphorus: form.phosphorus ? +form.phosphorus : undefined, potassium: form.potassium ? +form.potassium : undefined },
            season: form.season || undefined,
            landArea: form.landArea || undefined,
            waterAvailability: form.waterAvailability || undefined,
            irrigationType: form.irrigationType || undefined,
        });
        setResult(res.data);
    };

    return (
        <FeatureForm
            title="Crop Recommender"
            subtitle="Get AI suggestions on the best crops for your land"
            icon="🌱"
            onSubmit={handleSubmit}
            result={result}
            renderResult={(data) => (
                <>
                    {data.recommendations?.map((crop: any) => (
                        <div className="result-card" key={crop.rank}>
                            <h3>#{crop.rank} {crop.cropName} ({crop.cropNameHindi})</h3>
                            <p><span className="result-tag tag-green">Score: {crop.suitabilityScore}%</span> <span className="result-tag tag-blue">{crop.season}</span> <span className="result-tag tag-yellow">{crop.growingDuration}</span></p>
                            <ul className="result-list">{crop.reasonsToGrow?.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
                            <p>💧 Water: {crop.waterRequirement}</p>
                            <p>📦 Yield: {crop.estimatedYield}</p>
                            <p>🌱 Sow: {crop.sowingMonth} → 🌾 Harvest: {crop.harvestMonth}</p>
                        </div>
                    ))}
                    {data.soilAnalysis && <div className="result-card"><h3>🔬 Soil Analysis</h3><p>{data.soilAnalysis}</p></div>}
                    {data.generalAdvice && <div className="result-card"><h3>💡 Advice</h3><p>{data.generalAdvice}</p></div>}
                </>
            )}
        >
            <FormSection title="📍 Location">
                <FormRow>
                    <FormField label="City / Village"><input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Lucknow" /></FormField>
                    <FormField label="State"><input value={form.state} onChange={e => update('state', e.target.value)} placeholder="e.g. Uttar Pradesh" required /></FormField>
                </FormRow>
            </FormSection>

            <FormSection title="🧪 Soil Data">
                <FormRow>
                    <FormField label="Soil Type *"><input value={form.soilType} onChange={e => update('soilType', e.target.value)} placeholder="e.g. Alluvial, Black, Red" required /></FormField>
                    <FormField label="Soil pH"><input type="number" step="0.1" value={form.ph} onChange={e => update('ph', e.target.value)} placeholder="e.g. 6.8" /></FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Nitrogen (kg/ha)"><input type="number" value={form.nitrogen} onChange={e => update('nitrogen', e.target.value)} placeholder="e.g. 240" /></FormField>
                    <FormField label="Phosphorus (kg/ha)"><input type="number" value={form.phosphorus} onChange={e => update('phosphorus', e.target.value)} placeholder="e.g. 18" /></FormField>
                </FormRow>
            </FormSection>

            <FormSection title="🌦️ Season & Water">
                <FormRow>
                    <FormField label="Season">
                        <select value={form.season} onChange={e => update('season', e.target.value)}>
                            <option value="">Select season</option>
                            <option>Kharif</option><option>Rabi</option><option>Zaid</option>
                        </select>
                    </FormField>
                    <FormField label="Land Area"><input value={form.landArea} onChange={e => update('landArea', e.target.value)} placeholder="e.g. 5 acres" /></FormField>
                </FormRow>
            </FormSection>
        </FeatureForm>
    );
}
