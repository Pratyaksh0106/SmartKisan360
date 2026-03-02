import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../constants/theme';

interface AppInputProps extends TextInputProps {
    // extend as needed
}

export default function AppInput(props: AppInputProps) {
    return (
        <TextInput
            placeholderTextColor={Colors.textMuted}
            {...props}
            style={[styles.input, props.style]}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.inputBg,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: BorderRadius.sm,
        color: Colors.textBright,
        fontSize: FontSize.md,
    },
});
