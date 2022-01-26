#!/usr/bin/env bash

# Treat unset variables as an error and exit immediately
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
  echo "Backing up pre-existing dotfiles..."
  dotfiles checkout 2>&1 | egrep "\s+\." | awk {'print $1'} | xargs -I{} mv {} .dotfiles.BAK/{}
  dotfiles checkout
  echo "Checked out dotfiles."
fi

echo "Installing Homebrew and packages..."
source bin/brew.sh

eval $(/opt/homebrew/bin/brew shellenv)

# 5. Set up fish shell
update_fish_shell() {
  local shell_path
  shell_path="$(command -v fish)"

  echo "Changing shell to fish ..."
  if ! grep "$shell_path" /etc/shells >/dev/null 2>&1; then
    echo "Adding '${shell_path}' to /etc/shells"
    echo "$shell_path" | sudo tee -a /etc/shells
  fi
  sudo chsh -s "$shell_path" "$USER"
}

update_fish_shell

echo "Reloading shell..."
exec fish
