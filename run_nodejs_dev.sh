# Make sure our custom installed land-registry-elements app is visible to node
# Normally this would either be a dependency of the app in it's package.json
# or it would be installed globally. Here however we have installed it to the
# dev env's /apps directory for consistency and ease of development
# NODE_PATH=/vagrant/apps/land-registry-elements:$NODE_PATH

# Install node modules
# npm install --no-bin-links
# npm rebuild node-sass

# And start the development server
# npm install --no-bin-links -g nodemon
# npm run dev --port=$PORT
npm start --port=$PORT
