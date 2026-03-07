import { useState } from 'react';
import { yieldApi } from '../../api';
import FeatureForm, { FormSection, FormField, FormRow } from '../../components/FeatureForm';
import LocationPicker from '../../components/LocationPicker';
import { getCurrentSeason, getSeasonLabel } from '../../utils/season';

export default function YieldPredictor() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        cropName: '', variety: '', sowingDate: '',
        city: '', state: '',
        soilType: '', ph: '', nitrogen: '', phosphorus: '', potassium: '',
        season: getCurrentSeason(), landArea: '', irrigationType: '', previousCrop: '',
    });

    const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = async () => {
        const res = await yieldApi.predict({
            crop: { name: form.cropName, variety: form.variety || undefined, sowingDate: form.sowingDate || undefined },
            location: { city: form.city, state: form.state },
            soil: { type: form.soilType, ph: form.ph ? +form.ph : undefined, nitrogen: form.nitrogen ? +form.nitrogen : undefined, phosphorus: form.phosphorus ? +form.phosphorus : undefined, potassium: form.potassium ? +form.potassium : undefined },
            season: form.season || undefined,
            landArea: form.landArea || undefined,
            farmingPractices: { irrigationType: form.irrigationType || undefined, previousCrop: form.previousCrop || undefined },
        });
        setResult(res.data);
    };

    return (
        <FeatureForm title="Yield Predictor" subtitle="Predict expected crop yield and get optimization tips" icon="📊" onSubmit={handleSubmit} result={result}
            renderResult={(data) => (
                <>
                    {data.yieldPrediction && (
                        <div className="result-card">
                            <h3>📊 {data.yieldPrediction.cropName} — Yield Prediction</h3>
                            <p><span className="result-tag tag-green">Expected: {data.yieldPrediction.predictedYield?.expected}</span></p>
                            <p>Min: {data.yieldPrediction.predictedYield?.minimum} | Max: {data.yieldPrediction.predictedYield?.maximum}</p>
                            <p>Confidence: {data.yieldPrediction.confidenceLevel}</p>
                            <p>State Avg: {data.yieldPrediction.stateAverage} | National Avg: {data.yieldPrediction.nationalAverage}</p>
                        </div>
                    )}
                    {data.yieldBoostTips && <div className="result-card"><h3>🚀 Yield Boost Tips</h3>{data.yieldBoostTips.map((t: any, i: number) => <p key={i}>✦ {t.tip} — <span className="result-tag tag-green">{t.potentialIncrease}</span></p>)}</div>}
                    {data.fertilizerRecommendation && <div className="result-card"><h3>🧪 Fertilizer Plan</h3><p>N: {data.fertilizerRecommendation.nitrogen} | P: {data.fertilizerRecommendation.phosphorus} | K: {data.fertilizerRecommendation.potassium}</p></div>}
                    {data.generalAdvice && <div className="result-card"><h3>💡 Advice</h3><p>{data.generalAdvice}</p></div>}
                </>
            )}
        >
            <FormSection title="🌾 Crop">
                <FormRow>
                    <FormField label="Crop Name *"><input value={form.cropName} onChange={e => update('cropName', e.target.value)} placeholder="e.g. Wheat" required /></FormField>
                    <FormField label="Variety"><input value={form.variety} onChange={e => update('variety', e.target.value)} placeholder="e.g. HD-2967" /></FormField>
                </FormRow>
            </FormSection>
            <FormSection title="📍 Location">
                <LocationPicker
                    state={form.state}
                    city={form.city}
                    onStateChange={(v) => update('state', v)}
                    onCityChange={(v) => update('city', v)}
                />
            </FormSection>
            <FormSection title="🧪 Soil">
                <FormRow>
                    <FormField label="Soil Type *"><input value={form.soilType} onChange={e => update('soilType', e.target.value)} required /></FormField>
                    <FormField label={`Season (auto: ${getSeasonLabel()})`}>
                        <select value={form.season} onChange={e => update('season', e.target.value)}>
                            <option value="">Select</option>
                            <option>Kharif</option><option>Rabi</option><option>Zaid</option>
                        </select>
                    </FormField>
                </FormRow>
            </FormSection>
        </FeatureForm>
    );
}
