#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE}")";

git pull origin master;

# ------------------------------------------------

#
# Utils
#

answer_is_yes() {
  [[ "$REPLY" =~ ^[Yy]$ ]] \
    && return 0 \
    || return 1
}

ask_for_confirmation() {
  print_question "$1 (y/n) "
  read -n 1
  printf "\n"
}

execute() {
  $1 &> /dev/null
  print_result $? "${2:-$1}"
}

print_question() {
  # Print output in yellow
  printf "\e[0;33m  [?] $1\e[0m"
}

print_error() {
  # Print output in red
  printf "\e[0;31m  [✖] $1 $2\e[0m\n"
}

print_success() {
  # Print output in green
  printf "\e[0;32m  [✔] $1\e[0m\n"
}

print_result() {
  [ $1 -eq 0 ] \
    && print_success "$2" \
    || print_error "$2"

  [ "$3" == "true" ] && [ $1 -ne 0 ] \
    && exit
}

# ------------------------------------------------

#
# Actual symlink stuff
#

declare -a FILES_TO_SYMLINK=(
  shell/*
  git/*
  apps/*
)

main() {
  # Warn user this script will overwrite current dotfiles
  while true; do
    read -p "Warning: this will overwrite your current dotfiles. Continue? [y/n] " yn
    case $yn in
      [Yy]* ) break;;
      [Nn]* ) exit;;
      * ) echo "Please answer yes or no.";;
    esac
  done

  local i=''
  local sourceFile=''
  local targetFile=''

  for i in ${FILES_TO_SYMLINK[@]}; do

    sourceFile="$(pwd)/$i"
    targetFile="$HOME/.$(printf "%s" "$i" | sed "s/.*\/\(.*\)/\1/g")"

    if [ ! -e "$targetFile" ]; then
      execute "ln -fs $sourceFile $targetFile" "$targetFile → $sourceFile"
    elif [ "$(readlink "$targetFile")" == "$sourceFile" ]; then
      print_success "$targetFile → $sourceFile"
    else
      ask_for_confirmation "'$targetFile' already exists, do you want to overwrite it?"
      if answer_is_yes; then
        rm -rf "$targetFile"
        execute "ln -fs $sourceFile $targetFile" "$targetFile → $sourceFile"
      else
        print_error "$targetFile → $sourceFile"
      fi
    fi

  done

  unset FILES_TO_SYMLINK
}

homebrew() {
  ask_for_confirmation "Would you like to install and run homebrew?"
  if answer_is_yes; then
    source brew.sh
  else
    print_error "Skipping homebrew"
  fi
}

install_zsh () {
  # Test to see if zshell is installed.  If it is:
  if [ -f /bin/zsh -o -f /usr/bin/zsh ]; then
    # Set the default shell to zsh if it isn't currently set to zsh
    if [[ ! $(echo $SHELL) == $(which zsh) ]]; then
      chsh -s $(which zsh)
    fi
  else
    # If zsh isn't installed, get the platform of the current machine
    platform=$(uname);
    # If the platform is Linux, try an apt-get to install zsh and then recurse
    if [[ $platform == 'Linux' ]]; then
      if [[ -f /etc/redhat-release ]]; then
        sudo yum install zsh
        install_zsh
      fi
      if [[ -f /etc/debian_version ]]; then
        sudo apt-get install zsh
        install_zsh
      fi
    # If the platform is OS X, tell the user to install zsh :)
    elif [[ $platform == 'Darwin' ]]; then
      echo "We'll install zsh, then re-run this script!"
      brew install zsh
      exit
    fi
  fi
}

# ------------------------------------------------

#
# Show time!
#

homebrew
main
install_zsh

# Reload zsh settings
source ~/.zshrc
