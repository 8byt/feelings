-- Migration: add-sam
-- Created at: 2018-03-26 14:05:11
-- ====  UP  ====

BEGIN;

ALTER TABLE "post"
ADD COLUMN count int;

COMMIT;

-- ==== DOWN ====

BEGIN;

ALTER TABLE "post"
DROP COLUMN count IF EXISTS;

COMMIT;
