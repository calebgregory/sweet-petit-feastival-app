#!/bin/bash

bucket_name="sweet-petit-feastival-app-client"

existing_bucket="$(aws s3 ls | grep "${bucket_name}")"
if [ -z "${existing_bucket}" ]; then
  echo "(>'')> making bucket"
  aws s3 mb "s3://${bucket_name}"
else
  echo "(>'')> bucket already exists"
fi

aws s3 sync build "s3://${bucket_name}"
