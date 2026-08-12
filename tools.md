# Tools and Services

This document lists the tools, frameworks, and Google Cloud services used across this repository.

## Languages and Runtimes

* **Node.js** — runtime for the backend server and frontend build tooling.
* **TypeScript** — used for the frontend application code (`frontend/`).

## Frontend (`frontend/`)

* **[Vite](https://vitejs.dev/)** — build tool and dev server (`vite`, `@vitejs/plugin-react`).
* **[React](https://react.dev/)** / **react-dom** — UI framework.
* **[Recharts](https://recharts.org/)** — charting library used for performance visualizations.
* **[Lucide React](https://lucide.dev/)** — icon set.
* **[@google/genai](https://www.npmjs.com/package/@google/genai)** — client SDK used to call Gemini models via Vertex AI (see `frontend/services/gemini.ts`).

## Backend (`backend/`)

* **[Express](https://expressjs.com/)** — HTTP server framework (`backend/server.js`).
* **[google-auth-library](https://github.com/googleapis/google-auth-library-nodejs)** — obtains Google Cloud credentials/access tokens for calling Vertex AI APIs.
* **[express-rate-limit](https://www.npmjs.com/package/express-rate-limit)** — rate limiting middleware to protect the proxy endpoints.
* **[ws](https://www.npmjs.com/package/ws)** — WebSocket server/client support, used to proxy the Vertex AI bidirectional streaming API.
* **[node-fetch](https://www.npmjs.com/package/node-fetch)** — HTTP client used to forward proxied requests.
* **[dotenv](https://www.npmjs.com/package/dotenv)** — loads environment variables from `backend/.env.local`.
* **[nodemon](https://nodemon.io/)** — dev-only auto-restart of the backend server.

## Google Cloud Services

* **[Vertex AI](https://cloud.google.com/vertex-ai)** — the backend proxies requests to Vertex AI's `generateContent`, `predict`, `streamGenerateContent`, and bidirectional streaming (`BidiGenerateContent`) endpoints under `aiplatform.googleapis.com`.
* **[Google Cloud SDK / gcloud CLI](https://cloud.google.com/sdk/docs/install)** — used locally for authentication (`gcloud init`, `gcloud auth application-default login`) so the backend can obtain Application Default Credentials.

## Repository Tooling

* **[npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)** — the root `package.json` defines `frontend` and `backend` as workspaces.
* **[concurrently](https://www.npmjs.com/package/concurrently)** — runs the frontend and backend dev servers together via `npm run dev`.
