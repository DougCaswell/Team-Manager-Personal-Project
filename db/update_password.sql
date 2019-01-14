UPDATE users
SET hash = $2
WHERE id = $1
RETURNING *;