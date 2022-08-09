#!/bin/bash

stack_name="sweet-petit-feastival-dev"

api_url="$(aws cloudformation describe-stacks --stack-name "${stack_name}" | jq '.Stacks[0].Outputs[] | select(.OutputKey | contains("HttpApiUrl")) | .OutputValue' -r)"

cat <<EOM > src/config.json
{"url":"${api_url}"}
EOM