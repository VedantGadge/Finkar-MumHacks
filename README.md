# 💰 FinKar
# 4-HODs
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

## ✨ Features

### 📊 **Dashboard**

- **Financial Health Score** – Get a real-time assessment of your financial health
- **Balance Overview** – Track total balance, income, and expenses at a glance
- **Spending Analytics** – Interactive pie charts showing spending by category
- **Checklist** – Personal task management for financial goals

### 💹 **Expense & Budget Tracker**

- **Transaction Management** – Add, categorize, and track all transactions
- **Budget Planning** – Set and monitor monthly budgets by category
- **Bill Scanner** – Scan bills using camera to auto-extract expense data
- **Goals Tracking** – Set savings goals and track progress

### 🤖 **AI Chatbot**

- **Financial Advisor** – Get personalized financial advice and tips
- **Voice Input Support** – Talk to your financial companion
- **Multi-language Support** – Communicate in your preferred language

### 📚 **Learning Hub**

- **Financial Literacy Modules** – [View Detailed Curriculum](FINANCIAL_MASTERY.md) with 9 comprehensive modules and 25+ lessons
- **Interactive Content** – Learn about budgeting, investing, fraud prevention, and more
- **Case Studies** – Real-world financial case studies for better understanding

### 📈 **Stock Market**

- **Live Market Data** – Real-time stock prices and market indices
- **Sector Performance** – Track sector-wise market performance
- **Case Study Generation** – AI-generated case studies for stock analysis
- **NIFTY 50 & Sensex** – Track major Indian market indices

### 🔒 **Security & Profile**

- **User Authentication** – Secure login with session management
- **Profile Management** – Update personal and financial details
- **Multi-language Support** – Available in English, Hindi, Marathi, and more

---

## 🛠️ Tech Stack

### Frontend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| **React 19**       | Core UI framework          |
| **Ionic React**    | Mobile-first UI components |
| **Capacitor**      | Native mobile capabilities |
| **Framer Motion**  | Smooth animations          |
| **Recharts**       | Data visualization         |
| **React Markdown** | Rich text rendering        |

### Backend

| Technology     | Purpose              |
| -------------- | -------------------- |
| **Node.js**    | Runtime environment  |
| **Express.js** | API framework        |
| **Axios**      | HTTP client          |
| **CORS**       | Cross-origin support |

### Mobile Features

| Feature                | Technology                              |
| ---------------------- | --------------------------------------- |
| **Camera Access**      | @capacitor/camera                       |
| **Speech Recognition** | @capacitor-community/speech-recognition |
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

| Endpoint                      | Method | Description                         |
| ----------------------------- | ------ | ----------------------------------- |
| `/api/tickers`                | GET    | Get available stock tickers         |
| `/api/v1/stocks/:ticker/data` | GET    | Get stock data for a ticker         |
| `/api/case-study`             | POST   | Generate AI case study for a ticker |
| `/api/case-study/batch`       | POST   | Generate batch case studies         |
| `/api/market-indices`         | GET    | Get market indices (NIFTY, SENSEX)  |
| `/api/sector-performance`     | GET    | Get sector-wise performance         |

---

## 📁 Project Structure

```
Finkar-MumHacks/
├── backend/                    # Express.js API server
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route handlers
│   ├── routes/                 # API route definitions
│   └── server.js               # Entry point
│
└── frontend/
    └── finkar-web/             # React + Ionic frontend
        ├── src/
        │   ├── assets/         # Images and static files
        │   ├── components/     # Reusable UI components
        │   │   ├── common/     # Shared components (Toast, BillScanner)
        │   │   ├── dashboard/  # Dashboard widgets
        │   │   └── tracker/    # Tracker components
        │   ├── contexts/       # React contexts (Finance, Language)
        │   ├── hooks/          # Custom React hooks
        │   ├── pages/          # Main app pages
        │   ├── services/       # API service functions
        │   └── utils/          # Utility functions
        └── android/            # Capacitor Android project
```

---

## 🎨 Key Pages

| Page          | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| **Dashboard** | Financial overview with health score, spending charts, and quick actions |
| **Tracker**   | Transaction and budget management with goals tracking                    |
| **Chatbot**   | AI-powered financial assistant with voice support                        |
| **Learning**  | Financial literacy modules and case studies                              |
| **Stocks**    | Live stock market data and analysis                                      |
| **Profile**   | User settings and account management                                     |

---

## 🌐 Supported Languages

- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Kannada (ಕನ್ನಡ)

---

## ⚠️ License & Usage

> **⛔ PROPRIETARY SOFTWARE – ALL RIGHTS RESERVED**

This project is **private and proprietary**.

- ❌ **No cloning** without explicit written permission
- ❌ **No forking** or redistribution allowed
- ❌ **No commercial or personal use** without authorization
- ❌ **No modification** or derivative works permitted


**© 2024 FinKar. All Rights Reserved.**

---

---

<div align="center">

**[⬆ Back to Top](#-finkar)**

</div>
