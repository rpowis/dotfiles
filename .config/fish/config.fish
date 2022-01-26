if status is-interactive
    # Commands to run in interactive sessions can go here
end

# Set GPG TTY
set -x GPG_TTY (tty)

# Init Homebrew for fish
eval (env SHELL=fish /opt/homebrew/bin/brew shellenv)
