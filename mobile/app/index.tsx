import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect href="/(tabs)/dashboard" />;
    }

    return <Redirect href="/(auth)/signin" />;
}
