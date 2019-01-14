UPDATE users
SET active = true
WHERE id = $1
RETURNING *