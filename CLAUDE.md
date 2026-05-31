# acore-ranking Project Context

## Project Overview

AzerothCore private server ranking service. Replaces legacy PHP `wow_wrapper` with a modern Express + React + TypeScript stack.

## Architecture

- **Monolithic container**: Single Docker image serves both API and static files via Express
- **Backend**: Express + TypeORM (multi-DB: auth/characters/world) + ioredis + pino
- **Frontend**: React 18 + Vite + TanStack Query/Table + Tailwind CSS + shadcn/ui

## Key Design Decisions

1. **Single Docker image**: Frontend build output copied to `backend/dist/public`, served by Express static middleware
2. **API format compatibility**: Response uses `{success, count, data}` to match legacy PHP frontend expectations
3. **Mount spell IDs inlined**: `spell.csv` (48MB) processed at build time to ~3KB TypeScript constant
4. **iframe-first**: All pages designed for embedding, no fixed widths, responsive tables

## Directory Structure

- `backend/src/routes/`: Thin HTTP routes only
- `backend/src/services/`: Thick business logic, cache management
- `backend/src/repositories/`: TypeORM query encapsulation
- `frontend/src/features/`: Feature-based organization (online/ranking/hardcore/...)
- `frontend/src/shared/`: Cross-feature utilities, API client, components

## Environment

- Node.js 20+
- Port: 9000 (Tencent Cloud SCF default)
- MySQL 8+ (read-only connections to AzerothCore databases)
- Redis 7+ (caching with TTL: 60s/300s/1800s)

## Development Workflow

- Main branch: `develop`
- CI/CD: GitHub Actions → Docker build → TCR → SCF deploy
- Commit messages: bilingual (English / Chinese)
