import { useState } from 'react';
import { View, Text } from 'react-native';
import { irrigationApi } from '../../src/api';
import FeatureForm, {
    FormSection, FormField, FormRow,
    ResultCard, ResultCardTitle, ResultCardText, ResultTag, ResultList,
} from '../../src/components/FeatureForm';
import AppInput from '../../src/components/AppInput';
import AppPicker from '../../src/components/AppPicker';
import LocationPicker from '../../src/components/LocationPicker';
import { Colors } from '../../src/constants/theme';
import { getCurrentSeason } from '../../src/utils/season';

export default function IrrigationPlanner() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        cropName: '', growthStage: '', sowingDate: '',
        city: '', state: '',
        soilType: '', ph: '',
        season: getCurrentSeason(), landArea: '',
        waterType: '', waterAvailability: '',
    });

    const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

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
        <FeatureForm
            title="Irrigation Planner"
            subtitle="Get a week-by-week irrigation schedule for your crop"
            icon="💧"
            onSubmit={handleSubmit}
            result={result}
            renderResult={(data) => (
                <>
                    {data.irrigationPlan && (
                        <ResultCard>
                            <ResultCardTitle>💧 {data.irrigationPlan.cropName} — Irrigation Plan</ResultCardTitle>
                            <ResultCardText>Total Water: {data.irrigationPlan.totalWaterRequired}</ResultCardText>
                            <ResultCardText>Method: {data.irrigationPlan.irrigationMethod}</ResultCardText>
                            {data.irrigationPlan.schedule?.map((s: any, i: number) => (
                                <View key={i} style={{ paddingVertical: 8, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: 'rgba(51,65,85,0.3)' }}>
                                    <ResultCardText style={{ fontWeight: '600', color: Colors.textPrimary }}>
                                        {s.stage} ({s.weekRange}) — Days {s.daysFromSowing}
                                    </ResultCardText>
                                    <ResultCardText>💧 {s.waterPerIrrigation} × {s.frequencyPerWeek}/week</ResultCardText>
                                    {s.criticalNotes && (
                                        <ResultCardText style={{ color: Colors.yellowLight }}>⚠️ {s.criticalNotes}</ResultCardText>
                                    )}
                                </View>
                            ))}
                        </ResultCard>
                    )}
                    {data.waterSavingTips && (
                        <ResultCard>
                            <ResultCardTitle>💡 Water Saving Tips</ResultCardTitle>
                            <ResultList items={data.waterSavingTips} />
                        </ResultCard>
                    )}
                    {data.seasonalAdvice && (
                        <ResultCard>
                            <ResultCardTitle>🌦️ Seasonal Advice</ResultCardTitle>
                            <ResultCardText>{data.seasonalAdvice}</ResultCardText>
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
                        <FormField label="Growth Stage">
                            <AppInput value={form.growthStage} onChangeText={(v) => update('growthStage', v)} placeholder="e.g. Vegetative" />
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
                            <AppInput value={form.soilType} onChangeText={(v) => update('soilType', v)} placeholder="e.g. Alluvial" />
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
