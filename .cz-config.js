module.exports = {
  types: [
    { value: "feat", name: "feat:     A new feature" },
    { value: "fix", name: "fix:      A bug fix" },
    { value: "docs", name: "docs:     Documentation only changes" },
    {
      value: "style",
      name: "style:    Code style changes (linting, formatting)",
    },
    {
      value: "refactor",
      name: "refactor: Refactoring code (no behavior changes)",
    },
    { value: "perf", name: "perf:     Performance improvements" },
    { value: "test", name: "test:     Adding or updating tests (Vitest, e2e)" },
    { value: "build", name: "build:    Build system, dependencies, or CI/CD" },
    { value: "ci", name: "ci:       CI configuration changes" },
    {
      value: "chore",
      name: "chore:    Other changes (tasks, tooling, config)",
    },
    { value: "revert", name: "revert:   Revert a previous commit" },
  ],

  scopes: [
    // --- Application Structure ---
    { name: "app", description: "Next.js App Router" },
    { name: "pages", description: "Next.js Pages Router" },
    { name: "components", description: "Shared components" },
    { name: "shadcn", description: "shadcn/ui components or config" },
    { name: "layout", description: "Layout components" },
    { name: "hooks", description: "React hooks" },
    { name: "utils", description: "Utility functions" },
    { name: "types", description: "TypeScript types/interfaces" },
    { name: "styles", description: "SASS files, global styles" },
    { name: "public", description: "Assets in /public" },

    // --- Project Features ---
    { name: "game", description: "Game promotional features" },
    { name: "unity", description: "Unity integration or WebGL" },
    { name: "blog", description: "Blog features" },
    { name: "cms", description: "CMS features" },
    { name: "content", description: "Content updates (MD, JSON)" },

    // --- Backend & Data ---
    { name: "api", description: "API routes" },
    { name: "auth", description: "Authentication (better-auth)" },
    { name: "prisma", description: "Prisma schema, client, migrations" },
    { name: "db", description: "Database logic (MongoDB)" },
    { name: "blob", description: "Vercel Blob storage" },

    // --- Tooling & DX ---
    { name: "storybook", description: "Storybook stories or config" },
    { name: "fumadocs", description: "Fumadocs implementation or content" },
    { name: "logging", description: "Logging configuration (Winston)" },
    { name: "config", description: "Project config files" },
    { name: "test", description: "Vitest config or test setup" },

    // --- Infrastructure ---
    { name: "vercel", description: "Vercel configuration" },
    { name: "infra", description: "Infrastructure (Docker, CI/CD)" },
  ],

  usePreparedCommit: false,
  allowTicketNumber: false,
  prependTicketToHead: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: "TICKET-",
  ticketNumberRegExp: "\\d{1,5}",

  messages: {
    type: "Select the type of change that you're committing:",
    scope: "\nSelect the SCOPE of this change (optional):",
    customScope: "Denote the custom SCOPE of this change (optional):",
    subject: "Write a SHORT, IMPERATIVE-tense description of the change:\n",
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: "List any BREAKING CHANGES (optional):\n",
    footer:
      "List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n",
    confirmCommit: "Are you sure you want to proceed with the commit above?",
  },

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix", "refactor"],
  subjectLimit: 100,
  breaklineChar: "|",
};
