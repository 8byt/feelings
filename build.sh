#!/bin/bash

# cd to current directory
pushd "${0%/*}";
cd webapp && \
yarn build && \
cd .. && \
docker-compose build;
popd;
