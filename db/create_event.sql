INSERT INTO events
(
    team_id, name, description, address_line_one, address_line_two, address_line_three, city, state, zip_code, mandetory, date, time
)
VALUES
(
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
)