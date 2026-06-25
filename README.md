# 🤖 InterviewAI

> **AI-Powered Interview Preparation Platform** — Upload your resume, target your dream job, and let AI guide you to success.

---

## 🚀 Overview

**InterviewAI** is a full-stack MERN application that leverages Generative AI to help job seekers prepare smarter and faster. Users upload their resume and a target job description — the system then analyzes skill gaps, generates personalized interview questions, creates a preparation roadmap, and even builds an AI-optimized resume tailored to the job.

---

## ✨ Features

### 📄 Resume Analysis
- Upload your existing resume (PDF/DOCX)
- AI parses and extracts skills, experience, and education
- Instantly compared against the target job description

### 🔍 Skill Gap Identification
- Identifies missing technical and soft skills
- Highlights strengths that align with the job
- Prioritizes gaps by importance to the role

### ❓ AI-Generated Interview Questions
- **Technical Questions** — role-specific coding, system design, and domain knowledge
- **Behavioral Questions** — STAR-method questions based on your experience and the job requirements
- Difficulty levels: Easy → Medium → Hard

### 🗺️ Personalized Preparation Plan
- Day-by-day study roadmap tailored to your skill gaps
- Curated resources: courses, documentation, practice problems
- Timeline based on your target interview date

### 📝 AI-Optimized Resume Generator
- Generates a new resume tailored to the specific job description
- Incorporates keywords from the job posting for ATS compatibility
- Professional formatting ready to download

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, SASS|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT (JSON Web Tokens),TokenBlackListing |
| **AI / LLM** | Google Gemini API / OpenAI GPT |
| **File Handling** | Multer, pdf-parse, mammoth |
| **State Management** | Context API / Redux |

---

## 📁 Project Structure

```
InterviewAI/
├── client/                     # React Frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/         # Reusable UI components
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── UploadResume.jsx
│       │   ├── SkillGaps.jsx
│       │   ├── Questions.jsx
│       │   ├── PrepPlan.jsx
│       │   └── ResumeBuilder.jsx
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   ├── connectDB.js
│   │   └── token.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── resume.controller.js
│   │   ├── analysis.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   └── isAuth.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── analysis.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── resume.route.js
│   │   └── analysis.route.js
│   ├── services/
│   │   └── ai.service.js       # Generative AI integration
│   ├── .env
│   ├── .gitignore
│   └── index.js
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB Atlas account
- Gemini API Key (or OpenAI API Key)

### 1. Clone the Repository

```bash
git clone https://github.com/RishuRajxdev/InterviewAI.git
cd InterviewAI
```

### 2. Setup Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=8000
MONGO_URL=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the server:

```bash
npm run dev
```

### 3. Setup Client

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔄 User Flow

```
1. Register / Login
        ↓
2. Upload Resume (PDF/DOCX)
        ↓
3. Enter Target Job Description
        ↓
4. AI Analyzes Resume vs Job
        ↓
   ┌────────────────────────────────────┐
   │  • Skill Gap Report                │
   │  • Technical Interview Questions   │
   │  • Behavioral Interview Questions  │
   │  • Personalized Prep Plan          │
   │  • AI-Generated Optimized Resume   │
   └────────────────────────────────────┘
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8000) |
| `MONGO_URL` | MongoDB Atlas connection URI |
| `JWT_SECRET` | Secret key for JWT signing |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Rishu Raj**
- GitHub: [@RishuRajxdev](https://github.com/RishuRajxdev)

---

> Built with ❤️ using MERN Stack + Generative AI