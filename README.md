# Drupal 11 + Next.js Starter Kit

A modern headless CMS starter combining Drupal 11 as the content management backend with Next.js 16 as the frontend
framework.

## Features

- **Backend**: Drupal 11 with JSON:API, Simple OAuth authentication
- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **Content Types**: Pages, Articles, Events with image fields
- **Authentication**: OAuth2 client credentials flow
- **Development**: Docksal **or** DDEV containerized environment (feature parity)

## Prerequisites

Use **either** Docksal or DDEV — both provide the same custom commands and workflow.

- [DDEV](https://ddev.com/) (recommended) **or** [Docksal](https://docksal.io/)
- Docker (Docker Desktop, OrbStack, Colima, etc.)

## Installation

### 1. Clone and Initialize

```bash
git clone git@github.com:willjackson/drupal-nextjs-starter.git d11-nextjs-starter
cd d11-nextjs-starter
fin init
```

**Initialize with Options:**
```bash
# Initialize with sample content
fin init --content

# Initialize with AI Tools
fin init --ai

# Initialize with both content and AI Tools
fin init --content --ai
```

### Using DDEV instead of Docksal

The project ships with a DDEV configuration (`.ddev/`) that mirrors the Docksal
setup command-for-command. Every `fin <cmd>` has a `ddev <cmd>` equivalent.

```bash
git clone git@github.com:willjackson/drupal-nextjs-starter.git d11-nextjs-starter
cd d11-nextjs-starter
ddev init                  # = fin init
```

**Initialize with Options:**
```bash
ddev init --content        # Initialize with sample content
ddev init --ai             # Initialize with AI Tools
ddev init --content --ai   # Initialize with both
```

**Access Points (DDEV):**
- **Next.js Frontend**: https://d11-nextjs-starter.ddev.site
- **Drupal Admin**: https://drupal.d11-nextjs-starter.ddev.site

> The primary URL serves the Next.js dev server (reverse-proxied to port 3000),
> and the `drupal.` subdomain serves Drupal — mirroring the Docksal routing.
> Start the Next.js dev server with `ddev develop` if it isn't already running
> (`ddev init` starts it for you).

#### MCP credentials (DDEV)

Set `MCP_ADMIN_USER` / `MCP_ADMIN_PASS` before running `ddev init-mcp` (store them
in `.ddev/config.local.yaml`, which is gitignored):

```bash
ddev config --web-environment-add=MCP_ADMIN_USER=mcp_admin
ddev config --web-environment-add=MCP_ADMIN_PASS=secure_password_for_mcp
ddev restart
```

### 2. Install Optional Components Later

If you didn't use flags during initialization, you can install these components later:

**Sample Content:**
```bash
fin generate-content
```

**AI Tools:**
```bash
fin init-ai
```

#### MCP Configuration Variables
For MCP to install properly, you will need to add the `MCP_ADMIN_USER` and `MCP_ADMIN_PASS` variables to your
`docksal-local.yml` file. These values are used to create the MCP Admin user credentials as part of the `fin init-ai`
command.

You can also set these via the fin:
- `fin config set --env=local MCP_ADMIN_USER=mcp_admin`
- `fin config set --env=local MCP_ADMIN_PASS=secure_password_for_mcp`

As part of the `fin init` command a `.env.local` will be generated at `/web/.env.local`:
```env
NEXT_PUBLIC_DRUPAL_BASE_URL=http://drupal.d11-nextjs-starter.docksal.site
DRUPAL_CLIENT_ID=default_consumer
DRUPAL_CLIENT_SECRET=nextjs-drupal
```

## Usage

### Development Servers

**Start Drupal** (automatically running with Docksal):
```bash
fin start
```

**Start Next.js**:
```bash
fin develop              # Development server
fin develop --background # Run in background
```

### Access Points

- **Drupal Admin**: http://drupal.d11-nextjs-starter.docksal.site
- **Next.js Frontend**: http://d11-nextjs-starter.docksal.site

### Content Management

1. **Create Content**: Add pages, articles, or events in Drupal admin
2. **Set URL Aliases**: Configure friendly URLs in Drupal
3. **View Frontend**: Content automatically appears in Next.js site

## Project Structure

```
├── drupal/                 # Drupal 11 backend
│   ├── web/               # Drupal web root
│   ├── config/sync/       # Configuration files
│   └── composer.json      # PHP dependencies
├── web/                   # Next.js frontend
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities and API functions
│   ├── package.json      # Node dependencies
│   └── .env.local        # Environment variables
├── .docksal/             # Docksal configuration
└── .ddev/                # DDEV configuration (mirrors Docksal)
```

## Key Commands

Docksal and DDEV expose the same commands. Pick the column for your tooling.

| Task | Docksal | DDEV |
| --- | --- | --- |
| Start containers | `fin start` | `ddev start` |
| Stop containers | `fin stop` | `ddev stop` |
| Restart containers | `fin restart` | `ddev restart` |
| Initialize project | `fin init` | `ddev init` |
| Initialize + sample content | `fin init --content` | `ddev init --content` |
| Initialize + AI Tools | `fin init --ai` | `ddev init --ai` |
| Install AI Tools separately | `fin init-ai` | `ddev init-ai` |
| Install sample content | `fin generate-content` | `ddev generate-content` |
| Show MCP connection info | `fin mcp` | `ddev mcp` |
| Show site links | `fin show-links` | `ddev show-links` |
| Run Drush | `fin drush <cmd>` | `ddev drush <cmd>` |
| Run Composer | `fin composer <cmd>` | `ddev composer <cmd>` |
| Run npm (web dir) | `fin npm <cmd>` | `ddev npm <cmd>` |
| Next.js dev server | `fin develop` | `ddev develop` |
| Next.js dev (background) | `fin develop --background` | `ddev develop --background` |
| Stop Next.js dev server | `fin develop-stop` | `ddev develop-stop` |

## Content Types

### Pages
- Basic pages with title, body, and optional hero image
- Accessible at custom URL aliases

### Articles
- Blog-style content with tags and featured images
- Support for promoted and sticky flags
- Accessible at `/posts/[slug]`

### Events
- Event content with date, location, and descriptions
- Virtual event support
- Accessible at `/events/[slug]`

## Troubleshooting

**Drupal 404 errors**: Clear cache with `fin drush cache:rebuild`

**Next.js build errors**: Check environment variables in `.env.local`

**OAuth authentication issues**: Verify client credentials in Drupal OAuth settings

**Database connection**: Restart Docksal with `fin restart`

## Development Notes

- Content is fetched server-side using Drupal's JSON:API
- Images are optimized using Next.js Image component
- URL aliases in Drupal determine Next.js routes
- All API calls use OAuth2 authentication for security

## Claude AI Integration

This project includes comprehensive documentation designed for AI assistance:

### Using with Claude Projects

1. **Create a new Claude Project** in your Claude interface
2. **Review the `project-instructions.md` file** to provide Claude with context about:
   - Drupal-NextJS integration patterns
   - Data transformation workflows
   - Content type mapping strategies
   - Routing architecture
   - Development best practices

3. **Include relevant source files** from your project:
   ```
   web/src/lib/drupal.ts
   web/src/lib/drupal-fetch.ts
   web/src/app/*/page.tsx files
   ```

### Benefits of AI-Assisted Development

- **Faster content type creation**: Get help to map new Drupal fields to NextJS components
- **Routing assistance**: Guidance on implementing new dynamic routes
- **Error debugging**: Help troubleshooting Drupal-NextJS connectivity issues
- **Code reviews**: Best practice recommendations for data transformation functions
- **Documentation updates**: Keep project documentation current as features evolve

### Example AI Prompts

```
"Help me add a new 'Product' content type with price and gallery fields"
"Debug why my images aren't loading from Drupal"
"Create a taxonomy filter page for article categories"
"Optimize the data fetching for better performance"
```

The `project-instructions.md` file serves as a comprehensive reference that helps AI assistants understand your
project's architecture and provide more accurate, contextual help.
