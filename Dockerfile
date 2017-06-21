FROM hmlandregistry/dev_base_python_flask:3

RUN yum install -y -q libffi-devel

ENV APP_NAME=land-registry-elements
ENV SECRET_KEY='secretasd'
ENV NODE_ENV='develop'
ENV NPM_CONFIG_PRODUCTION='false'

RUN curl -SLO "https://nodejs.org/dist/v8.1.1/node-v8.1.1-linux-x64.tar.xz" && \
tar -xJf "node-v8.1.1-linux-x64.tar.xz" -C /usr/local --strip-components=1 && \
ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Python install
ADD requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt

ADD package* ./
RUN rm -rf node_modules/* && \
npm install

CMD ["./run.sh"]
