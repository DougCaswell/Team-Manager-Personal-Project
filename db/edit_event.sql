UPDATE events
SET name = $2, description = $3, address_line_one = $4, address_line_two = $5, address_line_three = $6, city = $7, state = $8, zip_code = $9, mandetory = $10, date = $11, time = $12
WHERE id = $1
RETURNING *