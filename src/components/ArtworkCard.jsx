import React, { useState, useEffect } from 'react'

const FALLBACK_ART = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f0e9de'/%3E%3Crect x='80' y='80' width='240' height='240' fill='none' stroke='%23d9cfc4' stroke-width='1.5'/%3E%3Ctext x='200' y='420' text-anchor='middle' font-family='Georgia%2Cserif' font-size='13' fill='%238c7b6e'%3EImage unavailable%3C%2Ftext%3E%3C%2Fsvg%3E`

const imageCache = {}

const getInitials = (name) =>
  name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('')

const ArtworkCard = ({ artwork }) => {
  const { title, artist, year, medium, style, origin, metId } = artwork

  const [imgSrc, setImgSrc] = useState(imageCache[metId] || null)
  const [loading, setLoading] = useState(!imageCache[metId])

  useEffect(() => {
    if (imageCache[metId]) {
      setImgSrc(imageCache[metId])
      setLoading(false)
      return
    }
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${metId}`)
      .then(r => r.json())
      .then(data => {
        const url = data.primaryImageSmall || data.primaryImage || FALLBACK_ART
        imageCache[metId] = url
        setImgSrc(url)
      })
      .catch(() => {
        imageCache[metId] = FALLBACK_ART
        setImgSrc(FALLBACK_ART)
      })
      .finally(() => setLoading(false))
  }, [metId])

  return (
    <div className="artwork-card">
      <div className="artwork-img-wrap">
        {loading ? (
          <div className="img-skeleton" />
        ) : (
          <img
            src={imgSrc || FALLBACK_ART}
            alt={title}
            onError={e => { e.target.src = FALLBACK_ART }}
          />
        )}
        <div className="artwork-overlay">
          <span className="style-tag">{style}</span>
        </div>
      </div>

      <div className="artwork-body">
        <h3>{title}</h3>
        <div className="artist-row">
          <div className="artist-initials">{getInitials(artist)}</div>
          <div>
            <p className="artist-name">{artist}</p>
            <p className="artist-meta">{origin} · {year}</p>
          </div>
        </div>
        <p className="medium-tag">{medium}</p>
      </div>
    </div>
  )
}

export default ArtworkCard