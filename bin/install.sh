#!/bin/bash

# -u Treat unset variables as an error and exit immediately
set -u

# 1. Clone as a bare repo
git clone --bare https://github.com/rpowis/dotfiles.git $HOME/.dotfiles

# 2. Set up an alias to make it easier to operate on the bare repo
function dotfiles {
  git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME $@
}

# 3. Checkout dotfiles to $HOME dir
dotfiles checkout

if [ $? = 0 ]; then
  echo "Checked out dotfiles."
else
  # 4. Backup existing dotfiles
  mkdir -p .dotfiles.BAK
  echo "Backing up pre-existing dotfiles."
  dotfiles checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | xargs -I{} mv {} .dotfiles.BAK/{}
  dotfiles checkout
  echo "Checked out dotfiles."
fi

echo "Reloading shell."
exec $SHELL
