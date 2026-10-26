import React from 'react';
import './Hero.css';
import heroImg from '../../assets/sentadaNaCadeira.png'; 

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        
        {/* Lado Esquerdo: Conteúdo de Texto */}
        <div className="hero-content">
          <span className="hero-tag">
            Fibra de verdade para você
          </span>

          <h1 className="hero-title">
            Internet rápida é bom. <br className="hide-on-mobile" />
            Internet que acompanha <br className="hide-on-mobile" />
            sua vida é Mell.
          </h1>

          <p className="hero-subtitle">
            Tenha conexão de alta velocidade, suporte 24 horas e benefícios 
            para estudar, trabalhar, assistir e aproveitar muito mais.
          </p>

          <div className="hero-buttons">
            <a href="#disponibilidade" className="btn-primary">
              Consultar disponibilidade
            </a>
            <a href="#planos" className="btn-secondary">
              Conhecer os planos <span>↘</span>
            </a>
          </div>

          <div className="hero-badges">
            <span className="badge">
              <svg 
                className="badge-icon-vector"
                width="9" 
                height="11" 
                viewBox="0 0 9 11" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 1L1 6.5H4.5L3.5 10L8 4.5H4.5L5 1Z" 
                  stroke="#00A1DC" 
                  strokeWidth="1.07" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Fibra óptica
            </span>
            <span className="badge">Suporte 24 horas</span>
            <span className="badge">+50 cidades atendidas</span>
          </div>
        </div>

        {/* Lado Direito: Imagem Principal */}
        <div className="hero-image-container">
          <img src={heroImg} alt="Mãe e filha conectadas no sofá" className="hero-image" />
        </div>

      </div>

      {/* Card Laranja de Destaque na Base */}
      <div className="hero-bottom-card">
        {/* Item 1: Foguete */}
        <div className="card-item">
          <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z"/>
          </svg>
          <p>Internet para tudo<br className="hide-on-mobile" />acontecer melhor</p>
        </div>

        <div className="card-divider"></div>

        {/* Item 2: Relógio */}
        <div className="card-item">
          <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <p>Suporte disponível a<br className="hide-on-mobile" />qualquer hora</p>
        </div>

        <div className="card-divider"></div>

        {/* Item 3: Localização */}
        <div className="card-item">
          <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p>Atendimento que<br className="hide-on-mobile" />conhece sua região</p>
        </div>

        <div className="card-divider"></div>

        {/* Item 4: Família / Usuários */}
        <div className="card-item">
          <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p>Benefícios para toda<br className="hide-on-mobile" />a família</p>
        </div>
      </div>

    </section>
  );
};

export default Hero;