UPDATE teams
SET team_manager = $2
WHERE id = $1
RETURNING*