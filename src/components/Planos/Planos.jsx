import React, { useState } from 'react';
import './Planos.css';

// Importando as imagens que existem na pasta assets
import maquinadecontos from '../../assets/maquinadecontos.png';
import standerdEbook from '../../assets/Standard_Ebooks_logo.png';
import conteoutravez from '../../assets/conteoutravez.png.webp';
import dezzer from '../../assets/dezzer.png';
import WatchBrasil from '../../assets/WatchBrasil.png';
import skeelo from '../../assets/skeelo.jpeg';
import oleTv from '../../assets/oletv.png';
import wifi6 from '../../assets/icon_wifi6.png';
import club from '../../assets/icon_clube.png';
import livros from '../../assets/icon_livros_128px.png';
// REMOVIDO: import livros from '../../assets/icon_livros.png';

// Mapeamento de ícones para imagens
const SERVICOS_IMAGENS = {
  'Olé TV': oleTv || '📺',
  'Wi-Fi 6': wifi6 || '📶',
  'Clube': club || '🌟',
  'Livros*': livros || '📚', // Usando apenas emoji pois a imagem não existe
  'Câmera Wi-Fi Interna': '📹',
  'Câmera Wi-Fi Externa Fixa': '📹',
  'Câmera Wi-Fi Externa': '📹',
  'Roteador': '📡',
  'Segundo Roteador': '📡',
  'Cartão Memória 32GB': '💾',
  'Chip 15 GB': '📱',
  'Deezer': dezzer || '🎵',
  'Conta Outra Vez': conteoutravez || '📺',
  'Máquina de Contos': maquinadecontos || '📖',
  'Ebook Standard': standerdEbook || '📚',
  'Ebook Light': skeelo || '📚',
  'Watch Brasil': WatchBrasil || '⌚',
  'Mini Conta Outra Vez': conteoutravez || '📺'
};

// Função para verificar se é imagem ou emoji
const isImage = (value) => {
  return typeof value === 'string' && (value.startsWith('/') || value.startsWith('data:') || value.includes('.') || value.includes('blob'));
};

// Função para obter ícone do serviço
const getServicoIcon = (nome, emoji, size = 'default') => {
  const icon = SERVICOS_IMAGENS[nome] || emoji;
  
  // Se for uma imagem importada ou URL
  if (isImage(icon) || (typeof icon === 'object' && icon !== null)) {
    return <img src={icon} alt={nome} className={`servico-icon-img ${size}`} />;
  }
  // Senão usa emoji
  return <span className={`servico-icon-emoji ${size}`}>{icon}</span>;
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
      { id: 'chip_15gb', nome: 'Chip 15 GB', preco: 30.00, icon: '📱', descricao: 'Chip de dados móveis com 15GB de franquia' },
      { id: 'deezer', nome: 'Deezer', preco: 10.00, icon: '🎵', descricao: 'Streaming de música com milhões de faixas' },
      { id: 'ebook_light', nome: 'Ebook Light', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'conta_outra_vez', nome: 'Conta Outra Vez', preco: 19.90, icon: '📺', descricao: 'Serviço de streaming com conteúdo exclusivo' },
      { id: 'maquina_contos', nome: 'Máquina de Contos', preco: 19.90, icon: '📖', descricao: 'Histórias infantis interativas e educativas' },
      { id: 'ebook_standard', nome: 'Ebook Standard', preco: 11.90, icon: '📚', descricao: 'Biblioteca digital com milhares de títulos' },
      { id: 'watch_brasil', nome: 'Watch Brasil', preco: 12.90, icon: '⌚', descricao: 'Streaming de conteúdos brasileiros exclusivos' },
      { id: 'mini_conta_outra_vez', nome: 'Mini Conta Outra Vez', preco: 14.90, icon: '📺', descricao: 'Versão compacta do serviço de streaming' },
      { id: 'camera_interna', nome: 'Câmera Wi-Fi Interna', preco: 20.00, icon: '📹', descricao: 'Câmera de segurança interna com visão noturna' },
      { id: 'camera_externa_fixa', nome: 'Câmera Wi-Fi Externa Fixa', preco: 24.90, icon: '📹', descricao: 'Câmera de segurança externa fixa com alta resolução' },
      { id: 'camera_externa', nome: 'Câmera Wi-Fi Externa', preco: 29.90, icon: '📹', descricao: 'Câmera de segurança externa com visão 360°' },
      { id: 'roteador', nome: 'Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador Wi-Fi de alta performance' },
      { id: 'segundo_roteador', nome: 'Segundo Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador adicional para expandir a cobertura' },
      { id: 'cartao_memoria', nome: 'Cartão Memória 32GB', preco: 5.99, icon: '💾', descricao: 'Cartão de memória para câmeras e dispositivos' }
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
      { id: 'ebook_light', nome: 'Ebook Light', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'watch_brasil', nome: 'Watch Brasil', preco: 12.90, icon: '⌚', descricao: 'Streaming de conteúdos brasileiros exclusivos' },
      { id: 'mini_conta_outra_vez', nome: 'Mini Conta Outra Vez', preco: 14.90, icon: '📺', descricao: 'Versão compacta do serviço de streaming' },
      { id: 'roteador', nome: 'Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador Wi-Fi de alta performance' },
      { id: 'segundo_roteador', nome: 'Segundo Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador adicional para expandir a cobertura' },
      { id: 'cartao_memoria', nome: 'Cartão Memória 32GB', preco: 5.99, icon: '💾', descricao: 'Cartão de memória para câmeras e dispositivos' },
      { id: 'chip_15gb', nome: 'Chip 15 GB', preco: 30.00, icon: '📱', descricao: 'Chip de dados móveis com 15GB de franquia' },
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
    speedNumber: '1',
    speedUnit: 'GB',
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
      { id: 'ebook_light', nome: 'Ebook Light', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'camera_interna', nome: 'Câmera Wi-Fi Interna', preco: 20.00, icon: '📹', descricao: 'Câmera de segurança interna com visão noturna' },
      { id: 'camera_externa_fixa', nome: 'Câmera Wi-Fi Externa Fixa', preco: 24.90, icon: '📹', descricao: 'Câmera de segurança externa fixa com alta resolução' },
      { id: 'camera_externa', nome: 'Câmera Wi-Fi Externa', preco: 29.90, icon: '📹', descricao: 'Câmera de segurança externa com visão 360°' },
      { id: 'roteador', nome: 'Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador Wi-Fi de alta performance' },
      { id: 'segundo_roteador', nome: 'Segundo Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador adicional para expandir a cobertura' },
      { id: 'cartao_memoria', nome: 'Cartão Memória 32GB', preco: 5.99, icon: '💾', descricao: 'Cartão de memória para câmeras e dispositivos' },
      { id: 'chip_15gb', nome: 'Chip 15 GB', preco: 30.00, icon: '📱', descricao: 'Chip de dados móveis com 15GB de franquia' },
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

  const abrirModalResumo = (plano) => {
    setPlanoSelecionadoModal(plano);
  };

  const fecharModal = () => {
    setPlanoSelecionadoModal(null);
  };

  const abrirModalServicos = (plano) => {
    setServicosModal(plano);
  };

  const fecharModalServicos = () => {
    setServicosModal(null);
  };

  const enviarParaWhatsApp = () => {
    if (!planoSelecionadoModal) return;

    const plano = planoSelecionadoModal;
    const total = calcularPrecoTotal(plano);
    const ativosDoPlano = adicionaisAtivos[plano.id] || [];
    const objetosAdicionais = plano.adicionaisDisponiveis.filter((add) =>
      ativosDoPlano.includes(add.id)
    );
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
            <div
              key={plano.id}
              className={`card-plano ${plano.featured ? 'featured' : ''}`}
            >
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
                    <button
                      className="btn-ver-mais"
                      onClick={() => abrirModalServicos(plano)}
                    >
                      <span></span> Ver todos os serviços
                      <span className="btn-ver-mais-count">
                        +{plano.adicionaisDisponiveis.length - 3}
                      </span>
                    </button>
                  )}
                </div>

                <button 
                  className="btn-detalhes"
                  onClick={() => abrirModalResumo(plano)}
                >
                  <span className="plus-circle">+</span> Conferir detalhes
                </button>
              </div>

              <div className="suporte-bar">
                <span className="badge-gold">⭐</span>
                <span>Suporte Premium</span>
              </div>

              <button
                className="btn-assine-ja"
                onClick={() => abrirModalResumo(plano)}
              >
                ASSINE JÁ
              </button>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          MODAL DE SERVIÇOS ADICIONAIS
         ========================================== */}
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

      {/* ==========================================
          MODAL DE RESUMO DA ESCOLHA
         ========================================== */}
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
                  <span>➕ Adicionais Selecionados</span>
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