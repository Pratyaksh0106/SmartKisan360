import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform,
    ActivityIndicator, StyleSheet,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { authApi } from '../../src/api';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await authApi.signIn({ email, password });
            await signIn(res.data);
            router.replace('/(tabs)/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Brand */}
                    <View style={styles.brand}>
                        <Text style={styles.brandEmoji}>🌾</Text>
                        <Text style={styles.brandTitle}>Smart Kisaan</Text>
                        <Text style={styles.brandSubtitle}>AI-Powered Farming Assistant</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sign In</Text>

                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.field}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="you@example.com"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.textMuted}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.btn, loading && styles.btnDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <Text style={styles.btnText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.links}>
                            <Link href="/(auth)/signup" style={styles.link}>
                                Don't have an account? Sign Up
                            </Link>
                            <Link href="/(auth)/forgot-password" style={styles.link}>
                                Forgot Password?
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgPrimary,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    brand: {
        alignItems: 'center',
        marginBottom: Spacing.xxxl,
    },
    brandEmoji: {
        fontSize: 56,
    },
    brandTitle: {
        fontSize: FontSize.xxxl,
        fontWeight: '800',
        color: Colors.green,
        marginTop: Spacing.sm,
    },
    brandSubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        marginTop: 4,
    },
    card: {
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.xxl,
        padding: Spacing.xxl,
    },
    cardTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.xl,
        fontWeight: '600',
        marginBottom: Spacing.xl,
    },
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
    field: {
        marginBottom: Spacing.lg,
    },
    label: {
        color: Colors.textLight,
        fontSize: FontSize.xs,
        fontWeight: '500',
        marginBottom: 6,
    },
    input: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.inputBg,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: BorderRadius.md,
        color: Colors.textBright,
        fontSize: FontSize.md,
    },
    btn: {
        paddingVertical: Spacing.lg,
        backgroundColor: Colors.green,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    btnDisabled: {
        opacity: 0.7,
    },
    btnText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: '600',
    },
    links: {
        marginTop: Spacing.xl,
        alignItems: 'center',
        gap: Spacing.sm,
    },
    link: {
        color: Colors.textSecondary,
        fontSize: FontSize.xs,
    },
});
