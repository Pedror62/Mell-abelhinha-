import React, { useState, useEffect } from 'react';
import './FloatingWidget.css';
import BoletoModal from './BoletoModal';
import { 
  FaWhatsapp, 
  FaUserFriends, 
  FaUserPlus, 
  FaPlus, 
  FaTimes, 
  FaComments, 
  FaPaperPlane,
  FaMapMarkerAlt,
  FaIdCard,
  FaUserCheck,
  FaFileInvoice
} from 'react-icons/fa';

export const FloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIndiqueModal, setShowIndiqueModal] = useState(false);
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [showBoletoModal, setShowBoletoModal] = useState(false);
  
  // ✅ Estado para controle da animação de atenção
  const [pulsar, setPulsar] = useState(true);

  // Estado para Indique um Amigo
  const [indiqueData, setIndiqueData] = useState({
    nomeIndicador: '',
    cpfIndicador: '',
    whatsIndicador: '',
    cidadeIndicador: '',
    nomeIndicado: '',
    cpfIndicado: '',
    whatsIndicado: '',
    cidadeIndicado: ''
  });

  // Estado para Cadastro
  const [cadastroData, setCadastroData] = useState({
    nomeCompleto: '',
    cpfCnpj: '',
    whatsapp: '',
    email: '',
    cep: '',
    cidade: '',
    bairro: '',
    ruaNumero: '',
    planoInteresse: 'Nenhum específico'
  });

  // Efeito para carregar o script do chat
  useEffect(() => {
    console.log('🟢 FloatingWidget montado');
    
    // Script do AtenderBem
    (function (d) {
      window.omniChatQueueId = 74;
      window.omniChatDomain = 'mellinternet.atenderbem.com';
      var s = d.createElement('script');
      s.async = true;
      s.src = 'https://statics.atenderbem.com/js/wbchat.min.js';
      (d.head || d.body).appendChild(s);
    })(document);

    // ✅ Parar a animação após 10 segundos (ou quando o usuário interagir)
    const timer = setTimeout(() => {
      setPulsar(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Parar animação quando o usuário interagir com o botão
  const handleInteraction = () => {
    setPulsar(false);
    toggleWidget();
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setPulsar(false); // Para a animação ao abrir
  };

  // Chat Online
  const openLiveChat = () => {
    setIsOpen(false);
    setPulsar(false);

    if (window.WBChat) {
      if (typeof window.WBChat.open === 'function') {
        window.WBChat.open();
        return;
      }
      if (typeof window.WBChat.show === 'function') {
        window.WBChat.show();
        return;
      }
    }

    if (window.omniChat) {
      if (typeof window.omniChat.open === 'function') {
        window.omniChat.open();
        return;
      }
      if (typeof window.omniChat.show === 'function') {
        window.omniChat.show();
        return;
      }
    }

    alert('O chat está inicializando. Por favor, tente novamente em alguns instantes.');
  };

  // Handlers para Indique um Amigo
  const handleOpenIndique = () => {
    setIsOpen(false);
    setPulsar(false);
    setShowCadastroModal(false);
    setShowIndiqueModal(true);
  };

  const handleIndiqueChange = (e) => {
    setIndiqueData({ ...indiqueData, [e.target.name]: e.target.value });
  };

  const handleSubmitIndique = (e) => {
    e.preventDefault();
    const numeroAtendimento = '5538998358385';

    const mensagem = `*NOVA INDICAÇÃO DE AMIGO* 🎁%0A%0A` +
      `*QUEM ESTÁ INDICANDO (CLIENTE):*%0A` +
      `• *Nome:* ${indiqueData.nomeIndicador}%0A` +
      `• *CPF:* ${indiqueData.cpfIndicador}%0A` +
      `• *WhatsApp:* ${indiqueData.whatsIndicador}%0A` +
      `• *Cidade:* ${indiqueData.cidadeIndicador}%0A%0A` +
      `*QUEM É O INDICADO (AMIGO):*%0A` +
      `• *Nome:* ${indiqueData.nomeIndicado}%0A` +
      `• *CPF:* ${indiqueData.cpfIndicado}%0A` +
      `• *WhatsApp:* ${indiqueData.whatsIndicado}%0A` +
      `• *Cidade:* ${indiqueData.cidadeIndicado}`;

    window.open(`https://wa.me/${numeroAtendimento}?text=${mensagem}`, '_blank');
    setShowIndiqueModal(false);
    setIndiqueData({
      nomeIndicador: '',
      cpfIndicador: '',
      whatsIndicador: '',
      cidadeIndicador: '',
      nomeIndicado: '',
      cpfIndicado: '',
      whatsIndicado: '',
      cidadeIndicado: ''
    });
  };

  // Handlers para Cadastro
  const handleOpenCadastro = () => {
    setIsOpen(false);
    setPulsar(false);
    setShowIndiqueModal(false);
    setShowCadastroModal(true);
  };

  const handleCadastroChange = (e) => {
    setCadastroData({ ...cadastroData, [e.target.name]: e.target.value });
  };

  const handleSubmitCadastro = (e) => {
    e.preventDefault();
    const numeroAtendimento = '5538998358385';

    const mensagem = `*NOVO PRÉ-CADASTRO DE CLIENTE* 🚀%0A%0A` +
      `*DADOS PESSOAIS:*%0A` +
      `• *Nome:* ${cadastroData.nomeCompleto}%0A` +
      `• *CPF/CNPJ:* ${cadastroData.cpfCnpj}%0A` +
      `• *WhatsApp:* ${cadastroData.whatsapp}%0A` +
      `• *E-mail:* ${cadastroData.email || 'Não informado'}%0A%0A` +
      `*ENDEREÇO DE INSTALAÇÃO:*%0A` +
      `• *CEP:* ${cadastroData.cep}%0A` +
      `• *Cidade:* ${cadastroData.cidade}%0A` +
      `• *Bairro:* ${cadastroData.bairro}%0A` +
      `• *Rua e Nº:* ${cadastroData.ruaNumero}%0A%0A` +
      `• *Plano de Interesse:* ${cadastroData.planoInteresse}`;

    window.open(`https://wa.me/${numeroAtendimento}?text=${mensagem}`, '_blank');
    setShowCadastroModal(false);
    setCadastroData({
      nomeCompleto: '',
      cpfCnpj: '',
      whatsapp: '',
      email: '',
      cep: '',
      cidade: '',
      bairro: '',
      ruaNumero: '',
      planoInteresse: 'Nenhum específico'
    });
  };

  // Handler para abrir o modal de 2ª via de boleto
  const handleOpenBoleto = () => {
    setIsOpen(false);
    setPulsar(false);
    setShowBoletoModal(true);
  };

  return (
    <div className="floating-widget-container">
      {/* POPUP DE OPÇÕES */}
      {isOpen && (
        <div className="widget-popup">
          <div className="widget-header">
            <span>Atendimento & Opções</span>
            <button className="widget-close-x" onClick={toggleWidget} aria-label="Fechar menu">
              &times;
            </button>
          </div>

          <div className="widget-options">
            {/* Chat Online */}
            <button type="button" className="widget-card" onClick={openLiveChat}>
              <div className="widget-card-icon">
                <FaComments />
              </div>
              <div className="widget-card-text">
                <strong>Chat Online</strong>
                <p>Fale com o assistente na tela</p>
              </div>
            </button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5538998358385"
              target="_blank"
              rel="noopener noreferrer"
              className="widget-card"
            >
              <div className="widget-card-icon">
                <FaWhatsapp />
              </div>
              <div className="widget-card-text">
                <strong>Atendimento WhatsApp</strong>
                <p>Fale direto no app do Zap</p>
              </div>
            </a>

            {/* 2ª Via de Boleto */}
            <button type="button" className="widget-card" onClick={handleOpenBoleto}>
              <div className="widget-card-icon">
                <FaFileInvoice />
              </div>
              <div className="widget-card-text">
                <strong>2ª Via de Boleto</strong>
                <p>Consulte e baixe seus boletos</p>
              </div>
            </button>

            {/* Indique um amigo */}
            <button type="button" className="widget-card" onClick={handleOpenIndique}>
              <div className="widget-card-icon">
                <FaUserFriends />
              </div>
              <div className="widget-card-text">
                <strong>Indique um amigo</strong>
                <p>Ganhe descontos indicando</p>
              </div>
            </button>

            {/* Cadastre-se */}
            <button type="button" className="widget-card" onClick={handleOpenCadastro}>
              <div className="widget-card-icon">
                <FaUserPlus />
              </div>
              <div className="widget-card-text">
                <strong>Cadastre-se</strong>
                <p>Aproveite nossos planos</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* MODAL BOLETO */}
      <BoletoModal 
        isOpen={showBoletoModal} 
        onClose={() => setShowBoletoModal(false)} 
      />

      {/* MODAL INDIQUE UM AMIGO */}
      {showIndiqueModal && (
        <div className="indique-modal-overlay">
          <div className="indique-modal-card">
            <div className="indique-modal-header">
              <div className="header-title-box">
                <FaUserFriends className="modal-header-icon" />
                <h3>Indique um Amigo</h3>
              </div>
              <button
                type="button"
                className="widget-close-x"
                onClick={() => setShowIndiqueModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitIndique} className="indique-form">
              <div className="form-section">
                <h4>Seus Dados (Quem indica)</h4>
                <div className="form-grid">
                  <input
                    type="text"
                    name="nomeIndicador"
                    placeholder="Seu Nome Completo"
                    value={indiqueData.nomeIndicador}
                    onChange={handleIndiqueChange}
                    required
                  />
                  <input
                    type="text"
                    name="cpfIndicador"
                    placeholder="Seu CPF"
                    value={indiqueData.cpfIndicador}
                    onChange={handleIndiqueChange}
                    required
                  />
                  <input
                    type="tel"
                    name="whatsIndicador"
                    placeholder="Seu WhatsApp"
                    value={indiqueData.whatsIndicador}
                    onChange={handleIndiqueChange}
                    required
                  />
                  <input
                    type="text"
                    name="cidadeIndicador"
                    placeholder="Sua Cidade"
                    value={indiqueData.cidadeIndicador}
                    onChange={handleIndiqueChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Dados do Amigo (Indicado)</h4>
                <div className="form-grid">
                  <input
                    type="text"
                    name="nomeIndicado"
                    placeholder="Nome do Amigo"
                    value={indiqueData.nomeIndicado}
                    onChange={handleIndiqueChange}
                    required
                  />
                  <input
                    type="text"
                    name="cpfIndicado"
                    placeholder="CPF do Amigo"
                    value={indiqueData.cpfIndicado}
                    onChange={handleIndiqueChange}
                    required
                  />
                  <input
                    type="tel"
                    name="whatsIndicado"
                    placeholder="WhatsApp do Amigo"
                    value={indiqueData.whatsIndicado}
                    onChange={handleIndiqueChange}
                    required
                  />
                  <input
                    type="text"
                    name="cidadeIndicado"
                    placeholder="Cidade do Amigo"
                    value={indiqueData.cidadeIndicado}
                    onChange={handleIndiqueChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-indique-btn">
                <FaPaperPlane /> Enviar Indicação
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CADASTRO */}
      {showCadastroModal && (
        <div className="indique-modal-overlay">
          <div className="indique-modal-card">
            <div className="indique-modal-header">
              <div className="header-title-box">
                <FaUserCheck className="modal-header-icon" />
                <h3>Faça seu Cadastro</h3>
              </div>
              <button
                type="button"
                className="widget-close-x"
                onClick={() => setShowCadastroModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitCadastro} className="indique-form">
              <div className="form-section">
                <h4><FaIdCard /> Dados Pessoais</h4>
                <div className="form-grid">
                  <input
                    type="text"
                    name="nomeCompleto"
                    placeholder="Nome Completo *"
                    value={cadastroData.nomeCompleto}
                    onChange={handleCadastroChange}
                    required
                  />
                  <input
                    type="text"
                    name="cpfCnpj"
                    placeholder="CPF ou CNPJ *"
                    value={cadastroData.cpfCnpj}
                    onChange={handleCadastroChange}
                    required
                  />
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="WhatsApp para contato *"
                    value={cadastroData.whatsapp}
                    onChange={handleCadastroChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail (Opcional)"
                    value={cadastroData.email}
                    onChange={handleCadastroChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4><FaMapMarkerAlt /> Endereço de Instalação</h4>
                <div className="form-grid">
                  <input
                    type="text"
                    name="cep"
                    placeholder="CEP *"
                    value={cadastroData.cep}
                    onChange={handleCadastroChange}
                    required
                  />
                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade *"
                    value={cadastroData.cidade}
                    onChange={handleCadastroChange}
                    required
                  />
                  <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro *"
                    value={cadastroData.bairro}
                    onChange={handleCadastroChange}
                    required
                  />
                  <input
                    type="text"
                    name="ruaNumero"
                    placeholder="Rua e Número *"
                    value={cadastroData.ruaNumero}
                    onChange={handleCadastroChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-indique-btn">
                <FaPaperPlane /> Enviar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ BOTÃO PRINCIPAL FLUTUANTE COM ANIMAÇÃO */}
      <button
        className={`floating-button ${isOpen ? 'active' : ''} ${pulsar ? 'pulsar' : ''}`}
        onClick={handleInteraction}
        aria-label="Abrir menu de opções"
      >
        {isOpen ? <FaTimes /> : <FaPlus />}
      </button>
    </div>
  );
};

export default FloatingWidget;