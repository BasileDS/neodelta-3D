import './AgencySections.css'

const AgencySections = () => {
  return (
    <div className="agency-sections" style={{
      position: 'relative',
      zIndex: 5,
      pointerEvents: 'auto'
    }}>
      {/* Empty 3D Viewing Section */}
      <section className="view-3d-section" style={{
        height: '100vh',
        width: '100%',
        pointerEvents: 'none'
      }}>
      </section>

      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <h2 className="hero-title">Faux contenu pour tester les effet au scroll</h2>
          <p className="hero-subtitle">
            Faux contenu pour tester les effet au scroll
          </p>
          <button className="cta-button">bouton</button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="section-container">
          <h2 className="section-title">Nos Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Design & UX/UI</h3>
              <p>Création d'interfaces modernes et intuitives centrées sur l'expérience utilisateur</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💻</div>
              <h3>Développement Web</h3>
              <p>Applications web performantes avec les technologies les plus récentes (React, TypeScript, Three.js)</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🎭</div>
              <h3>Expériences 3D</h3>
              <p>Intégration d'animations et de visualisations 3D interactives pour captiver vos utilisateurs</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3>Applications Mobiles</h3>
              <p>Développement d'applications mobiles natives et hybrides pour iOS et Android</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚀</div>
              <h3>Performance & SEO</h3>
              <p>Optimisation des performances et du référencement pour maximiser votre visibilité</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Maintenance & Support</h3>
              <p>Accompagnement continu et support technique pour assurer la pérennité de vos projets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio-section" id="portfolio">
        <div className="section-container">
          <h2 className="section-title">Nos Réalisations</h2>
          <div className="portfolio-grid">
            <div className="portfolio-item">
              <div className="portfolio-image placeholder-1"></div>
              <div className="portfolio-info">
                <h3>Projet E-commerce Premium</h3>
                <p>Plateforme de vente en ligne avec visualisation 3D des produits</p>
                <div className="portfolio-tags">
                  <span className="tag">React</span>
                  <span className="tag">Three.js</span>
                  <span className="tag">Node.js</span>
                </div>
              </div>
            </div>
            <div className="portfolio-item">
              <div className="portfolio-image placeholder-2"></div>
              <div className="portfolio-info">
                <h3>Application SaaS</h3>
                <p>Outil de gestion collaborative avec interface moderne</p>
                <div className="portfolio-tags">
                  <span className="tag">TypeScript</span>
                  <span className="tag">WebGL</span>
                  <span className="tag">API REST</span>
                </div>
              </div>
            </div>
            <div className="portfolio-item">
              <div className="portfolio-image placeholder-3"></div>
              <div className="portfolio-info">
                <h3>Site Vitrine Immersif</h3>
                <p>Présentation interactive avec animations 3D et parallax</p>
                <div className="portfolio-tags">
                  <span className="tag">React</span>
                  <span className="tag">GSAP</span>
                  <span className="tag">Responsive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">À Propos de Neodelta</h2>
              <p>
                Nous sommes une équipe passionnée de développeurs, designers et créatifs dédiés à la création d'expériences digitales exceptionnelles. Notre expertise en développement web et en visualisation 3D nous permet de repousser les limites du possible.
              </p>
              <p>
                Avec une approche centrée sur l'innovation et la qualité, nous accompagnons nos clients de la conception à la réalisation de leurs projets les plus ambitieux.
              </p>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Projets réalisés</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">30+</div>
                  <div className="stat-label">Clients satisfaits</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">Années d'expérience</div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-placeholder">
                <div className="rotating-shape"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="section-container">
          <h2 className="section-title">Contactez-nous</h2>
          <p className="contact-subtitle">Un projet en tête ? Discutons-en ensemble</p>
          <div className="contact-content">
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Votre nom" className="form-input" />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Votre email" className="form-input" />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Sujet" className="form-input" />
              </div>
              <div className="form-group">
                <textarea placeholder="Votre message" className="form-textarea" rows={6}></textarea>
              </div>
              <button type="submit" className="submit-button">Envoyer le message</button>
            </form>
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>contact@neodelta.fr</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📱</div>
                <div>
                  <h4>Téléphone</h4>
                  <p>+33 1 23 45 67 89</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h4>Adresse</h4>
                  <p>Paris, France</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Neodelta</h3>
              <p>Créateurs d'expériences digitales immersives</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Services</h4>
                <ul>
                  <li><a href="#services">Design UX/UI</a></li>
                  <li><a href="#services">Développement Web</a></li>
                  <li><a href="#services">Expériences 3D</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Entreprise</h4>
                <ul>
                  <li><a href="#about">À propos</a></li>
                  <li><a href="#portfolio">Portfolio</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Suivez-nous</h4>
                <div className="social-links">
                  <a href="#" className="social-link">LinkedIn</a>
                  <a href="#" className="social-link">Twitter</a>
                  <a href="#" className="social-link">GitHub</a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Neodelta. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AgencySections
