# 🧠 Task Management System

A scalable full-stack task management system with JWT authentication, Kafka event streaming, Redis caching, PostgreSQL with Prisma, and a modern Vite + React frontend.



## 📁 Project Structure



---

## ✨ Features

### ✅ Backend (Node.js + Express + TypeScript)

- 🔐 JWT Authentication  
- 🔄 Kafka Event Streaming (create/update/delete events)  
- 🚀 Redis Caching (project list)  
- 📋 Role-based Access Control (Admin/User)  
- ⚙️ PostgreSQL + Prisma ORM  
- 🐳 Dockerized Services  
- 📁 REST APIs for projects and tasks

**Tech Stack:**  
`Express`, `TypeScript`, `Prisma`, `PostgreSQL`, `Redis`, `KafkaJS`, `JWT`, `Bcrypt`

---

### 🖥️ Frontend (React + Vite + TypeScript)

- 🔐 JWT-based Login  
- 🧑‍💼 Role-aware Dashboard UI  
- 🧩 CRUD for Projects & Tasks  
- 🎨 TailwindCSS Design  
- 📊 Recharts for Visualization  
- ⚡️ React Query for API Caching  
- 💡 Framer Motion Animations  

**Libraries:**  
`React Query`, `React Router`, `Axios`, `TailwindCSS`, `Lucide`, `Radix UI`, `Framer Motion`, `react-hot-toast`

---

## 🐳 Docker Setup

### Prerequisites

- Docker Desktop installed and running

### Start Services

```bash
docker compose up -d
```

This spins up:

- PostgreSQL on port `5432`
- Redis on port `6379`
- Kafka on port `9092`

---

## 🚀 Running Locally

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

> ⚠️ Make sure Docker services are running before starting the backend.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧩 TODO

- 🧪 Add Zod input validation (backend & frontend)  
- 🎨 Improve UI/UX  
- 🔁 Extend Kafka coverage across features  

---

## 🎥 Demo

[![Task Management Demo](https://img.youtube.com/vi/dcC4qJIKlko/0.jpg)](https://www.youtube.com/watch?v=dcC4qJIKlko)

---

## 📬 Follow Me

Made with ❤️ by [Chirag Kumar](https://x.com/imchiragkumar)

- 🔗 Telegram: [@ichiragkumar](https://t.me/ichiragkumar)  
- 💼 GitHub: [ichiragkumar/task-management](https://github.com/ichiragkumar/task-management)
