#!/bin/bash
NEW_URL=$(echo $1 | sed 's|/$||')
docker exec -it company-profile-frontend sh -c "find .next -type f -exec sed -i \"s|http://localhost:3000/api|$NEW_URL/api|g\" {} +"
docker exec -it cms_app sh -c "find build -type f -name '*.js' | xargs sed -i \"s|http://localhost:3000/api|$NEW_URL/api|g\""
docker-compose restart frontend cms
echo "✅ URL Updated to $NEW_URL"