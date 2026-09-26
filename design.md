# PRAHA — Design

A web app that flies a drone over a stylized 3D Prague in early summer, built so that the city looks the way it looks in Victor's photographs.

Status: design locked for implementation, 2026-09-25, open questions resolved the same day. Owner: Victor Zhang. Implementation target: Claude Opus 5.5 working from this document plus the photo set.

**This is a 3D reconstruction of Prague built from the photographs. It is not a photo gallery and not a photo app. The shipped app never loads, shows, or references a photograph. The photographs exist only on the build side, as the reference the world is modelled and graded against.**

---

## 0. One paragraph

The user opens a page, and a drone is already flying over Prague at dawn. It descends the Vltava from Vyšehrad, climbs Petřín through the orchards, sweeps past the Castle, drops over Malá Strana roofs to a low pass along Charles Bridge, orbits Old Town Square, and returns up the river as the lights come on. Six minutes, or three in fast mode. Arrow keys take control at any moment. The city is not a photogrammetric copy. It is a stylized Prague whose shapes, materials, light and camera rendering are taken from 422 photographs shot on a Fujifilm X-S10 with the Classic Negative film simulation between 29 May and 2 June 2026. Someone who knows those photographs should look at the screen and say: that is the same eye.

---

## 1. Goals and non-goals

### Goals

1. **Beauty first.** The purpose is to show the beauty of Prague as a city. Every technical decision serves the picture.
2. **Looks like the photographs.** Shapes, materials, light and the camera's colour rendering are derived from the set. See §4 for the exact boundary.
3. **Drone view with arrow keys**, plus an auto flight of about 6 minutes and a fast mode at double speed.
4. **Early summer**, with random clouds and an adjustable time of day.
5. **A living city**: trams, boats, swans, pigeons, the odd tour group.
6. **Desktop web**, no install, runs at 60 fps on an Apple Silicon Mac in Chrome or Safari.

### Non-goals

- Reproducing any individual photograph pixel for pixel.
- Photogrammetry, projected photo textures, or facade detail at street level.
- Mobile or touch. Not now.
- Anything outside the photographed area beyond low-detail backdrop.
- A photo gallery, captions, photo overlays, or a "photo app" of any kind. The photographs are the reference, not the content. No photograph ships with the app.
- Audio. None in this release.

---

## 2. Scope of the world

The scope is the area the photographs cover: **Old Town, Malá Strana, Petřín, Vyšehrad, the Vltava between Vyšehrad and Letná, and the Castle as backdrop.**

Concentric rings:

| Ring | Extent | Treatment |
|---|---|---|
| Core | Old Town, Josefov, Malá Strana, Kampa, Petřín, the river from Legion Bridge to Mánes Bridge | Tier 1 landmarks, Tier 2 roofscape, full materials, full life |
| Middle | Vyšehrad, Podskalí, Rašín and Masaryk embankments, New Town near the river, Wenceslas Square, Letná, Smíchov bank opposite Petřín | Tier 1 landmarks where photographed, Tier 2 roofscape, full life on the river and tram lines |
| Outer | ~5 km radius: Vinohrady, Žižkov, Holešovice, Dejvice, Smíchov, Nusle, Pankrác | Tier 3 extruded blocks with palette, no life |
| Horizon | 5 to 15 km | Terrain silhouette with a few tall markers (Žižkov TV tower, Pankrác towers, Strahov stadium massing), fog |

---

## 3. The data set

### 3.1 Location and counts

The reference set is the curated folder `Photos/` in this repo (a copy of the user's selection). The full-resolution files are 6 GB and are git-ignored; 800 px copies of every frame are committed in `mockup/set/` and are sufficient for reference. Raw export of 1116 frames is superseded and must not be used as reference.

| | Count |
|---|---|
| Colour frames, the reference set | 422 |
| Black and white, set aside in `Photos/_excluded/black-and-white` | 53 |
| Interiors, set aside in `Photos/_excluded/interiors` | 12 |

Camera: Fujifilm X-S10, 16 to 55 mm f/2.8, JPEG straight from camera. Film simulation **Classic Negative**. No GPS in the EXIF. Portrait frames rely on the EXIF orientation flag, so always apply it.

Focal lengths in the set: about a third at 16 mm (24 mm equivalent, wide), about a third at 55 mm (83 mm equivalent, compressed), the rest in between. This matters for §5.5 (the drone camera has two focal lengths).

**The camera clock ran on CET, not summer time.** EXIF times are one hour behind local time (CEST); add an hour. The sun proves it: 9547 is stamped 20:52 on 1 June, eleven minutes before sunset, yet shows the deep blue hour, which comes at 21:52. In CEST the set runs from 09:35 to 22:39, so **no frame shows dawn or early morning**. The Petřín panoramas (7913 to 7958) were shot from 18:50 to 19:01 with the sun 17° up in the west-north-west, behind the camera. 8645 to 8680 are the backlit golden hour at 19:40 to 20:00, and the blue hour and night are 9530 to 9608, 21:33 to 22:39. All times in this document are CEST. (Found on 2026-09-25 while fitting the light families of §5.3.)

### 3.2 The set by place

Each place group is a range of file numbers. Counts are frames. "Teaches" is what the group contributes to the build. Stops refer to the auto route in §9.

| Place | Frames | Stops | Teaches |
|---|---|---|---|
| Petřín, early-evening panoramas (7913 to 7958, 7862) | 20 | 5, 6 | **The roofscape bible.** Malá Strana and Old Town from the drone's own angle in warm light from a low sun behind the camera (18:50). Also the default daylight grade. |
| Petřín and Strahov, the Castle view (7964 to 7981, 8749 to 8759) | 17 | 7 | St Vitus and the Castle across Malá Strana roofs; the ridge silhouette. |
| Petřín, rose garden, orchards, meadows (7885 to 7900, 8721 to 8748, 8760 to 8764) | 13 | 5, 6 | **The season.** Roses, peonies, orchard paths, meadow grass, cumulus over the hill. |
| Vyšehrad, roofs, gates, panoramas with clouds (8284 to 8403) | 57 | 1 | **Cumulus over red roofs.** Tile colour under midday sun; brick gates and walls; clay courts as a colour note. |
| Náplavka and the railway bridge (8270 to 8273) | 3 | 1, 2 | The Rašín embankment looking north, moored boats, the riveted deck and walkway of the railway bridge. No frame in the set shows the Vyšehrad basilica; see §7.1. |
| Dancing House, Jiráskův bridge, the weirs (8111 to 8185) | 29 | 2, 3 | The glass tower with red trams; weir foam; Palacký bridge; Rašín embankment facades. |
| Legion Bridge, National Theatre, Střelecký island, Šítkov tower (8093 to 8099, 8404 to 8540, 8645 to 8649) | 33 | 4 | **Midday river with cumulus.** Trams on the bridge with the Castle behind; pedal boats; the golden roof; rowers at the weir. |
| Malá Strana, streets, facades, St Nicholas (7982 to 7995, 8082 to 8083, 8541 to 8556, 8767 to 8797, 8920 to 8942) | 28 | 8 | **Materials.** Red and ochre plaster, dormers, cobbles, lamps, window boxes; the dome and bell tower with trams. |
| Lesser Town towers, on Charles Bridge (8881 to 8918) | 9 | 8, 9 | Bridge towers and gate, statues, tourists, the view along the bridge in overcast light. |
| Charles Bridge from the water, golden evening (8005 to 8035, 8683 to 8715, 8845 to 8872, 9029 to 9057, 9515 to 9521) | 52 | 9, 17 | **Hero landmark.** Arches, Old Town tower, Smetana museum, St Francis dome; pedal boats and swans; warm evening light on stone. |
| Kampa, Čertovka, the weir below Petřín (7840 to 7843, 8066 to 8069, 8709, 8821 to 8826, 9203 to 9204) | 6 | 10 | The mill channel in soft light, Kampa roofs, the weir with Petřín behind, ducks. Also the daylight overcast reference. |
| Old Town Square, Týn, the clock, the lanes (8595 to 8616, 8830 to 8839) | 13 | 11 to 13 | **Hero landmark.** Týn towers and facade, the astronomical clock, the square, Karlova and the lanes. |
| Mánes Bridge, the Castle across the water (8807 to 8812) | 2 | 14 | Castle and Malá Strana waterfront from the Old Town side. |
| New Town, Wenceslas Square, trams (8618 to 8633) | 5 | 15 | Pink and cream Art Nouveau facades, red trams. |
| Letná, the bridges, Štefánik bridge, lawns (9245 to 9314, 9325 to 9373, 9451 to 9500) | 47 | 16 | **All the bridges in one frame.** Late light on the river, big lawn trees, the Old Town skyline through leaves. |
| Holešovice, St Anthony, trams (9385 to 9450, 9513) | 10 | 15, 16 | Outside the drone's area, but the best tram frames: red Tatra trams under cumulus. |
| Evening embankments, pastel light (8039 to 8065, 8952 to 9026) | 29 | 17 | **The overcast pastel evening.** Reflections on still water, pigeons on cobbles, the Dancing House at dusk. |
| Backlit golden hour (8655 to 8680) and blue hour, night (9527 to 9608) | 32 | 18 | **The end of the route.** Charles Bridge and the Castle lit, the penguins, the Dancing House at night. 8655 to 8680 are against the low sun at 19:50, not night. |
| Wallenstein garden, leaves, fruit, water lilies (9074 to 9178, 9223 to 9241) | 18 | palette only | Early summer detail: mock orange, wet leaves, green plums, water lilies, the peacock. |

Every one of the 422 frames falls in exactly one group, except 8709 (Kampa and Charles Bridge). The ranges are file-number ranges and skip the numbers that were not kept. The mockup page `mockup/plan.html` renders this table with every frame, the route, and the star markers. Use it as the browsable version of this section.

### 3.3 Hero frames

Hero frames are the frames the renders are tested against (see §12). Confirmed by the user on 2026-09-25 and stored in `data/hero.json`; seven ids that turned out not to be in the curated set were replaced the same day (§14). Thirty frames. The list can still be edited in `mockup/plan.html` and re-exported.

| Frame | Viewpoint | Tests |
|---|---|---|
| 7924, 7940, 7944 | Petřín slope below the tower, looking east and north-east | Roofscape, river, early-evening grade (18:50) |
| 8753 | Petřín / Strahov looking north to the Castle | Castle massing and ridge |
| 9204 | Kampa, the Čertovka channel, soft light | Overcast grade in daylight, the mill channel |
| 8372, 8385 | Vyšehrad ramparts looking north | Red roofs, cumulus, cloud shadows, Castle on the horizon |
| 8683, 8704 | Alšovo embankment south of Mánes Bridge, looking upstream (8683; first listed as the Smetana embankment looking west, M8); Mánes Bridge looking south (8704) | Charles Bridge, towers, evening grade |
| 8849 | Legion Bridge looking downstream to Charles Bridge (first listed as from Charles Bridge upstream; the solved viewpoint, M8, is the other way round) | Pedal boats, river colour |
| 8607, 8608 | Old Town Square, south-west corner, below the astronomical clock | Týn, the square |
| 8903 | Charles Bridge west end, overcast | Lesser Town towers |
| 8942 | Malostranské náměstí | St Nicholas, tram |
| 8158 | Jiráskovo náměstí, the corner of the Rašín embankment | Dancing House, tram |
| 8809 | Charles Bridge near the Old Town end, looking north-west (first listed as the Rudolfinum embankment; the solved viewpoint, §12.1, put it on the bridge) | Castle and Malá Strana waterfront across the water |
| 8082, 8777, 8884 | Malá Strana streets and roofs | Plaster colours, dormers, chimneys |
| 8825 | The head of the Old Town weir below Novotného lávka, looking at the Castle (first listed as Kampa looking at the weir, M8) | The weir, the Castle across the water |
| 8490 | Legion Bridge looking north | Castle, island, cumulus |
| 8440 | Střelecký island looking at Legion Bridge | Tram, bridge, hill |
| 8725 | Petřín meadow and orchard | Season, greens |
| 8722 | Petřín, roses on a wall | Season, red |
| 9369 | Letná lawn looking up | The sky |
| 9486 | Letná looking south | All bridges, late light |
| 8694, 8988 | Charles Bridge at golden hour; Jiráskův Bridge and the Rašín embankment from the Smíchov bank, overcast | Evening grades |
| 9547, 9542 | Charles Bridge at blue hour, the Old Town waterfront at night | Blue hour, city lights |

---

## 4. The boundary: what "looks like the photographs" means

The photographs disagree with each other. Different hours, exposures, focal lengths, weather. So the build targets what they share, and is free everywhere else.

### In scope, must match

1. **Shapes.** Silhouettes of the Tier 1 landmarks; the roof rhythm of Malá Strana and Old Town (dormers, chimneys, gable ends, hips); the river's curves and the bridges' spans; the hills' profiles.
2. **Surfaces.** Roof tile colours and their mix; plaster tones by district; the sandstone of Charles Bridge; the green of the Vltava by light; tree greens by species; cobbles.
3. **Light and atmosphere.** Late May sun at 50°N; four light families present in the set (clear warm morning, cumulus midday, golden evening, blue hour into night) plus the overcast pastel weather; haze toward the horizon.
4. **The camera's eye.** The Classic Negative rendering, the exposure habit (shadows kept deep, highlights protected), the two focal lengths, mild vignette, fine grain. See §5.

### Out of scope, free

- Matching any single frame's framing or exposure.
- Interiors, people's faces, shop signs, graffiti, cars, construction cranes (several frames show cranes at Podskalí; they are not built).
- Anything the drone cannot see: ground-level detail below about 8 m, interiors of courtyards, window contents.
- Weather not in the set: rain, storm, snow, fog on the ground.
- Exact tree placement. Exact number of chimneys. Exact facade colours per building.

### The test

Put the virtual camera at the viewpoint of a hero frame with the matching focal length and time of day. Render. Place side by side with the photograph. Same silhouette, same colours, same light mood. Not the same pixels. §12 defines the procedure.

---

## 5. The look

### 5.1 Classic Negative, described as render targets

Classic Negative is Fujifilm's simulation of a consumer colour negative film. In this set it shows as:

| Property | Target |
|---|---|
| Tone curve | Medium-high contrast S-curve. Shadows fall dark quickly but hold a little detail; they are never crushed to pure black in daylight. Highlights roll off gently; white plaster and sky stay short of clipping. |
| Shadow tint | Cool, toward teal-blue. Compare the dark trees in 7940 and the shaded facades in 8082. |
| Highlight tint | Slightly warm. Sunlit plaster reads cream, not white. |
| Saturation overall | Below neutral by about 10 to 15%. |
| Reds and oranges | Kept saturated and slightly warm. Roof tiles, tram red, rose red are the strongest colours in any frame. |
| Greens | Desaturated and cooled. Foliage reads olive to teal-green, never lime. See 8725, 9126. |
| Blues | Sky is a muted cyan-blue, lighter and greyer than a "real" sky. Deep blue only at blue hour (9547). |
| Yellows | Muted, slightly green. |
| Exposure habit | Frames are exposed for the highlights. Foregrounds and shadowed facades are dark. The city sits in a mid-to-dark key with bright sky. |
| Grain | Fine, visible only on close inspection. |
| Vignette | Mild, from the 16 mm end. |
| Sharpness | Moderate. No halos. |

### 5.2 Implementation

Render physically based in linear light. Post chain, in order:

1. Exposure (auto-exposure with a highlight-priority meter, so the sky never blows out and shadows are allowed to go dark, matching the exposure habit above).
2. Anti-aliasing (TAA) in linear light, before tonemapping, so grain and vignette are not smeared by the history buffer.
3. Filmic tonemap with the shadow toe and highlight shoulder tuned to the tone curve row above.
4. **Colour grade as a 3D LUT** (32³ or 64³), authored to the table above. The LUT is authored once by hand against the hero frames, then refined by a script that compares Lab histograms of renders and photographs at the same viewpoints (see §12.3). The LUT is a project asset, `assets/lut/classic-neg.cube`, and is versioned.
5. Vignette, grain, tiny chromatic aberration at 16 mm only.

As built in M1: the tonemap is a per-channel filmic curve with separate toe and shoulder (the Uchimura form), chosen over AgX because the two ends of the Classic Negative curve are tuned independently, and per-channel compression is what turns bright sky grey-cyan and sunlit plaster cream. The meter weights bright pixels more than dark ones and may move at most one stop either side of each light family's base exposure, so the key of a light stays put while the drone turns. The LUT is written by `tools/make-lut.ts` from the §5.1 table (hue-selective chroma and hue moves in OKLCh, split toning, a slight lift of the blacks); its parameters are the hand authoring, and `lut-fit.ts` refines them later. Each family adds a trim on top: white balance, saturation, contrast.

Changed in M5, the greens: the green window of the LUT reaches down to the yellow-greens of sunlit grass and young leaves (centred at OKLCh hue 130 instead of 135, 42° wide instead of 34), turns them 17° toward teal instead of 12°, and takes more of their chroma (0.64 instead of 0.72). Measured in 8725, the photograph's sunlit meadow is at hue 141 and chroma 0.043; the render's had been at 119 and 0.066, a yellow olive, and is now at 130 to 135 and 0.048. Reds, ochres and the sky are outside the window and unchanged.

Changed in M8, the grade refined against all thirty hero frames by `tools/lut-fit.ts` (§12.3), v2 of the LUT. Measured, the renders' roofs were half again as saturated as the photographs' and their ochres yellower; their neutral highlights were yellower; their shadows bluer. The fit moved: reds' chroma from 1.06 to 0.94 and their hue 4° from orange toward red instead of 2°; yellows' turn toward green from 6° to 2°; greens 19° toward teal instead of 17° and a little darker; blues' chroma from 0.80 to 0.76, 7° toward cyan instead of 9° and a little lighter; purples 33° toward blue instead of 30°; the shadows' tint neutral instead of blue (b 0.001 instead of −0.014) and a little more green; the highlights' tint a trace redder (a 0.004 instead of 0.003); less lift of the blacks (0.008 instead of 0.012). The overall chroma, the yellows' and greens' chroma and the S stay as authored. Over the thirty pairs the fit's loss went from 47.3 to 45.0, and the mean ΔE between the dominant clusters from 4.66 to 4.35. The parameters are in `assets/lut/classic-neg.params.json`, with each pair's statistics; the hand authoring stays in `tools/lib/grade.ts`, which both tools share.

Also changed in M8, after the grade:

- **The family's contrast** is an S about the middle that keeps black and white where they are. It was a straight stretch about the middle, clipped, which at 1.1 sent everything below 5% to pure black: trees against the sky (9369) were black where the photograph's are deep green.
- **The meter** may brighten a frame by up to 0.8 of a stop from the sky's base, not 0.6. Views away from a low sun, where the photographs let the pale sky go nearly white (8683, 9486), came out a stop dark.

Changed in M11, against 8722: vivid reds keep their strength and hue. The fit's loss of chroma (0.88 overall, 0.94 more in the red window) and its turn of 4° toward crimson were made on the roofs and plaster; on a vivid colour at the edge of the gamut they raised green and blue, and 8722's vermilion roses came out pink, (179, 57, 46) for the render's (189, 35, 6). §5.1 has reds kept saturated and rose red the strongest colour in a frame. Both moves now fade out as a colour's OKLCh chroma in the red window rises from 0.15 to 0.19, above the roofs (0.10 to 0.15) and below the roses and the trams' red (0.19 to 0.2). 1,565 of the LUT's 32,768 entries changed, all vivid reds and oranges.

Provide a runtime toggle (key G, developer builds only) that bypasses steps 4 and 5 so the grade can be judged. Comparison against photographs happens only in the offline tool `tools/compare.ts` (§12.1); the app itself never loads a photograph.

### 5.3 The four light families

The time-of-day slider blends between these anchors. Each anchor has a sun elevation/azimuth (computed), sky model parameters, fog density and colour, and a small LUT trim on top of the base grade.

| Family | Clock (CEST, late May) | Reference frames | Notes |
|---|---|---|---|
| Dawn and warm morning | 05:00 to 09:30 | None in the set, which starts at 09:35 (§3.1). Built from the low warm sun of the Petřín panoramas (7924 to 7958, 18:50) with the sun moved to the east-north-east, plus morning haze | Long shadows to the west, warm light on east faces, cool shadows, clear sky with light haze at the horizon. The default and the most important. |
| Cumulus midday | 10:00 to 16:00 | Vyšehrad (8371 to 8394, 12:05), Legion Bridge (8480 to 8540, 13:15 to 14:00), Letná lawn (9369, 16:54) | High sun, hard shadows, scattered cumulus with sharp cloud shadows moving over roofs. |
| Late afternoon and golden hour | 16:00 to 21:00 | Petřín panoramas (7924 to 7958, 18:50), Letná bridges (9486, 9492, 18:51), Charles Bridge evening (8683 to 8715, 20:00) | Lower, warmer sun from the west. Stone glows. Sky still cyan-grey. |
| Blue hour and night | 21:00 to 23:00 | 9530 to 9608 (21:33 to 22:39) | Deep blue sky, city lights warm, floodlit landmarks, water reflecting lights. |

As built in M2: the late-afternoon key at 18:30 is tuned against the Petřín panoramas: clear air (a third of the M1 haze), the sky's light on shaded surfaces at 55%, contrast 1.12, so shadowed walls go dark and sunlit plaster reaches near white as in 7924. With real roofs the midday keys needed the same in milder form (sky light 72%, contrast 1.1, a fifth of a stop brighter), the morning keys milder still; the golden-hour and blue-hour keys are as in M1. Each family also has a horizon knob: three wavelengths make the low sky away from a low sun greenish (yellowed sunlight over the air's blue), where the photographs show pale blue, so that band takes a pale version of the hue 15° above it. Aerosol scatters with an Ångström exponent of 1.3.

Weather variant, independent of time: **overcast pastel** (8952 to 9026, 8881 to 8918, 9203 to 9204). Flat light, no shadows, colours go pastel, sky is a bright grey with texture. Rolled with 20% probability at session start, or forced from the UI.

Changed in M8, measured against the hero frames of each family (§12.3):

- **Golden hour at the river** (the 20:12 key; 8683, 8694, 8704): the sky away from the sun was two stops too dark against the city and the highlights yellow. Now clearer and brighter air toward the horizon (aerosol 2.8), the sky's dark band lifted further, a neutral white balance, and the sun at two thirds of its physical strength with the exposure 0.7 of a stop up, so the pale sky outshines the warm stone as in the photographs.
- **Blue hour**: once the sun is 5° down, the whole low band of the sky takes the pale blue of the sky above it, the afterglow's side too; three wavelengths had left it pink toward the north-west, where 9547 is blue. The white balance is a little cooler (0.78, 0.97, 1.24) and the exposure half a stop higher; the floodlights and windows are deeper orange to stay sodium through it (§8.7).
- **Overcast**: the photographs' deck is a faintly blue grey and the shadows under it still go dark (8903, 8884, 8942, 8988); it had been cream and flat. A cooler balance (0.92, 1.0, 1.12), contrast 1.12, no lift, no exposure bias.
- **A viewpoint's own air**: 9486 and 8753 were taken on hazier days than the family's; a viewpoint may give its day's aerosol and haze (§12.1).

### 5.4 Sun position

Latitude 50.087°N, longitude 14.42°E, date 31 May, CEST. Compute with a standard solar position algorithm. Anchor values for validation: sunrise about 04:59, solar noon about 13:00 at 62° elevation, sunset about 21:01. Azimuths: sunrise 53°, sunset 307°. Civil twilight ends about 21:45; the blue hour is roughly 21:15 to 22:00.

### 5.5 The drone camera

Two focal lengths, matching the set:

| Name | 35 mm equivalent | Horizontal FOV | Use |
|---|---|---|---|
| Wide | 24 mm | 74° | Default for flight, manual mode, panoramas |
| Long | 55 mm | 36° | Auto route only, at the stops the table in §9.2 marks long: Dancing House (3), the Castle ridge (7), Týn (11, 12), Wenceslas Square (15), the bridges from Letná (16) |

The long lens is deliberately milder than the set's 83 mm equivalent long end: a 25° lens in motion reads as a zoom, not a flight. The offline comparison tool does not use these two lenses; it renders each hero frame at that frame's own focal length (§12.1). The auto route transitions between them over 2 to 3 seconds, never cuts. Manual mode is always wide. The render fills the browser window at whatever aspect the window has; there is no letterbox. Field of view is held constant horizontally, so a taller window shows more sky and ground rather than cropping the sides.

Depth of field: none in flight. Slight far-field haze does the job.

Added in M11, for the close-ups only: the comparison tool renders a viewpoint that gives a focus distance and an aperture with its lens's depth of field (§12.1), as 8722's rose stands sharp against a soft garden. It is a gather of the image round each pixel, over the circle of confusion its depth gives, in linear light after the anti-aliasing. The drone's camera never uses it.

---

## 6. Geography and data

### 6.1 Coordinate system

Local metric frame. Origin is the centre of Charles Bridge. `x` east, `y` up, `z` south (so north is negative `z`), metres. `y = altitude − 185`: 185 m above sea level (Bpv) is the Vltava surface at Charles Bridge in DMR 5G, so the river there is at `y = 0`. Above the weirs the river stands a little higher: about `y = 1.5` at Legion Bridge and `y = 2.5` from Jiráskův Bridge up to Vyšehrad. Altitudes in the route table (§9.2) are `y`. (The first draft put the river at 190 m; the terrain data measured it 5 m lower, 2026-09-25.)

Conversion from WGS84 near Prague:

```
x     = (lon − 14.4114) × 71 500
north = (lat − 50.0865) × 111 200
z     = −north
```

### 6.2 Landmark coordinates

From map reading, then verified against OpenStreetMap on 2026-09-25: rows more than 25 m from the OSM footprint were moved onto it (the Lesser Town Bridge Towers by 78 m, the Šítkov tower and the Leopold Gate by 120 m, the metronome by 87 m, the National Museum by 51 m, Strahov, the National Theatre and St Francis by about 30 m; bridge rows moved to the centre of the OSM deck, Palacký Bridge by 262 m, the railway bridge by 151 m, the others by 50 to 100 m). The origin stays where it is: it is 60 m east of the centre of the OSM deck of Charles Bridge, over the main channel. `data/landmarks.json` carries the same positions and the OSM ids; `tools/build-world.ts` reports the remaining offsets. `x` and `north` in metres.

| Landmark | Lat | Lon | x | north |
|---|---|---|---|---|
| Charles Bridge, centre (origin) | 50.0865 | 14.4114 | 0 | 0 |
| Old Town Bridge Tower | 50.0862 | 14.4137 | 164 | −33 |
| Lesser Town Bridge Towers | 50.0873 | 14.4069 | −322 | 89 |
| Týn Church | 50.0876 | 14.4227 | 808 | 122 |
| St Nicholas, Old Town Square | 50.0879 | 14.4199 | 606 | 157 |
| Jan Hus Memorial | 50.0877 | 14.4213 | 710 | 131 |
| Marian Column | 50.0874 | 14.4213 | 710 | 96 |
| Old Town Hall tower and clock | 50.0870 | 14.4208 | 672 | 56 |
| St Nicholas, Malá Strana | 50.0880 | 14.4033 | −579 | 167 |
| St Vitus Cathedral | 50.0909 | 14.4009 | −751 | 489 |
| Petřín lookout tower | 50.0835 | 14.3950 | −1173 | −334 |
| Petřín rose garden | 50.0825 | 14.3955 | −1137 | −445 |
| Strahov Monastery | 50.0865 | 14.3894 | −1573 | 0 |
| Vyšehrad, Sts Peter and Paul | 50.0645 | 14.4178 | 458 | −2446 |
| Vyšehrad, Leopold Gate | 50.0632 | 14.4217 | 736 | −2591 |
| Dancing House | 50.0755 | 14.4142 | 200 | −1223 |
| National Theatre | 50.0808 | 14.4136 | 157 | −634 |
| Šítkov water tower | 50.0772 | 14.4137 | 164 | −1034 |
| Smetana Museum | 50.0857 | 14.4132 | 129 | −89 |
| St Francis of Assisi (dome) | 50.0864 | 14.4143 | 207 | −11 |
| Klementinum tower | 50.0868 | 14.4165 | 365 | 33 |
| Rudolfinum | 50.0899 | 14.4155 | 293 | 378 |
| Powder Tower | 50.0873 | 14.4278 | 1173 | 89 |
| Wenceslas Square, museum end | 50.0789 | 14.4309 | 1394 | −845 |
| Letná, metronome | 50.0947 | 14.4160 | 329 | 912 |
| Wallenstein Garden | 50.0905 | 14.4060 | −386 | 445 |
| Žižkov TV tower (horizon marker) | 50.0810 | 14.4510 | 2831 | −612 |
| Legion Bridge | 50.0813 | 14.4106 | −57 | −578 |
| Mánes Bridge | 50.0895 | 14.4127 | 93 | 334 |
| Čechův Bridge | 50.0931 | 14.4170 | 400 | 734 |
| Jiráskův Bridge | 50.0756 | 14.4114 | 0 | −1212 |
| Palacký Bridge | 50.0728 | 14.4120 | 43 | −1523 |
| Railway bridge (Výtoň) | 50.0669 | 14.4135 | 150 | −2180 |
| Štefánik Bridge | 50.0945 | 14.4270 | 1115 | 890 |
| Střelecký island, centre | 50.0810 | 14.4100 | −100 | −612 |
| Slovanský island (Žofín) | 50.0790 | 14.4120 | 43 | −834 |
| Kampa, centre | 50.0850 | 14.4080 | −243 | −167 |
| Náplavka (Rašín embankment) | 50.0720 | 14.4150 | 257 | −1612 |

### 6.3 Data sources

| Data | Source | Use |
|---|---|---|
| Building footprints, heights, levels, roof shape and colour where tagged | OpenStreetMap, bbox 14.34 to 14.49 E, 50.04 to 50.13 N (about 5 km around Charles Bridge, the outer ring of §2), from the BBBike Prague extract (one PBF file, refreshed weekly) filtered locally, or from Overpass with the same queries | Tier 2 and 3 buildings |
| Terrain | ČÚZK DMR 5G through the ČÚZK image service (`ags.cuzk.gov.cz`, open data, CC BY 4.0), resampled to a 5 m grid over the world and a 100 m grid out to 16 km for the horizon | Height field |
| Water | OSM `natural=water`, `waterway=river`, weirs (`waterway=weir`), islands | River mesh and weirs |
| Land use | OSM `leisure=park`, `landuse=forest`, `natural=wood`, `landuse=orchard`, `leisure=garden`, `landuse=grass` | Ground colours, and the kind of tree that grows where |
| Trees | ČÚZK DMP OK, the surface model from image correlation of the aerial survey (same service, same licence, 0.5 m), minus DMR 5G: a canopy height model at 1 m over the world, from which every tree crown is found (M5, see §8.4); OSM `natural=tree` for the leaf type where mapped | Tree positions, heights, crown sizes |
| Tram network | OSM `railway=tram`; the tram route relations of the day lines 1 to 26 (M6: all of them, §8.8); the stop positions (`public_transport=stop_position` with `tram=yes`, `railway=tram_stop`) | Tram paths, stops and overhead wire poles |
| Streets | OSM highways with `surface=cobblestone` where tagged | Road textures, tram streets |
| Bridges | OSM with `bridge=yes`, `man_made=bridge` | Span geometry and piers |
| Districts | OSM cadastral areas (`boundary=cadastral`: Malá Strana, Staré Město, Josefov, Hradčany, Nové Město, Vyšehrad, Smíchov, and the 19th-century districts) | District rules of §7.2 and §8.1 |
| Street lamps | OSM `highway=street_lamp` | Lamp posts, and the night lights of M4 |
| Garden walls | OSM `barrier=wall`, `barrier=retaining_wall` (M5) | The walls of the gardens in the photographed city (§8.4) |
| City walls | OSM `barrier=city_wall`, `historic=citywalls` | Vyšehrad's ramparts (§7.1) |

A build script (`tools/fetch-data.ts`) downloads and caches raw data in `cache/` (git-ignored). OSM comes from the extract by default: on 2026-09-25 the public Overpass servers timed out on most requests and then refused connections, while the extract is a single 73 MB download that the script filters in seconds; `--overpass` switches back. Buildings use OSM's `building:part` elements where mappers drew them (an outline with parts is drawn as its parts), which gives the churches and towers their real massing even as blocks. Then a second script (`tools/build-world.ts`) turns it into binary files under `public/world/` (8.5 MB gzipped for M0) and writes `cache/preview.png`, a top-down map with the route, for checking a build by eye. The app never calls a map service at runtime.

The horizon uses DMR 5G too, not the Copernicus DEM of the first draft: Copernicus is a surface model that includes buildings and trees, and the whole 16 km horizon lies inside Czechia, where DMR 5G is bare earth throughout. The built world is the rectangle x −5000 to 5000, north −5000 to 4000 (1 km tiles), inside the OSM box above; beyond it only the horizon terrain.

The app shows the attribution the data licences require: OpenStreetMap contributors (ODbL) and ČÚZK (CC BY 4.0, for DMR 5G and, from M5, DMP OK).

As built in M5: `tools/fetch-data.ts chm` downloads DMP OK and DMR 5G over the world rectangle in kilometre tiles at 1 m and keeps their difference, the canopy height, as bytes in 0.2 m steps (cache/chm/, 86 MB, about 7 minutes). The service keeps its pixels square in degrees whatever size is asked for, so each tile is fetched with a margin in square pixels and resampled from the extent the server reports; asked for square metres, it returned tiles stretched north to south by half, which the building outlines showed at once.

### 6.4 Terrain notes

Heights above the river at Charles Bridge (185 m), measured in DMR 5G: Petřín summit +142 m, Strahov monastery +110, Castle courtyard +73, Letná +50, Vyšehrad rock +44 with a near-vertical face to the river on its west side, Vítkov +82, Vinohrady +64, Old Town Square +8. The Vltava valley walls are steep on the Petřín and Letná sides and gentle on the Old Town side. Old Town is nearly flat, 5 to 10 m above the river.

---

## 7. Fidelity tiers and assets

### 7.1 Tier 1: hand-modelled landmarks

Modelled as glTF, low-poly but true in silhouette from every angle the drone can reach, with PBR materials authored to the palette. Level of detail: recognisable at 50 m, holds up at 15 m. Polygon budget per landmark: 5k to 40k triangles. Textures: 2k atlases, tileable stone and plaster, no photo projection.

| Landmark | Reference frames | Modelling notes |
|---|---|---|
| Charles Bridge | 8683 to 8715, 8845 to 8872, 9515 to 9518 | 16 sandstone arches, 515 m, slight S-curve in plan, 30 statue silhouettes on the parapets (simplified, no faces), lamps. The deck is cobbled. |
| Old Town Bridge Tower | 8027, 8704, 9515 | Gothic tower with steep roof, four corner turrets, the arch over the bridge deck. |
| Lesser Town Bridge Towers | 8882, 8903 to 8904, 8918 | Two unequal towers joined by a gate; the taller Gothic one with a steep roof, the shorter Romanesque one. |
| Týn Church | 8597 to 8609 | Two 80 m towers with clusters of small spires; the facade hidden behind the Týn school houses, so the towers rise from behind a row of roofs. |
| Old Town Hall tower and astronomical clock | 8603, 8604, 8612 | Tower with the clock face on the south side (a 2k texture painted from 8604); the corner oriel. |
| Old Town Square | 8607 to 8612, 8626 | The square as a paved plane with the Hus memorial massing, the surrounding facade row with real roof forms, St Nicholas Old Town dome. |
| St Nicholas, Malá Strana | 7989, 7991, 8922 to 8928, 8942 | Copper dome and lantern, the bell tower, the long nave; the most important dome in the Petřín panoramas. |
| Castle and St Vitus | 7965 to 7981, 8749 to 8759, 8809 | The long palace front along the ridge, St Vitus with two west towers, the tall south tower, the flying buttresses of the choir. Massing must be right; detail can be low, it is always seen from over 500 m. |
| Petřín lookout tower | 7957, 8725 | 63.5 m lattice tower on the summit, with the funicular line and the Hunger Wall as context. |
| Vyšehrad | 8284 to 8403 | The brick ramparts, Leopold and Tábor gates, the rotunda, the cemetery walls, the roofs of the rock. The neo-Gothic basilica with two spires is not in any frame of the set; model it from map data and general reference and judge it by the read-back checklist, not a side-by-side. |
| Dancing House | 8146 to 8173, 9567 to 9581 | The glass "Ginger" tower with its twist and the concrete "Fred" with the dome, on the corner. Night lighting version. |
| National Theatre | 8005 to 8022, 9029 to 9046 | Neo-Renaissance block with the golden roof and the crown; the New Stage glass box next to it. |
| Šítkov water tower and Mánes | 8425 to 8429, 9026 | Slender tower with onion cap; the white functionalist Mánes gallery bridging the channel. |
| Smetana Museum and Novotného lávka | 8006 to 8012, 8694 to 8715 | The neo-Renaissance block on the embankment tip, the old mill weir beside it. |
| St Francis dome and Klementinum tower | 8053 to 8058, 8698 to 8699 | Backdrop to the Old Town end of the bridge. |
| Rudolfinum | 8811, 9486 | Backdrop from Mánes Bridge and Letná. |
| Powder Tower | none in set | Massing only; it anchors the east end of Old Town from the air. |
| Bridges: Legion, Mánes, Čechův, Jiráskův, Palacký, Štefánik, railway bridge | 8418 to 8420, 8440 to 8441, 8177 to 8185, 8270 to 8273, 9252 to 9298, 9470 to 9500 | Each with its own profile: stone arches (Legion, Palacký), concrete arches (Jiráskův, Mánes), steel arch (Čechův, with the Art Nouveau lamps), riveted iron truss (railway bridge, with pedestrian walkways). |
| The weirs | 8126 to 8143, 8821 to 8826, 9014 | Šítkov, Staroměstský and Helmovský weirs: diagonal sills with white foam lines, the pinched ship lock walls. |

As built in M3, and a change from the first paragraph: the landmarks are modelled in code, not in Blender, and ship as one mesh pack, not as glTF with Draco. There is no Blender on the build machine; and a landmark written as code stands on its OSM footprint and the terrain, rebuilds with the world, and can be read in review. `tools/landmarks/kit.ts` is a small modelling kit (prisms, lofts, solids of revolution, spires, beams, extruded slabs, window and opening plates, and the straight-skeleton roofs of §8.1), with one module per landmark. The world build packs the finished meshes into `public/world/landmarks.bin` in the vertex layout of the building tiles (0.8 MB gzipped for all of them), and the building shader draws them with four surfaces of their own instead of texture atlases: stone (ashlar, brick, rubble, render, setts, each blackened in patches as Prague sandstone is), metal (slate, copper with standing seams and streaked patina, lead, gold), glazed windows with tracery or a rose, and dark openings. Small parts (statues, finials, lamps, lattice bracing, flying buttresses) go into a second mesh that the app hides beyond 1.4 km. Each model replaces the OSM buildings, parts and bridge decks it stands for. Proportions follow the photographs where they and OSM disagree: Týn's galleries are at 44 m, as 8607 shows, not OSM's 55 m.

Built in M3: Charles Bridge (sixteen arches on fifteen piers, placed where OSM's outline of the bridge widens round the cutwaters; pointed cutwaters upstream with wooden ice guards, square buttresses downstream, pilasters carrying the thirty statue groups, lamps, the cobbled deck rising four metres to the middle of the river), the Old Town Bridge Tower, the Lesser Town towers with the Judith tower and the gate, Týn, St Nicholas with the city belfry, the Castle (St Vitus in full massing, and the palace wings with even rows of windows, grey roofs over the west wings and red over the Old Royal Palace), the Petřín tower, and Vyšehrad (the ramparts, the Leopold, Brick and Tábor gates, the rotunda of St Martin, the basilica). From 900 triangles (the Old Town Bridge Tower) to 25,000 (Charles Bridge), 47,000 in all: well under the budget of the first paragraph, because shape carries them and the shader the surface. The landmarks still to come in M4 stand as their OSM 3D parts with the roof shapes mapped there (the water tower's spire, St Francis's dome, the Klementinum's onion) instead of boxes.

As built in M4, the rest of the table, in the same way. One generator (`tools/landmarks/bridges.ts`) makes the seven bridges from OSM's outline of each deck: the axis and width, the runs of water the axis crosses, and in them the number of spans each bridge has, its arch (segmental, flat elliptical, steel ribs), piers and cutwaters, parapet or railing and lamps. Legion Bridge has granite arches, candelabra on the piers and a land arch over Střelecký island's promenade; Mánes Bridge flat arches with open spandrels and lamp pylons; Čechův Bridge steel ribs between stone piers and the four columns with gilded figures; Jiráskův and Štefánik bridges pale concrete; Palacký Bridge red voussoirs among the grey; the railway bridge three trusses with a walkway outside each and its stone viaduct. The landmarks: Novotného lávka's water tower and the Smetana Museum (OSM's `way/30619188`, the building at the tip, not the one first listed); the Dancing House, Ginger lofted from pinched rings on her slanting legs, Fred's cylinder of staggered framed windows and the Medusa; the National Theatre, its dark vault over the auditorium with the gilded band and crown and the chariots on the front, the stage house from its OSM parts; the Šítkov water tower; St Francis's dome on its drum; the Klementinum's tower with Atlas; the Rudolfinum from its OSM parts with statues along the balustrade; the Powder Tower and the Old Town Hall tower as the bridge towers' Gothic type, the tower with the astronomical clock's two dials in their frame and the chapel's oriel; on Old Town Square St Nicholas with its two onion towers and dome, the Jan Hus memorial and the Marian column (new rows in §6.2). Every modelled landmark is marked floodlit for the night (§8.7). 117,000 triangles in all, 70,000 of them new, the bridges 58,000 of those. The Mánes gallery stays as its OSM parts, white blocks, and the facades round Old Town Square stay the generic ones of M2.

Added in M5: the gloriette at the top of the Schönborn garden (`tools/landmarks/gardens.ts`), the white pavilion over the Petřín orchards in 8725, with its open arcade, round windows, terrace and small belvedere under a grey pyramid roof. As OSM's block it was an ochre house.

Vyšehrad's ramparts are retaining walls 10 to 15 m high, which the 5 m terrain grid smears into slopes. Each wall on OSM's line (`barrier=city_wall`) is built as a solid rampart: a battered brick face, a parapet, and the grassed walk behind it, 14.5 m deep. The build lowers the terrain at the foot of the face and for 7 m behind it, under the walk, so no slope of the grid lies in front of the brick.

Added in M11, against 9204: the Zlomkovský mill's wing across the Čertovka (`tools/landmarks/mills.ts`), at the end of the canal's straight reach by Kampa park. OSM maps the mill on the bank only; the wing over the water is built from the mill's footprint and the water the site reports: two segmental arches of red-brown sandstone voussoirs springing from a pier with a cutwater upstream, the left one closed by the sluice's iron rack, pale pink render round them, and over them two storeys of cream plaster with the facade shader's windows and a tiled hipped roof. The canal's walls and bushes keep off it. It is not one of §6.2's landmarks and has no name on the screen.

As built in M12, the bridge quarter, the first milestone of the detail programme (§14). `tools/landmarks/kit.ts` gained a **moulding sweep**: a profile in metres swept along a path of points, mitred at the corners, with the usual profiles (band, string course, classical cornice, plinth, sill, arch ring, coping, corbel course); and `tools/landmarks/ornament.ts` a **parts library** on it and on the kit's lathes and slabs: balustrades of vase balusters, crenellations, corbel courses, pinnacles with crockets up their spires, tracery windows in chamfered surrounds with their mullions and a Y in the head, rectangular surrounds, columns of three orders, pilasters with base and capital, entablatures, triangular and segmental pediments, canopied niches, rows of shields, ribs down domes, and **statue silhouettes** in ten compositions (a robed figure with head and arms in five poses; a pair, a trio, a crucifix, a figure on a column, an angel, a seated figure, a pyramid of figures on a rock, a rock with a cave and figures on it, a figure before an obelisk). A landmark now has **three tiers**: the main mesh; the detail (statues, finials, lamps), hidden beyond 1.4 km; and the fine tier (mouldings, tracery, mullions, balusters, crockets, corbels, shields), drawn within 300 m on the full preset and left out on lite, casting no shadow and kept out of the mirror (§11). Rebuilt with them: the **Old Town Bridge Tower** (a moulded plinth and string courses, the gate in two arch rings, blind tracery panels with mullions, and on its east face the band of nine shields over the gate, the two seated kings and St Vitus in canopied niches between pinnacled buttresses, two saints in niches above; a corbelled gallery behind a pierced parapet, corner turrets with crocketed spires, lucarnes with finials); the **Lesser Town towers** (the same type in pale ashlar with two wide tracery panels a face; the Judith tower's stepped gable with scrolls and obelisks and its windows in surrounds; the gate's arch ring and merlons); **Charles Bridge** (the thirty statue groups by name and place, each its own composition, St John of Nepomuk in bronze and St Philip Benizi in white marble, on pedestals with moulded base and cap; the coping and the string course swept along the whole deck; tall lamps with the big four-paned lanterns; Bruncvík on his column on the first river pier from Kampa); **Týn** (tracery in every window, the galleries on corbels behind balustrades, the turrets crocketed, the buttresses with set-offs); **St Nicholas** (pilasters with capitals on the drum, the nave, the front and the belfry's stages, entablatures round them, ribs down the dome, eight columns round the lantern, the windows in moulded surrounds, statues on the front and the belfry's terraces); the **Old Town Hall** (the orloj's frame pinnacled, figures beside the dials, the chapel's oriel on a corbel, traceried on three faces with pinnacles at its corners); the **Powder Tower** (the same generator); **St Francis** (drum pilasters, an entablature, a ribbed dome, the lantern on eight columns); the **Rudolfinum** (a cornice, a balustrade of some 850 balusters and statues along the attic); the **Smetana Museum** (the arcade in moulded rings, cornices, figures and obelisks on the gables); and, new in `tools/landmarks/klementinum.ts`, **St Salvator** (a portico of three arches under a balustrade with twelve statues, six pilasters round the great window, two niches with saints, entablature and pediment with the Saviour on top, the crossing's cupola, two towers with copper onions and lanterns) and the **Italian Chapel** (an oval under a copper dome), which replace their OSM buildings and parts and carry no name on the screen. The landmarks grew from 117,000 to 269,000 triangles (113,000 main, 51,000 detail, 105,000 fine) and `landmarks.bin` from 3.3 to 5.1 MB.

Changed in M10, against 8440: Legion Bridge's arch rings are pale granite voussoirs, about 0.6 m on the soffit and 1.1 m deep, cut radially round each arch, two tones alternating, each stone its own shade and every other one reaching a little higher; the joints are a hair's gap onto the darker face behind. The piers' ashlar is warmer, the soffits darker. Palacký Bridge keeps its vertical slices of red and grey.

### 7.2 Tier 2: the photographed quarters

Districts built from OSM footprints with real roof forms, district material rules, and procedural detail. Districts: Malá Strana, Kampa, Old Town, Josefov, Hradčany (the Castle district on the ridge), Vyšehrad and Podskalí, New Town along the river (Rašín, Masaryk, Smetana embankments), the Smíchov bank opposite Petřín, Wenceslas Square.

As built in M2: a building's district is the OSM cadastral area its footprint's centre falls in (Kampa is part of Malá Strana, Podskalí and Wenceslas Square of Nové Město). All of Nové Město and Smíchov take the Tier 2 rules, not only their river banks: the cadastral lines are the ones the data has, and both are in view from Petřín. The rules per district live in `tools/lib/districts.ts`.

### 7.3 Tier 3: the rest

OSM extrusion with a per-district palette, hipped or flat roofs by footprint, no dormers, no chimneys beyond a statistical scatter. Vinohrady and Žižkov get the 19th-century block treatment (mansard roofs, 5 to 6 storeys, courtyards). Panel-housing estates beyond are grey slabs with a green base.

### 7.4 Horizon

Terrain only, with fog, plus the Žižkov TV tower, the Pankrác cluster and the Strahov stadium as silhouettes.

---

## 8. World systems

### 8.1 Roofs (the highest-value system)

From the air the city is roofs. Rules, applied per building at world build time:

1. **Shape.** Use `roof:shape` when tagged. Otherwise: footprint aspect ratio over 1.6 → gabled along the long axis; near-square → hipped; 19th-century block districts → mansard; footprint over 600 m² and post-1950 → flat. Old Town and Malá Strana courtyards are inferred from footprint holes.
2. **Pitch.** 40 to 50° for gabled and hipped in the core; 30° mansard upper; churches steeper.
3. **Dormers.** In the core, 0.4 to 1.2 per 10 m of eave, alternating small (eyebrow or gabled) and large; seed deterministic from the building id.
4. **Chimneys.** 1 to 4 per building in the core, on ridge lines and party walls, plaster-covered with terracotta pots.
5. **Colour distribution** in the core, sampled from the Petřín and Vyšehrad panoramas: terracotta family 78%, dark slate and grey 14%, green copper 5% (churches, palaces), other 3%. Terracotta itself is a spread of at least 6 tones so no two neighbours match. Vyšehrad and Podskalí lean brighter orange; Malá Strana has more weathered browns; Josefov has more slate.
6. **Weathering.** Ridge lines lighter, valleys darker, moss and lichen tint on north slopes. One 2k weathering mask atlas reused with random UV offsets.

As built in M2, at world build time (`tools/lib/roofs.ts`, `props.ts`, `plan.ts`, run on a pool of worker threads, about 20 s):

- **Forms from the straight skeleton** of each footprint, holes included (CGAL through the `straight-skeleton` package, WebAssembly, a build-time dependency only). Hipped roofs are the skeleton; a gabled end is a triangular face stood upright; a party wall's triangular face stands upright as a firewall with 60 to 85% chance by district. Mansards bend the profile (70° for the first 1.2 m in, then the district pitch), domes and onions curve it, and above a height cap (10 m in the core, 8 to 9 m in the blocks) the roof turns flat, as the big Prague blocks do. Pyramids and skillions are built directly. Tagged `roof:shape`, `roof:height`, `roof:levels`, `roof:angle` and `roof:direction` are used; untagged parts of Simple 3D Buildings are flat, and so are industrial, retail and large post-war footprints. Of 51,000 buildings and parts, 37,800 get pitched roofs; 20 degenerate footprints fall back to flat.
- **Party walls** are found geometrically: an edge that runs along a neighbour's edge for more than half its length (73,000 of 379,000 edges).
- **Heights**: the eave from `height` or `building:levels` (storeys of 3.0 to 3.6 m by facade style), or the district's storey range when untagged; the roof rises above the eave. Footprints under 60 m² stay low.
- **Changed in M11, the storeys OSM's import gets wrong.** In the old town (Malá Strana, Hradčany, the Old Town, Josefov), `building:levels=1` on a footprint over 100 m² that is a residential, apartment, hotel or office building, or holds two flats or more, is the cadastral import's (RUIAN's) error, not a one-storey house: 377 footprints there (144 in Malá Strana, 48 in Hradčany, 178 in the Old Town, 7 in Josefov) say one storey, 276 of them with 2 to 25 flats. They take the district's storey range as if untagged. On Nerudova it had made single-storey houses of the three-to-four-storey fronts, and a street as wide and bright as a square (8082, 8777).
- **Dormers** (19,900) are placed along eaves that face a street or courtyard, not on party walls, alternating small gabled and large gabled or flat ones, at the district density (1.0 per 10 m in Malá Strana, 0.6 in the New Town, 0.15 in the 19th-century blocks); **chimneys** (30,500) stand on ridges and on the tops of party gables; flat roofs carry a few machine-room boxes (5,400).
- **Colour** follows rule 5, with `roof:colour` and `roof:material` snapped to the palette where tagged. Copper belongs to churches and palaces: untagged ordinary roofs draw terracotta and slate only.
- **Weathering** is drawn in the building shader instead of an atlas: tile courses and joints filtered by distance, world-space noise patches, lighter ridges, lichen on north slopes; valleys darken through the ambient occlusion of §11.

Built in M9, from 8884 and the panoramas: seven chimney stacks in ten plastered white or cream with a dark cap, the rest the house's colour; skylights, dark panes of 0.8 by 1.1 m in a pale metal frame, in about one cell in twelve of 3.4 by 2.6 m on the tiled slopes, clear of the eave and the ridge, shown to a few hundred metres; dormer fronts white, the window a casement with a cross.

### 8.2 Facades

Procedural: storey count from OSM or footprint area, window grid with district-specific rhythm (Malá Strana: small windows, deep reveals, 2 to 3 storeys; Old Town: 3 to 4 storeys, arcades on the square; New Town embankments: 5 to 6 storeys, tall windows, balconies, Art Nouveau cornices), plaster colour from the district palette (§8.9), ground-floor darkening, a cornice line, shutters occasionally. No text, no signs.

As built in M2: the windows are drawn in the shader from wall coordinates (along the wall, height above ground, the eave) and five styles (`src/core/buildings.ts`): baroque, Old Town, block, modern, house. Each wall gets as many window columns as fit, centred; storeys divide the height below the cornice evenly; the ground floor has shopfronts or plain windows by style; a cornice and a string course; glass dark with a little variation per window, and glossy, so it takes the sky at a glance. Party walls are blank and a shade greyer, which shows where a building rises above its neighbour. Every pattern is box-filtered to its own pixel size, so it fades to its average instead of shimmering. Balconies, shutters and the Old Town Square arcades are not built yet; the square's houses come with the square in M3.

Built in M9, the details of the close-ups (8777, 8082, 8884), modelled and applied to every facade of the same kind, not only where a photograph was taken (§14). Approximate, for the beauty of the street, not a survey of it:

- **Two tones.** Prague's plaster comes in two colours: the field, and the trim on the window surrounds, the corner strips (lesenes), the cornice, the string course and the plinth. The trim is either paler (white and cream on ochre and yellow, 8884) or deeper and warmer (salmon on pale pink, 8777; red-orange on ochre, 8082), or the same colour in relief; chosen per building.
- **Windows** are white-painted casements with a cross, their glass taking the sky, set in a surround with an apron panel under the sill; on the first floor of baroque, Old Town and palace fronts a hood above, segmental or triangular by building. From a distance a window averages to a grey with its frame in it, not a black hole.
- **Ground floors**: the 19th-century blocks have a rusticated base; the plain ground-floor windows take the same frames and surrounds. Round-arched windows and portals came with M10 (below).
- Relief is drawn as light and shadow in the shader, a lit edge over a line of shadow under each projection, as the cornice already is. The details are drawn within about 50 m and fade out by 150 m; beyond that a window is its glass with a fifth of frame in it, and the trim stays on the lesenes, the cornice and the string course, which are big enough to show from the drone.

Built in M10, the rest of what 8777 and 8082 show, in the same way (drawn in the shader, within about 50 m, fading out by 150 m, except the shutters):

- **Portals.** One door to a street front, in the middle of a rich one, elsewhere at a column chosen by the building, on nine fronts in ten. Round-headed with a keystone on most baroque and palace fronts, straight under a cornice on the rest, in a frame of stone (the trim toward grey sandstone on the rich fronts); the leaves painted wood, dark brown, dark green or oxblood, with raised panels; a fanlight with radial bars over a round head, a transom light over a straight one.
- **Round-headed windows** on two thirds of the rich fronts' ground floors, a fan of bars in the head, the surround following the arch.
- **Stucco** in relief, lit from above (a shape read twice, a few centimetres apart, gives its lit top edge and the shadow under it): a cartouche filling each apron of the baroque and palace fronts (the Old Town's first floor only), a framed shield between volutes with a garland; keystones over the upper windows of the rich fronts; ears at the top corners of their surrounds; a shell in each segmental or triangular pediment; on some first floors a wreath on one pier.
- **Balconies**: on the 19th-century blocks, the middle windows of every upper floor but the top, on three blocks in five; on most palaces and some baroque fronts, the window over the portal. A slab on two consoles with its shadow on the wall, an iron railing of balusters, the window a door down to the slab.
- **Shutters** on about one plain house or villa in eight, not on the core's baroque and Old Town fronts, which the photographs show without them: two louvred leaves beside each window, in faded green, brown, grey-green or oxblood. They are big enough to show from the drone, so they are drawn at every distance, box-filtered.
- Nothing is drawn below a front's ground floor, where a street falls away along it; there the wall counts as at street level for the lamps' pools, which had left it black at night.

### 8.3 Streets and squares

Cobble texture in the core, asphalt elsewhere, tram rails inlaid where tram lines run, lamp posts as instanced props on embankments and bridges. Old Town Square, Malostranské náměstí, Kampa and the embankments get their own paving patterns. Náplavka has the barrel-vaulted cellar doors along the embankment wall and moored boats.

As built in M2: the ground shader draws small setts on cobbled streets, larger setts with a lighter granite grid on squares and pedestrian areas, grain on asphalt and gravel, each fading to its average with distance. Tram rails are steel strips on 242 km of OSM tram track, off the bridges until M4 builds the bridges; 5,750 lamp posts stand where OSM's lamp register puts them, on the ground or on a bridge deck. Both are drawn within about a kilometre of the camera. Náplavka's cellar doors and boats come with the river and its embankment walls (M4).

Built in M10, from 8777 and 8082: in the old town's streets (Malá Strana, Hradčany, the Old Town, Josefov) a lamp of OSM's register that stands within 3 m of a house hangs from a bracket on its wall, as Prague's lanterns in narrow streets do: 164 of them. The lantern is 0.8 m out from the wall under an iron arm with a stay and a plate. Every lantern, on a post or on a wall, is now the four-paned Prague kind, wider at the top, under a cap and a finial, its panes pale; the posts are tapered cast iron on a base.

Added in M11, from 8777 and 8082:

- **Lamps where the register has none.** OSM's register leaves stretches of the old town's streets without a lamp (on Nerudova, 130 m). Along every street of the old town, wherever no lamp stands within 24 m, one is added, so a lamp every 24 m or so, on alternate sides (the other side where one has no front): on a bracket on the wall where the fronts stand less than 9 m apart, else on a post 1.2 m out from the wall. 909 were added. The walls a lamp is hung from include those of the buildings OSM draws as parts (the Thun palace on Nerudova), which M10's rule missed.
- **Candelabra.** One added post in two, and every lamp OSM tags with `light:count` of 2 or more, is Prague's two-armed cast-iron candelabrum: a fluted post on a base, two arms on scrolled stays, a larger lantern standing on each arm's end and a finial between them, the arms along the street or the wall. OSM's stand as posts even against a wall, at least 1.2 m out from it. 428 in all.
- **Drawing them.** Lamps are drawn within 600 m of the camera, not a kilometre: in full within 150 m, beyond that as a pole and a box of a lantern, which is what a lamp of a pixel or two wide shows; they cast shadows within 300 m. They are grouped in tiles of 250 m. The 909 lamps added had cost 0.8 ms a frame on the route drawn as before; drawn this way the route costs what it did in M10.
- **Pavements.** The old town's cobbled streets are paved with setts from front to front: the ground raster had painted them at a nominal width (6 to 7 m for a street like Nerudova, 12 m between its fronts), which left pale strips of the district's ground along the houses. 12.8 ha of pavement became setts.

### 8.4 Terrain and vegetation

Height field from §6.4. Vegetation instanced by land-use polygon and district:

| Type | Where | Look |
|---|---|---|
| Broad round crowns (lime, chestnut, plane) | Petřín slopes, Letná, Kampa, embankments, Wallenstein | Olive to mid green, 12 to 20 m |
| Tall poplars | Střelecký island, Slovanský island | Narrow, 25 m, darker |
| Orchard trees | Petřín orchards, the Seminary garden | Small, 4 to 6 m, on grass, in loose rows |
| Rose beds and flower beds | Petřín rose garden | Reds, pinks, white; a colour field, not modelled flowers |
| Meadow grass | Petřín, Letná, Vyšehrad ramparts | Slightly yellowed early-summer green with paths worn through |
| Hedges and vines | Wallenstein, Vrtba, Kampa | Dark green |
| Conifers | Scattered on Petřín, Strahov | A few dark accents, never dominant |

Greens are graded per §5.1: olive and teal, never lime. Trees cast shadows and sway slightly.

Changed in M5, before building it: trees stand where the real ones stand, not scattered over land-use polygons. OSM maps 58 trees on all of Petřín and tags none of its orchards, so polygons would put forest where the Seminary garden has fruit trees in rows on meadow. ČÚZK's surface model from the aerial survey, less the bare terrain, is a canopy height model in which single crowns show at 1 m, orchard rows included; each crown found in it becomes a tree with its own height and spread. Land use and district then choose the kind: fruit trees in the Petřín gardens and orchards, poplars on the islands, conifers as dark accents, broad round crowns elsewhere. The table above still describes the look of each kind. Exact placement stays out of scope (§4); the canopy model is simply the cheapest way to get the woods, the orchards and the lawns in the right proportions and places.

As built in M5 (`tools/lib/trees.ts` at build time, `src/world/trees.ts` in the app):

- **Finding the trees.** The canopy heights are masked where OSM has a building, bridge deck, water or railway, with a metre's margin, smoothed lightly, and every local maximum above 2.5 m (1.8 m on lawns, in parks and orchards, where no car stands) that stands higher than its surroundings within a radius growing with its height is a crown's top. Flat tops are dropped as roofs and vehicles the outlines missed; the leaves make a crown's top rough. The spread is where the canopy falls to half the height or rises toward a neighbour, looking out in eight directions. 470,000 crowns in the world: 384,000 broad, 63,000 fruit trees, 18,000 conifers, 1,400 poplars, and 4,500 rose bushes (below). `trees.bin` holds them in 3.3 MB.
- **Kinds.** A tree OSM maps as needle-leaved within 4 m is a conifer; small trees (under 7.5 m, crown under 4.5 m) on lawns, in parks, gardens and orchards are fruit trees, which is what they are on Petřín and at Strahov; tall trees on the islands are poplars one time in four; tall narrow crowns elsewhere are poplars, conifers or broad trees in thirds; conifers are otherwise a small share by land use (3 in 10 in cemeteries, 1 in 10 in woods). Heights and spreads are the survey's; the crown's depth, the trunk and the shape come from the kind.
- **Drawing them.** Within 250 m of the drone every tree is a crown of lobes on a trunk at three levels of detail (to 90 m, to 230 m, beyond), each lobe moved and resized by the tree's seed so no two crowns are alike, the nearest ones lumpy; beyond 250 m every tree is a sprite, a quad shaded as the ellipsoid it stands for with a lumpy outline, and far away the sprites thin out and grow so the canopy keeps its coverage with fewer layers. The near set is sorted again whenever the drone has moved 6 m. Crowns cast shadows (with their simplest geometry) and stand in the river's mirror.
- **Foliage** is drawn in the shader from a tiling 3D noise texture at three scales: two-metre clumps that still show from 500 m, half-metre clusters, and near the camera the leaves themselves, crisp, with dark gaps between. Each lightens and darkens the albedo, tilts the normal and breaks the outline while it is bigger than a pixel or two; the lobes' normals are bent toward the whole crown's, so it is lit as one mass; the sky reaches less deep into a crown and less under it. Colours are the §8.9 foliage tones, a little darker, fruit trees lighter, conifers and poplars darker. The crowns sway a little.
- **The ground under them.** A bit in each land-use cell marks a crown over it, and there the ground is mostly the dark floor of a wood; lawns in parks and gardens, which had stood in for the canopy since M2, are grass again. Lawns, meadows and orchards get patches yellowed by early summer, clumps, and near the camera the grain of the blades, more in the meadows (known by their yellower green).
- **The rose garden.** In the Petřín rose garden the open ground between OSM's lawn panels, where no crown stands, is rose beds, and so are OSM's flower beds across the city. A bed is dark leaves with blooms scattered over them, one variety to a stretch of bed: red (half of them), coral, pink or white. On the beds stand rose bushes, about one to a square metre and a half, whose blooms (eight to ten centimetres, with their petals near) crowd their tops and outer sides.
- **Garden walls.** OSM's walls and retaining walls of 1.6 m and more in Petřín, Strahov, Malá Strana, Hradčany and the Old Town, 30 km of them, cream plaster or stone, following the ground (`tools/lib/walls.ts`).

Cost, and a lesson: the first version cost 8 ms a frame. Two things on the M2's tile-based GPU made it so. A shader that may discard (for the ragged outlines) is shaded under every crown that overlaps it, so only the two nearest levels of detail discard; and the frame's geometry matters (a quarter of a million crowns of 100 triangles made the tiler work far harder than their pixels), so meshes stop at 250 m instead of 600. Outlines drawn as polygons instead of discarded cost more in vertices than they saved. The noise became a texture instead of arithmetic. Trees now cost about 1.3 ms a frame on average.

Changed in M8: the sky's light inside and under a crown never falls below 30% of what reaches its outer leaves, as leaves let light through; seen from below against the sky (9369, 9486) the crowns were black.

Changed in M9, the trees close up, against 8385, 8884 and 9204, where a near crown was a smooth ball with camouflage blotches and the photographs show leaves, lit clusters and sky between them at the edge. Within 50 m a crown now carries leaf clusters: small cards scattered over its lobes where no other lobe covers them, each cut into nine pointed leaves in the shader, the ones turned up at the crown's top lighter and yellower; the lobes stay as the mass inside. Shadows and the mirror keep the simplest crowns. The leaf noise is read along turned axes (along the world's, it showed as square blocks), the two-metre clumps count half as much close up, where the leaves carry the texture, and cut deeper lobes into the outline.

Changed in M10, the Čertovka's banks (9204) and the roses close up (8722):

- **The Čertovka** (below, §8.5) is lined with bushes: a sixth kind, shrub, placed at build time every 2.3 m along both banks of the mill race wherever no building stands on the water, 512 of them, 2.6 to 4.8 m tall and 1.6 to 2.6 m across, whose crowns reach the ground and hang a metre and a half down the bank toward the water. They take the leaf clusters near and a darker foliage.
- **Roses close up.** Within 12 m of the camera the blooms on the rose bushes are modelled (`src/world/roses.ts`): seven rings of cupped petals, the heart closed in a spiral, the outer petals opening with their tips rolled back to a point, each petal its own shade; on a stem with sepals and two leaves; about twenty to a square metre of a bush's top and outer sides, turned up more than out, in full within 3 m and simpler beyond. Petals take light through them. The painted blooms thin out within 8 m, where the modelled ones stand. Rose bushes now carry leaf clusters too, leaflets of a few centimetres. The drone never comes within 15 m of the ground, so on the route none of this is drawn; it is for 8722 and for the look of the garden up close.
- **The coral roses** are orange-red, the colour of 8722's, a deeper red than the salmon they were; red, pink and white are as before.

Changed in M11, the roses close up (8722):

- **Petals** are shaped as a hybrid tea's: broad, cupped (the middle of each bellies out past its edges), the lip rolled back over its last third to a soft point, where M10's came to spikes. Each is shaded across: its base in the shade of the petal below, faint veins along it, the thin edge of the lip paler. The heart's petals are lit through the ones round them, lighter and a little pinker, not a dark hole.
- **Lit as petals**: the sky's light as it is (M10 raised it by half, which flattened them), a weak velvet sheen instead of a glossy one, and light through a petal only when the sun is behind it, deeper red for it.
- **Turned out as much as up**, each its own way, so from beside a bush some blooms show their cups and some their profiles; M10's all faced the sky.
- **Stems and leaves**: each bloom stands on a stem of 50 cm with three rose leaves, a leaflet at the end of each and two pairs along it.
- **The bush opens near the lens**: within 4.5 m its mass of lobes thins to its lit clusters, and within 1.8 m to nothing, leaving the leaf clusters, the stems, leaves and blooms, and the sky between them.
- **The coral** is a little oranger (linear 0.7, 0.07, 0.004) and without the blue that turned it pink; the grade no longer takes it toward crimson (§5.2). On 8722 the petals' median is now (206, 51, 13), the photograph's (206, 49, 12).

### 8.5 The river

- Surface mesh follows the OSM water polygon; flow direction south to north at 0.5 m/s in the shader; ripple normal map tiled at two scales.
- Colour is driven by the sky: grey-green under cumulus (8490), deep blue-green in warm evening (8683), pewter under overcast (8988), black with light streaks at night (9542).
- Planar or screen-space reflections of the skyline and bridges; the reflections are what make the evening frames.
- Weirs render as white foam strips with a small displacement and a spray particle line.
- Embankment walls with mooring rings; the water meets stone, not a beach.
- Islands with their trees; Střelecký has the boat rental pontoon.

As built in M4 (`src/world/water.ts`, `src/render/reflection.ts`, `tools/lib/river.ts`):

- **Surface**: the 10 m water grid of M0, each vertex carrying the downstream direction from OSM's centrelines of the river, its arms and the canals. Ripples come from one tiling texture of slopes, sampled at two scales (9 m and 2.4 m) and carried along the flow in two phases so the pattern never stretches, with a smaller chop across them. Anisotropic filtering keeps them as lines across the river at a grazing angle.
- **Reflection**: planar, as §11 has it. The city is rendered once more from the camera mirrored in the water, at 40% resolution, every other frame, and only within 2.2 km. Everything below the plane is clipped by a world clipping plane: three's oblique-projection trick assumes an ordinary depth range, and this renderer's is reversed. The sky and its cumulus are not in the mirror; the water shader computes them along the reflected ray, over a band of heights above it, as the ripples too small to see tilt the facets. The mirror is sampled where a facet tilted by δ sends the ray, 2δ up or down the screen, and smeared into columns. Its lookup leans toward the sky, since at a grazing angle the facets facing the eye show most. About a third of every reflection is sky whatever lies across the river, and the whole is scaled to three quarters, as rippled water seen edge on reflects less than a flat surface.
- **Weirs**: from OSM's weir lines (Staroměstský, Šítkovský, Helmovský and the small ones). The level each side is made even up to the crest, the pieces of one weir sharing their levels, so the step of 1 to 1.3 m falls exactly there. The water grid leaves a band round each crest to a finer strip: level water above, glassy over the crest, the glacis, the white roller at its foot and streaks trailing downstream, moving at the water's speed.
- **Embankments**: stone walls wherever the bank stands a metre or more above the water, between Vyšehrad and Letná and on the islands, 21 km of them. Each has a face 2 m out from OSM's edge (the 5 m terrain grid's slope stays behind it), a parapet, and a paved walk 3.5 m deep that covers the slope. The stone's grime band sits at the waterline. There is no beach.
- The islands' trees came with M5 (§8.4); the pedal boat pontoon on Střelecký island and the boats with M6 (§8.8).

Changed in M8, against 8683, 8694, 8704, 8849 and 8490: the water read grey seen edge on and navy seen from above, where the photographs show sky blue and grey-blue. The ripples now tilt the facets both ways: the sky is taken at the reflected ray, 7° and 17° above it, and halfway down toward the horizon, weighted by the angle, since edge on the eye sees mostly the facets turned toward it (the blue above the pale horizon) and from above those turned away (the paler sky toward the horizon). And the reflection is scaled to 55%, not three quarters: seen edge on, rippled water in the photographs reflects about a tenth of the sky's brightness, not half.

Also in M8, the moored boats that OSM maps as buildings (houseboats, ships, anything floating), restaurants and botels along the quays, are low flat-topped cabins with a row of windows. By the rules for houses they had tiled roofs and stood in the river as town houses (8683).

Changed in M10, against 9204: the Čertovka's banks are not the river's embankments. Where OSM's centreline of the mill race runs within 16 m, a bank is an old rubble wall dark with damp and moss standing at the water's edge (0.4 m out, not 2 m, as the canal is narrow), with no parapet or walk, and dark ground on top under the bushes of §8.4, which hang over the water.

Changed in M11: OSM's outline of the Čertovka has steps of one to two metres in it, which the walls followed; seen along the canal, a step's wall stood across it as a block (9204). The canal's outline is simplified first (points within 1.6 m of the line their neighbours make are dropped), and a run of wall ends in a slope down to the water instead of a cut end.

### 8.6 Sky, sun, clouds

- Physically based sky from precomputed scattering tables (transmittance, multiple scattering and a sky view table, after Hillaire 2020), tuned per light family (aerosol amount, sky saturation), then graded. Not Hosek-Wilkie or Preetham as first written: both are fitted for the sun above the horizon only and have no twilight, and the flight ends in the blue hour, whose deep blue comes from ozone absorption with the sun below the horizon. The same tables give the sunlight's colour through the air and the haze colour, so sun, sky and haze agree at every hour.
- Sun disc with a soft glare, no lens flare streaks.
- **Clouds**: cumulus as raymarched impostors or layered billboards with proper lighting (lit tops, shaded bases), base 1200 to 1800 m above the river, drifting with a wind of 3 to 8 m/s from the west-south-west. Coverage rolled per session between 5% and 65%. Clouds cast shadows on the city through the shadow map or a projected cloud-shadow texture; the shadow movement is essential. As built: a raymarched layer at half resolution over a 2D coverage map and two tiling 3D noises; shadows come from the same coverage map projected along the sun, so they move with the clouds. The rolled coverage is the afternoon peak: cumulus build through the late morning and thin out after 18:00, so the dawn of §5.3 is clear; by day the coverage shown never leaves 5 to 65%. Changed in M7: after sunset the last of them dissolve, and the sky of the blue hour is clear from 21:45, as it is in 9541, 9542 and 9547. Kept at 5% into the dusk, they hung over the blue-hour hold as dark blobs against the afterglow. Changed in M8, the cumulus' shape, against 9369, 8372 and 8490, where they were cotton balls: a flat, sharp base; a layer 400 to 1,100 m deep instead of 500 to 1,600, and the shape noise wider than tall, as fair-weather cumulus spread more than they tower; billows of 100 to 200 m eroded out of the tops at full strength (the noise had carved them only at its middle values), so the tops are cauliflower; and the folds between the billows darker when the sun is behind the eye, as the thin outer layer has had little light scattered into it. A viewpoint may ask for no cumulus at all, as thirteen of the photographs have none; the flight's sessions still roll 5 to 65%.
- A thin cirrus layer at 50% probability.
- Overcast preset: a continuous stratus layer with visible texture, sun disc hidden, ambient light from a bright grey dome.
- Haze: aerial perspective that desaturates and cools toward the horizon; strength varies by family (strongest in the warm morning, weakest at midday). As built: height fog whose colour is the sky's own colour just above the horizon in that direction (from the sky view table), so distant roofs fade into the sky they stand under, warm toward the sun and cool away from it.

### 8.7 Night

Lights fade in from sun elevation −2° and are fully on by −6°: warm sodium and LED window lights scattered across the core (not every window, about 25%), street lamps along embankments and bridges, floodlights on the Castle, St Vitus, Charles Bridge towers, Týn, National Theatre, Vyšehrad basilica, the Dancing House, the Rudolfinum, and the penguin sculptures on Kampa (9531). Water reflects the lights as broken vertical streaks. Sky keeps a deep blue until 22:30, then near black with a few stars. Stop 18 lands in the blue hour, not full night; during the hold the clock keeps advancing to 22:30 and then stops.

As built in M4 (`src/world/lights.ts` and the building material):

- **Windows**: a fifth of the upper windows and two fifths of the shopfronts, chosen per window, warm, from sodium orange to warm white.
- **Street lamps**: the 5,700 lamps of OSM's register and the lanterns the models carry (Charles Bridge, Legion Bridge's candelabra, Mánes Bridge's pylons, Čechův Bridge's lamps, the railway bridge's walkways) as glowing points. They are drawn into the scene and into the river's mirror, where the ripples draw them out into broken streaks, longer at night. Their light on the ground and the lowest storeys comes from pools baked once at load into a 2048² texture over the photographed city: 4 km, 2 m a texel.
- **Floodlights**: every modelled landmark, and the landmarks still standing as OSM massing, lit sodium-amber from below, strongest on the walls and near the ground.
- **Exposure and colour**: after dark the photographs are exposed for the lights, so the meter's base puts the horizon at 7% instead of 24%, and the sky goes deep. The blue-hour white balance is cooled to the photographs' daylight setting, which turns twilight blue. The light-pollution glow of M1 is a third as strong.
- **Fix**: shadow maps are rendered once even at night. The materials sample them, and a view opened after dark drew no city at all.
- Not yet: the penguins on Kampa (9531).

Changed in M8: the floodlights and lit windows are a deeper orange and the floodlights a third brighter. The blue hour's cooler white balance (§5.3) had turned them cream, where 9542 shows sodium through a daylight balance.

### 8.8 City life

| Actor | Where | Behaviour |
|---|---|---|
| Trams | Real tram lines: Legion Bridge (9, 22, 23), Masaryk and Rašín embankments (17), Malá Strana Újezd to Malostranská (12, 20, 22), Wenceslas Square top, Čechův and Štefánik bridges | Two liveries: red-and-cream Tatra T3 (most), and the newer 15T. Speed 30 km/h, stops at real stops for 10 s, headway about 90 s per line. Pantograph and overhead wire poles. |
| Tour boats | Vltava, Palacký Bridge to Čechův Bridge | White, 20 to 35 m, slow, wake, two or three at a time. |
| Pedal boats | Between Legion Bridge and Charles Bridge | Small white and pastel, meandering, up to 12. |
| Rowing eights | Below the Šítkov weir, morning only | Fast, straight lines, wakes. |
| Swans | Kampa, below Charles Bridge, Náplavka | Groups of 3 to 8, drifting, occasionally flapping. |
| Pigeons | Embankments, Old Town Square | Ground flocks that lift when the drone passes below 25 m. |
| People | Charles Bridge, Old Town Square, Kampa, Náplavka, Petřín paths | Crowd particles: simple capsule figures in muted clothing colours, walking. Density by hour: sparse before 09:00, dense 12:00 to 18:00. No faces, no animation detail. |
| Cars | Embankment roads only | Sparse, 40 km/h, no headlights until dusk. |
| Cranes | None. | |

Life is silent; the app has no audio (§10.3).

As built in M6 (`tools/lib/life.ts` lays it out into `life.bin`; `src/life/` moves it):

- **One clock.** Everything moves on the seconds since the city loaded, at the same pace whatever the flight's speed; the flight's hour sets how many people are out, whether the rowers are on the water and whether the lamps are lit. Trams, tour boats, rowers, people and cars are placed by that clock alone; the pedal boats and swans steer themselves and are stepped forward. A viewpoint (§12.1) shows a fixed moment, its `life` in seconds.
- **Trams** run on every day line's route through the world, both directions, from OSM's route relations (variants dropped), not only the lines the table names: a manual flight can go anywhere, and those lines alone would leave most of the network's streets empty. Every 3 m of a run carries the time a tram takes to reach it: 30 km/h, slower in curves (0.9 m/s² sideways), braking and pulling away at 1 m/s², 10 s at each of OSM's 1,160 stop positions on the runs. **Deviation:** a tram of each line leaves every 180 s, not 90 s: with all 25 lines running, most streets of the centre carry two to five of them, and 90 s a line put a tram every 20 s on Národní and Karmelitská, a queue; 180 s gives one every 36 to 90 s each way on the photographed streets and on Legion Bridge. Each run's phase is chosen, longest first, in the widest gap the runs already placed leave on the track they share, so trams of different lines keep at least 11 s apart. A third are 15T (three sections, red below, white above a black window band), the rest Tatra T3, most as coupled pairs (red and cream, cream roof), each car following the curve between its bogies; their windows glow after dusk and their headlights show.
- **The overhead wire**: a contact wire 5.6 m over every track, drawn as a line within 450 m, and 5,300 poles with brackets, every 30 m on the outside of each track, left out on bridges (their lamps carry it), in the river and where a house stands (the wire hangs from its wall).
- **Tour boats** (four) on circuits in the pools between the weirs: from the railway bridge past Palacký Bridge up to the Šítkov weir, round Legion Bridge, and two from Charles Bridge down past Čechův Bridge; they turn short of the weirs instead of passing the locks. Sixteen more are moored at Náplavka, the Smíchov quay opposite, and the cruise quays below Čechův Bridge, in three kinds: white with a sun deck, an old steamer with a dark hull and a funnel, a long glass restaurant boat. **Pedal boats** (twelve) meander between Legion Bridge and the Old Town weir, the stretch above Charles Bridge the photographs show them on; they wander, rest, keep off each other and steer by the distance to the bank laid over the river at 5 m, where the weirs count as bank. The rest are tied up at the pontoon on Střelecký island, and all of them after 21:30. **Rowing eights** (two) run lengths **above** the Šítkov weir, between it and Vyšehrad, from 05:30 to 10:30: **deviation**, the table's "below" meant south on the map, which is upstream, where stop 2 sees them and the rowing clubs are. Moving boats draw a wake, the arms of a V at 19.5° and the wash behind the stern. Everything afloat sits on the level the water is drawn at, which the build ships with the bank distances.
- **Swans**: groups of 5, 7 and 4 off Kampa, below Charles Bridge on the Malá Strana side and at Náplavka, drifting within 22 m of their spot, now and then raising their wings.
- **Pigeons**: seven flocks of 16 to 34 on Old Town Square, Náplavka, the Kampa riverside and the Old Town quay. When the drone comes down below 25 m within 35 m of a flock, it lifts: each bird climbs to its own circle 5 to 15 m up, wheels round for 14 to 23 s and lands.
- **People**: up to 1,900 figures (legs, a torso in one of fifteen muted summer colours, a head) walking to and fro on 276 paths: Charles Bridge on its deck, straight walks across Old Town Square, the paths of Kampa and of Petřín's gardens, the quays, and **added**, the Royal Route's lanes between the bridge and the square (Karlova, Celetná, Mostecká), which the photographs show as full as the square; about one in six stands. The share out follows the hour: 6% at night, 40% at nine, all from noon to six, two thirds at nine in the evening; the quays stay busy into the evening, Petřín empties.
- **Cars**: one every 17 s or so on each lane of the embankment roads, 40 km/h, in ten muted paints, pushed to the sides of the road where trams run in its middle; headlights and tail lights once the city's lights are on.
- **Night**: the windows of trams, boats and cars glow with the city's lights, and their lamps are points like the street lamps', streaked in the river's mirror. Trams, boats and cars are drawn into the mirror; trams, boats, cars and poles cast shadows.

### 8.9 Palette

Sampled from the set with k-means on the reference frames, then rounded. Use as material base colours before the grade, so the grade produces the photographed colours. Hex values are sRGB.

| Use | Values |
|---|---|
| Terracotta roofs | `#a46d54` `#b5714f` `#8f5a42` `#c08063` `#9c6a50` `#b87a5c` |
| Slate and grey roofs | `#5e5d55` `#6d6a62` `#4a4d52` |
| Copper roofs and domes | `#5f8a7a` `#6f9a88` |
| Plaster, Malá Strana | `#eaccb3` `#dc9d64` `#cb7655` `#d8b08a` `#e8d6c4` `#c9b79c` |
| Plaster, Old Town and embankments | `#e4dddd` `#f2e6da` `#d9c9a8` `#e8d6c4` `#b2c6d8` `#e9c9c6` (the pink of 8628) |
| Sandstone, Charles Bridge | `#8a8074` `#6f675c` `#a39584` |
| Cobbles | `#6b6660` `#7a7468` |
| River, cumulus midday | `#485e6d` `#5c7488` |
| River, warm evening | `#374954` `#2d3c43` |
| River, overcast | `#9ea4af` `#b5b8c5` |
| Foliage | `#54644e` `#44533b` `#5f7a4a` `#354835` `#6b8552` |
| Meadow grass | `#8a9a5a` `#a69f94` |
| Sky zenith, day | `#4f7396` |
| Sky horizon, morning | `#e9ded5` |
| Sky horizon, day | `#c9d3d6` |
| Sky, blue hour | `#376ba3` `#1f3247` |
| Tram red | `#c8352a` with cream `#f2ede6` |
| Rose red, geranium red | `#c8322a` `#b03040` |

As built in M2: from the air Malá Strana reads whiter than its street-level ochres, so its light plasters weigh double; the Old Town's pale blue and pink are accents at one in eleven; the 19th-century districts have their own list of creams, sandstone yellows and light greys, and post-war buildings a list of greys. In the 19th-century districts and beyond, slate is a quarter of the roofs, not a third.

---

## 9. The drone and the auto route

### 9.1 Manual controls

The drone always cruises forward; the user steers. Keys:

| Key | Action |
|---|---|
| ← → | Yaw, 45°/s with ease-in and ease-out, banking up to 12° |
| ↑ ↓ | Climb and descend, 20 m/s |
| Shift | Fast cruise, 60 m/s (default cruise 22 m/s) |
| Space | Hover (cruise to zero, hold) |
| W S | Camera tilt, −60° to +20° |
| A D | Strafe, 15 m/s |
| Enter | Return to auto mode |
| G | Grade on/off (developer) |
| C | Reseed clouds |

Constraints: altitude 15 to 600 m above ground; a soft repulsion keeps the drone 12 m clear of buildings and landmarks (no collision, it slides over); world bounds at the outer ring with a gentle turn-back.

Any arrow, A, D or Space press leaves auto mode instantly and hands control over at the current position and heading. Enter returns to auto: the drone flies a 3-second blend to the nearest point on the route and resumes from there.

### 9.2 Auto route

Total 360 s (fast mode: identical path and gaze at 2× speed, 180 s). Time of day advances from 06:20 to 21:45 over the flight unless the user has moved the slider, in which case the flight holds that hour. Camera moves on a Catmull-Rom spline through the stop positions; gaze follows a second spline through the gaze targets; both eased. Positions in the §6.1 frame, altitude above the river.

| # | Stop | t (s) | Clock | Position x, north, alt | Gaze x, north, alt | Lens | Move |
|---|---|---|---|---|---|---|---|
| 1 | Vyšehrad, take-off | 0 | 06:20 | 420, −2500, 183 | 110, −1341, 14 | wide | The cover frame (§10.2): above the north edge of the rock, the river leading north to the bridges, the Old Town on the right, the Castle on the horizon. Hold 4 s, then start north |
| 2 | Down the Vltava | 20 | 07:15 | 250, −2000, 200 | 100, −1250, 12 | wide | Descend along the river, railway bridge and Palacký bridge below, rowers |
| 3 | Dancing House | 40 | 08:05 | 330, −1500, 130 | 215, −1215, 30 | long → wide | Approach, half orbit at 100 m radius, a tram passes |
| 4 | National Theatre, Legion Bridge | 58 | 08:55 | 260, −900, 115 | 157, −600, 20 | wide | Pass the golden roof, cross the island, tram on the bridge |
| 5 | Petřín, the climb | 74 | 09:40 | −450, −720, 190 | −1173, −334, 90 | wide | Rise over orchards and meadows |
| 6 | Petřín, rose garden and tower | 90 | 10:20 | −1120, −640, 260 | −1137, −445, 60 | wide | Circle the tower; on the north side the panorama viewpoint of 7924 to 7944 |
| 7 | The Castle ridge | 108 | 11:10 | −1360, 150, 330 | −751, 489, 120 | long | Sweep along the ridge with St Vitus filling the long lens |
| 8 | Malá Strana roofs | 126 | 12:00 | −640, 440, 210 | −325, 89, 40 | wide | Drop over dormers and chimneys to the dome and the bridge towers |
| 9 | Charles Bridge, low pass | 144 | 12:45 | −230, 63, 35 | 157, −40, 30 | wide | One slow pass along the bridge just above the statues, boats and swans below |
| 10 | Kampa, Čertovka | 162 | 13:35 | 60, −250, 90 | −243, −167, 10 | wide | Turn back over Kampa, the mill channel, the weir |
| 11 | Old Town Square, orbit | 178 | 14:15 | 560, −40, 150 | 808, 122, 60 | long | Rise to the Týn towers, begin an orbit |
| 12 | Old Town Square, orbit | 192 | 14:55 | 900, 240, 150 | 808, 122, 60 | long | Continue, clock tower in view |
| 13 | Old Town Square, orbit | 204 | 15:25 | 700, 340, 140 | 808, 122, 60 | wide | Complete the orbit, leave toward Josefov |
| 14 | Josefov to Mánes Bridge | 218 | 16:05 | 450, 520, 175 | −500, 400, 60 | wide | Rooftops down to the river, then the Castle and the Malá Strana waterfront across the water |
| 15 | Wenceslas Square | 240 | 17:05 | 1100, −640, 230 | 1344, −856, 40 | long | Over the middle of the square looking up to the museum end, trams crossing the top |
| 16 | The bridges from Letná | 268 | 18:20 | 330, 960, 300 | 0, 0, 20 | long → wide | Wide and high, all the bridges in one frame, late light |
| 17 | Back up the river | 302 | 19:50 | 240, −1250, 260 | 458, −2446, 60 | wide | Golden hour along the embankments toward Vyšehrad |
| 18 | Vyšehrad, blue hour | 345 | 21:45 | 700, −2950, 280 | 138, −1559, 69 | wide | Round the basilica and arrive above the ramparts as the lights come on, looking down the river to the bridges and the Castle in the afterglow, and hold |

Leg speeds run from about 20 m/s in the Old Town orbit to about 65 m/s on the long sweeps from Wenceslas Square to Letná and from Letná back up the river; the sweeps are high and wide, so the ground speed reads as a glide. The last leg has 43 s so that the arrival slows down.

The spline is timed: each stop is a knot at its time `t`, knot velocities are the three-point derivative (zero at the first and last stop), and altitude uses monotone tangents so the drone never sinks below a low stop between two higher ones. Where the route doubles back (stops 12, 14, 15) the drone nearly stops and the next leg peaks near 90 m/s at 200 to 300 m up; `tools/check-route.ts` prints the timeline. Stops 8 and 9 were moved on 2026-09-25 when the Lesser Town Bridge Towers turned out to stand 78 m north of their first coordinate (§6.2): stop 8 now looks at the towers, and stop 9 sits above the bridge deck 100 m east of them, over Kampa, so the descent passes north of the towers rather than through them, looking down the bridge to the Old Town tower. Stops 1 and 2 were moved on 2026-09-26 when stop 1 became the cover (§10.2): the take-off had been 340 m up looking steeply down at the fortress, and now sits 183 m above the north edge of the rock looking down the river at 8° below the horizon; stop 2 moved 300 m on so the first leg keeps its pace.

**Via knots (M7).** Between some stops the splines run through knots that are not stops (`"via": true` in `data/route.json`, no number, no name, no clock of their own). They were added on 2026-09-26 because a spline of gaze targets turns the camera violently wherever the gaze target passes under the drone: the camera pitched to straight down and swung round in half a second. Measured on the camera's yaw every 0.1 s (`tools/check-route.ts` prints the route; the yaw was checked with the same splines):

- **The turn back over Kampa** (between stops 9 and 10) flipped over at 153 s, 1,400°/s for a frame. A knot at 153 s turns the view through the south, up the river toward Legion Bridge and Střelecký island, then round to Kampa: 14°/s at most.
- **The Old Town Square orbit** was a fly-over: stops 11 (south-west of Týn) and 12 (north-east) are joined by a nearly straight line across the towers, and the camera flipped at 187 s. Two knots on a circle round Týn, south at 265 m and east at 205 m, make it the orbit the table describes, counter-clockwise, Týn in the middle of the long lens all the way (13 to 15°/s). A knot at 168 s pans the view across the rooftops to the north on the way in, instead of swinging past a gaze target 130 m away.
- **Josefov to Wenceslas Square** (stops 14 to 15): the drone pulls back from the Castle view, flying backwards, and then swung round 125° in four seconds. A knot at 231 s turns it left through the south, the New Town's roofs, over eight seconds (15°/s).
- **The last leg** passes round the west and south of the basilica with the gaze on its towers (a knot at 324 s, 400 m out over the river), then lifts the gaze from the towers to the city as the drone settles above the ramparts. Stop 18 moved from 380 m up looking 34° down onto the dark rock (the M4 gap) to 280 m up looking 8° down the river: the ramparts and the lit houses of Vyšehrad in front, the river of lights and the bridges leading to the floodlit Castle on the horizon, the afterglow above it. It echoes the cover at dawn, the same river from nearly the same place.

With the knots the camera turns at 22°/s at the most, against 45°/s for the arrows in manual flight; the top speed went from 94.6 to 99.8 m/s, on the high sweep to Letná.

The route does not loop. At stop 18 the drone holds above Vyšehrad in the blue hour, drifting very slowly, clouds and river still moving, until the user presses a key. Arrows hand over manual control there; Enter restarts the flight from stop 1 at dawn. Fast mode uses the same table with `t / 2`.

---

## 10. Interface

### 10.1 Screen

Nearly nothing. The render fills the window. Elements:

- Top left: the word PRAHA, a one-line subtitle, and a mode chip (AUTO 6:00, FAST 3:00, MANUAL).
- Top right: the clock, sun elevation, cloud coverage, altitude. Small, tabular numbers.
- Bottom centre: the landmark name in Czech with a one-line English subtitle, fading in as the drone approaches and out as it leaves.
- Bottom: a thin time-of-day slider with a checkbox "day advances with flight", mode buttons, and a key hint that hides after 20 s.
- The cover on load (§10.2): the drone's first view under three lines of small capitals, "click to fly". The route waits at its start under the cover, drifting, and continues from it without a cut when the cover lifts.
- Bottom right, very small: the data attribution (OpenStreetMap contributors, ČÚZK), which the licences require.

Typography: a neutral grotesk (Helvetica Neue or Inter), letter-spaced small caps for labels, white at 90% with a soft shadow. Accent colour is a warm gold `#f0c26a`, used only for the mode chip and the slider thumb.

### 10.2 The cover and loading

The app opens on the cover: the drone's own first view, stop 1 of the route, held and slowly drifting, with three lines of small capitals in the lower left corner. The picture is the cover; the words are a caption. Decided on 2026-09-26 (§14) over the alternative of the Petřín evening panorama with a fade to the dawn take-off.

- **The picture.** Stop 1 (§9.2): 183 m above the north edge of Vyšehrad at 06:20, looking down the river to the bridges, the Old Town on the right, the Castle on the horizon in the dawn haze. The route waits at its start under the cover, so a slow click never misses stops 1 and 2. The drone drifts as it does in the blue-hour hold, the clouds move, the river moves. No blur and no panel over the city; only a faint darkening along the bottom edge, so the words read.
- **The words.** Bottom left, the HUD's grotesk, letter-spaced capitals, white at 90% with the soft shadow: PRAHA at about 44 px on a 1800 px window, EARLY SUMMER · FROM THE AIR in the dim white, and CLICK TO FLY in the gold, breathing slowly. The HUD is hidden under the cover.
- **Loading.** The words appear first on the dark ground (`#0b1016`), the third line reading LOADING THE CITY. When the first frame is drawn the picture fades in beneath the words over 1.5 s; the words do not move. When the tiles are in (or 6 s after the first frame) the third line becomes CLICK TO FLY. A click during loading flies anyway.
- **The lift.** On a click or any key the words fade over 1 s and the darkening over 1.5 s; the HUD fades in over 2 s, starting a second later; the drift settles over a second and the route starts, holding its 4 s at stop 1 and then heading north. Arrows on the cover take over manually, as they do anywhere.
- Development URLs with `view`, `t` or `manual` skip the cover.

Under 8 s on a fast connection: a first frame with terrain, river, sky and Tier 3 blocks appears within 3 s; Tier 2 roofs and Tier 1 landmarks stream in over the next 5 s while the drone is still high above Vyšehrad, where detail is small. Textures load progressive. Total transfer budget 60 MB, cached.

As built in M7: the world loads in two parts. The first frame needs only the terrain, the clearance grid, the land use, the horizon and the river (8.5 MB), fetched first on the whole connection; the building tiles then stream from the workers nearest first, and the streets and their lamps, the landmarks, the trees and the city's life (8.6 MB) follow, each added to the scene once its data is in and its shaders are compiled, in parallel where the driver can (`World.stream`). Measured with `tools/motion.ts load` on the production build over a 100 Mbit/s connection with a 20 ms round trip, cache off, in headless Chrome on the M2: the first frame at 1.6 s, the streamed parts in at 2.3 to 2.5 s, the last tile at 3.4 to 3.6 s; 23.5 MB transferred, of 60 MB allowed. Before the split everything was fetched at once and built before the first frame, which came at 2.9 to 3.1 s. The app marks the moments (`praha:world`, `praha:first-frame`, `praha:streamed`, `praha:city` in the performance timeline).

### 10.3 Audio

None. The app is silent. No audio assets, no speaker control.

---

## 11. Technology

| Layer | Choice | Why |
|---|---|---|
| Language and build | TypeScript, Vite | Fast iteration, static output |
| Renderer | Three.js, WebGL2, with the WebGPU renderer as a later option | Mature, well-understood, instancing and post pipeline available |
| Post | Own full-screen passes: render, TAA, meter, filmic tonemap, LUT grade, vignette and grain. Ambient occlusion (M2) at half resolution from the depth buffer; the next frame's materials reproject into it and dim only the sky's light, so a sunlit street stays sunlit and a shaded courtyard goes dark | §5.2 |
| World data | Prebuilt binary tiles under `public/world/`, gzip | No runtime API calls |
| Landmarks | Modelled in code on their OSM footprints (`tools/landmarks/`), packed as finished meshes into `landmarks.bin`, drawn with the building material | §7.1, which says why not Blender and glTF |
| Roofs | Straight skeletons at build time (CGAL through the `straight-skeleton` package, WebAssembly, a development dependency only); the tiles carry the finished roof faces and the props, and the tile workers make the meshes | §8.1; roofs from footprints at runtime would cost the loading budget |
| Instancing | InstancedMesh for buildings (grouped by district and material), trees, props, people. As built in M5: the trees are instanced geometry with their own attributes, the near set in fifteen meshes (three levels of detail, five kinds) rewritten as the drone moves, and a sprite mesh per kilometre tile | Draw call budget under 600 |
| Shadows | Cascaded shadow maps for buildings from three.js's `SunLight` (2 cascades of 2048 to 2.8 km), a heightfield shadow for the terrain computed on the GPU when the sun moves, and the cloud-shadow projection | Long morning shadows need reach. As built in M1: three r186 ships a two-cascade sun; 4096 cascades cost a millisecond more on an M2 for little visible gain. Hills shading the city (Petřín in the evening) come from the heightfield at any distance and softly; terrain in the cascades cost 3 ms a frame |
| Reflections | Planar reflection for the river. As built in M4: at 40% resolution, every other frame, within 2.2 km, the sky and clouds computed by the water shader (§8.5) | The evening frames depend on it |
| Hosting | Static, any CDN | No backend |

Performance targets: 60 fps at 2560 × 1600 on an M1 Pro or better in Chrome and Safari; 30 fps floor on an Intel MacBook with integrated graphics with a "lite" preset (no SSAO, half-res reflections, fewer clouds). Memory under 1.5 GB.

Changed on 2026-09-26, after the M11 sheet (§14, the detail programme): the budget rises for M12 to M17. On the build machine (an Apple M2 at 2048 × 1536) the route may take up to 25 ms a frame (40 fps), the governor covering the rest; 60 fps is the figure for an M1 Pro, M2 Pro or better. Lite keeps its 30 fps floor by leaving out the relief of §8.2 and the landmarks' fine tier (§7.1). The world may grow to 60 MB (`landmarks.bin` to about 25 MB), and the user allows up to 300 MB where the detail needs it (2026-09-26); the build stays as small as the detail allows, since loading (§10.2) is what the user waits for. Memory to 2.5 GB. The landmarks may carry 2 to 3 million triangles in all, at most about a million of them in the fine tier in view; the relief about 700 triangles a house within 300 m. Every milestone is still measured against the previous world (`?world=`) and no pair of the sheet may get worse.

As built in M7 (`src/render/quality.ts`): integrated and software GPUs (Intel, Iris, UHD, SwiftShader by the renderer's name) start on lite, everything else on full; `?quality=lite` or `full` forces one. Most of the frame is geometry (5 to 7 million triangles across the view, the shadow cascades and the mirror), so lite cuts geometry as well as pixels:

| | full | lite |
|---|---|---|
| Pixels, most | 4.2 M | 1.7 M |
| Ambient occlusion | on | off |
| Mirror | 40% of the frame, to 2.2 km | 20%, to 1.3 km |
| Cumulus | half resolution, the session's coverage | a third, at most 40% |
| Sun shadows | 2 × 2048 to 2.8 km | 2 × 1024 to 1.4 km |
| Far trees (sprites) cast shadows | yes | no |
| Roof and landmark detail | to 1.6 km | to 0.9 km |

On top of either a governor sets the render scale from the frame interval: down within a few seconds while frames are slower than the preset's target (60 fps on full, 30 on lite), to 72% of each side on full and 60% on lite; back up only by probing, one step after 20 s of good frames, undone if the frames slow again and then tried half as often, since at the display's rate a frame with time to spare and one without look alike. A full session still under 40 fps after six seconds at its lowest scale goes lite. Each change of scale rebuilds the render targets, a frame of about 70 ms, so the governor steps rarely. `?scale=1` fixes the scale (the measuring tools use it); viewpoints never scale.

Repository layout:

```
design.md            this document
Photos/              the reference set (422) and _excluded/
mockup/              index.html (3D sketch), plan.html (set + route), set/ thumbnails
data/                hero.json (starred frames), viewpoints.json, route.json, palette.json, landmarks.json
tools/               fetch-data.ts, build-world.ts, check-route.ts, find-landmarks.ts, make-lut.ts, lut-fit.ts, compare.ts, sheet.ts, motion.ts;
                     lib/ grade.ts (the Classic Negative parameters, shared by make-lut and lut-fit), png.ts, roofs.ts, skeleton.ts, props.ts, plan.ts (+ plan-worker.ts), districts.ts, river.ts, trees.ts, walls.ts, life.ts,
                     chrome.ts (headless Chrome for compare and motion);
                     landmarks/ kit.ts, index.ts, parts.ts, bridges.ts, and one module per landmark or group (§7.1)
cache/               raw downloads from fetch-data.ts (generated, git-ignored)
assets/              lut/classic-neg.cube, lut/classic-neg.params.json (the refined parameters and each pair's statistics)
src/                 app: core/ (incl. buildings.ts, trees.ts and life.ts, shared with the build), world/ (terrain, tiles, buildings
                     and their material, landmarks, streets, water, lights, trees, blooms), sky/ (atmosphere, families, clouds, shadows),
                     render/ (post, the river's mirror, the quality presets), life/ (trams, the river's boats and swans, people, pigeons, cars), drone/, ui/,
                     dev/ (side-by-side, development only)
public/world/        built tiles (generated, git-ignored)
compare/             side-by-side sheets from tools/compare.ts, fit/ for lut-fit.ts, sheet/ the final sheet (generated, git-ignored)
```

---

## 12. Acceptance tests

### 12.1 The side-by-side

For each hero frame in `data/hero.json`:

1. A viewpoint record: camera position, heading, tilt, focal length in 35 mm equivalent read from the frame's EXIF (any value between 24 and 83, not the flight's two lenses), clock time, weather preset. Authored once by hand in the offline tool by lining the render up with the photograph, then saved to `data/viewpoints.json`.
2. `tools/compare.ts` renders the viewpoint headless and writes `compare/<frame>.png` with the photograph on the left, the render on the right, and a 50% blend below.
3. The user judges each pair on three questions: same silhouette, same colours, same light mood. Each is pass or fail. A build is accepted when every hero frame passes all three.

As built in M1: in development, `/?view=<id>` opens the app at a viewpoint (camera, lens, clock and a fixed cloud seed, at the photograph's 3:2 aspect, without the interface), and `praha.sheet()` in the console writes the sheet through the dev server. `npm run compare [ids]` does the same for every viewpoint in headless Chrome on the GPU, about 10 s a frame. Clock times are EXIF plus one hour (§3.1). Neither path reaches the production build.

Added in M2, for lining up and tuning: a viewpoint can be nudged from the URL (`/?view=8385&heading=10&agl=14`, or `npm run compare -- 8385@heading=10,agl=14`, written to its own file), a light family's values forced (`&light.haze=0.05&light.wb=0.98:1:1.05`), and the grade or the occlusion turned off (`&grade=0`, `&ao=0`; keys G and O).

Added in M3: `/?view=look&x=…&north=…&agl=…&heading=…&tilt=…&focal35=…` is a free camera for inspecting the world, and `npm run compare -- look@x=…,north=…` writes the render alone; the weather can be nudged like the camera (`&coverage=0.9&overcast=0`); portrait frames take the 24 mm side of the frame as their width. The viewpoints of 8704, 8607, 8942 and 8753 were solved from the photographs: the bearings (and, for 8607, the heights) of spires and towers whose positions OSM gives. 8704 turned out to be taken from Mánes Bridge, 8607 from below the astronomical clock, 8942 from the mouth of Mostecká on the lower square, 8753 from the gardens below Strahov.

Added in M4: a viewpoint may give the eye's height `y` instead of `agl`, for views from bridges and over the water. The new viewpoints were solved the same way: 9486 from the piers of Charles Bridge (to 0.03°), on the Letná slope above the Edvard Beneš embankment; 8490 and 9542, like 9547, from Legion Bridge; 8809 from the north parapet of Charles Bridge near the Old Town end (the four spires of St Vitus fix only the bearing; the height of the far bank's waterline fixed the rest); 8158 on Jiráskovo náměstí, placed so Ginger and Fred stand at their sizes in the frame. Overcast views are exposed with the deck as the sky, nearly white as in the photographs; M3's 8942 is brighter for it.

Added in M6: a viewpoint may give `life`, the seconds of city life it shows (60 unless given), and `&life=` sets it for any view; the frame is still while it is judged. Tram times are found from the timetable, which the clock alone sets: 8158 at 74 s has a 15T in front of the Dancing House (every 180 s, the headway, the same), 8942 at 32 s a T3 pair crossing Malostranské náměstí, 9486 at 60 s a tour boat below Mánes Bridge.

Added in M5: 8725 was taken in the Seminary garden, looking up at the gloriette of the Schönborn garden (the US Embassy's flag on it gives it away); its size in the frame puts the camera 147 m from it, and the street lamp at the right edge, 10 m away and 35° from it, with OSM's paths fixes the rest. 8722 is a close-up of single roses at 64 mm, which the world cannot give: its viewpoint is a rose bed near the Petřín tower, low and 5 m from the bushes, with the sky behind and the sun behind the camera, and it is judged on its colours and light. 9369's camera moved 200 m across the Letná lawn: at its M1 place it now stands in a grove.

Added in M8: viewpoints for the last eleven hero frames, so all thirty are on the sheet. Where landmarks show they were solved as before, and four of the hero list's descriptions turned out wrong (§3.3 is corrected). 8683 is from the Alšovo embankment 75 m south of Mánes Bridge, not the Smetana embankment: St Francis's dome, the Old Town Bridge Tower and the water tower on Novotného lávka fix it exactly. 8849 looks from Legion Bridge downstream at Charles Bridge, not the other way. 8825 is at the head of the Old Town weir below Novotného lávka, looking past the lávka's willow at the Castle. 8988 is from the Smíchov bank at the water, below Jiráskův Bridge, looking at the Dancing House and the Rašín embankment. 8608 was taken a few metres from 8607, below the astronomical clock (the Kinský palace, the Stone Bell, the Marian column and Týn). 8903 stands on Charles Bridge 80 m short of the Lesser Town towers. Where nothing fixes the frame, the same kind of view: 8440 from Střelecký island at Legion Bridge's western arm, 8884 over Kampa's roofs from Charles Bridge, 9204 on the footbridge over the Čertovka, looking along it. 8082 and 8777 are street close-ups the world does not give (§4, nothing below about 8 m); their viewpoints stand in Nerudova, a street of the same kind in the same light, and like 8722 they are judged on colours and light. 8158's camera moved 5 m, from behind the end of Jiráskův Bridge's parapet, which filled the lower half of the frame, onto the roadway of the square, and turned 7° to frame the Dancing House as the photograph does; it shows no tram, as the world's track passes within 10 m of the lens there, where the photograph's tram runs along the foot of the building. A viewpoint's weather may set a coverage of 0 (no cumulus, as in thirteen of the photographs) and `light`, the day's own air where it differs from the family's (9486 and 8753 were hazier). `npm run compare -- --fit` also writes what `tools/lut-fit.ts` reads (§12.3), and `node tools/sheet.ts` makes the final sheet from it: `compare/sheet/index.html`, every pair with the three questions to click pass or fail, kept in the browser, and a button that copies the verdicts.

Changed in M9: two of the guessed views moved to where their photographs' content is. 9204 looked along the Čertovka between houses; it now stands over the canal's tree-lined stretch beside Kampa park, 5 m above the water, looking up the canal toward the mill. 8440 looked north at Legion Bridge with the Castle behind it; the photograph has the arches next to Střelecký island and a wooded slope behind them, so it now looks west-north-west from the east bank 90 m south of the bridge, with the photograph's 83 mm lens, 8 m above the water.

Changed in M10: 8722 stands among the rose beds 0.65 m above the ground, a few decimetres from a bush's blooms, with the photograph's 64 mm lens, looking west at them against the sky. A viewpoint may set the camera's near plane (`near`, 0.05 m for 8722; the app's is 3 m), which the reversed float depth buffer allows without loss of precision; the crowns' cut near the lens follows it.

Changed in M11: 8082 moved 18 m down Nerudova and across to its north pavement, beside the sunlit baroque fronts, looking west along them with the other side in shade, as the photograph was taken; at its M10 place on the south side the camera looked across the whole width of the street. 8777 moved to the upper square of Malostranské náměstí, where OSM has a three-lantern candelabrum: the camera stands 12 m from it with the photograph's 66 mm lens, looking at the pale pink front with salmon surrounds behind it, the lamp in the left third; on Nerudova no candelabrum stands before a sunlit front. A viewpoint may give a focus distance and an f-number at the 35 mm equivalent (`focus`, `fstop`), for its depth of field (§5.5): 8722 has 0.9 m at f/4.

### 12.2 Motion tests

- Fly the full auto route at 1× and 2× with no hitches over 33 ms.
- Fly manually for 5 minutes at Shift speed around the core without leaving the world or clipping through geometry.
- Reseed clouds 20 times: coverage stays within 5 to 65%, and cloud shadows always move.
- Slide time from 04:30 to 23:00 continuously: no popping of lights, sky or grade.

As built in M7, `tools/motion.ts` runs each of them in headless Chrome on the GPU, on a dev server of its own (the page must not reload when the source is edited during a six-minute run):

- **route 1** and **route 2** fly the auto route in real time from stop 1 to the hold and record every frame's interval and the main thread's work in it; a hitch is an interval over 33 ms. The interval also carries the GPU's time and whatever else the machine's GPU is doing, so the main thread's share is reported apart.
- **manual** flies five minutes at Shift speed, simulated at 60 Hz without drawing: a key held at random for one to four seconds (turns, climbs, descents three times as often as climbs, strafes, tilts), turned back toward Charles Bridge past 1.6 km. It passes if the drone never comes within the camera's near plane (3 m) of the clearance grid (ground, water, roofs, decks, landmarks) and never leaves the world.
- **clouds** reseeds twenty times and reads each session's peak coverage, the coverage drawn at 14:00 and how far the shadows moved in a second.
- **clock** slides the clock from 04:30 to 23:00 over 3,600 frames (a third of a minute each) at a stop and reads the frame's brightness in rows across the sky and the city; a pop is a step unlike the steps either side of it.
### 12.3 Colour statistics (assistive, not a gate)

For each hero pair, compute Lab histograms of the photograph and the render, excluding sky masks, and report ΔE between the dominant clusters. Used by `tools/lut-fit.ts` to refine the LUT and reported in the compare sheet. Not a gate, because composition differences move the numbers; the human judgement in §12.1 is the gate.

As built in M8 (`tools/lut-fit.ts`):

- **What it reads.** `npm run compare -- --fit` renders each viewpoint three more times: as the image enters the LUT (after the exposure, white balance, saturation and filmic curve), the sky's mask from the depth buffer, and the photograph drawn at the render's size, with what the final pass does after the LUT (the family's contrast and lift, the vignette). Nothing of it reaches the app.
- **The photograph's sky** is grown from the top of the frame through smooth, bright pixels of sky colour, taking cumulus across their edges, and only where the render has sky within a tenth of the frame's width, so smooth blue water is not taken for it (8849). The skies are compared only where render and photograph show about as much of it.
- **What it compares**, city and sky apart, in OKLab: lightness at five percentiles, the share, chroma and hue of each of twelve hue sectors, and the tint of the near-greys in shadow and in highlight. OKLab instead of CIELAB throughout, as the grade itself is built in it; the ΔE reported between the five dominant k-means clusters of each pair is the OKLab distance × 100, near CIELAB's scale.
- **The fit.** Eighteen of the grade's parameters are moved by coordinate descent to make the graded render's statistics like the photograph's, over all thirty frames; the render's pixels are gathered by colour first, so a candidate grade costs a few milliseconds. A frame's mismatch counts in full up to a point and only logarithmically beyond, so a frame whose composition differs (the roses of 8722, the Čertovka's trees in 9204) cannot pull the grade alone. The parameters are held toward the hand authoring, and two are bounded where the statistics and the eye disagreed: highlights may warm toward yellow but hardly toward pink (the overcast decks went rose), and the blues may be lightened only a little (the evening frames ask for it, the deep afternoon skies of 8607 and 9369 for the opposite). Night frames count half: the lamps and the exposure make them, not the grade.
- **What it cannot fix** it measures all the same, and M8 fixed those in the world first (§5.3, §8.4 to §8.7): the evening sky two stops dark, the grey river, the pink blue-hour band, the cream overcast, the black trees against the sky.

### 12.4 Read-back checklist for the drone view

Someone who knows the photographs looks at a 60-second clip of the auto route and answers:

- Would I recognise this as Prague in the first 5 seconds? Which landmark told me?
- Do the roofs look like the roofs in 7924? Not "red boxes", but a varied, weathered, chimneyed roofscape.
- Is the sky the muted cyan of Classic Negative, not a stock blue?
- Are the greens olive, not lime?
- Is the water the colour it is in the photographs at this hour?
- Is anything moving? Trams, boats, birds, cloud shadows.
- Does it feel like early summer, not August?

---

## 13. Milestones

Each milestone ends with a build the user can fly. Effort is the implementer's; the set is the reference at every step.

| M | Deliverable | Accept when |
|---|---|---|
| M0 | Data pipeline: OSM, DEM, water, parks fetched and built to tiles; terrain, river, Tier 3 blocks, sun and a plain sky; the auto route flies; manual controls | The full route flies at 60 fps over grey blocks with correct geography; landmarks placed as boxes at the §6.2 coordinates |
| M1 | The look: sky model, four light families, clouds with shadows, haze, the Classic Negative grade v1, the two lenses | Hero frames 9369 (sky) and 8372 (cumulus over Vyšehrad blocks) pass the light mood question with roofs still as coloured blocks |
| M2 | Roofs and materials: Tier 2 districts with roof forms, dormers, chimneys, palette, facades, streets | Petřín panorama hero frames (7924, 7940, 7944) and Vyšehrad (8385) pass the colours and light mood questions with landmarks still as boxes; the silhouette question waits for M3 |
| M3 | Tier 1 landmarks, first six: Charles Bridge and its three towers, Týn, St Nicholas, the Castle massing, Petřín tower, Vyšehrad | Hero frames 7924, 8704, 8607, 8942, 8753 pass all three; 8372 and 8385 pass with the ramparts and gates in place (the basilica is judged by the read-back checklist, §7.1) |
| M4 | Remaining Tier 1 landmarks and bridges, the weirs, islands, night lighting | 8158, 8809, 8490, 9486, 9547, 9542 pass |
| M5 | Vegetation and the season: species, orchards, rose garden, meadows, grading of greens | 8725 and 8722 pass; the Petřín climb reads as gardens |
| M6 | City life: trams, boats, swans, pigeons, crowds, cars | The read-back checklist "is anything moving" passes on every leg |
| M7 | Interface, loading, fast mode, the blue-hour hold, polish, lite preset | Motion tests pass; loading under 8 s; 30 fps floor on integrated graphics |
| M8 | LUT refinement against all hero frames, final side-by-side sheet | Every hero pair passes all three questions |
| M9 | Details from the close-ups (§8.2, §8.1, §8.4): the architecture, roofs and greens the close-up photographs show, modelled and applied across the city | The close-ups (8082, 8777, 8884, 9204, 8440, 8722) read as the same kind of place at a glance; no pair of the M8 sheet gets worse |
| M10 | The rest of the close-ups' details (§8.2, §8.3, §7.1, §8.5, §8.4): round-arched ground-floor windows, portals, stucco ornament, shutters, balconies and wall lanterns on the old fronts; Legion Bridge's pale granite arch rings; the Čertovka's dark, overgrown banks; roses close enough to show their blooms | 8777, 8082, 8440, 9204 and 8722 read as their photographs' kind of place at a glance, and 8722 shows single blooms; no pair of the M9 sheet gets worse; no measurable cost on the route |
| M11 | The close-ups' last gaps (§8.1, §8.3, §7.1, §8.5, §8.4, §5.2, §5.5, §12.1): the old town's storeys where OSM's import says one; lamps where OSM leaves an old street dark, some on two-armed posts; the Zlomkovský mill's arches across the Čertovka; rose petals shaped and lit as petals, the bush open near the lens, depth of field for the close-ups | 8082 and 8777 show a street as narrow and shaded as their photographs', 8777 a lantern post in front of its house; 9204 the mill's arches at the canal's end; 8722 roses in focus against a soft background; no pair of the M10 sheet gets worse; no measurable cost on the route |
| M12 | The bridge quarter (§7.1), the first of the detail programme (§14): a moulding sweep and a parts library in the kit (profiles swept along paths, tracery, balustrades, pinnacles with crockets, columns and pilasters, pediments, ribbed domes, statue silhouettes) and a third tier of landmark geometry drawn within 300 m; then Charles Bridge's thirty statue groups, its coping and lamps; the Old Town Bridge Tower's sculpted east face, gallery and turrets; the Lesser Town towers; Týn's tracery, gallery and gable; St Nicholas's pilasters, entablatures and ribbed dome; the Old Town Hall's oriel and clock frame; and the Old Town waterfront: St Salvator's statued front, the Klementinum's towers, St Francis's ribbed dome, the Smetana Museum's gables, the water tower's profile | 8704, 8683, 8607, 8608, 8903, 8942, 8694, 8825 and 9486 show the landmarks' silhouettes broken by pinnacles, galleries and statues and their fronts in relief, blackened stone with pale dressings; no pair of the M11 sheet gets worse; the route within the §11 budget |
| M13 | The river (§8.5, §8.8, §8.4): the ripples' tiling fixed and a wave model with wind and fetch; the mirror at full resolution within 300 m, sharper at the banks, longer streaks at night; sun glitter; the quays rebuilt from the photographs (rusticated walls, coping, railings, stairs, mooring rings, Náplavka's vaults); the Old Town weir's pile row, the lávka and the lock walls; Kampa's houses standing in the water and the mill wheel; willows on the banks and islands; three times the boats, with their real look, small boats under the bridge, kayaks, ducks; the water's colour re-fitted per light family | 8683, 8694, 8849, 8988, 8825, 9547, 9542, 8490 and 9204 show water that reflects the city and the sky as the photographs' does, banks of dark stone under willows, and a river full of boats; no pair gets worse; within budget |
| M14 | Facades in relief (§8.2): cornices, string courses, plinths, reveals, sills, hoods, lesenes, balconies and portals built as geometry in the tile worker within 300 m of the camera; arcades on the squares as recesses; volute and stepped gables; dormers as hipped boxes; the 19th-century embankments' bays, corner turrets, gables and attic figures; Old Town Square's row modelled as a set (the Kinský palace, the Stone Bell, the Týn school) | 8777, 8082, 8607, 8608, 8942, 8884, 8988, 8158 and 8809 show fronts that cast their own shadows, seen along the street as well as square on; no pair gets worse; within budget |
| M15 | The hundred spires and the Castle (§7.1, §7.2): a church generator for OSM's churches, chapels and synagogues (nave, tower, spire by district and era, twin towers where the west end is wide); the Castle in detail (buttresses, pinnacles, the rose window, the south tower's helmet, the palace fronts' window rows, St George's towers, the Black Tower); a second hand-built tier: Strahov, Loreta, the Černín palace, Emmaus, St Ludmila, the Jindřišská and New Town Hall towers, the Municipal House, Vítkov, Karlín, the National Museum, the Rudolfinum's and the National Theatre's fronts | 7924, 7940, 7944, 8753, 8809, 8372, 8385 and 9486 show a skyline of towers and domes as dense as the photographs'; no pair gets worse; within budget |
| M16 | Trees (§8.4): species silhouettes (irregular, layered limes and chestnuts, poplars, the willows of M13), branch structure near, canopies that read as a mass with texture, the orchards' gnarled trees | 8725, 8809, 8753, 8385, 8884 and 8490 show trees, not balls or confetti; no pair gets worse; within budget |
| M17 | The flight through the detail (§9.2, §8.7, §8.6): lower passes where the detail now pays (stop 9, the Old Town orbit), the night's lights and their reflections, cumulus of varied sizes | The read-back checklist passes on every leg; 9547, 9542 and 8372 pass; within budget |

### Progress

**M0, built 2026-09-25.** The pipeline (`npm run world`) turns the OSM extract and DMR 5G into `public/world/` in about 15 s. The app draws the 5 m terrain in 1 km chunks with four levels of detail, the horizon to 16 km, and the river, whose surface is measured from the terrain and whose bed is carved under it. Ground colour comes from land use at 2.5 m: parks, woods, gardens, streets, squares and rail. On top stand 51,000 buildings and 4,100 building parts as grey blocks, and 210 bridge decks. Landmarks are sandstone-coloured blocks on their OSM footprints, with plain boxes for the metronome and the Žižkov tower. The sun of §5.4 lights a gradient sky with haze and casts one 4096 shadow map that follows the view. The auto route runs with its lens changes and the blue-hour hold; manual flight keeps its clearance; the interface is the minimal set of §10.1 plus the attribution.

Measured in Chrome on an Apple M2 at 2360 × 1404: 3.5 to 9.9 ms a frame across the 18 stops, 6 ms on average. The route stays at least 12 m above every roof. Not yet in M0, and planned for M1: cascaded shadows (the terrain casts none yet), the analytic sky, clouds, the grade and TAA.

**M1, built 2026-09-25.** The look, in `src/sky/` and `src/render/`:

- **Sky and sunlight** from precomputed scattering tables (§8.6). The same tables colour the sunlight through the air and the haze, so the low sun is orange because the air made it so. Knobs per family: aerosol, sky saturation, and a lift of the dark band opposite the sun, because the photographs' skies are flatter than the physical one. Stars and an orange light-pollution glow come in after dark; cirrus appears on half the sessions; the overcast deck on one in five (or from the WEATHER button).
- **Light families** (§5.3) as keyframes on the clock, with the overcast variant blended in over a second. Each sets aerosol, haze density and height, exposure bias, white balance, saturation, contrast, black lift, and how much of the session's cumulus has built up: clear at dawn, full from late morning, thinning after 18:00.
- **Cumulus** raymarched at half resolution (base 1200 to 1800 m, peak coverage 5 to 65%, wind 3 to 8 m/s from the west-south-west, all rolled per session; C rolls again). Their shadows on the city come from the same coverage map and travel with them. Lighting adds a diffuse multiple-scattering term to single scattering; without it cumulus render grey.
- **Shadows**: two cascades from three.js's `SunLight` for the buildings, and the terrain's own shadow from a heightfield march on the GPU, so Petřín shades Malá Strana in the evening.
- **Haze**: height fog coloured by the sky just above the horizon (two thirds of it), and by the sky's mean light once the sun has set, when the low air is in the earth's shadow.
- **Grade**: TAA in linear light, a meter weighted toward the highlights within a stop of the sky's brightness (and never more than 11.5 stops above midday), the Uchimura curve, the Classic Negative LUT v1 from `tools/make-lut.ts` (`npm run lut`), the family trims, vignette and grain, a trace of chromatic aberration at the wide end. G (development only) turns the grade off.
- **Coloured blocks**: roofs from the §8.9 palette by district in the §8.1 proportions (terracotta 78%, slate 14%, copper 5%), plaster walls by district, flat grey roofs on large modern blocks, stand-in colours for the landmarks.
- **Side-by-side** (§12.1): viewpoints for 8372 and 9369 (the M1 test) and 8694 and 9547 (the evening families), `npm run compare`.

Measured on an Apple M2 at 2400 × 1600 with the synced benchmark (CPU and GPU in series, which the frame loop overlaps): 11.7 to 19.3 ms a frame across the 18 stops, 16.2 on average. Of that the shadow cascades take about 2.5 ms, the clouds 1.4, the sky patch on every material 1.7. Frame rate has to be judged in a visible Chrome window: this machine's embedded browser throttles, and headless Chrome runs M0 itself at 30 to 40 fps. The target machine of §11 (M1 Pro) has half again the M2's GPU; the lite preset (M7) and the render scale are the levers if needed.

Known gaps after M1: cumulus are smoother than the photographs' cauliflower; the blue-hour horizon band is pinker than 9547; the river is a placeholder until M4; with no city lights until M4, the city is black after about 22:00.

**M2, built 2026-09-25.** Roofs and materials, in `tools/lib/` (build) and `src/world/` (app):

- **Roofs** from the straight skeleton of every footprint (§8.1): 37,800 pitched roofs, hipped, gabled, mansard, domed, with firewall gables on party walls and flat tops on the big blocks; 19,900 dormers, 30,500 chimneys, 5,400 boxes on flat roofs. Districts come from the OSM cadastral areas (§7.2), colours from the palette and the tags. The world build takes about 40 s, the roofs half of it on seven worker threads; the tiles grew from 1.8 to 6.4 MB, the world to 14.1 MB.
- **Facades** drawn in the shader (§8.2): window grids by style, cornices, string courses, shopfronts, blank firewalls where a house rises above its neighbour. **Roofs** carry tile courses, weathering and lichen, filtered by distance.
- **Streets** (§8.3): setts and cobbles, square paving, asphalt grain; tram rails; lamp posts from OSM.
- **Ambient occlusion** (§11), dimming only the sky's light, reprojected from the previous frame.
- **Light**: the 18:30 key retuned against the Petřín panoramas (clear air, deep shadows, contrast 1.12), the horizon band made pale blue away from the sun, spectral aerosol (§5.3). Woods, parks and gardens are darker on the ground, as their canopy reads from above, until M5 plants trees.
- **Side-by-side**: viewpoints for 7924, 7940 and 7944 (the Petřín tower's gallery, 52 m up) and 8385 (the north-east bastion of Vyšehrad). The M1 viewpoint 8372 is raised from 12 to 18 m, since the houses below the rampart now have their roofs. On 7924, luminance in the band of the city (5th, 50th, 95th percentile) is 20, 73, 228 in the photograph and 25, 91, 216 in the render; the sky just above the horizon #b4c0cb against #a5b4c0.

Measured on an Apple M2 at 2360 × 1404 with the synced benchmark: 7.7 to 14.6 ms a frame across the 18 stops, 10.5 on average. Buildings take about 3 ms of it, the roof detail 0.6, occlusion 0.9, streets 0.2. Benchmarks taken while a headless comparison run shared the GPU came out near 19 ms: measure with nothing else on the GPU.

Known gaps after M2: trees wait for M5, so the forest in the foreground of the Petřín frames and the trees framing 8385 are dark ground, and 9369 has a block where the photograph has a tree; landmarks are boxes until M3; the 8385 viewpoint is approximate, the same kind of view rather than the same frame; balconies, shutters and the Old Town Square arcades are not built; tram rails stop at the bridges and Náplavka's cellar doors wait for the river (M4).

**M3, built 2026-09-25.** The first landmarks, modelled in code (§7.1), in `tools/landmarks/`:

- **Charles Bridge and its towers**: the bridge on the piers of OSM's outline, its statues and lamps; the Old Town Bridge Tower and the Lesser Town towers of blackened sandstone with their corner turrets, steep slate roofs, gilded finials and gates. From Mánes Bridge (8704) the tower, the arches and the bridge's line fall on the photograph.
- **Týn**: the two towers with their spire clusters, the gable between them, the nave's steep roof. From below the astronomical clock (8607) the spires and galleries line up with the photograph's.
- **St Nicholas**: the dome, drum and lantern, the nave, the belfry in stages. 8942 matches in the belfry and the dome behind it.
- **The Castle**: St Vitus with its west spires, the south tower's copper helmet, the crossing spire, the buttressed choir; the palace wings. From below Strahov (8753) the silhouette on the ridge is right.
- **The Petřín tower**, the camera stand of 7924 to 7944, and seen as a spike on the hill in 8372.
- **Vyšehrad**: the ramparts with their walks, the gates, the rotunda and the basilica, on terrain lowered along the walls. 8372's camera is raised to 30 m so it looks down on the roofs below the rampart, as the photograph does.
- The other landmarks stand as their OSM parts with mapped roof shapes; walls get the stone, metal and window surfaces of the building shader.

The world grew by 0.8 MB to 14.9 MB; the full build takes about 35 s (`--landmarks` rebuilds `landmarks.bin` alone in 5 s, for modelling). Measured on the Apple M2 at 2048 × 1536 with the synced benchmark: 7.6 to 15.7 ms a frame across the 18 stops, 11.5 on average; the landmarks cost 0.1 ms of it.

Known gaps after M3: trees are still missing (M5), and they frame 7924, 7940, 8372, 8385 and 8753 in the photographs; the river is a placeholder until M4, which matters in 8704; the houses of Old Town Square are the generic ones of M2, without the Týn school's Venetian gables, and stand a little taller than in 8607; the statues on the bridge are silhouettes; the Castle beyond St Vitus and the palace wings (the Old Royal Palace's roofs, St George's, Golden Lane) is OSM massing; the Brick Gate is a block; 8942's overcast is a little greyer and darker than the photograph's bright cloud.

**M4, built 2026-09-25.** The rest of the landmarks and the bridges, the river, the night:

- **Bridges**: Legion, Mánes, Čechův, Jiráskův, Palacký, Štefánik and the railway bridge, from one generator on OSM's decks (§7.1). From Letná (9486) Mánes Bridge's arches and pylons, Charles Bridge's piers and the far bridges fall where the photograph has them. Tram rails now cross the bridges on their decks.
- **Landmarks**: Novotného lávka with the water tower and the Smetana Museum, the Dancing House, the National Theatre, the Šítkov tower, St Francis, the Klementinum tower, the Rudolfinum, the Powder Tower, the Old Town Hall tower with the astronomical clock, and on the square St Nicholas, the Hus memorial and the Marian column (§7.1).
- **The river** (§8.5): flowing ripples, the mirror of the city with the sky and cumulus in it, the weirs' foam lines, stone embankments instead of beaches. The Castle across the water (8809) now stands over its own broken reflection.
- **The night** (§8.7): lit windows, street lamps and their pools, floodlit landmarks, the lamps' streaks on the water. From Legion Bridge at 21:50 (9542, 9547) the Old Town waterfront glows over a dark river. Views that open after dark now draw the city (the shadow-map fix in §8.7).
- **Overcast**: exposed with the deck as the sky, nearly white as in 8158 and 8942.

The world grew to 16.7 MB: `landmarks.bin` from 0.8 to 2.6 MB, with the bridges and 21 km of embankments. Measured on the Apple M2 at 2048 × 1536 with the synced benchmark: 8.2 to 16.2 ms a frame across the 18 stops, 11.9 on average, against 11.5 in M3. The mirror costs about 2 ms on average, drawn every other frame; drawn every frame it cost 2.4 on average and 7 at the take-off, which it made 23 ms.

Known gaps after M4:

- **Trees (M5).** They frame 8490, 8809 and 9486 in the photographs, and the Letná slope in the foreground of 9486 is bare.
- **City life (M6).** The pedal boats of 8490, the tour boat of 9486 and the tram of 8158 wait for it.
- **Ginger's glass** reads pale grey, where the photograph has sky and blue in it. Fred's window frames are dark, not blue-grey.
- **The blue-hour sky** keeps a pink band low down where 9547 is blue: three wavelengths of ozone leave twilight magenta, and the cooler white balance only partly turns it.
- **The cumulus** of 8490 and 9486 are still the smooth blobs of M1.
- **The hold at stop 18** looks steeply down on the dark rock. Its framing is M7's blue-hour hold.
- **Not modelled.** Old Town Square's facade row (the Týn school's gables), the Mánes gallery (OSM's white blocks), the New Stage, and the penguins on Kampa.
- **Frame pacing.** Because the mirror is drawn every other frame, frames at the busiest stops alternate by 3 to 4 ms.

**M5, built 2026-09-26.** Vegetation and the season:

- **Trees** where the real ones stand, 470,000 of them from ČÚZK's canopy model (§6.3, §8.4): Petřín's woods, the orchards of the Seminary and Strahov gardens, the islands, Kampa, Letná, the embankments and every courtyard tree of Malá Strana. The Petřín panoramas now have their dark forest in the foreground (7940), Vyšehrad its framing trees (8372, 8385), Letná its slope of big trees (9486).
- **The season**: lawns and meadows yellowed in patches, the Petřín rose garden in bloom with its beds and bushes, the city's flower beds, garden walls, the Schönborn gloriette over the orchards (§7.1).
- **The greens** of the grade turned toward teal (§5.2).
- **Side-by-side**: 8725 (the meadow and orchard under the gloriette) and 8722 (roses), new viewpoints (§12.1).

The world grew to 21.7 MB: trees.bin 3.3 MB, the land use 1 MB for the canopy's shade, the garden walls 0.7 MB. Measured on the Apple M2 at 2048 × 1536 with the synced benchmark: 8 to 17.8 ms a frame across the 18 stops, 13.4 on average, against 12.1 with the trees hidden. The take-off and the Malá Strana roofs, the stops that see the most of the city, are just over 16.7 ms on the M2; the target machine of §11 has half again its GPU.

Known gaps after M5:

- **Close up, a crown is a lumpy mass, not leaves.** From the ground (8725, 8753) the nearest trees read as foliage at a glance and as modelled shapes when looked at; 8722's single roses are beyond the world, and its render shows rose bushes in bloom instead.
- **Young orchard trees** planted since the survey are not in it, so the Seminary garden is sparser than 8725 shows. Grass is a texture: from eye level it is a mown lawn, not the long meadow of 8725.
- **7924's forest**: the canopy model puts the treetops below the tower 2 to 5° under the bottom of the frame; in the photograph they fill it. **8753**: the slope below Strahov is lawn with scattered trees where the photograph has dense bushes, and a tree beside the camera frames the view.
- **Trees at night** stand as dark silhouettes; the lamps' pools do not light them.
- **The cumulus** are still the smooth blobs of M1.

**M6, built 2026-09-26.** City life (§8.8), laid out by the build (`tools/lib/life.ts`, `npm run build-world -- --life` rebuilds it alone in 8 s) and moved by `src/life/`:

- **Trams** on all 25 day lines through the world, both directions, 561 km of runs with their 1,160 stops, T3 pairs and 15T. From Legion Bridge's approach (stop 4) a 15T crosses the bridge under its wire while a T3 pair crosses the Malá Strana arm; 8158 has its 15T in front of the Dancing House, 8942 a T3 pair on Malostranské náměstí.
- **The overhead wire** over every track and its 5,300 poles.
- **The river**: four tour boats on circuits and sixteen moored at the quays, twelve pedal boats out between Legion Bridge and the Old Town weir with the rest at the Střelecký pontoon, two rowing eights above the Šítkov weir in the morning, the wakes, and three groups of swans. 9486 has its tour boat below Mánes Bridge; 8490's pedal boats are out on the water, farther off than the photograph's.
- **People**: up to 1,900 on Charles Bridge, Old Town Square, the Royal Route, Kampa, the quays and Petřín, by the hour. **Pigeons** in seven flocks that lift when the drone comes down near them. **Cars** on the embankment roads.
- **Night**: lit windows and headlights on trams, boats and cars, streaked in the river.
- **Is anything moving** (§12.4): the auto route sampled every 5 s, counting what is in the frame and at least 2 pixels across: trams on every leg, boats on every leg along the river, crowds from the Malá Strana roofs to Josefov (stops 8 to 14), cars along the embankments (stops 1 to 4 and 16 to 18). The one moment with none of them is the long lens tilted up at the Týn towers (stop 11), where the cloud shadows still move.

`life.bin` is 0.63 MB: the runs are packed as 16-bit steps from each run's first point (3.2 MB as floats). Measured on the Apple M2 at 2048 × 1536 with the synced benchmark, with and without city life in alternating runs: 21.2 and 22.7 ms on average with it, 21.6 and 21.1 without, so it costs well under a millisecond; the wires and poles about half a millisecond. The machine was busy during this session (Spotlight indexing, a Chrome GPU process at a third of a core), and the whole route measured about 21 ms with life hidden against M5's 13.4, on code that is M5's but for the wires: the absolute numbers are this machine's load, and the next clean measurement is M7's.

Known gaps after M6:

- **Trams** are placed by timetable, not driven: trams of different lines sharing a track keep at least 11 s apart but are not made to queue, and they appear and vanish at the world's edge and where a run breaks. The pantograph is fixed at the wire's height. 8158's tram passes closer to the camera than the photograph's.
- **Boats** pass under the bridges wherever their circuit takes them, not through the navigation arches, and can cut through a pier. The wakes are geometric V's.
- **People** walk to and fro along fixed paths, on Old Town Square along straight lines across it; nobody sits, and nobody walks the streets outside the zones.
- **Cars** vanish at the ends of the embankment lanes.
- **No historic trams.** 8942's photograph has line 42's 1900s car; the render has a T3 pair.

**The cover, built 2026-09-26** (the first piece of M7), in `src/ui/cover.ts`: the words on the dark ground, the city fading in beneath them at the first frame, the call to fly once the tiles are in, and the lift into the flight; the drone waits at stop 1 with the hold's drift until the cover lifts (`Drone.waiting`), then the drift settles over a second. Stop 1 was reframed for it and stop 2 moved on (§9.2).

**M7, built 2026-09-26.** The interface, loading, fast mode, the blue-hour hold, polish and the lite preset, around the cover above:

- **Loading** in two parts (§10.2): the terrain, the river and the land use first, then the tiles, the streets, the landmarks, the trees and the city's life streaming in behind the first frame. On a 100 Mbit/s connection the first frame comes at 1.6 s and the whole city is in at 3.4 to 3.6 s, 23.5 MB; before the split, the first frame came at 2.9 to 3.1 s.
- **The blue-hour hold** (§9.2): stop 18 now looks down the river of lights to the bridges and the floodlit Castle in the afterglow, the ramparts in front, and the last leg rounds the basilica to get there. The evening's cumulus dissolve by 21:45 (§8.6), as in the blue-hour frames, instead of hanging over the hold as dark blobs. Enter in the hold flies again from dawn through a short fade from black, the clock jumping with the drone; eased, it spun the sun back through the whole day in two seconds.
- **The route's turns** (§9.2): four via knots where the camera flipped over or swung round, the worst of them the Old Town Square orbit, which was a fly-over across the Týn towers and is now an orbit.
- **No hitches from the first use of anything**: every shader program the flight needs is compiled under the cover, the lamps hidden by day and the mirror's clipped variants included (the first dusk compiled two in flight); and once the tiles are in, the whole city is drawn once offscreen with nothing culled and every lamp lit, so each mesh's buffers are on the GPU and the driver has finished the lamps' programs before the flight needs them (the first minute's new tiles cost frames of 50 to 180 ms, the first dusk 80 to 120 ms in the mirror).
- **Quality** (§11): the full and lite presets and the governor of the render scale.
- **Fast mode** is the route at twice the pace as before; the motion test flies it.
- **Polish**: the Old Town weir's foam keeps its streaks from the air instead of reading as a painted white strip; OSM draws a wall along the weir's crest, and the garden walls of M5 stood it up in the river, where it read as a queue of boats; the pedal boats keep to the upstream half of the weir's slant, as they slid along the crest; the key hint's 20 s count from when the interface first shows, not from the load, so it is still there after a long look at the cover.
- **The motion tests** (§12.2), in headless Chrome on the M2 with `tools/motion.ts`:
  - **The route at 1× and 2×**, the render scale held at 1: no program is compiled in flight, and the main thread takes under 12 ms a frame but for one frame of about 70 ms near 15 s in some runs, which a profiler never caught. At 1280 × 800, 3 frames of 50 ms at 1× and 2 at 2× in 26,000, all on the first leg and all on the GPU's side (most likely the ground's finest level being built as the drone comes down to the river). At 1800 × 1100, 12 and 11 frames of 50 to 83 ms, and a third of the frames at two vsyncs: two million pixels of the full preset are at the M2's limit, and headless Chrome paces frames worse than a window. With the governor on, as a visitor has it, this machine steps down twice in the first four seconds and goes lite at 15 s, a frame of about 70 ms at each step; beyond those, three frames of 50 to 67 ms in the whole flight (the first leg, and one near 50 s), one frame in seven at two vsyncs. Not yet a clean pass: it must be flown in a visible Chrome window, and on the target machine of §11.
  - **Manual**: five minutes at Shift speed, random keys, turned back past 1.6 km: never nearer than 6.3 m to a roof, a landmark or the ground (the near plane is 3 m), under 12 m for 1.8% of the time, never outside the world.
  - **Clouds**: twenty reseeds, peak coverage 6 to 59%, the same drawn at 14:00, the shadows moving at the wind's 3.4 to 7.6 m/s every time.
  - **Clock**: 04:30 to 23:00 over 3,600 frames at stops 16 and 18: the largest step in the frame's brightness 3.1 of 255 (the sunrise, a steady climb over a quarter of an hour), the largest pop 1.6 of 255; the lamps fade in and out over twenty minutes of the clock.
- **Measured** on the Apple M2 at 2048 × 1536 with the synced benchmark (`tools/motion.ts bench`), on a quiet GPU: full 14.6 and 15.4 ms a frame on average across the 18 stops in alternating runs, 20 at the most (the take-off and the Malá Strana roofs), against M5's 13.4 before the wires, the poles and the city's life; lite, at 1505 × 1129, 10.1 and 9.9, 13.2 at the most. With the GPU shared, earlier, lite broke down as the buildings 6 ms, the sun's shadows 5 (2.4 of it their reach beyond 1.4 km), the trees 3.7 (2.1 of it the far sprites' shadows), the city's life 1.4, the mirror 0.7, the landmarks 0.3, the cumulus 0.1: hence lite's cuts in geometry.

Known gaps after M7:

- **The 30 fps floor on integrated graphics is not measured.** There is no Intel Mac here. Lite does on the M2 what full does in two thirds of the time; an Intel Iris Plus has a third to a quarter of the M2's GPU, and the governor then takes the pixels down to about a third. Whether that holds 30 fps must be seen on one. Most of the frame is geometry: the building tiles have no levels of detail, and they are the next lever if it does not.
- **Most of this session the GPU was shared.** Another application kept the M2's GPU 85 to 100% busy (full measured 22 ms a frame then), so the lite breakdown above is differences between alternating runs; the benchmark and the route at 1800 × 1100 were taken once it was quiet. M6's 21 ms was the same load, not M6.
- **Frame pacing** at the busiest stops is still uneven by 3 to 4 ms, the mirror being drawn every other frame (M4).
- **Loading and the hitches** were measured in headless Chrome; Safari is untested.

**M8, built 2026-09-26.** The grade refined against all thirty hero frames, and the final sheet:

- **Every hero frame on the sheet.** Viewpoints for the last eleven (§12.1), four of the hero list's descriptions corrected (§3.3), and 8158 moved off the end of Jiráskův Bridge's parapet, which had filled the lower half of its frame.
- **The tools** (§12.3): `npm run compare -- --fit` also saves, for each frame, the image as it enters the LUT, the render's sky and the photograph at the render's size; `tools/lut-fit.ts` measures each pair in OKLab, city and sky apart, and fits the grade's parameters to all of them (`--report` measures only); `tools/sheet.ts` lays the pairs out in `compare/sheet/index.html` with the three questions to click. The grade's authoring moved to `tools/lib/grade.ts`, shared by `make-lut.ts` and the fit, and `make-lut.ts` writes the fitted parameters when they exist (`--hand` for the authored ones).
- **The world first.** What a LUT cannot fix, the statistics showed all the same, and it was fixed where it arises: the cumulus' shape (flat bases, cauliflower tops, the folds darker against the light, §8.6); a viewpoint's own air and no cumulus where the photograph has none; the 20:00 key, whose sky was two stops dark (§5.3); the blue hour's horizon, blue instead of pink after sunset, and its cooler balance; the overcast, faintly blue instead of cream, with its shadows dark; the river, grey-blue instead of navy from above and grey edge on (§8.5); the crowns against the sky, which were black (§8.4); the family contrast, an S instead of a clipped stretch; the meter's reach up to 0.8 of a stop; the floodlights a deeper orange (§8.7); houseboats and botels as low cabins instead of town houses standing in the river.
- **The grade, v2 of the LUT** (§5.2): reds less saturated and less orange, the ochres less yellow, the shadows neutral instead of blue, less lift of the blacks.

Measured by `tools/lut-fit.ts` over the thirty pairs (a mismatch of the statistics, lower is better; not a gate, §12.3): 47.3 with M8's world and the authored grade, 45.0 with the fitted grade; the mean ΔE between the pairs' dominant colour clusters 4.66 with the authored grade and 4.35 with the fitted one. The frame's cost was not measured again: besides constants, the shaders gained one sky lookup on the water and a term in the cumulus' light.

Known gaps after M8:

- **The verdicts are the user's.** M8 is accepted when every pair on the sheet passes the three questions; the sheet is made, the judging is not done.
- **Skies.** The deep blue afternoon skies of 8607 and 8608 render paler than the photographs'; the milky skies of 9486 and 8753 render darker and bluer, even with those days' own haze. The grade cannot fix both, as they sit at the same hues.
- **Roofs** are still a little more orange than the photographs', and 8372's middle tones a little brighter.
- **8158** is exposed about a stop brighter in the photograph than the other overcast frames, with the sky blown white; the render keeps the family's exposure. It shows no tram: the world's track passes within 10 m of the lens there, where the photograph's tram runs along the foot of the Dancing House.
- **The close-ups** (8082, 8777, 8722, 9204) and the views that nothing fixes (8440, 8884) are the same kind of view, judged on colours and light; their statistics differ most, from composition.
- **The river** edge on shows the sky's colours but not yet the ripples' texture of 8683 and 8704; low over the water in 8988 the ripples repeat as a visible grid.
- **Seen on the sheet**: a pale block at the waterline in 8809 where the photograph has a restaurant's terrace; a red box on 8725's lawn; the cumulus of 8490 and 8725, seen from low down, still read as cotton balls.

**M9, built 2026-09-26.** The details of the close-ups, modelled and applied across the city (§14):

- **Facades** (§8.2): two-tone plaster, the trim paler, deeper and warmer, or the field's own colour by building, on the window surrounds, the lesenes, the cornice and the string course; white casements with a cross in every window of the old fronts; sills, aprons and first-floor hoods, segmental, triangular or straight, on the baroque, Old Town and palace fronts; straight hoods and a rusticated base on the 19th-century blocks. 8777's pink front with its salmon surrounds and 8884's yellow house with red-orange lesenes now read as their photographs' kind of house.
- **Roofs** (§8.1): white and cream chimney stacks, skylights on the tiled slopes, white dormer fronts with a cross in the window.
- **Trees** (§8.4): leaf clusters on every crown within 50 m, the leaf noise turned off the world's axes, the near clumps halved, deeper lobes in the outline.
- **Viewpoints** (§12.1): 9204 over the Čertovka's tree-lined stretch by Kampa park, 8440 at the arches next to Střelecký island with the wooded slope behind.
- **The capture tool** deletes headless Chrome's profile after each run: 131 had been left behind, 16 GB, and filled the disk.

Measured with the synced benchmark on the Apple M2 at 2048 × 1536, in alternating rounds with the details on and off (`bench "" "detail=0"`): 15.4 and 15.5 ms a frame on average with them, 15.6 and 15.6 without; no measurable cost on the route, where few crowns come within 50 m and the facade details are drawn only near. Another application kept the GPU about 80% busy during the runs.

Known gaps after M9:

- **Not built**: round-arched ground-floor windows and portals, stucco ornament and cartouches, shutters, balconies, wall lanterns (8777, 8082).
- **Near trees**: within a few metres of the lens the leaves read large; beyond 50 m the crowns are as in M5.
- **Legion Bridge** lacks the pale granite arch rings of 8440; the Čertovka's banks are the river's pale embankment walls, where 9204's are dark and overgrown.
- **8722's roses** are still beyond the world: the camera cannot come nearer than 3 m.
- **The verdicts** on the sheet are still the user's, for M8 and M9 alike.

**M10, built 2026-09-26.** The rest of the close-ups' details, modelled and applied across the city like M9's (§14):

- **Facades** (§8.2): portals with panelled doors, round-headed with a keystone or straight under a cornice; round-headed ground-floor windows with a fan of bars; stucco in relief (cartouches in the aprons, keystones, eared surrounds, shells in the pediments, a wreath on some first floors); balconies with iron railings on the 19th-century blocks and over the palaces' portals; shutters on some plain houses and villas.
- **Lanterns** (§8.3): 164 of OSM's lamps in the old town's streets hang on brackets on the walls they stand against; every lantern is the four-paned Prague kind.
- **Legion Bridge** (§7.1): radial voussoirs of pale granite round every arch, warmer piers (8440).
- **The Čertovka** (§8.5, §8.4): dark rubble walls at the water's edge instead of the river's embankments, and 512 bushes along both banks hanging over the water (9204).
- **Roses** (§8.4): blooms modelled within 12 m of the camera, leaf clusters on the bushes, the coral variety orange-red; 8722 re-placed among the beds with a near plane of 5 cm (§12.1), and it now shows single blooms against the sky.
- **Found and fixed**: on a street that falls away along a front, the storey below the ground floor took the ground floor's door and windows, and was black at night.
- `?detail=0` now leaves the facade details out of the shader altogether, so the benchmark also measures what their code costs where it is not drawn.

Measured with the synced benchmark at 2048 × 1536 in seven alternating rounds, details on and compiled out: 16.1 against 15.8 ms a frame on average over four rounds, 16.4 against 15.6 over three. All the facade details of M9 and M10 together cost about 0.4 ms a frame (2 to 3%), about the size of the run-to-run noise; M9's measurement, with the details switched off by a uniform, could not see their code's own cost. The world build takes 40 s. On the sheet, 8722, 9204 and 8440 changed as intended, 8777 and 8082 gained their ornaments, and no other pair changed beyond leaf sway and ripples; the shutters first drawn on 8884's white house were taken off the baroque fronts.

Known gaps after M10:

- **The roses** are smooth, flatly shaded petals, nearer a painted rose than a photographed one; the bush behind them is still a mass of lobes; there is no depth of field, where the photograph's background is soft.
- **9204**: a corner of the canal wall stands as a hard block in the shade at the left; the mill's arches at the canal's end are not modelled.
- **8082 and 8777** still stand where the world's street is wider and brighter than the photographs'; no lamp of OSM's stands in 8777's frame, so its lantern post is not there.
- **Stucco** is relief drawn on the wall, flat seen along it; no statues on the fronts.
- **The verdicts** on the sheet are still the user's, for M8 to M10.

**M11, built 2026-09-26.** The close-ups' last gaps (§14):

- **Storeys** (§8.1): 377 old-town footprints that OSM's cadastral import gives one storey (276 of them holding 2 to 25 flats) take their district's storey range. Nerudova's fronts stand three and four storeys high, and the house at the left of 8942 at its height.
- **Lamps** (§8.3): 909 added where the register leaves the old town's streets dark, one every 24 m or so; 428 two-armed candelabra, the added posts' every other one and OSM's with two lanterns or more; lamps drawn in full within 150 m, as stand-ins to 600 m.
- **Pavements** (§8.3): the old town's cobbled streets paved with setts from front to front, 12.8 ha.
- **The Zlomkovský mill** (§7.1): its wing across the Čertovka on two arches, the left one closed by the sluice's rack, 745 triangles and 510 of detail. The Čertovka's walls follow a simplified outline and end in slopes; the block that stood across 9204's left bank is gone (§8.5).
- **Roses** (§8.4): petals shaped and shaded as a hybrid tea's, lit as petals, the blooms turned out, on stems of 50 cm with rose leaves, the bush opening near the lens; the coral a little oranger.
- **The grade** (§5.2): vivid reds keep their chroma and hue; 1,565 of the LUT's 32,768 entries changed, none of them a roof's or a plaster's colour.
- **Depth of field** (§5.5) for the close-ups: 8722 at 0.9 m and f/4, the garden behind it soft.
- **Viewpoints** (§12.1): 8082 on Nerudova's sunlit north pavement; 8777 in the upper square of Malostranské náměstí, 12 m from a candelabrum before a pale pink front with salmon surrounds.

Measured with the synced benchmark at 2048 × 1536 in four alternating rounds against M10's world, built into `public/world-m10` and loaded with `?world=world-m10`: 16.3 against 16.2 ms a frame, the mean of each stop's median; the rounds overlap (15.6 to 16.7 against 15.6 to 16.5). No measurable cost on the route. First drawn as before, within a kilometre and in full, the added lamps cost 0.8 ms a frame, 1.0 to 1.7 ms over the old town. The world build takes 42 s. On the sheet, 8722, 9204, 8082 and 8777 changed as intended, the house at the left of 8942 stands taller, the trams' red in 8158 and 8942 is a shade more saturated, and no other pair changed beyond leaf sway and ripples.

Known gaps after M11:

- **The roses** are rounder than the photograph's hybrid teas, their petals' points soft; their highlights stay orange where the photograph's pale toward pink; near the lens the bush is leaf clusters, not canes with thorns.
- **8082**: Nerudova is 12 m between its fronts, where the photograph's street is about 8 m; the shaded fronts across it stay paler than the photograph's.
- **8777**: the pink house is three storeys under a mansard, the photograph's four under a cornice, with hoods, pediments and a wreath the generic front does not have; the candelabrum has no scrolls or ornament.
- **9204**: the mill's wing is plainer than the photograph's building, without its balustrade or the houses behind it.
- **The verdicts** on the sheet are still the user's, for M8 to M11.

**M12, built 2026-09-26.** The bridge quarter, the first milestone of the detail programme (§14):

- **The kit** (§7.1): a moulding sweep with the usual profiles, and the parts library of `tools/landmarks/ornament.ts`: balustrades, crenellations, corbels, pinnacles with crockets, tracery windows with mullions, surrounds, columns, pilasters, entablatures, pediments, niches, shields, ribs, and statue silhouettes in ten compositions.
- **The fine tier** (§7.1, §11): a third tier of landmark geometry drawn within 300 m on the full preset, left out on lite, without shadows and out of the mirror; `?fine=0` measures it.
- **Rebuilt**: the Old Town Bridge Tower with its sculpted east face, the Lesser Town towers, Charles Bridge's thirty statue groups by name on moulded pedestals with its coping, string course, lamps and Bruncvík, Týn, St Nicholas, the Old Town Hall's orloj frame and oriel, the Powder Tower, St Francis, the Rudolfinum, the Smetana Museum; new, St Salvator and the Italian Chapel (`tools/landmarks/klementinum.ts`). The landmarks grew from 117,000 to 269,000 triangles, `landmarks.bin` from 3.3 to 5.1 MB; the world is 24.3 MB.

Measured with the synced benchmark at 2048 × 1536 in three alternating rounds, the fine tier drawn and left out (`bench "" "fine=0"`): 16.4 against 15.7 ms a frame (16.5, 15.9 and 16.7 against 15.8, 15.7 and 15.7). The fine tier costs about 0.6 ms on the route, mostly on the low pass over Charles Bridge and the Old Town orbit; the rest of M12 costs nothing measurable against M11's 16.3. Another application kept the GPU about 90% busy during the runs. On the sheet, 8704, 8683, 8607, 8608, 8903, 8942, 8694, 8825 and 9486 show the towers' galleries, turrets and tracery, the bridge's statues, the Klementinum group behind the Old Town tower, and St Nicholas's entablatures; the other pairs changed only where a rebuilt landmark stands in them.

Known gaps after M12:

- **At the hero frames' distances** (200 to 500 m) the ornament reads as the breakup of a silhouette and the shading of a band; it is at the drone's low pass and the orbit that the parts show as what they are. The statues are faceted silhouettes and read as such within 20 m (8903).
- **Not rebuilt**: the Castle and St Vitus, Vyšehrad, the Petřín tower, the National Theatre, the Dancing House, the bridges other than Charles Bridge (M15 and M13).
- **8607, 8608, 8942**: the squares' rows (the Týn school's gables, the Kinský palace, the Stone Bell, the houses of Malostranské náměstí) are still the generic fronts; M14.
- **8683, 8694, 8825**: the embankment walls, the weir's pile row and the water; M13. St Francis's copper dome reads near black against the evening sun in 8704 and 8683.
- **The verdicts** on the sheet are still the user's, for M8 to M12.

---

## 14. Decisions already made

- Web app, desktop only, no mobile.
- Arrows: left and right yaw, up and down altitude. The drone cruises on its own.
- Auto route of 6 minutes designed as in §9.2; fast mode is the same route at 2×.
- Time of day advances with the flight by default; the slider overrides.
- Early summer only. No other seasons.
- The photographs are reference, never content. No gallery, no captions, no overlays, no photo spots. The shipped app contains no photographs.
- Trams, boats, swans, pigeons and tourists are in scope.
- The Castle is backdrop, modelled for massing. The drone never approaches or orbits it; it is seen from Strahov and Petřín (stop 7) and across the water.
- The night ending lands in blue hour, not full dark.
- Black and white and interior frames are excluded from the reference.

Resolved on 2026-09-25 by the user:

- **Hero frames**: confirmed as listed in `data/hero.json`.
- **Overcast**: a random roll, 20% of sessions start with the pastel overcast weather.
- **Aspect**: the render fills the window. No letterbox; the app does not imitate a photograph's frame.
- **Audio**: none.
- **Ending**: hold at blue hour above Vyšehrad until a key is pressed. No loop.
- **Holešovice tram frames**: used for the tram model, livery and colours only. The location is not built.
- **Construction cranes and scaffolding** seen in the Vyšehrad and Podskalí frames: not built.

Proofread on 2026-09-25, fixes accepted by the user:

- **Hero substitutions.** Seven ids in the first list came from the superseded raw export and are not in the curated set. Replaced: 8371 → 8372, 8801 → 8903, 8796 → 8942, 8812 → 8809, 9519 → 9547. Dropped without substitute: 8729 (8725 is the only meadow frame) and 8216 (no frame shows the Vyšehrad basilica). 9204 relabelled from "Petřín, overcast" to Kampa, Čertovka. The list is now 30 frames.
- **Petřín overcast group** removed; the range contained no curated frame. The overcast references are the evening embankments, the bridge towers and the Čertovka frames.
- **Flight clock** runs 06:20 to 21:45 so that stop 18 is a real blue hour (sunset 21:01), and keeps advancing to 22:30 during the hold.
- **Long lens** stays at 55 mm equivalent, milder than the photographs' 83 mm, for motion comfort. The comparison tool uses each frame's own focal length.
- **Post chain** order: TAA before tonemap, grain last.
- **Route**: stop 14 gazes at the Castle, stop 9 flies at 35 m, Old Town gaze uses the §6.2 Týn coordinate, leg times rebalanced.

Decided on 2026-09-25 by the user, after M1:

- **Evening photographs for the morning.** The Petřín panoramas were shot at 18:50, not in the morning (§3.1), and the set has no dawn frames. The route keeps Petřín in the morning (stops 5 and 6), and the evening panoramas stand as the reference for the dawn and warm-morning family: a warm low sun and haze, with the sun on the other side. The side-by-side still renders each hero frame at its own time (§12.1).

Decided on 2026-09-26 by the user, the cover:

- **The cover is the take-off.** The app opens on the route's stop 1, waiting and drifting, under a three-line caption, and the flight continues from it without a cut (§10.2). The alternative, the Petřín evening panorama as the cover with a fade to black into the dawn take-off, was shown as the more beautiful frame and declined for the continuity. Stop 1 was reframed lower and flatter for the cover, and stop 2 moved on with it (§9.2).

Decided on 2026-09-26 by the user, after the M8 sheet:

- **The photographs' details are modelled and applied across the city.** Where the close-ups show what the world lacks (the facades of Nerudova and Malá Strana, the roofs of Kampa, the trees over the Čertovka, the roses), the details are built in code and used wherever the same kind of building or place stands, approximately: the app shows the beauty of the city, not an exact copy. They are modelled, not cut from the photographs as textures: the photographs stay reference, never content, and the app still ships none. This brings the street-level look of the facades into scope (§4's line at about 8 m moves down for facades); interiors, signs and cars stay out.

Decided on 2026-09-26 by the user, after the M11 sheet, the detail programme:

- **A major investment in the details, architecture and the river first.** The sheet after M11 passes on massing, colours and light and fails inside the silhouettes: the landmarks are blocks with a shader skin (the Old Town Bridge Tower is 900 triangles), the houses painted planes, the skyline without its spires (OSM has 107 churches, 53 chapels and 11 synagogues in the world; 8 are modelled), the river a dark plane with its ripple texture tiling (8988), the trees balls. What wows in Prague is the architecture and the river, so M12 to M17 (§13) build them: the landmarks' ornament from a parts library, the river and its banks, facades in relief as geometry, the hundred spires and the Castle, the trees, and the flight through it, in that order. The app grows and costs more for it; the new budget is in §11, and the download may reach 300 MB where the detail needs it.
- **Still not a copy of the photographs.** §4 stands: the details are modelled in code and applied wherever the same kind of building or place stands, approximate, chosen for beauty at the drone's distance; nothing is cut from the photographs, no textures, no pixel matching, no chasing of one frame. What reads at 50 to 500 m is silhouette breakup against the sky, relief shadow, the tone of the stone and the mirror, and those are what the programme buys.
- **Not doing**: photo textures; Prague's open LOD2 city model (true roof shapes, none of the ornament; a spike later if the roofs still fall short); hand-modelling houses beyond the landmarks and the squares' rows; interiors, signs, cars in detail.

---

## 15. Open questions

None. The design is complete for implementation. New questions raised during the build go to the user, and the answers are appended to §14.

---

## Appendix A. File number ranges excluded

Black and white (53): 7844, 7846 to 7851, 7865 to 7884 (all), 7890, 7897, 7898, 7904 to 7906, 7909, 7913, 7914, 7959, 7960, 7963, 8076 to 8081, 8102 to 8110, 8141, 8406, 8411, 8412, 8627, 8959, 9215, 9216, 9258, 9471, 9481.

Interiors (12): 8084 to 8088, 8636, 8637, 8640, 8827 to 8829, 8840.

## Appendix B. Mockups

- `mockup/index.html`: a Three.js sketch of the concept. Real layout from §6.2, block city, route, time slider, clouds, a first Classic Negative grade, hero photo panel. Useful to feel pacing and light; not a code base to build on.
- `mockup/plan.html`: the data set by place and by stop, the route map, the star selection. Served locally with `.claude/launch.json` on port 8765.
