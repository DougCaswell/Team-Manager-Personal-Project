SELECT teams.*
FROM teams
JOIN user_to_team AS utt ON teams.id = utt.team_id
WHERE utt.user_id = $1