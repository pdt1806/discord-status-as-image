# Discord Status as Image - Backend API

## Local Development Setup

### Prerequisites

- [Bun](https://bun.sh/)
- A Cloudflare account with an [R2 bucket](https://developers.cloudflare.com/r2/)
- _(Optional)_ [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### 1. Configure Cloudflare R2

Create an R2 bucket, then create an R2 API token with permission to read and write objects in that bucket. The token provides an access key ID and secret access key. Find your Cloudflare account ID in the Cloudflare dashboard.

### 2. Configure Environment Variables

1. Copy `.env.example` in the `api` directory to `.env`.
2. Set `R2_BUCKET_NAME` to your bucket name, `R2_ACCOUNT_ID` to your Cloudflare account ID, and `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` to the credentials from your R2 API token.
3. Adjust the frontend URLs or comma-separated CORS origins if needed.

### 3. Start the Application

The application runs on `localhost:1911`. During development, it uses `http://localhost:5173` as the frontend URL by default.

#### Manual Method

```bash
# Install dependencies
bun install

# Install Playwright's browser
bunx playwright install chromium

# Start the Express backend in development mode
bun run dev
```
