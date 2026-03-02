import { useState } from 'react';
import { View, Text } from 'react-native';
import { cropApi } from '../../src/api';
import FeatureForm, {
    FormSection, FormField, FormRow,
    ResultCard, ResultCardTitle, ResultCardText, ResultTag, ResultList,
} from '../../src/components/FeatureForm';
import AppInput from '../../src/components/AppInput';
import AppPicker from '../../src/components/AppPicker';
import LocationPicker from '../../src/components/LocationPicker';
import SoilImagePicker from '../../src/components/SoilImagePicker';
import { getCurrentSeason } from '../../src/utils/season';

export default function CropRecommender() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        city: '', state: '', lat: '', lon: '',
        soilType: '', ph: '', nitrogen: '', phosphorus: '', potassium: '',
        season: getCurrentSeason(), landArea: '', waterAvailability: '', irrigationType: '',
    });

    const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSoilData = (data: any) => {
        setForm(prev => ({
            ...prev,
            soilType: data.soilType || prev.soilType,
            ph: data.ph ? String(data.ph) : prev.ph,
            nitrogen: data.nitrogen ? String(data.nitrogen) : prev.nitrogen,
            phosphorus: data.phosphorus ? String(data.phosphorus) : prev.phosphorus,
            potassium: data.potassium ? String(data.potassium) : prev.potassium,
        }));
    };

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
                        <ResultCard key={crop.rank}>
                            <ResultCardTitle>#{crop.rank} {crop.cropName} ({crop.cropNameHindi})</ResultCardTitle>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                                <ResultTag color="green">Score: {crop.suitabilityScore}%</ResultTag>
                                <ResultTag color="blue">{crop.season}</ResultTag>
                                <ResultTag color="yellow">{crop.growingDuration}</ResultTag>
                            </View>
                            <ResultList items={crop.reasonsToGrow} />
                            <ResultCardText>💧 Water: {crop.waterRequirement}</ResultCardText>
                            <ResultCardText>📦 Yield: {crop.estimatedYield}</ResultCardText>
                            <ResultCardText>🌱 Sow: {crop.sowingMonth} → 🌾 Harvest: {crop.harvestMonth}</ResultCardText>
                        </ResultCard>
                    ))}
                    {data.soilAnalysis && (
                        <ResultCard>
                            <ResultCardTitle>🔬 Soil Analysis</ResultCardTitle>
                            <ResultCardText>{data.soilAnalysis}</ResultCardText>
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
            <FormSection title="📍 Location">
                <LocationPicker
                    state={form.state}
                    city={form.city}
                    onStateChange={(v) => update('state', v)}
                    onCityChange={(v) => update('city', v)}
                />
            </FormSection>

            <FormSection title="🧪 Soil Data">
                <SoilImagePicker
                    onSoilDataDetected={handleSoilData}
                    location={{ city: form.city, state: form.state }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(51, 65, 85, 0.4)' }} />
                    <Text style={{ color: '#64748b', fontSize: 11 }}>or enter manually</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(51, 65, 85, 0.4)' }} />
                </View>

                <FormRow>
                    <View style={{ flex: 1 }}>
                        <FormField label="Soil Type *">
                            <AppInput value={form.soilType} onChangeText={(v) => update('soilType', v)} placeholder="e.g. Alluvial" />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Soil pH">
                            <AppInput value={form.ph} onChangeText={(v) => update('ph', v)} placeholder="e.g. 6.8" keyboardType="decimal-pad" />
                        </FormField>
                    </View>
                </FormRow>
                <FormRow>
                    <View style={{ flex: 1 }}>
                        <FormField label="Nitrogen (kg/ha)">
                            <AppInput value={form.nitrogen} onChangeText={(v) => update('nitrogen', v)} placeholder="e.g. 240" keyboardType="numeric" />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Phosphorus (kg/ha)">
                            <AppInput value={form.phosphorus} onChangeText={(v) => update('phosphorus', v)} placeholder="e.g. 18" keyboardType="numeric" />
                        </FormField>
                    </View>
                </FormRow>
            </FormSection>

            <FormSection title="🌦️ Season & Water">
                <FormRow>
                    <View style={{ flex: 1 }}>
                        <FormField label="Season">
                            <AppPicker
                                selectedValue={form.season}
                                onValueChange={(v) => update('season', v)}
                                items={[
                                    { label: 'Select season', value: '' },
                                    { label: 'Kharif', value: 'Kharif' },
                                    { label: 'Rabi', value: 'Rabi' },
                                    { label: 'Zaid', value: 'Zaid' },
                                ]}
                                placeholder="Select season"
                            />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Land Area">
                            <AppInput value={form.landArea} onChangeText={(v) => update('landArea', v)} placeholder="e.g. 5 acres" />
                        </FormField>
                    </View>
                </FormRow>
            </FormSection>
        </FeatureForm>
    );
}

