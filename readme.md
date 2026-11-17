# Dokit - Enterprise Asynchronous Document Engine

![Java 21](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot 4.1](https://img.shields.io/badge/Spring_Boot-4.1.2-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![PostgreSQL 18](https://img.shields.io/badge/PostgreSQL-18-336791.svg)
![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg)

**Live Demo:** [Insert Vercel Link Here] | **Backend API:** [Insert Render Link Here]

Dokit is a production-grade, fault-tolerant document processing platform built to demonstrate enterprise software engineering patterns. It securely ingests user documents (PDF, DOCX, TXT), queues them for asynchronous background processing using Apache Tika, and provides a real-time reactive dashboard for tracking job states.

This project was specifically designed to handle long-running I/O tasks without blocking the main HTTP threads, mirroring the architecture used in automated loan underwriting, ATS resume parsing, and RAG ingestion pipelines.

## 🚀 Enterprise Engineering Patterns Implemented

*   **Bounded Asynchronous Worker Pools:** Utilizes Spring's `ThreadPoolTaskExecutor` to restrict concurrent extractions to a fixed number of worker threads and a bounded queue. This guarantees predictable JVM memory utilization and prevents `OutOfMemoryError` crashes during massive traffic spikes.
*   **Job State Machine & Poison Pill Protection:** Background processing jobs transition through a strict state machine (`QUEUED` -> `PROCESSING` -> `COMPLETED` / `FAILED`). Files that trigger unhandled exceptions are automatically queued for a retry. If a file fails 3 times, it is permanently locked into `FATAL_ERROR` to prevent "poison pill" documents from infinitely draining CPU resources.
*   **Insecure Direct Object Reference (IDOR) Prevention:** Documents and processing jobs are tied to specific users via unguessable UUIDs (`ownerId`). All service-layer data queries strictly enforce tenant isolation, guaranteeing users can only view or trigger retries on their own data.
*   **Stateless Security & Password Hashing:** Secures endpoints using Spring Security, enforcing authentication on all API routes (except registration). Passwords are mathematically hashed using `BCryptPasswordEncoder` prior to PostgreSQL persistence.

## 💻 Tech Stack

**Backend (Java / Spring Boot)**
*   **Core:** Java 21, Spring Boot 4.1.2, Spring Web, Spring Security
*   **Database:** PostgreSQL 18, Spring Data JPA, Hibernate
*   **Processing:** Apache Tika (Document text extraction)
*   **Deployment:** Docker (Multi-stage builds), Render

**Frontend (React / Vite)**
*   **Core:** React.js, Vite
*   **Styling:** Tailwind CSS, Lucide React Icons
*   **Architecture:** Modular Component Structure, Custom React Hooks
*   **Deployment:** Vercel

## 📂 Repository Structure

This repository is configured as a monorepo containing both the backend and frontend source code.

```text
├── backend/            # Spring Boot REST API & Background Workers
│   ├── src/            # Java Source Code (Controllers, Services, Config)
│   ├── pom.xml         # Maven Dependencies
│   └── Dockerfile      # Multi-stage containerization blueprint
├── frontend/           # React SPA Dashboard
│   ├── src/            # React Components, Hooks, and Views
│   ├── index.html      # Vite Entry Point
│   └── package.json    # Node Dependencies
└── .gitignore          # Global Git Ignore rules
```

## 🛠️ Local Development Setup

### Prerequisites
*   Java 21+
*   Node.js 18+
*   PostgreSQL 18 running locally on port `5432`

### 1. Database Setup
Create a local PostgreSQL database named `dokit`.
```sql
CREATE DATABASE dokit;
```

### 2. Backend Setup
The backend utilizes the Maven Wrapper, so you do not need to install Maven globally on your machine.
```bash
cd backend
# The application.yml is configured to auto-generate the schema on the first run
./mvnw clean spring-boot:run
```
*The API will start on `http://localhost:8080`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The React application will start on `http://localhost:5173`*

## 🔒 Environment Variables

When deploying to production, the following environment variables must be injected:

**Backend (`application.yml`)**
*   `PORT`: The port the container binds to (e.g., `8080`)
*   `DB_URL`: PostgreSQL JDBC URL (e.g., `jdbc:postgresql://<host>/<dbname>`)
*   `DB_USERNAME`: Database user
*   `DB_PASSWORD`: Database password
*   `FRONTEND_URL`: Allowed CORS origin (e.g., `https://dokit.vercel.app`)

**Frontend (`.env`)**
*   `VITE_API_BASE_URL`: The deployed backend URL (e.g., `https://dokit-backend.onrender.com/api`)

## 🔮 Future Roadmap & Commercialization

Dokit's underlying architecture is built to scale into a fully monetizable SaaS product or a B2B API. Planned future enhancements include:

*   **AI-Powered Structured Data Extraction:** Integrating with LLM APIs to pipe the raw text extracted by Apache Tika into a structured format (JSON/CSV). This converts raw data into actionable insights for specific verticals (e.g., resume parsing for HR, invoice data extraction for FinTech).
*   **OCR Integration (Tesseract / Vision Models):** Expanding ingestion capabilities beyond digital documents to support scanned PDFs and photographed receipts.
*   **SaaS Quota Metering & Billing:** Implementing a credit-based system linked to a payment gateway (Stripe/Razorpay) via webhooks, enabling a freemium model (e.g., 50 free pages/month, paid tiers for batch processing and priority queues).
*   **Server-Sent Events (SSE) / WebSockets:** Upgrading the frontend polling mechanism to SSE or WebSockets to reduce HTTP overhead at massive scale.