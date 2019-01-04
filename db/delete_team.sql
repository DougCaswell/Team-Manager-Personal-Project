DELETE
FROM user_to_team
WHERE team_Id = $1;

DELETE
FROM teams
WHERE id = $1;