import React from 'react';
import './QuemSomos.css';

// Importação das imagens
import bannerMascote from '../../assets/abelhinhaPipoca.png'; 
import equipeImg from '../../assets/equipe_v3.png'; 
import estruturaImg from '../../assets/estruturaTransparente.png'; 
import atendimentoImg from '../../assets/atendimento_finalCoracao.png';
import experienciaImg from '../../assets/experienciaTransparente.png';

const QuemSomos = () => {
  const cards = [
    {
      id: 'presenca',
      title: 'Presença regional',
      desc: 'Uma estrutura construída para atender cidades do Norte de Minas com proximidade e conhecimento local.',
      image: bannerMascote,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    },
    {
      id: 'equipe',
      title: 'Equipe preparada',
      desc: 'Profissionais que cuidam da instalação, do atendimento e do suporte com atenção em cada etapa.',
      image: equipeImg,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    {
      id: 'estrutura',
      title: 'Estrutura confiável',
      desc: 'Tecnologia e infraestrutura para entregar uma conexão estável para sua rotina.',
      image: estruturaImg,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      )
    },
    {
      id: 'atendimento',
      title: 'Atendimento humano',
      desc: 'Quando você precisar, encontrará uma equipe pronta para ouvir, orientar e resolver.',
      image: atendimentoImg,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    {
      id: 'experiencia',
      title: 'Experiência completa',
      desc: 'Velocidade, suporte, entretenimento, educação e conveniência reunidos em uma única assinatura.',
      image: experienciaImg,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      )
    }
  ];

  return (
    /* Adicionado o id="quem-somos" para o direcionamento do Navbar */
    <section id="quem-somos" className="quem-somos">
      <div className="quem-somos-container">
        
        {/* Badge Superior */}
        <div className="quem-somos-tag" >
          <svg className="check-icon-blue" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8L6.5 11L12.5 4.5" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Internet feita por quem está perto</span>
        </div>

        {/* Título Principal */}
        <h2 className="quem-somos-title">
          Uma empresa da região, conectando <br />
          quem vive na região.
        </h2>

        {/* Subtítulo */}
        <p className="quem-somos-subtitle">
          Não é apenas sobre conectar aparelhos. <br />
          É sobre conectar pessoas, oportunidades e momentos.
        </p>

        {/* Lista de Cards Estilo Banner */}
        <div className="quem-somos-cards-list">
          {cards.map((item) => {
            const isExperiencia = item.id === 'experiencia';

            return (
              <div
                key={item.id}
                className={`card-banner ${isExperiencia ? 'card-banner--mascote' : ''}`}
              >
                <div className="card-banner-content">
                  <div className="card-icon-wrapper">
                    {item.icon}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>

                <div className="card-banner-image">
                  <img src={item.image} alt={item.title} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default QuemSomos;