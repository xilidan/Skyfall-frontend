This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

1. Copy the `.env.example` file to create `.env` and `.env.local`:

```bash
cp .env.example .env
cp .env.example .env.local
```

2. Update the environment variables in both files with your actual values:

- `NEXT_PUBLIC_APP_BASE_URL` - Backend API URL (default: https://tourismland.kz/api)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key for map functionality

**Note:** Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Code Quality with Knip

This project uses [Knip](https://github.com/webpro/knip) to detect unused imports, exports, and dead code. Knip helps maintain clean code by identifying:

- Unused imports and exports
- Unused files and dependencies
- Dead code and unused functions
- Type-only imports that can be optimized

### Running Knip

```bash
# Check for unused code
pnpm knip

# Automatically fix some issues
pnpm knip:fix
```

### Automatic Checks

- **On Save**: VS Code is configured to organize imports and format code automatically
- **Pre-commit**: Git hooks run knip before allowing commits
- **VS Code Tasks**: Use `Cmd+Shift+P` → "Tasks: Run Task" → "knip: check" or "knip: fix"

### Configuration

Knip configuration is in `knip.json`. The tool scans your TypeScript/JavaScript files and reports any unused code that can be safely removed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker Deployment

The project includes Docker support for containerized deployment.

### Building and Running with Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at [http://localhost:3000](http://localhost:3000).

**Note:** The Docker setup automatically uses the environment variables from your `.env` file.

### Building Docker Image Manually

```bash
# Build the image
docker build \
  --build-arg NEXT_PUBLIC_APP_BASE_URL=https://tourismland.kz/api \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here \
  -t kaz-tour-frontend .

# Run the container
docker run -p 3000:3000 kaz-tour-frontend
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Skyfall-frontend
