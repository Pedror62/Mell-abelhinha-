// src/components/FloatingWidget/FloatingWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import './FloatingWidget.css';
import './MeusDados.css';
import { FaWhatsapp } from 'react-icons/fa';
import BoletoModal from './BoletoModal';
import AtendimentoModal from './AtendimentoModal';
import LojasModal from './LojasModal';
import CancelamentoModal from '../Autoatendimento/CancelamentoModal';
import Toast from './Toast';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const FloatingWidget = () => {
  // ============================================
  // ESTADOS DE UI
  // ============================================
  const [isOpen, setIsOpen] = useState(false);
  const [showIndiqueModal, setShowIndiqueModal] = useState(false);
  const [showBoletoModal, setShowBoletoModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMeusDadosModal, setShowMeusDadosModal] = useState(false);
  const [showAtendimentoModal, setShowAtendimentoModal] = useState(false);
  const [showLojasModal, setShowLojasModal] = useState(false);
  const [showCancelamentoModal, setShowCancelamentoModal] = useState(false);
  const [atendimentoModo, setAtendimentoModo] = useState('ligamos');
  const [pulsar, setPulsar] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const tooltipTimeoutRef = useRef(null);
  const tooltipIntervalRef = useRef(null);

  // ============================================
  // TOAST
  // ============================================
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const mostrarToast = (message, type = 'success') => setToast({ message, type });
  const fecharToast = () => setToast({ message: '', type: 'success' });

  // ============================================
  // NAVEGAÇÃO INTERNA
  // ============================================
  const [telaMeusDados, setTelaMeusDados] = useState('menu');

  // ============================================
  // LOGIN
  // ============================================
  const [usuarioLogin, setUsuarioLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [clienteLogado, setClienteLogado] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ============================================
  // CADASTRO
  // ============================================
  const [cadastroData, setCadastroData] = useState({
    nomeCompleto: '', cpfCnpj: '', whatsapp: '', email: '',
    cep: '', cidade: '', bairro: '', rua: '', numero: '', complemento: '',
  });
  const [loading, setLoading] = useState(false);
  const [cadastroError, setCadastroError] = useState('');
  const [cadastroSuccess, setCadastroSuccess] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  // ============================================
  // BOLETOS
  // ============================================
  const [boletos, setBoletos] = useState(null);
  const [boletosLoading, setBoletosLoading] = useState(false);
  const [boletosError, setBoletosError] = useState('');
  const [abaBoletos, setAbaBoletos] = useState('pendentes');

  // ============================================
  // DASHBOARD
  // ============================================
  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

  // ============================================
  // INDIQUE UM AMIGO
  // ============================================
  const [indiqueData, setIndiqueData] = useState({
    nomeIndicador: '', cpfIndicador: '', whatsIndicador: '', cidadeIndicador: '',
    nomeIndicado: '', cpfIndicado: '', whatsIndicado: '', cidadeIndicado: '',
  });

  // ============================================
  // FRASES DE CHAMARIZ
  // ============================================
  const frasesChamariz = [
    'Precisa de ajuda? Clique aqui!', 'Atendimento rápido e fácil!',
    'Suporte 24h disponível!', 'Tire suas dúvidas agora!',
    'Fale conosco pelo WhatsApp!', 'Problemas com internet? Clique aqui!',
    'Consulte seus boletos aqui!', 'Indique um amigo e ganhe descontos!',
  ];

  // ============================================
  // EFFECT: CHAMARIZ E CLIENTE
  // ============================================
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      if (!isOpen && !showLoginModal && !showMeusDadosModal && !showIndiqueModal && !showBoletoModal && !showAtendimentoModal && !showLojasModal && !showCancelamentoModal) {
        mostrarChamariz();
      }
    }, 3000);

    tooltipIntervalRef.current = setInterval(() => {
      if (!isOpen && !showLoginModal && !showMeusDadosModal && !showIndiqueModal && !showBoletoModal && !showAtendimentoModal && !showLojasModal && !showCancelamentoModal && !showTooltip) {
        mostrarChamariz();
      }
    }, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(tooltipIntervalRef.current);
      clearTimeout(tooltipTimeoutRef.current);
    };
  }, [isOpen, showTooltip, showLoginModal, showMeusDadosModal, showIndiqueModal, showBoletoModal, showAtendimentoModal, showLojasModal, showCancelamentoModal]);

  useEffect(() => {
    const algumModalAberto = showLoginModal || showMeusDadosModal || showIndiqueModal || showBoletoModal || showAtendimentoModal || showLojasModal || showCancelamentoModal;
    if (algumModalAberto) {
      setShowTooltip(false);
      clearTimeout(tooltipTimeoutRef.current);
    }
  }, [showLoginModal, showMeusDadosModal, showIndiqueModal, showBoletoModal, showAtendimentoModal, showLojasModal, showCancelamentoModal]);

  const mostrarChamariz = () => {
    const algumModalAberto = showLoginModal || showMeusDadosModal || showIndiqueModal || showBoletoModal || showAtendimentoModal || showLojasModal || showCancelamentoModal;
    if (isOpen || algumModalAberto) return;
    const fraseAleatoria = frasesChamariz[Math.floor(Math.random() * frasesChamariz.length)];
    setTooltipText(fraseAleatoria);
    setShowTooltip(true);
    clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 5000);
  };

  useEffect(() => {
    const savedCliente = localStorage.getItem('clienteLogado');
    if (savedCliente) {
      try {
        const cliente = JSON.parse(savedCliente);
        setClienteLogado(cliente);
        setClienteId(cliente.id_cliente);
        setCadastroData({
          nomeCompleto: cliente.nome_razaosocial || '',
          cpfCnpj: cliente.cpf_cnpj || '',
          whatsapp: cliente.telefone_primario || '',
          email: cliente.email_principal || '',
          cep: cliente.cep || '', cidade: cliente.cidade || '', bairro: cliente.bairro || '',
          rua: cliente.logradouro || '', numero: cliente.numero || '', complemento: cliente.complemento || '',
        });
      } catch (e) { console.error('Erro ao carregar cliente:', e); }
    }
  }, []);

  useEffect(() => {
    const timerPulsar = setTimeout(() => setPulsar(false), 10000);
    return () => clearTimeout(timerPulsar);
  }, []);

  // ============================================
  // FORMATADORES
  // ============================================
  const formatarData = (data) => {
    if (!data) return 'N/A';
    if (typeof data === 'string' && data.match(/^\d{2}\/\d{2}\/\d{4}$/)) return data;
    if (typeof data === 'string') {
      const partes = data.split('-');
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        if (ano && mes && dia && ano.length === 4) return `${dia}/${mes}/${ano}`;
      }
    }
    try {
      const d = new Date(data);
      if (!isNaN(d.getTime())) {
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
    } catch (e) { /* ignore */ }
    return data;
  };

  const formatarMoeda = (v) => {
    if (v === undefined || v === null || isNaN(v)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  };

  // FUNÇÃO DE FORMATAÇÃO DE ENDEREÇO MELHORADA
  const formatarEndereco = (enderecoObj) => {
    if (!enderecoObj) return 'Endereço não informado';
    if (typeof enderecoObj === 'string') return enderecoObj;
    if (enderecoObj.completo) return enderecoObj.completo;

    const partes = [
      enderecoObj.logradouro || enderecoObj.rua || enderecoObj.endereco,
      enderecoObj.numero,
      enderecoObj.complemento,
      enderecoObj.bairro,
      enderecoObj.cidade ? `${enderecoObj.cidade}${enderecoObj.uf ? `/${enderecoObj.uf}` : ''}` : null,
      enderecoObj.cep ? `CEP: ${enderecoObj.cep}` : null
    ].filter(Boolean);

    return partes.length > 0 ? partes.join(', ') : 'Endereço não informado';
  };

  // ============================================
  // CARREGAR DASHBOARD
  // ============================================
  const carregarDashboard = async (cliente) => {
    const codigo = cliente?.codigo_cliente || cliente?.id_cliente || clienteLogado?.codigo_cliente || clienteLogado?.id_cliente;
    const cpf = cliente?.cpf_cnpj || clienteLogado?.cpf_cnpj;
    
    if (!codigo && !cpf) { setDashboardError('Dados insuficientes do cliente.'); return; }
    setDashboardLoading(true);
    setDashboardError('');
    try {
      const response = await fetch(`${API_URL}/api/app/dashboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: { 
            codigo_cliente: codigo, 
            id_cliente: cliente?.id_cliente || clienteLogado?.id_cliente,
            cpf_cnpj: cpf
          }
        }),
      });
      const data = await response.json();
      if (!response.ok || data.status !== 'success') throw new Error(data.msg || 'Erro ao carregar informações.');
      
      setDashboard(data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setDashboardError(err.message || 'Erro ao carregar informações.');
    } finally { setDashboardLoading(false); }
  };

  // ============================================
  // BOLETOS
  // ============================================
  const handleBuscarMeusBoletosPara = async (cliente) => {
    const cpf = cliente?.cpf_cnpj || clienteLogado?.cpf_cnpj;
    if (!cpf) {
      if (!cliente) setTimeout(() => handleBuscarMeusBoletos(), 500);
      else setBoletosError('CPF/CNPJ não disponível. Faça login novamente.');
      return;
    }
    setBoletosLoading(true);
    setBoletosError('');
    try {
      const cpfLimpo = String(cpf).replace(/\D/g, '');
      const response = await fetch(`${API_URL}/api/consultar-boleto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpfCnpj: cpfLimpo, mostrarTodos: true }),
      });
      const data = await response.json();
      if (!response.ok && !data.faturas) throw new Error(data.error || data.msg || 'Erro ao consultar boletos.');
      const faturas = Array.isArray(data.faturas) ? data.faturas : [];
      const pagas = Array.isArray(data.faturasPagas) ? data.faturasPagas : [];
      const pendentes = faturas.filter((f) => !f.pago && !pagas.some((p) => p.id_fatura === f.id_fatura));
      setBoletos({
        todas: faturas, pagas, pendentes,
        totalPendentes: data.totalFaturasPendentes || pendentes.length,
        totalPagas: data.totalFaturasPagas || pagas.length,
        totalVencidas: data.totalFaturasVencidas || 0,
      });
      if (pendentes.length === 0 && pagas.length > 0) setAbaBoletos('pagas');
      else setAbaBoletos('pendentes');
    } catch (err) {
      console.error('Erro ao buscar boletos:', err);
      setBoletosError(err.message || 'Erro ao buscar boletos.');
    } finally { setBoletosLoading(false); }
  };

  const handleBuscarMeusBoletos = async () => handleBuscarMeusBoletosPara(clienteLogado);

  const handleCopiarBoleto = async (texto) => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(texto);
      else {
        const ta = document.createElement('textarea'); ta.value = texto;
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      mostrarToast('Código copiado com sucesso!', 'success');
    } catch (err) { mostrarToast('Não foi possível copiar o código.', 'error'); }
  };

  // ============================================
  // LOGIN
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true); setLoginError('');
    const usuario = usuarioLogin.trim(); const senha = senhaLogin;
    if (!usuario) { setLoginError('Informe seu usuário.'); setLoginLoading(false); return; }
    if (!senha) { setLoginError('Informe sua senha.'); setLoginLoading(false); return; }
    try {
      const response = await fetch(`${API_URL}/api/login-cliente`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.status !== 'success') throw new Error(data.error || data.msg || 'Usuário ou senha inválidos.');
      const cliente = data.cliente || {};
      if (!cliente.id_cliente) throw new Error('A API não devolveu o id_cliente.');
      setClienteLogado(cliente); setClienteId(cliente.id_cliente);
      localStorage.setItem('clienteLogado', JSON.stringify(cliente));
      localStorage.setItem('clienteId', String(cliente.id_cliente));
      setCadastroData({
        nomeCompleto: cliente.nome_razaosocial || '', cpfCnpj: cliente.cpf_cnpj || '',
        whatsapp: cliente.telefone_primario || '', email: cliente.email_principal || '',
        cep: cliente.cep || '', cidade: cliente.cidade || '', bairro: cliente.bairro || '',
        rua: cliente.logradouro || '', numero: cliente.numero || '', complemento: cliente.complemento || '',
      });
      setUsuarioLogin(''); setSenhaLogin(''); setMostrarSenha(false);
      setTelaMeusDados('menu'); 
      setShowLoginModal(false); 
      setShowMeusDadosModal(true); 
      setLoginError('');
      handleBuscarMeusBoletosPara(cliente); 
      carregarDashboard(cliente);
    } catch (error) {
      console.error('Erro no login:', error); setLoginError(error.message || 'Erro ao autenticar. Tente novamente.');
    } finally { setLoginLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('clienteLogado'); localStorage.removeItem('clienteId');
    setClienteLogado(null); setClienteId(null); setShowMeusDadosModal(false);
    setTelaMeusDados('menu'); setUsuarioLogin(''); setSenhaLogin(''); setMostrarSenha(false);
    setBoletos(null); setBoletosError(''); setAbaBoletos('pendentes');
    setDashboard(null); setDashboardError(''); setDashboardLoading(false);
    setCadastroData({ nomeCompleto: '', cpfCnpj: '', whatsapp: '', email: '', cep: '', cidade: '', bairro: '', rua: '', numero: '', complemento: '' });
  };

  // ============================================
  // ATUALIZAR CADASTRO
  // ============================================
  const handleAtualizarCadastro = async (e) => {
    e.preventDefault();
    setLoading(true); setCadastroError(''); setCadastroSuccess(false);
    try {
      const telefone = cadastroData.whatsapp.replace(/\D/g, '');
      const cpfCnpj = cadastroData.cpfCnpj.replace(/\D/g, '');
      const email = cadastroData.email.trim();
      if (!cadastroData.nomeCompleto.trim()) throw new Error('Informe o nome completo.');
      if (!cpfCnpj) throw new Error('Informe o CPF/CNPJ.');
      if (!telefone) throw new Error('Informe o telefone principal.');
      if (!email) throw new Error('Informe o e-mail principal.');
      const cliente = clienteLogado || {};
      const payload = {
        tipo_pessoa: cliente.tipo_pessoa || 'pf', ativo: cliente.ativo !== false,
        nome_razaosocial: cadastroData.nomeCompleto.trim(), nome_fantasia: cliente.nome_fantasia || '',
        cpf_cnpj: cpfCnpj, inscricao_municipal: cliente.inscricao_municipal || '', inscricao_estadual: cliente.inscricao_estadual || '',
        rg: cliente.rg || '', rg_emissor: cliente.rg_emissor || '',
        data_nascimento: (() => { const data = cliente.data_nascimento || cliente.data_nascmento; return data ? String(data).slice(0, 10).replace(/\//g, '-') : undefined; })(),
        telefone_primario: telefone, telefone_secundario: cliente.telefone_secundario || '', telefone_terciario: cliente.telefone_terciario || '',
        email_principal: email, email_secundario: cliente.email_secundario || '',
        grupos: Array.isArray(cliente.grupos) ? cliente.grupos.map((grupo) => ({ id_grupo_cliente: grupo.id_grupo_cliente })) : [],
        origem_cliente: cliente.id_origem_cliente || cliente.origem_cliente || undefined,
        motivo_contratacao: cliente.id_motivo_contratacao || cliente.motivo_contratacao || undefined,
        nome_pai: cliente.nome_pai || '', nome_mae: cliente.nome_mae || '', estado_civil: cliente.estado_civil || '',
        genero: cliente.genero || '', nacionalidade: cliente.nacionalidade || 'brasileiro', profissao: cliente.profissao || '', id_externo: cliente.id_externo || undefined,
      };
      Object.keys(payload).forEach((campo) => { if (payload[campo] === undefined) delete payload[campo]; });
      const response = await fetch(`${API_URL}/api/v1/integracao/cliente/cadastro/${encodeURIComponent(clienteId)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result.status !== 'success' || result.confirmacao === false) throw new Error(result.msg || 'A HubSoft não confirmou a atualização.');
      if (result.cliente) {
        const clienteAtualizado = result.cliente;
        setClienteLogado(clienteAtualizado); localStorage.setItem('clienteLogado', JSON.stringify(clienteAtualizado));
        setCadastroData({
          nomeCompleto: clienteAtualizado.nome_razaosocial || '', cpfCnpj: clienteAtualizado.cpf_cnpj || '',
          whatsapp: clienteAtualizado.telefone_primario || '', email: clienteAtualizado.email_principal || '',
          cep: clienteAtualizado.cep || '', cidade: clienteAtualizado.cidade || '', bairro: clienteAtualizado.bairro || '',
          rua: clienteAtualizado.logradouro || '', numero: clienteAtualizado.numero || '', complemento: clienteAtualizado.complemento || '',
        });
      }
      setCadastroSuccess(true);
      setTimeout(() => { setCadastroSuccess(false); setTelaMeusDados('menu'); }, 1800);
    } catch (error) {
      console.error('Erro ao atualizar:', error); setCadastroError(error.message || 'Erro ao atualizar cadastro');
    } finally { setLoading(false); }
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleInteraction = () => { setPulsar(false); setShowTooltip(false); clearTimeout(tooltipTimeoutRef.current); toggleWidget(); };
  const toggleWidget = () => { setIsOpen(!isOpen); setPulsar(false); setShowTooltip(false); clearTimeout(tooltipTimeoutRef.current); };
  const handleCadastroChange = async (e) => {
    const { name, value } = e.target;
    setCadastroData({ ...cadastroData, [name]: value });
    if (name === 'cep') {
      const cepLimpo = value.replace(/\D/g, '');
      if (cepLimpo.length === 8) {
        setCepLoading(true); setCepError('');
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          const data = await response.json();
          if (data.erro) { setCepError('CEP não encontrado.'); setCepLoading(false); return; }
          setCadastroData((prev) => ({ ...prev, cidade: data.localidade || '', bairro: data.bairro || '', rua: data.logradouro || '', complemento: data.complemento || '' }));
        } catch (error) { setCepError('Erro ao consultar CEP.'); } finally { setCepLoading(false); }
      }
    }
  };
  const handleIndiqueChange = (e) => { setIndiqueData({ ...indiqueData, [e.target.name]: e.target.value }); };
  const handleSubmitIndique = (e) => {
    e.preventDefault();
    const numeroAtendimento = '5538998358385';
    const mensagem = `*NOVA INDICAÇÃO DE AMIGO* %0A%0A*QUEM ESTÁ INDICANDO (CLIENTE):*%0A• *Nome:* ${indiqueData.nomeIndicador}%0A• *CPF:* ${indiqueData.cpfIndicador}%0A• *WhatsApp:* ${indiqueData.whatsIndicador}%0A• *Cidade:* ${indiqueData.cidadeIndicador}%0A%0A*QUEM É O INDICADO (AMIGO):*%0A• *Nome:* ${indiqueData.nomeIndicado}%0A• *CPF:* ${indiqueData.cpfIndicado}%0A• *WhatsApp:* ${indiqueData.whatsIndicado}%0A• *Cidade:* ${indiqueData.cidadeIndicado}`;
    window.open(`https://wa.me/${numeroAtendimento}?text=${mensagem}`, '_blank');
    setShowIndiqueModal(false);
  };

  const handleOpenMeusDados = () => {
    setIsOpen(false); 
    setPulsar(false); 
    setShowTooltip(false);
    if (clienteLogado) {
      setTelaMeusDados('menu'); 
      setShowMeusDadosModal(true);
      if (!dashboard && !dashboardLoading) carregarDashboard(clienteLogado);
      if (!boletos && !boletosLoading) handleBuscarMeusBoletosPara(clienteLogado);
    } else {
      setShowLoginModal(true); 
    }
  };

  const handleCloseMeusDados = () => { setShowMeusDadosModal(false); setTelaMeusDados('menu'); setCadastroError(''); setCadastroSuccess(false); };
  const handleOpenBoleto = () => {
    setIsOpen(false); setPulsar(false); setShowTooltip(false);
    if (clienteLogado) {
      setTelaMeusDados('boletos'); setShowMeusDadosModal(true);
      if (!boletos && !boletosLoading) setTimeout(() => handleBuscarMeusBoletosPara(clienteLogado), 150);
      return;
    }
    setShowBoletoModal(true);
  };
  const handleCloseBoleto = () => setShowBoletoModal(false);
  const handleAbrirAtendimento = (modo) => { setAtendimentoModo(modo); setShowAtendimentoModal(true); };
  const handleAbrirLojas = () => setShowLojasModal(true);
  const handleAbrirCancelamento = () => setShowCancelamentoModal(true);
  const handleCloseLogin = () => { setShowLoginModal(false); setLoginError(''); setUsuarioLogin(''); setSenhaLogin(''); setMostrarSenha(false); };

  // ============================================
  // RENDER
  // ============================================
  const algumModalAberto = showLoginModal || showMeusDadosModal || showIndiqueModal || showBoletoModal || showAtendimentoModal || showLojasModal || showCancelamentoModal;

  return (
    <div className={`floating-widget-container ${algumModalAberto ? 'modal-aberto' : ''}`}>
      {showTooltip && !algumModalAberto && (
        <div className="tooltip-bubble">
          <div className="tooltip-content">
            <span className="tooltip-text">{tooltipText}</span>
            <button className="tooltip-close" onClick={() => { setShowTooltip(false); clearTimeout(tooltipTimeoutRef.current); }}>✕</button>
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}

      {/* MENU PRINCIPAL DO WIDGET FLUTUANTE */}
      {isOpen && !algumModalAberto && (
        <div className="widget-popup">
          <div className="widget-header">
            <span>Atendimento & Opções</span>
            <button className="widget-close-x" onClick={toggleWidget}>&times;</button>
          </div>
          <div className="widget-options">
            <a href="https://wa.me/558000389004" target="_blank" rel="noopener noreferrer" className="widget-card">
              <div className="widget-card-icon"><FaWhatsapp className="link-icon" /></div>
              <div className="widget-card-text"><strong>Atendimento WhatsApp</strong><p>Fale direto no app do Zap</p></div>
            </a>
            <button className="widget-card" onClick={handleOpenBoleto}>
              <div className="widget-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e06d13"><path d="M240-96q-46 0-71-24.5T144-192v-144h96v-528l57.6 58 57.6-58 57.6 58 57.6-58 57.6 58 57.6-58 57.6 58 57.6-58 57.6 58 57.6-58 57.6 58 57.6-58 57.6 58v660q0 47-31 77.5T708-96H240Z"/></svg>
              </div>
              <div className="widget-card-text"><strong>2ª Via de Boleto</strong><p>{clienteLogado ? 'Ver meus boletos' : 'Consulte e baixe seus boletos'}</p></div>
            </button>
            <button className="widget-card" onClick={() => setShowIndiqueModal(true)}>
              <div className="widget-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e06d13"><path d="M708-432v-84h-84v-72h84v-84h72v84h84v72h-84v84h-72Zm-426-90q-42-42-42-102t42-102q42-42 102-42t102 42q42 42 42 102t-42 102q-42 42-102 42t-102-42ZM96-192v-92q0-25.78 12.5-47.39T143-366q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.61T672-284v92H96Z"/></svg>
              </div>
              <div className="widget-card-text"><strong>Indique um amigo</strong><p>Ganhe descontos indicando</p></div>
            </button>
            <button className="widget-card" onClick={handleOpenMeusDados} style={{ borderColor: '#17a2b8' }}>
              <div className="widget-card-icon" style={{ background: '#e3f4f8', color: '#17a2b8' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e06d13"><path d="M528-432h216v-72H528v72Zm0-120h216v-72H528v72ZM192-336h288v-45q0-29-44-52t-100.5-23q-56.5 0-100 22.5T192-381v45Zm195-165.21q21-21.21 21-51T386.79-603q-21.21-21-51-21T285-602.79q-21 21.21-21 51T285.21-501q21.21 21 51 21T387-501.21ZM168-192q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h624q29.7 0 50.85 21.16Q864-725.68 864-695.96v432.24Q864-234 842.85-213T792-192H168Z"/></svg>
              </div>
              <div className="widget-card-text"><strong>{clienteLogado ? 'Meus Dados' : 'Acessar Meus Dados'}</strong><p>{clienteLogado ? `Olá, ${clienteLogado.nome_razaosocial?.split(' ')[0] || 'Cliente'}!` : 'Entre com usuário e senha'}</p></div>
            </button>
            {clienteLogado && (
              <button className="widget-card" onClick={handleLogout} style={{ borderColor: '#dc3545' }}>
                <div className="widget-card-icon" style={{ background: '#fef0f0', color: '#dc3545' }}>🚪</div>
                <div className="widget-card-text"><strong style={{ color: '#dc3545' }}>Sair</strong><p>Desconectar da conta</p></div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* POPUP DE LOGIN */}
      {showLoginModal && (
        <div className="login-meus-dados-overlay" onClick={handleCloseLogin}>
          <div className="login-meus-dados-card" onClick={(e) => e.stopPropagation()}>
            <div className="login-meus-dados-header">
              <h3>Acessar Meus Dados</h3>
              <button type="button" className="login-meus-dados-close" onClick={handleCloseLogin}>&times;</button>
            </div>
            <p className="login-meus-dados-desc">Entre com o mesmo usuário e senha que você usa no aplicativo ou na Central do Assinante.</p>
            <form onSubmit={handleLogin} className="login-meus-dados-form">
              {loginError && <div className="login-meus-dados-error"><span>{loginError}</span></div>}
              <input type="text" className="login-meus-dados-input" placeholder="Usuário (CPF/CNPJ ou login) *" value={usuarioLogin} onChange={(e) => setUsuarioLogin(e.target.value)} required autoFocus disabled={loginLoading} autoComplete="username" />
              <div style={{ position: 'relative', width: '100%' }}>
                <input type={mostrarSenha ? 'text' : 'password'} className="login-meus-dados-input" placeholder="Senha *" value={senhaLogin} onChange={(e) => setSenhaLogin(e.target.value)} required disabled={loginLoading} autoComplete="current-password" style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setMostrarSenha((v) => !v)} disabled={loginLoading} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#666' }}>
                  {mostrarSenha ? '🙈' : '👁️'}
                </button>
              </div>
              <button type="submit" className="login-meus-dados-btn" disabled={loginLoading}>{loginLoading ? 'Entrando...' : 'Entrar'}</button>
              <p className="login-meus-dados-helper">Use o mesmo login e senha do App ou da Central do Assinante.</p>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MEUS DADOS - LAYOUT GRANDE */}
      {showMeusDadosModal && clienteLogado && (
        <div className="meus-dados-overlay" onClick={handleCloseMeusDados}>
          <div className="app-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="app-modal-header-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="welcome-avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                  {clienteLogado.nome_razaosocial?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <h2>Meus Dados</h2>
                  <p>Gerencie suas informações e acompanhe seus serviços.</p>
                </div>
              </div>
              <button className="btn-close-top" onClick={handleCloseMeusDados}>✕</button>
            </div>

            <div className="app-modal-layout">
              <aside className="app-sidebar">
                <button className={`app-sidebar-item ${telaMeusDados === 'menu' ? 'active' : ''}`} onClick={() => setTelaMeusDados('menu')}>
                  👤 Minha Conta
                </button>
                <button className="app-sidebar-item" onClick={() => setTelaMeusDados('boletos')}>
                  📄 Boletos
                </button>
                <button className="app-sidebar-item" onClick={() => setTelaMeusDados('atendimentos')}>
                  🎫 Atendimentos
                </button>
                <button className="app-sidebar-item" onClick={() => setTelaMeusDados('ordens')}>
                  🔧 Ordens de Serviço
                </button>
                <button className="app-sidebar-item logout" onClick={handleLogout}>
                  🚪 Sair
                </button>
              </aside>

              <div className="app-content">
                
                {/* TELA: MINHA CONTA (INÍCIO) */}
                {telaMeusDados === 'menu' && (
                  <>
                    <div className="welcome-card">
                      <div className="welcome-user">
                        <div className="welcome-avatar">{clienteLogado.nome_razaosocial?.charAt(0).toUpperCase() || 'C'}</div>
                        <div className="welcome-text">
                          <h3>Olá, {clienteLogado.nome_razaosocial?.split(' ')[0] || 'Cliente'}!</h3>
                          <p>Seja bem-vindo(a) de volta!</p>
                        </div>
                      </div>
                      <div className="status-badge">
                        🛜 Seu plano está ativo
                      </div>
                    </div>

                    {/* CARD DO PLANO */}
                    {(() => {
                      const servico = dashboard?.servicos?.find(s => s.endereco_instalacao) || dashboard?.servicos?.[0] || clienteLogado?.servico_detalhes || null;
                      return (
                        <div className="plan-card">
                          <div className="plan-info">
                            <h4>PLANO ATUAL</h4>
                            <h2>{servico?.nome || 'Plano de Internet'}</h2>
                            <p>{servico?.tecnologia ? `Tecnologia: ${servico.tecnologia}` : 'Internet de alta velocidade.'}</p>
                            <div className="plan-price">
                              {formatarMoeda(servico?.valor || 0)}<span>/mês</span>
                            </div>
                            <span style={{ fontSize: 12, color: '#0284c7', fontWeight: 600 }}>{servico?.status || 'Verificando status...'}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* NOVO CARD: DETALHES DO SERVIÇO (DADOS COMPLETOS) */}
                    {(() => {
                      const servico = dashboard?.servicos?.[0];
                      if (!servico) return null;
                      return (
                        <div className="section-card">
                          <div className="section-header">
                            <h3 className="section-title">📋 Detalhes do Serviço</h3>
                          </div>
                          <div className="info-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            {servico.id_cliente_servico && (
                              <div className="info-item">
                                <label>ID do Serviço</label>
                                <span>{servico.id_cliente_servico}</span>
                              </div>
                            )}
                            {servico.numero_plano && (
                              <div className="info-item">
                                <label>Número do Plano</label>
                                <span>{servico.numero_plano}</span>
                              </div>
                            )}
                            {servico.velocidade_download && (
                              <div className="info-item">
                                <label>Velocidade Download</label>
                                <span>{servico.velocidade_download}</span>
                              </div>
                            )}
                            {servico.velocidade_upload && (
                              <div className="info-item">
                                <label>Velocidade Upload</label>
                                <span>{servico.velocidade_upload}</span>
                              </div>
                            )}
                            {servico.data_habilitacao_br && (
                              <div className="info-item">
                                <label>Data de Habilitação</label>
                                <span>{servico.data_habilitacao_br}</span>
                              </div>
                            )}
                            {servico.data_inicio_contrato && (
                              <div className="info-item">
                                <label>Início do Contrato</label>
                                <span>{formatarData(servico.data_inicio_contrato)}</span>
                              </div>
                            )}
                            {servico.data_fim_contrato && (
                              <div className="info-item">
                                <label>Fim do Contrato</label>
                                <span>{formatarData(servico.data_fim_contrato)}</span>
                              </div>
                            )}
                            {servico.vigencia_meses && (
                              <div className="info-item">
                                <label>Vigência</label>
                                <span>{servico.vigencia_meses} meses</span>
                              </div>
                            )}
                            {servico.tipo_cobranca_formatada && (
                              <div className="info-item">
                                <label>Tipo de Cobrança</label>
                                <span>{servico.tipo_cobranca_formatada}</span>
                              </div>
                            )}
                            {servico.ultima_conexao?.ultima_conexao && (
                              <div className="info-item">
                                <label>Última Conexão</label>
                                <span>{formatarData(servico.ultima_conexao.ultima_conexao)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* DADOS PESSOAIS */}
                    <div className="section-card">
                      <div className="section-header">
                        <h3 className="section-title">👤 Dados Pessoais</h3>
                        <button className="btn-edit" onClick={() => setTelaMeusDados('editar')}>✏️ Editar</button>
                      </div>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Nome completo</label>
                          <span>{dashboard?.cliente?.nome_razaosocial || clienteLogado.nome_razaosocial || '—'}</span>
                        </div>
                        <div className="info-item">
                          <label>E-mail</label>
                          <span>{dashboard?.cliente?.email_principal || clienteLogado.email_principal || '—'}</span>
                        </div>
                        <div className="info-item">
                          <label>Telefone Principal</label>
                          <span>{dashboard?.cliente?.telefone_primario || clienteLogado.telefone_primario || '—'}</span>
                        </div>
                        <div className="info-item">
                          <label>CPF / CNPJ</label>
                          <span>{dashboard?.cliente?.cpf_cnpj || clienteLogado.cpf_cnpj || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* ENDEREÇO DE INSTALAÇÃO */}
                    <div className="section-card">
                      <div className="section-header">
                        <h3 className="section-title">📍 Endereço de Instalação</h3>
                      </div>
                      <div className="info-grid">
                        <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                          <label>Endereço completo</label>
                          <span>
                            {(() => {
                              const servicos = dashboard?.servicos ?? dashboard?.cliente?.servicos ?? [];
                              const servicoComEndereco = servicos.find(s => s.endereco_instalacao || s.endereco) || servicos[0];
                              const enderecoBruto = servicoComEndereco?.endereco_instalacao || servicoComEndereco?.endereco;
                              return formatarEndereco(enderecoBruto);
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS E NOTIFICAÇÕES */}
                    <div className="status-grid">
                      <div className="status-box green">
                        <div className="status-box-header">✅ Status da Conta <span style={{background:'#16a34a', color:'white', padding:'2px 8px', borderRadius:10, fontSize:10}}>Ativo</span></div>
                        <p>Sua conta está em dia e sem pendências.</p>
                        <button className="btn-block" onClick={() => setTelaMeusDados('boletos')}>Ver detalhes</button>
                      </div>
                      <div className="status-box blue">
                        <div className="status-box-header">🔔 Notificações</div>
                        <p>Você tem {boletos?.pendentes?.length || 0} notificações importantes.</p>
                        <button className="btn-block" onClick={() => setTelaMeusDados('atendimentos')}>Ver notificações</button>
                      </div>
                    </div>
                  </>
                )}

                {/* TELA: EDITAR DADOS */}
                {telaMeusDados === 'editar' && (
                  <div className="section-card">
                    <h3 className="section-title" style={{ marginBottom: 20 }}>✏️ Editar Dados</h3>
                    {cadastroSuccess && <div className="app-alert-success" style={{ marginBottom: 15, color: 'green' }}>✓ Cadastro atualizado!</div>}
                    {cadastroError && <div className="app-alert-error" style={{ marginBottom: 15, color: 'red' }}>! {cadastroError}</div>}
                    <form onSubmit={handleAtualizarCadastro} className="app-form">
                      <div className="app-form-group">
                        <label>Nome Completo *</label>
                        <input type="text" name="nomeCompleto" value={cadastroData.nomeCompleto} onChange={handleCadastroChange} required className="app-input" />
                      </div>
                      <div className="app-form-group">
                        <label>WhatsApp *</label>
                        <input type="tel" name="whatsapp" value={cadastroData.whatsapp} onChange={handleCadastroChange} required className="app-input" />
                      </div>
                      <div className="app-form-group">
                        <label>E-mail</label>
                        <input type="email" name="email" value={cadastroData.email} onChange={handleCadastroChange} className="app-input" />
                      </div>
                      <div className="app-form-group">
                        <label>CEP *</label>
                        <input type="text" name="cep" value={cadastroData.cep} onChange={handleCadastroChange} maxLength={9} required className="app-input" />
                        {cepLoading && <small>Buscando CEP...</small>}
                      </div>
                      <div className="app-form-group">
                        <label>Cidade *</label>
                        <input type="text" name="cidade" value={cadastroData.cidade} onChange={handleCadastroChange} required className="app-input" />
                      </div>
                      <div className="app-form-group">
                        <label>Bairro *</label>
                        <input type="text" name="bairro" value={cadastroData.bairro} onChange={handleCadastroChange} required className="app-input" />
                      </div>
                      <div className="app-form-group">
                        <label>Rua *</label>
                        <input type="text" name="rua" value={cadastroData.rua} onChange={handleCadastroChange} required className="app-input" />
                      </div>
                      <div className="app-form-group">
                        <label>Número *</label>
                        <input type="text" name="numero" value={cadastroData.numero} onChange={handleCadastroChange} required className="app-input" />
                      </div>
                      <button type="submit" className="app-primary-btn" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
                      <button type="button" className="btn-block" onClick={() => setTelaMeusDados('menu')}>Cancelar</button>
                    </form>
                  </div>
                )}

                {/* TELA: BOLETOS */}
                {telaMeusDados === 'boletos' && (
                  <>
                    <h2 style={{ fontSize: 18, marginBottom: 20 }}>Meus Boletos</h2>
                    {boletosLoading && <div className="app-loading">Carregando...</div>}
                    {boletosError && <div className="app-error">{boletosError}</div>}
                    {boletos && (
                      <div className="app-boletos-lista">
                        {(abaBoletos === 'pendentes' ? boletos.pendentes : boletos.pagas).map((fatura, index) => {
                          const isPaga = abaBoletos === 'pagas';
                          return (
                            <div key={fatura.id_fatura || index} className={`app-boleto-card ${isPaga ? 'pago' : ''}`}>
                              <div className="app-boleto-header">
                                <span className="app-boleto-id">#{fatura.id_fatura}</span>
                                <span className="app-boleto-valor">{formatarMoeda(fatura.valor || 0)}</span>
                              </div>
                              <div className="app-boleto-datas">
                                <span>Venc: {formatarData(fatura.data_vencimento)}</span>
                                {isPaga && fatura.data_pagamento && <span>Pago em: {formatarData(fatura.data_pagamento)}</span>}
                              </div>
                              <div className="app-boleto-acoes">
                                {!isPaga && fatura.pix_copia_e_cola && <button className="app-boleto-btn pix" onClick={() => handleCopiarBoleto(fatura.pix_copia_e_cola)}>PIX</button>}
                                {!isPaga && fatura.linha_digitavel && <button className="app-boleto-btn codigo" onClick={() => handleCopiarBoleto(fatura.linha_digitavel)}>Código</button>}
                                {fatura.link && <a className="app-boleto-btn link" href={fatura.link} target="_blank" rel="noopener noreferrer">{isPaga ? 'Comprovante' : 'Baixar'}</a>}
                              </div>
                            </div>
                          );
                        })}
                        {(abaBoletos === 'pendentes' ? boletos.pendentes : boletos.pagas).length === 0 && (
                          <div className="app-empty">Nenhuma fatura encontrada.</div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* TELA: ATENDIMENTOS */}
                {telaMeusDados === 'atendimentos' && (
                  <>
                    <h2 style={{ fontSize: 18, marginBottom: 20 }}>Meus Atendimentos</h2>
                    {dashboard?.atendimentos?.atendimentos?.length > 0 ? (
                      <div className="app-boletos-lista">
                        {dashboard.atendimentos.atendimentos.map((a, i) => (
                          <div key={a.id_atendimento || i} className="app-boleto-card">
                            <div className="app-boleto-header">
                              <span className="app-boleto-id">{a.protocolo ? `#${a.protocolo}` : `#${a.id_atendimento}`}</span>
                              <span className="app-boleto-valor" style={{ fontSize: '12px', color: '#d97706' }}>{a.status || 'Em Andamento'}</span>
                            </div>
                            <div className="app-boleto-datas">
                              <span>{formatarData(a.data_cadastro)}</span>
                              {a.tipo_atendimento && <span>Tipo: {a.tipo_atendimento}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="app-empty">Nenhum atendimento encontrado.</div>
                    )}
                  </>
                )}

                {/* TELA: ORDENS DE SERVIÇO */}
                {telaMeusDados === 'ordens' && (
                  <>
                    <h2 style={{ fontSize: 18, marginBottom: 20 }}>Ordens de Serviço</h2>
                    {dashboard?.ordens_servico?.ordens_servico?.length > 0 ? (
                      <div className="app-boletos-lista">
                        {dashboard.ordens_servico.ordens_servico.map((os, i) => (
                          <div key={os.id_ordem_servico || i} className="app-boleto-card">
                            <div className="app-boleto-header">
                              <span className="app-boleto-id">OS #{os.numero_ordem_servico || os.id_ordem_servico}</span>
                              <span className="app-boleto-valor" style={{ fontSize: '12px', color: '#d97706' }}>{os.status || 'Pendente'}</span>
                            </div>
                            <div className="app-boleto-datas">
                              {os.tipo_ordem_servico && <span>Tipo: {os.tipo_ordem_servico}</span>}
                              {os.data_cadastro && <span>Abertura: {formatarData(os.data_cadastro)}</span>}
                              {os.tecnicos && os.tecnicos.length > 0 && (
                                <span style={{ color: '#2563eb', fontWeight: 'bold', marginTop: 4 }}>👤 Técnico: {os.tecnicos.map(t => t.name || t.display).join(', ')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="app-empty">Nenhuma ordem de serviço encontrada.</div>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INDIQUE */}
      {showIndiqueModal && (
        <div className="indique-modal-overlay" onClick={() => setShowIndiqueModal(false)}>
          <div className="indique-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="indique-modal-header">
              <div className="header-title-box"><h3>Indique um Amigo</h3></div>
              <button className="widget-close-x" onClick={() => setShowIndiqueModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmitIndique} className="indique-form">
              <div className="form-section">
                <h4>Seus Dados (Quem indica)</h4>
                <div className="form-grid">
                  <input type="text" name="nomeIndicador" placeholder="Seu Nome Completo" value={indiqueData.nomeIndicador} onChange={handleIndiqueChange} required />
                  <input type="text" name="cpfIndicador" placeholder="Seu CPF" value={indiqueData.cpfIndicador} onChange={handleIndiqueChange} required />
                  <input type="tel" name="whatsIndicador" placeholder="Seu WhatsApp" value={indiqueData.whatsIndicador} onChange={handleIndiqueChange} required />
                  <input type="text" name="cidadeIndicador" placeholder="Sua Cidade" value={indiqueData.cidadeIndicador} onChange={handleIndiqueChange} required />
                </div>
              </div>
              <div className="form-section">
                <h4>Dados do Amigo (Indicado)</h4>
                <div className="form-grid">
                  <input type="text" name="nomeIndicado" placeholder="Nome do Amigo" value={indiqueData.nomeIndicado} onChange={handleIndiqueChange} required />
                  <input type="text" name="cpfIndicado" placeholder="CPF do Amigo" value={indiqueData.cpfIndicado} onChange={handleIndiqueChange} required />
                  <input type="tel" name="whatsIndicado" placeholder="WhatsApp do Amigo" value={indiqueData.whatsIndicado} onChange={handleIndiqueChange} required />
                  <input type="text" name="cidadeIndicado" placeholder="Cidade do Amigo" value={indiqueData.cidadeIndicado} onChange={handleIndiqueChange} required />
                </div>
              </div>
              <button type="submit" className="submit-indique-btn">Enviar Indicação</button>
            </form>
          </div>
        </div>
      )}

      <BoletoModal isOpen={showBoletoModal} onClose={handleCloseBoleto} cpfInicial={clienteLogado?.cpf_cnpj || ''} />
      <AtendimentoModal isOpen={showAtendimentoModal} onClose={() => setShowAtendimentoModal(false)} modo={atendimentoModo} />
      <LojasModal isOpen={showLojasModal} onClose={() => setShowLojasModal(false)} />
      <CancelamentoModal isOpen={showCancelamentoModal} onClose={() => setShowCancelamentoModal(false)} />

      <Toast message={toast.message} type={toast.type} onClose={fecharToast} duration={3000} />

      <button
        className={`floating-button ${isOpen ? 'active' : ''} ${pulsar ? 'pulsar' : ''}`}
        onClick={handleInteraction}
        aria-label="Abrir menu de opções"
        style={algumModalAberto ? { zIndex: 100 } : {}}
      >
        <span className="floating-button-icon">{isOpen ? '✕' : '+'}</span>
      </button>
    </div>
  );
};

export default FloatingWidget;