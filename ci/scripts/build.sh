#!/bin/bash -eux

pushd ermintrude
  npm install --prefix src/main/web/ermintrude --unsafe-perm
  mvn -Dmaven.test.skip clean package dependency:copy-dependencies
  cp -r Dockerfile.concourse target/* ../build/
popd
