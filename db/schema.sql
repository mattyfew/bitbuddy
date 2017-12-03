DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friend_requests;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    email VARCHAR(100),
    username VARCHAR(30),
    password VARCHAR(100),
    profile_pic TEXT,
    bio TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_requests (

);
