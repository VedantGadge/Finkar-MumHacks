import React, { useState } from 'react';
import LoadingAnimation from '../components/LoadingAnimation';
import './LoadingDemo.css';

const LoadingDemo = () => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayVariant, setOverlayVariant] = useState('pulse');

    const showOverlayDemo = (variant) => {
        setOverlayVariant(variant);
        setShowOverlay(true);
        setTimeout(() => setShowOverlay(false), 3000);
    };

    return (
        <div className="loading-demo-page">
            <div className="demo-header">
                <h1>FinKar Loading Animations</h1>
                <p>Choose from multiple animation variants for your loading states</p>
            </div>

            <div className="demo-grid">
                {/* Pulse Variant */}
                <div className="demo-card">
                    <h3>Pulse</h3>
                    <p>Gentle scaling pulse effect</p>
                    <div className="demo-preview">
                        <LoadingAnimation variant="pulse" size={80} />
                    </div>
                    <button
                        className="demo-button"
                        onClick={() => showOverlayDemo('pulse')}
                    >
                        View Fullscreen
                    </button>
                </div>

                {/* Spin Variant */}
                <div className="demo-card">
                    <h3>Spin</h3>
                    <p>Smooth rotation animation</p>
                    <div className="demo-preview">
                        <LoadingAnimation variant="spin" size={80} />
                    </div>
                    <button
                        className="demo-button"
                        onClick={() => showOverlayDemo('spin')}
                    >
                        View Fullscreen
                    </button>
                </div>

                {/* Breathe Variant */}
                <div className="demo-card">
                    <h3>Breathe</h3>
                    <p>Opacity and scale breathing</p>
                    <div className="demo-preview">
                        <LoadingAnimation variant="breathe" size={80} />
                    </div>
                    <button
                        className="demo-button"
                        onClick={() => showOverlayDemo('breathe')}
                    >
                        View Fullscreen
                    </button>
                </div>

                {/* Bars Variant */}
                <div className="demo-card">
                    <h3>Bars</h3>
                    <p>Animated bars with pulse</p>
                    <div className="demo-preview">
                        <LoadingAnimation variant="bars" size={80} />
                    </div>
                    <button
                        className="demo-button"
                        onClick={() => showOverlayDemo('bars')}
                    >
                        View Fullscreen
                    </button>
                </div>

                {/* Fill Variant */}
                <div className="demo-card">
                    <h3>Fill</h3>
                    <p>Logo fills up from bottom</p>
                    <div className="demo-preview">
                        <LoadingAnimation variant="fill" size={80} />
                    </div>
                    <button
                        className="demo-button"
                        onClick={() => showOverlayDemo('fill')}
                    >
                        View Fullscreen
                    </button>
                </div>
            </div>

            {/* With Messages */}
            <div className="demo-section">
                <h2>With Loading Messages</h2>
                <div className="demo-grid">
                    <div className="demo-card">
                        <div className="demo-preview">
                            <LoadingAnimation
                                variant="fill"
                                size={60}
                                message="Loading your data..."
                            />
                        </div>
                    </div>
                    <div className="demo-card">
                        <div className="demo-preview">
                            <LoadingAnimation
                                variant="breathe"
                                size={60}
                                message="Fetching stock information..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline Variant */}
            <div className="demo-section">
                <h2>Inline Usage</h2>
                <div className="demo-card inline-demo">
                    <p>
                        Loading inline content
                        <span className="loading-inline">
                            <LoadingAnimation variant="spin" size={24} />
                        </span>
                    </p>
                </div>
            </div>

            {/* Code Examples */}
            <div className="demo-section">
                <h2>Usage Examples</h2>
                <div className="code-examples">
                    <div className="code-block">
                        <h4>Basic Usage</h4>
                        <pre>{`<LoadingAnimation variant="pulse" />`}</pre>
                    </div>
                    <div className="code-block">
                        <h4>With Custom Size</h4>
                        <pre>{`<LoadingAnimation 
  variant="fill" 
  size={120} 
/>`}</pre>
                    </div>
                    <div className="code-block">
                        <h4>With Message</h4>
                        <pre>{`<LoadingAnimation 
  variant="fill" 
  size={100}
  message="Loading..." 
/>`}</pre>
                    </div>
                    <div className="code-block">
                        <h4>Fullscreen Overlay</h4>
                        <pre>{`<div className="loading-overlay">
  <LoadingAnimation 
    variant="fill" 
    message="Please wait..." 
  />
</div>`}</pre>
                    </div>
                </div>
            </div>

            {/* Fullscreen Overlay Demo */}
            {showOverlay && (
                <div className="loading-overlay">
                    <LoadingAnimation
                        variant={overlayVariant}
                        size={120}
                        message="Loading featured case studies..."
                    />
                </div>
            )}
        </div>
    );
};

export default LoadingDemo;
