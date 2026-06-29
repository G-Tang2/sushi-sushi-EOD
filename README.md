# 🍣 Sushi Sushi EOD

A full-stack web application for **Sushi Sushi**, designed to streamline end-of-day (EOD) operations, reduce manual work, and improve the accuracy of daily store reporting.

**🌐 Live Demo:** https://sushi-sushi-eod.vercel.app/

## Features

- 📋 End-of-day reporting workflow
- 💰 Sales and cash reconciliation
- 📦 Inventory tracking
- 👥 Employee-friendly interface
- 📊 Daily summary dashboard
- ✅ Form validation and error handling
- 📱 Responsive design for desktop and tablet

## Tech Stack

### Frontend
- React / Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Supabase
- PostgreSQL

### Development
- Git & GitHub
- ESLint
- Prettier

## Screenshots

> Add screenshots here

| Dashboard | EOD Report |
|-----------|------------|
| ![](docs/dashboard.png) | ![](docs/report.png) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm)
- Supabase project

### Installation

```bash
git clone https://github.com/G-Tang2/sushi-sushi-EOD.git
cd sushi-sushi-EOD

npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # Reusable UI components
├── lib/              # Utilities and API helpers
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
└── styles/           # Global styling
```

## Goals

This project was built to:

- Reduce manual end-of-day paperwork
- Improve reporting accuracy
- Simplify store closing procedures
- Provide a clean, intuitive user experience

## License

This project is licensed under the MIT License.

---

Built by **Garvin Tang**
