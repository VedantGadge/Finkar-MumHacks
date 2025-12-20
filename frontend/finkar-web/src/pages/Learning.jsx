import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { awardFinkirks } from '../services/userService';
import './Learning.css';

// Learning Data - All 9 Modules
const learningModules = [
    {
        id: 1,
        title: "Personal Finance & Liquidity Management",
        difficulty: "beginner",
        lessons: [
            {
                id: "1.1",
                title: "The 50/30/20 Capital Allocation Framework",
                duration: "12 min",
                description: "Master the fundamental budgeting rule for financial discipline",
                content: {
                    sections: [
                        {
                            title: "Understanding the Framework",
                            text: "The 50/30/20 rule serves as a mechanism for enforcing financial discipline by categorizing net income into three rigid silos: Needs, Wants, and Savings. While conceptually simple, its successful implementation requires a rigorous definition of expense categories.",
                            highlight: "For an individual earning ₹1 Lakh monthly, ₹50,000 goes to Needs, ₹30,000 to Wants, and ₹20,000 to Savings & Investments."
                        },
                        {
                            title: "The Three Categories",
                            list: [
                                "50% NEEDS: Non-negotiable survival expenses - rent, groceries, utilities, insurance premiums, transportation for work",
                                "30% WANTS: Discretionary expenses - dining out, entertainment, vacations, shopping for non-essentials",
                                "20% SAVINGS: Strategic deployment into Mutual Funds (SIPs), ULIPs, Emergency Corpus, and wealth-generating instruments"
                            ]
                        },
                        {
                            title: "Adaptation for Households",
                            text: "For multi-income households, financial transparency is key. If income parity exists, a 50/50 split on shared Needs is equitable. In scenarios of income disparity, a proportional split is recommended - if one partner contributes 60% of income, they should absorb 60% of shared expenses."
                        }
                    ]
                }
            },
            {
                id: "1.2",
                title: "Debt Deleveraging Strategies",
                duration: "15 min",
                description: "Avalanche vs Snowball: Choose your debt repayment method",
                content: {
                    sections: [
                        {
                            title: "The Debt Avalanche Method",
                            text: "A mathematically superior strategy designed to minimize total interest paid. Sort all debts by APR from highest to lowest, make minimum payments on all accounts, and direct surplus liquidity toward the highest interest rate debt first.",
                            highlight: "Simulation data suggests the Avalanche method could save over ₹2 Lakhs in interest payments on a ₹80 Lakh debt portfolio."
                        },
                        {
                            title: "The Debt Snowball Method",
                            text: "Prioritizes liquidating the smallest absolute balances first, regardless of interest rate. The logic is rooted in behavioral finance - achieving 'quick wins' provides psychological momentum that reinforces the debt-repayment habit."
                        },
                        {
                            title: "Comparison",
                            table: {
                                headers: ["Feature", "Debt Avalanche", "Debt Snowball"],
                                rows: [
                                    ["Primary Goal", "Minimize Total Interest", "Maximize Motivation"],
                                    ["Sorting Criteria", "Highest Interest First", "Smallest Balance First"],
                                    ["Total Cost", "Lowest Cost", "Higher Cost"],
                                    ["Psychological Effect", "Delayed Gratification", "Immediate Wins"]
                                ]
                            }
                        }
                    ]
                }
            },
            {
                id: "1.3",
                title: "Emergency Fund Engineering",
                duration: "10 min",
                description: "Build your liquidity buffer against financial shocks",
                content: {
                    sections: [
                        {
                            title: "The 3-6-12 Rule",
                            list: [
                                "3 MONTHS: Single individuals with high job stability and no dependents",
                                "6 MONTHS: Married couples with children - higher overheads and correlated risks",
                                "12 MONTHS: Entrepreneurs, freelancers with irregular income, or those supporting dependent parents"
                            ]
                        },
                        {
                            title: "The Medical Inflation Factor",
                            text: "In India, medical inflation runs at approximately 14% annually - significantly higher than general CPI. Your emergency fund must account for deductibles and non-covered medical costs.",
                            highlight: "Calculate based on essential monthly expenses, NOT income. Include rent/EMI, food, utilities, school fees, and insurance premiums."
                        },
                        {
                            title: "Asset Location",
                            list: [
                                "RECOMMENDED: High-Yield Savings Accounts, Liquid Mutual Funds (T+1 redemption)",
                                "PROHIBITED: Stocks, Gold - market crashes correlate with job losses",
                                "ACCEPTABLE: Fixed Deposits (may incur premature withdrawal penalties)"
                            ]
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 2,
        title: "Sovereign & Fixed Income Instruments",
        difficulty: "beginner",
        lessons: [
            {
                id: "2.1",
                title: "Sovereign Gold Bonds (SGB)",
                duration: "14 min",
                description: "Gold investment without storage hassles + tax benefits",
                content: {
                    sections: [
                        {
                            title: "Structure & Mechanics",
                            text: "SGBs are denominated in grams of gold (999 purity) with minimum investment of one gram. Unlike physical gold, SGBs pay a fixed interest rate of 2.5% per annum credited semi-annually. Tenure is 8 years with exit options after 5th year.",
                            highlight: "Capital gains from SGB redemption at maturity (after 8 years) are ENTIRELY TAX EXEMPT for individuals."
                        },
                        {
                            title: "Taxation Framework",
                            list: [
                                "Interest (2.5% p.a.): Taxable at your slab rate under 'Income from Other Sources'",
                                "Maturity Redemption: 100% Tax Exempt on capital gains",
                                "Secondary Market Sale (>12 months): 12.5% LTCG without indexation",
                                "Secondary Market Sale (<12 months): Added to income, taxed at slab rate"
                            ]
                        }
                    ]
                }
            },
            {
                id: "2.2",
                title: "REITs & InvITs",
                duration: "16 min",
                description: "Retail participation in high-value real estate and infrastructure",
                content: {
                    sections: [
                        {
                            title: "Understanding the Structure",
                            text: "REITs (Real Estate Investment Trusts) and InvITs (Infrastructure Investment Trusts) function as 'pass-through' vehicles, pooling capital to own and operate income-generating assets. Both must distribute 90% of Net Distributable Cash Flows.",
                            table: {
                                headers: ["Feature", "REITs", "InvITs"],
                                rows: [
                                    ["Assets", "Offices, Malls, Hotels", "Highways, Power Lines, Pipelines"],
                                    ["Revenue", "Lease rentals, occupancy", "Tolls, tariffs, availability fees"],
                                    ["Growth Driver", "Urbanization, Consumption", "Industrial activity, Govt capex"]
                                ]
                            }
                        },
                        {
                            title: "Taxation Complexity",
                            list: [
                                "Dividend Income: Taxable at your slab rate",
                                "Interest Income: Taxable at your slab rate",
                                "STCG (Sale <12 months): 20% tax",
                                "LTCG (Sale >12 months): 12.5% tax"
                            ]
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 3,
        title: "The Passive Investment Ecosystem",
        difficulty: "intermediate",
        lessons: [
            {
                id: "3.1",
                title: "ETFs vs Index Funds",
                duration: "13 min",
                description: "Choose the right passive vehicle for your investment style",
                content: {
                    sections: [
                        {
                            title: "Exchange Traded Funds (ETFs)",
                            list: [
                                "Traded like stocks - requires Demat account",
                                "Real-time pricing throughout trading day",
                                "Lower expense ratios (as low as 0.04%)",
                                "Brokerage fees and STT on every trade",
                                "Liquidity risk: Bid-Ask spread can widen in low volumes"
                            ]
                        },
                        {
                            title: "Index Funds",
                            list: [
                                "Open-ended mutual funds at end-of-day NAV",
                                "Slightly higher expense ratios (0.19%-0.25%)",
                                "No brokerage charges or STT for investor",
                                "Guaranteed liquidity by AMC at NAV",
                                "Supports SIPs and automated bank mandates"
                            ]
                        },
                        {
                            title: "Strategic Verdict",
                            highlight: "For average retail investors focused on long-term wealth via SIPs, Index Funds are SUPERIOR. ETFs suit tactical traders and HNI investors executing large lump-sum trades."
                        }
                    ]
                }
            },
            {
                id: "3.2",
                title: "Smart Beta & Factor Investing",
                duration: "18 min",
                description: "Alternative weighting strategies that historically beat the market",
                content: {
                    sections: [
                        {
                            title: "Core Factors",
                            list: [
                                "MOMENTUM: Stocks with strong recent price performance (Nifty 200 Momentum 30)",
                                "LOW VOLATILITY: Lowest standard deviation - defensive during turbulence",
                                "QUALITY: High ROE, low debt-to-equity, stable earnings growth",
                                "VALUE: Undervalued stocks (low P/E, low P/B ratios)"
                            ]
                        },
                        {
                            title: "Performance & Risks",
                            text: "Smart Beta indices often outperform vanilla Nifty 50 over 5-year rolling periods. However, factors are CYCLICAL - a Value strategy may underperform Growth for years before mean-reverting.",
                            highlight: "Either time factors (difficult) or diversify across uncorrelated factors for consistent performance."
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 4,
        title: "Equity Market Mechanics",
        difficulty: "intermediate",
        lessons: [
            {
                id: "4.1",
                title: "Corporate Actions: Ex-Date vs Record Date",
                duration: "11 min",
                description: "Understand dividend, split, and bonus entitlement timelines",
                content: {
                    sections: [
                        {
                            title: "The Critical Timeline",
                            list: [
                                "Declaration Date: Board announces the corporate action",
                                "Record Date: Company reviews share registry for eligible shareholders",
                                "Ex-Date: Stock begins trading WITHOUT the corporate action value (T-1 before Record Date)"
                            ]
                        },
                        {
                            title: "The Entitlement Rule",
                            text: "With India's T+1 settlement cycle, you must buy shares ON OR BEFORE the day PRIOR to Ex-Date to receive the dividend. Buying on Ex-Date or Record Date is too late.",
                            highlight: "If a company declares ₹10 dividend, expect the stock price to drop by approximately ₹10 when markets open on Ex-Date."
                        }
                    ]
                }
            },
            {
                id: "4.2",
                title: "IPO Analysis: RHP, GMP & Valuation",
                duration: "15 min",
                description: "Navigate IPO hype with fundamental analysis",
                content: {
                    sections: [
                        {
                            title: "Red Herring Prospectus (RHP) Analysis",
                            list: [
                                "Use of Proceeds: 'Capex/Expansion' = growth signal. '100% OFS' = existing investors cashing out (red flag)",
                                "Litigation & Risks: Check pending lawsuits, regulatory issues, client dependency",
                                "Promoter Quality: Background checks for management changes or prior regulatory issues"
                            ]
                        },
                        {
                            title: "Grey Market Premium (GMP)",
                            text: "GMP is the unofficial premium at which IPO shares trade before listing. High GMP indicates strong demand but it's an unregulated, opaque indicator that can be manipulated.",
                            highlight: "Treat GMP as a SENTIMENT GAUGE, not a valuation metric. High QIB subscription is stronger validation."
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 5,
        title: "Macroeconomic Drivers",
        difficulty: "intermediate",
        lessons: [
            {
                id: "5.1",
                title: "Interest Rate Cycles & Sectoral Impact",
                duration: "14 min",
                description: "How RBI's Repo Rate affects different sectors",
                content: {
                    sections: [
                        {
                            title: "Transmission Mechanism",
                            text: "The Repo Rate is the benchmark rate at which RBI lends to commercial banks. A cut lowers banks' cost of funds, which they pass to borrowers via reduced floating-rate loan interest.",
                            highlight: "A 50 bps (0.5%) rate cut can significantly reduce EMIs, stimulating demand for housing and vehicles."
                        },
                        {
                            title: "Sectoral Sensitivity",
                            list: [
                                "AUTO & REAL ESTATE: Highly rate-elastic - rally on rate cut announcements",
                                "BANKING: Nuanced - rate cuts compress NIMs but credit volume usually expands; bond portfolios gain (prices rise when rates fall)"
                            ]
                        }
                    ]
                }
            },
            {
                id: "5.2",
                title: "Inflation Dynamics: CPI vs WPI",
                duration: "12 min",
                description: "Understanding the lag effect and margin analysis",
                content: {
                    sections: [
                        {
                            title: "The Two Indices",
                            table: {
                                headers: ["Index", "Measures", "Key Weights"],
                                rows: [
                                    ["WPI", "Producer/Wholesale level", "Manufactured goods, commodities"],
                                    ["CPI", "Retail/Consumer level", "Food (~46%), Services"]
                                ]
                            }
                        },
                        {
                            title: "The Lag Effect",
                            text: "WPI often acts as a LEADING indicator for CPI. When WPI rises (input costs increase), companies either absorb the cost (hitting margins) or pass it on (raising CPI).",
                            highlight: "High WPI + Low CPI = Companies struggling with input costs but can't raise prices = MARGIN COMPRESSION = Bearish for manufacturing stocks"
                        }
                    ]
                }
            },
            {
                id: "5.3",
                title: "Global Liquidity & The Fed Effect",
                duration: "13 min",
                description: "How US monetary policy impacts Indian markets",
                content: {
                    sections: [
                        {
                            title: "Interest Rate Differentials",
                            text: "Global capital seeks the best risk-adjusted yield. When US Fed raises rates, US Treasury yields increase, narrowing the gap with Indian yields and making India relatively less attractive.",
                            list: [
                                "Equity Outflows: FIIs sell Nifty/Sensex holdings",
                                "Currency Impact: INR depreciates (selling INR to buy USD)"
                            ]
                        },
                        {
                            title: "IT Sector Correlation",
                            highlight: "Indian IT is INVERSELY correlated to Rupee but POSITIVELY correlated to US economy. Fed rate hike dampens IT demand, but Rupee weakness hedges by increasing INR value of dollar revenues."
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 6,
        title: "Technical Analysis & Charting",
        difficulty: "advanced",
        lessons: [
            {
                id: "6.1",
                title: "Moving Averages & Trend Identification",
                duration: "14 min",
                description: "SMA, EMA, and the Golden/Death Cross",
                content: {
                    sections: [
                        {
                            title: "SMA vs EMA",
                            text: "Simple Moving Average (SMA) treats all data points equally. Exponential Moving Average (EMA) weights recent prices more heavily, making it more responsive. Traders prefer EMAs (9-day, 20-day) for short-term signals.",
                            formula: "EMA = Price(t) × k + EMA(y) × (1−k)\nwhere k = 2 / (N+1)"
                        },
                        {
                            title: "Crossover Strategies",
                            list: [
                                "GOLDEN CROSS: 50-day MA crosses ABOVE 200-day MA = Long-term BULL signal",
                                "DEATH CROSS: 50-day MA crosses BELOW 200-day MA = Long-term BEAR signal"
                            ],
                            highlight: "Buy when Price > EMA. Sell when Price < EMA. In range-bound markets, this generates 'whipsaws' (false signals)."
                        }
                    ]
                }
            },
            {
                id: "6.2",
                title: "MACD & Bollinger Bands",
                duration: "16 min",
                description: "Momentum oscillators and volatility channels",
                content: {
                    sections: [
                        {
                            title: "MACD (Moving Average Convergence Divergence)",
                            text: "Calculated by subtracting 26-period EMA from 12-period EMA. A 9-period EMA of the result serves as the 'Signal Line'.",
                            list: [
                                "BUY: MACD line crosses ABOVE Signal Line",
                                "SELL: MACD line crosses BELOW Signal Line",
                                "Histogram shrinking = Momentum fading = Reversal incoming"
                            ]
                        },
                        {
                            title: "Bollinger Bands",
                            text: "Central SMA (20-day) with two outer bands at 2 standard deviations. They adapt dynamically to volatility.",
                            highlight: "THE SQUEEZE: When bands contract tightly, expect HIGH VOLATILITY expansion. Enter in direction of breakout."
                        }
                    ]
                }
            },
            {
                id: "6.3",
                title: "Chart Patterns & Fibonacci",
                duration: "18 min",
                description: "Head & Shoulders, Cup & Handle, and Golden Ratio levels",
                content: {
                    sections: [
                        {
                            title: "Head and Shoulders (Bearish Reversal)",
                            text: "Three peaks: higher middle peak (Head) flanked by two lower peaks (Shoulders). Signifies exhaustion of buyers.",
                            list: [
                                "Left Shoulder: Existing uptrend",
                                "Head: Final push that fails to hold",
                                "Right Shoulder: Lower high confirming bulls are weak",
                                "TRADE: Short on Neckline break. Target = Head-to-Neckline distance. Stop above right shoulder."
                            ]
                        },
                        {
                            title: "Fibonacci Retracements",
                            text: "Based on the Golden Ratio (1.618). Draw from Swing Low to Swing High in an uptrend. Key levels: 23.6%, 38.2%, 61.8%.",
                            highlight: "A correcting stock in uptrend is likely to find buyers at 61.8% or 38.2% levels. Use candlestick patterns for entry confirmation."
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 7,
        title: "Derivatives & Options Trading",
        difficulty: "advanced",
        lessons: [
            {
                id: "7.1",
                title: "Option Basics & The Greeks",
                duration: "15 min",
                description: "Calls, Puts, and the risk profiles of buyers vs sellers",
                content: {
                    sections: [
                        {
                            title: "The Fundamentals",
                            list: [
                                "CALL Option: Right to BUY. Profitable when market RISES.",
                                "PUT Option: Right to SELL. Profitable when market FALLS.",
                                "BUYERS: Limited risk (premium paid), unlimited profit potential",
                                "SELLERS: Unlimited risk, limited profit (premium received). Benefit from Theta Decay."
                            ]
                        },
                        {
                            title: "Option Greeks",
                            table: {
                                headers: ["Greek", "Measures", "Impact"],
                                rows: [
                                    ["Delta", "Price sensitivity", "How much option moves per ₹1 stock move"],
                                    ["Theta", "Time decay", "Value erosion as expiry approaches"],
                                    ["Vega", "Volatility sensitivity", "Impact of IV changes"],
                                    ["Gamma", "Delta acceleration", "Rate of Delta change"]
                                ]
                            }
                        }
                    ]
                }
            },
            {
                id: "7.2",
                title: "Spread Strategies",
                duration: "17 min",
                description: "Bull Call Spread & Bear Put Spread for defined risk",
                content: {
                    sections: [
                        {
                            title: "Bull Call Spread (Moderately Bullish)",
                            text: "Construction: Buy 1 ATM Call + Sell 1 OTM Call. The premium received subsidizes the cost.",
                            list: [
                                "Net Debit = Premium Paid (ATM) - Premium Received (OTM)",
                                "Max Loss = Net Debit",
                                "Max Profit = (Strike Difference) - Net Debit",
                                "Breakeven = Lower Strike + Net Debit"
                            ]
                        },
                        {
                            title: "Bear Put Spread (Moderately Bearish)",
                            text: "Construction: Buy 1 ATM Put + Sell 1 OTM Put. Reduces cost of betting on downside.",
                            highlight: "Breakeven = Higher Strike - Net Debit"
                        }
                    ]
                }
            },
            {
                id: "7.3",
                title: "Non-Directional Strategies",
                duration: "20 min",
                description: "Straddles, Iron Condors, and Covered Calls",
                content: {
                    sections: [
                        {
                            title: "The Straddle",
                            list: [
                                "LONG STRADDLE: Buy ATM Call + ATM Put. Expect MASSIVE move (Budget Day, Elections) but don't know direction.",
                                "SHORT STRADDLE: Sell ATM Call + ATM Put. Expect FLAT market. UNLIMITED RISK if market trends."
                            ]
                        },
                        {
                            title: "Iron Condor (Range-Bound with Defined Risk)",
                            text: "4 Legs: Sell OTM Call + Sell OTM Put (income legs) + Buy Further OTM Call + Buy Further OTM Put (protection legs).",
                            highlight: "Protection legs cap maximum loss. Lower SEBI margin requirements than naked short straddle = Better ROC."
                        },
                        {
                            title: "Covered Call",
                            text: "Hold underlying Stock + Sell OTM Call options. Generate 'rental income' from stagnant portfolio. If stock rises past strike, sell at profit + keep premium. If it falls, premium offsets some loss."
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 8,
        title: "Trading Psychology & Algorithms",
        difficulty: "expert",
        lessons: [
            {
                id: "8.1",
                title: "Cognitive Biases & Emotional Traps",
                duration: "14 min",
                description: "The psychological errors that destroy trading accounts",
                content: {
                    sections: [
                        {
                            title: "The Fatal Biases",
                            list: [
                                "LOSS AVERSION: Pain of loss is 2x intensity of gain pleasure. Leads to holding losers, cutting winners early.",
                                "CONFIRMATION BIAS: Consuming only news supporting your view while filtering contradictory evidence.",
                                "SUNK COST FALLACY: 'Averaging down' on broken stocks because you've already invested time/capital.",
                                "GAMBLER'S FALLACY: 'It went up too much, must fall now.' Markets have no memory.",
                                "FOMO: Entering late in rallies due to social pressure. Usually buying at the top."
                            ]
                        }
                    ]
                }
            },
            {
                id: "8.2",
                title: "Systematic vs Discretionary Trading",
                duration: "12 min",
                description: "Rules-based approaches as emotional safety harnesses",
                content: {
                    sections: [
                        {
                            title: "The Two Approaches",
                            table: {
                                headers: ["Aspect", "Discretionary", "Systematic"],
                                rows: [
                                    ["Decision Making", "Intuition, real-time judgment", "Fixed rules ('If Price > 200 EMA, Buy')"],
                                    ["Flexibility", "High", "Low"],
                                    ["Bias Susceptibility", "Very High", "Minimal"],
                                    ["Backtesting", "Not possible", "Fully verifiable"]
                                ]
                            }
                        },
                        {
                            title: "The Verdict",
                            highlight: "For most retail traders, a SYSTEMATIC approach acts as a safety harness against emotional self-sabotage. Rules protect you from yourself."
                        }
                    ]
                }
            },
            {
                id: "8.3",
                title: "SEBI Algo Trading Regulations (2025)",
                duration: "10 min",
                description: "Compliance requirements for algorithmic trading in India",
                content: {
                    sections: [
                        {
                            title: "Key Regulations",
                            list: [
                                "EXCHANGE APPROVAL: Every algorithm must be approved before deployment",
                                "UNIQUE STRATEGY ID: Every algo order is tagged for regulatory tracing",
                                "RETAIL RESTRICTIONS: Cannot use 'Open APIs' to fire orders from unverified code/servers",
                                "IP WHITELISTING: Must use broker-hosted solutions with static, whitelisted IP addresses"
                            ]
                        },
                        {
                            title: "Purpose",
                            highlight: "Regulations prevent malfunctioning loops from crashing exchanges and enable tracing market manipulation back to specific code and users."
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 9,
        title: "Taxation & Regulatory Compliance",
        difficulty: "expert",
        lessons: [
            {
                id: "9.1",
                title: "Capital Gains Tax Regime (FY 2024-25)",
                duration: "16 min",
                description: "The new tax structure and its impact on investment strategy",
                content: {
                    sections: [
                        {
                            title: "Equity Taxation",
                            list: [
                                "STCG (<12 months): 20% (previously 15%)",
                                "LTCG (>12 months): 12.5% (previously 10%)",
                                "Annual LTCG Exemption: ₹1.25 Lakh (increased from ₹1 Lakh)"
                            ]
                        },
                        {
                            title: "Non-Equity (Debt Funds, Gold, Real Estate)",
                            text: "MAJOR CHANGE: Removal of indexation benefit for long-term capital assets. Now taxed at flat 12.5% without inflation adjustment.",
                            highlight: "This is NEGATIVE for debt funds in high-inflation environments. The lower rate of 12.5% (vs 20%) may benefit assets with massive appreciation."
                        },
                        {
                            title: "Tax Efficiency Strategy",
                            text: "With higher STCG on equity (20%), the incentive to 'churn' portfolios has DECREASED. The tax code now heavily favors long-term holding (>12 months) to access the lower 12.5% rate and ₹1.25 Lakh exemption.",
                            highlight: "The premium on PATIENCE has never been higher. Hold for >12 months whenever possible."
                        }
                    ]
                }
            }
        ]
    }
];

// Helper to get user progress from localStorage
const getProgress = () => {
    const saved = localStorage.getItem('finkar_learning_progress');
    return saved ? JSON.parse(saved) : { completedLessons: [], currentLesson: null };
};

const saveProgress = (progress) => {
    localStorage.setItem('finkar_learning_progress', JSON.stringify(progress));
};

const Learning = () => {
    const { t } = useLanguage();
    const [expandedModule, setExpandedModule] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [progress, setProgress] = useState(getProgress());
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        saveProgress(progress);
    }, [progress]);

    const totalLessons = learningModules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedCount = progress.completedLessons.length;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);

    const toggleModule = (moduleId) => {
        setExpandedModule(expandedModule === moduleId ? null : moduleId);
    };

    const openLesson = (lesson, moduleId) => {
        setSelectedLesson({ ...lesson, moduleId });
    };

    const closeLesson = () => {
        setSelectedLesson(null);
    };

    const completeLesson = (lessonId) => {
        if (!progress.completedLessons.includes(lessonId)) {
            setProgress({
                ...progress,
                completedLessons: [...progress.completedLessons, lessonId]
            });

            // Gamification: Award Finkirks
            const username = localStorage.getItem('finkar_username') || 'Vedant';
            awardFinkirks(username, 50, `Completed lesson: ${lessonId}`)
                .then(u => alert(`Congratulations! You earned 50 Finkirks! New Balance: ${u.finkirkBalance}`))
                .catch(e => console.error("Failed to award finkirks", e));
        }
    };

    const isLessonCompleted = (lessonId) => progress.completedLessons.includes(lessonId);

    const getModuleProgress = (module) => {
        const completed = module.lessons.filter(l => isLessonCompleted(l.id)).length;
        return Math.round((completed / module.lessons.length) * 100);
    };

    // Generate PDF content for a lesson
    const downloadLessonAsPDF = (lesson) => {
        let content = `${lesson.title}\n${'='.repeat(lesson.title.length)}\n\n`;
        content += `Duration: ${lesson.duration}\n`;
        content += `${lesson.description}\n\n`;
        content += `${'─'.repeat(50)}\n\n`;

        lesson.content.sections.forEach((section) => {
            content += `${section.title}\n${'-'.repeat(section.title.length)}\n\n`;

            if (section.text) {
                content += `${section.text}\n\n`;
            }

            if (section.highlight) {
                content += `► KEY INSIGHT:\n${section.highlight}\n\n`;
            }

            if (section.list) {
                section.list.forEach((item, i) => {
                    content += `  • ${item}\n`;
                });
                content += '\n';
            }

            if (section.table) {
                const headers = section.table.headers;
                const rows = section.table.rows;
                content += `\n${headers.join(' | ')}\n`;
                content += `${headers.map(() => '---').join(' | ')}\n`;
                rows.forEach(row => {
                    content += `${row.join(' | ')}\n`;
                });
                content += '\n';
            }

            if (section.formula) {
                content += `\nFORMULA:\n${section.formula}\n\n`;
            }
        });

        // Create and download file
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${lesson.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filteredModules = learningModules.filter(module => {
        if (activeFilter !== 'all' && module.difficulty !== activeFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return module.title.toLowerCase().includes(query) ||
                module.lessons.some(l => l.title.toLowerCase().includes(query));
        }
        return true;
    });

    const circumference = 2 * Math.PI * 35;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div className="learning-page">
            {/* Header */}
            <motion.div
                className="learning-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <h1>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    {t('learning.financialMastery')}
                </h1>
                <p>9 {t('learning.modules')} · {totalLessons} {t('learning.lessons')} · {t('learning.expertCurriculum')}</p>
            </motion.div>

            {/* Progress Overview */}
            <motion.div
                className="progress-overview"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <div className="progress-stats">
                    <div className="progress-stat">
                        <span className="progress-stat-value">{completedCount}</span>
                        <span className="progress-stat-label">{t('learning.completed')}</span>
                    </div>
                    <div className="progress-ring">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                            <circle className="progress-ring-bg" cx="40" cy="40" r="35" />
                            <motion.circle
                                className="progress-ring-fill"
                                cx="40"
                                cy="40"
                                r="35"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </svg>
                        <span className="progress-ring-text">{progressPercent}%</span>
                    </div>
                    <div className="progress-stat">
                        <span className="progress-stat-value">{totalLessons - completedCount}</span>
                        <span className="progress-stat-label">{t('learning.remaining')}</span>
                    </div>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div
                className="learning-search"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
            >
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={t('learning.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                className="filter-tabs"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map(filter => (
                    <button
                        key={filter}
                        className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {t(`learning.${filter}`)}
                    </button>
                ))}
            </motion.div>

            {/* Quick Tips */}
            <motion.div
                className="quick-tips-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
            >
                <h3 className="quick-tips-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {t('learning.learningPath')}
                </h3>
                <ul className="quick-tips-list">
                    <li>{t('learning.tip1')}</li>
                    <li>{t('learning.tip2')}</li>
                    <li>{t('learning.tip3')}</li>
                </ul>
            </motion.div>

            {/* Modules */}
            <div className="modules-section">
                <h2 className="section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    {t('learning.courseModules')}
                </h2>

                {filteredModules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        className={`module-card ${expandedModule === module.id ? 'expanded' : ''}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    >
                        <div className="module-header" onClick={() => toggleModule(module.id)}>
                            <div className={`module-number ${module.difficulty}`}>
                                {module.id}
                            </div>
                            <div className="module-info">
                                <h3 className="module-title">{module.title}</h3>
                                <div className="module-meta">
                                    <span className="module-lessons-count">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                        {module.lessons.length} {t('learning.lessonsCount')}
                                    </span>
                                    <span className={`module-difficulty ${module.difficulty}`}>
                                        {module.difficulty}
                                    </span>
                                </div>
                                <div className="module-progress-bar">
                                    <motion.div
                                        className="module-progress-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getModuleProgress(module)}%` }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                            <div className="module-expand-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedModule === module.id && (
                                <motion.div
                                    className="lessons-list"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {module.lessons.map((lesson, lIdx) => {
                                        const completed = isLessonCompleted(lesson.id);
                                        const inProgress = progress.currentLesson === lesson.id;

                                        return (
                                            <motion.div
                                                key={lesson.id}
                                                className={`lesson-item ${completed ? 'completed' : ''}`}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: lIdx * 0.05 }}
                                                onClick={() => openLesson(lesson, module.id)}
                                            >
                                                <div className={`lesson-status ${completed ? 'completed' : inProgress ? 'in-progress' : 'locked'}`}>
                                                    {completed ? (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                            <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                        </svg>
                                                    ) : (
                                                        <span style={{ fontSize: '12px', fontWeight: '700' }}>{lesson.id}</span>
                                                    )}
                                                </div>
                                                <div className="lesson-content">
                                                    <h4 className="lesson-title">{lesson.title}</h4>
                                                    <p className="lesson-description">{lesson.description}</p>
                                                </div>
                                                <span className="lesson-duration">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    {lesson.duration}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Lesson Detail Modal */}
            <AnimatePresence>
                {selectedLesson && (
                    <motion.div
                        className="lesson-detail-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="lesson-detail-container"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <div className="lesson-detail-header">
                                <button className="lesson-back-btn" onClick={closeLesson}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                                <h2 className="lesson-detail-title">{selectedLesson.title}</h2>
                                <button className="lesson-download-btn" onClick={() => downloadLessonAsPDF(selectedLesson)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>

                            <div className="lesson-detail-content">
                                {selectedLesson.content.sections.map((section, idx) => (
                                    <div key={idx} className="lesson-section">
                                        <h3 className="lesson-section-title">{section.title}</h3>

                                        {section.text && (
                                            <p className="lesson-text">{section.text}</p>
                                        )}

                                        {section.highlight && (
                                            <div className="lesson-highlight">
                                                <p>{section.highlight}</p>
                                            </div>
                                        )}

                                        {section.list && (
                                            <ul className="lesson-list">
                                                {section.list.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        )}

                                        {section.table && (
                                            <div className="lesson-table-wrapper">
                                                <table className="lesson-table">
                                                    <thead>
                                                        <tr>
                                                            {section.table.headers.map((h, i) => (
                                                                <th key={i}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {section.table.rows.map((row, ri) => (
                                                            <tr key={ri}>
                                                                {row.map((cell, ci) => (
                                                                    <td key={ci}>{cell}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {section.formula && (
                                            <div className="formula-box">
                                                <p className="formula">{section.formula}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    className={`complete-lesson-btn ${isLessonCompleted(selectedLesson.id) ? 'completed' : ''}`}
                                    onClick={() => completeLesson(selectedLesson.id)}
                                >
                                    {isLessonCompleted(selectedLesson.id) ? (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            {t('learning.completedBtn')}
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            {t('learning.markComplete')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Learning;
