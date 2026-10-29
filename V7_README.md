# Chennai Marina Boys V7 Cinematic Edition

This release deliberately removes interactive trophy and jersey modules. It retains the existing React/Vite/Three.js crest and championship shader while adding polished GSAP cinematic components: stadium tunnel with scroll motion, honours reveal, matchday countdown, gallery reel, and optional original synthesised ambience (off by default).

The squad remains 15 players, and existing schedules, partners and social links are preserved.

## Install

```bash
npm install
npm run build
npm run dev
```

### Deploy

For a fresh checkout use the full ZIP, copy its contents over the Git working tree excluding .git, commit and push main. For minimal patch extract the companion patch ZIP over the existing checkout. Cloudflare Pages build: `npm run build`, output `dist`.

No additional third-party packages were introduced: current GSAP, Lenis, Framer Motion, Three.js, React Three Fiber and postprocessing are sufficient for these effects.
