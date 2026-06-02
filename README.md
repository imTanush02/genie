# ✨ Genie - AI-Powered Code Execution Platform

A modern, full-stack AI-powered code execution platform built with **Next.js 15**, **TypeScript**, and **React 19**. Execute code in secure sandboxes, generate code with AI, and automate workflows—all in one place.

## 🎯 Overview

**Genie** is a production-ready platform that combines:
- 🤖 **AI-Powered Code Generation** - Natural language to executable code
- 🔒 **Secure Code Sandboxes** - Execute code safely in isolated environments
- 👤 **User Authentication** - Enterprise-grade auth with Clerk
- 📊 **Real-time Execution** - Instant code execution with streaming results
- 💾 **Data Persistence** - Full execution history and analytics
- ⚙️ **Workflow Automation** - Event-driven background jobs with Inngest

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│          React Components + TanStack React Query                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION (Clerk)                     │
│                  Secure JWT Token Verification                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (tRPC)                           │
│              Type-Safe API Procedures & Validation              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   EVENT ORCHESTRATOR (Inngest)                  │
│            Trigger Background Job / Agentic Workflow            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────┐
        │   INNGEST AGENTIC LOOP (Durable)    │
        │                                     │
        │  • AI (Gemini 2.0 via OpenRouter)   │
        │  • Decides: Execute? Create files?  │
        │  • Loops until task complete        │
        │                                     │
        │  ├─ Terminal Tool → E2B Sandbox     │
        │  ├─ File Tool → E2B Sandbox         │
        │  └─ Feedback loop to AI             │
        └─────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                         │
│       Save Execution Results, History, & User Data              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE TO CLIENT                           │
│         Display Results via tRPC + React Query Cache            │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow (Simplified)

```
User submits code/prompt
           ↓
    Form Validation (Zod)
           ↓
    tRPC Call to Backend
           ↓
    Clerk Auth Check
           ↓
    Trigger Inngest Event
           ↓
    ┌─────────────────────────────────┐
    │  AI Agent Loop (Inngest)        │
    │                                 │
    │  AI receives prompt             │
    │  ↓                              │
    │  Decides: Run code or files?    │
    │  ↓                              │
    │  Tools execute in E2B Sandbox   │
    │  ↓                              │
    │  AI processes results           │
    │  ↓                              │
    │  Loop until complete            │
    └─────────────────────────────────┘
           ↓
    Save results to Database
           ↓
    Return response to Client
           ↓
    Update UI with results
           ↓
    Display to User
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

### Code Execution & AI
- **E2B Code Interpreter** - Secure, multi-language sandboxing
- **Inngest Agent Kit** - Agentic workflow orchestration
- **Inngest** - Event-driven, durable background jobs
- **Google Gemini 2.0 Flash** (via OpenRouter) - LLM for code generation
- **Sandbox Templates** - Pre-configured execution environments

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
- ✅ **Agentic Workflows** - AI-driven iterative task solving with Inngest
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

   # AI/LLM (Using OpenRouter for cost-effective models)
   OPENROUTER_API_KEY=your_openrouter_key

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
│   ├── trpc/              # tRPC setup & routers
│   ├── modules/           # Feature modules (messages, projects)
│   └── inngest/           # Inngest functions & agents
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
- **Durable Workflows** - Inngest ensures reliable task execution

## 📊 Performance

- **Turbopack** - Ultra-fast local development builds
- **Server-Side Rendering** - Optimized page loads
- **React Query Caching** - Minimized API calls
- **Code Splitting** - Automatic with Next.js
- **Database Indexing** - Optimized Prisma queries
- **Durable Background Jobs** - Inngest handles long-running tasks without blocking

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
- [Inngest Documentation](https://www.inngest.com/docs)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## 📞 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/imTanush02/genie/issues) on GitHub.

---

**Built with ❤️ by [imTanush02](https://github.com/imTanush02)**
