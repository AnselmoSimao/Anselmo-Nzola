import { useState, useRef, useEffect } from 'react';

// Reusable SVG Compass Logo component mimicking the premium Leste Maps brand
function LesteMapsLogo({ className = 'logo-main-svg' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 210" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Core pin gradients */}
        <linearGradient id="pin-grad" x1="100" y1="0" x2="100" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3E9F" />
          <stop offset="50%" stopColor="#0D1B4B" />
          <stop offset="100%" stopColor="#081030" />
        </linearGradient>
        
        {/* Needle/pointer gradient */}
        <linearGradient id="needle-grad" x1="100" y1="35" x2="115" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5DCF5A" />
          <stop offset="100%" stopColor="#3DB54A" />
        </linearGradient>
        
        {/* Shadow filter to add a deep element cutout look */}
        <filter id="shadow-cutout" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. Main outer Location Pin */}
      <path 
        d="M100,6 C66.86,6 40,32.86 40,66 C40,100.3 65,134.5 100,180 C135,134.5 160,100.3 160,66 C160,32.86 133.14,6 100,6 Z" 
        fill="url(#pin-grad)"
        stroke="#0F1F54"
        strokeWidth="1.5"
      />

      {/* 2. Concentric Inner Circle Cutout */}
      <circle cx="100" cy="66" r="26" fill="#FFFFFF" filter="url(#shadow-cutout)" />

      {/* 3. Compass Arrow Needle (pointing Northeast) */}
      {/* Light green half */}
      <polygon points="100,66 116,48 106,66" fill="url(#needle-grad)" />
      {/* Brand green half with shadow edge */}
      <polygon points="100,66 106,66 84,78 96,56" fill="#2E8E38" />

      {/* 4. Origami Folded Map Base */}
      {/* Left green folds */}
      <polygon points="100,180 30,165 65,190" fill="#3DB54A" />
      <polygon points="100,180 65,190 100,202" fill="#2E8E38" />
      
      {/* Right blue folds */}
      <polygon points="100,180 100,202 135,190" fill="#1A2E6F" />
      <polygon points="100,180 135,190 170,165" fill="#0D1B4B" />
    </svg>
  );
}

// Reusable SVG Watermark for ghost overlays
function LocationWatermark({ lightTheme = false }: { lightTheme?: boolean }) {
  const color = lightTheme ? 'currentColor' : '#3DB54A';
  return (
    <svg 
      viewBox="0 0 200 210" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`watermark ${lightTheme ? 'watermark-dark text-navy-deep' : 'watermark-light'}`}
    >
      <path 
        d="M100,6 C66.86,6 40,32.86 40,66 C40,100.3 65,134.5 100,180 C135,134.5 160,100.3 160,66 C160,32.86 133.14,6 100,6 Z" 
        fill="none"
        stroke={color}
        strokeWidth="3.5"
      />
      <circle cx="100" cy="66" r="26" fill="none" stroke={color} strokeWidth="3" />
      <polygon points="100,180 30,165 100,202" fill="none" stroke={color} strokeWidth="2.5" />
      <polygon points="100,180 170,165 100,202" fill="none" stroke={color} strokeWidth="2.5" />
    </svg>
  );
}

export default function App() {
  const [activePillIndex, setActivePillIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const pills = [
    { emoji: '📍', label: 'Google Maps' },
    { emoji: '💬', label: 'WhatsApp Business' },
    { emoji: '⭐', label: 'Gestão de Avaliações' },
    { emoji: '📱', label: 'Redes Sociais' },
    { emoji: '🚀', label: 'Marketing Local' }
  ];

  // Tracking swipe scroll on the pills container to update active navigation dots
  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const totalWidth = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      
      if (totalWidth <= 0) return;
      
      const ratio = scrollLeft / totalWidth;
      const index = Math.round(ratio * (pills.length - 1));
      
      setActivePillIndex(Math.min(pills.length - 1, Math.max(0, index)));
    }
  };

  // Interactive layout scroll action when a indicator dot is tapped
  const scrollToPill = (index: number) => {
    if (carouselRef.current) {
      const children = carouselRef.current.children;
      if (children[index]) {
        children[index].scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
      setActivePillIndex(index);
    }
  };

  // Setup InteractionObserver for elegant viewport entry transitions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -25px 0px'
      }
    );

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="app-container" id="appRoot">
      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="logo-container">
          <LesteMapsLogo />
          <h1 className="brand-title" id="logoText">
            <span className="brand-leste">Leste </span>
            <span className="brand-maps">Maps</span>
          </h1>
        </div>

        <h2 className="consultant-name">Anselmo Simão</h2>
        <p className="consultant-role">Consultor de Presença Digital</p>
        <p className="tagline">“Colocamos o seu negócio no mapa”</p>
        
        {/* Decorative Watermark */}
        <LocationWatermark />
      </section>

      {/* WHAT WE DO / SERVICES */}
      <section className="services" id="servicos">
        <h3 className="section-title navy">O que fazemos</h3>
        <p className="section-subtitle">Aumentamos a sua visibilidade nas plataformas líderes</p>
        
        <div className="pills-slider-container">
          <div 
            className="pills-slider" 
            ref={carouselRef} 
            onScroll={handleCarouselScroll}
            id="pillsCarousel"
          >
            {pills.map((pill, idx) => (
              <div key={idx} className="pill-card" id={`pill-${idx}`}>
                <span className="pill-emoji">{pill.emoji}</span>
                <span>{pill.label}</span>
              </div>
            ))}
          </div>

          <div className="scroll-hint">
            <span>Deslize para o lado</span>
            <span>&rarr;</span>
          </div>

          {/* Dots Indicator Track */}
          <div className="slider-dots" aria-label="Navegação dos serviços">
            {pills.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${activePillIndex === idx ? 'active' : ''}`}
                onClick={() => scrollToPill(idx)}
                aria-label={`Ver serviço ${idx + 1}`}
                id={`dot-btn-${idx}`}
              />
            ))}
          </div>
        </div>

        {/* Localized watermark */}
        <LocationWatermark lightTheme={true} />
      </section>

      {/* CASE STUDIES SECTION */}
      <section className="cases-section" id="casos">
        <div className="cases-intro">
          <span className="badge-top">Casos Reais</span>
          <h3 className="section-title white">A força de estar online</h3>
          <p className="section-subtitle" style={{ color: 'var(--grey-soft)', opacity: 0.8 }}>
            Resultados obtidos por negócios parceiros em Saurimo
          </p>
        </div>

        {/* CASE STUDY #1 */}
        <div className="case-card fade-up" id="case-1">
          <div className="case-badge">Caso #01 / Restauração</div>
          <h4 className="case-client">Restaurante Sabor do Leste</h4>
          <span className="case-info">Alimentação Cozinha Típica &bull; Saurimo Centro</span>
          
          {/* Comparison Flex column */}
          <div className="sub-cards-flex">
            {/* ANTES */}
            <div className="sub-card sub-card-antes" id="case-1-antes">
              <div className="sub-card-header">
                <span>✗ Antes</span>
              </div>
              <ul className="sub-card-list">
                <li>Sem presença no Google</li>
                <li>0 avaliações de clientes</li>
                <li>Invisível para os viajantes</li>
              </ul>
            </div>

            {/* DEPOIS */}
            <div className="sub-card sub-card-depois" id="case-1-depois">
              <div className="sub-card-header">
                <span>✓ Depois</span>
              </div>
              <ul className="sub-card-list">
                <li>Top 3 no Google Maps local</li>
                <li>47 avaliações positivas</li>
                <li>+60% de contactos/mês</li>
              </ul>
            </div>
          </div>

          {/* Visual CSS-only center animated separator */}
          <div className="comparison-divider">
            <div className="comparison-line"></div>
            <div className="comparison-arrow-badge">
              <span className="comparison-arrow">&rarr;</span>
              <span>Evolução Directa</span>
            </div>
          </div>

          {/* Core performance metric showcase */}
          <div className="metric-container" id="metric-1">
            <span className="metric-label">Aumento em Contactos</span>
            <div className="metric-number">+60%</div>
          </div>

          <LocationWatermark />
        </div>

        {/* CASE STUDY #2 */}
        <div className="case-card fade-up" id="case-2">
          <div className="case-badge">Caso #02 / Automóvel</div>
          <h4 className="case-client">Oficina AutoLeste</h4>
          <span className="case-info">Serviços e Mecânica &bull; Bairro Aeroporto</span>

          <div className="sub-cards-flex">
            {/* ANTES */}
            <div className="sub-card sub-card-antes" id="case-2-antes">
              <div className="sub-card-header">
                <span>✗ Antes</span>
              </div>
              <ul className="sub-card-list">
                <li>Morada errada no GPS</li>
                <li>Clientes perdiam o caminho</li>
                <li>Contacto telefónico em falta</li>
              </ul>
            </div>

            {/* DEPOIS */}
            <div className="sub-card sub-card-depois" id="case-2-depois">
              <div className="sub-card-header">
                <span>✓ Depois</span>
              </div>
              <ul className="sub-card-list">
                <li>Ponto GPS exacto no mapa</li>
                <li>+250 rotas pedidas/mês</li>
                <li>Chamada rápida activa</li>
              </ul>
            </div>
          </div>

          <div className="comparison-divider">
            <div className="comparison-line"></div>
            <div className="comparison-arrow-badge">
              <span className="comparison-arrow">&rarr;</span>
              <span>Evolução Directa</span>
            </div>
          </div>

          <div className="metric-container" id="metric-2">
            <span className="metric-label">Busca de Rotas</span>
            <div className="metric-number">+250%</div>
          </div>

          <LocationWatermark />
        </div>

        {/* CASE STUDY #3 */}
        <div className="case-card fade-up" id="case-3">
          <div className="case-badge">Caso #03 / Saúde</div>
          <h4 className="case-client">Clínica Dentária Lunda Sul</h4>
          <span className="case-info">Serviços Médicos &bull; Av. Independência</span>

          <div className="sub-cards-flex">
            {/* ANTES */}
            <div className="sub-card sub-card-antes" id="case-3-antes">
              <div className="sub-card-header">
                <span>✗ Antes</span>
              </div>
              <ul className="sub-card-list">
                <li>Inexistente nas pesquisas</li>
                <li>Sem horário de abertura</li>
                <li>Sem canal para dúvidas</li>
              </ul>
            </div>

            {/* DEPOIS */}
            <div className="sub-card sub-card-depois" id="case-3-depois">
              <div className="sub-card-header">
                <span>✓ Depois</span>
              </div>
              <ul className="sub-card-list">
                <li>Top #1 Clínicas Locais</li>
                <li>Horário oficial online</li>
                <li>Mensagens directas ligadas</li>
              </ul>
            </div>
          </div>

          <div className="comparison-divider">
            <div className="comparison-line"></div>
            <div className="comparison-arrow-badge">
              <span className="comparison-arrow">&rarr;</span>
              <span>Evolução Directa</span>
            </div>
          </div>

          <div className="metric-container" id="metric-3">
            <span className="metric-label">Aumento Pacientes</span>
            <div className="metric-number">+340%</div>
          </div>

          <LocationWatermark />
        </div>
      </section>

      {/* CONTACT / CALL-TO-ACTION SECTION */}
      <section className="contact-section" id="contacto">
        <div className="cta-box">
          <h3 className="cta-title">Pronto para aparecer no mapa?</h3>
          <p className="cta-subtitle">Garanta já a sua presença digital de alta conversão.</p>
        </div>

        {/* Active high-contrast CTAs with strict accessibility labels */}
        <div className="cta-buttons-stack">
          <a 
            href="https://wa.me/244948709117" 
            className="btn btn-primary" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Falar com Anselmo Simão no WhatsApp para fechar negócio"
            id="whatsappCTA"
          >
            <span>WhatsApp &rarr;</span>
          </a>

          <a 
            href="tel:+244948709117" 
            className="btn btn-secondary"
            aria-label="Ligar directamente para Anselmo Simão"
            id="phoneCallCTA"
          >
            <span>Ligar agora</span>
          </a>
        </div>

        <div className="direct-contacts">
          <a href="mailto:contacto@lestemaps.com" className="contact-item email-small" aria-label="Enviar email para Leste Maps">
            <span>✉ contacto@lestemaps.com</span>
          </a>
          
          <div className="map-location-badge">
            <span>📍 Saurimo, Lunda Sul, Angola</span>
          </div>
        </div>

        <LocationWatermark />
      </section>

      {/* FOOTER */}
      <footer>
        <p className="footer-text">
          &copy; 2025 Leste Maps. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
