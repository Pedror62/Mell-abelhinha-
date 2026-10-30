import React, { useState } from 'react';
import './Faq.css';

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      pergunta: 'Como funciona a instalação da internet fibra óptica da Mell?',
      resposta: 'Após a aprovação do seu pedido, nossa equipe técnica agenda a instalação no melhor dia e horário para você. A instalação leva em média de 1 a 2 horas e você já sai navegando.'
    },
    {
      pergunta: 'Qual o prazo para ativação do meu plano?',
      resposta: 'Geralmente realizamos a instalação e ativação em até 48 horas úteis após a confirmação do cadastro, sujeito à disponibilidade técnica da região.'
    },
    {
      pergunta: 'O roteador Wi-Fi está incluso nos planos?',
      resposta: 'Sim! Todos os nossos planos incluem roteador Wi-Fi de alta performance em regime de comodato, sem custo adicional no equipamento.'
    },
    {
      pergunta: 'Como posso emitir a segunda via da minha fatura?',
      resposta: 'Você pode solicitar a 2ª via da fatura rapidamente pelo nosso WhatsApp, Central de Atendimento ou através do aplicativo exclusivo Mell.'
    },
    {
      pergunta: 'A Mell atende clientes corporativos e empresas?',
      resposta: 'Sim, temos soluções dedicadas para empresas com IP fixo, garantia de banda e atendimento prioritário.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        
        {/* Badge Superior */}
        <div className="faq-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Tire suas dúvidas</span>
        </div>

        {/* Título Principal */}
        <h2 className="faq-title">
          Perguntas Frequentes
        </h2>

        {/* Subtítulo */}
        <p className="faq-subtitle">
          Tudo o que você precisa saber sobre nossos planos, instalação e atendimento.
        </p>

        {/* Lista de Acordeões */}
        <div className="faq-list">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-header">
                  <h3 className="faq-question">{item.pergunta}</h3>
                  <div className="faq-icon-toggle">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke={isOpen ? '#FF801E' : '#111827'} 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <div className="faq-answer">
                    <p>{item.resposta}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call To Action no Rodapé do FAQ */}
        <div className="faq-footer-cta">
          <p>Ainda tem alguma dúvida sobre os serviços da Mell?</p>
          <a
            href="https://wa.me/5508000389004"
            target="_blank"
            rel="noopener noreferrer"
            className="faq-btn"
          >
            Falar com um consultor
          </a>
        </div>

      </div>
    </section>
  );
};

export default Faq;