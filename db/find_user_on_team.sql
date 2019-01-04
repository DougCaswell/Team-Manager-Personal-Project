SELECT *
FROM users AS u
JOIN user_to_team AS utt ON utt.user_id = u.id
WHERE utt.team_id = $1 AND u.id = $2