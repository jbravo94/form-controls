FROM centos:centos7.9.2009
RUN touch /root/.bashrc

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 10.1.0

RUN yum install -y libpng12 make gcc-c++
#RUN yum install -y https://packages.endpointdev.com/rhel/7/os/x86_64/endpoint-repo.x86_64.rpm
#RUN yum install -y git

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && npm install -g yarn

#ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
#ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

#SHELL ["/bin/bash", "--login", "-c"]

#RUN echo "export NODE_PATH=$NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules" >> /root/.bashrc
#RUN echo "export PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH" >> /root/.bashrc

