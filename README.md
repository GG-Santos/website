# Underdogs Studios Website

A modern, full-stack website for Underdogs Studios showcasing the game **Juanito Bayani** - A Single-Player Roguelite Action RPG Exploring the Gamification of Philippine Mythological Creatures for Quality Education.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Sass
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Better Auth
- **API**: tRPC
- **Editor**: Tiptap (Rich Text Editor)
- **Documentation**: Fumadocs
- **Testing**: Vitest, Playwright
- **Component Development**: Storybook
- **Deployment**: Vercel
- **Storage**: Vercel Blob Storage
- **Consent Management**: c15t

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- MongoDB database (local or Atlas)
- Vercel account (for deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/GG-Santos/website.git
cd website
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: MongoDB connection string
- `BETTER_AUTH_SECRET`: Secret key for Better Auth
- `BETTER_AUTH_URL`: Base URL for authentication
- Additional variables as needed for your setup

4. Generate Prisma Client:
```bash
npm run db:generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter (Biome)
- `npm run format` - Format code (Biome)
- `npm test` - Run tests (Vitest)
- `npm run storybook` - Start Storybook
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio
- `npm run db:test` - Test database connection

## 🏗️ Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (admin)/      # Admin dashboard routes
│   │   └── (public)/     # Public-facing routes
│   ├── components/        # React components
│   ├── lib/              # Utility functions and configurations
│   ├── server/           # Server-side code (tRPC routers)
│   ├── styles/           # Global styles and SCSS files
│   └── content/          # MDX documentation content
├── prisma/               # Prisma schema and migrations
├── generated/            # Generated Prisma Client (committed)
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🗄️ Database

This project uses MongoDB with Prisma ORM. The Prisma Client is generated to `./generated/client` and committed to version control (as per Prisma's Vercel deployment guide).

### Models

- **User** - User accounts and authentication
- **BlogPost** - Blog articles
- **RoadmapItem** - Roadmap entries
- **GameAsset** - Game assets and artwork
- **GameObjective** - Game objectives
- **Investor** - Investor information
- **Testimonial** - User testimonials
- **SiteSettings** - Site configuration
- **Consent Management** - c15t consent models

## 🔐 Authentication

Authentication is handled by Better Auth. Configure your authentication settings in the environment variables.

## 🎨 Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **Sass** - For custom styles and animations
- **shadcn/ui** - Component library built on Radix UI

## 📝 Content Management

The site includes an admin dashboard for managing:
- Blog posts
- Roadmap items
- Game assets
- Site settings
- Testimonials
- Investors

## 🧪 Testing

- **Vitest** - Unit and integration tests
- **Playwright** - End-to-end testing
- **Storybook** - Component development and testing

## 🚢 Deployment

This project is configured for deployment on Vercel:

1. **Prisma Client**: Generated during `postinstall` and `build` scripts
2. **Native Modules**: Tailwind CSS v4 native modules are included via `outputFileTracingIncludes`
3. **Build Configuration**: See `vercel.json` for build settings

### Vercel Configuration

The project includes:
- `vercel.json` with build commands
- `next.config.ts` with output file tracing for native modules
- Prisma client committed to version control

## 📚 Documentation

Documentation is built with Fumadocs and available at `/docs` (when configured).

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

Private project - All rights reserved

## 👥 Team

Underdogs Studios - A team of six passionate developers

## 🔗 Links

- [Game Website](https://your-domain.com)
- [Roadmap](https://your-domain.com/roadmap)
- [Blog](https://your-domain.com/blog)

---

Built with ❤️ by Underdogs Studios

