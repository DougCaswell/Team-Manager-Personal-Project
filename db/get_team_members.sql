SELECT users.*
FROM users
JOIN user_to_team ON users.id = user_to_team.user_id
WHERE user_to_team.team_id = $1