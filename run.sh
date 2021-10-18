#!/bin/bash

IMAGE="apnex/mermaid-api"
REPO="australia-southeast1-docker.pkg.dev/labops"
docker run -it -v ${PWD}/data:/data ${REPO}/${IMAGE} -i /data/graph1.mmd
