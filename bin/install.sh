#!/bin/bash

# -e Exit immediately if a command fails
# -u Treat unset variables as an error and exit immediately
set -eu

# 1. Clone as a bare repo
git clone --bare https://github.com/rpowis/dotfiles.git $HOME/.dotfiles

# 2. Set up an alias to make it easier to operate on the bare repo
function dotfiles {
  git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

# 3. Checkout dotfiles to $HOME dir
dotfiles checkout &>/dev/null

# 4. If checkout failed...
if [ $? -ne 0 ]; then
  # 5. Checkout again, backing up pre-existing dotfiles in the process
  mkdir -p .dotfiles.BAK
  echo "Backing up pre-existing dotfiles."
  dotfiles checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | xargs -I{} mv {} .dotfiles.BAK/{}
fi

# 7. We're done!
echo "Checked out dotfiles."
