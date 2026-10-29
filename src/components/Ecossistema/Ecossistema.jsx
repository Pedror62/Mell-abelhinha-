import React from 'react';
import './Ecossistema.css'; // 👈 O CSS correto do Ecossistema
import experienciaImg from '../../assets/imagemcelular.png';
import { useViabilidade } from '../../context/ViabilidadeContext';

export const Ecossistema = () => {
  const { abrirModal } = useViabilidade();

  const beneficios = [
    {
      id: 'watch',
      title: 'WATCH Mell',
      desc: 'Mais de 30 mil horas de filmes, séries, programas, desenhos, esportes e canais ao vivo nos planos elegíveis.',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )
    },
    {
      id: 'leveduca',
      title: 'Leveduca',
      desc: 'Mais de 250 cursos profissionalizantes, biblioteca digital e acesso a oportunidades de emprego.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      )
    },
    {
      id: 'kidsa',
      title: 'Kidsa',
      desc: 'Curso de inglês online para crianças de 2 a 12 anos, com metodologia divertida e interativa, disponível em planos elegíveis.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      )
    },
    {
      id: 'app',
      title: 'APP Mell',
      desc: 'Acesse sua conta, consulte informações e tenha mais comodidade para cuidar dos seus serviços.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      )
    },
    {
      id: 'fixo',
      title: 'Telefone fixo',
      desc: 'Consulte as opções de telefonia fixa Mell com portabilidade disponível nas localidades atendidas.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="ecossistema">
      <div className="ecossistema-container">
        
        {/* LADO ESQUERDO: Textos e Imagem do Celular */}
        <div className="ecossistema-left">
          
          {/* Badge */}
          <div className="ecossistema-tag">
            <svg className="check-icon-blue" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8L6.5 11L12.5 4.5" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Ecossistema Mell</span>
          </div>

          {/* Título Principal */}
          <h2 className="ecossistema-title">
            Sua internet também pode <br className="hide-on-mobile" />
            abrir novas possibilidades.
          </h2>

          {/* Descrição */}
          <p className="ecossistema-subtitle">
            Além de conexão, clientes Mell podem ter acesso a benefícios <br className="hide-on-mobile" />
            de entretenimento, educação e desenvolvimento.
          </p>

          

          {/* Wrapper da imagem do Celular */}
          <div className="ecossistema-phone-wrapper">
            <img 
              src={experienciaImg} 
              alt="Ecossistema Mell no celular" 
              className="ecossistema-phone-img" 
            />
          </div>

        </div>

        {/* LADO DIREITO: Cards de Recursos */}
        <div className="ecossistema-right">
          {beneficios.map((item) => (
            <div key={item.id} className="ecossistema-card">
              <div className="ecossistema-card-icon">
                {item.icon}
              </div>
              <div className="ecossistema-card-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Ecossistema;