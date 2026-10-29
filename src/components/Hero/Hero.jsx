// src/components/Hero/Hero.jsx
import React from 'react';
import './Hero.css';
import heroImg from '../../assets/sentadaNaCadeira.png';
import { useViabilidade } from '../../context/ViabilidadeContext';

export const Hero = () => {
  // 👇 Puxa apenas a função que abre o modal global
  const { abrirModal } = useViabilidade();

  return (
    <section className="hero">
      <div className="hero-container">
        {/* Lado Esquerdo: Conteúdo de Texto */}
        <div className="hero-content">
          <span className="hero-tag">Fibra de verdade para você</span>

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
            <button
              type="button"
              className="btn-primary"
              onClick={abrirModal}
            >
              Consultar disponibilidade
            </button>
            <a href="#planos" className="btn-secondary">
              Conhecer os planos <span>↘</span>
            </a>
          </div>

          {/* 👇 BADGES ATUALIZADAS 👇 */}
          <div className="hero-badges">
            {/* Fibra óptica */}
            <span className="badge">
              <svg
                className="badge-icon-vector"
                width="11"
                height="12"
                viewBox="0 0 9 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L1 6.5H4.5L3.5 10L8 4.5H4.5L5 1Z"
                  stroke="#00A1DC"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Fibra óptica
            </span>

            {/* Suporte 24 horas (Ícone de Fone de Ouvido) */}
            <span className="badge">
              <svg
                className="badge-icon-vector"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="#00A1DC"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12v6c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H4v-2c0-4.41 3.59-8 8-8s8 3.59 8 8v2h-2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-6c0-5.52-4.48-10-10-10zm-6 14H4v-2h2v2zm14 0h-2v-2h2v2z"/>
              </svg>
              Suporte 24 horas
            </span>

            {/* +50 cidades atendidas (Ícone de Pin de Localização) */}
            <span className="badge">
              <svg
                className="badge-icon-vector"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="#00A1DC"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              +50 cidades atendidas
            </span>
          </div>
        </div>

        {/* Lado Direito: Imagem Principal */}
        <div className="hero-image-container">
          <img src={heroImg} alt="Mãe e filha conectadas no sofá" className="hero-image" />
        </div>
      </div>

      {/* Card Laranja de Destaque na Base */}
      <div className="hero-bottom-card">
        <div className="card-item">
          <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z"/>
          </svg>
          <p>Internet para tudo<br className="hide-on-mobile" />acontecer melhor</p>
        </div>

        <div className="card-divider"></div>

        <div className="card-item">
          <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <p>Suporte disponível a<br className="hide-on-mobile" />qualquer hora</p>
        </div>

        <div className="card-divider"></div>

        <div className="card-item">
          <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p>Atendimento que<br className="hide-on-mobile" />conhece sua região</p>
        </div>

        <div className="card-divider"></div>

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