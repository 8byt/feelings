FROM postgres

ADD dev/create_db.sql /docker-entrypoint-initdb.d/0_create_db.sql
ADD dev/create_schema.sql /docker-entrypoint-initdb.d/1_create_schema.sql
ADD dev/feelings.sql /docker-entrypoint-initdb.d/2_feelings.sql
ADD dev/variables.sql /variables.sql

VOLUME ["/var/lib/postgresql/data"]
