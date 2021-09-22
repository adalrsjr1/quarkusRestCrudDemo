#!/bin/bash

docker build -f Dockerfile-jmeter -t smarttuning/jmeter_quarkus .

docker push smarttuning/jmeter_quarkus
