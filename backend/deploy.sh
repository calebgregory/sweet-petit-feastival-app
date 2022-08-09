#!/bin/bash

stack_name="sweet-petit-feastival"

existing_bucket="$(aws s3 ls | grep "${stack_name}")"
if [ -z "${existing_bucket}" ]; then
  echo "(>'')> making bucket"
  aws s3 mb "s3://${stack_name}"
else
  echo "(>'')> bucket already exists"
fi

aws s3 cp ./swagger.yml "s3://${stack_name}"

make prepare-package

sam package \
    --output-template-file packaged.yaml \
    --s3-bucket "${stack_name}" && \

sam deploy \
    --template-file packaged.yaml \
    --stack-name "${stack_name}" \
    --capabilities CAPABILITY_IAM && \

aws cloudformation describe-stacks \
    --stack-name "${stack_name}"
