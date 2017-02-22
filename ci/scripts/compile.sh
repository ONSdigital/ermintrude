#!/bin/bash -eux

cp -r assets/ ermintrude/src/main/web/

pushd ermintrude
  mvn clean package dependency:copy-dependencies -Dmaven.test.skip
popd

cp -r ermintrude/target/* target/
