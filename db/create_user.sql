INSERT INTO users
(
    email, hash, confirmation_code, active
)
VALUES
(
    $1, $2, $3, false
)
RETURNING *