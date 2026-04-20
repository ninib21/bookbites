# Pretty Party Sweets

A full-featured website for a custom dessert table and party sweets business, built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- 🎨 Beautiful marketing pages with responsive design
- 📝 Inquiry and booking system
- 🖼️ Gallery management
- 📦 Package pages
- ❓ FAQ section
- 📋 Policies page
- 👤 Admin dashboard for lead management
- 📧 Email notifications
- 📊 Export-ready lead management

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Forms**: React Hook Form + Zod validation
- **Email**: Resend
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pretty-party-sweets
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials and other settings.

4. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
pretty-party-sweets/
├─ prisma/
│  └─ schema.prisma          # Database schema
├─ public/                    # Static assets
├─ src/
│  ├─ app/                    # Next.js App Router pages
│  │  ├─ (site)/             # Public marketing pages
│  │  ├─ admin/              # Admin dashboard
│  │  └─ api/                # API routes
│  ├─ components/
│  │  ├─ global/             # Shared components
│  │  ├─ home/               # Homepage sections
│  │  └─ ui/                 # Reusable UI components
│  ├─ lib/                    # Utilities and configurations
│  ├─ styles/                 # Global styles and tokens
│  └─ types/                  # TypeScript type definitions
└─ package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

## Build Progress

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Project initialization
- [x] Dependencies installed
- [x] Tailwind CSS configured
- [x] TypeScript configured
- [x] Global layout created
- [x] Design tokens created
- [x] Header/Footer components
- [x] Database schema defined
- [x] Prisma setup

### ✅ Phase 2: UI System (IN PROGRESS)
- [x] PageHero component
- [x] SectionShell component
- [x] CTASection component
- [x] Global styles and utilities
- [ ] Button component
- [ ] Input component
- [ ] Card component
- [ ] Modal component
- [ ] Form components

### 🚧 Phase 3: Public Pages (IN PROGRESS)
- [x] Homepage
- [ ] About page
- [ ] Services page
- [ ] Gallery page
- [ ] Packages page
- [ ] FAQ page
- [ ] Policies page
- [ ] Contact page

### ⏳ Upcoming Phases
- Phase 4: Content/Data layer
- Phase 5: Inquiry and contact system
- Phase 6: Booking flow
- Phase 7: Admin auth
- Phase 8-15: Dashboard, notifications, testing, deployment

## Environment Variables

See `.env.example` for required environment variables.

## Database

The project uses PostgreSQL with Prisma ORM. Run migrations to set up the database schema:

```bash
npm run db:migrate
```

## License

Private - All rights reserved
