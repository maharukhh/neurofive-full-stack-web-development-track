# Mahrukh (Archive) — NASA Image & Video Library Search

A small static app that searches NASA's public image archive live, with visible loading and error states and a search/filter UI.

**Live data source:** [images-api.nasa.gov](https://images.nasa.gov) — NASA's Image and Video Library API. No API key required.

# LIVE WEBSITE

https://mahhrukhh.github.io/NASA-image-and-video-library/

## What it does

- Fetches results from `https://images-api.nasa.gov/search` based on a keyword, with optional NASA Center and Year filters
- Shows a "receiving transmission" loading state while the request is in flight
- Shows a "signal lost" error state with a **Retry** button if the request fails or the API errors out
- Shows an empty state if a query returns nothing
- Debounces the search input so it doesn't fire a request on every keystroke
- Guards against race conditions (an older, slower request can't overwrite a newer one)

It's a single static HTML file — no build step, no dependencies, no server required.

## Run it locally

Just open `index.html` in a browser. Or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- The NASA Images API is public and unauthenticated for search — good for demos, but be aware it's rate-limited if you hammer it.
- Thumbnails are pulled from NASA's `images-assets.nasa.gov` CDN via the `preview` link in each search result.
