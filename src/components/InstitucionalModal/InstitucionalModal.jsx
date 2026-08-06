// src/components/InstitucionalModal/InstitucionalModal.jsx
import React, { useState } from 'react';
import './InstitucionalModal.css';
import { FaPlay, FaYoutube, FaCheckCircle, FaUsers, FaRocket, FaShieldAlt, FaWifi, FaTimes } from 'react-icons/fa';

export const InstitucionalModal = ({ isOpen, onClose }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // ID do vídeo do YouTube (substitua pelo ID do seu vídeo institucional)
  const VIDEO_ID = 'dQw4w9WgXcQ';

  if (!isOpen) return null;

  return (
    <div className="institucional-modal-overlay" onClick={onClose}>
      <div className="institucional-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="institucional-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="institucional-modal-scroll">
          {/* Header */}
          <div className="institucional-modal-header">
            <span className="institucional-modal-tag">✦ Sobre nós</span>
            <h2 className="institucional-modal-title">
              Conectando pessoas e transformando vidas
            </h2>
            <p className="institucional-modal-subtitle">
              Conheça a história da Mell Internet e como estamos revolucionando 
              a conexão no Norte de Minas Gerais.
            </p>
          </div>

          {/* Vídeo */}
          <div className="institucional-modal-video">
            <div className="video-wrapper-institucional">
              {!videoLoaded ? (
                <div className="video-placeholder-institucional">
                  <img 
                    src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`} 
                    alt="Vídeo Institucional Mell Internet"
                    className="video-thumbnail-institucional"
                  />
                  <button 
                    className="play-button-institucional"
                    onClick={() => setVideoLoaded(true)}
                  >
                    <FaPlay className="play-icon-institucional" />
                  </button>
                  <div className="video-overlay-institucional">
                    <span className="video-label-institucional">Vídeo Institucional</span>
                    <FaYoutube className="youtube-icon-institucional" />
                  </div>
                </div>
              ) : (
                <div className="video-iframe-wrapper-institucional">
                  <iframe
                    src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="Vídeo Institucional Mell Internet"
                    className="video-iframe-institucional"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* História */}
          <div className="institucional-modal-historia">
            <div className="historia-content-institucional">
              <div className="historia-texto-institucional">
                <span className="historia-tag-institucional">✦ Nossa história</span>
                <h3 className="historia-title-institucional">
                  Mais que internet, uma conexão com você
                </h3>
                <p className="historia-descricao-institucional">
                  A Mell Internet nasceu com o propósito de levar conectividade de qualidade 
                  para o Norte de Minas Gerais. Fundada em 2020, nossa missão é proporcionar 
                  uma experiência digital completa, com internet de alta velocidade, 
                  benefícios exclusivos e atendimento humanizado.
                </p>
                <p className="historia-descricao-institucional">
                  Acreditamos que a internet vai além da conexão - é sobre aproximar pessoas, 
                  impulsionar negócios e criar oportunidades. Por isso, investimos 
                  constantemente em tecnologia de ponta e em uma equipe preparada para 
                  oferecer o melhor suporte aos nossos clientes.
                </p>
                
                <div className="historia-stats-institucional">
                  <div className="stat-item-institucional">
                    <span className="stat-number-institucional">4+</span>
                    <span className="stat-label-institucional">Anos de mercado</span>
                  </div>
                  <div className="stat-item-institucional">
                    <span className="stat-number-institucional">15K+</span>
                    <span className="stat-label-institucional">Clientes ativos</span>
                  </div>
                  <div className="stat-item-institucional">
                    <span className="stat-number-institucional">99.9%</span>
                    <span className="stat-label-institucional">Disponibilidade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="institucional-modal-valores">
            <div className="valores-header-institucional">
              <span className="valores-tag-institucional">✦ Nossos valores</span>
              <h3 className="valores-title-institucional">
                O que nos torna diferentes
              </h3>
            </div>

            <div className="valores-grid-institucional">
              <div className="valor-card-institucional">
                <div className="valor-icon-institucional">
                  <FaWifi />
                </div>
                <h4 className="valor-title-institucional">Tecnologia de ponta</h4>
                <p className="valor-desc-institucional">
                  Utilizamos a mais moderna infraestrutura de fibra óptica e equipamentos 
                  de última geração para garantir a melhor performance.
                </p>
              </div>

              <div className="valor-card-institucional">
                <div className="valor-icon-institucional">
                  <FaUsers />
                </div>
                <h4 className="valor-title-institucional">Atendimento humanizado</h4>
                <p className="valor-desc-institucional">
                  Nossa equipe está sempre pronta para ouvir e atender suas necessidades 
                  com empatia e agilidade.
                </p>
              </div>

              <div className="valor-card-institucional">
                <div className="valor-icon-institucional">
                  <FaRocket />
                </div>
                <h4 className="valor-title-institucional">Inovação constante</h4>
                <p className="valor-desc-institucional">
                  Estamos sempre em busca de novas soluções e benefícios para melhorar 
                  a experiência dos nossos clientes.
                </p>
              </div>

              <div className="valor-card-institucional">
                <div className="valor-icon-institucional">
                  <FaShieldAlt />
                </div>
                <h4 className="valor-title-institucional">Confiança e transparência</h4>
                <p className="valor-desc-institucional">
                  Atuamos com ética, clareza e compromisso, construindo relações duradouras 
                  com nossos clientes.
                </p>
              </div>
            </div>
          </div>

          {/* MVV */}
          <div className="institucional-modal-mvv">
            <div className="mvv-grid-institucional">
              <div className="mvv-card-institucional missao-institucional">
                <div className="mvv-icon-institucional">🎯</div>
                <h4 className="mvv-title-institucional">Nossa Missão</h4>
                <p className="mvv-desc-institucional">
                  Oferecer internet de alta qualidade e benefícios exclusivos que 
                  conectem pessoas e impulsionem o desenvolvimento do Norte de Minas.
                </p>
              </div>

              <div className="mvv-card-institucional visao-institucional">
                <div className="mvv-icon-institucional">👁️</div>
                <h4 className="mvv-title-institucional">Nossa Visão</h4>
                <p className="mvv-desc-institucional">
                  Ser referência em conectividade e inovação na região, transformando 
                  a vida das pessoas através da tecnologia.
                </p>
              </div>

              <div className="mvv-card-institucional valores-institucional">
                <div className="mvv-icon-institucional">💎</div>
                <h4 className="mvv-title-institucional">Nossos Valores</h4>
                <ul className="mvv-lista-institucional">
                  <li><FaCheckCircle /> Inovação</li>
                  <li><FaCheckCircle /> Qualidade</li>
                  <li><FaCheckCircle /> Transparência</li>
                  <li><FaCheckCircle /> Compromisso</li>
                  <li><FaCheckCircle /> Humanização</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="institucional-modal-cta">
            <div className="cta-content-institucional">
              <h3 className="cta-title-institucional">
                Faça parte da nossa história
              </h3>
              <p className="cta-desc-institucional">
                Escolha o plano Mell ideal para você e descubra uma nova 
                experiência de conexão.
              </p>
              <a href="#planos" className="cta-button-institucional" onClick={onClose}>
                Conheça nossos planos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitucionalModal;