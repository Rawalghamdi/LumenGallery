import { useState, useMemo, useEffect } from 'react'
import Search from './components/Search.jsx'
import ArtworkCard from './components/ArtworkCard.jsx'
import { useDebounce } from 'react-use'
import { artworks, getTrendingArtworks } from './artworks.js'

const imageCache = {}

const FeaturedItem = ({ artwork, index }) => {
  const [imgSrc, setImgSrc] = useState(imageCache[artwork.metId] || null)

  useEffect(() => {
    if (imageCache[artwork.metId]) {
      setImgSrc(imageCache[artwork.metId])
      return
    }
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artwork.metId}`)
      .then(r => r.json())
      .then(data => {
        const url = data.primaryImageSmall || data.primaryImage || null
        imageCache[artwork.metId] = url
        setImgSrc(url)
      })
      .catch(() => {})
  }, [artwork.metId])

  return (
    <li className="featured-item">
      <span className="feat-num">{String(index + 1).padStart(2, '0')}</span>
      {imgSrc
        ? <img src={imgSrc} alt={artwork.title} className="feat-img" onError={e => { e.target.style.display = 'none' }} />
        : <div className="feat-img-box" />
      }
      <div className="feat-info">
        <p className="feat-title">{artwork.title}</p>
        <p className="feat-artist">{artwork.artist}</p>
      </div>
    </li>
  )
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)

  useDebounce(() => setDebouncedSearch(searchTerm), 350, [searchTerm])

  const featuredArtworks = getTrendingArtworks()
  const styles = ['All', ...new Set(artworks.map(a => a.style))]
  const uniqueArtists = [...new Set(artworks.map(a => a.artist))]

  const filtered = useMemo(() => {
    return artworks.filter(a => {
      const q = debouncedSearch.toLowerCase()
      const matchSearch = !q ||
        a.title.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.style.toLowerCase().includes(q) ||
        a.origin.toLowerCase().includes(q)
      const matchFilter = activeFilter === 'All' || a.style === activeFilter
      return matchSearch && matchFilter
    })
  }, [debouncedSearch, activeFilter])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('')

  return (
    <main>
      <div className="wrapper">

        <nav className="site-nav">
          <div className="nav-logo" onClick={() => scrollTo('top')} style={{ cursor: 'pointer' }}>
            <span className="nav-logo-mark">◆</span>
            <span>Lumen Gallery</span>
          </div>
          <ul className="nav-links">
            {[['About', 'about'], ['Location', 'location'], ['Artists', 'artists'], ['Contact', 'contact']].map(([label, id]) => (
              <li key={id}>
                <button className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
              </li>
            ))}
          </ul>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span className="bar" /><span className="bar" /><span className="bar" />
          </button>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            {[['About', 'about'], ['Location', 'location'], ['Artists', 'artists'], ['Contact', 'contact']].map(([label, id]) => (
              <button key={id} className="mobile-link" onClick={() => scrollTo(id)}>{label}</button>
            ))}
          </div>
        )}

        <header id="top" className="hero-section">
          <div className="hero-eyebrow">Contemporary Art Exhibition</div>
          <h1>Where <em>Art</em> Finds<br />Its Audience</h1>
          <p className="hero-sub">
            {artworks.length} seminal works across {new Set(artworks.map(a => a.style)).size} movements,
            spanning five centuries of human expression.
          </p>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {!debouncedSearch && activeFilter === 'All' && (
          <section className="featured-section">
            <h2>Featured Works</h2>
            <ul className="featured-strip">
              {featuredArtworks.map((artwork, i) => (
                <FeaturedItem key={artwork.id} artwork={artwork} index={i} />
              ))}
            </ul>
          </section>
        )}

        <div className="filter-row">
          {styles.map(s => (
            <button key={s} className={`filter-pill ${activeFilter === s ? 'active' : ''}`} onClick={() => setActiveFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        <section className="gallery-section">
          <div className="gallery-header">
            <h2>
              {debouncedSearch ? `Results for "${debouncedSearch}"` : activeFilter === 'All' ? 'All Works' : activeFilter}
            </h2>
            <span className="gallery-count">{filtered.length} work{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>No works found.</p>
              <button onClick={() => { setSearchTerm(''); setActiveFilter('All') }}>Clear filters</button>
            </div>
          ) : (
            <ul className="gallery-grid">
              {filtered.map(artwork => <ArtworkCard key={artwork.id} artwork={artwork} />)}
            </ul>
          )}
        </section>

        <section id="about" className="info-section">
          <div className="info-section-inner">
            <div className="info-eyebrow">About the Exhibition</div>
            <h2 className="info-heading">Five Centuries of Human Expression</h2>
            <p className="info-body">
              Lumen Gallery brings together twelve of the most significant works in the Western and Eastern canon —
              from Botticelli's mythological allegories to Kandinsky's pure abstraction. This exhibition traces
              the arc of artistic thought across movements, borders, and centuries, presenting each work alongside
              the life and vision of its maker.
            </p>
            <p className="info-body">
              Running Spring through Summer 2025, the exhibition is conceived as a living conversation between
              past and present — an invitation to look slowly, and to see differently.
            </p>
          </div>
        </section>

        <section id="location" className="info-section alt">
          <div className="info-section-inner two-col">
            <div>
              <div className="info-eyebrow">Find Us</div>
              <h2 className="info-heading">Location</h2>
              <p className="info-body">Lumen Gallery is located in the heart of the cultural district, a short walk from the central station.</p>
              <div className="address-block">
                <p>12 Rue des Beaux-Arts</p>
                <p>75006 Paris, France</p>
                <p className="info-hours">Tue – Sun · 10:00 – 18:00</p>
                <p className="info-hours">Closed Mondays & public holidays</p>
              </div>
            </div>
            <div className="map-placeholder">
              <div className="map-pin">◆</div>
              <p>12 Rue des Beaux-Arts</p>
              <p>Paris, France</p>
            </div>
          </div>
        </section>

        <section id="artists" className="info-section">
          <div className="info-section-inner">
            <div className="info-eyebrow">This Season</div>
            <h2 className="info-heading">Featured Artists</h2>
            <div className="artists-grid">
              {uniqueArtists.map(artist => {
                const work = artworks.find(a => a.artist === artist)
                return (
                  <div key={artist} className="artist-card">
                    <div className="artist-card-initials">{getInitials(artist)}</div>
                    <p className="artist-card-name">{artist}</p>
                    <p className="artist-card-origin">{work.origin} · {work.year}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="info-section alt">
          <div className="info-section-inner two-col">
            <div>
              <div className="info-eyebrow">Get in Touch</div>
              <h2 className="info-heading">Contact Us</h2>
              <p className="info-body">For press enquiries, group bookings, or general information, reach us below.</p>
              <div className="contact-list">
                <div className="contact-item">
                  <span className="contact-label">General</span>
                  <span className="contact-value">info@lumengallery.art</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Press</span>
                  <span className="contact-value">press@lumengallery.art</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Bookings</span>
                  <span className="contact-value">+33 1 42 00 00 00</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <input className="form-input" type="text" placeholder="Your name" />
              <input className="form-input" type="email" placeholder="Email address" />
              <textarea className="form-textarea" placeholder="Your message" rows={4} />
              <button className="form-submit">Send Message</button>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <p>◆ Lumen Gallery · Spring/Summer 2025</p>
        </footer>

      </div>
    </main>
  )
}

export default App