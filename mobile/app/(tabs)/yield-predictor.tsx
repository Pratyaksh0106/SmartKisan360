import { useState } from 'react';
import { View, Text } from 'react-native';
import { yieldApi } from '../../src/api';
import FeatureForm, {
    FormSection, FormField, FormRow,
    ResultCard, ResultCardTitle, ResultCardText, ResultTag,
} from '../../src/components/FeatureForm';
import AppInput from '../../src/components/AppInput';
import AppPicker from '../../src/components/AppPicker';
import LocationPicker from '../../src/components/LocationPicker';
import { getCurrentSeason } from '../../src/utils/season';

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
        <FeatureForm
            title="Yield Predictor"
            subtitle="Predict expected crop yield and get optimization tips"
            icon="📊"
            onSubmit={handleSubmit}
            result={result}
            renderResult={(data) => (
                <>
                    {data.yieldPrediction && (
                        <ResultCard>
                            <ResultCardTitle>📊 {data.yieldPrediction.cropName} — Yield Prediction</ResultCardTitle>
                            <ResultTag color="green">Expected: {data.yieldPrediction.predictedYield?.expected}</ResultTag>
                            <ResultCardText>Min: {data.yieldPrediction.predictedYield?.minimum} | Max: {data.yieldPrediction.predictedYield?.maximum}</ResultCardText>
                            <ResultCardText>Confidence: {data.yieldPrediction.confidenceLevel}</ResultCardText>
                            <ResultCardText>State Avg: {data.yieldPrediction.stateAverage} | National Avg: {data.yieldPrediction.nationalAverage}</ResultCardText>
                        </ResultCard>
                    )}
                    {data.yieldBoostTips && (
                        <ResultCard>
                            <ResultCardTitle>🚀 Yield Boost Tips</ResultCardTitle>
                            {data.yieldBoostTips.map((t: any, i: number) => (
                                <View key={i} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                                    <ResultCardText>✦ {t.tip} — </ResultCardText>
                                    <ResultTag color="green">{t.potentialIncrease}</ResultTag>
                                </View>
                            ))}
                        </ResultCard>
                    )}
                    {data.fertilizerRecommendation && (
                        <ResultCard>
                            <ResultCardTitle>🧪 Fertilizer Plan</ResultCardTitle>
                            <ResultCardText>N: {data.fertilizerRecommendation.nitrogen} | P: {data.fertilizerRecommendation.phosphorus} | K: {data.fertilizerRecommendation.potassium}</ResultCardText>
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
                            <AppInput value={form.cropName} onChangeText={(v) => update('cropName', v)} placeholder="e.g. Wheat" />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Variety">
                            <AppInput value={form.variety} onChangeText={(v) => update('variety', v)} placeholder="e.g. HD-2967" />
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

            <FormSection title="🧪 Soil">
                <FormRow>
                    <View style={{ flex: 1 }}>
                        <FormField label="Soil Type *">
                            <AppInput value={form.soilType} onChangeText={(v) => update('soilType', v)} />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Season">
                            <AppPicker
                                selectedValue={form.season}
                                onValueChange={(v) => update('season', v)}
                                items={[
                                    { label: 'Select', value: '' },
                                    { label: 'Kharif', value: 'Kharif' },
                                    { label: 'Rabi', value: 'Rabi' },
                                    { label: 'Zaid', value: 'Zaid' },
                                ]}
                                placeholder="Select season"
                            />
                        </FormField>
                    </View>
                </FormRow>
            </FormSection>
        </FeatureForm>
    );
}
