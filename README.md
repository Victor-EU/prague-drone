# PRAHA

A stylized 3D Prague in early summer, seen from a drone, built to look like a set of photographs shot on a Fujifilm X-S10 with the Classic Negative film simulation between 29 May and 2 June 2026.

It is a 3D reconstruction, not a photo app. The photographs are the reference the world is modelled and graded against; they never appear in the app.

- `CLAUDE.md` — the intent, in one page. Read first.
- `design.md` — the full design: scope, the data set, the look, geography and coordinates, fidelity tiers, world systems, the drone and the auto route, interface, technology, acceptance tests, milestones.
- `data/hero.json` — the hero frames the renders are tested against; `data/viewpoints.json` — where each was taken.
- `mockup/plan.html` — the data set by place and by route stop, with the map. Serve the `mockup` folder statically and open it.
- `mockup/index.html` — an early Three.js sketch of the concept.
- `mockup/set/` — 800 px copies of the 422 reference frames.
- `src/` — the app (Three.js, TypeScript, Vite); `tools/` — the offline data pipeline; `data/` — route, landmarks, hero frames.

## Running it

Node 24 or later (the build tools are TypeScript run directly by Node).

```
npm install
npm run world      # fetch OSM (BBBike Prague extract) and terrain (ČÚZK) into cache/, then build public/world/
npm run dev        # http://localhost:5173
```

`npm run fetch-data` and `npm run build-world` run the two halves separately; the fetch only downloads what is not cached yet (`-- --overpass` takes OSM from Overpass instead of the extract). The build computes every roof from its footprint (straight skeletons, on worker threads, about 35 s in all), builds the landmarks from the models in `tools/landmarks/`, and also writes `cache/preview.png`, a top-down map of the world with the flight path. While modelling, `npm run build-world -- --landmarks` rebuilds only the landmarks, in a few seconds. `npm run build` makes the static site in `dist/`. `npm run lut` rewrites the Classic Negative grade, `assets/lut/classic-neg.cube`, from the parameters in `tools/make-lut.ts`.

In the app: arrows take over (yaw and altitude), Shift is fast cruise, Space hovers, W and S tilt, A and D strafe, Enter returns to the auto route, C rolls new clouds. The WEATHER button switches the overcast on and off. The backquote key shows frame statistics; in development G turns the grade off and O the ambient occlusion. URL parameters: `?t=144` starts the route at that second, `?clock=20:30` fixes the time of day, `?fast`, `?manual`, `?stats`; for the weather `?seed=`, `?coverage=0.4`, `?overcast=1` or `0`, `?cirrus=0.5`.

Judging renders against the photographs (design.md §12): in development `/?view=8372` opens the app at that hero frame's viewpoint, and `praha.sheet()` in the console writes `compare/8372.png`, the photograph and the render side by side. `npm run compare` does every viewpoint in headless Chrome (`npm run compare -- 8372 9369` for some). While lining up or tuning, a viewpoint can be nudged and the light forced from the URL: `/?view=8385&heading=10&light.haze=0.05`, or `npm run compare -- 8385@heading=10,light.haze=0.05`, which writes its own file. `/?view=look&x=-60&north=60&agl=40&heading=160&tilt=-25` is a free camera for looking at anything (`npm run compare -- look@x=-60,north=60,…` saves the render alone).

## Photographs

The full-resolution photographs (6 GB) are not in the repository. They are kept locally under `Photos/`, which is git-ignored; see `Photos/README.md`.

## Licence

Code is MIT licensed. The photographs are copyright Victor Zhang, all rights reserved. See `LICENSE`. The built world contains map data © OpenStreetMap contributors (ODbL) and terrain © ČÚZK (CC BY 4.0).
