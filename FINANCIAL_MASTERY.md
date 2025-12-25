# 🏗️ Financial Mastery Visual Architecture

This document visualizes the structural hierarchy of the **Financial Mastery** learning system. It is designed to host personalized content generated dynamically.

---

## 🧭 System Hierarchy

The content differs for every user, but the **structure** remains constant.

```text
🏁 Financial Mastery Application
│
├── 📦 Personal Finance Module
│   │
│   ├── 📝 Lesson A: Budgeting Basics
│   │   ├── 📄 Section: Introduction (Text)
│   │   ├── 📊 Section: Savings Chart (Visual)
│   │   └── 💡 Section: Key Takeaway (Highlight)
│   │
│   ├── 📝 Lesson B: Debt Management
│   │   └── ... (Content Sections)
│   │
│   └── 📝 Lesson C: Emergency Funds
│       └── ... (Content Sections)
│
└── 📦 ... Other Modules
```

---

## 📈 Learning Progression & Difficulty

The architecture supports a tiered learning path, allowing users to progress from basics to mastery.

```text
🟢 Level 1: Beginner
│  (Fundamentals, Budgeting)
│
▼
🟡 Level 2: Intermediate
│  (Macrotrends, Markets)
│
▼
🟠 Level 3: Advanced
│  (Technical Analysis, Derivatives)
│
▼
🔴 Level 4: Expert
   (Algorithmic Trading, Compliance)
```

---

## 🧩 Component Breakdown

### 1. Level 1: The Module
**The Container.** This represents a broad topic area.
- **Visuals:** Card with progress bar.
- **Key Property:** `Difficulty Badge` (Beginner/Intermediate/Advanced/Expert).
- **Data:** Title, Level, Total Duration.

### 2. Level 2: The Lesson
**The Unit.** A specific concept to be mastered in 10-15 minutes.
- **Visuals:** List item within a module accordion.
- **Data:** Title, Estimated Read Time, Completion Status.

### 3. Level 3: The Content Blocks
**The Substance.** The actual educational material inside a lesson.

```text
[ Module ]
    └── Has Many [ Lessons ]
            │
            └── Contains Many [ Content Blocks ]
                    ├── Text Block (Paragraphs)
                    ├── Highlight Block (Key Insights)
                    └── Data Block (Lists/Tables)
```

---

## 🔄 User Flow

```text
1. 👤 User selects "Financial Mastery"
   │
   ▼
2. 📱 System displays Module List
   │
   ▼
3. 👆 User expands "Intermediate" Module
   │
   ▼
4. 🤖 System fetches Personalized Curriculum (JSON)
   │
   ▼
5. 📄 System renders Lesson List & Content
```
