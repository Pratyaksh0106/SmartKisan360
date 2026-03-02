import { useState } from 'react';
import {
    View, Text, TouchableOpacity, Image, StyleSheet,
    ActivityIndicator, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { soilApi } from '../api';

interface SoilData {
    soilType: string;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter?: string;
    moisture?: string;
    texture?: string;
    color?: string;
    confidence?: string;
    observations?: string;
    recommendations?: string;
}

interface SoilImagePickerProps {
    /** Called when AI analysis returns soil data to auto-fill the form */
    onSoilDataDetected: (data: SoilData) => void;
    /** Optional location context for better analysis */
    location?: { city?: string; state?: string };
}

export default function SoilImagePicker({ onSoilDataDetected, location }: SoilImagePickerProps) {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<SoilData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pickImage = async (useCamera: boolean) => {
        try {
            setError(null);

            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'Camera access is needed to take soil photos.');
                    return;
                }
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'Gallery access is needed to select soil photos.');
                    return;
                }
            }

            const pickerResult = await (useCamera
                ? ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    quality: 0.7,
                    base64: true,
                    allowsEditing: true,
                    aspect: [4, 3],
                })
                : ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    quality: 0.7,
                    base64: true,
                    allowsEditing: true,
                    aspect: [4, 3],
                }));

            if (pickerResult.canceled || !pickerResult.assets?.[0]) return;

            const asset = pickerResult.assets[0];
            setImageUri(asset.uri);
            setResult(null);

            // Send to AI for analysis
            await analyzeSoil(asset.base64!, asset.mimeType || 'image/jpeg');
        } catch (err: any) {
            setError('Failed to pick image. Please try again.');
            console.error('Image picker error:', err);
        }
    };

    const analyzeSoil = async (base64: string, mimeType: string) => {
        setAnalyzing(true);
        setError(null);
        try {
            const response = await soilApi.analyzeImage({
                image: base64,
                mediaType: mimeType,
                location,
            });

            const data = response.data as SoilData;
            setResult(data);
            onSoilDataDetected(data);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze soil image. Please try again.');
            console.error('Soil analysis error:', err);
        } finally {
            setAnalyzing(false);
        }
    };

    const clearImage = () => {
        setImageUri(null);
        setResult(null);
        setError(null);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerIcon}>📸</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>AI Soil Analysis</Text>
                    <Text style={styles.headerSubtitle}>
                        Take a photo of your soil — AI will estimate pH, nutrients & type
                    </Text>
                </View>
            </View>

            {!imageUri ? (
                /* ─── Upload Buttons ──────────────────────────────────────── */
                <View style={styles.uploadArea}>
                    <Text style={styles.uploadIcon}>🌍</Text>
                    <Text style={styles.uploadText}>Upload or capture soil image</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cameraBtn}
                            onPress={() => pickImage(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cameraBtnIcon}>📷</Text>
                            <Text style={styles.cameraBtnText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.galleryBtn}
                            onPress={() => pickImage(false)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.galleryBtnIcon}>🖼️</Text>
                            <Text style={styles.galleryBtnText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                /* ─── Image Preview + Results ────────────────────────────── */
                <View>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        {analyzing && (
                            <View style={styles.overlay}>
                                <ActivityIndicator size="large" color={Colors.green} />
                                <Text style={styles.overlayText}>Analyzing soil...</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.clearBtn} onPress={clearImage}>
                            <Text style={styles.clearBtnText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Error */}
                    {error && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>⚠️ {error}</Text>
                            <TouchableOpacity onPress={() => analyzeSoil('', '')}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Result Summary */}
                    {result && (
                        <View style={styles.resultContainer}>
                            <View style={styles.resultHeader}>
                                <Text style={styles.resultTitle}>🔬 Analysis Results</Text>
                                <View style={[
                                    styles.confidenceBadge,
                                    result.confidence === 'High' && styles.confidenceHigh,
                                    result.confidence === 'Medium' && styles.confidenceMedium,
                                    result.confidence === 'Low' && styles.confidenceLow,
                                ]}>
                                    <Text style={styles.confidenceText}>{result.confidence} Confidence</Text>
                                </View>
                            </View>

                            {/* Soil Type & Texture */}
                            <View style={styles.resultRow}>
                                <View style={styles.resultItem}>
                                    <Text style={styles.resultLabel}>Soil Type</Text>
                                    <Text style={styles.resultValue}>{result.soilType}</Text>
                                </View>
                                {result.texture && (
                                    <View style={styles.resultItem}>
                                        <Text style={styles.resultLabel}>Texture</Text>
                                        <Text style={styles.resultValue}>{result.texture}</Text>
                                    </View>
                                )}
                            </View>

                            {/* NPK Values */}
                            <View style={styles.npkRow}>
                                <View style={styles.npkItem}>
                                    <Text style={styles.npkLabel}>pH</Text>
                                    <Text style={styles.npkValue}>{result.ph}</Text>
                                </View>
                                <View style={[styles.npkItem, { borderColor: Colors.greenBorder }]}>
                                    <Text style={[styles.npkLabel, { color: Colors.green }]}>N</Text>
                                    <Text style={styles.npkValue}>{result.nitrogen}</Text>
                                    <Text style={styles.npkUnit}>kg/ha</Text>
                                </View>
                                <View style={[styles.npkItem, { borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                                    <Text style={[styles.npkLabel, { color: Colors.blue }]}>P</Text>
                                    <Text style={styles.npkValue}>{result.phosphorus}</Text>
                                    <Text style={styles.npkUnit}>kg/ha</Text>
                                </View>
                                <View style={[styles.npkItem, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                                    <Text style={[styles.npkLabel, { color: Colors.yellow }]}>K</Text>
                                    <Text style={styles.npkValue}>{result.potassium}</Text>
                                    <Text style={styles.npkUnit}>kg/ha</Text>
                                </View>
                            </View>

                            {/* Observations */}
                            {result.observations && (
                                <View style={styles.observationBox}>
                                    <Text style={styles.observationText}>💡 {result.observations}</Text>
                                </View>
                            )}

                            {/* Auto-filled notice */}
                            <View style={styles.autoFillNotice}>
                                <Text style={styles.autoFillIcon}>✅</Text>
                                <Text style={styles.autoFillText}>
                                    Soil fields have been auto-filled below. You can adjust them if needed.
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    headerIcon: {
        fontSize: 28,
    },
    headerTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.lg,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: Colors.textMuted,
        fontSize: FontSize.xs,
        marginTop: 2,
    },
    // Upload Area
    uploadArea: {
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderStyle: 'dashed',
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
    },
    uploadIcon: {
        fontSize: 40,
        marginBottom: Spacing.sm,
    },
    uploadText: {
        color: Colors.textMuted,
        fontSize: FontSize.sm,
        marginBottom: Spacing.lg,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    cameraBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.greenGlow,
        borderWidth: 1,
        borderColor: Colors.greenBorder,
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    cameraBtnIcon: { fontSize: 16 },
    cameraBtnText: {
        color: Colors.green,
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    galleryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.blueBg,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.25)',
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    galleryBtnIcon: { fontSize: 16 },
    galleryBtnText: {
        color: Colors.blueLight,
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    // Image Preview
    imageContainer: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: Spacing.md,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: BorderRadius.lg,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    overlayText: {
        color: Colors.textPrimary,
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    clearBtn: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearBtnText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    // Error
    errorBox: {
        backgroundColor: Colors.redErrorBg,
        borderWidth: 1,
        borderColor: Colors.redBorder,
        borderRadius: BorderRadius.sm,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    errorText: {
        color: Colors.redLight,
        fontSize: FontSize.sm,
        flex: 1,
    },
    retryText: {
        color: Colors.blue,
        fontSize: FontSize.sm,
        fontWeight: '600',
        marginLeft: Spacing.md,
    },
    // Results
    resultContainer: {
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderWidth: 1,
        borderColor: Colors.greenBorder,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    resultTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.lg,
        fontWeight: '700',
    },
    confidenceBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
    },
    confidenceHigh: { backgroundColor: Colors.greenGlow },
    confidenceMedium: { backgroundColor: Colors.yellowBg },
    confidenceLow: { backgroundColor: Colors.redErrorBg },
    confidenceText: {
        color: Colors.textLight,
        fontSize: FontSize.xs,
        fontWeight: '600',
    },
    resultRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    resultItem: {
        flex: 1,
    },
    resultLabel: {
        color: Colors.textMuted,
        fontSize: FontSize.xs,
        marginBottom: 2,
    },
    resultValue: {
        color: Colors.textBright,
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    // NPK Grid
    npkRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    npkItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: BorderRadius.sm,
    },
    npkLabel: {
        color: Colors.textMuted,
        fontSize: FontSize.xs,
        fontWeight: '700',
    },
    npkValue: {
        color: Colors.textBright,
        fontSize: FontSize.lg,
        fontWeight: '700',
    },
    npkUnit: {
        color: Colors.textMuted,
        fontSize: 9,
    },
    // Observations
    observationBox: {
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderRadius: BorderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    observationText: {
        color: Colors.textLight,
        fontSize: FontSize.sm,
        lineHeight: 20,
    },
    // Auto-fill notice
    autoFillNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    autoFillIcon: { fontSize: 14 },
    autoFillText: {
        color: Colors.green,
        fontSize: FontSize.xs,
        fontWeight: '500',
        flex: 1,
    },
});
