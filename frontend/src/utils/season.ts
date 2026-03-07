/**
 * Auto-detect Indian agricultural season based on the current month.
 *
 * Indian Crop Seasons:
 * ─────────────────────────────────────────────────────
 *  Kharif  (Monsoon)  → June to October   (months 6-10)
 *  Rabi    (Winter)   → November to March  (months 11-3)
 *  Zaid    (Summer)   → April to May       (months 4-5)
 * ─────────────────────────────────────────────────────
 */
export function getCurrentSeason(): string {
    const month = new Date().getMonth() + 1; // 1-12

    if (month >= 6 && month <= 10) return 'Kharif';
    if (month >= 4 && month <= 5) return 'Zaid';
    return 'Rabi'; // Nov-Mar (11, 12, 1, 2, 3)
}

/**
 * Returns a label describing why this season was selected.
 * e.g. "Rabi (auto-detected for March)"
 */
export function getSeasonLabel(): string {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const month = new Date().getMonth();
    return `${getCurrentSeason()} season (${monthNames[month]})`;
}
