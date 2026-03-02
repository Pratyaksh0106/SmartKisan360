import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { riskApi } from '../../src/api';
import FeatureForm, {
    FormSection, FormField, FormRow,
    ResultCard, ResultCardTitle, ResultCardText, ResultTag, ResultList,
} from '../../src/components/FeatureForm';
import AppInput from '../../src/components/AppInput';
import AppPicker from '../../src/components/AppPicker';
import LocationPicker from '../../src/components/LocationPicker';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { getCurrentSeason } from '../../src/utils/season';

export default function RiskAnalyzer() {
    const [result, setResult] = useState<any>(null);
    const [form, setForm] = useState({
        cropName: '', growthStage: '', investmentSoFar: '',
        city: '', state: '',
        soilType: '', ph: '',
        season: getCurrentSeason(), landArea: '',
        irrigationType: '', insurance: '',
        concerns: '',
    });

    const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    const severityColor = (s: string): 'green' | 'yellow' | 'red' =>
        s === 'critical' || s === 'high' ? 'red' : s === 'medium' ? 'yellow' : 'green';

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

    return (
        <FeatureForm
            title="Risk Analyzer"
            subtitle="Analyze all potential risks with mitigation strategies"
            icon="⚠️"
            onSubmit={handleSubmit}
            result={result}
            renderResult={(data) => (
                <>
                    {data.riskAssessment && (
                        <ResultCard>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                                <ResultCardTitle>⚠️ Overall Risk: </ResultCardTitle>
                                <ResultTag color={severityColor(data.riskAssessment.overallRiskLevel)}>
                                    {data.riskAssessment.overallRiskLevel?.toUpperCase()}
                                </ResultTag>
                            </View>
                            <ResultCardText>Risk Score: {data.riskAssessment.riskScore}/100</ResultCardText>
                        </ResultCard>
                    )}
                    {data.risks?.map((risk: any, i: number) => (
                        <ResultCard key={i}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                <ResultCardTitle>{risk.riskName}</ResultCardTitle>
                                <ResultTag color={severityColor(risk.severity)}>{risk.severity}</ResultTag>
                                <ResultTag color="blue">{risk.category}</ResultTag>
                            </View>
                            <ResultCardText>{risk.description}</ResultCardText>
                            {risk.earlyWarningSigns && (
                                <>
                                    <ResultCardText style={{ color: Colors.yellowLight, fontWeight: '600', marginTop: 8 }}>
                                        ⚡ Warning Signs:
                                    </ResultCardText>
                                    <ResultList items={risk.earlyWarningSigns} />
                                </>
                            )}
                            {risk.mitigation && (
                                <>
                                    <ResultCardText style={{ color: Colors.greenLight, fontWeight: '600', marginTop: 8 }}>
                                        🛡️ Mitigation:
                                    </ResultCardText>
                                    {risk.mitigation.map((m: any, j: number) => (
                                        <ResultCardText key={j}>
                                            → {m.action} (Cost: {m.cost}, Effect: {m.effectiveness})
                                        </ResultCardText>
                                    ))}
                                </>
                            )}
                        </ResultCard>
                    ))}
                    {data.insuranceAdvice && (
                        <ResultCard>
                            <ResultCardTitle>🛡️ Insurance Advice</ResultCardTitle>
                            <ResultCardText style={{ fontWeight: '600' }}>Scheme: {data.insuranceAdvice.scheme}</ResultCardText>
                            <ResultCardText>{data.insuranceAdvice.coverage}</ResultCardText>
                            <ResultCardText>Premium: {data.insuranceAdvice.premium}</ResultCardText>
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
                            <AppInput value={form.cropName} onChangeText={(v) => update('cropName', v)} placeholder="e.g. Cotton" />
                        </FormField>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormField label="Growth Stage">
                            <AppInput value={form.growthStage} onChangeText={(v) => update('growthStage', v)} placeholder="e.g. Flowering" />
                        </FormField>
                    </View>
                </FormRow>
                <FormField label="Investment So Far (₹)">
                    <AppInput value={form.investmentSoFar} onChangeText={(v) => update('investmentSoFar', v)} placeholder="e.g. 45000" keyboardType="numeric" />
                </FormField>
            </FormSection>

            <FormSection title="📍 Location">
                <LocationPicker
                    state={form.state}
                    city={form.city}
                    onStateChange={(v) => update('state', v)}
                    onCityChange={(v) => update('city', v)}
                />
            </FormSection>

            <FormSection title="🧪 Soil & Season">
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

            <FormSection title="🔍 Concerns">
                <FormField label="Specific Concerns (comma-separated)">
                    <TextInput
                        style={styles.textarea}
                        value={form.concerns}
                        onChangeText={(v) => update('concerns', v)}
                        placeholder="e.g. Pink bollworm attack last year, Irregular rainfall"
                        placeholderTextColor={Colors.textMuted}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </FormField>
            </FormSection>
        </FeatureForm>
    );
}

const styles = StyleSheet.create({
    textarea: {
        width: '100%',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.inputBg,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: BorderRadius.sm,
        color: Colors.textBright,
        fontSize: FontSize.md,
        minHeight: 80,
    },
});
