# PRAHA

A stylized 3D Prague in early summer, seen from a drone, built to look like a set of photographs shot on a Fujifilm X-S10 with the Classic Negative film simulation between 29 May and 2 June 2026.

It is a 3D reconstruction, not a photo app. The photographs are the reference the world is modelled and graded against; they never appear in the app.

- `CLAUDE.md` — the intent, in one page. Read first.
- `design.md` — the full design: scope, the data set, the look, geography and coordinates, fidelity tiers, world systems, the drone and the auto route, interface, technology, acceptance tests, milestones.
- `data/hero.json` — the hero frames the renders are tested against.
- `mockup/plan.html` — the data set by place and by route stop, with the map. Serve the `mockup` folder statically and open it.
- `mockup/index.html` — an early Three.js sketch of the concept.
- `mockup/set/` — 800 px copies of the 422 reference frames.

The full-resolution photographs (6 GB) are not in the repository. They are kept locally under `Photos/`, which is git-ignored; see `Photos/README.md`.

Code is MIT licensed. The photographs are copyright Victor Zhang, all rights reserved. See `LICENSE`.
