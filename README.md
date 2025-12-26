#  FinKar
## 4-HODs

<div align="center">

![FinKar](https://img.shields.io/badge/FinKar-Financial%20Companion-10B981?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6IiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0xMi41IDdIMTF2Nmw1LjI1IDMuMTUuNzUtMS4yMy00LjUtMi42N1Y3eiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-8.x-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-7.x-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)

**Your Smart Financial Companion for India** 🇮🇳

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Endpoints](#-api-endpoints) • [Screenshots](#-screenshots)

</div>

---

## 📖 About

**FinKar** is a comprehensive personal finance management application designed specifically for Indian users. Built as a hackathon project (MumHacks), it combines intuitive expense tracking, AI-powered insights, stock market analysis, and financial literacy education into a single, beautifully designed mobile-first experience.

---

## ✨ Features

### 📊 **Dashboard**
- **Financial Health Score** – AI-powered real-time assessment of your financial health with dynamic scoring
- **Balance Overview** – Track total balance, income, and expenses at a glance with beautiful visualizations
- **Monthly Snapshots Carousel** – Interactive carousel showing monthly financial summaries with spending trends and AI-generated recommendations
- **Spending Analytics** – Interactive pie charts with category-wise spending breakdown
- **Budget Overview Widget** – Visual progress bars showing budget utilization across categories
- **Goals Overview** – Track savings goals with progress indicators and deadline tracking
- **Quick Actions** – Fast access to add transactions, scan bills, and manage budgets
- **Upcoming Obligations** – View and manage recurring bills & liabilities
- **Recent Activity Feed** – Real-time transaction history with category icons
- **Personal Checklist** – Task management for financial goals with add/complete/delete functionality

### 💹 **Expense & Budget Tracker**
- **Transaction Management** – Add, categorize, and track all income/expense transactions
- **Smart Categorization** – Pre-defined categories: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other
- **Budget Planning** – Set and monitor monthly budgets by category with visual progress tracking
- **Bill Scanner (OCR)** – Scan bills using camera to auto-extract expense data with AI processing
- **Goals Tracking** – Set savings goals with target amounts, deadlines, and percentage progress
- **Liabilities Management** – Track loans, credit cards, and recurring obligations
- **Category Analytics** – Detailed breakdown of spending by category with trends

### 🤖 **AI Chatbot**
- **Financial Advisor** – Get personalized financial advice powered by AI (HuggingFace/LLaMA)
- **Voice Input Support** – Native speech recognition with silence detection and tap-to-stop on Android
- **Text-to-Speech** – Listen to AI responses with built-in TTS functionality
- **Multi-language Support** – Communicate in your preferred language (English, Hindi, Marathi, etc.)
- **Conversation Memory** – Persistent chat history with session management
- **Rich Markdown Rendering** – AI responses support tables, code blocks, and formatted text
- **Auto-expanding Input** – Text input automatically expands for longer messages

### 📚 **Learning Hub**
- **9 Comprehensive Financial Literacy Modules** covering:
  - Personal Finance & Liquidity Management
  - Sovereign & Fixed Income Instruments
  - Asset Diversification & Wealth Building
  - Capital Markets Navigation
  - Advanced Derivative Concepts
  - Financial Crime & Security
  - Tax Optimization & Compliance
  - Insurance & Risk Management
  - Retirement & Estate Planning
- **25+ Interactive Lessons** – Detailed lessons with sections, lists, tables, and highlights
- **Personalized Daily Flashcards** – AI-generated flashcards with flip animation for spaced learning
- **Case Study Generation** – AI-powered case studies for real-world financial scenarios
- **Progress Tracking** – Mark lessons as completed and track learning journey
- **Difficulty Levels** – Beginner, Intermediate, and Advanced content

### 📈 **Stock Market**
- **Live Market Data** – Real-time stock prices fetched via Alpha Vantage API
- **Market Indices** – Track NIFTY 50 & SENSEX with live charts
- **Sector Performance Heatmap** – Visual sector-wise performance analysis
- **Stock Detail View** – In-depth stock analysis with:
  - Technical indicators (RSI, MACD)
  - AI-generated performance analysis
  - Price history charts (1D, 1W, 1M, 3M, 1Y, 5Y)
  - Volume analysis
- **Interactive Charts** – Candlestick, line, and area charts with zoom/pan
- **AI Case Studies** – Generate detailed stock analysis reports
- **Top Gainers/Losers** – Quick view of market movers
- **Auto-rotating Stock Carousel** – Animated display of trending stocks

### 🔐 **Authentication & Profile**
- **User Authentication** – Secure login with session management via cookies
- **Profile Management** – Update personal and financial details
- **Multi-language Interface** – Full app localization in 6 languages
- **Theme Support** – Modern dark theme with glassmorphism effects
- **Session Persistence** – Secure token-based authentication

---

## 🛠️ Tech Stack

### Frontend

| Technology               | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| **React 19**             | Core UI framework                          |
| **Ionic React**          | Mobile-first UI components                 |
| **Capacitor**            | Native mobile capabilities                 |
| **Framer Motion**        | Smooth animations & page transitions       |
| **Recharts**             | Data visualization (charts & graphs)       |
| **React Markdown**       | Rich text rendering for AI responses       |
| **LocalStorage Hooks**   | Persistent client-side data caching        |

### Backend

| Technology       | Purpose                          |
| ---------------- | -------------------------------- |
| **Node.js**      | Runtime environment              |
| **Express.js**   | API framework                    |
| **Axios**        | HTTP client for external APIs    |
| **CORS**         | Cross-origin support             |
| **Alpha Vantage**| Stock market data API            |
| **HuggingFace**  | AI/LLM API for insights & chat   |

### Mobile Features

| Feature                | Technology                              |
| ---------------------- | --------------------------------------- |
| **Camera Access**      | @capacitor/camera                       |
| **Speech Recognition** | @capacitor-community/speech-recognition |
| **Native Android**     | Capacitor Android Plugin                |
| **Android/iOS Build**  | Capacitor CLI                           |

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for mobile builds)

### Clone Repository

```bash
git clone https://github.com/yourusername/Finkar-MumHacks.git
cd Finkar-MumHacks
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will start at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend/finkar-web
npm install
npm start
```

The app will open at `http://localhost:3000`

### Mobile Build (Android)

```bash
cd frontend/finkar-web
npm run build
npx cap sync android
npx cap open android
```

---

## 📡 API Endpoints

| Endpoint                      | Method | Description                          |
| ----------------------------- | ------ | ------------------------------------ |
| `/api/tickers`                | GET    | Get available stock tickers          |
| `/api/v1/stocks/:ticker/data` | GET    | Get stock data for a ticker          |
| `/api/v1/stocks/:ticker/history` | GET | Get historical price data            |
| `/api/case-study`             | POST   | Generate AI case study for a ticker  |
| `/api/case-study/batch`       | POST   | Generate batch case studies          |
| `/api/market-indices`         | GET    | Get market indices (NIFTY, SENSEX)   |
| `/api/sector-performance`     | GET    | Get sector-wise performance          |
| `/api/score`                  | POST   | Calculate financial health score     |
| `/api/learning/daily`         | GET    | Get personalized daily learning      |

---

## 📁 Project Structure

```
Finkar-MumHacks/
├── backend/                    # Express.js API server
│   ├── config/                 # Configuration files & constants
│   ├── controllers/            # Route handlers (stocks, caseStudy, etc.)
│   ├── routes/                 # API route definitions
│   ├── utils/                  # Utility functions
│   └── server.js               # Entry point
│
└── frontend/
    └── finkar-web/             # React + Ionic frontend
        ├── src/
        │   ├── assets/         # Images, logos, and static files
        │   ├── components/
        │   │   ├── common/     # BillScanner, Toast, CustomDatePicker
        │   │   ├── dashboard/  # FinancialHealthCard, MonthlySnapshots, 
        │   │   │               # BudgetOverview, GoalsOverview, QuickActions
        │   │   └── tracker/    # BudgetCard, GoalsCard, TransactionsCard
        │   ├── contexts/       # React contexts (Finance, Language)
        │   ├── hooks/          # Custom React hooks (useLocalStorage)
        │   ├── pages/          # Dashboard, Tracker, Stocks, Learning, 
        │   │                   # Chatbot, Profile, Login, Splash
        │   ├── services/       # API service functions (13 services)
        │   └── utils/          # Utility functions
        └── android/            # Capacitor Android project
```

---

## 🎨 Key Pages

| Page          | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| **Splash**    | Animated loading screen with FinKar branding                             |
| **Login**     | Secure authentication with form validation                               |
| **Dashboard** | Financial overview with health score, snapshots, spending charts, checklist |
| **Tracker**   | Transaction, budget, goals, and liabilities management with bill scanner |
| **Chatbot**   | AI-powered financial assistant with voice input & TTS                    |
| **Learning**  | 9-module financial literacy course with flashcards & case studies        |
| **Stocks**    | Live stock market data, charts, sector heatmap, and AI analysis          |
| **Profile**   | User settings, language selection, and account management                |

---

## 🌐 Supported Languages

- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Kannada (ಕನ್ನಡ)

---

## 🎯 Design Highlights

- **Modern Dark Theme** – Sleek dark mode with vibrant green accents (#10B981)
- **Glassmorphism Effects** – Frosted glass UI elements for premium feel
- **Smooth Animations** – Framer Motion powered page transitions and micro-interactions
- **Floating Navigation** – Island-style bottom nav with glassmorphism
- **Responsive Design** – Mobile-first experience that works on all screen sizes
- **Skeleton Loaders** – Premium loading states for async content

---

## ⚠️ License & Usage

> **⛔ PROPRIETARY SOFTWARE – ALL RIGHTS RESERVED**

This project is **private and proprietary**.

- ❌ **No cloning** without explicit written permission
- ❌ **No forking** or redistribution allowed
- ❌ **No commercial or personal use** without authorization
- ❌ **No modification** or derivative works permitted


**© 2025 FinKar. All Rights Reserved.**

---

---

<div align="center">

**[⬆ Back to Top](#-finkar)**

</div>
