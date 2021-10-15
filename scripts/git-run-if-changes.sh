#!/bin/bash

set -e -o pipefail -u

paths=()
while [ "$1" != "--" ]; do
    paths+=( "$1" ); shift
done
shift

if git diff --quiet --exit-code "${BASE_BRANCH:-origin/master}"..HEAD ${paths[@]}; then
    echo "No changes in ${paths[@]}, skipping $@..." 1>&2
    exit 0
fi
echo "Changes found in ${paths[@]}, running $@..." 1>&2

exec "$@"