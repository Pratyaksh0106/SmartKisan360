import { Tabs } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { Colors, FontSize } from '../../src/constants/theme';

type TabIconProps = {
    icon: string;
    label: string;
    focused: boolean;
};

function TabIcon({ icon, label, focused }: TabIconProps) {
    return (
        <View style={styles.tabItem}>
            <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{icon}</Text>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🏠" label="Home" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="crop-recommender"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🌱" label="Crop" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="irrigation-planner"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="💧" label="Water" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="yield-predictor"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="📊" label="Yield" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="price-forecaster"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="💰" label="Price" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="risk-analyzer"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="⚠️" label="Risk" focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(34, 197, 94, 0.15)',
        height: 70,
        paddingTop: 8,
        paddingBottom: 8,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    tabEmoji: {
        fontSize: 20,
        opacity: 0.6,
    },
    tabEmojiActive: {
        opacity: 1,
    },
    tabLabel: {
        fontSize: FontSize.xs - 1,
        color: Colors.textMuted,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: Colors.green,
        fontWeight: '600',
    },
});
