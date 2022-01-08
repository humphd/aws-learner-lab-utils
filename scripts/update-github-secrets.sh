#!/bin/sh

# Sets or Updates the following secrets in the current GitHub
# Repo (i.e., you must be in the repo root directory) using
# values from the default profile in ~/.aws/credentials:
#
#  AWS_REGION
#  AWS_ACCESS_KEY_ID
#  AWS_SECRET_ACCESS_KEY
#  AWS_SESSION_TOKEN
#
# Assumes the credentials from the Learner Lab AWS CLI have
# been obtained and written to ~/.aws/credentials and that
# `aws configure` has been called already. Also assumes that
# you are in a cloned GitHub repo, and have logged in with
# the `gh auth login` command, see
# https://cli.github.com/manual/gh_auth_login

region="$(eval aws configure get region --profile default)"
access_key="$(eval aws configure get aws_access_key_id --profile default)"
secret_key="$(eval aws configure get aws_secret_access_key --profile default)"
session_token="$(eval aws configure get aws_session_token --profile default)"

gh secret set AWS_REGION -b"${region}"
gh secret set AWS_ACCESS_KEY_ID -b"${access_key}"
gh secret set AWS_SECRET_ACCESS_KEY -b"${secret_key}"
gh secret set AWS_SESSION_TOKEN -b"${session_token}"
