FROM hmlandregistry/dev_base_python_flask:3

ENV APP_NAME=land-registry-elements
ENV SECRET_KEY='secret'

RUN curl -SLO "https://nodejs.org/dist/v6.11.0/node-v6.11.0-linux-x64.tar.xz"
RUN tar -xJf "node-v6.11.0-linux-x64.tar.xz" -C /usr/local --strip-components=1
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN yum install -y -q libffi-devel

# NodeJS install
ADD package.json package.json
RUN rm -rf node_modules
RUN npm install
RUN npm install govuk-elements-sass
RUN npm install govuk_template_jinja

# Python install
ADD demo/requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt

# Add and build the frontend assets
ADD Gulpfile.js Gulpfile.js
ADD demo/demo/assets demo/demo/assets
ADD src src
RUN npm run build
