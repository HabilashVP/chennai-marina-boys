# Deploy Chennai Marina Boys

## 1. Verify locally

```bash
npm install
npm run build
npm run preview
```

The favicon is in `public/favicon.png`; the React profile-modal JSX warning was fixed.

## 2. Create GitHub repository

Create a new repository named `chennai-marina-boys` in the GitHub account `HabilashVP` at https://github.com/new. Do not initialize with a README (this project already has one).

In the project folder:

```bash
git init
git branch -M main
git add .
git commit -m "Launch Chennai Marina Boys website"
git remote add origin https://github.com/HabilashVP/chennai-marina-boys.git
git push -u origin main
```

If you have GitHub CLI (`gh`) installed and authenticated, you can replace the create-and-remote steps with `gh repo create chennai-marina-boys --public --source=. --remote=origin --push` after committing.

## 3. Recommended hosting: Cloudflare Pages

In Cloudflare Dashboard → Workers & Pages → Create → Pages → Import an existing Git repository.

- Repository: `HabilashVP/chennai-marina-boys`
- Framework: React (Vite)
- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`

Deploy and open the assigned `*.pages.dev` URL. Future commits to `main` rebuild the live site.

## Alternative: Netlify

Import the GitHub repository; build command `npm run build`, publish directory `dist`. The included `netlify.toml` has these settings.

## Notes

- No backend is required for the current static React app.
- The fixture and squad information is static; verify before publishing publicly.
- Browser/WebGL smoke testing is still needed on a deployed URL.
