#!/bin/bash

set -e

if [[ -n $(git status --porcelain) ]]; then
  echo "There are uncommitted changes. Please commit or stash them before deploying."
  exit 1
fi

yarn demos-build

TEMP_DIR=$(mktemp --directory)

cp demos/dist/* $TEMP_DIR

git switch gh-pages

cp $TEMP_DIR/* .

git add demos.js index.html main.css

if git diff-index --quiet HEAD --; then
  echo "No changes to commit."
else
  git -c commit.gpgSign=false commit --no-verify --message="Deploy demos"
  git push origin gh-pages
fi

git switch -

rm --recursive --force $TEMP_DIR
