import React, { useState } from 'react';
import './ConsultaPlano.css';
// Importe a imagem do mascote voador com o celular
import mascoteVoador from '../../assets/abelhaNocelular.png'; // Substitua pelo arquivo correto se houver outro mascote voador

export const ConsultaPlano = () => {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    cidade: '',
    bairro: '',
    endereco: '',
    numero: '',
    velocidade: '',
    autorizo: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    // Aqui você adiciona a lógica de envio (API ou WhatsApp)
  };

  return (
    <section className="consulta-plano" id="consultar-cobertura">
      <div className="consulta-container">
        
        {/* LADO ESQUERDO: Textos e Mascote */}
        <div className="consulta-left">
          
          {/* Tag / Badge */}
          <div className="consulta-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A1DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Consulte sua cobertura</span>
          </div>

          {/* Título Principal */}
          <h2 className="consulta-title">
            Descubra qual plano Mell <br />
            está disponível para você.
          </h2>

          {/* Subtítulo */}
          <p className="consulta-subtitle">
            Preencha seus dados para consultar a cobertura, conhecer os <br />
            planos da sua região e receber atendimento da equipe Mell.
          </p>

          <p className="consulta-disclaimer-left">
            Seus dados serão utilizados somente para realizar seu atendimento e apresentar as opções disponíveis para sua região.
          </p>

          {/* Imagem do Mascote Voador */}
         <div className="consulta-mascote-wrapper">
          <div className="mascote-shadow"></div>
          <img src={mascoteVoador} alt="Mascote Mell consultando cobertura no celular" className="mascote-img" />
        </div>

        </div>

        {/* LADO DIREITO: Card Formulário */}
        <div className="consulta-right">
          <form className="consulta-card-form" onSubmit={handleSubmit}>
            
            {/* Nome Completo */}
            <div className="form-group">
              <label htmlFor="nome">Nome completo *</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                placeholder="Seu nome completo" 
                value={formData.nome}
                onChange={handleChange}
                required 
              />
            </div>

            {/* WhatsApp */}
            <div className="form-group">
              <label htmlFor="whatsapp">WhatsApp *</label>
              <input 
                type="text" 
                id="whatsapp" 
                name="whatsapp" 
                placeholder="(00) 00000-0000" 
                value={formData.whatsapp}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Cidade */}
            <div className="form-group">
              <label htmlFor="cidade">Cidade *</label>
              <input 
                type="text" 
                id="cidade" 
                name="cidade" 
                placeholder="Sua cidade" 
                value={formData.cidade}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Bairro */}
            <div className="form-group">
              <label htmlFor="bairro">Bairro *</label>
              <input 
                type="text" 
                id="bairro" 
                name="bairro" 
                placeholder="Seu bairro" 
                value={formData.bairro}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Endereço */}
            <div className="form-group">
              <label htmlFor="endereco">Endereço *</label>
              <input 
                type="text" 
                id="endereco" 
                name="endereco" 
                placeholder="Rua, avenida..." 
                value={formData.endereco}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Número */}
            <div className="form-group">
              <label htmlFor="numero">Número *</label>
              <input 
                type="text" 
                id="numero" 
                name="numero" 
                placeholder="Nº" 
                value={formData.numero}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Qual velocidade procura? */}
            <div className="form-group">
              <label htmlFor="velocidade">Qual velocidade procura?</label>
              <select 
                id="velocidade" 
                name="velocidade" 
                value={formData.velocidade}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="400mega">400 Mega</option>
                <option value="600mega">600 Mega</option>
                <option value="1giga">1 Giga</option>
              </select>
            </div>

            {/* Botão de Envio */}
            <button type="submit" className="consulta-btn-submit">
              Consultar disponibilidade
            </button>

            {/* Checkbox LGPD */}
            <div className="form-checkbox-group">
              <input 
                type="checkbox" 
                id="autorizo" 
                name="autorizo" 
                checked={formData.autorizo}
                onChange={handleChange}
                required
              />
              <label htmlFor="autorizo">
                Autorizo o contato da empresa para atendimento e envio de informações relacionadas à minha solicitação. *
              </label>
            </div>

            {/* Disclaimer LGPD rodapé form */}
            <p className="consulta-disclaimer-form">
              Seus dados serão utilizados exclusivamente para realizar seu atendimento e apresentar as opções disponíveis para a sua região.
            </p>

          </form>
        </div>

      </div>
    </section>
  );
};

export default ConsultaPlano;