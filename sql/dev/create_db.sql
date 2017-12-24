\i variables.sql

CREATE USER :user WITH PASSWORD ':password';
CREATE DATABASE :dbname;
GRANT ALL PRIVILEGES ON DATABASE :dbname TO :user;
