FROM hmlandregistry/dev_base_python_flask:3

ENV APP_NAME=land-registry-elements
ENV SECRET_KEY='secret'

RUN curl -SLO "https://nodejs.org/dist/v8.1.1/node-v8.1.1-linux-x64.tar.xz"
RUN tar -xJf "node-v8.1.1-linux-x64.tar.xz" -C /usr/local --strip-components=1
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN yum install -y -q libffi-devel

# Python install
ADD requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt

RUN rm -rf node_modules
ADD package.json package.json
RUN npm install
RUN npm install govuk-elements-sass
RUN npm install govuk_template_jinja

CMD ["./run.sh"]
