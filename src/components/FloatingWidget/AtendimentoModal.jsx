// src/components/FloatingWidget/AtendimentoModal.jsx
import React, { useState } from 'react';
import './AtendimentoModal.css';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const AtendimentoModal = ({ isOpen, onClose, modo = 'ligamos' }) => {
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [protocolo, setProtocolo] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

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

  const proximaEtapa = () => {
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
    setErro('');
    setEtapa(2);
  };

  const buscarCliente = async (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    const resp = await fetch(
      `${API_URL}/api/v1/integracao/cliente/detalhes?busca=cpf_cnpj&termo_busca=${cpfLimpo}`
    );
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.msg || 'Cliente não encontrado.');
    }
    const data = await resp.json();
    return data.cliente || data.data || data;
  };

  const abrirAtendimento = async (payload) => {
    const resp = await fetch(`${API_URL}/api/v1/integracao/atendimento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.msg || 'Erro ao abrir atendimento.');
    }
    return resp.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      if (cpfLimpo.length < 11) throw new Error('Informe um CPF válido.');

      const cliente = await buscarCliente(cpfLimpo);
      if (!cliente) throw new Error('Cliente não encontrado.');

      let payload;

      if (modo === 'ligamos') {
        payload = {
          cliente: {
            codigo_cliente: cliente.codigo_cliente || cliente.id_cliente,
            nome_razaosocial: cliente.nome_razaosocial || formData.nome,
            cpf_cnpj: cliente.cpf_cnpj || cpfLimpo,
            tipo_pessoa: formData.tipoPessoa === 'FISICA' ? 'Física' : 'Jurídica',
          },
          atendimento: {
            tipo: 'SAC',
            descricao: `SOLICITAÇÃO DE RETORNO DE LIGAÇÃO

Motivo: ${formData.mensagem || 'Solicitação de contato'}

Agendamento:
- Data: ${formData.dataAgendamento || 'Não informado'}
- Horário: ${formData.horarioAgendamento || 'Não informado'}
- Melhor período: ${formData.melhorHorario || 'Não informado'}`,
            canal: 'SITE',
            prioridade: 'MEDIA',
            origem: 'LIGAMOS_PARA_VOCE',
            setor_destino: formData.setor || 'SAC',
          },
          contato: {
            telefone: formData.telefone,
            data_agendamento: formData.dataAgendamento,
            horario_agendamento: formData.horarioAgendamento,
            melhor_horario: formData.melhorHorario,
            consentimento: formData.consentimento,
          },
        };
      } else if (modo === 'ouvidoria') {
        payload = {
          cliente: {
            codigo_cliente: cliente.codigo_cliente || cliente.id_cliente,
            nome_razaosocial: cliente.nome_razaosocial || formData.nome,
            cpf_cnpj: cliente.cpf_cnpj || cpfLimpo,
          },
          atendimento: {
            tipo: 'OUVIDORIA',
            descricao: `MANIFESTAÇÃO NA OUVIDORIA

Protocolo anterior: ${formData.protocolo || 'Não informado'}

Mensagem: ${formData.mensagem}`,
            canal: 'SITE',
            prioridade: 'ALTA',
            origem: 'OUVIDORIA',
            setor_destino: 'OUVIDORIA',
          },
          ouvidoria: {
            tipo: 'RECLAMACAO',
            protocolo_anterior: formData.protocolo || null,
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

  const renderFormulario = () => {
    if (protocolo) {
      return (
        <div className="atendimento-sucesso">
          <div className="atendimento-sucesso-icon">✓</div>
          <h4>Solicitação registrada!</h4>
          <p>{mensagemSucesso}</p>
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

              <button type="button" className="atendimento-btn" onClick={proximaEtapa}>
                Prosseguir →
              </button>
            </div>
          )}

          {etapa === 2 && (
            <div className="atendimento-step-content">
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
                <button type="submit" className="atendimento-btn" disabled={loading || !formData.consentimento}>
                  {loading ? 'Enviando...' : 'Agendar ligação'}
                </button>
              </div>
            </div>
          )}
        </form>
      );
    }

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

        <button type="submit" className="atendimento-btn" disabled={loading || !formData.consentimento}>
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