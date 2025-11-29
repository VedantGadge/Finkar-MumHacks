import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './Profile.css';

export default function Profile({ onLogout, onBack }) {
    const { t, language, setLanguage } = useLanguage();
    const [userInfo, setUserInfo] = useState({
        phone: '',
        linkedBanks: []
    });
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    useEffect(() => {
        // Load user info from localStorage
        const phone = localStorage.getItem('finkar_phone') || '';
        const banks = JSON.parse(localStorage.getItem('finkar_banks') || '[]');
        setUserInfo({ phone, linkedBanks: banks });
    }, []);

    const handleLogout = () => {
        // Clear all stored data
        localStorage.removeItem('finkar_logged_in');
        localStorage.removeItem('finkar_phone');
        localStorage.removeItem('finkar_banks');
        localStorage.removeItem('finkar_user_id'); // Clear user ID
        localStorage.removeItem('finkar_chatbot_messages'); // Clear chat history

        if (onLogout) {
            onLogout();
        }
    };

    const bankNames = {
        'HDFC': 'HDFC Bank',
        'ICICI': 'ICICI Bank',
        'SBI': 'State Bank of India',
        'AXIS': 'Axis Bank',
        'KOTAK': 'Kotak Mahindra Bank'
    };

    return (
        <div className="profile-page">
            {/* Language Selection Modal */}
            {showLanguageModal && (
                <div className="language-modal-overlay" onClick={() => setShowLanguageModal(false)}>
                    <motion.div 
                        className="language-modal"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{t('profile.selectLanguage')}</h3>
                        <div className="language-options">
                            <button 
                                className={`language-option ${language === 'en' ? 'active' : ''}`}
                                onClick={() => { setLanguage('en'); setShowLanguageModal(false); }}
                            >
                                <span className="lang-flag">🇬🇧</span>
                                <span className="lang-name">{t('profile.english')}</span>
                                {language === 'en' && (
                                    <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </button>
                            <button 
                                className={`language-option ${language === 'hi' ? 'active' : ''}`}
                                onClick={() => { setLanguage('hi'); setShowLanguageModal(false); }}
                            >
                                <span className="lang-flag">🇮🇳</span>
                                <span className="lang-name">{t('profile.hindi')}</span>
                                {language === 'hi' && (
                                    <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button className="modal-close-btn" onClick={() => setShowLanguageModal(false)}>
                            {t('common.close')}
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Header */}
            <div className="profile-header">
                <button className="back-button" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {t('profile.title')}
                </motion.h1>

            </div>

            {/* Profile Avatar */}
            <motion.div
                className="profile-avatar-section"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <div className="profile-avatar">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 className="profile-name">{t('profile.user')}</h2>
                {userInfo.phone && (
                    <p className="profile-phone">+91 {userInfo.phone}</p>
                )}
            </motion.div>

            {/* Profile Sections */}
            <div className="profile-sections">
                {/* Account Info */}
                <motion.section
                    className="profile-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    <h3 className="section-title">{t('profile.accountInfo')}</h3>
                    <div className="section-card">
                        <div className="info-row">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.98C20.76 21 20.52 21 20.27 21C10.96 21 3.39 13.64 3.01 4.42C2.99 4.18 3 3.93 3 3.68C3.05 3.14 3.5 2.71 4.04 2.71H7.04C7.52 2.71 7.94 3.05 8.03 3.52C8.11 4.05 8.24 4.57 8.43 5.07C8.56 5.41 8.47 5.79 8.2 6.03L6.87 7.25C8.27 9.94 10.5 12.08 13.27 13.39L14.58 12.18C14.83 11.94 15.2 11.87 15.53 11.99C16.05 12.17 16.59 12.3 17.14 12.38C17.62 12.46 17.97 12.88 17.97 13.37V16.92C17.97 16.92 17.97 16.92 22 16.92Z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="info-content">
                                <span className="info-label">{t('profile.mobileNumber')}</span>
                                <span className="info-value">{userInfo.phone ? `+91 ${userInfo.phone}` : t('profile.notSet')}</span>
                            </div>
                        </div>
                        <div className="info-row">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#047857" strokeWidth="2" />
                                    <path d="M3 10H21" stroke="#047857" strokeWidth="2" />
                                    <path d="M7 15H13" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="info-content">
                                <span className="info-label">{t('profile.accountType')}</span>
                                <span className="info-value">{t('profile.personal')}</span>
                            </div>
                        </div>
                        <div className="info-row">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="info-content">
                                <span className="info-label">{t('profile.accountStatus')}</span>
                                <span className="info-value status-active">
                                    <span className="status-dot"></span>
                                    {t('profile.verified')}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Linked Banks */}
                <motion.section
                    className="profile-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                >
                    <h3 className="section-title">{t('profile.linkedBanks')}</h3>
                    <div className="section-card">
                        {userInfo.linkedBanks.length > 0 ? (
                            <div className="linked-banks-list">
                                {userInfo.linkedBanks.map((bankId, index) => (
                                    <div key={bankId} className="bank-item">
                                        <div className="bank-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 14V17M12 14V17M16 14V17" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="bank-info">
                                            <span className="bank-name">{bankNames[bankId] || bankId}</span>
                                            <span className="bank-status">{t('profile.connected')}</span>
                                        </div>
                                        <div className="bank-check">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-banks">
                                <p>{t('profile.noBanksLinked')}</p>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* App Settings */}
                <motion.section
                    className="profile-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                >
                    <h3 className="section-title">{t('profile.settings')}</h3>
                    <div className="section-card">
                        {/* Language Selector */}
                        <button className="settings-row" onClick={() => setShowLanguageModal(true)}>
                            <div className="settings-icon language-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="#047857" strokeWidth="2"/>
                                    <path d="M2 12H22" stroke="#047857" strokeWidth="2"/>
                                    <path d="M12 2C14.5 4.5 15.5 8 15.5 12C15.5 16 14.5 19.5 12 22C9.5 19.5 8.5 16 8.5 12C8.5 8 9.5 4.5 12 2Z" stroke="#047857" strokeWidth="2"/>
                                </svg>
                            </div>
                            <span className="settings-label">{t('profile.language')}</span>
                            <span className="settings-value">{language === 'hi' ? 'हिंदी' : 'English'}</span>
                            <svg className="settings-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="settings-row">
                            <div className="settings-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="settings-label">{t('profile.notifications')}</span>
                            <svg className="settings-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="settings-row">
                            <div className="settings-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="settings-label">{t('profile.privacySecurity')}</span>
                            <svg className="settings-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="settings-row">
                            <div className="settings-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2" />
                                    <path d="M19.4 15C19.2 15.3 19.1 15.7 19.2 16L19.8 18.1C19.9 18.5 19.7 18.9 19.3 19.1L17.3 20.3C17 20.5 16.6 20.5 16.3 20.2L14.6 18.8C14.4 18.6 14 18.6 13.7 18.8L12 20C11.7 20.2 11.3 20.2 11 20L9.3 18.8C9 18.6 8.6 18.6 8.4 18.8L6.7 20.2C6.4 20.5 6 20.5 5.7 20.3L3.7 19.1C3.3 18.9 3.1 18.5 3.2 18.1L3.8 16C3.9 15.7 3.8 15.3 3.6 15L2 13.7C1.7 13.4 1.7 13 2 12.7L3.6 11C3.8 10.7 3.9 10.3 3.8 10L3.2 7.9C3.1 7.5 3.3 7.1 3.7 6.9L5.7 5.7C6 5.5 6.4 5.5 6.7 5.8L8.4 7.2C8.6 7.4 9 7.4 9.3 7.2L11 6C11.3 5.8 11.7 5.8 12 6L13.7 7.2C14 7.4 14.4 7.4 14.6 7.2L16.3 5.8C16.6 5.5 17 5.5 17.3 5.7L19.3 6.9C19.7 7.1 19.9 7.5 19.8 7.9L19.2 10C19.1 10.3 19.2 10.7 19.4 11L21 12.3C21.3 12.6 21.3 13 21 13.3L19.4 15Z" stroke="#6B7280" strokeWidth="2" />
                                </svg>
                            </div>
                            <span className="settings-label">{t('profile.appPreferences')}</span>
                            <svg className="settings-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="settings-row">
                            <div className="settings-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2" />
                                    <path d="M12 16V12M12 8H12.01" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="settings-label">{t('profile.helpSupport')}</span>
                            <svg className="settings-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </motion.section>

                {/* App Info */}
                <motion.section
                    className="profile-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    <div className="app-info">
                        <span className="app-version">{t('profile.appVersion')}</span>
                        <span className="app-copyright">{t('profile.copyright')}</span>
                    </div>
                </motion.section>

                {/* Logout Button */}
                <motion.div
                    className="logout-section"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                >
                    <button className="logout-button" onClick={handleLogout}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {t('profile.logout')}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
