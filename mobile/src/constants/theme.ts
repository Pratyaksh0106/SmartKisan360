// ─── Design System (mirrors web frontend CSS variables) ──────────────────────

export const Colors = {
    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    bgCard: 'rgba(30, 41, 59, 0.85)',
    border: 'rgba(51, 65, 85, 0.5)',
    borderLight: 'rgba(51, 65, 85, 0.4)',

    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textLight: '#cbd5e1',
    textBright: '#e2e8f0',

    green: '#22c55e',
    greenDark: '#16a34a',
    greenLight: '#4ade80',
    greenGlow: 'rgba(34, 197, 94, 0.15)',
    greenBorder: 'rgba(34, 197, 94, 0.2)',

    blue: '#3b82f6',
    blueLight: '#60a5fa',
    blueBg: 'rgba(59, 130, 246, 0.15)',

    yellow: '#f59e0b',
    yellowLight: '#facc15',
    yellowBg: 'rgba(234, 179, 8, 0.15)',

    red: '#ef4444',
    redLight: '#f87171',
    redBg: 'rgba(239, 68, 68, 0.15)',
    redBorder: 'rgba(239, 68, 68, 0.3)',
    redErrorBg: 'rgba(239, 68, 68, 0.1)',

    purple: '#8b5cf6',

    white: '#ffffff',
    inputBg: 'rgba(15, 23, 42, 0.6)',
    inputBorder: 'rgba(51, 65, 85, 0.6)',
} as const;

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

export const FontSize = {
    xs: 11,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    hero: 32,
} as const;

export const BorderRadius = {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 50,
} as const;
