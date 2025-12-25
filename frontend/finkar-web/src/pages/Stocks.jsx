import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, LaptopIcon, HomeIcon, RocketIcon, HeartIcon, LightningBoltIcon, BackpackIcon, CubeIcon, LayersIcon, PieChartIcon } from '@radix-ui/react-icons';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fetchTickers, generateCaseStudy, getTickerDisplayName, fetchMarketIndices, fetchSectorPerformance, fetchMultipleStockData, fetchNifty50Historical, fetchSensexHistorical, fetchBankNiftyHistorical, fetchStockHistorical } from '../utils/stockApi';
import { mapApiToStockData } from '../utils/stockMapper';
import useBackButton from '../hooks/useBackButton';
import IndexChart from '../components/IndexChart';
import TechnicalStockChart from '../components/TechnicalStockChart';
import VolumeChart from '../components/VolumeChart';
import { calculateRSI, calculateSMA, calculateBollingerBands } from '../utils/technicalIndicators';
import { useLanguage } from '../contexts/LanguageContext';
import './Stocks.css';

// Animation variants - opacity only, no Y translation to prevent snapping
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

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
    const [historicalData, setHistoricalData] = useState([]);
    const [technicalIndicators, setTechnicalIndicators] = useState(null);
    const [historicalPeriod, setHistoricalPeriod] = useState('1mo');
    const carouselRef = useRef(null);
    const interactionTimeoutRef = useRef(null);
    const isInteractingRef = useRef(false);

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

    const fetchHistory = async (ticker, period) => {
        try {
            const history = await fetchStockHistorical(ticker, period);
            if (history && history.data) {
                setHistoricalData(history.data);

                // Calculate technical indicators
                const closes = history.data.map(d => d.close);
                const rsi = calculateRSI(closes, 14);
                const sma20 = calculateSMA(closes, 20);
                const sma50 = calculateSMA(closes, 50);
                const sma200 = calculateSMA(closes, 200);
                const bb = calculateBollingerBands(closes, 20, 2);

                setTechnicalIndicators({
                    rsi,
                    sma20,
                    sma50,
                    sma200,
                    bb
                });
            }
        } catch (histErr) {
            console.error('Failed to fetch historical data:', histErr);
        }
    };

    const handleStockSelect = async (ticker) => {
        if (loadedCaseStudies[ticker]) {
            setSelectedStock(loadedCaseStudies[ticker]);
            setCurrentLesson(0);
            setSearchQuery('');
            setHistoricalPeriod('1mo');
            fetchHistory(ticker, '1mo');
            return;
        }

        try {
            setIsLoadingCaseStudy(true);
            setError(null);
            const caseStudyData = await generateCaseStudy(ticker);
            const mappedData = mapApiToStockData(caseStudyData);

            setLoadedCaseStudies(prev => ({ ...prev, [ticker]: mappedData }));

            // Fetch historical data for candlestick chart
            setHistoricalPeriod('1mo');
            fetchHistory(ticker, '1mo');

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

    const handlePeriodChange = (period) => {
        if (!selectedStock) return;
        setHistoricalPeriod(period);
        fetchHistory(selectedStock.symbol, period);
    };

    const handleBack = () => {
        setSelectedStock(null);
        setHistoricalData([]);
        setTechnicalIndicators(null);
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

                        {/* Candlestick Chart from External API */}
                        <div className="chart-section-seamless">
                            <div className="chart-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3>Price Action</h3>
                                <div className="period-selector" style={{ display: 'flex', gap: '8px' }}>
                                    {['1mo', '3mo', '6mo'].map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => handlePeriodChange(period)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                background: historicalPeriod === period ? '#047857' : '#E5E7EB',
                                                color: historicalPeriod === period ? 'white' : '#374151',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {period === '1mo' ? '1M' : period === '3mo' ? '3M' : '6M'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {historicalData && historicalData.length > 0 ? (
                                <>
                                    <TechnicalStockChart
                                        data={historicalData}
                                        indicators={technicalIndicators}
                                        title={selectedStock.name}
                                    />
                                    <VolumeChart data={historicalData} />
                                </>
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', background: '#F9FAFB', borderRadius: '12px' }}>
                                    Loading chart data...
                                </div>
                            )}
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
                            {technicalIndicators?.rsi && (
                                <div className="stat-item">
                                    <span className="stat-label">RSI (14)</span>
                                    <span className="stat-value" style={{
                                        color: technicalIndicators.rsi.filter(x => x).slice(-1)[0] > 70 ? '#EF4444' :
                                            technicalIndicators.rsi.filter(x => x).slice(-1)[0] < 30 ? '#10B981' : '#6B7280'
                                    }}>
                                        {technicalIndicators.rsi.filter(x => x).slice(-1)[0]?.toFixed(1)}
                                        <span style={{ fontSize: '10px', marginLeft: '6px', fontWeight: '500', opacity: 0.8 }}>
                                            {technicalIndicators.rsi.filter(x => x).slice(-1)[0] > 70 ? 'Overbought' :
                                                technicalIndicators.rsi.filter(x => x).slice(-1)[0] < 30 ? 'Oversold' : 'Neutral'}
                                        </span>
                                    </span>
                                </div>
                            )}
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
            </div>
        );
    }

    return (
        <div className="stocks-page">


            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {t('stocks.title')}
            </motion.h2>
            <motion.p
                className="page-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
            >
                {t('stocks.subtitle')}
            </motion.p>

            <motion.div
                className="search-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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

            {/* Wrap main content in a staggered container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.section className="featured-section" variants={itemVariants}>
                    <h3>{t('stocks.featuredCompanies')}</h3>
                    <div className="stocks-carousel" ref={carouselRef}>
                        {isLoadingTickers ? (
                            /* Show dummy skeletons while tickers are loading */
                            Array(4).fill(0).map((_, index) => (
                                <motion.div
                                    key={`skeleton-${index}`}
                                    className="stock-card-carousel loading"
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
                            ))
                        ) : (
                            /* Actual Data Map */
                            [...featuredTickers, ...featuredTickers, ...featuredTickers, ...featuredTickers].map((symbol, index) => {
                                const stockData = quickStockData[symbol];
                                const isLoading = loadingStates[symbol];

                                if (isLoading || !stockData) return (
                                    <motion.div
                                        key={`${symbol}-${index}`}
                                        className="stock-card-carousel loading"
                                    // Remove individual animations here to let parent coordinate or keep simple
                                    // Keeping individual staggered entrance for cards could also work but might be too much.
                                    // Let's keep specific card animation but controlled by their own staggering if needed.
                                    // For simplicity in carousel, we just fade them in.
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
                                        onClick={() => handleStockSelect(symbol)}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
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
                            })
                        )}
                    </div>
                </motion.section>

                <motion.div variants={itemVariants}>
                    {nifty50Data && nifty50Data.data ? (
                        <IndexChart data={nifty50Data} title="Nifty 50" gradientId="niftyGradient" color="#047857" />
                    ) : (
                        <div className="index-chart-skeleton">
                            <div className="skeleton-chart-header">
                                <div className="skeleton skeleton-title-lg"></div>
                                <div className="skeleton skeleton-subtitle-sm"></div>
                            </div>
                            <div className="skeleton-chart-summary">
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                            </div>
                            <div className="skeleton-chart-area" style={{ height: window.innerWidth > 768 ? '400px' : window.innerWidth > 480 ? '280px' : '220px' }}>
                                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="skeleton-wave">
                                    <path d="M0,20 Q10,15 20,22 T40,18 T60,25 T80,15 T100,20" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    )}
                </motion.div>

                <motion.div variants={itemVariants}>
                    {sensexData && sensexData.data ? (
                        <IndexChart data={sensexData} title="Sensex" gradientId="sensexGradient" color="#2563eb" />
                    ) : (
                        <div className="index-chart-skeleton">
                            <div className="skeleton-chart-header">
                                <div className="skeleton skeleton-title-lg"></div>
                                <div className="skeleton skeleton-subtitle-sm"></div>
                            </div>
                            <div className="skeleton-chart-summary">
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                            </div>
                            <div className="skeleton-chart-area" style={{ height: window.innerWidth > 768 ? '400px' : window.innerWidth > 480 ? '280px' : '220px' }}>
                                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="skeleton-wave">
                                    <path d="M0,25 Q15,20 25,28 T50,22 T75,30 T100,25" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    )}
                </motion.div>

                <motion.div variants={itemVariants}>
                    {bankNiftyData && bankNiftyData.data ? (
                        <IndexChart data={bankNiftyData} title="Bank Nifty" gradientId="bankNiftyGradient" color="#7c3aed" />
                    ) : (
                        <div className="index-chart-skeleton">
                            <div className="skeleton-chart-header">
                                <div className="skeleton skeleton-title-lg"></div>
                                <div className="skeleton skeleton-subtitle-sm"></div>
                            </div>
                            <div className="skeleton-chart-summary">
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                                <div className="skeleton skeleton-stat"></div>
                            </div>
                            <div className="skeleton-chart-area" style={{ height: window.innerWidth > 768 ? '400px' : window.innerWidth > 480 ? '280px' : '220px' }}>
                                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="skeleton-wave">
                                    <path d="M0,22 Q12,18 22,26 T45,20 T68,28 T100,22" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    )}
                </motion.div>


                <motion.section className="sector-heatmap-section" variants={itemVariants}>
                    <h3>{t('stocks.sectorPerformance')}</h3>
                    <div className="sector-heatmap-grid">
                        {sectorPerformance.length === 0 ? (
                            /* Skeleton Cells */
                            Array(8).fill(0).map((_, i) => (
                                <div key={i} className="skeleton-sector-cell"></div>
                            ))
                        ) : (
                            sectorPerformance.map((sector, i) => {
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
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)', zIndex: 10 }}
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
                            })
                        )}
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default Stocks;
