import { useState, useRef, DragEvent } from 'react';
import { soilApi } from '../../api';
import './SoilImagePicker.css';

interface SoilData {
    soilType: string;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter?: string;
    moisture?: string;
    texture?: string;
    color?: string;
    confidence?: string;
    observations?: string;
    recommendations?: string;
}

interface SoilImagePickerProps {
    /** Called when AI analysis returns soil data to auto-fill the form */
    onSoilDataDetected: (data: SoilData) => void;
    /** Optional location context for better analysis */
    location?: { city?: string; state?: string };
}

export default function SoilImagePicker({ onSoilDataDetected, location }: SoilImagePickerProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<SoilData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const lastBase64Ref = useRef<string>('');
    const lastMimeRef = useRef<string>('image/jpeg');

    // Convert File to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:image/xxx;base64, prefix — the backend handles it
                resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        setError(null);
        setResult(null);

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setImageUrl(objectUrl);

        try {
            const base64 = await fileToBase64(file);
            lastBase64Ref.current = base64;
            lastMimeRef.current = file.type;

            // Send to AI
            await analyzeSoil(base64, file.type);
        } catch (err) {
            setError('Failed to process image. Please try again.');
            console.error('File processing error:', err);
        }
    };

    const analyzeSoil = async (base64: string, mimeType: string) => {
        setAnalyzing(true);
        setError(null);
        try {
            const response = await soilApi.analyzeImage({
                image: base64,
                mediaType: mimeType,
                location,
            });

            const data = response.data as SoilData;
            setResult(data);
            onSoilDataDetected(data);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze soil image. Please try again.');
            console.error('Soil analysis error:', err);
        } finally {
            setAnalyzing(false);
        }
    };

    const clearImage = () => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
        setResult(null);
        setError(null);
        lastBase64Ref.current = '';
        lastMimeRef.current = 'image/jpeg';
    };

    // ─── Drag & Drop handlers ────────────────────────────────────────────────
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = ''; // reset so same file can be selected again
    };

    return (
        <div className="soil-picker">
            {/* Header */}
            <div className="soil-picker-header">
                <span className="soil-picker-header-icon">📸</span>
                <div>
                    <h4 className="soil-picker-header-title">AI Soil Analysis</h4>
                    <p className="soil-picker-header-subtitle">
                        Upload a photo of your soil — AI will estimate pH, nutrients & type
                    </p>
                </div>
            </div>

            {!imageUrl ? (
                /* ─── Upload Area ────────────────────────────────────────────── */
                <div
                    className={`soil-upload-area ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="soil-upload-icon">🌍</div>
                    <p className="soil-upload-text">
                        <strong>Drag & drop</strong> a soil image, or use the buttons below
                    </p>
                    <div className="soil-btn-row">
                        <button
                            type="button"
                            className="soil-btn-camera"
                            onClick={() => cameraInputRef.current?.click()}
                        >
                            📷 Camera
                        </button>
                        <button
                            type="button"
                            className="soil-btn-gallery"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            🖼️ Browse Files
                        </button>
                    </div>

                    {/* Hidden file inputs */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="soil-file-input"
                        onChange={handleFileChange}
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="soil-file-input"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                /* ─── Image Preview + Results ────────────────────────────────── */
                <div>
                    <div className="soil-image-container">
                        <img src={imageUrl} alt="Soil sample" className="soil-image-preview" />
                        {analyzing && (
                            <div className="soil-image-overlay">
                                <div className="spinner-analyze" />
                                <span className="soil-image-overlay-text">Analyzing soil...</span>
                            </div>
                        )}
                        <button type="button" className="soil-clear-btn" onClick={clearImage}>✕</button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="soil-error">
                            <span className="soil-error-text">⚠️ {error}</span>
                            <button
                                type="button"
                                className="soil-retry-btn"
                                onClick={() => analyzeSoil(lastBase64Ref.current, lastMimeRef.current)}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Result Summary */}
                    {result && (
                        <div className="soil-result">
                            <div className="soil-result-header">
                                <h4 className="soil-result-title">🔬 Analysis Results</h4>
                                <span className={`soil-confidence-badge ${(result.confidence || '').toLowerCase()}`}>
                                    {result.confidence} Confidence
                                </span>
                            </div>

                            {/* Soil Type & Texture */}
                            <div className="soil-type-row">
                                <div>
                                    <div className="soil-type-label">Soil Type</div>
                                    <div className="soil-type-value">{result.soilType}</div>
                                </div>
                                {result.texture && (
                                    <div>
                                        <div className="soil-type-label">Texture</div>
                                        <div className="soil-type-value">{result.texture}</div>
                                    </div>
                                )}
                            </div>

                            {/* NPK Values */}
                            <div className="soil-npk-grid">
                                <div className="soil-npk-item">
                                    <div className="soil-npk-label">pH</div>
                                    <div className="soil-npk-value">{result.ph}</div>
                                </div>
                                <div className="soil-npk-item" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                                    <div className="soil-npk-label n">N</div>
                                    <div className="soil-npk-value">{result.nitrogen}</div>
                                    <div className="soil-npk-unit">kg/ha</div>
                                </div>
                                <div className="soil-npk-item" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                                    <div className="soil-npk-label p">P</div>
                                    <div className="soil-npk-value">{result.phosphorus}</div>
                                    <div className="soil-npk-unit">kg/ha</div>
                                </div>
                                <div className="soil-npk-item" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                                    <div className="soil-npk-label k">K</div>
                                    <div className="soil-npk-value">{result.potassium}</div>
                                    <div className="soil-npk-unit">kg/ha</div>
                                </div>
                            </div>

                            {/* Observations */}
                            {result.observations && (
                                <div className="soil-observations">
                                    <p>💡 {result.observations}</p>
                                </div>
                            )}

                            {/* Auto-filled notice */}
                            <div className="soil-autofill-notice">
                                <span>✅</span>
                                <span>Soil fields have been auto-filled below. You can adjust them if needed.</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
