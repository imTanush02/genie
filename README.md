# ✨ Genie - AI-Powered Code Execution Platform

A modern, full-stack AI-powered code execution platform built with **Next.js 15**, **TypeScript**, and **React 19**. Execute code in secure sandboxes, generate code with AI, and automate workflows—all with a beautiful, responsive UI.

## 🎯 Overview

**Genie** is a production-ready platform that combines:
- 🤖 **AI-Powered Code Generation** - Convert natural language to executable code
- 🔒 **Secure Code Sandboxes** - Execute code safely in isolated environments
- 👤 **User Authentication** - Enterprise-grade auth with Clerk
- 📊 **Real-time Execution** - Instant code execution with streaming results
- 💾 **Data Persistence** - Full execution history and analytics
- ⚙️ **Workflow Automation** - Event-driven background jobs with Inngest

## 🏗️ Architecture

### System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE LAYER                            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Next.js 15 + React 19 (Frontend)                                   │  │
│  │  - Pages built with App Router (app/page.tsx)                       │  │
│  │  - Components: Radix UI, Shadcn, Lucide Icons                       │  │
│  │  - Styling: Tailwind CSS v4 + PostCSS                              │  │
│  │  - State Management: TanStack React Query                           │  │
│  │  - Forms: React Hook Form + Zod Validation                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATION LAYER                                │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Clerk Authentication (@clerk/nextjs)                              │  │
│  │  - User Authentication & Session Management                         │  │
│  │  - Secure JWT token generation                                     │  │
│  │  - Protected routes & API endpoints                                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API LAYER (tRPC)                                   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  tRPC Server (@trpc/server) - Type-safe RPC                        │  │
│  │  ├─ Code Execution Procedures                                      │  │
│  │  ├─ User Management Procedures                                     │  │
│  │  ├─ Sandbox Templates Management                                   │  │
│  │  └─ Real-time Updates                                              │  │
│  │                                                                     │  │
│  │  tRPC Client (@trpc/client + tanstack-react-query)                │  │
│  │  - Automatic type inference from server                            │  │
│  │  - Query caching & optimization                                   │  │
│  │  - Real-time subscriptions                                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CODE EXECUTION ENGINE                                   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  E2B Code Interpreter (@e2b/code-interpreter)                      │  │
│  │  - Sandbox Environment Creation                                     │  │
│  │  - Multi-language Code Execution                                   │  │
│  │  - Secure Isolated Execution                                       │  │
│  │  - Execution Results & Error Handling                              │  │
│  │                                                                     │  │
│  │  Sandbox Templates (sandbox-templates/)                            │  │
│  │  - Pre-configured execution environments                           │  │
│  │  - Language-specific setup                                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI/AGENT LAYER                                        │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  OpenAI Integration (@ai-sdk/openai)                               │  │
│  │  - LLM-powered code generation                                     │  │
│  │  - Natural language to code conversion                             │  │
│  │  - Code analysis & suggestions                                     │  │
│  │                                                                     │  │
│  │  Inngest Agent Kit (@inngest/agent-kit)                            │  │
│  │  - Workflow orchestration                                          │  │
│  │  - Event-driven architecture                                       │  │
│  │  - Background job processing                                       │  │
│  │                                                                     │  │
│  │  Inngest (@inngest/inngest)                                        │  │
│  │  - Event scheduling & triggering                                   │  │
│  │  - Durable execution                                               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                        │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM (@prisma/client)                                        │  │
│  │  - Type-safe database access                                       │  │
│  │  - Query builder & migrations                                      │  │
│  │                                                                     │  │
│  │  PostgreSQL Database (Prisma PG Adapter)                           │  │
│  │  - User data & authentication                                      │  │
│  │  - Code execution history                                          │  │
│  │  - Sandbox templates & configurations                              │  │
│  │  - Execution results & logs                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UTILITIES & HELPERS                                       │
│                                                                              │
│  ├─ Code Highlighting: Prism.js                                            │
│  ├─ Charting: Recharts                                                     │
│  ├─ Data Parsing: Superjson                                                │
│  ├─ UI Components: Recharts, Embla Carousel, React Resizable Panels       │
│  ├─ Notifications: Sonner                                                  │
│  ├─ Date Utilities: date-fns                                               │
│  └─ Validation: Zod schemas                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action (e.g., "Execute Code")
           ↓
    ┌──────────────────────┐
    │  React Component     │
    │  - Form Submission   │
    └──────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  Zod Validation                  │
    │  - Input Schema Validation       │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  tRPC Client                     │
    │  - Type-safe API call            │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  Clerk Auth Middleware           │
    │  - Verify JWT Token              │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  tRPC Server Router              │
    │  - Route to appropriate handler  │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  Business Logic                  │
    │  - Process code/request          │
    └──────────────────────────────────┘
           ↓
         ┌─────────────────────────────────────┐
         │  AI Decision Point                  │
         │  - Should use AI? Should use E2B?   │
         └─────────────────────────────────────┘
         ↙                                    ↘
    ┌──────────────┐              ┌──────────────────────┐
    │ OpenAI Call  │              │  E2B Sandbox         │
    │ - Generate   │              │  - Execute Code      │
    │ - Analyze    │              │  - Capture Output    │
    └──────────────┘              └──────────────────────┘
         ↓                                    ↓
    ┌──────────────────────────────────┐
    │  Prisma ORM                      │
    │  - Save Results to DB            │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  Response to Client              │
    │  - Return Results via tRPC       │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  React Query Cache               │
    │  - Update UI with results        │
    └──────────────────────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │  Display to User                 │
    │  - Show execution result         │
    │  - Syntax highlighting           │
    │  - Error visualization           │
    └──────────────────────────────────┘
```

## 📋 Technology Stack

### Frontend
- **Next.js 15** with Turbopack - Server-side rendering & static generation
- **React 19** - UI framework
- **TypeScript** - Type safety (97% of codebase)
- **Tailwind CSS v4 + PostCSS** - Utility-first styling
- **Radix UI + Shadcn** - Accessible, composable components
- **TanStack React Query** - Server state management
- **React Hook Form + Zod** - Form validation

### Backend & API
- **tRPC** - End-to-end type-safe API
- **Node.js with Next.js API Routes** - Backend runtime

### Authentication
- **Clerk** - Enterprise-grade user management

### Code Execution
- **E2B Code Interpreter** - Secure, multi-language sandboxing
- **Sandbox Templates** - Pre-configured environments

### AI & Automation
- **OpenAI API** - LLM integration for code generation
- **Inngest Agent Kit** - Workflow orchestration
- **Inngest** - Event-driven background jobs

### Database
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary data store

### UI/UX
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Prism.js** - Code syntax highlighting
- **Sonner** - Toast notifications
- **Embla Carousel** - Carousel component
- **React Resizable Panels** - Draggable layouts

### Development Tools
- **ESLint + TypeScript** - Code quality
- **Turbopack** - Fast bundler

## 🚀 Key Features

- ✅ **AI-Powered Code Generation** - Natural language → executable code
- ✅ **Multi-Language Support** - Execute code in multiple programming languages
- ✅ **Secure Sandboxing** - Isolated execution environment with E2B
- ✅ **User Authentication** - Enterprise-grade auth with Clerk
- ✅ **Execution History** - Full tracking and persistence
- ✅ **Real-time Results** - Instant feedback on code execution
- ✅ **Background Jobs** - Async workflows with Inngest
- ✅ **Type-Safe APIs** - End-to-end TypeScript with tRPC
- ✅ **Responsive UI** - Modern, accessible design with Radix UI
- ✅ **Code Analytics** - Charting and visualization

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/imTanush02/genie.git
   cd genie
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/genie"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret

   # OpenAI API
   OPENAI_API_KEY=your_openai_key

   # E2B Sandbox
   E2B_API_KEY=your_e2b_key

   # Inngest
   INNGEST_EVENT_KEY=your_inngest_key
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
genie/
├── app/                    # Next.js App Router pages
├── src/
│   ├── components/         # React components
│   ├── app/               # App-level styles
│   ├── lib/               # Utilities & helpers
│   ├── hooks/             # Custom React hooks
│   └── server/            # Server-side code
├── prisma/                # Database schema & migrations
├── sandbox-templates/     # Pre-configured execution environments
├── public/                # Static assets
├── components.json        # Shadcn configuration
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
└── package.json           # Dependencies
```

## 🔐 Security

- **Secure Sandboxing** - Code executed in isolated E2B environments
- **JWT Authentication** - Secure session tokens via Clerk
- **Type Safety** - TypeScript prevents runtime errors
- **Database Security** - Prisma with prepared statements
- **Input Validation** - Zod schema validation

## 📊 Performance

- **Turbopack** - Ultra-fast local development builds
- **Server-Side Rendering** - Optimized page loads
- **React Query Caching** - Minimized API calls
- **Code Splitting** - Automatic with Next.js
- **Database Indexing** - Optimized Prisma queries

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

```bash
npm run build
npm start
```

### Deploy on other platforms

- See [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [tRPC Documentation](https://trpc.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [E2B Documentation](https://e2b.dev)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## 📞 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/imTanush02/genie/issues) on GitHub.

---

**Built with ❤️ by [imTanush02](https://github.com/imTanush02)**
