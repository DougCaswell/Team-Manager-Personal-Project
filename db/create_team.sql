INSERT INTO teams
(
    name, description, team_manager
)
VALUES
(
    $1, $2, $3
)
returning *;
