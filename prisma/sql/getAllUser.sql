SELECT 
  u.*, 
  ARRAY_AGG(t.feature) AS tags
FROM 
  "user" u
LEFT JOIN 
  tag_user tu ON u.id = tu.user_id
LEFT JOIN 
  tag t ON tu.tag_id = t.id
GROUP BY 
  u.id;