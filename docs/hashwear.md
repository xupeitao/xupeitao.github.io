# Maintaining Hashwear

`Design_Hashwear.html` is a standalone, build-free project linked from `GraphicDesign.html`.
All photo editing and PNG export happen locally in the visitor's browser. There
is no upload endpoint, analytics event, external editor, or photo storage.

After an upload, the editor selects “Your photo”: visitors can drag, resize,
rotate and position the photo. Accessories move with it. Choose “Accessories”
to edit a head, shoulder or cheek layer independently.

## Portrait background removal

“Remove photo background” loads the local MediaPipe runtime and selfie model
in a Web Worker. The photo is resized to at most 1600 pixels on its longest
edge for cutout; the final square export remains 1200 × 1200. “Restore original
photo” restores the original pixels without changing the pose or accessories.
Changing photos invalidates any cutout already in progress.

The local runtime is pinned to MediaPipe Tasks Vision 1.2.2. Model and license
information are in `assets/vendor/mediapipe/README.md`. Cutout needs Web Workers,
OffscreenCanvas, ImageBitmap and WebAssembly, and must be opened over HTTP(S).
The model separates people from their surroundings; complex backgrounds, fine
hair, and non-person subjects can produce imperfect results. A transparent PNG
can also be used directly.

## Add an accessory

1. Put a transparent PNG in `assets/images/portrait-accessories-v1/`, or put a new
   collection image under `assets/images/hashwear/`.
2. Append an item to `items` in `assets/js/hashwear-catalog.js`:

```js
{
    id: 'little-cloud',             // Unique, URL/file-friendly name
    name: 'Little cloud',
    category: 'nature',             // hats, nature, companions, extras, flags, hashflags
    note: 'A little daydream.',
    file: 'little-cloud.png',
    head: { width: 40, anchor: 80, tilt: 0, y: 7 }
}
```

For images outside the original portrait-accessory folder, use a full local
`src` such as `assets/images/hashwear/orbit-buddy.png` instead of `file`.
For third-party Hashflags, include a `source` URL. The page builds the credit
list automatically. Source provenance is recorded in
`assets/images/hashwear/sources.json`. Original 72px campaign PNGs remain in the
`hashflags/` folder. The gallery and homepage use transparent high-resolution
redraws in `hashflags/hd/`, clearly noted in the artwork credits. All images are
served locally so they can be included in Canvas exports.

`width` is a percentage of the displayed photo's width. `anchor` is the vertical
contact point within the accessory's complete transparent image, in percent
(80 means the point 80% down the image touches the hair). `tilt` is degrees.
`y` is the head contact position as a percentage down the displayed photo.
These values also seed shoulder presets; visitors can freely adjust any spot.
Keep the artwork's transparent margins when calibrating these values.

The gallery, filters and count update automatically. Test the new image on the
default portrait, an uploaded photo and a narrow screen. Assets should be
same-origin so Canvas can export them. The homepage reads this same catalog
before `assets/js/portrait-accessories.js`; adding an item here also adds it to
the portrait's click-to-change rotation. The introduction remains sprout,
antlers, undecorated, then crown, followed by the full collection at random.

## Local preview and checks

Serve the repository root with an ordinary static HTTP server and open
`Design_Hashwear.html`. Browsers may prevent Canvas export from `file://` URLs.
No package install or build step is needed.

- Select each accessory and each category filter.
- Add a head, shoulder and cheek accessory together; switch between them.
- Drag and use arrow keys, size, rotation and position controls.
- Remove/reset one accessory without affecting the other two.
- Choose a JPG, PNG or WebP, then return to the default portrait.
- Drag, resize and rotate the photo; accessories should follow, including when
  moving partly outside the square and back again.
- Remove the background of a portrait, restore the original, and switch photos
  while cutout is running. Old results must not replace a newer photo.
- Test invalid, oversized and corrupt files; the current picture should remain.
- Save an opaque and transparent 1200 × 1200 PNG. Editor outlines must be absent.
- Check the Graphic Design entry, return links and mobile navigation.
