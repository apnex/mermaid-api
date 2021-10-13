#!/bin/bash

docker run -it -v ${PWD}/data:/data apnex/mermaid-api -i /data/graph1.mmd
