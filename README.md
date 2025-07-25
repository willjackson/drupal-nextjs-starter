# Drupal 11 + Next.js Starter Kit

A modern headless CMS starter combining Drupal 11 as the content management backend with Next.js 15 as the frontend
framework.

## Features

- **Backend**: Drupal 11 with JSON:API, Simple OAuth authentication
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Content Types**: Pages, Articles, Events with image fields
- **Authentication**: OAuth2 client credentials flow
- **Development**: Docksal containerized environment

## Prerequisites

- [Docksal](https://docksal.io/) installed and running
- Docker and Docker Compose (installed with Docksal)

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
└── .docksal/             # Docksal configuration
```

## Key Commands

**Docksal:**
```bash
fin start                # Start containers
fin stop                 # Stop containers
fin restart              # Restart containers
fin init                 # Initialize project (basic)
fin init --content       # Initialize with sample content
fin init --ai            # Initialize with AI Tools
fin init --content --ai  # Initialize with both content and AI
fin init-ai              # Install AI Tools separately
fin generate-content     # Install sample content separately
fin mcp                  # Displays MCP connection information, once installed
```

**Drupal:**
```bash
fin drush <command>    # Run Drush commands
fin composer <command> # Run Composer commands
```

**Next.js:**
```bash
fin develop              # Development server
fin develop --background # Run in background
```

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
