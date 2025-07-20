````markdown
# 🧠 Task Management System

A scalable and extensible full-stack task management system with JWT authentication, Kafka event streaming, Redis caching, PostgreSQL with Prisma, and a modern Vite + React frontend.

---

## 📦 Project Structure

<!-- You can insert your folder structure or diagram here -->

---

## ✨ Features

### ✅ Backend (Node.js + Express + TypeScript)

- 🔐 **JWT Authentication**  
- 🔄 **Kafka Event Streaming** on task/project create/update/delete  
- 🚀 **Redis Caching** for project list  
- 📋 **Role-based Access Control** (Admin/User)  
- ⚙️ **PostgreSQL via Prisma ORM**  
- 🐳 **Dockerized Setup** with PostgreSQL, Redis, Kafka, Backend  
- 📁 **REST API** for projects and tasks

**Tech Stack:**  
`Express`, `Prisma`, `PostgreSQL`, `Redis`, `KafkaJS`, `JWT`, `Bcrypt`, `TypeScript`, `ts-node-dev`

---

### 🖥️ Frontend (React + Vite + TypeScript)

- 🔐 **JWT-based Login**
- 🧑‍💼 **Role-aware Dashboard UI**
- 🧩 **CRUD for Projects & Tasks**
- 🎨 **TailwindCSS for clean design**
- 📊 **Data visualization with Recharts**
- 🧠 **Optimized API caching via React Query**
- 💡 **Framer Motion for animations**

**Libraries:**  
`React Query`, `React Router DOM`, `Axios`, `TailwindCSS`, `Lucide Icons`, `Radix UI`, `Framer Motion`, `react-hot-toast`

---

## 🚧 TODO

- 🧪 Add **Zod** for backend and frontend input validation
- 🎨 Improve overall **UI/UX** for better usability
- 🧵 Expand **Kafka** usage across more workflows

---

## 🐳 Docker Setup

### Prerequisites
- Docker & Docker Compose installed

### Spin up all services

```bash
docker-compose up --build
````

This will start:

* PostgreSQL on port `5432`
* Redis on port `6379`
* Kafka broker on port `9092`
* Backend server on port `4000`

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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🎥 Demo Video

[![Task Management Demo](https://img.youtube.com/vi/dcC4qJIKlko/0.jpg)](https://www.youtube.com/watch?v=dcC4qJIKlko)

---

## 📬 Follow me

Made with ❤️ by [Chirag Kumar](https://x.com/imchiragkumar)

* 📫 Telegram: [@ichiragkumar](https://t.me/ichiragkumar)
* 💼 GitHub: [github.com/ichiragkumar](https://github.com/ichiragkumar/task-management)
```
