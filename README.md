# SQL-AGENT

Talk to you database for non-tech users.

## techstack

- nextjs
- turso platform (sqlite db)
- drizzle orm
- openai api / perplexity api
- pnpm

## Local Developmnet Setup

1. Clone the repository

```bash
git clone https://github.com/abhinayjangde/46-sql-agent.git
```

2. Change directory

```bash
cd 46-sql-agent
```

3. Install dependencies

```bash
pnpm install
```

4. Add envronment variables

```bash
GROQ_API_KEY=""
TURSO_DATABASE_URL=""
TURSO_AUTH_TOKEN=""
```

5. Run seed command (make sure you have bun installed)

```bash
pnpm run db:seed
```

6. Run Developement server

```bash
pnpm run dev
```
