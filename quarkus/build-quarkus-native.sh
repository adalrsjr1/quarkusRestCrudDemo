#!/bin/sh
#mvn clean
mvn package quarkus:add-extension -Dextensions="smallrye-metrics" -Dquarkus.native.container-build=true
docker build -f Dockerfile-quarkus-native -t smarttuning/rest-crud-quarkus-native -t rest-crud-quarkus-native .
docker push smarttuning/rest-crud-quarkus-native
