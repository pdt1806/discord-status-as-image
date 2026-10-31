dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

up:
	docker compose -f docker-compose.yml up -d --build --force-recreate api

up_verbose:
	docker compose -f docker-compose.yml up --build

stop:
	docker stop disi-api-1 disi-discord-worker-1