import React from 'react';
import './CtaEndereco.css';

export const CtaEndereco = () => {
  return (
    <section className="cta-endereco">
      <div className="cta-endereco-card">
        
        {/* Título */}
        <h2 className="cta-endereco-title">
          Sua casa já tem internet, mas você realmente tem toda a <br />
          qualidade e benefícios que a Mell entrega hoje?
        </h2>

        {/* Subtítulo */}
        <p className="cta-endereco-subtitle">
          Mais velocidade para trabalhar. Mais estabilidade para assistir. Mais conteúdo para aproveitar. Mais <br />
          oportunidades para aprender. Leva menos de um minuto para consultar.
        </p>

        {/* Botão Laranja */}
        <a href="#consultar-cobertura" className="cta-endereco-btn">
          <span>Descobrir se a Mell atende meu endereço</span>
          <div className="cta-endereco-btn-icon">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="#FF801E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </a>

      </div>
    </section>
  );
};

export default CtaEndereco;