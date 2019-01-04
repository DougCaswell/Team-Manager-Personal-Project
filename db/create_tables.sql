CREATE TABLE users
(
	id SERIAL PRIMARY KEY,
	email VARCHAR(64) NOT NULL UNIQUE,
	hash TEXT NOT NULL,
	full_name VARCHAR(64),
	phone INT,
	prefered_contact_method VARCHAR(20),
	profile_picture_url TEXT,
	displayed_name VARCHAR(40)
);

CREATE TABLE teams
(
	id SERIAL PRIMARY KEY,
	name VARCHAR(32) NOT NULL,
	description VARCHAR(500),
	team_manager INT REFERENCES users
);

CREATE TABLE user_to_team
(
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users,
	team_id INT REFERENCES teams
);

CREATE TABLE events
(
	id SERIAL PRIMARY KEY,
	team_id INT REFERENCES teams NOT NULL,
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
