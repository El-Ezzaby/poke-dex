# ⚡ Next.js Pokédex (Gen 1)

A resilient Pokédex web application built with Next.js, TypeScript, and Tailwind CSS. Developed as part of a software engineering internship project focusing on clean architecture, robust error handling, and modern React patterns.

## ✨ Key Features

* **Server-Side Rendering & ISR:** Pre-fetches the Generation 1 Pokémon list on the server with a 1-hour Incremental Static Regeneration (ISR) cache.
* **Instant Live Search:** Client-side filtering with a sticky search bar and instant focus reset (`useRef`).
* **Resilient Network Handling:** Centralized retry logic (`lib/api-error.tsx`) featuring exponential backoff and automatic retries for rate limits (429) and server errors ($\ge 500$).
* **Race Condition Prevention:** Detail views utilize `AbortController` in client components to clean up pending network requests during rapid user navigation.
* **Graceful Error Boundaries:** Root-level and component-level error handling to ensure fallback UI states during network failures.

## 📁 Project Architecture

```text
poke-dex/
├── app/
│   ├── components/
│   │   └── PokemonClientList.tsx  # Client-side searchable grid & sticky search bar
│   ├── lib/
│   │   └── api-error.tsx          # Shared resilient fetcher with exponential backoff & ISR
│   ├── pokemon/
│   │   └── [id]/
│   │       ├── page.tsx           # Dynamic server route wrapper with Suspense
│   │       └── PokemonDetails.tsx # Client detail view with AbortController & retry states
│   ├── error.tsx                  # Global application error boundary
│   ├── favicon.ico
│   ├── globals.css                # Global Tailwind CSS styles
│   ├── layout.tsx                 # Root layout wrapper
│   └── page.tsx                   # Main server home page (Gen 1 list fetcher)
├── public/
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── README.md                      # Project documentation
└── tsconfig.json
```

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Data Source:** [PokéAPI](https://pokeapi.co/)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/El-Ezzaby/poke-dex>
cd poke-dex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.
