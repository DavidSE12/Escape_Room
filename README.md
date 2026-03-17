# Escape Room Web Application

## Overview

The **Escape Room Application** is a full-stack interactive web application that provides an engaging puzzle-solving experience. Users navigate through a virtual 3D environment and solve four quiz-based puzzles to successfully escape. Built with modern web technologies including **Next.js**, **Express.js**, and **Prisma ORM**, this project demonstrates enterprise-level architecture with clear separation of concerns, persistent data management, and immersive 3D interactions.

---

## Features

- **Interactive Escape Room Gameplay** – Users solve four quiz-based puzzles to complete the room escape challenge
- **Countdown Timer System** – Features pause/resume functionality with automatic failure on timeout
- **Intelligent Hint System** – Real-time feedback and contextual hints for each question
- **Custom Topic Creation** – Topic Wizard enables users to create custom game sets with unique questions and hints
- **Data Persistence** – Questions and user topics stored through Prisma ORM with SQLite backend
- **3D Interactive Interface** – Immersive UI built with React Three Fiber for enhanced user engagement
- **Static HTML Export** – Generate downloadable or cloud-hosted HTML versions deployable on AWS S3
- **Docker Support** – Complete containerization for local development using Docker Compose
- **Cloud Deployment** – Optional AWS integration supporting Amplify, App Runner, and S3

---

## Technology Stack

| Component | Technologies |
|-----------|--------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, React Three Fiber |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | SQLite (Development), PostgreSQL (Production) |
| **Containerization** | Docker, Docker Compose |
| **Deployment** | AWS Amplify, AWS App Runner, AWS S3, AWS CloudFront |
| **Version Control & CI/CD** | GitHub, GitHub Actions |

---

## Project Architecture

The application follows a modular split-architecture pattern separating frontend and backend concerns:

```
root/
├── app/                    # Next.js 15 frontend application
│   ├── components/         # React UI components
│   ├── site/              # Static site pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
│
├── lib/                   # Shared utilities
│   └── prisma.ts         # Prisma client configuration
│
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Data model definitions
│   └── migrations/       # Database migration history
│
├── public/               # Static assets
│
├── docker-compose.yml    # Multi-container orchestration
├── package.json          # Project dependencies
└── README.md            # Documentation
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose (optional, for containerized setup)
- Git

### Installation

#### Option 1: Local Development Setup

**Step 1: Install Dependencies**
```bash
npm install
```

**Step 2: Configure Database**
```bash
npx prisma generate
npx prisma migrate dev
```

**Step 3: Start Development Server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

#### Option 2: Docker Deployment

Run the complete application stack with Docker:

```bash
docker compose up --build
```

This command automatically starts:
- Frontend application on `http://localhost:3000`
- Backend API on `http://localhost:4002`
- Shared SQLite database volume

---

## API Documentation

### RESTful Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Retrieve all topics and associated questions |
| POST | `/api/questions` | Create a new topic with four questions and hints |
| DELETE | `/api/questions?title={title}` | Delete a specific topic by name |

### Response Format

Responses follow a consistent JSON structure with proper HTTP status codes and error handling.

---

## Game Flow

1. **Initialization** – User launches the application and selects "Start Escape"
2. **Puzzle Retrieval** – Questions are dynamically fetched from the database
3. **Interactive Gameplay** – User answers quiz questions with timer tracking progress
4. **Hint Provision** – Contextual hints provided for incorrect answers
5. **Success Condition** – Completion of all four puzzles triggers success animation
6. **Post-Game Actions** – Users can replay the game or export results to AWS S3

---

## Production Deployment

### Frontend Deployment
Deploy the Next.js application using AWS Amplify for automatic CI/CD and hosting:
```bash
npm run build
# Deploy via AWS Amplify Console
```

### Backend Deployment
Host the Express API using AWS App Runner or Elastic Beanstalk for scalable processing.

### Static Content Distribution
Generate and host static HTML versions on AWS S3 with CloudFront CDN for optimized delivery.

---

## Contributing

Contributions are welcome. Please follow these guidelines:
1. Create a feature branch from `main`
2. Commit changes with clear, descriptive messages
3. Submit a pull request with documentation of changes

---

## Author

**Huu Tien Dat Huynh**
- Institution: La Trobe University
- Email: tiendat12122004@gmail.com
- GitHub: [DavidSE12](https://github.com/DavidSE12)

---

## License

This project is provided as-is for educational and development purposes.