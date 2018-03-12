\i variables.sql

\c feelings dev

SET CLIENT_ENCODING TO 'utf8';

INSERT INTO feeling (name, glyph) VALUES
('Happy', '😁'),
('Sad', '😢'),
('Angry', '😡'),
('Afraid', '😱'),
('Surprised', '😲'),
('Disgusted', '😒'),
('Amused', '😂'),
('Fire', '🔥');
