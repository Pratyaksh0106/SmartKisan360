import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const features = [
    {
        path: '/(tabs)/crop-recommender' as const,
        icon: '🌱',
        title: 'Crop Recommender',
        description: 'Get AI suggestions on the best crops to grow based on your soil, weather, and location.',
        color: '#22c55e',
    },
    {
        path: '/(tabs)/irrigation-planner' as const,
        icon: '💧',
        title: 'Irrigation Planner',
        description: 'Plan your irrigation schedule with week-by-week water management advice.',
        color: '#3b82f6',
    },
    {
        path: '/(tabs)/yield-predictor' as const,
        icon: '📊',
        title: 'Yield Predictor',
        description: 'Predict your expected crop yield and get tips to maximize production.',
        color: '#f59e0b',
    },
    {
        path: '/(tabs)/price-forecaster' as const,
        icon: '💰',
        title: 'Price Forecaster',
        description: 'Forecast crop prices, find MSP info, and plan when to sell for maximum profit.',
        color: '#8b5cf6',
    },
    {
        path: '/(tabs)/risk-analyzer' as const,
        icon: '⚠️',
        title: 'Risk Analyzer',
        description: 'Analyze pest, weather, market, and financial risks with mitigation strategies.',
        color: '#ef4444',
    },
];

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/signin');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <Text style={styles.brandIcon}>🌾</Text>
                    <Text style={styles.brandText}>Smart Kisaan</Text>
                </View>
                <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.7}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>
                        Namaste, {user?.name?.split(' ')[0]}! 🙏
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Your AI-powered farming assistant is ready to help. Choose a feature below.
                    </Text>
                </View>

                {/* Feature Cards */}
                {features.map((f) => (
                    <TouchableOpacity
                        key={f.path}
                        style={styles.featureCard}
                        onPress={() => router.push(f.path)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.cardAccent, { backgroundColor: f.color }]} />
                        <Text style={styles.cardIcon}>{f.icon}</Text>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{f.title}</Text>
                            <Text style={styles.cardDesc}>{f.description}</Text>
                        </View>
                        <Text style={[styles.cardArrow, { color: f.color }]}>→</Text>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgPrimary,
    },
    // Top Bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(34, 197, 94, 0.15)',
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    brandIcon: {
        fontSize: 24,
    },
    brandText: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.green,
    },
    signOutBtn: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.redErrorBg,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: BorderRadius.sm,
    },
    signOutText: {
        color: Colors.red,
        fontSize: FontSize.xs,
        fontWeight: '500',
    },
    // Scroll Content
    scrollContent: {
        padding: Spacing.xl,
    },
    // Hero
    hero: {
        alignItems: 'center',
        marginBottom: Spacing.xxxl,
    },
    heroTitle: {
        fontSize: FontSize.xxl,
        fontWeight: '800',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    heroSubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSize.md,
        textAlign: 'center',
        marginTop: Spacing.sm,
        lineHeight: 22,
    },
    // Cards
    featureCard: {
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.lg,
        overflow: 'hidden',
    },
    cardAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
    },
    cardIcon: {
        fontSize: 36,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.lg,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardDesc: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        lineHeight: 20,
    },
    cardArrow: {
        fontSize: FontSize.xl,
        fontWeight: '700',
    },
});
