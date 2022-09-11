#!/bin/bash

bucket_name="sweet-petit-feastival-app-client"

existing_bucket="$(aws s3 ls | grep "${bucket_name}")"
if [ -z "${existing_bucket}" ]; then
  echo "(>'')> making bucket"
  aws s3 mb "s3://${bucket_name}"
else
  echo "(>'')> bucket already exists"
fi

aws s3 sync build "s3://${bucket_name}" --acl=public-read

cloudfront_distribution_id="$(
  aws cloudfront list-distributions \
    | python -c "$(cat <<EOM
import sys
import json
dists = json.load(sys.stdin)
for dist in dists['DistributionList']['Items']:
    origins = dist['Origins']['Items']
    if any(['${bucket_name}' in origin['Id'] for origin in origins]):
        print(dist['Id'])
EOM
  )"
)"

aws cloudfront create-invalidation \
  --distribution-id "${cloudfront_distribution_id}" \
  --paths '/*' \
  | cat
