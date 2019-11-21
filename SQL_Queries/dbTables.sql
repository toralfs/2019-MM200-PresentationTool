--------------------- Users --------------------------------
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userID SERIAL NOT NULL primary key,
    name varchar(16) NOT NULL,
    email varchar(32) NOT NULL,
    password char(64) NOT NULL,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE
);

INSERT INTO users (name, email, password) VALUES ('test', 'test@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');

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
    public bool NOT NULL,
    theme varchar(16) NOT NULL,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO presentations (name, slides, ownerID, sharedUsers, public, theme) VALUES ('pres', '{}', 2, '{}', true,'default');


SELECT *
FROM presentations;

UPDATE presentations
SET sharedUsers = sharedUsers || 3
WHERE presentationID = 1;


SELECT *
FROM presentations
WHERE 3 = ANY(sharedUsers);

DELETE FROM presentations WHERE presentationID = 6;

UPDATE presentations SET name='New presentation 2', last_updated=current_timestamp  WHERE presentationID=7;

SELECT * FROM presentations WHERE ownerID=1 ORDER BY last_updated desc;

-------------------- SLIDES ---------------------
DROP TABLE IF EXISTS slides;

CREATE TABLE slides (
    slideID SERIAL NOT NULL primary key,
    data json NOT NULL,
    presentationID int NOT NULL
);

-- Insert new Slide
INSERT INTO slides (data, presentationID) VALUES ('{"type": "A", "title":"New Title", "bgColor": "white"}', 1) RETURNING slideID;

-- Add slide to presentation
UPDATE presentations
SET slides = slides || 12
WHERE presentationID = 25;

-- Remove slide from presentation
UPDATE  presentations
SET slides = array_remove(slides, 11)
WHERE presentationID = 25;

DELETE from slides WHERE slideID = 12;

-- Update slide
UPDATE slides
SET data = '{"type": "C", "list":["test", "test2", "test3"], "image":"test", "bgColor": "light-black"}'
WHERE slideID = 6;


-- Select all slides
SELECT *
FROM slides;
