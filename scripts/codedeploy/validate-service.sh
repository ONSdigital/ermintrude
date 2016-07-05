#!/bin/bash

if [[ $(docker inspect --format="{{ .State.Running }}" ermintrude) == "false" ]]; then
  exit 1;
fi
