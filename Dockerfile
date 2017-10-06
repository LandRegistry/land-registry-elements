FROM hmlandregistry/dev_base_python_flask:3

RUN yum install -y -q libffi-devel

ENV APP_NAME=land-registry-elements
ENV SECRET_KEY='secretasd'
ENV NODE_ENV='develop'
ENV NPM_CONFIG_PRODUCTION='false'

# Node.JS
RUN curl -SLO "https://nodejs.org/dist/v8.1.1/node-v8.1.1-linux-x64.tar.xz" && \
tar -xJf "node-v8.1.1-linux-x64.tar.xz" -C /usr/local --strip-components=1 && \
ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Python install
ADD requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt

# Node modules
ADD package* ./
RUN rm -rf node_modules/* && \
npm install

# Add various files that the Gulp build task needs
ADD check-node-version.js check-node-version.js
ADD browserslist browserslist
ADD Gulpfile.js Gulpfile.js
ADD demo/demo/assets/src demo/demo/assets/src
ADD src src

# Run the gulp build task
# We copy the resulting output into a temporary directory since the filesystem at this point is transitory
# This temporary folder will be copied back in the run CMD
RUN npm run build && \
rm -rf /tmp/land-registry-elements && \
mkdir -p /tmp/land-registry-elements/demo/demo/assets/dist && \
mkdir -p /tmp/land-registry-elements/demo/demo/assets/src/scss/vendor && \
mkdir -p /tmp/land-registry-elements/demo/demo/templates/vendor && \
cp package-lock.json /tmp/land-registry-elements/package-lock.json | true && \
cp -r demo/demo/templates/vendor/govuk_template.html /tmp/land-registry-elements/demo/demo/templates/vendor && \
cp -r demo/demo/assets/src/scss/vendor/* /tmp/land-registry-elements/demo/demo/assets/src/scss/vendor && \
cp -r demo/demo/assets/dist/* /tmp/land-registry-elements/demo/demo/assets/dist

CMD ["./run.sh"]
