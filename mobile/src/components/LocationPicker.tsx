import { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, Modal, FlatList,
    TextInput, StyleSheet, ActivityIndicator, Alert, Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { STATE_NAMES, getCitiesForState } from '../data/indianLocations';

interface LocationPickerProps {
    state: string;
    city: string;
    onStateChange: (state: string) => void;
    onCityChange: (city: string) => void;
}

export default function LocationPicker({ state, city, onStateChange, onCityChange }: LocationPickerProps) {
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [cityModalVisible, setCityModalVisible] = useState(false);
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [locating, setLocating] = useState(false);
    const [cities, setCities] = useState<string[]>([]);

    // Update cities list when state changes
    useEffect(() => {
        if (state) {
            setCities(getCitiesForState(state));
        } else {
            setCities([]);
        }
    }, [state]);

    // Filter states by search
    const filteredStates = stateSearch
        ? STATE_NAMES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()))
        : STATE_NAMES;

    // Filter cities by search
    const filteredCities = citySearch
        ? cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
        : cities;

    // ─── Get Current Location ────────────────────────────────────────────────
    const handleGetLocation = async () => {
        setLocating(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please allow location access in your phone settings to use this feature.',
                    [{ text: 'OK' }]
                );
                setLocating(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const [reverseGeo] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (reverseGeo) {
                // Try to match state from reverse geocode
                const detectedState = reverseGeo.region || reverseGeo.subregion || '';
                const detectedCity = reverseGeo.city || reverseGeo.district || reverseGeo.subregion || '';

                // Find matching state in our data
                const matchedState = STATE_NAMES.find(s =>
                    s.toLowerCase() === detectedState.toLowerCase() ||
                    detectedState.toLowerCase().includes(s.toLowerCase()) ||
                    s.toLowerCase().includes(detectedState.toLowerCase())
                );

                if (matchedState) {
                    onStateChange(matchedState);
                    // Try to match city
                    const stateCities = getCitiesForState(matchedState);
                    const matchedCity = stateCities.find(c =>
                        c.toLowerCase() === detectedCity.toLowerCase() ||
                        detectedCity.toLowerCase().includes(c.toLowerCase()) ||
                        c.toLowerCase().includes(detectedCity.toLowerCase())
                    );
                    onCityChange(matchedCity || detectedCity);
                } else {
                    onStateChange(detectedState);
                    onCityChange(detectedCity);
                }
            }
        } catch (error: any) {
            Alert.alert('Location Error', 'Unable to detect your location. Please select manually.');
        } finally {
            setLocating(false);
        }
    };

    return (
        <View>
            {/* Current Location Button */}
            <TouchableOpacity
                style={styles.locationBtn}
                onPress={handleGetLocation}
                disabled={locating}
                activeOpacity={0.7}
            >
                {locating ? (
                    <View style={styles.locationBtnContent}>
                        <ActivityIndicator size="small" color={Colors.blue} />
                        <Text style={styles.locationBtnText}>Detecting location...</Text>
                    </View>
                ) : (
                    <View style={styles.locationBtnContent}>
                        <Text style={styles.locationBtnIcon}>📍</Text>
                        <Text style={styles.locationBtnText}>Use Current Location</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or select manually</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* State & City Row */}
            <View style={styles.row}>
                {/* State Picker */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>State *</Text>
                    <TouchableOpacity
                        style={styles.pickerBtn}
                        onPress={() => { setStateSearch(''); setStateModalVisible(true); }}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.pickerText, !state && styles.placeholder]}>
                            {state || 'Select State'}
                        </Text>
                        <Text style={styles.arrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* City Picker */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>City / Village *</Text>
                    <TouchableOpacity
                        style={[styles.pickerBtn, !state && styles.pickerDisabled]}
                        onPress={() => {
                            if (!state) {
                                Alert.alert('Select State First', 'Please select a state before choosing a city.');
                                return;
                            }
                            setCitySearch('');
                            setCityModalVisible(true);
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.pickerText, !city && styles.placeholder]}>
                            {city || 'Select City'}
                        </Text>
                        <Text style={styles.arrow}>▼</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ─── State Modal ─────────────────────────────────────────────── */}
            <Modal visible={stateModalVisible} transparent animationType="slide" onRequestClose={() => setStateModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select State</Text>
                            <TouchableOpacity onPress={() => setStateModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            value={stateSearch}
                            onChangeText={setStateSearch}
                            placeholder="🔍 Search state..."
                            placeholderTextColor={Colors.textMuted}
                            autoFocus
                        />

                        <FlatList
                            data={filteredStates}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.option, item === state && styles.optionActive]}
                                    onPress={() => {
                                        onStateChange(item);
                                        onCityChange(''); // reset city when state changes
                                        setStateModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.optionText, item === state && styles.optionTextActive]}>
                                        {item}
                                    </Text>
                                    {item === state && <Text style={styles.checkmark}>✓</Text>}
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>

            {/* ─── City Modal ──────────────────────────────────────────────── */}
            <Modal visible={cityModalVisible} transparent animationType="slide" onRequestClose={() => setCityModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select City — {state}</Text>
                            <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            value={citySearch}
                            onChangeText={setCitySearch}
                            placeholder="🔍 Search city..."
                            placeholderTextColor={Colors.textMuted}
                            autoFocus
                        />

                        <FlatList
                            data={filteredCities}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.option, item === city && styles.optionActive]}
                                    onPress={() => {
                                        onCityChange(item);
                                        setCityModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.optionText, item === city && styles.optionTextActive]}>
                                        {item}
                                    </Text>
                                    {item === city && <Text style={styles.checkmark}>✓</Text>}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No cities found for "{citySearch}"</Text>
                            }
                            showsVerticalScrollIndicator={false}
                        />

                        {/* Custom city entry */}
                        <TouchableOpacity
                            style={styles.customEntry}
                            onPress={() => {
                                if (citySearch.trim()) {
                                    onCityChange(citySearch.trim());
                                    setCityModalVisible(false);
                                }
                            }}
                        >
                            <Text style={styles.customEntryText}>
                                ➕ Enter custom: "{citySearch || 'type above'}"
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // Location Button
    locationBtn: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.25)',
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    locationBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    locationBtnIcon: {
        fontSize: 18,
    },
    locationBtnText: {
        color: Colors.blueLight,
        fontSize: FontSize.md,
        fontWeight: '600',
    },
    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.borderLight,
    },
    dividerText: {
        color: Colors.textMuted,
        fontSize: FontSize.xs,
    },
    // Row
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    label: {
        color: Colors.textLight,
        fontSize: FontSize.xs,
        fontWeight: '500',
        marginBottom: 5,
    },
    // Picker Button
    pickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.inputBg,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: BorderRadius.sm,
    },
    pickerDisabled: {
        opacity: 0.5,
    },
    pickerText: {
        color: Colors.textBright,
        fontSize: FontSize.md,
        flex: 1,
    },
    placeholder: {
        color: Colors.textMuted,
    },
    arrow: {
        color: Colors.textMuted,
        fontSize: 10,
        marginLeft: 4,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.bgSecondary,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        padding: Spacing.xl,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    modalTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.xl,
        fontWeight: '700',
    },
    modalClose: {
        color: Colors.textMuted,
        fontSize: FontSize.xl,
        padding: Spacing.sm,
    },
    // Search
    searchInput: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.inputBg,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: BorderRadius.lg,
        color: Colors.textBright,
        fontSize: FontSize.md,
        marginBottom: Spacing.md,
    },
    // Options
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.sm,
        marginBottom: 2,
    },
    optionActive: {
        backgroundColor: Colors.greenGlow,
    },
    optionText: {
        color: Colors.textLight,
        fontSize: FontSize.lg,
    },
    optionTextActive: {
        color: Colors.green,
        fontWeight: '600',
    },
    checkmark: {
        color: Colors.green,
        fontSize: FontSize.lg,
        fontWeight: '700',
    },
    emptyText: {
        color: Colors.textMuted,
        fontSize: FontSize.md,
        textAlign: 'center',
        paddingVertical: Spacing.xxl,
    },
    // Custom entry
    customEntry: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.md,
        marginTop: Spacing.sm,
    },
    customEntryText: {
        color: Colors.blueLight,
        fontSize: FontSize.sm,
        textAlign: 'center',
    },
});
