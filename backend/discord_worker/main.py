import asyncio
import os
from contextlib import asynccontextmanager

import discord
from discord.ext import commands
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from utils import extract_urls, get_activity_and_mood

# ------------------ #

load_dotenv()

APP_ID = os.environ["APP_ID"]
TOKEN = os.environ["TOKEN"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    bot_task = asyncio.create_task(bot.start(TOKEN))
    yield
    # cleanly shut down the Discord bot when Uvicorn stops
    await bot.close()
    bot_task.cancel()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.environ.get(
            "DISI_CORS_ORIGINS",
            "https://disi.bennynguyen.dev,https://disi.fyi,"
            "http://localhost:5173,http://localhost:1911",
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ------------------ #


class Bot(commands.Bot):
    def __init__(self):
        super().__init__(
            command_prefix="ref!",
            intents=discord.Intents.all(),
            application_id=APP_ID,
        )


bot = Bot()


# ------------------ #


@app.get("/")
def home():
    return {"message": "API of Refiner Discord Bot"}


@app.get("/user/{id}")
@limiter.limit("60/minute")
async def get_user_info(
    request: Request, id: str, full: str = "false", extend: str = ""
):
    if not id:
        raise HTTPException(status_code=400, detail="ID parameter is missing.")
    full_required = full.lower() == "true"

    extended_keys = [key.strip() for key in extend.split(",")] if extend else []

    guild = bot.guilds[0]

    member_short = discord.utils.find(lambda m: str(m.id) == id, guild.members)

    if not member_short:
        raise HTTPException(status_code=404, detail="User not found in the server.")

    activity, mood = get_activity_and_mood(member_short.activities)

    primary_guild = (
        {
            "badge": member_short.primary_guild.badge.url,
            "tag": member_short.primary_guild.tag,
        }
        if member_short.primary_guild and member_short.primary_guild.tag != None
        else None
    )

    try:
        user_info = {
            "id": str(member_short.id),
            "username": member_short.name,
            "display_name": member_short.display_name,
            "avatar": (
                member_short.avatar.url.replace("size=1024", "size=512")
                if member_short.avatar
                else (
                    member_short.default_avatar.url
                    if member_short.default_avatar
                    else None
                )
            ),
            "status": member_short.raw_status,
            "created_at": member_short.created_at.strftime("%m-%d-%Y"),
            "mood": mood,
            "public_flags": (
                [flag.name for flag in member_short.public_flags.all()]
                if member_short.public_flags
                else None
            ),
        }

        if "primaryGuild" in extended_keys:
            user_info["primary_guild"] = primary_guild

        if "avatarDecoration" in extended_keys:
            user_info["avatar_decoration"] = (
                str(member_short.avatar_decoration)
                if member_short.avatar_decoration
                else None
            )

        if "activity" in extended_keys:
            user_info["activity"] = activity

        if full_required:
            # The followings require full data (which means longer time, about 150-200ms):
            #     - accent_color
            #     - banner

            # Full data => fetch_user => Discord API => 150-200ms

            member = await bot.fetch_user(id)

            user_info["banner"] = (
                member.banner.url.replace("size=512", "size=1024")
                if member.banner
                else None
            )
            user_info["accent_color"] = (
                str(member.accent_color) if member.accent_color else None
            )

        urls = extract_urls(user_info)
        user_info["urls"] = urls

        return JSONResponse(content=user_info)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e!s}")


@app.get("/username/{username}")
@limiter.limit("5/minute")
def get_id(request: Request, username: str):
    if not username:
        raise HTTPException(status_code=400, detail="Username parameter is missing.")

    guild = bot.guilds[0]

    member = discord.utils.find(lambda m: m.name == username, guild.members)

    if not member:
        raise HTTPException(status_code=404, detail="User not found in the server.")

    return {"id": str(member.id)}
