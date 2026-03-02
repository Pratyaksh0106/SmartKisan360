import { useState } from 'react';
import { View, Text } from 'react-native';
import { priceApi } from '../../src/api';
import FeatureForm, {
    FormSection, FormField, FormRow,
    ResultCard, ResultCardTitle, ResultCardText, ResultTag,
} from '../../src/components/FeatureForm';
import AppInput from '../../src/components/AppInput';
import AppPicker from '../../src/components/AppPicker';
import LocationPicker from '../../src/components/LocationPicker';
import { getCurrentSeason } from '../../src/utils/season';

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
        <FeatureForm
            title="Price Forecaster"
            subtitle="Forecast prices, find MSP info, and plan when to sell"
            icon="💰"
            onSubmit={handleSubmit}
            result={result}
            renderResult={(data) => (
                <>
                    {data.priceForcast && (
                        <ResultCard>
                            <ResultCardTitle>💰 {data.priceForcast.cropName} — Price Forecast</ResultCardTitle>
                            <ResultTag color="green">MSP: {data.priceForcast.msp}</ResultTag>
                            <ResultCardText>Current: {data.priceForcast.currentEstimatedPrice}</ResultCardText>
                            {data.priceForcast.shortTermForecast && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
                                    <ResultCardText>Short Term ({data.priceForcast.shortTermForecast.period}): {data.priceForcast.shortTermForecast.priceRange} — </ResultCardText>
                                    <ResultTag color="blue">{data.priceForcast.shortTermForecast.trend} ↗</ResultTag>
                                </View>
                            )}
                            {data.priceForcast.mediumTermForecast && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
                                    <ResultCardText>Medium Term ({data.priceForcast.mediumTermForecast.period}): {data.priceForcast.mediumTermForecast.priceRange} — </ResultCardText>
                                    <ResultTag color="yellow">{data.priceForcast.mediumTermForecast.trend}</ResultTag>
                                </View>
                            )}
                        </ResultCard>
                    )}
                    {data.sellingStrategy && (
                        <ResultCard>
                            <ResultCardTitle>📈 Selling Strategy</ResultCardTitle>
                            <ResultCardText style={{ fontWeight: '600' }}>Best Time: {data.sellingStrategy.bestTimeToSell}</ResultCardText>
                            <ResultCardText>{data.sellingStrategy.reason}</ResultCardText>
                            <ResultCardText style={{ fontWeight: '600', marginTop: 4 }}>Recommendation: {data.sellingStrategy.holdRecommendation}</ResultCardText>
                        </ResultCard>
                    )}
                    {data.profitEstimate && (
                        <ResultCard>
                            <ResultCardTitle>💵 Profit Estimate</ResultCardTitle>
                            <ResultCardText>Revenue: {data.profitEstimate.estimatedRevenue}</ResultCardText>
                            <ResultCardText>Cost: {data.profitEstimate.estimatedCost}</ResultCardText>
                            <View style={{ marginTop: 4 }}>
                                <ResultTag color="green">Profit: {data.profitEstimate.estimatedProfit} ({data.profitEstimate.profitMargin})</ResultTag>
                            </View>
                        </ResultCard>
                    )}
                    {data.generalAdvice && (
                        <ResultCard>
                            <ResultCardTitle>💡 Advice</ResultCardTitle>
                            <ResultCardText>{data.generalAdvice}</ResultCardText>
                        </ResultCard>
                    )}
                </>
            )}
        >
            <FormSection title="🌾 Crop">
                <FormRow>
                    <View style={{ flex: 1 }}>
                        <FormField label="Crop Name *">
                            <AppInput value={form.cropName} onChangeText={(v) => update('cropName', v)} placeholder="e.g. Rice" />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Variety">
                            <AppInput value={form.variety} onChangeText={(v) => update('variety', v)} placeholder="e.g. Basmati" />
                        </FormField>
                    </View>
                </FormRow>
                <FormRow>
                    <View style={{ flex: 1 }}>
                        <FormField label="Quality Grade">
                            <AppInput value={form.quality} onChangeText={(v) => update('quality', v)} placeholder="e.g. Grade A" />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Quantity">
                            <AppInput value={form.quantity} onChangeText={(v) => update('quantity', v)} placeholder="e.g. 50 quintals" />
                        </FormField>
                    </View>
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
                    <View style={{ flex: 1 }}>
                        <FormField label="Harvest Date">
                            <AppInput value={form.harvestDate} onChangeText={(v) => update('harvestDate', v)} placeholder="YYYY-MM-DD" />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Storage Available">
                            <AppPicker
                                selectedValue={form.storageAvailable}
                                onValueChange={(v) => update('storageAvailable', v)}
                                items={[
                                    { label: 'Select', value: '' },
                                    { label: 'Yes - warehouse', value: 'Yes - warehouse' },
                                    { label: 'Yes - limited', value: 'Yes - limited' },
                                    { label: 'No storage', value: 'No storage' },
                                ]}
                                placeholder="Select storage"
                            />
                        </FormField>
                    </View>
                </FormRow>
            </FormSection>
        </FeatureForm>
    );
}
