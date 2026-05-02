<div align="center">

![hero](.github/assets/hero.svg)

# AI System for Legal Firms

### Custom AI SaaS for law firms - real case study showing €2,700 initial build + €1,300/month recurring revenue. 315 Reddit upvotes. Demonstrates specific vertical AI SaaS demand with proven recurring revenue model.

![Next.js 14](https://img.shields.io/badge/Next.js%2014-black?style=for-the-badge&logo=next.js&logoColor=white) ![React 18](https://img.shields.io/badge/React%2018-20232a?style=for-the-badge&logo=react&logoColor=61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06b6d4?style=for-the-badge&logo=tailwind-css&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![MIT-License](https://img.shields.io/badge/MIT-License-10b981?style=for-the-badge&logo=open-source-initiative&logoColor=white)

</div>

---

## What is this?

Custom AI SaaS for law firms - real case study showing €2,700 initial build + €1,300/month recurring revenue. 315 Reddit upvotes. Demonstrates specific vertical AI SaaS demand with proven recurring revenue model.

This repository was generated end-to-end by **[MVP Factory](https://github.com/malikmuhammadsaadshafiq-dev)** — eight specialized AI agents that research a real-world demand signal, design the system, write the code, test it, and ship it.

<br />

## Architecture

<div align="center">

![architecture](.github/assets/architecture.svg)

</div>

A request flows from the browser into the Next.js frontend on Vercel, talks to a FastAPI service running as Vercel Python serverless functions, and reads or writes through SQLite locally — swappable to Postgres in production with a single connection string.

<br />

## How it was built

<div align="center">

![agents](.github/assets/agents.svg)

</div>

Each agent owns one stage of the pipeline. They hand off work through a shared task board with no human in the loop.

<br />

## Quick start

```bash
git clone https://github.com/malikmuhammadsaadshafiq-dev/ai-system-for-legal-firms-2bbc
cd ai-system-for-legal-firms-2bbc
npm install
npm run dev
```

Open <http://localhost:3000> and you're in.

<br />

## Deploy

This project is wired up for one-click Vercel deploys — push to `main` and Vercel handles the rest. To deploy from your machine:

```bash
npm i -g vercel
vercel --prod
```

<br />

## License

MIT — generated autonomously by [MVP Factory](https://github.com/malikmuhammadsaadshafiq-dev).
