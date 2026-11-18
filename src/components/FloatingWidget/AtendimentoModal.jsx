// src/components/FloatingWidget/AtendimentoModal.jsx
import React, { useState } from 'react';
import './AtendimentoModal.css';

// ✅ Correção da URL: 
// Em dev, aponta para o seu backend local (porta 3001).
// Em prod, usa o próprio domínio (evita CORS).
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  return window.location.origin;
};

const STATUS_PLANO_LABEL = (status) => {
  if (!status) return 'Status não disponível';
  const s = String(status).toLowerCase();
  if (s.includes('suspenso')) return 'Suspenso por débito';
  if (s.includes('habilitado') || s.includes('ativo')) return 'Ativo';
  if (s.includes('cancelado') || s.includes('inativo')) return 'Cancelado';
  if (s.includes('bloqueado')) return 'Bloqueado';
  if (s.includes('pendente')) return 'Pendente';
  return status;
};

const AtendimentoModal = ({ isOpen, onClose, modo = 'ligamos' }) => {
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [protocolo, setProtocolo] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [servicosCliente, setServicosCliente] = useState([]);
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState('');
  const [clienteConsultado, setClienteConsultado] = useState(null);

  const [formData, setFormData] = useState({
    nome: '', telefone: '', email: '', cpf: '', mensagem: '',
    protocolo: '', setor: '', tipoPessoa: 'FISICA',
    dataAgendamento: '', horarioAgendamento: '', melhorHorario: '',
    consentimento: false,
  });

  if (!isOpen) return null;

  const resetarForm = () => {
    setFormData({
      nome: '', telefone: '', email: '', cpf: '', mensagem: '',
      protocolo: '', setor: '', tipoPessoa: 'FISICA',
      dataAgendamento: '', horarioAgendamento: '', melhorHorario: '',
      consentimento: false,
    });
    setServicosCliente([]);
    setServicoSelecionadoId('');
    setClienteConsultado(null);
    setEtapa(1);
    setErro('');
    setProtocolo(null);
    setMensagemSucesso('');
  };

  const handleClose = () => {
    resetarForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const servicoSelecionado = servicosCliente.find(
    (s) => String(s.id_cliente_servico) === String(servicoSelecionadoId)
  ) || null;

  // ---------------------------------------------------------------------
  // BUSCA CLIENTE + TODOS OS SERVIÇOS (PLANOS/PONTOS)
  // ---------------------------------------------------------------------
  const buscarCliente = async (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    const baseUrl = getApiUrl(); // ✅ Pega a URL correta

    const resp = await fetch(`${baseUrl}/api/app/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: { cpf_cnpj: cpfLimpo },
        periodo: { apenas_pendente: 'nao' }
      })
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.status !== 'success') {
      throw new Error(data.msg || data.error || 'Cliente não encontrado.');
    }
    const cliente = data.cliente || data.dados || data;

    // Normaliza todos os serviços
    const servicos = (cliente?.servicos || []).map((s, idx) => ({
      id_cliente_servico: s.id_cliente_servico || s.uuid_cliente_servico || `servico-${idx}`,
      id_servico: s.id_servico || null,
      numero_plano: s.numero_plano || idx + 1,
      nome: s.nome || s.descricao || 'Plano não informado',
      valor: Number(s.valor || 0),
      status: s.status || s.servico_status || 'Status não informado',
      endereco_instalacao: s.endereco_instalacao || s.endereco_cadastral || null,
      grupos: s.grupos || [],
      contratos: s.contratos || [],
    }));

    return { ...cliente, servicos };
  };

  const abrirAtendimento = async (payload) => {
    const baseUrl = getApiUrl(); // ✅ Pega a URL correta
    const resp = await fetch(`${baseUrl}/api/app/atendimento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.status === 'error') {
      throw new Error(data.msg || data.error || 'Erro ao abrir atendimento.');
    }
    return data;
  };

  // ---------------------------------------------------------------------
  // VALIDAÇÃO DA ETAPA 1 + CARREGAR SERVIÇOS
  // ---------------------------------------------------------------------
  const proximaEtapa = async () => {
    setErro('');

    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length < 11) {
      setErro('Informe um CPF válido.'); return;
    }
    if (!formData.nome.trim()) {
      setErro('Informe seu nome completo.'); return;
    }
    if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) {
      setErro('Informe um telefone válido.'); return;
    }
    if (!formData.setor) {
      setErro('Selecione um setor de destino.'); return;
    }

    // Busca cliente e serviços ao avançar (para exibir os pontos)
    try {
      setLoading(true);
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      const cliente = await buscarCliente(cpfLimpo);
      if (!cliente) throw new Error('Cliente não encontrado.');

      setClienteConsultado(cliente);
      setServicosCliente(cliente.servicos || []);

      // Se só tem um serviço, seleciona automaticamente
      if ((cliente.servicos || []).length === 1) {
        setServicoSelecionadoId(String(cliente.servicos[0].id_cliente_servico));
      } else {
        setServicoSelecionadoId('');
      }

      setEtapa(2);
    } catch (err) {
      console.error(err);
      setErro(err.message || 'Erro ao buscar cliente.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      if (cpfLimpo.length < 11) throw new Error('Informe um CPF válido.');

      // Reutiliza o cliente já consultado na etapa 1, se houver
      const cliente = clienteConsultado || await buscarCliente(cpfLimpo);
      if (!cliente) throw new Error('Cliente não encontrado.');

      const servicos = cliente.servicos || [];
      if (servicos.length === 0) {
        throw new Error('Nenhum plano/ponto encontrado para este cliente.');
      }
      if (servicos.length > 1 && !servicoSelecionadoId) {
        throw new Error('Selecione qual plano/ponto deseja tratar.');
      }

      const servico = servicoSelecionado || servicos[0];

      const dadosPlano = {
        id_cliente_servico: servico.id_cliente_servico,
        numero_plano: servico.numero_plano,
        nome: servico.nome,
        status: STATUS_PLANO_LABEL(servico.status),
        valor: servico.valor,
        endereco: servico.endereco_instalacao?.completo || '',
      };

      const linhaPlano = `Plano/Ponto: ${dadosPlano.nome} (Serviço ${dadosPlano.id_cliente_servico}, Plano ${dadosPlano.numero_plano})
Status do plano: ${dadosPlano.status}
Endereço: ${dadosPlano.endereco || 'Não informado'}`;

      let payload;

      if (modo === 'ligamos') {
        payload = {
          cliente: {
            codigo_cliente: cliente.codigo_cliente || cliente.id_cliente,
            nome_razaosocial: cliente.nome_razaosocial || formData.nome,
            cpf_cnpj: cliente.cpf_cnpj || cpfLimpo,
            tipo_pessoa: formData.tipoPessoa === 'FISICA' ? 'Física' : 'Jurídica',
            id_cliente_servico: servico.id_cliente_servico, // <- plano escolhido
          },
          atendimento: {
            tipo: 'SAC',
            descricao: `SOLICITAÇÃO DE RETORNO DE LIGAÇÃO

${linhaPlano}

Motivo: ${formData.mensagem || 'Solicitação de contato'}

Agendamento:
- Data: ${formData.dataAgendamento || 'Não informado'}
- Horário: ${formData.horarioAgendamento || 'Não informado'}
- Melhor período: ${formData.melhorHorario || 'Não informado'}`,
            canal: 'SITE',
            prioridade: 'MEDIA',
            origem: 'LIGAMOS_PARA_VOCE',
            setor_destino: formData.setor || 'SAC',
            id_cliente_servico: servico.id_cliente_servico, // <- plano escolhido
          },
          contato: {
            telefone: formData.telefone,
            data_agendamento: formData.dataAgendamento,
            horario_agendamento: formData.horarioAgendamento,
            melhor_horario: formData.melhorHorario,
            consentimento: formData.consentimento,
          },
        };
      } else {
        // ouvidoria
        payload = {
          cliente: {
            codigo_cliente: cliente.codigo_cliente || cliente.id_cliente,
            nome_razaosocial: cliente.nome_razaosocial || formData.nome,
            cpf_cnpj: cliente.cpf_cnpj || cpfLimpo,
            id_cliente_servico: servico.id_cliente_servico, // <- plano escolhido
          },
          atendimento: {
            tipo: 'OUVIDORIA',
            descricao: `MANIFESTAÇÃO NA OUVIDORIA

${linhaPlano}

Protocolo anterior: ${formData.protocolo || 'Não informado'}

Mensagem: ${formData.mensagem}`,
            canal: 'SITE',
            prioridade: 'ALTA',
            origem: 'OUVIDORIA',
            setor_destino: 'OUVIDORIA',
            id_cliente_servico: servico.id_cliente_servico, // <- plano escolhido
          },
          ouvidoria: {
            tipo: 'RECLAMACAO',
            protocolo_anterior: formData.protocolo || null,
            id_cliente_servico: servico.id_cliente_servico,
          },
        };
      }

      const resposta = await abrirAtendimento(payload);

      setProtocolo(resposta.protocolo || resposta.atendimento?.protocolo || 'N/A');
      setMensagemSucesso(resposta.msg || 'Solicitação registrada com sucesso.');
    } catch (err) {
      console.error(err);
      setErro(err.message || 'Erro ao enviar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // RENDER AUXILIAR — SELECT DE PLANOS/PONTOS
  // ---------------------------------------------------------------------
  const renderSelecaoPlano = () => {
    if (servicosCliente.length === 0) return null;

    if (servicosCliente.length === 1) {
      const unico = servicosCliente[0];
      return (
        <div className="atendimento-form-group">
          <label>Plano/Ponto</label>
          <div className="atendimento-plano-unico">
            <strong>{unico.nome}</strong>
            <span>
              Serviço {unico.id_cliente_servico} — {STATUS_PLANO_LABEL(unico.status)}
            </span>
            {unico.endereco_instalacao?.completo && (
              <span className="atendimento-plano-endereco">
                {unico.endereco_instalacao.completo}
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="atendimento-form-group">
        <label>Selecione o plano/ponto *</label>
        <select
          value={servicoSelecionadoId}
          onChange={(e) => setServicoSelecionadoId(e.target.value)}
        >
          <option value="">Selecione o ponto ou plano</option>
          {servicosCliente.map((servico) => (
            <option
              key={servico.id_cliente_servico}
              value={servico.id_cliente_servico}
            >
              {servico.nome} — Serviço {servico.id_cliente_servico} ({STATUS_PLANO_LABEL(servico.status)})
            </option>
          ))}
        </select>
        {servicoSelecionado?.endereco_instalacao?.completo && (
          <small className="atendimento-plano-endereco">
            Endereço: {servicoSelecionado.endereco_instalacao.completo}
          </small>
        )}
      </div>
    );
  };

  // ---------------------------------------------------------------------
  // RENDER PRINCIPAL
  // ---------------------------------------------------------------------
  const renderFormulario = () => {
    if (protocolo) {
      return (
        <div className="atendimento-sucesso">
          <div className="atendimento-sucesso-icon">✓</div>
          <h4>Solicitação registrada!</h4>
          <p>{mensagemSucesso}</p>
          {servicoSelecionado && (
            <p className="atendimento-sucesso-plano">
              Plano/Ponto: <strong>{servicoSelecionado.nome}</strong>{' '}
              (Serviço {servicoSelecionado.id_cliente_servico})
            </p>
          )}
          <div className="atendimento-protocolo">
            <span>Protocolo:</span>
            <strong>{protocolo}</strong>
          </div>
          <button className="atendimento-btn-fechar" onClick={handleClose}>
            Fechar
          </button>
        </div>
      );
    }

    if (modo === 'ligamos') {
      return (
        <form onSubmit={handleSubmit} className="atendimento-form">
          <div className="atendimento-step-indicator">
            <div className={`step ${etapa === 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Dados Pessoais</span>
            </div>
            <div className={`step-line ${etapa === 2 ? 'active' : ''}`}></div>
            <div className={`step ${etapa === 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Agendamento</span>
            </div>
          </div>

          {etapa === 1 && (
            <div className="atendimento-step-content">
              <div className="atendimento-form-group">
                <label>Tipo de pessoa</label>
                <div className="atendimento-radio-group">
                  <label>
                    <input type="radio" name="tipoPessoa" value="FISICA"
                      checked={formData.tipoPessoa === 'FISICA'} onChange={handleChange} />
                    <span>Pessoa Física</span>
                  </label>
                  <label>
                    <input type="radio" name="tipoPessoa" value="JURIDICA"
                      checked={formData.tipoPessoa === 'JURIDICA'} onChange={handleChange} />
                    <span>Pessoa Jurídica</span>
                  </label>
                </div>
              </div>

              <div className="atendimento-form-group">
                <label>CPF/CNPJ *</label>
                <input type="text" name="cpf" value={formData.cpf}
                  onChange={handleChange} placeholder="123.456.789-00" />
              </div>

              <div className="atendimento-form-group">
                <label>Nome completo *</label>
                <input type="text" name="nome" value={formData.nome}
                  onChange={handleChange} placeholder="Seu nome completo" />
              </div>

              <div className="atendimento-form-group">
                <label>Telefone *</label>
                <input type="tel" name="telefone" value={formData.telefone}
                  onChange={handleChange} placeholder="(99) 99999-9999" />
              </div>

              <div className="atendimento-form-group">
                <label>Setor de destino *</label>
                <select name="setor" value={formData.setor} onChange={handleChange}>
                  <option value="">Selecione um setor</option>
                  <option value="SUPORTE_TECNICO">Suporte Técnico</option>
                  <option value="FINANCEIRO">Financeiro</option>
                  <option value="COMERCIAL">Comercial</option>
                  <option value="SAC">SAC - Geral</option>
                  <option value="SAC_ENDERECO">SAC - Alteração de Endereço</option>
                </select>
              </div>

              {erro && <div className="atendimento-alert-error">{erro}</div>}

              <button type="button" className="atendimento-btn" onClick={proximaEtapa} disabled={loading}>
                {loading ? 'Consultando cliente...' : 'Prosseguir →'}
              </button>
            </div>
          )}

          {etapa === 2 && (
            <div className="atendimento-step-content">
              <div className="atendimento-cliente-resumo">
                <p>
                  <strong>{clienteConsultado?.nome_razaosocial || formData.nome}</strong>
                </p>
                <p>CPF/CNPJ: {clienteConsultado?.cpf_cnpj || formData.cpf}</p>
                {servicosCliente.length > 1 && (
                  <p className="atendimento-alerta-planos">
                    Este cliente possui <strong>{servicosCliente.length} planos/pontos</strong>.
                    Escolha qual deseja tratar.
                  </p>
                )}
              </div>

              {renderSelecaoPlano()}

              <div className="atendimento-form-group">
                <label>Descreva o motivo do contato</label>
                <textarea name="mensagem" value={formData.mensagem}
                  onChange={handleChange} rows="3"
                  placeholder="Descreva o motivo do contato..." />
              </div>

              <div className="atendimento-form-group">
                <label>Agendamento</label>
                <div className="atendimento-row">
                  <input type="date" name="dataAgendamento"
                    value={formData.dataAgendamento} onChange={handleChange} />
                  <input type="time" name="horarioAgendamento"
                    value={formData.horarioAgendamento} onChange={handleChange} />
                </div>
              </div>

              <div className="atendimento-form-group">
                <label>Melhor horário para contato</label>
                <select name="melhorHorario" value={formData.melhorHorario} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="MANHA">Manhã (08h - 12h)</option>
                  <option value="TARDE">Tarde (13h - 18h)</option>
                  <option value="NOITE">Noite (19h - 22h)</option>
                </select>
              </div>

              <div className="atendimento-form-group">
                <label className="atendimento-checkbox">
                  <input type="checkbox" name="consentimento"
                    checked={formData.consentimento} onChange={handleChange} required />
                  <span>Concordo em receber comunicações e aceito a Política de Privacidade</span>
                </label>
              </div>

              {erro && <div className="atendimento-alert-error">{erro}</div>}

              <div className="atendimento-form-actions">
                <button type="button" className="atendimento-btn-voltar"
                  onClick={() => { setErro(''); setEtapa(1); }}>
                  ← Voltar
                </button>
                <button
                  type="submit"
                  className="atendimento-btn"
                  disabled={
                    loading ||
                    !formData.consentimento ||
                    (servicosCliente.length > 1 && !servicoSelecionadoId)
                  }
                >
                  {loading ? 'Enviando...' : 'Agendar ligação'}
                </button>
              </div>
            </div>
          )}
        </form>
      );
    }

    // ---------------- OUVIDORIA ----------------
    return (
      <form onSubmit={handleSubmit} className="atendimento-form">
        <div className="atendimento-form-group">
          <label>CPF *</label>
          <input type="text" name="cpf" value={formData.cpf}
            onChange={handleChange} placeholder="123.456.789-00" required />
        </div>

        <div className="atendimento-form-group">
          <label>Nome completo *</label>
          <input type="text" name="nome" value={formData.nome}
            onChange={handleChange} placeholder="Seu nome completo" required />
        </div>

        <div className="atendimento-form-group">
          <label>Telefone</label>
          <input type="tel" name="telefone" value={formData.telefone}
            onChange={handleChange} placeholder="(99) 99999-9999" />
        </div>

        <div className="atendimento-form-group">
          <label>Protocolo anterior (opcional)</label>
          <input type="text" name="protocolo" value={formData.protocolo}
            onChange={handleChange} placeholder="Número do protocolo" />
        </div>

        {/* Carrega planos ao clicar em "Buscar planos" */}
        {servicosCliente.length === 0 ? (
          <button
            type="button"
            className="atendimento-btn"
            disabled={loading}
            onClick={async () => {
              setErro('');
              if (!formData.cpf || formData.cpf.replace(/\D/g, '').length < 11) {
                setErro('Informe um CPF válido para buscar os planos.');
                return;
              }
              try {
                setLoading(true);
                const cpfLimpo = formData.cpf.replace(/\D/g, '');
                const cliente = await buscarCliente(cpfLimpo);
                setClienteConsultado(cliente);
                setServicosCliente(cliente?.servicos || []);
                if ((cliente?.servicos || []).length === 1) {
                  setServicoSelecionadoId(String(cliente.servicos[0].id_cliente_servico));
                }
              } catch (err) {
                setErro(err.message || 'Erro ao buscar planos.');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Buscando...' : 'Buscar planos do CPF'}
          </button>
        ) : (
          renderSelecaoPlano()
        )}

        <div className="atendimento-form-group">
          <label>Sua mensagem *</label>
          <textarea name="mensagem" value={formData.mensagem}
            onChange={handleChange} rows="5" required
            placeholder="Descreva sua solicitação ou reclamação..." />
        </div>

        <div className="atendimento-form-group">
          <label className="atendimento-checkbox">
            <input type="checkbox" name="consentimento"
              checked={formData.consentimento} onChange={handleChange} required />
            <span>Estou ciente que esta manifestação será tratada pela ouvidoria</span>
          </label>
        </div>

        {erro && <div className="atendimento-alert-error">{erro}</div>}

        <button
          type="submit"
          className="atendimento-btn"
          disabled={
            loading ||
            !formData.consentimento ||
            (servicosCliente.length > 1 && !servicoSelecionadoId)
          }
        >
          {loading ? 'Enviando...' : 'Enviar para Ouvidoria'}
        </button>
      </form>
    );
  };

  return (
    <div className="atendimento-modal-overlay" onClick={handleClose}>
      <div className="atendimento-modal" onClick={(e) => e.stopPropagation()}>
        <button className="atendimento-modal-close" onClick={handleClose}>✕</button>

        <div className="atendimento-modal-header">
          <h3>
            {modo === 'ligamos' ? 'Ligamos para você' :
             modo === 'ouvidoria' ? 'Ouvidoria' :
             'Atendimento'}
          </h3>
          <p>
            {modo === 'ligamos'
              ? 'Informe seus dados e agende uma ligação'
              : 'Registre sua manifestação — resposta em até 7 dias úteis'}
          </p>
        </div>

        {renderFormulario()}
      </div>
    </div>
  );
};

export default AtendimentoModal;