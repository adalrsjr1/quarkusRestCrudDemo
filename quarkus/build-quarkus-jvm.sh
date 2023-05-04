#!/bin/sh
mvn clean package -Dno-native && docker build -f Dockerfile-quarkus-jvm -t rest-crud-quarkus-jvm .

docker build -f Dockerfile-quarkus-jvm -t smarttuning/rest-crud-quarkus-jvm -t rest-crud-quarkus-native .

docker push smarttuning/rest-crud-quarkus-jvm

