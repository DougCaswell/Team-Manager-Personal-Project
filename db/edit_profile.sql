UPDATE users
SET email = $2, full_name = $3, phone = $4, prefered_contact_method = $5, profile_picture_url = $6, displayed_name =$7
WHERE id = $1
RETURNING *