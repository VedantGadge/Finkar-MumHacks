import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessage } from '../services/chatService';
import { translateHindiToEnglish, containsHindi } from '../services/translationService';
import { useLanguage } from '../contexts/LanguageContext';
import './Chatbot.css';

const STORAGE_KEY = 'finkar_chatbot_messages';
const SESSION_KEY = 'finkar_chatbot_session_id';

const Chatbot = () => {
    const { t } = useLanguage();

    // Session Management
    const [sessionId] = useState(() => {
        let sid = localStorage.getItem(SESSION_KEY);
        if (!sid) {
            sid = 'session_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(SESSION_KEY, sid);
        }
        return sid;
    });

    const userId = parseInt(localStorage.getItem('finkar_user_id') || '1', 10);
    const phoneNumber = localStorage.getItem('finkar_phone') || "9876543210";

    // Load messages from localStorage or use default greeting
    const [messages, setMessages] = useState(() => {
        try {
            const savedMessages = localStorage.getItem(STORAGE_KEY);
            if (savedMessages) {
                const parsed = JSON.parse(savedMessages);
                // Convert timestamp strings back to Date objects
                return parsed.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
        // Default greeting message
        return [
            {
                id: 1,
                text: "Hello! I'm your AI financial assistant. How can I help you today?",
                sender: "ai",
                timestamp: new Date()
            }
        ];
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Auto-scroll to bottom when new messages arrive or on mount
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }, [messages]);

    // Initialize speech recognition with multi-language support
    // Initialize speech recognition with multi-language support
    useEffect(() => {
        const initializeSpeech = async () => {
            if (Capacitor.isNativePlatform()) {
                // Native implementation
                try {
                    const { available } = await SpeechRecognition.available();
                    if (available) {
                        // Request permissions first
                        const hasPermission = await SpeechRecognition.checkPermissions();
                        if (hasPermission.speechRecognition !== 'granted' && hasPermission.speechRecognition !== 'limited') {
                            await SpeechRecognition.requestPermissions();
                        }
                    }
                } catch (e) {
                    console.error('Speech recognition not available:', e);
                }
            } else {
                // Web implementation
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SpeechRecognitionWeb = window.SpeechRecognition || window.webkitSpeechRecognition;
                    recognitionRef.current = new SpeechRecognitionWeb();
                    recognitionRef.current.continuous = false;
                    recognitionRef.current.interimResults = true;
                    recognitionRef.current.lang = 'hi-IN';
                    recognitionRef.current.maxAlternatives = 1;

                    recognitionRef.current.onresult = async (event) => {
                        const transcript = event.results[event.results.length - 1][0].transcript;
                        if (event.results[event.results.length - 1].isFinal) {
                            handleSpeechResult(transcript);
                        } else {
                            setInputValue(transcript);
                        }
                    };

                    recognitionRef.current.onerror = (event) => {
                        console.error('Speech recognition error:', event.error);
                        if (event.error === 'no-speech') {
                            setIsListening(false);
                            return;
                        }
                        if (event.error === 'not-allowed') {
                            setError('Microphone access denied.');
                        } else {
                            setError('Voice recognition failed.');
                        }
                        setIsListening(false);
                    };

                    recognitionRef.current.onend = () => {
                        setIsListening(false);
                    };
                }
            }
        };

        initializeSpeech();

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    // Helper to handle final speech result (common for verify/web)
    const handleSpeechResult = async (transcript) => {
        if (containsHindi(transcript)) {
            setInputValue(transcript);
            setIsTranslating(true);
            try {
                const translatedText = await translateHindiToEnglish(transcript);
                setInputValue(translatedText);
            } catch (err) {
                console.error('Translation failed:', err);
            } finally {
                setIsTranslating(false);
            }
        } else {
            setInputValue(transcript);
        }
        setIsListening(false);
    };

    // Toggle voice input with native support
    const toggleVoiceInput = async () => {
        if (Capacitor.isNativePlatform()) {
            // Native Logic
            if (isListening) {
                try {
                    await SpeechRecognition.stop();
                    setIsListening(false);
                } catch (e) {
                    console.error('Error stopping speech:', e);
                }
            } else {
                try {
                    setError(null);
                    setIsListening(true);

                    // Add listeners BEFORE starting
                    // Clear existing listeners first to avoid duplicates if any
                    await SpeechRecognition.removeAllListeners();

                    await SpeechRecognition.addListener('partialResults', (data) => {
                        if (data.matches && data.matches.length > 0) {
                            setInputValue(data.matches[0]);
                        }
                    });

                    // Some devices/versions use 'result' for final, or trigger it at end
                    await SpeechRecognition.addListener('result', (data) => {
                        if (data.matches && data.matches.length > 0) {
                            handleSpeechResult(data.matches[0]);
                        }
                    });

                    // Start listening
                    await SpeechRecognition.start({
                        language: "en-IN", // Broader support for Indian English/Hindi mix
                        maxResults: 1,
                        prompt: "Speak now",
                        partialResults: true,
                        popup: false,
                    });

                } catch (e) {
                    console.error('Error starting speech:', e);
                    setIsListening(false);
                    setError('Voice recognition failed. Check permissions.');
                }
            }

        } else {
            // Web Logic
            if (!recognitionRef.current) {
                setError('Voice recognition is not supported on this device.');
                return;
            }

            if (isListening) {
                recognitionRef.current.stop();
                setIsListening(false);
            } else {
                setError(null);
                setIsListening(true);
                recognitionRef.current.start();
            }
        }
    };

    // Text-to-speech function
    const speakText = (text) => {
        if (synthRef.current && 'speechSynthesis' in window) {
            // Cancel any ongoing speech
            synthRef.current.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            synthRef.current.speak(utterance);
        }
    };



    const handleSendMessage = async () => {
        const trimmedMessage = inputValue.trim();

        // Prevent sending empty messages
        if (!trimmedMessage || isLoading) return;

        // Add user message to chat
        const userMessage = {
            id: Date.now(),
            text: trimmedMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            // Call API
            const response = await sendMessage(sessionId, phoneNumber, trimmedMessage, userId);

            // Add AI response to chat
            const aiResponseText = response.response || response.message || "I received your message!";
            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponseText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            // Speak the AI response
            speakText(aiResponseText);
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message. Please try again.');

            // Optionally add error message to chat
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chatbot-page">
            {/* Header */}
            <motion.div
                className="chat-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2>{t('chatbot.title')}</h2>
                <p>{t('chatbot.subtitle')}</p>
            </motion.div>

            {/* Messages Container */}
            <div className="chat-messages" ref={messagesContainerRef}>
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            className={`message ${message.sender}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <div className="message-avatar">
                                {message.sender === 'ai' ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <div className="message-bubble">
                                    {message.sender === 'ai' ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                table: ({ node, ...props }) => (
                                                    <table style={{
                                                        borderCollapse: 'collapse',
                                                        width: '100%',
                                                        marginTop: '8px',
                                                        marginBottom: '8px',
                                                        fontSize: '13px'
                                                    }} {...props} />
                                                ),
                                                th: ({ node, ...props }) => (
                                                    <th style={{
                                                        border: '1px solid #E5E7EB',
                                                        padding: '8px',
                                                        backgroundColor: '#F3F4F6',
                                                        textAlign: 'left',
                                                        fontWeight: '600'
                                                    }} {...props} />
                                                ),
                                                td: ({ node, ...props }) => (
                                                    <td style={{
                                                        border: '1px solid #E5E7EB',
                                                        padding: '8px'
                                                    }} {...props} />
                                                ),
                                                code: ({ node, inline, ...props }) => (
                                                    inline ?
                                                        <code style={{
                                                            backgroundColor: '#F3F4F6',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontSize: '13px',
                                                            fontFamily: 'monospace'
                                                        }} {...props} /> :
                                                        <code style={{
                                                            display: 'block',
                                                            backgroundColor: '#F3F4F6',
                                                            padding: '12px',
                                                            borderRadius: '6px',
                                                            fontSize: '13px',
                                                            fontFamily: 'monospace',
                                                            overflowX: 'auto',
                                                            marginTop: '8px',
                                                            marginBottom: '8px'
                                                        }} {...props} />
                                                )
                                            }}
                                        >
                                            {message.text}
                                        </ReactMarkdown>
                                    ) : (
                                        message.text
                                    )}
                                </div>
                                <div className="message-time">
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isLoading && (
                    <motion.div
                        className="message ai"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="message-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    {error}
                </motion.div>
            )}

            {/* Input Area */}
            <motion.div
                className="chat-input-container"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="chat-input-wrapper">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        placeholder={isTranslating ? t('chatbot.thinking') : isListening ? "Listening... (English/Hindi)" : t('chatbot.placeholder')}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                        disabled={isLoading || isListening || isTranslating}
                    />
                    <button
                        className={`mic-button ${isListening ? 'listening' : ''} ${isTranslating ? 'translating' : ''}`}
                        onClick={toggleVoiceInput}
                        disabled={isLoading || isTranslating}
                        aria-label="Voice input"
                        title={isListening ? "Stop listening" : "Start voice input (English/Hindi)"}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                    </button>
                    <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading || isTranslating}
                        aria-label="Send message"
                    >
                        ➤
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Chatbot;
