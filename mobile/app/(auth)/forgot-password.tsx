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

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRequest = async () => {
        setLoading(true);
        setError('');
        try {
            await authApi.forgotPassword({ email });
            setStep('reset');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setLoading(true);
        setError('');
        try {
            await authApi.resetPassword({ email, confirmationCode: code, newPassword });
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
                    </View>

                    <View style={styles.card}>
                        {step === 'request' ? (
                            <>
                                <Text style={styles.cardTitle}>Forgot Password</Text>

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
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.btn, loading && styles.btnDisabled]}
                                    onPress={handleRequest}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={Colors.white} />
                                    ) : (
                                        <Text style={styles.btnText}>Send Reset Code</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.links}>
                                    <Link href="/(auth)/signin" style={styles.link}>
                                        Back to Sign In
                                    </Link>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.cardTitle}>Reset Password</Text>

                                {error ? (
                                    <View style={styles.errorBox}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.field}>
                                    <Text style={styles.label}>Reset Code</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={code}
                                        onChangeText={setCode}
                                        placeholderTextColor={Colors.textMuted}
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View style={styles.field}>
                                    <Text style={styles.label}>New Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholderTextColor={Colors.textMuted}
                                        secureTextEntry
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.btn, loading && styles.btnDisabled]}
                                    onPress={handleReset}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color={Colors.white} />
                                    ) : (
                                        <Text style={styles.btnText}>Reset Password</Text>
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
    container: { flex: 1, backgroundColor: Colors.bgPrimary },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
    brand: { alignItems: 'center', marginBottom: Spacing.xxxl },
    brandEmoji: { fontSize: 56 },
    brandTitle: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.green, marginTop: Spacing.sm },
    card: {
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.xxl,
        padding: Spacing.xxl,
    },
    cardTitle: { color: Colors.textPrimary, fontSize: FontSize.xl, fontWeight: '600', marginBottom: Spacing.xl },
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
    label: { color: Colors.textLight, fontSize: FontSize.xs, fontWeight: '500', marginBottom: 6 },
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
    btnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '600' },
    links: { marginTop: Spacing.xl, alignItems: 'center' },
    link: { color: Colors.textSecondary, fontSize: FontSize.xs },
});
