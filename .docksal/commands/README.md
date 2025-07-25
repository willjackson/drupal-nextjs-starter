# Docksal Commands for Will's Blog

This directory contains custom Docksal commands for the NextJS blog project.

## Available Commands

### `fin develop`
Starts the NextJS development server in a tmux session.

Usage:
```bash
# Start the dev server and attach to the session
fin develop

# Start the dev server in the background
fin develop --background
```

The development server will be accessible at:
- http://localhost:3060 (NextJS dev server)

### `fin develop-stop`
Stops the development server and kills the tmux session.

Usage:
```bash
fin develop-stop
```

### `fin npm`
Run npm commands in the web directory.

Usage:
```bash
# Install dependencies
fin npm install

# Build the project
fin npm run build

# Run any npm command
fin npm [command] [args]
```

## Tmux Session Management

When running `fin develop`, you'll be attached to a tmux session. Here are some useful shortcuts:

- `Ctrl+B` then `d` - Detach from the session (keeps it running)
- `Ctrl+B` then `q` - Quit the session (with confirmation)
- `Ctrl+C` - Stop the current process

To reattach to a running session:
```bash
fin develop
```

## Port Configuration

The NextJS development server is configured to run on port 3000 inside the container, which is mapped to port 3060 on your host machine. This avoids conflicts with the example project which uses ports 3053-3056.
