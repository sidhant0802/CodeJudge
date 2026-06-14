<div align="center">
<img src="https://img.shields.io/badge/CodeJudge-Online%20Judge-7c3aed?style=for-the-badge&logo=code&logoColor=white" />
# CodeJudge — Online Competitive Coding Platform
 
**A full-stack online judge for practicing, evaluating, and competing in programming challenges.**  
Built like Codeforces and LeetCode — with real-time 1v1 battles, multi-language code execution, blogs, and a complete competitive programming ecosystem.
 
[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-codejudge.online-7c3aed?style=flat-square)](http://codejudge.online)
[![GitHub](https://img.shields.io/badge/💻%20Source%20Code-GitHub-181717?style=flat-square&logo=github)](https://github.com/sidhant0802/CodeJudge)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/Deployed-AWS%20EC2-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)
 
</div>
---
 
## Table of Contents
 
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [How Code Execution Works](#how-code-execution-works)
- [Authentication Flow](#authentication-flow)
- [1v1 Battle System](#1v1-battle-system)
- [Rating & ELO System](#rating--elo-system)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Author](#author)
---
 
## Overview
 
CodeJudge is a production-deployed competitive programming platform that supports:
 
- Writing and submitting code in **C, C++, and Python**
- Getting **instant verdicts** with sub-second code execution
- Competing in **1v1 real-time coding battles** with an ELO rating system
- Tracking progress through **submission history, heatmaps, and analytics**
- Reading and writing **algorithmic blog posts**
- Messaging **friends** and tracking their activity
Fully deployed on **AWS EC2** with **Nginx** as a reverse proxy, **PM2** for process management, and **MongoDB Atlas** as the cloud database.
 
---
 
## Features
 
### For Users
| Feature | Description |
|---|---|
| 🔐 **Secure Auth** | Login/signup via email or handle, OTP-based password reset |
| ⚡ **Code Submission** | Submit in C, C++, Python — get instant verdicts (AC / WA / TLE) |
| ⚔️ **1v1 Battles** | Real-time room-based coding duels with ELO rating changes |
| 📊 **Profile Dashboard** | GitHub-style heatmap, rating history, pie chart analytics |
| 👥 **Friend System** | Add friends, view profiles and their submission history |
| 💬 **In-app Chat** | Real-time messaging via Socket.IO |
| 📝 **Blogs** | Read and write posts on algorithms and data structures |
| 🏆 **Leaderboard** | Top 100 players ranked by rating with win rates |
| 🔍 **Problem Search** | Filter by difficulty, tags (DP, Greedy, Arrays, etc.) |
| 💾 **Code Saving** | Auto-save drafts so you never lose progress |
 
### For Admins
| Feature | Description |
|---|---|
| 👤 **User Management** | View, edit, delete users; change roles (Admin/User) |
| 📋 **Problem Management** | Create, update, delete problems with full test case support |
| 🧪 **Test Case Control** | Add/edit/delete test cases with custom input & expected output |
| 🗑️ **Submission Moderation** | Delete inappropriate submissions |
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Real-time** | Socket.IO (battles, chat, notifications) |
| **Code Execution** | Node.js `child_process` (C, C++, Python) |
| **Authentication** | JWT, bcrypt, signed httpOnly cookies |
| **Email Service** | Nodemailer (OTP-based password reset) |
| **Deployment** | AWS EC2 (Ubuntu 22.04), Nginx, PM2 |
| **Version Control** | Git, GitHub |
 
---
 
## Architecture
 
```
                     ┌──────────────────────────┐
                     │       User Browser        │
                     └────────────┬─────────────┘
                                  │ HTTP / WebSocket
                                  ▼
                     ┌──────────────────────────┐
                     │      Nginx (Port 80)      │
                     │  Reverse Proxy + Static   │
                     │       File Server         │
                     └──────┬───────────┬────────┘
                            │           │
             ┌──────────────┘           └──────────────┐
             ▼                                          ▼
┌────────────────────────┐              ┌────────────────────────┐
│  Backend API + Socket  │              │   Compiler Service     │
│  Node.js (Port 5010)   │              │   Node.js (Port 5011)  │
│                        │              │                        │
│ - 30+ REST API routes  │              │ - C execution          │
│ - Socket.IO (battles,  │              │ - C++ execution        │
│   chat, notifications) │              │ - Python execution     │
└──────────┬─────────────┘              └────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│      MongoDB Atlas        │
│   (Cloud Database)        │
│                           │
│  Collections:             │
│  battles, blogs,          │
│  comments, messages,      │
│  problems, savedcodes,    │
│  submissions, testcases,  │
│  users                    │
└──────────────────────────┘
```
 
---
 
## Project Structure
 
```
CodeJudge/
│
├── frontend/                        # React + Vite frontend
│   └── src/
│       ├── components/              # All UI components
│       │   ├── compete/             # Battle arena components
│       │   │   ├── BattleArena.jsx
│       │   │   ├── BattleResult.jsx
│       │   │   ├── BattleTimer.jsx
│       │   │   ├── JoinRoom.jsx
│       │   │   ├── OpponentStatus.jsx
│       │   │   ├── RandomRoom.jsx
│       │   │   └── WaitingRoom.jsx
│       │   ├── BlogDetail.jsx
│       │   ├── Blogs.jsx
│       │   ├── Chat.jsx
│       │   ├── CreateBlog.jsx
│       │   ├── CreateProblem.jsx
│       │   ├── Friends.jsx
│       │   ├── Homepage.jsx
│       │   ├── Leaderboard.jsx
│       │   ├── Login.jsx / Register.jsx
│       │   ├── ProblemSet.jsx
│       │   ├── Profile.jsx
│       │   ├── SubmissionHeatmap.jsx
│       │   └── Submissions.jsx
│       ├── context/
│       │   └── SocketContext.jsx
│       └── App.jsx
│
├── backend/                         # Express.js API server
│   ├── controllers/                 # Route handlers
│   ├── middleware/                  # Auth, file upload
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API route definitions
│   ├── socket/                      # Socket.IO handlers
│   └── server.js
│
└── Compiler/                        # Isolated code execution service
    ├── CompilerController.js
    ├── executeC.js
    ├── executeCpp.js
    ├── executepy.js
    ├── generateFile.js
    ├── generateInputFile.js
    └── server.js
```
 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git
### 1. Clone the Repository
 
```bash
git clone https://github.com/sidhant0802/CodeJudge.git
cd CodeJudge
```
 
### 2. Install Dependencies
 
```bash
# Backend
cd backend && npm install
 
# Compiler service
cd ../Compiler && npm install
 
# Frontend
cd ../frontend && npm install
```
 
### 3. Configure Environment Variables
 
Create `.env` files as described in the [Environment Variables](#environment-variables) section.
 
### 4. Run All Three Services
 
Open three separate terminals:
 
```bash
# Terminal 1 — Backend API server
cd backend
nodemon server.js
 
# Terminal 2 — Compiler service
cd Compiler
nodemon server.js
 
# Terminal 3 — Frontend dev server
cd frontend
npm run dev
```
 
The app will be available at `http://localhost:5173`
 
---
 
## Environment Variables
 
### `backend/.env`
 
```env
PORT=5010
MONGO_URI=your_mongodb_atlas_connection_string
SECRET_KEY=your_jwt_secret_key
salt_rounds=10
CookieSecret=your_cookie_secret
nodemailerPassword=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
INSTANCE_IP=http://localhost:5173
```
 
### `Compiler/.env`
 
```env
PORT=5011
```
 
### `frontend/.env`
 
```env
VITE_REACT_INSTANCE_IP=http://localhost:5010
VITE_REACT_COMPILER_IP=http://localhost:5011
```
 
> **Note:** For production, replace `localhost` with your server's public IP or domain name.
 
---
 
## API Reference
 
The backend exposes **30+ REST API endpoints** across **10 resource groups**:
 
| Resource | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Login, signup, logout, OTP, password reset |
| Problems | `/api/problems` | CRUD operations for coding problems |
| Test Cases | `/api/tests` | Manage test cases per problem |
| Submissions | `/api/submissions` | Submit code, view submission history |
| Compiler | `/api/compiler` | Execute code in C, C++, Python |
| Saved Code | `/api/savedcode` | Save and retrieve code drafts |
| Blogs | `/api/blogs` | Create and read algorithmic blog posts |
| Comments | `/api/comments` | Comment on blog posts |
| Battle | `/api/battle` | Create/join 1v1 coding battle rooms |
| Chat | `/api/chat` | Send and retrieve messages |
 
---
 
## How Code Execution Works
 
```
1. User writes code and clicks "Run"
2. Frontend sends code + language + input to Compiler service (port 5011)
3. Compiler writes code to a temporary file          → generateFile.js
4. Writes input to a temporary input file            → generateInputFile.js
5. Spawns a child_process to compile and execute     → executeC / executeCpp / executepy
6. Timeout enforcement kills the process if TLE
7. Output is captured and returned to the frontend
8. Temporary files are cleaned up after execution
```
 
**Supported Languages:** C, C++, Python
 
---
 
## Authentication Flow
 
```
Register  →  Password hashed with bcrypt  →  Stored in MongoDB
Login     →  JWT token generated  →  Stored in signed httpOnly cookie
Request   →  Auth middleware verifies JWT  →  Access granted / denied
Forgot PW →  OTP generated  →  Sent via Nodemailer  →  User verifies OTP  →  Password reset
```
 
---
 
## 1v1 Battle System
 
Real-time coding duels powered by Socket.IO:
 
```
1. User selects "1v1 Compete"
2. Create a room (generates Room ID) OR join via Room ID + optional password
3. System shows "Waiting for Opponent"
4. Both players connect → battle initializes
5. Same problem is assigned to both users simultaneously
6. Countdown timer starts
7. Users independently write & submit solutions
8. Submissions are evaluated against hidden test cases
9. First correct submission wins → ELO ratings update
10. Battle ends → results displayed with rating changes
```
 
**Room settings:** Difficulty (Easy / Medium / Hard / Random), Duration (5–60 min), Public or Private (password-protected).
 
---
 
## Rating & ELO System
 
Ratings are updated after every battle using the standard ELO formula with an adaptive K-factor:
 
```
R' = R + K × (S − E)
 
Where:
  R  = current rating
  S  = actual score (1 = win, 0 = loss)
  E  = expected score based on ratings
 
K-factor (adaptive):
  K = 80   if battles < 4      (new players)
  K = 40   if 5 ≤ battles < 20
  K = 20   if battles ≥ 20    (experienced players)
```
 
**Rank tiers:** Bronze → Silver → Gold → Platinum → Master → Champion
 
---
 
## Deployment
 
Deployed on **AWS EC2 (t2.micro, Ubuntu 22.04)**:
 
| Tool | Purpose |
|---|---|
| **Nginx** | Reverse proxy + serves React static build on port 80 |
| **PM2** | Process manager — keeps all services alive, auto-restarts on crash |
| **MongoDB Atlas** | Cloud-hosted database with connection pooling |
| **AWS Security Groups** | Firewall rules for ports 80, 5010, 5011 |
 
### Quick Deployment Steps
 
```bash
# 1. Clone repo on EC2
git clone https://github.com/sidhant0802/CodeJudge.git
 
# 2. Install dependencies
cd backend && npm install
cd ../Compiler && npm install
cd ../frontend && npm install && npm run build
 
# 3. Start services with PM2
pm2 start backend/server.js --name "backend"
pm2 start Compiler/server.js --name "compiler"
pm2 save && pm2 startup
 
# 4. Configure Nginx
sudo nano /etc/nginx/sites-available/codejudge
# Point / to React build, proxy /api to port 5010, /compiler to 5011
sudo systemctl restart nginx
```
 
---
 
## Contributing
 
Contributions are welcome!
 
```bash
# 1. Fork the repository
 
# 2. Create a feature branch
git checkout -b feature/your-feature-name
 
# 3. Commit your changes
git commit -m "Add: your feature description"
 
# 4. Push to your branch
git push origin feature/your-feature-name
 
# 5. Open a Pull Request
```
 
Please make sure your code is clean and well-commented before submitting a PR.
 
---
 
## Author
 
**Sidhant Nirupam**  
[@sidhant08 on CodeJudge](http://codejudge.online)  
[GitHub](https://github.com/sidhant0802)
 
---
 
<div align="center">
Made with ❤️ for competitive programmers
 
⭐ Star this repo if you found it useful!
 
</div>
