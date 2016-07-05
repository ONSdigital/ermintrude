#!/bin/bash

ECR_REPOSITORY_URI=
GIT_COMMIT=

docker run -d                           \
  --env=BABBAGE_URL=http://babbage:8080 \
  --env=ZEBEDEE_URL=http://zebedee:8080 \
  --name=ermintrude                     \
  --net=publishing                      \
  --restart=always                      \
  $ECR_REPOSITORY_URI/ermintrude:$GIT_COMMIT
