import React, { useState, useEffect } from 'react';
import './CidadesAtendidas.css';

export const CidadesAtendidas = () => {
  // Lista de cidades para o carrossel
  const cidades = [
    'Montes Claros',
    'Curvelo',
    'Janaúba',
    'Salinas',
    'Bocaiúva',
    'Januária',
    'Pirapora',
    'São Francisco'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Avançar no carrossel (loop infinito)
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cidades.length);
  };

  // Voltar no carrossel (loop infinito)
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cidades.length) % cidades.length);
  };

  // Rolagem automática infinita a cada 3 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Duplicamos a lista para permitir a rolagem suave contínua
  const listaCidades = [...cidades, ...cidades];

  return (
    <section className="cidades-atendidas">
      <div className="cidades-container">
        
        {/* Badge Superior */}
        <div className="cidades-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>A Mell está perto de você</span>
        </div>

        {/* Título Principal */}
        <h2 className="cidades-title">
          Conectando o Norte de Minas de <br />
          ponta a ponta.
        </h2>

        {/* Subtítulo */}
        <p className="cidades-subtitle">
          A Mell está presente em mais de 50 cidades da região, com cobertura que pode chegar a <br />
          outras localidades e áreas próximas.
        </p>

        {/* CARROSSEL */}
        <div className="cidades-carousel-wrapper">
          
          {/* Seta Esquerda */}
          <button className="carousel-arrow" onClick={handlePrev} aria-label="Cidade anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Janela de Visualização (Viewport que esconde os itens extras) */}
          <div className="cidades-carousel-viewport">
            {/* Trilho (Track) animado com transição suave */}
            <div 
              className="cidades-cards-track"
              style={{
                transform: `translateX(-${currentIndex * (220 + 20)}px)`,
                transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {listaCidades.map((cidade, idx) => (
                <div key={`${cidade}-${idx}`} className="cidade-card">
                  <div className="cidade-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span className="cidade-card-name">{cidade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seta Direita */}
          <button className="carousel-arrow" onClick={handleNext} aria-label="Próxima cidade">
            <svg viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

        </div>

        {/* Paginação Dots */}
        <div className="cidades-dots">
          {cidades.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

        {/* Botão de Ação Azul */}
        <a href="#consultar-cobertura" className="cidades-btn">
          <span>Consultar minha cidade</span>
          <div className="cidades-btn-icon">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </a>

      </div>
    </section>
  );
};

export default CidadesAtendidas;