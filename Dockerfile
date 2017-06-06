FROM hmlandregistry/dev_base_python_flask:3

ENV APP_NAME=land-registry-elements

RUN yum install -y -q libffi-devel

ADD demo/requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt
