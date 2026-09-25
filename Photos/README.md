# Photos

This folder holds the full-resolution reference set: 422 colour JPEGs named `DSCF<number>.JPG`, plus `_excluded/` with the 53 black-and-white and 12 interior frames that are not reference.

The JPEGs are git-ignored because the set is 6 GB. Anyone building from this repository without the originals should use the 800 px copies in `mockup/set/`, which are sufficient for shape, colour and light reference. The offline comparison tool (`tools/compare.ts`, see `design.md` §12) prefers the originals when present and falls back to `mockup/set/`.
