# 🧠 Can You Outsmart AI? — Powered by NVIDIA Nemotron Ultra

A production-quality full-stack competitive gaming platform where human players compete against **NVIDIA Nemotron Ultra** across 5 distinct reasoning arenas, earning scores, competitive MMR ratings, streaks, and global leaderboards.

---

## 🌟 Key Features

* **5 Reasoning Arenas**:
  1. **Logic Deduction**: Formal logic, sequence puzzles, conditional reasoning.
  2. **Pattern Recognition**: Numerical & pattern sequence completion under time pressure.
  3. **Bluff Detection**: Identify AI-crafted deceptive statements.
  4. **Lateral Thinking**: Riddles and paradoxical scenarios with score-deducting hints.
  5. **AI Reasoning Battle (Flagship)**: Subjective reasoning showdown evaluated on efficiency, logic, and creativity.
* **NVIDIA Nemotron Ultra AI Engine**: Challenge generation, hint crafting, and reasoning evaluation powered by NVIDIA NIM endpoints.
* **Server-Authoritative Anti-Cheat**: All scores, timers, answer verification, and rating adjustments are calculated on the Spring Boot backend.
* **Authentication**: BCrypt password hashing & JWT token authentication.
* **Real-time Leaderboards**: Global, Weekly, and Daily leaderboards with current user rank highlighting and auto-updates.
* **Official Daily Challenge**: 1 official daily attempt to maintain player streaks.
* **Public Shareable Results**: Share `/result/{id}` links with friends to challenge them.

---

## 🏗 Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios, Canvas Confetti.
* **Backend**: Java 17+, Spring Boot 3.3.0, Spring Web, Spring Security, JWT (jjwt), Spring Data MongoDB, Bean Validation.
* **Database**: MongoDB (Local or MongoDB Atlas).
* **AI Engine**: NVIDIA Nemotron Ultra (`meta/llama-3.1-nemotron-70b-instruct` / `nvidia/nemotron-4-340b-instruct`).

---

## 🚀 Local Quickstart Guide

### Prerequisites
* Java 17+ installed
* Node.js v18+ installed
* MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
# Run Spring Boot backend (Starts on http://localhost:8080)
./mvnw spring-boot:run
```

To provide your custom NVIDIA API Key and MongoDB URI via environment variables:
```bash
export SPRING_DATA_MONGODB_URI="mongodb://localhost:27017/outsmart_ai"
export JWT_SECRET="your-32-char-secret"
export NVIDIA_API_KEY="nvapi-your-nvidia-api-key"
export NVIDIA_MODEL="meta/llama-3.1-nemotron-70b-instruct"
./mvnw spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# React frontend starts on http://localhost:3000
```

---

## 🌐 Production Deployment Guide

### Backend Deployment (Render / Railway / Heroku / AWS)
1. Set Environment Variables:
   - `SPRING_DATA_MONGODB_URI` (MongoDB Atlas URI)
   - `JWT_SECRET` (Secure random string)
   - `NVIDIA_API_KEY` (NVIDIA API Key)
   - `NVIDIA_MODEL` (`meta/llama-3.1-nemotron-70b-instruct`)
2. Deploy using `./mvnw clean package` artifact `target/backend-0.0.1-SNAPSHOT.jar`.

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Build frontend: `cd frontend && npm run build`
2. Set API Proxy or point Axios base URL to your production backend URL.

---

## 📡 REST API Documentation

* `POST /api/auth/register` - Create new player account
* `POST /api/auth/login` - Authenticate player and receive JWT
* `GET  /api/users/me` - Fetch authenticated player profile & stats
* `POST /api/games/start` - Create game session (`{ gameType, difficulty, daily }`)
* `GET  /api/games/{id}` - Fetch active game session
* `POST /api/games/{id}/hint` - Request hint (-25% score penalty)
* `POST /api/games/{id}/submit` - Authoritative answer submission
* `GET  /api/leaderboard/global` - Global rankings
* `GET  /api/leaderboard/weekly` - Last 7 days rankings
* `GET  /api/leaderboard/daily` - Today's rankings
* `GET  /api/stats/live` - Real-time active games & user metrics
* `GET  /api/daily-challenge` - Daily challenge status
* `GET  /api/results/{id}` - Public shareable result
