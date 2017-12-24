DB_NAME=feelings
SCHEMA=dev
DUMP_FILE="data.sql"
CREATE_SCHEMA="create_schema.sql"
DROP_SCHEMA="drop_schema.sql"

pg_dump feelings -a -f data.sql -n dev
psql -f drop_schema.sql
psql -f create_schema.sql
psql -d feelings -f data.sql
