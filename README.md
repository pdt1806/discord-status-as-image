<p align="center"><img src="https://disi.fyi/images/disi-logo.png" width="20%" style="min-width: 300px"></img></p>
<h1 align="center">Discord Status as Image</h1>

<p align="center">Turn your Discord status into a simple, eye-catching image for easy sharing and display. With your username and just a few clicks, setting things up is quick and easy!</p>

![Landing page](https://raw.githubusercontent.com/pdt1806/discord-status-as-image/main/public/images/disi-readme.png)

## What is Discord Status as Image?

Discord Status as Image (DISI) is a web application that dynamically generates real-time, customizable images of a user's Discord status. It allows users to embed their live Discord activity (online status, custom status, currently playing) across the web in various formats including `.png` and embeddable `iframes`.

## Features

- **Simple**: Just enter your Discord username and you're all set.
- **Customizable**: Set your own banner (yes, even your own image), background color, etc. to make your status image unique.
- **Live**: Your status image updates in real-time, so you don't have to worry about it being outdated.
- **Multiple formats**: Deliver your status image in multiple formats, including .png and embeddable iframe.
- **Shareable**: Share your Discord profile and status image across different platforms with just a click of a button.

## How to get a Discord Status image?

1. Access this website: https://disi.fyi
2. Following the instructions on the website
   1. Click on the invite link to join the server.
   2. Fill out the form with your Discord username and the desired settings.
   3. Hit Generate and you're good to go!

## Example/Demonstration

See below for the live demonstration of this tool, as well as my Discord profile and status!

<a href="https://discord.com/users/458550515614351360" target="_blank"><img width="300px" height="100px" src="https://api.disi.fyi/smallcard/458550515614351360?&bg1=1B1973&bg2=875799&activity=true&angle=45&avatarDecoration=true&primaryGuild=true"></img></a>

<a href="https://discord.com/users/458550515614351360" target="_blank"><img width="300px" src="https://api.disi.fyi/largecard/458550515614351360?&bg=FFF7C9&activity=true&aboutMe=Found%20this%20card%20cool%3F%20Get%20one%20for%20yourself%20here%3A%0Ahttps%3A%2F%2Fdisi.fyi%0A%0ALeaving%20a%20star%20on%20this%20repo%20would%20be%20appreciated!&pronouns=he%2Fhim&bannerID=dpxyhvok3ovzc01&avatarDecoration=true&primaryGuild=true"></img></a>

## System Status

The uptime status of all three DISI services—Backend API, Discord Worker (Refiner), and Database (PocketBase)—can be monitored at https://uptime.bennynguyen.dev/status/discord-status-as-image. Powered by [Uptime Kuma](https://github.com/louislam/uptime-kuma).

## System Architecture

DISI utilizes a microservice-inspired architecture separating the frontend client, the backend API, the Discord worker, and the image database.

![Data flow](https://raw.githubusercontent.com/pdt1806/discord-status-as-image/main/public/images/disi-data-flow.png)

### Technical Highlights

- **Programmatic Image Generation:** Instead of relying on rigid low-level drawing libraries, DISI uses a headless browser pipeline via **Playwright**. The Express backend constructs a HTML/CSS layout (from React frontend) populated with live Discord data, renders the viewport, and captures a screenshot. This allows for complex UI elements (CSS gradients, rounded avatars, custom fonts) that would be difficult to draw manually.
- **Decoupled Architecture:** To handle Discord's strict rate limits for real-time presence, the Discord Worker API (Refiner) is isolated into a standalone worker using **Python and FastAPI**. This ensures the main Express rendering API remains highly responsive and scales independently of the Discord Worker API.

## Local Development Setup

### Frontend

1. When running local development scripts (like `bun run dev`), `NODE_ENV` is set to `development` and the application will automatically route to their respective local endpoints. You do not need to manually change the base URLs in the code. You **do** need to configure the URLs in production mode (`src/utils/const.ts`).
2. Start the application

```bash
# Install dependencies
bun install

# Start Vite in development mode
bun run dev
```

The application now runs on `localhost:5173`.

### Backend API and Database (PocketBase)

See [`/server`](https://github.com/pdt1806/discord-status-as-image/tree/main/server).

### Discord Worker

See [Refiner Discord Bot](https://github.com/pdt1806/refiner-discord-bot).

## Tech Stack

- Frontend
  - [React](https://reactjs.org/)
  - [Vite](https://vite.dev/)
  - [Mantine](https://mantine.dev/)
- Backend API (see [`/server`](https://github.com/pdt1806/discord-status-as-image/tree/main/server))
  - [Node.js](https://nodejs.org/)
  - [Bun](https://bun.sh/)
  - [Express](https://expressjs.com/)
  - [Playwright](https://playwright.dev/)
- Discord Worker (see [Refiner Discord Bot](https://github.com/pdt1806/refiner-discord-bot))
  - [discord.py](https://discordpy.readthedocs.io/en/latest/)
  - [Uvicorn](https://www.uvicorn.org/)
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [SlowAPI](https://slowapi.readthedocs.io/)
- Infrastructure and Deployment
  - [PocketBase](https://pocketbase.io/)
  - [Docker](https://docker.com/)
  - [PM2](https://pm2.keymetrics.io/)
  - [Cloudflare Pages](https://pages.cloudflare.com/)

## Main Developer

| <a href="https://github.com/pdt1806" target="_blank"> <img src="https://avatars.githubusercontent.com/u/78996937?v=4" alt="" width="96px" height="96px"> </a> |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                             [pdt1806](https://github.com/pdt1806)                                                             |

## License

Discord Status as Image is licensed under the MIT License. See [`LICENSE`](https://github.com/pdt1806/discord-status-as-image/blob/main/LICENSE) for details.

## Contributing

Data validation and clean, modular code are priorities for this repository. If you are submitting a pull request, please ensure consistent typing and error handling across the frontend and backend.
