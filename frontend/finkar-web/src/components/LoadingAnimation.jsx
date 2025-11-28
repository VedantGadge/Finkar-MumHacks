import React from 'react';
import './LoadingAnimation.css';

/**
 * FinKar Loading Animation Component
 * 
 * Props:
 * - variant: 'pulse' | 'spin' | 'breathe' | 'bars' | 'fill' (default: 'pulse')
 * - size: number in pixels (default: 100)
 * - message: optional loading message to display
 * - hideMessage: hide the message even if provided (for fill variant)
 */
const LoadingAnimation = ({
    variant = 'pulse',
    size = 100,
    message = '',
    hideMessage = false
}) => {
    return (
        <div className="loading-container">
            <div className={`loading-animation loading-${variant}`}>
                {variant === 'fill' ? (
                    <div className="rupee-fill-container" style={{ width: size, height: size }}>
                        <svg viewBox="75 74 88 147" xmlns="http://www.w3.org/2000/svg">
                            {/* Base outline (faint) */}
                            <path
                                className="rupee-base-path"
                                d="M116.1 219.443L78.3 153.443V144.643H82.7C89.7667 144.643 95.7 143.977 100.5 142.643C105.433 141.31 109.3 139.11 112.1 136.043C114.9 132.977 116.567 128.777 117.1 123.443H78.3V110.643H116.9C115.967 105.71 114.1 101.71 111.3 98.6434C108.5 95.4434 104.7 93.11 99.9 91.6433C95.2333 90.1767 89.5 89.4434 82.7 89.4434H78.3V76.6434H161.1V89.4434H123.3C126.367 91.9767 128.9 94.9767 130.9 98.4434C132.9 101.91 134.167 105.977 134.7 110.643H161.1V123.443H135.1C134.167 133.177 130.433 140.777 123.9 146.243C117.5 151.577 108.967 154.977 98.3 156.443L136.5 219.443H116.1Z"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                opacity="0.2"
                            />

                            {/* Filling path */}
                            <defs>
                                <clipPath id="fillClip">
                                    <rect x="75" y="74" width="88" height="147" className="fill-rect" />
                                </clipPath>
                            </defs>
                            <path
                                className="rupee-fill-path"
                                d="M116.1 219.443L78.3 153.443V144.643H82.7C89.7667 144.643 95.7 143.977 100.5 142.643C105.433 141.31 109.3 139.11 112.1 136.043C114.9 132.977 116.567 128.777 117.1 123.443H78.3V110.643H116.9C115.967 105.71 114.1 101.71 111.3 98.6434C108.5 95.4434 104.7 93.11 99.9 91.6433C95.2333 90.1767 89.5 89.4434 82.7 89.4434H78.3V76.6434H161.1V89.4434H123.3C126.367 91.9767 128.9 94.9767 130.9 98.4434C132.9 101.91 134.167 105.977 134.7 110.643H161.1V123.443H135.1C134.167 133.177 130.433 140.777 123.9 146.243C117.5 151.577 108.967 154.977 98.3 156.443L136.5 219.443H116.1Z"
                                fill="white"
                                clipPath="url(#fillClip)"
                            />
                        </svg>
                    </div>
                ) : (
                    <img
                        src={require('../assets/images/finkar-logo.svg')}
                        alt="Loading..."
                        className="loading-logo"
                        style={{ width: size, height: size }}
                    />
                )}
            </div>
            {message && !hideMessage && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingAnimation;
