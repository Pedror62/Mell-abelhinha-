// src/components/BoletoModal/BoletoModal.jsx
import React, { useState } from 'react';
import './BoletoModal.css';

// ============================================
// FUNÇÕES AUXILIARES (NÃO ALTERAR)
// ============================================

// Função para formatar data no padrão brasileiro
function formatarDataBR(data) {
  if (!data) return 'N/A';
  
  // Se já estiver no formato DD/MM/YYYY, retorna
  if (data.match(/^\d{2}\/\d{2}\/\d{4}$/)) return data;
  
  try {
    // Tenta converter YYYY-MM-DD
    const partes = data.split('-');
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      if (ano && mes && dia && ano.length === 4) {
        return `${dia}/${mes}/${ano}`;
      }
    }
    
    // Tenta converter de outros formatos
    const date = new Date(data);
    if (!isNaN(date.getTime())) {
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
    
    return data;
  } catch (e) {
    return data;
  }
}

// Função para formatar valores monetários
function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const BoletoModal = ({ isOpen, onClose }) => {
  // Estados do componente
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [faturas, setFaturas] = useState([]);
  const [faturasPagas, setFaturasPagas] = useState([]);
  const [faturasPendentes, setFaturasPendentes] = useState([]);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState('');
  const [dadosServico, setDadosServico] = useState(null);
  const [todosServicos, setTodosServicos] = useState([]);
  const [statusCliente, setStatusCliente] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [resumoFaturas, setResumoFaturas] = useState(null);
  const [mensagemInfo, setMensagemInfo] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('pendentes');
  const [clienteEncontrado, setClienteEncontrado] = useState(false);
  const [servicoDetalhado, setServicoDetalhado] = useState(null);

  if (!isOpen) return null;

  // ============================================
  // HANDLERS
  // ============================================

  const handleBuscarBoleto = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setFaturas([]);
    setFaturasPagas([]);
    setFaturasPendentes([]);
    setCopiado('');
    setDadosServico(null);
    setTodosServicos([]);
    setStatusCliente(null);
    setClienteInfo(null);
    setResumoFaturas(null);
    setMensagemInfo(null);
    setAbaAtiva('pendentes');
    setClienteEncontrado(false);
    setServicoDetalhado(null);

    // ============================================
    // ALTERAÇÃO 1: URL DA API DINÂMICA
    // Agora funciona tanto em local quanto na Vercel
    // ============================================
    const API_URL = import.meta.env.PROD 
      ? '/api'  // Em produção (Vercel)
      : 'http://localhost:3001'; // Em desenvolvimento

    try {
      const response = await fetch(`${API_URL}/consultar-boleto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cpfCnpj,
          mostrarTodos: true
        }),
      });

      const data = await response.json();
      console.log('Resposta da API:', data);

      if (data.mensagem) {
        setMensagemInfo({
          texto: data.mensagem,
          tipo: data.tipo || 'info',
        });
        
        if (data.cliente) {
          setClienteInfo({
            nome: data.cliente.nome || 'Cliente',
            cpf_cnpj: data.cliente.cpf_cnpj || cpfCnpj
          });
          setClienteEncontrado(true);
        }
        
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || data.msg || data.message || 'Erro ao consultar boleto.');
      }

      let faturasArray = [];
      let servicosArray = [];
      let servicoAtivo = null;

      // Processa os dados recebidos
      if (data.faturas) {
        faturasArray = data.faturas;
        servicoAtivo = data.dadosServico || null;
        servicosArray = data.todosServicos || [];
        setStatusCliente(data.statusCliente || null);
        setResumoFaturas({
          total: data.totalFaturas || 0,
          pagas: data.totalFaturasPagas || 0,
          pendentes: data.totalFaturasPendentes || 0,
          vencidas: data.totalFaturasVencidas || 0,
          em_aberto: data.resumo?.em_aberto || 0
        });
      } else if (Array.isArray(data)) {
        faturasArray = data;
        if (faturasArray.length > 0) {
          const servicosMap = new Map();
          faturasArray.forEach(f => {
            const servico = f.cliente?.servico || null;
            if (servico) {
              const key = servico.id || servico.nome;
              if (!servicosMap.has(key)) {
                servicosMap.set(key, {
                  id: servico.id || null,
                  nome: servico.nome || 'Serviço',
                  valor: servico.valor || 0,
                  tecnologia: servico.tecnologia || 'Fibra Óptica / Wireless',
                  data_venda: servico.data_venda || null,
                  data_fim_contrato: servico.data_fim_contrato || null,
                  status: servico.status || 'Status não informado',
                  data_cancelamento: servico.data_cancelamento || null,
                  motivo_cancelamento: servico.motivo_cancelamento || null
                });
              }
            }
          });
          servicosArray = Array.from(servicosMap.values());
          servicoAtivo = servicosArray.find(s => 
            s.status?.toLowerCase().includes('habilitado') ||
            s.status?.toLowerCase().includes('vigência')
          ) || servicosArray[0] || null;
          if (servicoAtivo) {
            setStatusCliente(servicoAtivo.status);
          }
        }
      }

      // Extrai serviço detalhado do cliente
      if (data.cliente_detalhes?.servico_detalhes) {
        const servico = data.cliente_detalhes.servico_detalhes;
        setServicoDetalhado({
          id_cliente_servico: servico.id_cliente_servico || 'N/A',
          numero_plano: servico.numero_plano || 'N/A',
          nome: servico.nome || 'Plano não informado',
          valor: servico.valor || 0,
          status: servico.status || 'Status não informado',
          status_prefixo: servico.status_prefixo || null,
          tecnologia: servico.tecnologia || 'Não informado',
          login: servico.login || 'N/A',
          ipv4: servico.ipv4 || 'N/A',
          mac_addr: servico.mac_addr || 'N/A',
        });
        if (servico.status) {
          setStatusCliente(servico.status);
        }
      } else if (faturasArray.length > 0 && faturasArray[0].cliente?.servico) {
        const servico = faturasArray[0].cliente.servico;
        setServicoDetalhado({
          id_cliente_servico: servico.id || 'N/A',
          numero_plano: servico.numero_plano || 'N/A',
          nome: servico.nome || 'Plano não informado',
          valor: servico.valor || 0,
          status: servico.status || 'Status não informado',
          status_prefixo: servico.status_prefixo || null,
          tecnologia: servico.tecnologia || 'Não informado',
          login: servico.login || 'N/A',
          ipv4: servico.ipv4 || 'N/A',
          mac_addr: servico.mac_addr || 'N/A',
        });
      }

      if (faturasArray.length === 0) {
        setMensagemInfo({
          texto: 'Nenhuma fatura encontrada para o CPF/CNPJ informado.',
          tipo: 'info',
        });
        setLoading(false);
        return;
      }

      const pagas = faturasArray.filter(f => f.pago === true || (f.data_pagamento && f.data_pagamento !== null));
      const pendentes = faturasArray.filter(f => f.pago === false || !f.data_pagamento || f.data_pagamento === null);

      setFaturas(faturasArray);
      setFaturasPagas(pagas);
      setFaturasPendentes(pendentes);
      setDadosServico(servicoAtivo);
      setTodosServicos(servicosArray);

      if (faturasArray.length > 0 && faturasArray[0].cliente) {
        setClienteInfo({
          nome: faturasArray[0].cliente.nome || 'Cliente',
          cpf_cnpj: faturasArray[0].cliente.cpf_cnpj || cpfCnpj
        });
        setClienteEncontrado(true);
      }

      if (pendentes.length === 0 && pagas.length > 0) {
        setAbaAtiva('pagas');
      }

    } catch (err) {
      if (err.message && err.message.includes('não encontrado')) {
        setMensagemInfo({
          texto: 'CPF/CNPJ não encontrado na base de dados.',
          tipo: 'erro',
        });
      } else if (err.message && err.message.includes('Nenhuma fatura')) {
        setMensagemInfo({
          texto: 'Cliente não possui faturas em aberto.',
          tipo: 'info',
        });
      } else {
        setErro(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    setClienteEncontrado(false);
    setFaturas([]);
    setFaturasPagas([]);
    setFaturasPendentes([]);
    setClienteInfo(null);
    setResumoFaturas(null);
    setDadosServico(null);
    setStatusCliente(null);
    setMensagemInfo(null);
    setErro('');
    setAbaAtiva('pendentes');
    setCpfCnpj('');
    setServicoDetalhado(null);
  };

  const handleCopiar = async (texto, idFatura, tipo) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(texto);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiado(`${idFatura}-${tipo}`);
      setTimeout(() => setCopiado(''), 3000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  // ============================================
  // FUNÇÕES AUXILIARES DE RENDERIZAÇÃO
  // ============================================

  const getBadgeStyle = (status) => {
    const st = status?.toLowerCase() || '';
    const isVencido = st.includes('vencid');
    const isPago = st.includes('pago') || st.includes('quitad');

    if (isPago) return 'badge-pago';
    if (isVencido) return 'badge-vencido';
    return 'badge-pendente';
  };

  const getBadgeText = (status) => {
    const st = status?.toLowerCase() || '';
    if (st.includes('pago') || st.includes('quitad')) return 'Paga';
    if (st.includes('vencid')) return 'Vencida';
    if (st.includes('aberto') || st.includes('pendente')) return 'Pendente';
    if (st.includes('a vencer')) return 'A vencer';
    return status || 'Pendente';
  };

  const renderizarFaturas = (listaFaturas, titulo) => {
    if (listaFaturas.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">—</div>
          <p className="empty-text">Nenhuma fatura {titulo.toLowerCase()} encontrada</p>
        </div>
      );
    }

    return listaFaturas.map((fatura, index) => {
      const statusFatura = fatura?.status || 'Pendente';
      const isPago = fatura?.pago || false;
      const isLinhaCopiada = copiado === `${fatura.id_fatura || index}-linha`;
      const isPixCopiado = copiado === `${fatura.id_fatura || index}-pix`;

      const dataVencimento = formatarDataBR(fatura.data_vencimento);
      const dataPagamento = formatarDataBR(fatura.data_pagamento);

      const statusServico = fatura.cliente?.servico?.status || 'Não informado';
      const isServicoAtivo = statusServico.toLowerCase().includes('habilitado') || 
                            statusServico.toLowerCase().includes('ativo') ||
                            statusServico.toLowerCase().includes('vigência');

      return (
        <div key={fatura.id_fatura || index} className={`fatura-card ${isPago ? 'card-pago' : statusFatura === 'Vencido' ? 'card-vencido' : ''}`}>
          
          <div className="fatura-header">
            <div className="fatura-id">
              <span className="fatura-numero">#{fatura.id_fatura}</span>
              <span className="fatura-plano">{fatura.cliente?.servico?.nome || 'Plano'}</span>
            </div>
            <div className="fatura-status">
              {isPago ? (
                <span className="badge-pago">Paga</span>
              ) : statusFatura === 'Vencido' ? (
                <span className="badge-vencido">Vencida</span>
              ) : (
                <span className="badge-pendente">Pendente</span>
              )}
            </div>
          </div>

          <div className="fatura-body">
            <div className="fatura-data">
              <span className="data-label">Vencimento</span>
              <span className="data-valor">{dataVencimento}</span>
            </div>
            <div className="fatura-data">
              <span className="data-label">Status</span>
              <span className="data-valor">{statusFatura}</span>
            </div>
            <div className="fatura-valor">
              <span className="valor-label">Valor</span>
              <span className="valor-destaque">{formatCurrency(fatura.valor || 0)}</span>
            </div>
          </div>

          {/* Status do Serviço */}
          <div className="servico-mini">
            <span className="servico-mini-label">Plano:</span>
            <span className="servico-mini-value">{fatura.cliente?.servico?.nome || 'N/A'}</span>
            <span className={`servico-mini-status ${isServicoAtivo ? 'ativo' : 'inativo'}`}>
              {isServicoAtivo ? 'Ativo' : statusServico}
            </span>
          </div>

          {/* Pagamento detalhado */}
          {isPago && (
            <div className="pagamento-detalhes">
              <div className="pagamento-item">
                <span className="pag-label">Data Pagamento</span>
                <span className="pag-value">{dataPagamento}</span>
              </div>
              {fatura.valor_pago && (
                <div className="pagamento-item">
                  <span className="pag-label">Valor Pago</span>
                  <span className="pag-value">{formatCurrency(fatura.valor_pago)}</span>
                </div>
              )}
              {fatura.forma_cobranca && (
                <div className="pagamento-item">
                  <span className="pag-label">Forma</span>
                  <span className="pag-value">{fatura.forma_cobranca}</span>
                </div>
              )}
            </div>
          )}

          {/* Itens */}
          {Array.isArray(fatura.detalhamento) && fatura.detalhamento.length > 0 && (
            <div className="fatura-itens">
              <div className="itens-header">
                <span className="itens-titulo">Itens</span>
                <span className="itens-titulo">Valor</span>
              </div>
              <ul className="itens-lista">
                {fatura.detalhamento.slice(0, 3).map((item, idx) => (
                  <li key={item.id_cobranca || idx} className="item-linha">
                    <span className="item-descricao">{item.descricao}</span>
                    <span className="item-valor">{formatCurrency(item.valor || 0)}</span>
                  </li>
                ))}
                {fatura.detalhamento.length > 3 && (
                  <li className="item-mais">+ {fatura.detalhamento.length - 3} item(ns)</li>
                )}
              </ul>
            </div>
          )}

          {/* Ações */}
          <div className="fatura-acoes">
            {!isPago && fatura.pix_copia_e_cola && (
              <div className="pix-area">
                <div className="pix-header">
                  <span className="pix-icon">◆</span>
                  <span className="pix-title">Pix Copia e Cola</span>
                </div>
                <div className="pix-codigo">
                  <input
                    type="text"
                    readOnly
                    value={fatura.pix_copia_e_cola}
                    className="pix-input"
                  />
                  <button
                    onClick={() => handleCopiar(fatura.pix_copia_e_cola, fatura.id_fatura || index, 'pix')}
                    className={`btn-pix ${isPixCopiado ? 'copiado' : ''}`}
                  >
                    {isPixCopiado ? 'Copiado!' : 'Copiar Pix'}
                  </button>
                </div>
              </div>
            )}

            <div className="acoes-botoes">
              {!isPago && fatura.linha_digitavel && (
                <button
                  onClick={() => handleCopiar(fatura.linha_digitavel, fatura.id_fatura || index, 'linha')}
                  className={`btn-codigo ${isLinhaCopiada ? 'copiado' : ''}`}
                >
                  {isLinhaCopiada ? 'Copiado!' : 'Copiar Código'}
                </button>
              )}
              
              {fatura.link && (
                <a
                  href={fatura.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={isPago ? 'btn-comprovante' : 'btn-pdf'}
                >
                  {isPago ? 'Ver Comprovante' : 'Baixar Boleto'}
                </a>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  // ============================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close" onClick={onClose}>✕</button>
        
        {!clienteEncontrado ? (
          // ============================================
          // TELA DE CONSULTA INICIAL
          // ============================================
          <>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon">2</div>
                <div className="modal-title-group">
                  <h1 className="modal-title">2ª Via de Boleto</h1>
                  <p className="modal-subtitle">Digite seu CPF ou CNPJ para consultar faturas em aberto</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBuscarBoleto} className="form-busca">
              <div className="input-group">
                <label className="input-label">CPF ou CNPJ</label>
                <div className="input-wrapper">
                  <span className="input-icon">●</span>
                  <input
                    type="text"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    placeholder="Ex: 123.456.789-00"
                    required
                    className="input-field"
                  />
                </div>
              </div>
              <button type="submit" className="btn-consultar" disabled={loading}>
                {loading ? 'Consultando...' : 'Consultar'}
              </button>
            </form>

            {erro && <div className="mensagem-erro">Erro: {erro}</div>}

            {mensagemInfo && (
              <div className={`mensagem-info ${mensagemInfo.tipo === 'erro' ? 'mensagem-erro' : 'mensagem-sucesso'}`}>
                <div className="mensagem-content">
                  <span className="mensagem-icon">{mensagemInfo.tipo === 'erro' ? '!' : 'i'}</span>
                  <div>
                    <p className="mensagem-texto">{mensagemInfo.texto}</p>
                    {clienteInfo && (
                      <p className="mensagem-subtexto">
                        O cliente <strong>{clienteInfo.nome}</strong> está com todas as faturas em dia.
                      </p>
                    )}
                    <button 
                      className="btn-suporte"
                      onClick={() => window.open('https://wa.me/5538998358385', '_blank')}
                    >
                      Falar com suporte
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button className="btn-fechar" onClick={onClose}>
              Fechar
            </button>
          </>
        ) : (
          // ============================================
          // TELA DE RESULTADOS
          // ============================================
          <>
            {/* Cliente Card */}
            {clienteInfo && (
              <div className="cliente-card">
                <div className="cliente-avatar">
                  {clienteInfo.nome?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div className="cliente-info">
                  <div className="cliente-header">
                    <span className="cliente-tag">ASSINANTE</span>
                    {dadosServico && (
                      <span className="cliente-plano">{dadosServico.nome}</span>
                    )}
                  </div>
                  <h3 className="cliente-nome">{clienteInfo.nome}</h3>
                  <span className="cliente-cpf">CPF: {clienteInfo.cpf_cnpj}</span>
                </div>
                {resumoFaturas && (
                  <div className="cliente-badge">
                    <span className="badge-pendentes">{resumoFaturas.pendentes} pendentes</span>
                  </div>
                )}
              </div>
            )}

            {/* Serviço Detalhado */}
            {servicoDetalhado && (
              <div className="servico-detalhes">
                <div className="servico-detalhes-grid">
                  <div className="servico-detalhe-item">
                    <span className="servico-detalhe-label">Plano</span>
                    <span className="servico-detalhe-value">{servicoDetalhado.nome}</span>
                  </div>
                  <div className="servico-detalhe-item">
                    <span className="servico-detalhe-label">Status</span>
                    <span className="servico-detalhe-value">{servicoDetalhado.status}</span>
                  </div>
                  <div className="servico-detalhe-item">
                    <span className="servico-detalhe-label">Tecnologia</span>
                    <span className="servico-detalhe-value">{servicoDetalhado.tecnologia}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Resumo de Faturas */}
            {resumoFaturas && (
              <div className="resumo-faturas">
                <div className="resumo-item">
                  <span className="resumo-label">Total</span>
                  <span className="resumo-valor total">{resumoFaturas.total}</span>
                </div>
                <div className="resumo-item">
                  <span className="resumo-label">Pagas</span>
                  <span className="resumo-valor pagas">{resumoFaturas.pagas}</span>
                </div>
                <div className="resumo-item">
                  <span className="resumo-label">Pendentes</span>
                  <span className="resumo-valor pendentes">{resumoFaturas.pendentes}</span>
                </div>
              </div>
            )}

            {/* Faturas */}
            {(faturasPendentes.length > 0 || faturasPagas.length > 0) && (
              <div className="faturas-container">
                <div className="tabs">
                  <button
                    className={`tab-btn ${abaAtiva === 'pendentes' ? 'tab-ativo' : ''}`}
                    onClick={() => setAbaAtiva('pendentes')}
                  >
                    <span>Em Aberto</span>
                    <span className="tab-count tab-pendente">{faturasPendentes.length}</span>
                  </button>
                  <button
                    className={`tab-btn ${abaAtiva === 'pagas' ? 'tab-ativo' : ''}`}
                    onClick={() => setAbaAtiva('pagas')}
                  >
                    <span>Pagas</span>
                    <span className="tab-count tab-pago">{faturasPagas.length}</span>
                  </button>
                </div>

                <div className="faturas-lista">
                  {abaAtiva === 'pendentes' && (
                    <>
                      <div className="lista-header">
                        <span className="lista-titulo">Faturas em Aberto</span>
                        <span className="lista-total">
                          Total: {formatCurrency(faturasPendentes.reduce((acc, f) => acc + Number(f.valor || 0), 0))}
                        </span>
                      </div>
                      {renderizarFaturas(faturasPendentes, 'em aberto')}
                    </>
                  )}

                  {abaAtiva === 'pagas' && (
                    <>
                      <div className="lista-header">
                        <span className="lista-titulo">Faturas Pagas</span>
                        <span className="lista-total">
                          Total: {formatCurrency(faturasPagas.reduce((acc, f) => acc + Number(f.valor || 0), 0))}
                        </span>
                      </div>
                      {renderizarFaturas(faturasPagas, 'pagas')}
                    </>
                  )}
                </div>
              </div>
            )}

            <button className="btn-voltar" onClick={handleVoltar}>
              ← Voltar para consulta
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default BoletoModal;