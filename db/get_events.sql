SELECT events.*, teams.name as team_name
FROM events
JOIN user_to_team ON user_to_team.team_id = events.team_id
JOIN teams ON teams.id = events.team_id
WHERE user_to_team.user_id = $1;