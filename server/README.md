# Discord Status as Image - Backend API

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/)
- [PocketBase](https://pocketbase.io/) executable
- _(Optional)_ [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### 1. Database Setup (PocketBase)

To replicate the required database architecture without importing existing user data:

1. Start your local PocketBase server by running `./pocketbase serve` where you have PocketBase set up.
2. Navigate to the local Admin UI (typically `http://127.0.0.1:8090/_/`) and follow the prompt to create your local administrator account.
3. Navigate to **Settings > Import collections** in the Admin UI.
4. Copy and paste the contents of the `pb_schema.json` file (located in `/src/pocketbase` of this project) into the import window and apply. This automatically builds the `banners` collection and all required structural properties.

### 2. Environment Variables

This project uses environment variables to keep sensitive credentials secure.

1. Locate the `.env.example` file in `/src/pocketbase` and duplicate it. Rename the duplicated file to `.env`.
2. Open the new `.env` file and populate it with your specific `DISI_POCKETBASE_EMAIL` and `DISI_POCKETBASE_PASSWORD`.

### 3. Configure Local Endpoints

The application is configured to automatically handle endpoint routing based on your active environment:

1. When running local development scripts (like `bun run dev`), `NODE_ENV` is set to `development` and the application will automatically route to `http://localhost:5173`. You do not need to manually change the base URLs in the code. You **do** need to configure the URLs in production mode.
2. Ensure your backend is correctly pointing to your local PocketBase instance (default: `http://127.0.0.1:8090`).

### 4. Start the Application

The application will run on `localhost:1911`.

#### Manual Method

```bash
# Install dependencies
bun install

# Install Playwright
npx playwright install

# Start the Express backend in development mode
bun run dev
```

#### Docker Method

If you prefer to run the application in an isolated containerized environment, you can use Docker Compose to spin up the service immediately.

Build and start the container stack in detached mode:

```bash
docker compose up --build -d
```

To view logs and ensure all services are running correctly:

```bash
docker compose logs -f
```
