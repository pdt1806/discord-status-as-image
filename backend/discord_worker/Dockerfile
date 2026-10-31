FROM python:3.12-slim
WORKDIR /app

RUN pip install --no-cache-dir uv

COPY discord_worker/pyproject.toml discord_worker/uv.lock ./
RUN uv sync --frozen --no-dev

COPY discord_worker/ ./

EXPOSE 8010

CMD ["uv", "run", "--no-sync", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8010"]
