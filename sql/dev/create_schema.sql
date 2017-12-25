\i variables.sql

\c :dbname :user

CREATE SCHEMA :schema AUTHORIZATION :user;

SET search_path TO :schema;

CREATE TABLE "user"
(
  user_id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  time_joined timestamp with time zone DEFAULT now()
);

CREATE TABLE friendship
(
  user_id_a bigint NOT NULL REFERENCES "user" (user_id),
  user_id_b bigint NOT NULL REFERENCES "user" (user_id),
  CONSTRAINT friendship_pk
    PRIMARY KEY (user_id_a, user_id_b)
);

CREATE TABLE feeling
(
  feeling_id serial PRIMARY KEY,
  name text NOT NULL,
  glyph text NOT NULL
);

CREATE TABLE post
(
  post_id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES "user" (user_id),
  feeling_id int NOT NULL REFERENCES feeling (feeling_id),
  parent_id bigint REFERENCES post (post_id),
  time_added timestamp with time zone DEFAULT now()
);
