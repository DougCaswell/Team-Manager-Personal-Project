DROP TABLE invites;
DROP TABLE user_to_team;
DROP TABLE events;
DROP TABLE messages;
DROP TABLE teams;
DROP TABLE users;

CREATE TABLE users
(
	id SERIAL PRIMARY KEY,
	email VARCHAR(64) NOT NULL UNIQUE,
	hash TEXT NOT NULL,
	full_name VARCHAR(64),
	phone BIGINT,
	preferred_contact_method VARCHAR(20),
	profile_picture_url TEXT,
	displayed_name VARCHAR(40),
	active BOOLEAN,
	confirmation_code text
);

CREATE TABLE teams
(
	id SERIAL PRIMARY KEY,
	name VARCHAR(32) NOT NULL,
	description VARCHAR(500),
	team_manager INT NOT NULL
);

CREATE TABLE user_to_team
(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	team_id INT NOT NULL
);

CREATE TABLE events
(
	id SERIAL PRIMARY KEY,
	team_id INT NOT NULL,
	name TEXT,
	description TEXT,
	address_line_one TEXT,
	address_line_two TEXT,
	address_line_three TEXT,
	city TEXT,
	state TEXT,
	zip_code INT,
	mandetory BOOLEAN,
	date DATE,
	time TIME
);

CREATE TABLE messages
(
	id SERIAL PRIMARY KEY,
	team_id INT NOT NULL,
	user_id INT NOT NULL,
	message VARCHAR(500)
);

CREATE TABLE invites
(
	id SERIAL PRIMARY KEY,
	team_id INT NOT NULL,
	team_name text,
	user_id INT NOT NULL
);