pg_dump feelings -a -f ./data.sql -n dev
psql -f ./drop_schema.sql
psql -f ./create_schema.sql
psql -d feelings -f ./data.sql
