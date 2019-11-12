--------------------- Users --------------------------------
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userID SERIAL NOT NULL primary key,
    name varchar(16) NOT NULL,
    email varchar(32) NOT NULL,
    password char(64) NOT NULL
);

-- Select all users
SELECT *
FROM users
ORDER BY userID;

--------------------- Presentations -------------------------
DROP TABLE IF EXISTS presentations;

CREATE TABLE presentations (
    presentationID SERIAL NOT NULL primary key,
    name varchar(32) NOT NULL,
    slides int[],
    ownerID int NOT NULL,
    sharedUsers int[],
    theme json NOT NULL
);

INSERT INTO presentations (name, slides, ownerID, sharedUsers, theme) VALUES ('pres', '{}', 2, '{}', '{"theme":"default"}');

SELECT *
FROM presentations;


-------------------- SLIDES ---------------------
DROP TABLE IF EXISTS slides;

CREATE TABLE slides (
    slideID SERIAL NOT NULL primary key,
    data json NOT NULL,
    presentationID int NOT NULL
);

-- Insert new Slide
INSERT INTO slides (data, presentationID) VALUES ('{"type": "1", "title":"New Title", "bgColor": "white"}', 9) RETURNING slideID;

-- Add slide to presentation
UPDATE presentations
SET slides = slides || 17
WHERE presentationID =9;

-- Remove slide from presentation
UPDATE  presentations
SET slides = array_remove(slides, 2)
WHERE presentationID = 1;


-- Update slide
UPDATE slides
SET data = '{"type": "1", "title":"Changed Title", "bgColor": "light-blue"}'
WHERE slideID = 1;


-- Select all slides
SELECT *
FROM slides;
