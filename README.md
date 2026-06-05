# Lumen Gallery

A contemporary art exhibition website built with React, Vite, and Tailwind CSS.

**Live site:** https://rawalghamdi.github.io/LumenGallery/

## About

Lumen Gallery started as a React movie browsing app and I redesigned it into a fictional art gallery. The goal was to practise component architecture, API fetching, CSS layout, and deploying a React app — all in one project.

The gallery shows twelve works from artists like Van Gogh, Vermeer, Monet, and Degas. Artwork images are fetched live from the Metropolitan Museum of Art's free public API, so no API key is needed and nothing is hardcoded.

## Features

- 12 artworks across 5 art movements
- Filter by style
- Search by title, artist, origin or style
- Images fetched live from the Met Museum Open Access API
- Shimmer skeleton while images load
- Smooth scroll navbar — About, Location, Artists, Contact
- Light mode only
- Mobile responsive

## Stack

- React 18
- Vite 6
- Tailwind CSS v4
- react-use
- Met Museum Open Access API

## Run locally

Node.js v18 or higher required.

```bash
git clone https://github.com/rawalghamdi/LumenGallery.git
cd LumenGallery
npm install
npm run dev
```

Open http://localhost:5173


## Structure

src/
├── App.jsx
├── artworks.js
├── index.css
├── main.jsx
└── components/
├── ArtworkCard.jsx
└── Search.jsx


## Credits

Artwork images via the Metropolitan Museum of Art Open Access collection — metmuseum.org
