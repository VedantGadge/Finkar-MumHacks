import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, LaptopIcon, HomeIcon, RocketIcon, HeartIcon, LightningBoltIcon, BackpackIcon, CubeIcon, LayersIcon, PieChartIcon } from '@radix-ui/react-icons';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fetchTickers, generateCaseStudy, getTickerDisplayName, fetchMarketIndices, fetchSectorPerformance, fetchMultipleStockData, fetchNifty50Historical, fetchSensexHistorical, fetchBankNiftyHistorical } from '../utils/stockApi';
import { mapApiToStockData } from '../utils/stockMapper';
import useBackButton from '../hooks/useBackButton';
import IndexChart from '../components/IndexChart';
import { useLanguage } from '../contexts/LanguageContext';
import { loginUser, buyStock, sellStock, getLeaderboard } from '../services/userService';
import './Stocks.css';
import './GamifiedStocks.css';

const Stocks = () => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [availableTickers, setAvailableTickers] = useState([]);
    const [filteredTickers, setFilteredTickers] = useState([]);
    const [featuredTickers, setFeaturedTickers] = useState([]);
    const [marketIndices, setMarketIndices] = useState([]);
    const [sectorPerformance, setSectorPerformance] = useState([]);
    const [isLoadingTickers, setIsLoadingTickers] = useState(true);
    const [isLoadingCaseStudy, setIsLoadingCaseStudy] = useState(false);
    const [error, setError] = useState(null);
    const [loadedCaseStudies, setLoadedCaseStudies] = useState({});
    const [quickStockData, setQuickStockData] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
    const [nifty50Data, setNifty50Data] = useState(null);
    const [sensexData, setSensexData] = useState(null);
    const [bankNiftyData, setBankNiftyData] = useState(null);
    const carouselRef = useRef(null);
    const interactionTimeoutRef = useRef(null);
    const isInteractingRef = useRef(false);

    // Gamification State
    const [user, setUser] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [gamifiedTab, setGamifiedTab] = useState('market'); // market, portfolio, leaderboard
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [tradeQty, setTradeQty] = useState(1);
    const [tradeSuccess, setTradeSuccess] = useState(null);

    // Auto-scroll logic
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel || selectedStock) return;

        let animationId;
        let scrollPos = carousel.scrollLeft;
        const speed = 0.5;

        const animate = () => {
            if (!isInteractingRef.current) {
                scrollPos += speed;
                if (scrollPos >= carousel.scrollWidth / 2) {
                    scrollPos = 0;
                }
                carousel.scrollLeft = scrollPos;
            } else {
                // Sync scrollPos with actual scroll position when user is interacting
                scrollPos = carousel.scrollLeft;
            }
            animationId = requestAnimationFrame(animate);
        };

        const handleInteractionStart = () => {
            isInteractingRef.current = true;
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
        };

        const handleInteractionEnd = () => {
            // Delay resuming auto-scroll to allow for momentum scrolling
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
            interactionTimeoutRef.current = setTimeout(() => {
                isInteractingRef.current = false;
            }, 1500);
        };

        const handleMouseEnter = () => {
            isInteractingRef.current = true;
        };

        const handleMouseLeave = () => {
            isInteractingRef.current = false;
        };

        // Mouse events for desktop
        carousel.addEventListener('mouseenter', handleMouseEnter);
        carousel.addEventListener('mouseleave', handleMouseLeave);
        carousel.addEventListener('mousedown', handleInteractionStart);

        // Touch events for mobile
        carousel.addEventListener('touchstart', handleInteractionStart, { passive: true });
        carousel.addEventListener('touchend', handleInteractionEnd, { passive: true });

        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
            if (carousel) {
                carousel.removeEventListener('mouseenter', handleMouseEnter);
                carousel.removeEventListener('mouseleave', handleMouseLeave);
                carousel.removeEventListener('mousedown', handleInteractionStart);
                carousel.removeEventListener('touchstart', handleInteractionStart);
                carousel.removeEventListener('touchend', handleInteractionEnd);
            }
        };
    }, [featuredTickers, selectedStock]);


    // Fetch available tickers on mount and then fetch lightweight data for top 5-6
    useEffect(() => {
        const loadTickersAndData = async () => {
            try {
                setIsLoadingTickers(true);

                // Fetch static data in parallel
                const [indices, sectors, tickersData, nifty50, sensex, bankNifty] = await Promise.all([
                    fetchMarketIndices(),
                    fetchSectorPerformance(),
                    fetchTickers(),
                    fetchNifty50Historical('1mo'),
                    fetchSensexHistorical('1mo'),
                    fetchBankNiftyHistorical('1mo')
                ]);

                setMarketIndices(indices);
                setSectorPerformance(sectors);
                setNifty50Data(nifty50);
                setSensexData(sensex);
                setBankNiftyData(bankNifty);

                const tickers = tickersData.tickers || [];
                setAvailableTickers(tickers);
                setError(null);
                setIsLoadingTickers(false);

                if (tickers.length > 0) {
                    const topTickers = tickers.slice(0, 6);
                    setFeaturedTickers(topTickers);

                    // Fetch lightweight stock data for quick card display
                    const loadingState = {};
                    topTickers.forEach(ticker => loadingState[ticker] = true);
                    setLoadingStates(loadingState);

                    try {
                        console.log('Fetching lightweight stock data for featured tickers...');
                        const stockDataMap = await fetchMultipleStockData(topTickers);
                        setQuickStockData(stockDataMap);
                        console.log('✓ Loaded quick stock data:', Object.keys(stockDataMap).length, 'stocks');
                    } catch (e) {
                        console.error('Failed to fetch stock data:', e);
                    }

                    // Mark all as loaded
                    const finalLoadingState = {};
                    topTickers.forEach(ticker => finalLoadingState[ticker] = false);
                    setLoadingStates(finalLoadingState);
                    setIsInitialLoadComplete(true);
                }
            } catch (err) {
                console.error('Failed to load tickers:', err);
                setError('Failed to load stock tickers. Please try again later.');
                setIsLoadingTickers(false);
                setIsInitialLoadComplete(true);
            }
        };
        loadTickersAndData();
    }, []);

    // Load User Data for Gamification
    useEffect(() => {
        const initGame = async () => {
            try {
                const username = localStorage.getItem('finkar_username') || 'Vedant';
                const userData = await loginUser(username);
                setUser(userData);

                const lbData = await getLeaderboard();
                setLeaderboard(lbData);
            } catch (e) {
                console.error("Gamification init failed", e);
            }
        };
        initGame();
    }, []);

    const handleTrade = async () => {
        if (!selectedStock || !user) return;

        try {
            let updatedUser;
            const price = selectedStock.priceData.current;
            const username = user.username;

            if (tradeType === 'BUY') {
                updatedUser = await buyStock(username, selectedStock.ticker, parseInt(tradeQty), price);
                // Also add to quickStockData so it shows in portfolio correctly if needed
            } else {
                updatedUser = await sellStock(username, selectedStock.ticker, parseInt(tradeQty), price);
            }

            setUser(updatedUser);
            setShowTradeModal(false);
            setTradeSuccess(`Successfully ${tradeType === 'BUY' ? 'bought' : 'sold'} ${tradeQty} shares of ${selectedStock.ticker}`);
            setTimeout(() => setTradeSuccess(null), 3000);

            // Refresh leaderboard
            getLeaderboard().then(setLeaderboard);
        } catch (err) {
            alert(err.message);
        }
    };

    // Filter tickers based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredTickers([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = availableTickers.filter(ticker =>
            ticker.toLowerCase().includes(query) ||
            getTickerDisplayName(ticker).toLowerCase().includes(query)
        );
        setFilteredTickers(filtered.slice(0, 10));
    }, [searchQuery, availableTickers]);

    const handleStockSelect = async (ticker) => {
        if (loadedCaseStudies[ticker]) {
            setSelectedStock(loadedCaseStudies[ticker]);
            setCurrentLesson(0);
            setSearchQuery('');
            return;
        }

        try {
            setIsLoadingCaseStudy(true);
            setError(null);
            const caseStudyData = await generateCaseStudy(ticker);
            const mappedData = mapApiToStockData(caseStudyData);

            setLoadedCaseStudies(prev => ({ ...prev, [ticker]: mappedData }));

            setSelectedStock(mappedData);
            setCurrentLesson(0);
            setSearchQuery('');
        } catch (err) {
            console.error('Failed to generate case study:', err);
            setError(`Failed to load data for ${ticker}. Please try again.`);
        } finally {
            setIsLoadingCaseStudy(false);
        }
    };

    const handleBack = () => {
        setSelectedStock(null);
    };

    // Handle Android back button when in detail view
    useBackButton(
        selectedStock ? handleBack : null,
        10,
        [selectedStock]
    );

    const nextLesson = () => {
        if (selectedStock && currentLesson < selectedStock.lessons.length - 1) {
            setCurrentLesson(currentLesson + 1);
        }
    };

    const prevLesson = () => {
        if (currentLesson > 0) {
            setCurrentLesson(currentLesson - 1);
        }
    };

    const getSignalColor = (signal) => {
        if (signal.includes('BUY')) return '#047857';
        if (signal.includes('SELL')) return '#DC2626';
        return '#6B7280';
    };

    const getSentimentColor = (sentiment) => {
        if (sentiment === 'POSITIVE') return '#047857';
        if (sentiment === 'NEGATIVE') return '#DC2626';
        return '#6B7280';
    };

    const getChartPath = (data) => {
        if (!data || data.length === 0) return '';

        const width = 100;
        const height = 60;
        const padding = 5;

        const prices = data.map(d => d.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;

        const points = data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((d.price - minPrice) / priceRange) * (height - 2 * padding);
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    };

    if (selectedStock) {
        return (
            <div className="stocks-page">
                <motion.button
                    className="back-button"
                    onClick={handleBack}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <ChevronLeftIcon /> {t('stocks.backToStocks')}
                </motion.button>

                <motion.div
                    className="stock-detail-seamless"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <section className="detail-section-seamless">
                        <h2>{selectedStock.name}</h2>
                        <div className="stock-meta">
                            <span className="meta-badge">{selectedStock.sector}</span>
                            <span className="meta-separator">|</span>
                            <span className="meta-badge">{selectedStock.industry}</span>
                        </div>

                        {/* Gamified Actions */}
                        {user && (
                            <div className="buy-sell-actions">
                                <button className="action-btn btn-buy" onClick={() => { setTradeType('BUY'); setShowTradeModal(true); }}>
                                    Buy {selectedStock.ticker}
                                </button>
                                <button className="action-btn btn-sell" onClick={() => { setTradeType('SELL'); setShowTradeModal(true); }}>
                                    Sell {selectedStock.ticker}
                                </button>
                            </div>
                        )}

                        <div className="executive-summary">
                            <div className="summary-highlight">
                                <span className="signal-badge" style={{ background: getSignalColor(selectedStock.signal) }}>
                                    {selectedStock.signal}
                                </span>
                                <p className="summary-text">
                                    The stock has gained <strong>{selectedStock.priceData.changePercent}%</strong> over the past 30 days,
                                    while market sentiment remains <strong>{selectedStock.sentiment.overall.toLowerCase()}</strong>.
                                    Overall confidence in this assessment is <strong>{selectedStock.confidence}</strong>.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    <section className="detail-section-seamless">
                        <h3>{t('stocks.performanceAnalysis')}</h3>

                        <div className="price-stats">
                            <div className="stat-item">
                                <span className="stat-label">{t('stocks.startingPrice')}</span>
                                <span className="stat-value">₹{selectedStock.priceData.starting.toFixed(1)}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">{t('stocks.currentPrice')}</span>
                                <span className="stat-value primary">₹{selectedStock.priceData.current.toFixed(1)}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">{t('stocks.change')}</span>
                                <span className="stat-value positive">
                                    +₹{selectedStock.priceData.change.toFixed(1)} ({selectedStock.priceData.changePercent}%)
                                </span>
                            </div>
                        </div>

                        {selectedStock.chartData && (
                            <div className="chart-container-seamless">
                                <svg viewBox="0 0 100 60" className="price-chart" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#047857" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
                                        </linearGradient>
                                    </defs>
                                    <line x1="0" y1="15" x2="100" y2="15" stroke="#E5E7EB" strokeWidth="0.3" />
                                    <line x1="0" y1="30" x2="100" y2="30" stroke="#E5E7EB" strokeWidth="0.3" />
                                    <line x1="0" y1="45" x2="100" y2="45" stroke="#E5E7EB" strokeWidth="0.3" />
                                    <path
                                        d={`${getChartPath(selectedStock.chartData)} L 95,55 L 5,55 Z`}
                                        fill="url(#chartGradient)"
                                    />
                                    <motion.path
                                        d={getChartPath(selectedStock.chartData)}
                                        fill="none"
                                        stroke="#047857"
                                        strokeWidth="1.5"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <p className="chart-insight">
                                    <strong>{t('stocks.trend')}:</strong> {selectedStock.trend} |
                                    <strong> {t('stocks.volatility')}:</strong> {selectedStock.priceData.volatility}%
                                </p>
                            </div>
                        )}
                    </section>

                    <div className="section-divider"></div>

                    <section className="detail-section-seamless">
                        <h3>{t('stocks.sentimentAnalysis')}</h3>

                        <div className="sentiment-overview">
                            <div className="sentiment-header">
                                <span className="sentiment-label">{t('stocks.overallSentiment')}</span>
                                <span
                                    className="sentiment-badge"
                                    style={{ background: getSentimentColor(selectedStock.sentiment.overall) }}
                                >
                                    {selectedStock.sentiment.overall}
                                </span>
                            </div>

                            <div className="sentiment-metrics">
                                <div className="metric">
                                    <span>{t('stocks.compoundScore')}</span>
                                    <strong>{selectedStock.sentiment.compound}</strong>
                                </div>
                                <div className="metric">
                                    <span>{t('stocks.confidence')}</span>
                                    <strong>{selectedStock.sentiment.confidence.charAt(0).toUpperCase() + selectedStock.sentiment.confidence.slice(1)}</strong>
                                </div>
                                <div className="metric">
                                    <span>{t('stocks.articlesAnalyzed')}</span>
                                    <strong>{selectedStock.sentiment.articlesAnalyzed}</strong>
                                </div>
                            </div>

                        </div>
                    </section>

                    <div className="section-divider"></div>

                    <section className="detail-section-seamless">
                        <h3>{t('stocks.tradingSignal')}</h3>
                        <div className="trading-signal">
                            <div className="signal-main">
                                <span className="signal-label">{t('stocks.recommendation')}</span>
                                <span
                                    className="signal-value"
                                    style={{ color: getSignalColor(selectedStock.signal) }}
                                >
                                    {selectedStock.signal}
                                </span>
                            </div>
                            <div className="signal-details">
                                <span>{t('stocks.signalStrength')} <strong>{selectedStock.signalStrength}</strong></span>
                                <span>{t('stocks.confidence')} <strong>{selectedStock.confidence}</strong></span>
                            </div>
                        </div>
                    </section>

                    <div className="section-divider"></div>

                    {selectedStock.lessons && selectedStock.lessons.length > 0 && (
                        <section className="detail-section-seamless learning-section">
                            <h3>{t('stocks.tradingWisdom')}</h3>

                            <div className="lesson-carousel">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentLesson}
                                        className="lesson-card"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="lesson-number">
                                            {t('stocks.lesson')} {currentLesson + 1} {t('stocks.of')} {selectedStock.lessons.length}
                                        </div>
                                        <h4>{selectedStock.lessons[currentLesson].title}</h4>
                                        <p className="lesson-description">
                                            {selectedStock.lessons[currentLesson].description}
                                        </p>
                                        {selectedStock.lessons[currentLesson].tip && (
                                            <div className="lesson-tip">
                                                <strong>{t('stocks.financialTip')}</strong>
                                                <p>{selectedStock.lessons[currentLesson].tip}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <div className="carousel-controls">
                                    <button
                                        onClick={prevLesson}
                                        disabled={currentLesson === 0}
                                        className="carousel-btn"
                                    >
                                        <ChevronLeftIcon />
                                    </button>
                                    <div className="carousel-dots">
                                        {selectedStock.lessons.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`dot ${i === currentLesson ? 'active' : ''}`}
                                                onClick={() => setCurrentLesson(i)}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={nextLesson}
                                        disabled={currentLesson === selectedStock.lessons.length - 1}
                                        className="carousel-btn"
                                    >
                                        <ChevronRightIcon />
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </motion.div>

                {/* Trade Modal */}
                {showTradeModal && (
                    <div className="trade-modal-overlay">
                        <div className="trade-modal">
                            <div className="trade-header">
                                <h3>{tradeType === 'BUY' ? 'Buy' : 'Sell'} {selectedStock.ticker}</h3>
                                <button onClick={() => setShowTradeModal(false)}>✕</button>
                            </div>
                            <div className="input-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={tradeQty}
                                    onChange={(e) => setTradeQty(e.target.value)}
                                    className="qty-input"
                                />
                            </div>
                            <div className="trade-summary">
                                <div className="summary-row">
                                    <span>Price per share</span>
                                    <span>₹{selectedStock.priceData.current.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>₹{(selectedStock.priceData.current * tradeQty).toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="confirm-btn" style={{ background: tradeType === 'BUY' ? '#059669' : '#DC2626' }} onClick={handleTrade}>
                                Confirm {tradeType}
                            </button>
                        </div>
                    </div>
                )}

                {/* Success Toast */}
                {tradeSuccess && (
                    <motion.div
                        className="error-message"
                        style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #10b981' }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        ✓ {tradeSuccess}
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="stocks-page">
            {!isInitialLoadComplete && (
                <motion.div
                    className="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="loading-spinner"></div>
                    <p>{t('stocks.loadingCaseStudies')}</p>
                </motion.div>
            )}

            {/* Gamified Header */}
            {user && (
                <div className="stocks-header-gamified">
                    <div className="balance-info">
                        <h3>Total Balance</h3>
                        <div className="balance-amount">
                            <span>{user.finkirkBalance.toFixed(0)}</span>
                            <span className="currency-label">Finkirks</span>
                        </div>
                    </div>
                    <div>
                        {/* Placeholder for future stats */}
                    </div>
                </div>
            )}

            <div className="gamified-tabs">
                <button className={`gamified-tab ${gamifiedTab === 'market' ? 'active' : ''}`} onClick={() => setGamifiedTab('market')}>Market</button>
                <button className={`gamified-tab ${gamifiedTab === 'portfolio' ? 'active' : ''}`} onClick={() => setGamifiedTab('portfolio')}>Portfolio</button>
                <button className={`gamified-tab ${gamifiedTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setGamifiedTab('leaderboard')}>Leaderboard</button>
            </div>

            <AnimatePresence mode="wait">
                {gamifiedTab === 'market' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.h2
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45 }}
                        >
                            {t('stocks.title')}
                        </motion.h2>
                        <motion.p
                            className="page-subtitle"
                            initial={{ y: 18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.05 }}
                        >
                            {t('stocks.subtitle')}
                        </motion.p>

                        <motion.div
                            className="search-container"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <MagnifyingGlassIcon className="search-icon" />
                            <input
                                type="text"
                                placeholder={isLoadingTickers ? t('common.loading') : t('stocks.searchStocks')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                disabled={isLoadingTickers}
                            />

                            {searchQuery && filteredTickers.length > 0 && (
                                <motion.div
                                    className="search-dropdown"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {filteredTickers.map((ticker) => (
                                        <div
                                            key={ticker}
                                            className="search-result-item"
                                            onClick={() => handleStockSelect(ticker)}
                                        >
                                            <span className="ticker-symbol">{getTickerDisplayName(ticker)}</span>
                                            <span className="ticker-full">{ticker}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {searchQuery && filteredTickers.length === 0 && !isLoadingTickers && (
                                <motion.div
                                    className="search-dropdown"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="search-no-results">
                                        {t('stocks.noStocksFound')}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {isLoadingCaseStudy && (
                            <motion.div
                                className="loading-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="loading-spinner"></div>
                                <p>{t('stocks.generatingCaseStudy')}</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                className="error-message"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className="error-icon">⚠️</span>
                                {error}
                                <button onClick={() => setError(null)} className="error-close">×</button>
                            </motion.div>
                        )}

                        <section className="featured-section">
                            <h3>{t('stocks.featuredCompanies')}</h3>
                            <div className="stocks-carousel" ref={carouselRef}>
                                {[...featuredTickers, ...featuredTickers, ...featuredTickers, ...featuredTickers].map((symbol, index) => {
                                    const stockData = quickStockData[symbol];
                                    const isLoading = loadingStates[symbol];

                                    if (isLoading || !stockData) return (
                                        <motion.div
                                            key={`${symbol}-${index}`}
                                            className="stock-card-carousel loading"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.15 + (index % 4) * 0.05 }}
                                        >
                                            <div className="skeleton-header">
                                                <div>
                                                    <div className="skeleton skeleton-title"></div>
                                                    <div className="skeleton skeleton-subtitle"></div>
                                                </div>
                                                <div className="skeleton skeleton-badge"></div>
                                            </div>
                                            <div className="skeleton skeleton-price"></div>
                                            <div className="skeleton-footer">
                                                <div className="skeleton skeleton-text"></div>
                                                <div className="skeleton skeleton-signal"></div>
                                            </div>
                                        </motion.div>
                                    );

                                    const isPositive = stockData.price_change_pct >= 0;

                                    return (
                                        <motion.div
                                            key={`${symbol}-${index}`}
                                            className="stock-card-carousel"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.15 + (index % 4) * 0.05 }}
                                            onClick={() => handleStockSelect(symbol)}
                                        >
                                            <div className="stock-header">
                                                <div>
                                                    <h4>{symbol.replace('.NS', '')}</h4>
                                                    <p className="company-name">{getTickerDisplayName(symbol)}</p>
                                                </div>
                                                <span
                                                    className={`change-badge ${isPositive ? 'positive' : 'negative'}`}
                                                >
                                                    {isPositive ? '+' : ''}{stockData.price_change_pct}%
                                                </span>
                                            </div>
                                            <div className="stock-price">
                                                ₹{stockData.end_price.toFixed(1)}
                                            </div>
                                            <div className="stock-footer">
                                                <span className="stock-sector">{t('stocks.volatility')}: {stockData.volatility}%</span>
                                                <span
                                                    className="stock-signal"
                                                    style={{ color: isPositive ? '#047857' : '#DC2626' }}
                                                >
                                                    {isPositive ? t('stocks.gaining') : t('stocks.declining')}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </section>

                        {nifty50Data && nifty50Data.data && <IndexChart data={nifty50Data} title="Nifty 50" gradientId="niftyGradient" color="#047857" />}
                        {sensexData && sensexData.data && <IndexChart data={sensexData} title="Sensex" gradientId="sensexGradient" color="#2563eb" />}
                        {bankNiftyData && bankNiftyData.data && <IndexChart data={bankNiftyData} title="Bank Nifty" gradientId="bankNiftyGradient" color="#7c3aed" />}


                        <section className="sector-heatmap-section">
                            <h3>{t('stocks.sectorPerformance')}</h3>
                            <div className="sector-heatmap-grid">
                                {sectorPerformance.map((sector, i) => {
                                    const isPositive = sector.performance > 0;
                                    const isNeutral = Math.abs(sector.performance) < 0.5;
                                    const intensity = Math.min(Math.abs(sector.performance) / 3, 1);

                                    let backgroundColor;
                                    if (isNeutral) {
                                        backgroundColor = 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)';
                                    } else if (isPositive) {
                                        const baseIntensity = 0.08 + intensity * 0.25;
                                        const topIntensity = baseIntensity * 0.8;
                                        backgroundColor = `linear-gradient(135deg, rgba(16, 185, 129, ${topIntensity}) 0%, rgba(5, 150, 105, ${baseIntensity}) 100%)`;
                                    } else {
                                        const baseIntensity = 0.08 + intensity * 0.25;
                                        const topIntensity = baseIntensity * 0.8;
                                        backgroundColor = `linear-gradient(135deg, rgba(248, 113, 113, ${topIntensity}) 0%, rgba(220, 38, 38, ${baseIntensity}) 100%)`;
                                    }

                                    // Map sector names to icons
                                    const sectorIcons = {
                                        'IT': <LaptopIcon width={24} height={24} />,
                                        'Banking': <HomeIcon width={24} height={24} />,
                                        'Auto': <RocketIcon width={24} height={24} />,
                                        'Pharma': <HeartIcon width={24} height={24} />,
                                        'Energy': <LightningBoltIcon width={24} height={24} />,
                                        'FMCG': <BackpackIcon width={24} height={24} />,
                                        'Metals': <CubeIcon width={24} height={24} />,
                                        'Realty': <LayersIcon width={24} height={24} />
                                    };

                                    const icon = sectorIcons[sector.name] || <PieChartIcon width={24} height={24} />;

                                    return (
                                        <motion.div
                                            key={sector.name}
                                            className="sector-cell"
                                            style={{ background: backgroundColor }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 + i * 0.04 }}
                                            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)' }}
                                        >
                                            <div className="sector-cell-content">
                                                <span className="sector-icon-wrapper" style={{
                                                    color: isPositive ? '#047857' : isNeutral ? '#4B5563' : '#DC2626',
                                                    background: isPositive ? 'rgba(4, 120, 87, 0.1)' : isNeutral ? 'rgba(75, 85, 99, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '12px'
                                                }}>
                                                    {icon}
                                                </span>
                                                <div className="sector-info">
                                                    <span className="sector-name">{sector.name}</span>
                                                    <span className={`sector-performance ${isNeutral ? 'neutral' : isPositive ? 'positive' : 'negative'}`}>
                                                        {sector.performance > 0 ? '+' : ''}{sector.performance}%
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </section>
                    </motion.div>
                )}

                {gamifiedTab === 'portfolio' && (
                    <motion.div className="portfolio-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {!user || user.portfolio.length === 0 ? (
                            <div className="empty-state">
                                <p>You haven't invested in any stocks yet.</p>
                                <button className="continue-learning-btn" onClick={() => setGamifiedTab('market')}>Start Trading</button>
                            </div>
                        ) : (
                            <div className="portfolio-list">
                                {user.portfolio.map((item, idx) => {
                                    const currentPrice = quickStockData && quickStockData[item.ticker] ? quickStockData[item.ticker].end_price : item.averagePrice;
                                    const currentValue = currentPrice * item.quantity;
                                    const investValue = item.averagePrice * item.quantity;
                                    const gainLoss = currentValue - investValue;
                                    const gainLossPct = (gainLoss / investValue) * 100;

                                    return (
                                        <div key={idx} className="portfolio-item" onClick={() => handleStockSelect(item.ticker)}>
                                            <div className="portfolio-stock-info">
                                                <h4>{item.ticker.replace('.NS', '')}</h4>
                                                <div className="portfolio-stock-qty">{item.quantity} Shares • Avg ₹{item.averagePrice.toFixed(1)}</div>
                                            </div>
                                            <div className="portfolio-values">
                                                <span className="current-val">₹{currentValue.toFixed(1)}</span>
                                                <span className={`gain-loss ${gainLoss >= 0 ? 'positive' : 'negative'}`}>
                                                    {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(1)} ({gainLossPct.toFixed(1)}%)
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {gamifiedTab === 'leaderboard' && (
                    <motion.div className="leaderboard-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="leaderboard-list">
                            {leaderboard.map((u, idx) => (
                                <div key={idx} className="leaderboard-item">
                                    <div className={`rank top-${idx + 1}`}>{idx + 1}</div>
                                    <div className="user-info">
                                        <span className="user-name">{u.username === user?.username ? 'You' : u.username}</span>
                                        <span className="user-score">{u.achievements?.length || 0} Achievements</span>
                                    </div>
                                    <div className="user-balance">
                                        <strong>{u.finkirkBalance.toFixed(0)}</strong> <small>Finkirks</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Stocks;
