FROM hmlandregistry/dev_base_python_flask:3

ENV APP_NAME=land-registry-elements

ADD demo/requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt
