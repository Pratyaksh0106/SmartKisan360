import { useState, useEffect, useRef } from 'react';
import { STATE_NAMES, getCitiesForState } from '../../data/indianLocations';
import './LocationPicker.css';

interface LocationPickerProps {
    state: string;
    city: string;
    onStateChange: (state: string) => void;
    onCityChange: (city: string) => void;
}

export default function LocationPicker({ state, city, onStateChange, onCityChange }: LocationPickerProps) {
    const [stateOpen, setStateOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [locating, setLocating] = useState(false);
    const [cities, setCities] = useState<string[]>([]);

    const stateSearchRef = useRef<HTMLInputElement>(null);
    const citySearchRef = useRef<HTMLInputElement>(null);

    // Update cities list when state changes
    useEffect(() => {
        if (state) {
            setCities(getCitiesForState(state));
        } else {
            setCities([]);
        }
    }, [state]);

    // Auto-focus search inputs when dropdowns open
    useEffect(() => {
        if (stateOpen && stateSearchRef.current) stateSearchRef.current.focus();
    }, [stateOpen]);
    useEffect(() => {
        if (cityOpen && citySearchRef.current) citySearchRef.current.focus();
    }, [cityOpen]);

    // Filter states by search
    const filteredStates = stateSearch
        ? STATE_NAMES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()))
        : STATE_NAMES;

    // Filter cities by search
    const filteredCities = citySearch
        ? cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
        : cities;

    // ─── Get Current Location (Browser Geolocation API) ──────────────────────
    const handleGetLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setLocating(true);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                });
            });

            const { latitude, longitude } = position.coords;

            // Use reverse geocoding via Nominatim (free, no API key needed)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const geo = await response.json();

            if (geo && geo.address) {
                const detectedState = geo.address.state || '';
                const detectedCity = geo.address.city || geo.address.town || geo.address.village || geo.address.county || '';

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
            if (error.code === 1) {
                alert('Location access denied. Please allow location access in your browser settings.');
            } else {
                alert('Unable to detect your location. Please select manually.');
            }
        } finally {
            setLocating(false);
        }
    };

    return (
        <div className="location-picker">
            {/* Detect Location Button */}
            <button
                type="button"
                className="location-detect-btn"
                onClick={handleGetLocation}
                disabled={locating}
            >
                {locating ? (
                    <>
                        <span className="spinner-inline" />
                        Detecting location...
                    </>
                ) : (
                    <>📍 Use Current Location</>
                )}
            </button>

            {/* Divider */}
            <div className="location-divider">
                <div className="location-divider-line" />
                <span className="location-divider-text">or select manually</span>
                <div className="location-divider-line" />
            </div>

            {/* State & City Row */}
            <div className="location-row">
                {/* State Dropdown */}
                <div className="location-dropdown-wrapper">
                    <label className="location-dropdown-label">State *</label>
                    <button
                        type="button"
                        className={`location-select-btn ${stateOpen ? 'open' : ''}`}
                        onClick={() => { setStateSearch(''); setStateOpen(!stateOpen); setCityOpen(false); }}
                    >
                        <span className={!state ? 'placeholder' : ''}>{state || 'Select State'}</span>
                        <span className="arrow">▼</span>
                    </button>

                    {stateOpen && (
                        <>
                            <div className="location-dropdown-overlay" onClick={() => setStateOpen(false)} />
                            <div className="location-dropdown-panel">
                                <input
                                    ref={stateSearchRef}
                                    type="text"
                                    className="location-search"
                                    value={stateSearch}
                                    onChange={e => setStateSearch(e.target.value)}
                                    placeholder="🔍 Search state..."
                                />
                                <ul className="location-options">
                                    {filteredStates.map(s => (
                                        <li
                                            key={s}
                                            className={`location-option ${s === state ? 'active' : ''}`}
                                            onClick={() => {
                                                onStateChange(s);
                                                onCityChange(''); // reset city when state changes
                                                setStateOpen(false);
                                            }}
                                        >
                                            {s}
                                            {s === state && <span className="checkmark">✓</span>}
                                        </li>
                                    ))}
                                    {filteredStates.length === 0 && (
                                        <li className="location-empty">No states found for "{stateSearch}"</li>
                                    )}
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* City Dropdown */}
                <div className="location-dropdown-wrapper">
                    <label className="location-dropdown-label">City / Village *</label>
                    <button
                        type="button"
                        className={`location-select-btn ${cityOpen ? 'open' : ''} ${!state ? 'disabled' : ''}`}
                        onClick={() => {
                            if (!state) {
                                alert('Please select a state first.');
                                return;
                            }
                            setCitySearch('');
                            setCityOpen(!cityOpen);
                            setStateOpen(false);
                        }}
                    >
                        <span className={!city ? 'placeholder' : ''}>{city || 'Select City'}</span>
                        <span className="arrow">▼</span>
                    </button>

                    {cityOpen && (
                        <>
                            <div className="location-dropdown-overlay" onClick={() => setCityOpen(false)} />
                            <div className="location-dropdown-panel">
                                <input
                                    ref={citySearchRef}
                                    type="text"
                                    className="location-search"
                                    value={citySearch}
                                    onChange={e => setCitySearch(e.target.value)}
                                    placeholder="🔍 Search city..."
                                />
                                <ul className="location-options">
                                    {filteredCities.map(c => (
                                        <li
                                            key={c}
                                            className={`location-option ${c === city ? 'active' : ''}`}
                                            onClick={() => {
                                                onCityChange(c);
                                                setCityOpen(false);
                                            }}
                                        >
                                            {c}
                                            {c === city && <span className="checkmark">✓</span>}
                                        </li>
                                    ))}
                                    {filteredCities.length === 0 && (
                                        <li className="location-empty">No cities found for "{citySearch}"</li>
                                    )}
                                </ul>

                                {/* Custom city entry */}
                                <div className="location-custom-entry">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (citySearch.trim()) {
                                                onCityChange(citySearch.trim());
                                                setCityOpen(false);
                                            }
                                        }}
                                    >
                                        ➕ Enter custom: "{citySearch || 'type above'}"
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
