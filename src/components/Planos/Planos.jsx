import React, { useState } from 'react';
import './Planos.css';

// ============================================================
// IMPORTAÇÃO DAS IMAGENS LOCAIS
// Verifique se o caminho '../../assets/' está correto para o seu projeto
// ============================================================
import imgContaOutraVez from '../../assets/ConteOutraVez.png';
import imgContaOutraVezMini from '../../assets/conteOutraVezMini.png';

// ============================================================
// URLs EXATAS DO SEU HTML
// ============================================================
const URL_OLE_TV = "https://mell.mellinternet.com.br/assets/oletv-Cu9M-Sud.png";
const URL_WIFI_6 = "https://mell.mellinternet.com.br/assets/icon_wifi6-BGyyQu84.png";
const URL_CLUBE = "https://mell.mellinternet.com.br/assets/icon_clube-CrbZK86s.png";
const URL_DEEZER = "https://mell.mellinternet.com.br/assets/dezzer-B2UZ-nJH.png";
const URL_EBOOK_LIGHT = "https://mell.mellinternet.com.br/assets/qualifica-DKOr7Mv4.png";
const URL_MAQUINA_CONTOS = "https://mell.mellinternet.com.br/assets/maquinadecontos-SrM0Gdwd.png";
const URL_EBOOK_STANDARD = "https://mell.mellinternet.com.br/assets/Standard_Ebooks_logo-Con_1oWW.png";

// Base64 do Watch Brasil (Fornecido no HTML)
const BASE64_WATCH_BRASIL = "data:image/png;base64,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";

// SVG do Chip 35 GB (Fornecido no HTML)
const SVG_CHIP_35GB = (
  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#e06d13" className="servico-icon-svg small">
    <path d="M312-240h72v-72h-72v72Zm0-144h72v-144h-72v144Zm132 144h72v-144h-72v144Zm0-216h72v-72h-72v72Zm132 216h72v-72h-72v72Zm0-144h72v-144h-72v144ZM263.72-96Q234-96 213-117.15T192-168v-504l192-192h312q29.7 0 50.85 21.15Q768-821.7 768-792v624q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72Zm.28-72h432v-624H414L264-642v474Zm0 0h432-432Z"></path>
  </svg>
);

// Função de renderização de ícones
const getServicoIcon = (nome, emoji, size = 'default') => {
  if (nome === 'Chip 35 GB') return SVG_CHIP_35GB;
  
  if (nome === 'livros' || nome === 'Livros*' || nome === 'livros*') {
    return <span className={`servico-icon-emoji ${size}`}>📚</span>;
  }

  switch (nome) {
    case 'Olé TV': return <img src={URL_OLE_TV} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Wi-Fi 6': return <img src={URL_WIFI_6} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Clube': return <img src={URL_CLUBE} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Deezer': return <img src={URL_DEEZER} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'qualifica': return <img src={URL_EBOOK_LIGHT} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Máquina de Contos': return <img src={URL_MAQUINA_CONTOS} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Ebook Standard': return <img src={URL_EBOOK_STANDARD} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Watch Brasil': return <img src={BASE64_WATCH_BRASIL} alt={nome} className={`servico-icon-img ${size}`} />;
    
    // 👇 AQUI ESTÃO AS CORREÇÕES DAS IMAGENS LOCAIS 👇
    case 'Conta Outra Vez': return <img src={imgContaOutraVez} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Mini Conta Outra Vez': return <img src={imgContaOutraVezMini} alt={nome} className={`servico-icon-img ${size}`} />;
    // 👆 FIM DAS CORREÇÕES 👆
    
    default: return <span className={`servico-icon-emoji ${size}`}>{emoji}</span>;
  }
};

const PLANOS_DATA = [
  {
    id: 'scm300',
    badge: 'SCM 300 MB',
    speedNumber: '300',
    speedUnit: 'MB',
    priceBase: 79.90,
    instalacao: 'Instalação grátis',
    featured: false,
    inclusos: [
      { nome: 'Olé TV', icon: '📺', descricao: 'Streaming com conteúdo exclusivo e canais ao vivo' },
      { nome: 'Wi-Fi 6', icon: '📶', descricao: 'Tecnologia de última geração para maior velocidade e estabilidade' },
      { nome: 'Clube', icon: '🌟', descricao: 'Descontos e vantagens exclusivas em parceiros' },
      { nome: 'Livros*', icon: '📚', descricao: 'Biblioteca digital com milhares de títulos disponíveis' }
    ],
    adicionaisDisponiveis: [
      { id: 'chip_35gb', nome: 'Chip 35 GB', preco: 30.00, icon: '📱', descricao: 'Chip de dados móveis com 35GB de franquia' },
      { id: 'deezer', nome: 'Deezer', preco: 10.00, icon: '🎵', descricao: 'Streaming de música com milhões de faixas' },
      { id: 'ebook_light', nome: 'qualifica', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'conta_outra_vez', nome: 'Conta Outra Vez', preco: 19.90, icon: '📺', descricao: 'Serviço de streaming com conteúdo exclusivo' },
      { id: 'maquina_contos', nome: 'Máquina de Contos', preco: 19.90, icon: '📖', descricao: 'Histórias infantis interativas e educativas' },
      { id: 'ebook_standard', nome: 'Ebook Standard', preco: 11.90, icon: '📚', descricao: 'Biblioteca digital com milhares de títulos' },
      { id: 'watch_brasil', nome: 'Watch Brasil', preco: 12.90, icon: '⌚', descricao: 'Streaming de conteúdos brasileiros exclusivos' },
      { id: 'mini_conta_outra_vez', nome: 'Mini Conta Outra Vez', preco: 14.90, icon: '📺', descricao: 'Versão compacta do serviço de streaming' },
      { id: 'camera_interna', nome: 'Câmera Wi-Fi Interna', preco: 20.00, icon: '📹', descricao: 'Câmera de segurança interna com visão noturna' }
    ]
  },
  {
    id: 'scm600',
    badge: 'SCM 600 MB',
    speedNumber: '600',
    speedUnit: 'MB',
    priceBase: 99.90,
    instalacao: 'Instalação grátis',
    featured: true,
    inclusos: [
      { nome: 'Olé TV', icon: '📺', descricao: 'Streaming com conteúdo exclusivo e canais ao vivo' },
      { nome: 'Wi-Fi 6', icon: '📶', descricao: 'Tecnologia de última geração para maior velocidade e estabilidade' },
      { nome: 'Clube', icon: '🌟', descricao: 'Descontos e vantagens exclusivas em parceiros' },
      { nome: 'livros*', icon: '📚', descricao: 'Biblioteca digital com milhares de títulos disponíveis' }
    ],
    adicionaisDisponiveis: [
      { id: 'maquina_contos', nome: 'Máquina de Contos', preco: 19.90, icon: '📖', descricao: 'Histórias infantis interativas e educativas' },
      { id: 'ebook_standard', nome: 'Ebook Standard', preco: 11.90, icon: '📚', descricao: 'Biblioteca digital com milhares de títulos' },
      { id: 'ebook_light', nome: 'qualifica', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'watch_brasil', nome: 'Watch Brasil', preco: 12.90, icon: '⌚', descricao: 'Streaming de conteúdos brasileiros exclusivos' },
      { id: 'mini_conta_outra_vez', nome: 'Mini Conta Outra Vez', preco: 14.90, icon: '📺', descricao: 'Versão compacta do serviço de streaming' },
      { id: 'roteador', nome: 'Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador Wi-Fi de alta performance' },
      { id: 'segundo_roteador', nome: 'Segundo Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador adicional para expandir a cobertura' },
      { id: 'cartao_memoria', nome: 'Cartão Memória 32GB', preco: 5.99, icon: '💾', descricao: 'Cartão de memória para câmeras e dispositivos' },
      { id: 'chip_35gb', nome: 'Chip 35 GB', preco: 30.00, icon: '📱', descricao: 'Chip de dados móveis com 35GB de franquia' },
      { id: 'deezer', nome: 'Deezer', preco: 10.00, icon: '🎵', descricao: 'Streaming de música com milhões de faixas' },
      { id: 'conta_outra_vez', nome: 'Conta Outra Vez', preco: 19.90, icon: '📺', descricao: 'Serviço de streaming com conteúdo exclusivo' },
      { id: 'camera_interna', nome: 'Câmera Wi-Fi Interna', preco: 20.00, icon: '📹', descricao: 'Câmera de segurança interna com visão noturna' },
      { id: 'camera_externa_fixa', nome: 'Câmera Wi-Fi Externa Fixa', preco: 24.90, icon: '📹', descricao: 'Câmera de segurança externa fixa com alta resolução' },
      { id: 'camera_externa', nome: 'Câmera Wi-Fi Externa', preco: 29.90, icon: '📹', descricao: 'Câmera de segurança externa com visão 360°' }
    ]
  },
  {
    id: 'scm1000',
    badge: 'SCM 1000 MB',
    speedNumber: '1000',
    speedUnit: 'MB',
    priceBase: 109.90,
    instalacao: 'Instalação grátis',
    featured: false,
    inclusos: [
      { nome: 'Olé TV', icon: '📺', descricao: 'Streaming com conteúdo exclusivo e canais ao vivo' },
      { nome: 'Wi-Fi 6', icon: '📶', descricao: 'Tecnologia de última geração para maior velocidade e estabilidade' },
      { nome: 'Clube', icon: '🌟', descricao: 'Descontos e vantagens exclusivas em parceiros' },
      { nome: 'livros', icon: '📚', descricao: 'Biblioteca digital com milhares de títulos disponíveis' }
    ],
    adicionaisDisponiveis: [
      { id: 'deezer', nome: 'Deezer', preco: 10.00, icon: '🎵', descricao: 'Streaming de música com milhões de faixas' },
      { id: 'watch_brasil', nome: 'Watch Brasil', preco: 12.90, icon: '⌚', descricao: 'Streaming de conteúdos brasileiros exclusivos' },
      { id: 'ebook_light', nome: 'qualifica', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'camera_interna', nome: 'Câmera Wi-Fi Interna', preco: 20.00, icon: '📹', descricao: 'Câmera de segurança interna com visão noturna' },
      { id: 'camera_externa_fixa', nome: 'Câmera Wi-Fi Externa Fixa', preco: 24.90, icon: '📹', descricao: 'Câmera de segurança externa fixa com alta resolução' },
      { id: 'camera_externa', nome: 'Câmera Wi-Fi Externa', preco: 29.90, icon: '📹', descricao: 'Câmera de segurança externa com visão 360°' },
      { id: 'roteador', nome: 'Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador Wi-Fi de alta performance' },
      { id: 'segundo_roteador', nome: 'Segundo Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador adicional para expandir a cobertura' },
      { id: 'cartao_memoria', nome: 'Cartão Memória 32GB', preco: 5.99, icon: '💾', descricao: 'Cartão de memória para câmeras e dispositivos' },
      { id: 'chip_25gb', nome: 'Chip 35 GB', preco: 30.00, icon: '📱', descricao: 'Chip de dados móveis com 25GB de franquia' },
      { id: 'conta_outra_vez', nome: 'Conta Outra Vez', preco: 19.90, icon: '📺', descricao: 'Serviço de streaming com conteúdo exclusivo' },
      { id: 'maquina_contos', nome: 'Máquina de Contos', preco: 19.90, icon: '📖', descricao: 'Histórias infantis interativas e educativas' },
      { id: 'ebook_standard', nome: 'Ebook Standard', preco: 11.90, icon: '📚', descricao: 'Biblioteca digital com milhares de títulos' },
      { id: 'mini_conta_outra_vez', nome: 'Mini Conta Outra Vez', preco: 14.90, icon: '📺', descricao: 'Versão compacta do serviço de streaming' }
    ]
  }
];

export const Planos = () => {
  const [adicionaisAtivos, setAdicionaisAtivos] = useState({
    scm300: [],
    scm600: [],
    scm1000: []
  });

  const [planoSelecionadoModal, setPlanoSelecionadoModal] = useState(null);
  const [servicosModal, setServicosModal] = useState(null);

  const toggleAdicional = (planoId, adicionalId) => {
    setAdicionaisAtivos((prev) => {
      const atuais = prev[planoId] || [];
      const existe = atuais.includes(adicionalId);
      return {
        ...prev,
        [planoId]: existe
          ? atuais.filter((id) => id !== adicionalId)
          : [...atuais, adicionalId]
      };
    });
  };

  const calcularPrecoTotal = (plano) => {
    const ativosDoPlano = adicionaisAtivos[plano.id] || [];
    const valorAdicionais = plano.adicionaisDisponiveis
      .filter((add) => ativosDoPlano.includes(add.id))
      .reduce((acc, add) => acc + add.preco, 0);

    return (plano.priceBase + valorAdicionais).toFixed(2);
  };

  const abrirModalResumo = (plano) => setPlanoSelecionadoModal(plano);
  const fecharModal = () => setPlanoSelecionadoModal(null);
  const abrirModalServicos = (plano) => setServicosModal(plano);
  const fecharModalServicos = () => setServicosModal(null);

  const enviarParaWhatsApp = () => {
    if (!planoSelecionadoModal) return;
    const plano = planoSelecionadoModal;
    const total = calcularPrecoTotal(plano);
    const ativosDoPlano = adicionaisAtivos[plano.id] || [];
    const objetosAdicionais = plano.adicionaisDisponiveis.filter((add) => ativosDoPlano.includes(add.id));
    const nomesAdicionais = objetosAdicionais.map((add) => add.nome).join(', ');

    const msg =
      `Olá! Quero assinar o plano *${plano.badge} (${plano.speedNumber} ${plano.speedUnit})*\n` +
      `• *Valor base:* R$ ${plano.priceBase.toFixed(2).replace('.', ',')}/mês\n` +
      (nomesAdicionais ? `• *Adicionais:* ${nomesAdicionais}\n` : '') +
      `• *Valor TOTAL:* R$ ${total.replace('.', ',')}/mês\n\n` +
      `Gostaria de dar andamento na minha contratação!`;

    window.open(`https://wa.me/5538999999999?text=${encodeURIComponent(msg)}`, '_blank');
    fecharModal();
  };

  return (
    <section id="planos" className="planos-section">
      <div className="planos-header">
        <span className="planos-tag">✦ Escolha sua velocidade</span>
        <h2 className="planos-title">
          Encontre o plano Mell ideal para <br />
          acompanhar cada momento da sua vida.
        </h2>
        <p className="planos-subtitle">
          Consulte as opções disponíveis e personalize com os adicionais que deseja.
        </p>
      </div>

      <div className="planos-grid">
        {PLANOS_DATA.map((plano) => {
          const precoFinal = calcularPrecoTotal(plano);
          const [inteiro, centavos] = precoFinal.split('.');
          const primeirosAdicionais = plano.adicionaisDisponiveis.slice(0, 3);
          const temMaisServicos = plano.adicionaisDisponiveis.length > 3;

          return (
            <div key={plano.id} className={`card-plano ${plano.featured ? 'featured' : ''}`}>
              <div className="card-badge-header">
                <span>{plano.badge}</span>
              </div>

              <div className="card-top-info">
                <div className="speed-block">
                  <span className="speed-number">{plano.speedNumber}</span>
                  <span className="speed-unit">{plano.speedUnit}</span>
                </div>
                <div className="price-block">
                  <span className="price-label">R$ {inteiro},{centavos}</span>
                  <span className="price-period">/mês</span>
                </div>
              </div>

              <div className="instalacao-bar">
                <span className="icon-tools"></span>
                <span>{plano.instalacao}</span>
              </div>

              <div className="fidelidade-bar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#e06d13"><path d="M3.5,14.5q0-0.13 0-0.25T3.5,14q0-2.3 0-3.9t0-1.6t0,0.06t0,0.15V5.5v9Zm11.54,2.25L12.3,14q-0.25-0.25-0.36-0.55t-0.1-0.58q0-0.62 0.44-1.12t1.16-0.5q0.56 0 0.88,0.26q0.32,0.26 0.74,0.68q0.4-0.4 0.71-0.67t0.89-0.27q0.74 0 1.17,0.5t0.44,1.12q0,0.29-0.11,0.59T17.79,14l-2.75,2.75ZM3.5,7h13V5.5H3.5V7Zm6.35,9H3.5q-0.6,0-1.05-0.45T2,14.5v-9Q2,4.9 2.45,4.45T3.5,4h13q0.62,0 1.06,0.45T18,5.5V9.4q-0.67-0.42-1.42-0.66T14.98,8.5q-1.1,0-2.07,0.4T11.21,10H3.5v4.5h6q0.04,0.39 0.13,0.77T9.85,16Z"/></svg>
                <span>12 meses de fidelidade</span>
              </div>

              <div className="block-box">
                <h4 className="block-title">Serviços inclusos</h4>
                <div className="inclusos-grid">
                  {plano.inclusos.map((item, idx) => (
                    <div key={idx} className="incluso-item">
                      <span className="incluso-icon">
                        {getServicoIcon(item.nome, item.icon, 'small')}
                      </span>
                      <span className="incluso-name">{item.nome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="block-box">
                <h4 className="block-title">Adicionar no combo</h4>
                <div className="adicionais-list">
                  {primeirosAdicionais.map((add) => {
                    const isChecked = (adicionaisAtivos[plano.id] || []).includes(add.id);
                    return (
                      <div key={add.id} className="adicional-row">
                        <div className="adicional-left">
                          {getServicoIcon(add.nome, add.icon, 'small')}
                          <div className="add-text">
                            <span className="add-nome">{add.nome}</span>
                            <span className="add-preco">por R$ {add.preco.toFixed(2).replace('.', ',')} mensais</span>
                          </div>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAdicional(plano.id, add.id)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    );
                  })}

                  {temMaisServicos && (
                    <button className="btn-ver-mais" onClick={() => abrirModalServicos(plano)}>
                      <span></span> Ver todos os serviços
                      <span className="btn-ver-mais-count">
                        +{plano.adicionaisDisponiveis.length - 3}
                      </span>
                    </button>
                  )}
                </div>

                <button className="btn-detalhes" onClick={() => abrirModalResumo(plano)}>
                  <span className="plus-circle">+</span> Conferir detalhes
                </button>
              </div>

              <div className="suporte-bar">
                <span className="badge-gold"><svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#e06d13"><path d="M7.33,13.9L10,12.31l2.69,1.58l-0.71-3l2.31-1.98L11.23,8.65L10,5.79L8.77,8.65L5.71,8.92L8.04,10.9l-0.71,3ZM5.06,17l1.31-5.54L2,7.73l5.75-0.5L10,2l2.25,5.25L18,7.73l-4.38,3.73L14.94,17L10,14.06L5.06,17ZM10,10.06Z"/></svg></span>
                <span>Suporte Premium</span>
              </div>

              <button className="btn-assine-ja" onClick={() => abrirModalResumo(plano)}>
                ASSINE JÁ
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL DE SERVIÇOS ADICIONAIS */}
      {servicosModal && (
        <div className="modal-overlay" onClick={fecharModalServicos}>
          <div className="modal-content modal-servicos" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharModalServicos}>✕</button>

            <div className="modal-header">
              <span className="modal-tag">✦ Serviços Adicionais</span>
              <h3>Plano {servicosModal.badge}</h3>
              <p className="modal-speed">
                Escolha os serviços que deseja adicionar ao seu plano
              </p>
            </div>

            <div className="modal-body">
              <div className="servicos-grid-modal">
                {servicosModal.adicionaisDisponiveis.map((add) => {
                  const isChecked = (adicionaisAtivos[servicosModal.id] || []).includes(add.id);
                  return (
                    <div key={add.id} className="servico-card-modal">
                      <div className="servico-card-header">
                        {getServicoIcon(add.nome, add.icon, 'medium')}
                        <span className="servico-card-nome">{add.nome}</span>
                      </div>
                      <p className="servico-card-desc">{add.descricao}</p>
                      <div className="servico-card-footer">
                        <span className="servico-card-preco">
                          R$ {add.preco.toFixed(2).replace('.', ',')}
                          <small>/mês</small>
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAdicional(servicosModal.id, add.id)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="modal-total-box">
                <div className="total-label">
                  <span>Total com adicionais</span>
                  <small>Plano base + adicionais selecionados</small>
                </div>
                <div className="total-value">
                  R$ {calcularPrecoTotal(servicosModal).replace('.', ',')}
                  <small>/mês</small>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={fecharModalServicos}>
                Fechar
              </button>
              <button className="btn-confirmar-wsp" onClick={() => {
                fecharModalServicos();
                abrirModalResumo(servicosModal);
              }}>
                Ver resumo do plano
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RESUMO DA ESCOLHA */}
      {planoSelecionadoModal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharModal}>✕</button>

            <div className="modal-header">
              <span className="modal-tag">✦ Detalhes do plano</span>
              <h3>Plano {planoSelecionadoModal.badge}</h3>
              <p className="modal-speed">
                {planoSelecionadoModal.speedNumber} {planoSelecionadoModal.speedUnit} de Velocidade
              </p>
            </div>

            <div className="modal-body">
              <div className="modal-summary-row">
                <span>Plano Base ({planoSelecionadoModal.badge})</span>
                <strong>R$ {planoSelecionadoModal.priceBase.toFixed(2).replace('.', ',')}</strong>
              </div>

              <div className="modal-inclusos-summary">
                <div className="modal-section-header">
                  <span>Serviços Inclusos</span>
                </div>
                <div className="modal-services-list">
                  {planoSelecionadoModal.inclusos.map((inc, i) => (
                    <div key={i} className="modal-service-item">
                      <div className="modal-service-icon">
                        {getServicoIcon(inc.nome, inc.icon, 'small')}
                      </div>
                      <div className="modal-service-info">
                        <span className="modal-service-name">{inc.nome}</span>
                        <span className="modal-service-desc">{inc.descricao}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-adicionais-summary">
                <div className="modal-section-header">
                  <span> Adicionais Selecionados</span>
                </div>
                {((adicionaisAtivos[planoSelecionadoModal.id] || []).length === 0) ? (
                  <p className="no-adicionais">Nenhum adicional selecionado.</p>
                ) : (
                  <div className="modal-services-list">
                    {planoSelecionadoModal.adicionaisDisponiveis
                      .filter((add) => (adicionaisAtivos[planoSelecionadoModal.id] || []).includes(add.id))
                      .map((add) => (
                        <div key={add.id} className="modal-service-item">
                          <div className="modal-service-icon">
                            {getServicoIcon(add.nome, add.icon, 'small')}
                          </div>
                          <div className="modal-service-info">
                            <span className="modal-service-name">{add.nome}</span>
                            <span className="modal-service-desc">{add.descricao}</span>
                            <span className="modal-service-price">+ R$ {add.preco.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="modal-total-box">
                <div className="total-label">
                  <span>Valor Total Mensal</span>
                  <small> Instalação Grátis</small>
                </div>
                <div className="total-value">
                  R$ {calcularPrecoTotal(planoSelecionadoModal).replace('.', ',')}
                  <small>/mês</small>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={fecharModal}>
                Voltar e alterar
              </button>
              <button className="btn-confirmar-wsp" onClick={enviarParaWhatsApp}>
                Confirmar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Planos;