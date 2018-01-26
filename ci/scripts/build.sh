#!/bin/bash -eux

cwd=$(pwd)

export GOPATH=$cwd/go

pushd $GOPATH/src/github.com/ONSdigital/ermintrude
  make node-modules build && cp Dockerfile.concourse build/ermintrude $cwd/build
popd