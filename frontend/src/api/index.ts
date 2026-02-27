const API_BASE = '/api';

async function request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// ─── Auth APIs ──────────────────────────────────────────────────────────────
export const authApi = {
    signUp: (body: { name: string; email: string; password: string; phone?: string }) =>
        request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

    confirmSignUp: (body: { username: string; confirmationCode: string }) =>
        request('/auth/confirm-signup', { method: 'POST', body: JSON.stringify(body) }),

    resendCode: (body: { username: string }) =>
        request('/auth/resend-code', { method: 'POST', body: JSON.stringify(body) }),

    signIn: (body: { email: string; password: string }) =>
        request('/auth/signin', { method: 'POST', body: JSON.stringify(body) }),

    getProfile: () => request('/auth/profile'),

    signOut: () => request('/auth/signout', { method: 'POST' }),

    forgotPassword: (body: { email: string }) =>
        request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),

    resetPassword: (body: { email: string; confirmationCode: string; newPassword: string }) =>
        request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

    changePassword: (body: { previousPassword: string; newPassword: string }) =>
        request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),

    refreshToken: (body: { refreshToken: string }) =>
        request('/auth/refresh-token', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Feature APIs ───────────────────────────────────────────────────────────
export const cropApi = {
    recommend: (body: any) =>
        request('/crop/recommend', { method: 'POST', body: JSON.stringify(body) }),
};

export const irrigationApi = {
    plan: (body: any) =>
        request('/irrigation/plan', { method: 'POST', body: JSON.stringify(body) }),
};

export const yieldApi = {
    predict: (body: any) =>
        request('/yield/predict', { method: 'POST', body: JSON.stringify(body) }),
};

export const priceApi = {
    forecast: (body: any) =>
        request('/price/forecast', { method: 'POST', body: JSON.stringify(body) }),
};

export const riskApi = {
    analyze: (body: any) =>
        request('/risk/analyze', { method: 'POST', body: JSON.stringify(body) }),
};
