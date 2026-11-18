import React, { useState } from 'react';
import './Planos.css';

// ============================================================
// IMPORTAÇÃO DAS IMAGENS LOCAIS
// ============================================================
import imgContaOutraVez from '../../assets/ConteOutraVez.png';
import imgContaOutraVezMini from '../../assets/conteOutraVezMini.png';
import imgOleTV from '../../assets/oletv.png';
// import imgWifi6 from '../../assets/icon_wifi6.png'; // ❌ REMOVIDO (não estava na pasta)
import imgClube from '../../assets/icon_clube.png';
import imgDeezer from '../../assets/dezzer.png';
import imgQualifica from '../../assets/Qualifica.png'; // ❌ REMOVIDO (pode estar com outro nome)
import imgMaquinaContos from '../../assets/maquinadecontos.png';
import imgEbookStandard from '../../assets/Standard_Ebooks_logo.png';
import imgWatchBrasil from '../../assets/WatchBrasil.png'; 

// ============================================================
// SVGs SUBSTITUTOS
// ============================================================
const SVG_CHIP_35GB = (
  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#e06d13" className="servico-icon-svg small">
    <path d="M312-240h72v-72h-72v72Zm0-144h72v-144h-72v144Zm132 144h72v-144h-72v144Zm0-216h72v-72h-72v72Zm132 216h72v-72h-72v72Zm0-144h72v-144h-72v144ZM263.72-96Q234-96 213-117.15T192-168v-504l192-192h312q29.7 0 50.85 21.15Q768-821.7 768-792v624q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72Zm.28-72h432v-624H414L264-642v474Zm0 0h432-432Z"></path>
  </svg>
);

const SVG_ROTEADOR = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#e06d13" className="servico-icon-svg small">
    <path d="M4.5,17q-0.62,0-1.06-0.44T3,15.5v-3q0-0.62 0.44-1.06T4.5,11h8V8H14v3h1.5q0.64 0 1.09,0.44T17,12.5v3q-0.04,0.6-0.47,1.05T15.5,17H4.5Zm0-1.5h11v-3H4.5v3Zm2.28-0.96Q7,14.32 7,14T6.79,13.47T6.25,13.25T5.72,13.46T5.5,14t0.21,0.54t0.53,0.22t0.54-0.21Zm2.75,0Q9.75,14.32 9.75,14T9.54,13.47T9,13.25T8.47,13.46T8.25,14t0.21,0.54T9,14.75t0.54-0.21Zm2.75,0Q12.5,14.32 12.5,14t-0.21-0.54t-0.53-0.22t-0.54,0.21T11,14t0.21,0.54t0.53,0.22t0.54-0.21ZM12.1,6.85L11.04,5.79q0.44-0.42 1.02-0.6T13.25,5t1.19,0.19t1.02,0.6L14.4,6.85q-0.23-0.23-0.53-0.29T13.25,6.5T12.64,6.56T12.1,6.85ZM10,4.75L8.92,3.67Q9.77,2.79 10.91,2.4T13.25,2t2.34,0.4t1.99,1.27L16.5,4.75Q15.85,4.1 15.01,3.8T13.25,3.5T11.49,3.8T10,4.75ZM4.5,15.5v-3v3Z"/>
  </svg>
);

const SVG_CAMERA_EXTERNA = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#e06d13" className="servico-icon-svg small">
    <path d="M11.38,16.15Q11.1,16.47 10.7,16.5T9.96,16.25L7.29,13.98Q6.33,13.17 5.9,12.01T5.69,9.63L4.77,8.92Q4.5,8.71 4.44,8.38T4.5,7.75h-1V9.5q0,0.62-0.44,1.06T2,11V3Q2.63,3 3.06,3.44T3.5,4.5V6.25H5.71l1.21-1.4q0.27-0.3 0.66-0.34T8.29,4.75L9.15,5.46q1.19-0.42 2.43-0.22t2.18,0.99l2.79,2.33q0.31,0.27 0.36,0.68T16.67,9.98l-5.29,6.17Zm-0.83-1.35l4.65-5.4l-2.42-2q-0.79-0.67-1.85-0.73T8.85,7.17L7.73,6.21L6.13,8.06L7.31,9q-0.35,1.15-0.1,2.16t1.03,1.68l2.3,1.95Zm0.1-4.29Z"/>
  </svg>
);

// SVG para o Wi-Fi 6 (já que a imagem foi removida)
const SVG_WIFI_6 = (
  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#e06d13" className="servico-icon-svg small">
    <path d="M480-120q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM254-334l-56-56q56-56 128-84t154-28q82 0 154 28t128 84l-56 56q-45-45-104.5-66.5T480-422q-69 0-128.5 21.5T254-334ZM140-448l-56-56q82-82 178-119t218-37q122 0 218 37t178 119l-56 56q-72-72-156-104t-184-32q-100 0-184 32T140-448Z"/>
  </svg>
);

// SVG para Qualifica (já que a imagem foi removida)
const SVG_LIVROS = (
  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#e06d13" className="servico-icon-svg small">
    <path d="M480-120q-126 0-213-87t-87-213q0-126 87-213t213-87q126 0 213 87t87 213q0 126-87 213t-213 87Zm0-80q88 0 150-62t62-150q0-88-62-150t-150-62q-88 0-150 62t-62 150q0 88 62 150t150 62Zm-40-200h80v-240h-80v240Zm40 80q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Z"/>
  </svg>
);

// Função de renderização de ícones
const getServicoIcon = (nome, emoji, size = 'default') => {
  if (nome === 'Chip 35 GB') return SVG_CHIP_35GB;
  if (nome === 'Roteador' || nome === 'Segundo Roteador') return SVG_ROTEADOR;
  if (nome === 'Câmera Wi-Fi Externa Fixa' || nome === 'Câmera Wi-Fi Externa' || nome === 'Câmera Wi-Fi Interna') return SVG_CAMERA_EXTERNA;
  
  if (nome === 'livros' || nome === 'Livros*' || nome === 'livros*') {
    return <span className={`servico-icon-emoji ${size}`}>📚</span>;
  }

  switch (nome) {
    case 'Olé TV': return <img src={imgOleTV} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Wi-Fi 6': return SVG_WIFI_6; // ✅ Substituído por SVG
    case 'Clube': return <img src={imgClube} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Deezer': return <img src={imgDeezer} alt={nome} className={`servico-icon-img ${size}`} />;
   case 'Qualifica': return <img src={imgQualifica} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Máquina de Contos': return <img src={imgMaquinaContos} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Ebook Standard': return <img src={imgEbookStandard} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Watch Brasil': return <img src={imgWatchBrasil} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Conta Outra Vez': return <img src={imgContaOutraVez} alt={nome} className={`servico-icon-img ${size}`} />;
    case 'Mini Conta Outra Vez': return <img src={imgContaOutraVezMini} alt={nome} className={`servico-icon-img ${size}`} />;
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
      { id: 'watch_brasil', nome: 'Watch Brasil', preco: 12.90, icon: '⌚', descricao: 'Streaming de conteúdos brasileiros exclusivos' },
      { id: 'ebook_light', nome: 'Qualifica', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'conta_outra_vez', nome: 'Conta Outra Vez', preco: 19.90, icon: '📺', descricao: 'Serviço de streaming com conteúdo exclusivo' },
      { id: 'maquina_contos', nome: 'Máquina de Contos', preco: 19.90, icon: '📖', descricao: 'Histórias infantis interativas e educativas' },
      { id: 'ebook_standard', nome: 'Ebook Standard', preco: 11.90, icon: '📚', descricao: 'Biblioteca digital com milhares de títulos' },
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
      { id: 'deezer', nome: 'Deezer', preco: 10.00, icon: '🎵', descricao: 'Streaming de música com milhões de faixas' },
      { id: 'camera_interna', nome: 'Câmera Wi-Fi Interna', preco: 20.00, icon: '📹', descricao: 'Câmera de segurança interna com visão noturna' },
      { id: 'chip_35gb', nome: 'Chip 35 GB', preco: 30.00, icon: '📱', descricao: 'Chip de dados móveis com 35GB de franquia' },
      { id: 'maquina_contos', nome: 'Máquina de Contos', preco: 19.90, icon: '📖', descricao: 'Histórias infantis interativas e educativas' },
      { id: 'ebook_standard', nome: 'Ebook Standard', preco: 11.90, icon: '📚', descricao: 'Biblioteca digital com milhares de títulos' },
      { id: 'ebook_light', nome: 'Qualifica', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
      { id: 'watch_brasil', nome: 'Watch Brasil', preco: 12.90, icon: '⌚', descricao: 'Streaming de conteúdos brasileiros exclusivos' },
      { id: 'mini_conta_outra_vez', nome: 'Mini Conta Outra Vez', preco: 14.90, icon: '📺', descricao: 'Versão compacta do serviço de streaming' },
      { id: 'roteador', nome: 'Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador Wi-Fi de alta performance' },
      { id: 'segundo_roteador', nome: 'Segundo Roteador', preco: 15.00, icon: '📡', descricao: 'Roteador adicional para expandir a cobertura' },
      { id: 'cartao_memoria', nome: 'Cartão Memória 32GB', preco: 5.99, icon: '💾', descricao: 'Cartão de memória para câmeras e dispositivos' },
      { id: 'conta_outra_vez', nome: 'Conta Outra Vez', preco: 19.90, icon: '📺', descricao: 'Serviço de streaming com conteúdo exclusivo' },
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
      { id: 'ebook_light', nome: 'Qualifica', preco: 12.90, icon: '📚', descricao: 'Biblioteca digital leve com os melhores títulos' },
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

    window.open(`https://wa.me/558000389004?text=${encodeURIComponent(msg)}`, '_blank');
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="1 1 18 18" height="18px" width="18px" fill="#e06d13"><path d="M3.5,14.5q0-0.13 0-0.25T3.5,14q0-2.3 0-3.9t0-1.6t0,0.06t0,0.15V5.5v9Zm11.54,2.25L12.3,14q-0.25-0.25-0.36-0.55t-0.1-0.58q0-0.62 0.44-1.12t1.16-0.5q0.56 0 0.88,0.26q0.32,0.26 0.74,0.68q0.4-0.4 0.71-0.67t0.89-0.27q0.74 0 1.17,0.5t0.44,1.12q0,0.29-0.11,0.59T17.79,14l-2.75,2.75ZM3.5,7h13V5.5H3.5V7Zm6.35,9H3.5q-0.6,0-1.05-0.45T2,14.5v-9Q2,4.9 2.45,4.45T3.5,4h13q0.62,0 1.06,0.45T18,5.5V9.4q-0.67-0.42-1.42-0.66T14.98,8.5q-1.1,0-2.07 0.4T11.21,10H3.5v4.5h6q0.04,0.39 0.13,0.77T9.85,16Z"/></svg>
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