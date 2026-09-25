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
| 8683, 8704 | Smetana embankment looking west (8683); Mánes Bridge looking south (8704) | Charles Bridge, towers, evening grade |
| 8849 | On Charles Bridge looking upstream | Pedal boats, river colour, Střelecký island |
| 8607, 8608 | Old Town Square, south-west corner, below the astronomical clock | Týn, the square |
| 8903 | Charles Bridge west end, overcast | Lesser Town towers |
| 8942 | Malostranské náměstí | St Nicholas, tram |
| 8158 | Jiráskovo náměstí, the corner of the Rašín embankment | Dancing House, tram |
| 8809 | Charles Bridge near the Old Town end, looking north-west (first listed as the Rudolfinum embankment; the solved viewpoint, §12.1, put it on the bridge) | Castle and Malá Strana waterfront across the water |
| 8082, 8777, 8884 | Malá Strana streets and roofs | Plaster colours, dormers, chimneys |
| 8825 | Kampa looking at the weir | Petřín as backdrop, foam |
| 8490 | Legion Bridge looking north | Castle, island, cumulus |
| 8440 | Střelecký island looking at Legion Bridge | Tram, bridge, hill |
| 8725 | Petřín meadow and orchard | Season, greens |
| 8722 | Petřín, roses on a wall | Season, red |
| 9369 | Letná lawn looking up | The sky |
| 9486 | Letná looking south | All bridges, late light |
| 8694, 8988 | Charles Bridge at golden hour, Jiráskův bridge at pastel dusk | Evening grades |
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
| Land use | OSM `leisure=park`, `landuse=forest`, `natural=wood`, `landuse=orchard`, `leisure=garden`, `landuse=grass` | Vegetation placement |
| Tram network | OSM `railway=tram`, tram routes 9, 12, 17, 20, 22, 23 | Tram paths and overhead wire poles |
| Streets | OSM highways with `surface=cobblestone` where tagged | Road textures, tram streets |
| Bridges | OSM with `bridge=yes`, `man_made=bridge` | Span geometry and piers |
| Districts | OSM cadastral areas (`boundary=cadastral`: Malá Strana, Staré Město, Josefov, Hradčany, Nové Město, Vyšehrad, Smíchov, and the 19th-century districts) | District rules of §7.2 and §8.1 |
| Street lamps | OSM `highway=street_lamp` | Lamp posts, and the night lights of M4 |
| City walls | OSM `barrier=city_wall`, `historic=citywalls` | Vyšehrad's ramparts (§7.1) |

A build script (`tools/fetch-data.ts`) downloads and caches raw data in `cache/` (git-ignored). OSM comes from the extract by default: on 2026-09-25 the public Overpass servers timed out on most requests and then refused connections, while the extract is a single 73 MB download that the script filters in seconds; `--overpass` switches back. Buildings use OSM's `building:part` elements where mappers drew them (an outline with parts is drawn as its parts), which gives the churches and towers their real massing even as blocks. Then a second script (`tools/build-world.ts`) turns it into binary files under `public/world/` (8.5 MB gzipped for M0) and writes `cache/preview.png`, a top-down map with the route, for checking a build by eye. The app never calls a map service at runtime.

The horizon uses DMR 5G too, not the Copernicus DEM of the first draft: Copernicus is a surface model that includes buildings and trees, and the whole 16 km horizon lies inside Czechia, where DMR 5G is bare earth throughout. The built world is the rectangle x −5000 to 5000, north −5000 to 4000 (1 km tiles), inside the OSM box above; beyond it only the horizon terrain.

The app shows the attribution the data licences require: OpenStreetMap contributors (ODbL) and ČÚZK (CC BY 4.0).

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

Vyšehrad's ramparts are retaining walls 10 to 15 m high, which the 5 m terrain grid smears into slopes. Each wall on OSM's line (`barrier=city_wall`) is built as a solid rampart: a battered brick face, a parapet, and the grassed walk behind it, 14.5 m deep. The build lowers the terrain at the foot of the face and for 7 m behind it, under the walk, so no slope of the grid lies in front of the brick.

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
- **Dormers** (19,900) are placed along eaves that face a street or courtyard, not on party walls, alternating small gabled and large gabled or flat ones, at the district density (1.0 per 10 m in Malá Strana, 0.6 in the New Town, 0.15 in the 19th-century blocks); **chimneys** (30,500) stand on ridges and on the tops of party gables; flat roofs carry a few machine-room boxes (5,400).
- **Colour** follows rule 5, with `roof:colour` and `roof:material` snapped to the palette where tagged. Copper belongs to churches and palaces: untagged ordinary roofs draw terracotta and slate only.
- **Weathering** is drawn in the building shader instead of an atlas: tile courses and joints filtered by distance, world-space noise patches, lighter ridges, lichen on north slopes; valleys darken through the ambient occlusion of §11.

### 8.2 Facades

Procedural: storey count from OSM or footprint area, window grid with district-specific rhythm (Malá Strana: small windows, deep reveals, 2 to 3 storeys; Old Town: 3 to 4 storeys, arcades on the square; New Town embankments: 5 to 6 storeys, tall windows, balconies, Art Nouveau cornices), plaster colour from the district palette (§8.9), ground-floor darkening, a cornice line, shutters occasionally. No text, no signs.

As built in M2: the windows are drawn in the shader from wall coordinates (along the wall, height above ground, the eave) and five styles (`src/core/buildings.ts`): baroque, Old Town, block, modern, house. Each wall gets as many window columns as fit, centred; storeys divide the height below the cornice evenly; the ground floor has shopfronts or plain windows by style; a cornice and a string course; glass dark with a little variation per window, and glossy, so it takes the sky at a glance. Party walls are blank and a shade greyer, which shows where a building rises above its neighbour. Every pattern is box-filtered to its own pixel size, so it fades to its average instead of shimmering. Balconies, shutters and the Old Town Square arcades are not built yet; the square's houses come with the square in M3.

### 8.3 Streets and squares

Cobble texture in the core, asphalt elsewhere, tram rails inlaid where tram lines run, lamp posts as instanced props on embankments and bridges. Old Town Square, Malostranské náměstí, Kampa and the embankments get their own paving patterns. Náplavka has the barrel-vaulted cellar doors along the embankment wall and moored boats.

As built in M2: the ground shader draws small setts on cobbled streets, larger setts with a lighter granite grid on squares and pedestrian areas, grain on asphalt and gravel, each fading to its average with distance. Tram rails are steel strips on 242 km of OSM tram track, off the bridges until M4 builds the bridges; 5,750 lamp posts stand where OSM's lamp register puts them, on the ground or on a bridge deck. Both are drawn within about a kilometre of the camera. Náplavka's cellar doors and boats come with the river and its embankment walls (M4).

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
- Not yet: the islands' trees (M5), the pontoon and the boats (M6).

### 8.6 Sky, sun, clouds

- Physically based sky from precomputed scattering tables (transmittance, multiple scattering and a sky view table, after Hillaire 2020), tuned per light family (aerosol amount, sky saturation), then graded. Not Hosek-Wilkie or Preetham as first written: both are fitted for the sun above the horizon only and have no twilight, and the flight ends in the blue hour, whose deep blue comes from ozone absorption with the sun below the horizon. The same tables give the sunlight's colour through the air and the haze colour, so sun, sky and haze agree at every hour.
- Sun disc with a soft glare, no lens flare streaks.
- **Clouds**: cumulus as raymarched impostors or layered billboards with proper lighting (lit tops, shaded bases), base 1200 to 1800 m above the river, drifting with a wind of 3 to 8 m/s from the west-south-west. Coverage rolled per session between 5% and 65%. Clouds cast shadows on the city through the shadow map or a projected cloud-shadow texture; the shadow movement is essential. As built: a raymarched layer at half resolution over a 2D coverage map and two tiling 3D noises; shadows come from the same coverage map projected along the sun, so they move with the clouds. The rolled coverage is the afternoon peak: cumulus build through the late morning and thin out after 18:00, so the dawn of §5.3 is clear; the coverage shown never leaves 5 to 65%.
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
| 1 | Vyšehrad, take-off | 0 | 06:20 | 720, −2950, 340 | 458, −2446, 40 | wide | Hold 4 s high above the fortress looking north, then start north |
| 2 | Down the Vltava | 20 | 07:15 | 300, −2300, 220 | 60, −1750, 10 | wide | Descend along the river, railway bridge and Palacký bridge below, rowers |
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
| 18 | Vyšehrad, blue hour | 345 | 21:45 | 760, −2850, 380 | 458, −2446, 40 | wide | Arrive above the rock as the lights come on and hold |

Leg speeds run from about 20 m/s in the Old Town orbit to about 65 m/s on the long sweeps from Wenceslas Square to Letná and from Letná back up the river; the sweeps are high and wide, so the ground speed reads as a glide. The last leg has 43 s so that the arrival slows down.

The spline is timed: each stop is a knot at its time `t`, knot velocities are the three-point derivative (zero at the first and last stop), and altitude uses monotone tangents so the drone never sinks below a low stop between two higher ones. Where the route doubles back (stops 12, 14, 15) the drone nearly stops and the next leg peaks near 90 m/s at 200 to 300 m up; `tools/check-route.ts` prints the timeline. Stops 8 and 9 were moved on 2026-09-25 when the Lesser Town Bridge Towers turned out to stand 78 m north of their first coordinate (§6.2): stop 8 now looks at the towers, and stop 9 sits above the bridge deck 100 m east of them, over Kampa, so the descent passes north of the towers rather than through them, looking down the bridge to the Old Town tower.

The route does not loop. At stop 18 the drone holds above Vyšehrad in the blue hour, drifting very slowly, clouds and river still moving, until the user presses a key. Arrows hand over manual control there; Enter restarts the flight from stop 1 at dawn. Fast mode uses the same table with `t / 2`.

---

## 10. Interface

### 10.1 Screen

Nearly nothing. The render fills the window. Elements:

- Top left: the word PRAHA, a one-line subtitle, and a mode chip (AUTO 6:00, FAST 3:00, MANUAL).
- Top right: the clock, sun elevation, cloud coverage, altitude. Small, tabular numbers.
- Bottom centre: the landmark name in Czech with a one-line English subtitle, fading in as the drone approaches and out as it leaves.
- Bottom: a thin time-of-day slider with a checkbox "day advances with flight", mode buttons, and a key hint that hides after 20 s.
- Intro overlay on load: PRAHA, EARLY SUMMER, "click to fly". Auto mode starts under the overlay so the city is already moving when it lifts.
- Bottom right, very small: the data attribution (OpenStreetMap contributors, ČÚZK), which the licences require.

Typography: a neutral grotesk (Helvetica Neue or Inter), letter-spaced small caps for labels, white at 90% with a soft shadow. Accent colour is a warm gold `#f0c26a`, used only for the mode chip and the slider thumb.

### 10.2 Loading

Under 8 s on a fast connection: a first frame with terrain, river, sky and Tier 3 blocks appears within 3 s; Tier 2 roofs and Tier 1 landmarks stream in over the next 5 s while the drone is still high above Vyšehrad, where detail is small. Textures load progressive. Total transfer budget 60 MB, cached.

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
| Instancing | InstancedMesh for buildings (grouped by district and material), trees, props, people | Draw call budget under 600 |
| Shadows | Cascaded shadow maps for buildings from three.js's `SunLight` (2 cascades of 2048 to 2.8 km), a heightfield shadow for the terrain computed on the GPU when the sun moves, and the cloud-shadow projection | Long morning shadows need reach. As built in M1: three r186 ships a two-cascade sun; 4096 cascades cost a millisecond more on an M2 for little visible gain. Hills shading the city (Petřín in the evening) come from the heightfield at any distance and softly; terrain in the cascades cost 3 ms a frame |
| Reflections | Planar reflection for the river. As built in M4: at 40% resolution, every other frame, within 2.2 km, the sky and clouds computed by the water shader (§8.5) | The evening frames depend on it |
| Hosting | Static, any CDN | No backend |

Performance targets: 60 fps at 2560 × 1600 on an M1 Pro or better in Chrome and Safari; 30 fps floor on an Intel MacBook with integrated graphics with a "lite" preset (no SSAO, half-res reflections, fewer clouds). Memory under 1.5 GB.

Repository layout:

```
design.md            this document
Photos/              the reference set (422) and _excluded/
mockup/              index.html (3D sketch), plan.html (set + route), set/ thumbnails
data/                hero.json (starred frames), viewpoints.json, route.json, palette.json, landmarks.json
tools/               fetch-data.ts, build-world.ts, check-route.ts, find-landmarks.ts, make-lut.ts, lut-fit.ts, compare.ts;
                     lib/ roofs.ts, skeleton.ts, props.ts, plan.ts (+ plan-worker.ts), districts.ts, river.ts;
                     landmarks/ kit.ts, index.ts, parts.ts, bridges.ts, and one module per landmark or group (§7.1)
cache/               raw downloads from fetch-data.ts (generated, git-ignored)
assets/              lut/classic-neg.cube
src/                 app: core/ (incl. buildings.ts, shared with the build), world/ (terrain, tiles, buildings and their
                     material, landmarks, streets, water, lights), sky/ (atmosphere, families, clouds, shadows),
                     render/ (post, the river's mirror), drone/, ui/,
                     dev/ (side-by-side, development only)
public/world/        built tiles (generated, git-ignored)
compare/             side-by-side sheets from tools/compare.ts (generated, git-ignored)
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

### 12.2 Motion tests

- Fly the full auto route at 1× and 2× with no hitches over 33 ms.
- Fly manually for 5 minutes at Shift speed around the core without leaving the world or clipping through geometry.
- Reseed clouds 20 times: coverage stays within 5 to 65%, and cloud shadows always move.
- Slide time from 04:30 to 23:00 continuously: no popping of lights, sky or grade.

### 12.3 Colour statistics (assistive, not a gate)

For each hero pair, compute Lab histograms of the photograph and the render, excluding sky masks, and report ΔE between the dominant clusters. Used by `tools/lut-fit.ts` to refine the LUT and reported in the compare sheet. Not a gate, because composition differences move the numbers; the human judgement in §12.1 is the gate.

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
