# Make sure our custom installed land-registry-elements app is visible to node
# Normally this would either be a dependency of the app in it's package.json
# or it would be installed globally. Here however we have installed it to the
# centos dev env's /apps directory for consistency and ease of development
# NODE_PATH=/vagrant/apps/land-registry-elements:$NODE_PATH

node build/devServer.js --port=$PORT
