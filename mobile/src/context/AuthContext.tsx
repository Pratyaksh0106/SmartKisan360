import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api';

interface User {
    username: string;
    email: string;
    name: string;
    phone: string | null;
    emailVerified: boolean;
    sub: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    signIn: (tokens: { accessToken: string; idToken: string; refreshToken: string }) => void;
    signOut: () => Promise<void>;
    fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                await fetchProfile().finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        })();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await authApi.getProfile();
            setUser(res.data);
        } catch {
            await AsyncStorage.multiRemove(['accessToken', 'idToken', 'refreshToken']);
            setUser(null);
        }
    };

    const signIn = async (tokens: { accessToken: string; idToken: string; refreshToken: string }) => {
        await AsyncStorage.setItem('accessToken', tokens.accessToken);
        await AsyncStorage.setItem('idToken', tokens.idToken);
        await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
        await fetchProfile();
    };

    const signOut = async () => {
        try {
            await authApi.signOut();
        } catch {
            // ignore
        }
        await AsyncStorage.multiRemove(['accessToken', 'idToken', 'refreshToken']);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, signIn, signOut, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
