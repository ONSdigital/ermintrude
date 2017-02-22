#!/bin/bash -eux

pushd ermintrude
  mvn clean surefire:test
popd
