# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm ci
npm run dev
```

## Deploy to Netlify

This is a server-rendered TanStack Start app. Deploy it by importing the repository
into Netlify (or using the Netlify CLI); do not use Netlify Drop to upload the
source folder as a static site.

The included `netlify.toml` configures the Netlify build and Node.js 22 runtime.
Netlify installs the dependencies from `package-lock.json` and runs `npm run build`.
The Nitro Netlify preset packages the server-rendered routes as a Netlify Function.

In Netlify, set the build environment variables used by the app when needed:
`VITE_ADMIN_EMAIL`, `VITE_ADMIN_PASSWORD`, and `VITE_GUIDE_PDF_PASSWORD`.
These `VITE_*` values are included in client-side code and must not be treated as
secrets. For production admin authentication or protected downloads, use a
server-side authentication service instead.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
