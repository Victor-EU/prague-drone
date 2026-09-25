# CLAUDE.md

Guidelines for working in this repository. Read `design.md` before building anything; this file only states the intent that must not be lost.

## The goal

Build a stylized 3D Prague in early summer, seen from a drone, that **looks like Victor's photographs**. The purpose is to show the beauty of the city.

## What "looks like the photographs" means

The photographs in `Photos/` are the reference for four things:

1. **Shapes.** Landmark silhouettes, the roof rhythm, the river's curves, the hills.
2. **Surfaces.** Roof tile colours, plaster tones, bridge stone, the water, the greens.
3. **Light.** Late May sun, the four light families in the set, haze, cumulus.
4. **The camera's eye.** The Fujifilm Classic Negative rendering, applied as a grade.

Get those right and the world reads as "the same eye". That is the bar.

## What we are not doing

- **We are not seeking 100% replication of the photo details.** No pixel matching, no photogrammetry, no photo textures projected onto buildings, no chasing an individual frame's framing or exposure. The photographs disagree with each other; we build to what they share.
- **This is not a photo app.** No gallery, no captions, no overlays, no photo spots. The shipped app contains no photographs. Photographs are used only on the build side, in the offline comparison tool.
- No detail the drone cannot see. No interiors, faces, signs, cars in detail, cranes.
- No mobile, no audio, no seasons other than early summer.

## How to judge work

Put the virtual camera where a hero frame was taken (`data/hero.json`), render, place it beside the photograph. Ask three questions: same silhouette, same colours, same light mood. Pass or fail on each. Never ask "do the pixels match".

When a choice comes up between more accuracy and more beauty at the drone's distance, choose beauty.

## Working rules

- `design.md` is the spec. If the build needs to deviate, update `design.md` first and say why.
- Decisions the user has already made are listed in `design.md` §14. Do not reopen them; append new ones there.
- Reference set: `Photos/` (422 colour frames, full resolution, local only and git-ignored) with 800 px copies committed in `mockup/set/`. `Photos/_excluded/` is not reference.
- Do not use the raw export on the Desktop; it is superseded.
- Keep the app static: no backend, no runtime calls to map services. World data is prebuilt into tiles.
- Milestones are in `design.md` §13. Each ends with a build the user can fly. Ship in that order.
