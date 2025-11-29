import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateOTP, verifyOTP, fetchFIPs, approveConsent } from '../services/authService';
import './Login.css';

// Step components
const PhoneInput = ({ phoneNumber, setPhoneNumber, onSubmit, isLoading, error }) => (
    <motion.div
        className="login-step"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
    >
        <div className="step-header">
            <motion.div 
                className="logo-mark"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <svg width="60" height="60" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M116.1 219.443L78.3 153.443V144.643H82.7C89.7667 144.643 95.7 143.977 100.5 142.643C105.433 141.31 109.3 139.11 112.1 136.043C114.9 132.977 116.567 128.777 117.1 123.443H78.3V110.643H116.9C115.967 105.71 114.1 101.71 111.3 98.6434C108.5 95.4434 104.7 93.11 99.9 91.6433C95.2333 90.1767 89.5 89.4434 82.7 89.4434H78.3V76.6434H161.1V89.4434H123.3C126.367 91.9767 128.9 94.9767 130.9 98.4434C132.9 101.91 134.167 105.977 134.7 110.643H161.1V123.443H135.1C134.167 133.177 130.433 140.777 123.9 146.243C117.5 151.577 108.967 154.977 98.3 156.443L136.5 219.443H116.1Z" fill="white" />
                </svg>
            </motion.div>
            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                Welcome to FinKar
            </motion.h1>
            <motion.p 
                className="step-subtitle"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                Enter your mobile number to get started
            </motion.p>
        </div>

        <motion.div 
            className="input-group"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
        >
            <label htmlFor="phone">Mobile Number</label>
            <div className="phone-input-wrapper">
                <span className="country-code">+91</span>
                <input
                    type="tel"
                    id="phone"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    autoComplete="tel"
                />
            </div>
            {error && <span className="error-message">{error}</span>}
        </motion.div>

        <motion.button
            className="primary-button"
            onClick={onSubmit}
            disabled={phoneNumber.length !== 10 || isLoading}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
        >
            {isLoading ? (
                <span className="loading-spinner"></span>
            ) : (
                'Get OTP'
            )}
        </motion.button>

        <motion.p 
            className="terms-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
        >
            By continuing, you agree to our <button type="button" className="link-button">Terms of Service</button> and <button type="button" className="link-button">Privacy Policy</button>
        </motion.p>
    </motion.div>
);

const OTPVerification = ({ phoneNumber, otp, setOtp, onSubmit, onResend, onBack, isLoading, error, resendTimer }) => {
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');
        setOtp(newOtp);
    };

    return (
        <motion.div
            className="login-step"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <button className="back-button" onClick={onBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            <div className="step-header">
                <motion.div 
                    className="step-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="2" width="14" height="20" rx="2" stroke="#047857" strokeWidth="2"/>
                        <line x1="9" y1="18" x2="15" y2="18" stroke="#047857" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Verify OTP
                </motion.h1>
                <motion.p 
                    className="step-subtitle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Enter the 6-digit code sent to<br />
                    <strong>+91 {phoneNumber}</strong>
                </motion.p>
            </div>

            <motion.div 
                className="otp-input-group"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onPaste={handlePaste}
            >
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="otp-input"
                        autoFocus={index === 0}
                    />
                ))}
            </motion.div>
            {error && <span className="error-message centered">{error}</span>}

            <motion.button
                className="primary-button"
                onClick={onSubmit}
                disabled={otp.some(d => !d) || isLoading}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
            >
                {isLoading ? <span className="loading-spinner"></span> : 'Verify'}
            </motion.button>

            <motion.div 
                className="resend-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                {resendTimer > 0 ? (
                    <p className="resend-timer">Resend OTP in <strong>{resendTimer}s</strong></p>
                ) : (
                    <button className="resend-button" onClick={onResend}>
                        Didn't receive OTP? <strong>Resend</strong>
                    </button>
                )}
            </motion.div>
        </motion.div>
    );
};

const BankSelection = ({ banks, selectedBanks, setSelectedBanks, onSubmit, onBack, isLoading, error }) => {
    const toggleBank = (bankId) => {
        setSelectedBanks(prev => 
            prev.includes(bankId) 
                ? prev.filter(id => id !== bankId)
                : [...prev, bankId]
        );
    };

    return (
        <motion.div
            className="login-step"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <button className="back-button" onClick={onBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            <div className="step-header">
                <motion.div 
                    className="step-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 14V17M12 14V17M16 14V17" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Select Your Banks
                </motion.h1>
                <motion.p 
                    className="step-subtitle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Choose the banks you want to link with FinKar
                </motion.p>
            </div>

            <motion.div 
                className="banks-grid"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {banks.map((bank, index) => (
                    <motion.div
                        key={bank.id}
                        className={`bank-card ${selectedBanks.includes(bank.id) ? 'selected' : ''}`}
                        onClick={() => toggleBank(bank.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="bank-logo">
                            <img 
                                src={bank.logo} 
                                alt={bank.name}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="bank-logo-fallback" style={{ display: 'none' }}>
                                {bank.name.charAt(0)}
                            </div>
                        </div>
                        <span className="bank-name">{bank.name}</span>
                        <div className="bank-checkbox">
                            {selectedBanks.includes(bank.id) && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            {error && <span className="error-message centered">{error}</span>}

            <motion.button
                className="primary-button"
                onClick={onSubmit}
                disabled={selectedBanks.length === 0 || isLoading}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.98 }}
            >
                {isLoading ? <span className="loading-spinner"></span> : `Continue with ${selectedBanks.length} Bank${selectedBanks.length !== 1 ? 's' : ''}`}
            </motion.button>
        </motion.div>
    );
};

const ConsentApproval = ({ selectedBanks, banks, onApprove, onBack, isLoading, error }) => {
    const selectedBankNames = banks.filter(b => selectedBanks.includes(b.id)).map(b => b.name);

    return (
        <motion.div
            className="login-step"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <button className="back-button" onClick={onBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            <div className="step-header">
                <motion.div 
                    className="step-icon shield"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12L11 14L15 10" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Approve Consent
                </motion.h1>
                <motion.p 
                    className="step-subtitle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Review and approve data sharing with FinKar
                </motion.p>
            </div>

            <motion.div 
                className="consent-card"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="consent-section">
                    <h3>Selected Banks</h3>
                    <div className="selected-banks-list">
                        {selectedBankNames.map((name, index) => (
                            <span key={index} className="bank-tag">{name}</span>
                        ))}
                    </div>
                </div>

                <div className="consent-section">
                    <h3>Data Access</h3>
                    <ul className="consent-list">
                        <li>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Account balance and summary
                        </li>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Transaction history
                        </li>
                        <li>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Profile information
                        </li>
                    </ul>
                </div>

                <div className="consent-section">
                    <h3>Purpose</h3>
                    <p className="consent-purpose">
                        To provide personalized financial insights, spending analysis, and help you achieve your financial goals.
                    </p>
                </div>

                <div className="consent-footer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#6B7280" strokeWidth="2"/>
                    </svg>
                    <span>Your data is encrypted and secure</span>
                </div>
            </motion.div>
            {error && <span className="error-message centered">{error}</span>}

            <motion.button
                className="primary-button"
                onClick={onApprove}
                disabled={isLoading}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
            >
                {isLoading ? <span className="loading-spinner"></span> : 'Approve & Continue'}
            </motion.button>
        </motion.div>
    );
};

const SuccessScreen = ({ onContinue }) => (
    <motion.div
        className="login-step success-step"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
    >
        <motion.div 
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#047857"/>
                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </motion.div>

        <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            You're All Set!
        </motion.h1>

        <motion.p 
            className="success-message"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            Your accounts have been successfully linked. Start managing your finances smarter with FinKar.
        </motion.p>

        <motion.button
            className="primary-button"
            onClick={onContinue}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileTap={{ scale: 0.98 }}
        >
            Go to Dashboard
        </motion.button>
    </motion.div>
);

// Main Login Component
export default function Login({ onLoginSuccess }) {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [banks, setBanks] = useState([]);
    const [selectedBanks, setSelectedBanks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const startResendTimer = () => {
        setResendTimer(30);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOTP = async () => {
        if (phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await generateOTP(phoneNumber);
            setStep(2);
            startResendTimer();
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await verifyOTP(phoneNumber, otpString);
            // Fetch banks after OTP verification
            const fipsData = await fetchFIPs();
            setBanks(fipsData.fips || []);
            setStep(3);
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        setError('');

        try {
            await generateOTP(phoneNumber);
            startResendTimer();
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBankSelection = () => {
        if (selectedBanks.length === 0) {
            setError('Please select at least one bank');
            return;
        }
        setError('');
        setStep(4);
    };

    const handleConsentApproval = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await approveConsent(phoneNumber, selectedBanks);
            // Store user_id from response (API returns user_id on successful consent)
            if (response && response.user_id) {
                localStorage.setItem('finkar_user_id', response.user_id.toString());
            }
            setStep(5);
        } catch (err) {
            setError('Failed to approve consent. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueToDashboard = () => {
        // Store login state
        localStorage.setItem('finkar_logged_in', 'true');
        localStorage.setItem('finkar_phone', phoneNumber);
        localStorage.setItem('finkar_banks', JSON.stringify(selectedBanks));
        
        if (onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <div className="login-container page-container">
            <div className="login-content">
                {/* Progress Indicator */}
                {step < 5 && (
                    <div className="progress-container">
                        <div className="progress-bar">
                            <motion.div 
                                className="progress-fill"
                                initial={{ width: '0%' }}
                                animate={{ width: `${(step / 4) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="progress-text">Step {step} of 4</span>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <PhoneInput
                            key="phone"
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            onSubmit={handleSendOTP}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}
                    {step === 2 && (
                        <OTPVerification
                            key="otp"
                            phoneNumber={phoneNumber}
                            otp={otp}
                            setOtp={setOtp}
                            onSubmit={handleVerifyOTP}
                            onResend={handleResendOTP}
                            onBack={() => { setStep(1); setError(''); }}
                            isLoading={isLoading}
                            error={error}
                            resendTimer={resendTimer}
                        />
                    )}
                    {step === 3 && (
                        <BankSelection
                            key="banks"
                            banks={banks}
                            selectedBanks={selectedBanks}
                            setSelectedBanks={setSelectedBanks}
                            onSubmit={handleBankSelection}
                            onBack={() => { setStep(2); setError(''); }}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}
                    {step === 4 && (
                        <ConsentApproval
                            key="consent"
                            selectedBanks={selectedBanks}
                            banks={banks}
                            onApprove={handleConsentApproval}
                            onBack={() => { setStep(3); setError(''); }}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}
                    {step === 5 && (
                        <SuccessScreen
                            key="success"
                            onContinue={handleContinueToDashboard}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
