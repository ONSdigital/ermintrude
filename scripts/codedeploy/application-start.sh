#!/bin/bash

ECR_REPOSITORY_URI=
GIT_COMMIT=

docker run -d --name ermintrude           \
    --env=BABBAGE_URL=http://babbage:8080 \
    --env=ZEBEDEE_URL=http://zebedee:8080 \
    --net=publishing                      \
    --restart=always                      \
    $ECR_REPOSITORY_URI/ermintrude:$GIT_COMMIT
