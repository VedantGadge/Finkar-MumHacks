import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { scanAndSaveReceipt, getCurrentUserId } from '../../services/receiptService';
import './BillScanner.css';

const BillScanner = ({ isOpen, onClose, onSuccess }) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [isNative, setIsNative] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);

    // Check if running on native platform
    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
    }, []);

    // Convert base64 to Blob
    const base64ToBlob = (base64, mimeType = 'image/jpeg') => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    // Take photo using Capacitor Camera (for native Android/iOS)
    const takePhotoNative = useCallback(async () => {
        try {
            setError(null);
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera,
                correctOrientation: true,
            });

            if (image.base64String) {
                const blob = base64ToBlob(image.base64String, `image/${image.format || 'jpeg'}`);
                setCapturedImage({
                    blob,
                    url: `data:image/${image.format || 'jpeg'};base64,${image.base64String}`
                });
            }
        } catch (err) {
            console.error('Camera error:', err);
            if (err.message?.includes('cancelled') || err.message?.includes('canceled')) {
                // User cancelled - don't show error
                return;
            }
            setError('Failed to capture photo. Please try again or use gallery.');
        }
    }, []);

    // Pick photo from gallery using Capacitor Camera (for native Android/iOS)
    const pickFromGalleryNative = useCallback(async () => {
        try {
            setError(null);
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Photos,
            });

            if (image.base64String) {
                const blob = base64ToBlob(image.base64String, `image/${image.format || 'jpeg'}`);
                setCapturedImage({
                    blob,
                    url: `data:image/${image.format || 'jpeg'};base64,${image.base64String}`
                });
            }
        } catch (err) {
            console.error('Gallery error:', err);
            if (err.message?.includes('cancelled') || err.message?.includes('canceled')) {
                // User cancelled - don't show error
                return;
            }
            setError('Failed to select photo. Please try again.');
        }
    }, []);

    // Start camera (Web fallback)
    const startCameraWeb = useCallback(async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraActive(true);
        } catch (err) {
            console.error('Camera access error:', err);
            setError('Unable to access camera. Please check permissions or use file upload.');
        }
    }, []);

    // Stop camera (Web)
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    }, []);

    // Capture photo from web camera
    const capturePhotoWeb = useCallback(() => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            setCapturedImage({
                blob,
                url: URL.createObjectURL(blob)
            });
            stopCamera();
        }, 'image/jpeg', 0.9);
    }, [stopCamera]);

    // Handle camera button click
    const handleCameraClick = useCallback(() => {
        if (isNative) {
            takePhotoNative();
        } else {
            startCameraWeb();
        }
    }, [isNative, takePhotoNative, startCameraWeb]);

    // Handle gallery button click
    const handleGalleryClick = useCallback(() => {
        if (isNative) {
            pickFromGalleryNative();
        } else {
            fileInputRef.current?.click();
        }
    }, [isNative, pickFromGalleryNative]);

    // Handle file input change (Web fallback)
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCapturedImage({
                blob: file,
                url: URL.createObjectURL(file)
            });
        }
    };

    // Process the captured image
    const processImage = async () => {
        if (!capturedImage) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);

        try {
            const userId = getCurrentUserId();
            const response = await scanAndSaveReceipt(userId, capturedImage.blob);

            if (response.status === 'success') {
                setResult(response);
                if (onSuccess) {
                    onSuccess(response);
                }
            } else {
                setError(response.message || 'Failed to process receipt');
            }
        } catch (err) {
            setError(err.message || 'Failed to scan receipt. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Reset scanner state
    const resetScanner = () => {
        if (capturedImage?.url) {
            URL.revokeObjectURL(capturedImage.url);
        }
        setCapturedImage(null);
        setResult(null);
        setError(null);
        setIsProcessing(false);
    };

    // Handle close
    const handleClose = () => {
        stopCamera();
        resetScanner();
        onClose();
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            stopCamera();
            if (capturedImage?.url) {
                URL.revokeObjectURL(capturedImage.url);
            }
        };
    }, [stopCamera, capturedImage?.url]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="bill-scanner-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
            >
                <motion.div
                    className="bill-scanner-modal"
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="scanner-header">
                        <h2>Add Bill</h2>
                        <button className="close-btn" onClick={handleClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="scanner-content">
                        {/* Result View */}
                        {result && (
                            <motion.div
                                className="result-container"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="success-icon">✅</div>
                                <h3>Bill Scanned Successfully!</h3>
                                <div className="result-details">
                                    <div className="result-item">
                                        <span className="label">Merchant</span>
                                        <span className="value">{result.extracted_data?.merchant}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="label">Amount</span>
                                        <span className="value amount">₹{result.extracted_data?.amount}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="label">Category</span>
                                        <span className="value">{result.extracted_data?.category}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="label">Date</span>
                                        <span className="value">{result.extracted_data?.date}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="label">Description</span>
                                        <span className="value">{result.extracted_data?.narration}</span>
                                    </div>
                                </div>
                                <p className="saved-message">✨ Transaction saved to your records!</p>
                                <button className="primary-btn" onClick={handleClose}>
                                    Done
                                </button>
                            </motion.div>
                        )}

                        {/* Camera/Capture View */}
                        {!result && (
                            <>
                                {/* Camera View (Web only - native uses system camera) */}
                                {cameraActive && !capturedImage && !isNative && (
                                    <div className="camera-container">
                                        <video
                                            ref={videoRef}
                                            className="camera-preview"
                                            autoPlay
                                            playsInline
                                            muted
                                        />
                                        <div className="camera-overlay">
                                            <div className="scan-frame"></div>
                                            <p>Position the bill within the frame</p>
                                        </div>
                                        <div className="camera-controls">
                                            <button className="capture-btn" onClick={capturePhotoWeb}>
                                                <div className="capture-btn-inner"></div>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Captured Image Preview */}
                                {capturedImage && !isProcessing && (
                                    <div className="preview-container">
                                        <img
                                            src={capturedImage.url}
                                            alt="Captured bill"
                                            className="preview-image"
                                        />
                                        <div className="preview-actions">
                                            <button className="secondary-btn" onClick={resetScanner}>
                                                Retake
                                            </button>
                                            <button className="primary-btn" onClick={processImage}>
                                                Scan Bill
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Processing State */}
                                {isProcessing && (
                                    <div className="processing-container">
                                        <div className="processing-spinner"></div>
                                        <p>Scanning your bill...</p>
                                        <p className="processing-subtext">Extracting transaction details</p>
                                    </div>
                                )}

                                {/* Initial State - Choose method */}
                                {!cameraActive && !capturedImage && !isProcessing && (
                                    <div className="options-container">
                                        <p className="options-title">Choose how to capture your bill</p>

                                        <button className="option-btn camera-option" onClick={handleCameraClick}>
                                            <div className="option-icon">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                    <circle cx="12" cy="13" r="4"></circle>
                                                </svg>
                                            </div>
                                            <span>Open Camera</span>
                                        </button>

                                        <div className="divider">
                                            <span>or</span>
                                        </div>

                                        <button
                                            className="option-btn upload-option"
                                            onClick={handleGalleryClick}
                                        >
                                            <div className="option-icon">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="17 8 12 3 7 8"></polyline>
                                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                                </svg>
                                            </div>
                                            <span>Upload from Gallery</span>
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        className="error-container"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <span className="error-icon">⚠️</span>
                                        <p>{error}</p>
                                        <button className="secondary-btn" onClick={resetScanner}>
                                            Try Again
                                        </button>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BillScanner;
