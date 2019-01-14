UPDATE users
SET full_name = $2, phone = $3, preferred_contact_method = $4, profile_picture_url = $5, displayed_name =$6
WHERE id = $1
RETURNING *