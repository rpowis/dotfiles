#!/bin/sh

# Check for Homebrew and install if we don't have it
if test -n "$(which brew)"; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # TODO: Look for these lines before adding them
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >>$HOME/.zshrc
    echo 'eval (env SHELL=fish /opt/homebrew/bin/brew shellenv)' >>$HOME/.config/fish/config.fish
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Update Homebrew
brew update

# Install all our dependencies with bundle (See Brewfile)
brew tap homebrew/bundle
brew bundle --file $HOME/bin/Brewfile
