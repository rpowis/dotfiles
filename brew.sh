#!/usr/bin/env bash

# Install command-line tools using Homebrew.

# Make sure we’re using the latest Homebrew.
brew update

# Upgrade any already-installed formulae.
brew upgrade

# Install packages
brew install coreutils

# Install some other useful utilities like `sponge`.
brew install moreutils

# Install GNU `find`, `locate`, `updatedb`, and `xargs`, `g`-prefixed.
brew install findutils

# Install GNU `sed`, overwriting the built-in `sed`.
brew install gnu-sed --with-default-names

# Install Bash 4.
# Note: don’t forget to add `/usr/local/bin/bash` to `/etc/shells` before
# running `chsh`.
brew install bash
brew install bash-completion2

# # Switch to using brew-installed bash as default shell
# if ! fgrep -q '/usr/local/bin/bash' /etc/shells; then
#   echo '/usr/local/bin/bash' | sudo tee -a /etc/shells;
#   chsh -s bash;
# fi;

# Install `wget` with IRI support.
brew install wget --with-iri

# Install GnuPG to enable PGP-signing commits.
brew install gnupg
brew install gpg-agent
brew install pinentry-mac

# Install more recent versions of some macOS tools.
brew install vim --with-override-system-vi
brew install grep
brew install openssh
brew install screen

# Install some languages
brew install homebrew/php/php56 --with-gmp
brew install node
brew install python

# Install font tools.
brew tap bramstein/webfonttools
brew install sfnt2woff
brew install sfnt2woff-zopfli
brew install woff2

# Install some CTF tools; see https://github.com/ctfs/write-ups.
# brew install bfg
brew install fcrackzip
brew install hydra
brew install john
brew install netpbm
brew install nmap
brew install socat
brew install sqlmap

# Install other useful binaries.
brew install ack
brew install git
brew install git-lfs
brew install tig
brew install imagemagick --with-webp
brew install p7zip
brew install pigz
brew install pv
brew install rename
brew install rlwrap
brew install ssh-copy-id
brew install tree
brew install vbindiff
brew install zopfli

# Other useful libraries
brew install hub
brew install diff-so-fancy

# Specify a directory to install Casks
export HOMEBREW_CASK_OPTS="--appdir=/Applications --fontdir=/Library/Fonts"

# Casks
brew tap caskroom/homebrew-cask
brew cask install google-chrome
brew cask install dropbox
brew cask install alfred
brew cask install flux
brew cask install skype
brew cask install virtualbox
brew cask install slack
brew cask install spotify
brew cask install 1password
brew cask install iterm2
brew cask install dash
brew cask install cleanmymac
brew cask install nordvpn
brew cask install slate
brew cask install bartender
brew cask install tunnelblick
brew cask install sublime-text
brew cask install adobe-acrobat-reader
brew cask install diffmerge

# Quick Look Plugins
brew cask install qlmarkdown
brew cask install qlcolorcode
brew cask install quicklook-json
brew cask install qlimagesize
brew cask install webpquicklook

# Remove outdated versions from the cellar.
brew cleanup

# Configure homebrew permissions to allow multiple users on MAC OSX.
# Any user from the admin group will be able to manage the homebrew and cask installation on the machine.

# Ask for the administrator password upfront
sudo -v

# Keep-alive: update existing `sudo` time stamp until `brew.sh` has finished
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# allow admins to manage homebrew's local install directory
sudo chgrp -R admin $(brew --prefix)
sudo chmod -R g+w $(brew --prefix)
