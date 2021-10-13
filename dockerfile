FROM node:current-slim AS build
LABEL stage=intermediate
WORKDIR "/root"
COPY ./lib /root/lib
RUN cd /root/lib && npm install

FROM node:current-slim
ARG VERSION
ADD install-dependencies.sh /install-dependencies.sh
RUN chmod 755 /install-dependencies.sh && /install-dependencies.sh

#RUN useradd -ms /bin/bash mermaidcli
#WORKDIR /home/mermaidcli
USER root
WORKDIR /root
COPY --from=build /root/lib /root/lib
RUN yarn add @mermaid-js/mermaid-cli@$VERSION
ADD puppeteer-config.json /root/puppeteer-config.json

WORKDIR /root/lib
ENTRYPOINT ["/root/lib/server.js"]
