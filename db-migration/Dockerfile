FROM ubergesundheit/docker-postgres-migrator

COPY migrations/* /migrations/

ENV DB_USER=dev \
	DB_PASSWORD=hunter2 \
	DB_NAME=feelings \
	DB_HOST=db \
	SLEEP=15
ENTRYPOINT ["/bin/sh"]
CMD ["-c", "DB_HOST=$DB_PORT_5432_TCP_ADDR migrate.sh up"]
