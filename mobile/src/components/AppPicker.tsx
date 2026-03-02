import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Colors, FontSize, BorderRadius, Spacing } from '../constants/theme';

interface AppPickerProps {
    selectedValue: string;
    onValueChange: (value: string) => void;
    items: { label: string; value: string }[];
    placeholder?: string;
}

export default function AppPicker({ selectedValue, onValueChange, items, placeholder = 'Select' }: AppPickerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const selectedLabel = items.find(i => i.value === selectedValue)?.label;

    return (
        <>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.pickerText, !selectedLabel && styles.placeholder]}>
                    {selectedLabel || placeholder}
                </Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{placeholder}</Text>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item.value === selectedValue && styles.optionActive,
                                    ]}
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        item.value === selectedValue && styles.optionTextActive,
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    pickerButton: {
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
    pickerText: {
        color: Colors.textBright,
        fontSize: FontSize.md,
    },
    placeholder: {
        color: Colors.textMuted,
    },
    arrow: {
        color: Colors.textMuted,
        fontSize: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    modalContent: {
        backgroundColor: Colors.bgSecondary,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        maxHeight: 400,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    modalTitle: {
        color: Colors.textPrimary,
        fontSize: FontSize.lg,
        fontWeight: '600',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    option: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.sm,
        marginBottom: 4,
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
});
