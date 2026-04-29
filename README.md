# CodeJudge — Online Competitive Coding Platform

> A full-stack online judge platform for practicing, evaluating, and competing in programming challenges — built similar to Codeforces and LeetCode, with real-time battles, multi-language code execution, and a complete competitive programming ecosystem.

🌐 **Live Demo**: [codejudge.online](http://codejudge.online) &nbsp;|&nbsp; 💻 **Source Code**: [GitHub](https://github.com/sidhant0802/CodeJudge)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Authentication Flow](#authentication-flow)
- [How Code Execution Works](#how-code-execution-works)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

CodeJudge is a production-deployed competitive programming platform that supports:

- Writing and submitting code in **C, C++, and Python**
- Getting **instant verdicts** with sub-second code execution
- Competing in **1v1 real-time coding battles** with an Elo rating system
- Tracking progress through **submission history, heatmaps, and analytics**
- Reading and writing **algorithmic blog posts**
- Chatting with **friends** and tracking their submissions

The platform is fully deployed on **AWS EC2** with **Nginx** as a reverse proxy, **PM2** for process management, and **MongoDB Atlas** as the database.

---

## Features

### For Users
- **Secure Authentication** — Login, Signup, and OTP-based Forgot Password via email
- **Code Submission** — Submit solutions and receive instant verdicts (Accepted / Wrong Answer / TLE)
- **Multi-language Support** — Write and execute code in C, C++, and Python
- **Submission Tracking** — View own submissions, friends' submissions, and all submissions per problem
- **Code Review** — View full source code of any submission with syntax highlighting
- **1v1 Coding Battles** — Real-time room-based battles with Elo rating changes and leaderboard
- **Friend System** — Add friends, view their profiles and submission history
- **In-app Chat** — Real-time messaging with friends via Socket.IO
- **Blog Section** — Read and write posts on algorithms, data structures, and techniques
- **Profile Dashboard** — GitHub-style activity heatmap, submission analytics, rating history
- **MathJax Rendering** — Problem statements with mathematical notation rendered beautifully

### For Admins
- **User Management** — View, edit, delete users and change roles
- **Problem Management** — Create, update, delete problems with full test case support
- **Submission Moderation** — Delete inappropriate submissions
- **Leaderboard Control** — Manage the Elo rating and ranking system

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-time** | Socket.IO |
| **Code Execution** | Node.js child_process (C, C++, Python) |
| **Authentication** | JWT, bcrypt, cookie-parser |
| **Email Service** | Nodemailer (OTP-based password reset) |
| **Deployment** | AWS EC2 (Ubuntu), Nginx, PM2 |
| **Version Control** | Git, GitHub |

---

## Project Structure

```
CodeJudge/
│
├── frontend/                        # React + Vite frontend
│   ├── public/
│   │   └── badges/                  # Rank badge images
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
│       │   ├── ChatList.jsx
│       │   ├── config.js
│       │   ├── CreateBlog.jsx
│       │   ├── CreateProblem.jsx
│       │   ├── CreateTestcase.jsx
│       │   ├── DeleteProblem.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── Friends.jsx
│       │   ├── Homepage.jsx
│       │   ├── Leaderboard.jsx
│       │   ├── Login.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProblemDescription.jsx
│       │   ├── ProblemSet.jsx
│       │   ├── Profile.jsx
│       │   ├── ProfileSettings.jsx
│       │   ├── Register.jsx
│       │   ├── SubmissionHeatmap.jsx
│       │   ├── Submissions.jsx
│       │   ├── SubmissionsByHandle.jsx
│       │   ├── UpdateProblem.jsx
│       │   ├── UpdateTestcase.jsx
│       │   ├── Userlist.jsx
│       │   └── VerifyOTP.jsx
│       ├── context/
│       │   └── SocketContext.jsx
│       ├── hooks/
│       │   └── useSocket.js
│       ├── pages/
│       │   └── CompetePage.jsx
│       ├── themes/
│       │   ├── heatmap.css
│       │   └── prism-ghcolors.css
│       ├── App.jsx
│       ├── AuthContext.jsx
│       └── main.jsx
│
├── backend/                         # Express.js API server
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── battleController.js
│   │   ├── BlogController.js
│   │   ├── chatController.js
│   │   ├── CommentController.js
│   │   ├── ProblemController.js
│   │   ├── ProblemExecutionController.js
│   │   ├── SubmissionController.js
│   │   └── testController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── uploadimg.js
│   ├── models/
│   │   ├── Battle.js
│   │   ├── Blog.js
│   │   ├── Comment.js
│   │   ├── Message.js
│   │   ├── problems.js
│   │   ├── SavedCode.js
│   │   ├── submissions.js
│   │   ├── Testcases.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth_routes.js
│   │   ├── battleRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── compilerRoutes.js
│   │   ├── problemRoutes.js
│   │   ├── savedcode.js
│   │   ├── submissionRoutes.js
│   │   └── testCaseRoutes.js
│   ├── socket/
│   │   ├── battleSocket.js
│   │   └── index.js
│   ├── uploads/
│   ├── utils/
│   │   └── ratingCalculator.js
│   └── server.js
│
└── Compiler/                        # Isolated code execution service
    ├── codes/
    ├── inputs/
    ├── outputs/
    ├── routes/
    │   └── compilerRoutes.js
    ├── CompilerController.js
    ├── executeC.js
    ├── executeCpp.js
    ├── executepy.js
    ├── generateFile.js
    ├── generateInputFile.js
    └── server.js
```

---

## Architecture

```
                     ┌──────────────────────────┐
                     │       User Browser        │
                     └────────────┬─────────────┘
                                  │ HTTP / WebSocket
                                  ▼
                     ┌──────────────────────────┐
                     │      Nginx (Port 80)       │
                     │  Reverse Proxy + Static    │
                     │      File Server           │
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
└──────────────────────────┘
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

# Terminal 3 — Frontend
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

> **Note**: For production, replace `localhost` with your server's public IP or domain name.

---

## API Reference

The backend exposes **30+ REST API endpoints** across **10 resource groups**:

| Resource | Base Route | Description |
|---|---|---|
| Auth | `/api/example` | Login, signup, logout, OTP, password reset |
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

## Deployment

This project is deployed on **AWS EC2 (t2.micro, Ubuntu 22.04)** using:

| Tool | Purpose |
|---|---|
| **Nginx** | Reverse proxy + serves React static build on port 80 |
| **PM2** | Process manager — keeps all services running, auto-restarts on crash |
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

# 4. Configure Nginx to serve frontend and proxy API
sudo nano /etc/nginx/sites-available/codejudge
sudo systemctl restart nginx
```

---

## Authentication Flow

```
1. Register  →  Password hashed with bcrypt  →  Stored in MongoDB
2. Login     →  JWT token generated  →  Stored in signed httpOnly cookie
3. Request   →  Auth middleware verifies JWT  →  Access granted / denied
4. Forgot PW →  OTP generated  →  Sent via Nodemailer  →  User verifies OTP  →  Password reset
```

---

## How Code Execution Works

```
1. User writes code and clicks "Run"
2. Frontend sends code + language + input to Compiler service (port 5011)
3. Compiler writes code to a temporary file (generateFile.js)
4. Writes input to a temporary input file (generateInputFile.js)
5. Spawns a child_process to compile and execute (executeC / executeCpp / executepy)
6. Timeout enforcement kills the process if it exceeds the time limit
7. Output is captured and returned to the frontend
8. Temporary files are cleaned up after execution
```

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes
```bash
git commit -m "Add: your feature description"
```
4. Push to your branch
```bash
git push origin feature/your-feature-name
```
5. Open a Pull Request

---
