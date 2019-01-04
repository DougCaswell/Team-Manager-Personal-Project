DELETE
FROM user_to_team
WHERE user_id = $1 AND team_id = $2;