import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform,
    ActivityIndicator, StyleSheet,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { authApi } from '../../src/api';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'signup' | 'confirm'>('signup');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const router = useRouter();

    const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSignUp = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await authApi.signUp(form);
            setUsername(res.data.username);
            setStep('confirm');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        try {
            await authApi.confirmSignUp({ username, confirmationCode: code });
            router.replace('/(auth)/signin');
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
                    <View style={styles.brand}>
                        <Text style={styles.brandEmoji}>🌾</Text>
                        <Text style={styles.brandTitle}>Smart Kisaan</Text>
                        <Text style={styles.brandSubtitle}>AI-Powered Farming Assistant</Text>
                    </View>

                    <View style={styles.card}>
                        {step === 'signup' ? (
                            <>
                                <Text style={styles.cardTitle}>Create Account</Text>

                                {error ? (
                                    <View style={styles.errorBox}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.field}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.name}
                                        onChangeText={(v) => update('name', v)}
                                        placeholder="Rudransh Solanki"
                                        placeholderTextColor={Colors.textMuted}
                                    />
                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.email}
                                        onChangeText={(v) => update('email', v)}
                                        placeholder="you@example.com"
                                        placeholderTextColor={Colors.textMuted}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.password}
                                        onChangeText={(v) => update('password', v)}
                                        placeholder="Min 8 characters"
                                        placeholderTextColor={Colors.textMuted}
                                        secureTextEntry
                                    />
                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>Phone (optional)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.phone}
                                        onChangeText={(v) => update('phone', v)}
                                        placeholder="+919876543210"
                                        placeholderTextColor={Colors.textMuted}
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.btn, loading && styles.btnDisabled]}
                                    onPress={handleSignUp}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={Colors.white} />
                                    ) : (
                                        <Text style={styles.btnText}>Sign Up</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.links}>
                                    <Link href="/(auth)/signin" style={styles.link}>
                                        Already have an account? Sign In
                                    </Link>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.cardTitle}>Verify Email</Text>
                                <Text style={styles.infoText}>
                                    We sent a verification code to{' '}
                                    <Text style={styles.infoHighlight}>{form.email}</Text>
                                </Text>

                                {error ? (
                                    <View style={styles.errorBox}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.field}>
                                    <Text style={styles.label}>Verification Code</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={code}
                                        onChangeText={setCode}
                                        placeholder="123456"
                                        placeholderTextColor={Colors.textMuted}
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.btn, loading && styles.btnDisabled]}
                                    onPress={handleConfirm}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={Colors.white} />
                                    ) : (
                                        <Text style={styles.btnText}>Verify Email</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
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
    brandEmoji: { fontSize: 56 },
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
    infoText: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        marginBottom: Spacing.lg,
    },
    infoHighlight: {
        color: Colors.green,
        fontWeight: '600',
    },
    errorBox: {
        backgroundColor: Colors.redErrorBg,
        borderWidth: 1,
        borderColor: Colors.redBorder,
        borderRadius: BorderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    errorText: { color: '#fca5a5', fontSize: FontSize.sm },
    field: { marginBottom: Spacing.lg },
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
    btnDisabled: { opacity: 0.7 },
    btnText: {
        color: Colors.white,
        fontSize: FontSize.lg,
        fontWeight: '600',
    },
    links: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    link: {
        color: Colors.textSecondary,
        fontSize: FontSize.xs,
    },
});
