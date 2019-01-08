SELECT messages.*, users.displayed_name, users.full_name, users.email
FROM messages
JOIN users on users.id = messages.user_id
WHERE team_id = $1;