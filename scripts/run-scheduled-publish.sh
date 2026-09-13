#!/bin/zsh
set -euo pipefail

repo_dir="/Users/xulanzhong/Desktop/my-ai-workspace/code_project/src/github-repos/xsoway.github.io"
source_dir="/Users/xulanzhong/Desktop/my-ai-workspace/Alan-Workspace/01-Articles"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  source "$HOME/.nvm/nvm.sh"
  nvm use --silent >/dev/null
fi

cd "$repo_dir"
export ARTICLE_SOURCE="$source_dir"
exec npm run publish
