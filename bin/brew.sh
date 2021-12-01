#!/bin/sh

# Check for Homebrew and install if we don't have it
if test -n "$(which brew)"; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # TODO: Run these in each shell's startup instead
    # echo 'eval "$(brew shellenv)"' >>$HOME/.config/fish/config.fish
    # eval "$(brew shellenv)"
fi

# Update Homebrew
brew update

# Install all our dependencies with bundle (See Brewfile)
brew tap homebrew/bundle
brew bundle --file $HOME/bin/Brewfile
