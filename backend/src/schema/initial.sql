CREATE DATABASE hottest100;

CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    submitted boolean NOT NULL DEFAULT false,
    unique_code varchar(255)
);

CREATE TABLE IF NOT EXISTS song (
    id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    artist varchar(255) NOT NULL,
    spotify_link varchar(255) NOT NULL,
    user_id int NOT NULL,
    FOREIGN KEY (user_id) REFERENCES person (id)
);

CREATE TABLE IF NOT EXISTS song_votes (
    id SERIAL PRIMARY KEY,
    song_id int NOT NULL,
    user_id int NOT NULL,
    FOREIGN KEY (song_id) REFERENCES song (id),
    FOREIGN KEY (user_id) REFERENCES person (id)
);