import { useState, ReactNode } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Main FeatureForm ────────────────────────────────────────────────────────
interface FeatureFormProps {
    title: string;
    subtitle: string;
    icon: string;
    children: ReactNode;
    onSubmit: () => Promise<void>;
    result: any;
    renderResult: (data: any) => ReactNode;
}

export default function FeatureForm({
    title, subtitle, icon, children,
    onSubmit, result, renderResult,
}: FeatureFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await onSubmit();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerIcon}>{icon}</Text>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Text style={styles.headerSubtitle}>{subtitle}</Text>
                    </View>
                </View>

                {/* Form Card */}
                <View style={styles.formCard}>
                    {children}

                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <View style={styles.submitBtnContent}>
                                <ActivityIndicator size="small" color={Colors.white} />
                                <Text style={styles.submitBtnText}>Analyzing with AI...</Text>
                            </View>
                        ) : (
                            <Text style={styles.submitBtnText}>🤖 Get AI Recommendation</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Result */}
                {result && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultTitle}>📋 AI Analysis Results</Text>
                        {renderResult(result)}
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Reusable Sub-components ─────────────────────────────────────────────────
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {children}
        </View>
    );
}

export function FormRow({ children }: { children: ReactNode }) {
    return <View style={styles.row}>{children}</View>;
}

// ─── Result display helpers ──────────────────────────────────────────────────
export function ResultCard({ children }: { children: ReactNode }) {
    return <View style={styles.resultCard}>{children}</View>;
}

export function ResultCardTitle({ children }: { children: ReactNode }) {
    return <Text style={styles.resultCardTitle}>{children}</Text>;
}

export function ResultCardText({ children, style }: { children: ReactNode; style?: any }) {
    return <Text style={[styles.resultCardText, style]}>{children}</Text>;
}

export function ResultTag({ children, color = 'green' }: { children: ReactNode; color?: 'green' | 'blue' | 'yellow' | 'red' }) {
    const colorMap = {
        green: { bg: Colors.greenGlow, text: Colors.greenLight },
        blue: { bg: Colors.blueBg, text: Colors.blueLight },
        yellow: { bg: Colors.yellowBg, text: Colors.yellowLight },
        red: { bg: Colors.redBg, text: Colors.redLight },
    };
    return (
        <View style={[styles.tag, { backgroundColor: colorMap[color].bg }]}>
            <Text style={[styles.tagText, { color: colorMap[color].text }]}>{children}</Text>
        </View>
    );
}

export function ResultList({ items }: { items: string[] }) {
    if (!items || items.length === 0) return null;
    return (
        <View>
            {items.map((item, i) => (
                <View key={i} style={styles.listItem}>
                    <Text style={styles.listBullet}>✦</Text>
                    <Text style={styles.listText}>{item}</Text>
                </View>
            ))}
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgPrimary,
    },
    contentContainer: {
        padding: Spacing.lg,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.xxl,
    },
    headerIcon: {
        fontSize: 36,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    // Form Card
    formCard: {
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.xxl,
    },
    // Section
    section: {
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        color: Colors.green,
        fontWeight: '600',
        fontSize: FontSize.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.md,
    },
    // Field
    field: {
        marginBottom: Spacing.md,
    },
    fieldLabel: {
        color: Colors.textLight,
        fontSize: FontSize.xs,
        fontWeight: '500',
        marginBottom: 5,
    },
    // Row
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    // Error
    errorBox: {
        backgroundColor: Colors.redErrorBg,
        borderWidth: 1,
        borderColor: Colors.redBorder,
        borderRadius: BorderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    errorText: {
        color: '#fca5a5',
        fontSize: FontSize.sm,
    },
    // Submit Button
    submitBtn: {
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: Colors.green,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    submitBtnText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: '600',
    },
    // Result container
    resultContainer: {
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.greenBorder,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
    },
    resultTitle: {
        fontSize: FontSize.xl,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.lg,
    },
    // Result Card
    resultCard: {
        backgroundColor: Colors.inputBg,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    resultCardTitle: {
        color: Colors.green,
        fontSize: FontSize.lg,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    resultCardText: {
        color: Colors.textLight,
        fontSize: FontSize.sm,
        lineHeight: 22,
        marginVertical: 2,
    },
    // Tag
    tag: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
        marginRight: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    tagText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
    },
    // List
    listItem: {
        flexDirection: 'row',
        paddingVertical: 4,
        gap: Spacing.sm,
    },
    listBullet: {
        color: Colors.green,
        fontSize: 10,
        marginTop: 4,
    },
    listText: {
        color: Colors.textLight,
        fontSize: FontSize.sm,
        flex: 1,
        lineHeight: 20,
    },
});
