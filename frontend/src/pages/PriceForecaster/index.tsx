import { useState } from 'react';
import { priceApi } from '../../api';
import FeatureForm, { FormSection, FormField, FormRow } from '../../components/FeatureForm';
import LocationPicker from '../../components/LocationPicker';
import { getCurrentSeason, getSeasonLabel } from '../../utils/season';

export default function PriceForecaster() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        cropName: '', variety: '', quality: '',
        city: '', state: '',
        season: getCurrentSeason(), quantity: '', harvestDate: '', storageAvailable: '',
    });

    const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = async () => {
        const res = await priceApi.forecast({
            crop: { name: form.cropName, variety: form.variety || undefined, quality: form.quality || undefined },
            location: { city: form.city, state: form.state },
            season: form.season || undefined,
            quantity: form.quantity || undefined,
            harvestDate: form.harvestDate || undefined,
            storageAvailable: form.storageAvailable || undefined,
        });
        setResult(res.data);
    };

    return (
        <FeatureForm title="Price Forecaster" subtitle="Forecast prices, find MSP info, and plan when to sell" icon="💰" onSubmit={handleSubmit} result={result}
            renderResult={(data) => (
                <>
                    {data.priceForcast && (
                        <div className="result-card">
                            <h3>💰 {data.priceForcast.cropName} — Price Forecast</h3>
                            <p><span className="result-tag tag-green">MSP: {data.priceForcast.msp}</span></p>
                            <p>Current: {data.priceForcast.currentEstimatedPrice}</p>
                            {data.priceForcast.shortTermForecast && <p>Short Term ({data.priceForcast.shortTermForecast.period}): {data.priceForcast.shortTermForecast.priceRange} — <span className="result-tag tag-blue">{data.priceForcast.shortTermForecast.trend} ↗</span></p>}
                            {data.priceForcast.mediumTermForecast && <p>Medium Term ({data.priceForcast.mediumTermForecast.period}): {data.priceForcast.mediumTermForecast.priceRange} — <span className="result-tag tag-yellow">{data.priceForcast.mediumTermForecast.trend}</span></p>}
                        </div>
                    )}
                    {data.sellingStrategy && <div className="result-card"><h3>📈 Selling Strategy</h3><p><strong>Best Time:</strong> {data.sellingStrategy.bestTimeToSell}</p><p>{data.sellingStrategy.reason}</p><p><strong>Recommendation:</strong> {data.sellingStrategy.holdRecommendation}</p></div>}
                    {data.profitEstimate && <div className="result-card"><h3>💵 Profit Estimate</h3><p>Revenue: {data.profitEstimate.estimatedRevenue}</p><p>Cost: {data.profitEstimate.estimatedCost}</p><p><span className="result-tag tag-green">Profit: {data.profitEstimate.estimatedProfit} ({data.profitEstimate.profitMargin})</span></p></div>}
                    {data.generalAdvice && <div className="result-card"><h3>💡 Advice</h3><p>{data.generalAdvice}</p></div>}
                </>
            )}
        >
            <FormSection title="🌾 Crop">
                <FormRow>
                    <FormField label="Crop Name *"><input value={form.cropName} onChange={e => update('cropName', e.target.value)} placeholder="e.g. Rice" required /></FormField>
                    <FormField label="Variety"><input value={form.variety} onChange={e => update('variety', e.target.value)} placeholder="e.g. Basmati" /></FormField>
                </FormRow>
                <FormRow>
                    <FormField label="Quality Grade"><input value={form.quality} onChange={e => update('quality', e.target.value)} placeholder="e.g. Grade A" /></FormField>
                    <FormField label="Quantity"><input value={form.quantity} onChange={e => update('quantity', e.target.value)} placeholder="e.g. 50 quintals" /></FormField>
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
            <FormSection title="📅 Timeline">
                <FormRow>
                    <FormField label="Harvest Date"><input type="date" value={form.harvestDate} onChange={e => update('harvestDate', e.target.value)} /></FormField>
                    <FormField label="Storage Available"><select value={form.storageAvailable} onChange={e => update('storageAvailable', e.target.value)}><option value="">Select</option><option>Yes - warehouse</option><option>Yes - limited</option><option>No storage</option></select></FormField>
                </FormRow>
            </FormSection>
        </FeatureForm>
    );
}
