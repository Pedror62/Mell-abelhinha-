// src/components/Autoatendimento/CancelamentoModal.jsx
import React, { useState } from 'react';
import './CancelamentoModal.css';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const CancelamentoModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [protocolo, setProtocolo] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    telefone: '',
    email: '',
    motivo: '',
    descricao: '',
    consentimento: false,
  });

  if (!isOpen) return null;

  const resetarForm = () => {
    setFormData({
      cpf: '', nome: '', telefone: '', email: '',
      motivo: '', descricao: '', consentimento: false,
    });
    setErro('');
    setProtocolo(null);
    setCopiado(false);
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

  const handleCopiar = async () => {
    if (!protocolo) return;
    try {
      await navigator.clipboard.writeText(String(protocolo));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      /* ignore */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      if (cpfLimpo.length < 11) throw new Error('Informe um CPF válido.');

      // Busca o cliente para pegar o codigo_cliente
      const buscaResp = await fetch(
        `${API_URL}/api/v1/integracao/cliente/detalhes?busca=cpf_cnpj&termo_busca=${cpfLimpo}`
      );

      if (!buscaResp.ok) {
        throw new Error('Cliente não encontrado. Verifique o CPF.');
      }

      const buscaData = await buscaResp.json();
      const cliente = buscaData.cliente || buscaData.clientes?.[0] || buscaData;

      if (!cliente?.id_cliente) {
        throw new Error('Não foi possível identificar o cliente.');
      }

      // Abre o atendimento de cancelamento
      const payload = {
        cliente: {
          codigo_cliente: cliente.codigo_cliente || cliente.id_cliente,
          nome_razaosocial: cliente.nome_razaosocial || formData.nome,
          cpf_cnpj: cliente.cpf_cnpj || cpfLimpo,
          tipo_pessoa: cliente.tipo_pessoa === 'JURIDICA' ? 'Jurídica' : 'Física',
        },
        atendimento: {
          tipo: 'CANCELAMENTO',
          descricao: `SOLICITAÇÃO DE CANCELAMENTO DE SERVIÇO

Motivo principal: ${formData.motivo || 'Não informado'}

Detalhamento do cliente:
${formData.descricao || 'Cliente não forneceu detalhes adicionais.'}

Contato para retorno:
- Telefone: ${formData.telefone || 'Não informado'}
- E-mail: ${formData.email || 'Não informado'}

IMPORTANTE:
O cliente confirmou o desejo de cancelar o serviço.
Aguardando contato da equipe de retenção/cancelamento em até 24h.

ATENÇÃO: Esta solicitação requer análise da equipe de retenção.`,
          canal: 'SITE',
          prioridade: 'ALTA',
          origem: 'CANCELAMENTO',
          setor_destino: 'CANCELAMENTO',
        },
        contato: {
          telefone: formData.telefone,
        },
      };

      const resp = await fetch(`${API_URL}/api/v1/integracao/atendimento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.msg || 'Erro ao abrir solicitação de cancelamento.');
      }

      const protocoloFinal =
        data.protocolo ||
        data.atendimento?.protocolo ||
        data.id_atendimento_hubsoft ||
        'N/A';

      setProtocolo(protocoloFinal);
    } catch (err) {
      console.error(err);
      setErro(err.message || 'Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SUCESSO
  // ============================================
  if (protocolo) {
    return (
      <div className="cancelamento-modal-overlay" onClick={handleClose}>
        <div className="cancelamento-modal" onClick={(e) => e.stopPropagation()}>
          <button className="cancelamento-modal-close" onClick={handleClose}>✕</button>

          <div className="cancelamento-sucesso">
            <div className="cancelamento-sucesso-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4>Solicitação registrada!</h4>
            <p>Sua solicitação de cancelamento foi recebida com sucesso.</p>
            <p style={{ fontSize: '13px' }}>
              A equipe de retenção entrará em contato em até <strong>24h úteis</strong>.
            </p>

            <div className="cancelamento-protocolo">
              <div>
                <strong>Protocolo:</strong> <span>{protocolo}</span>
              </div>
              <button className="cancelamento-btn-copiar" onClick={handleCopiar}>
                {copiado ? '✓ Copiado!' : 'Copiar protocolo'}
              </button>
            </div>

            <div className="cancelamento-info">
              Anote o protocolo para acompanhar sua solicitação.
            </div>

            <button className="cancelamento-btn-fechar" onClick={handleClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // FORMULÁRIO
  // ============================================
  return (
    <div className="cancelamento-modal-overlay" onClick={handleClose}>
      <div className="cancelamento-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cancelamento-modal-close" onClick={handleClose}>✕</button>

        <div className="cancelamento-modal-header">
          <div className="cancelamento-modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="8" x2="16" y2="16" />
              <line x1="16" y1="8" x2="8" y2="16" />
            </svg>
          </div>
          <h3>Solicitar Cancelamento</h3>
          <p>Preencha os dados abaixo. Nossa equipe entrará em contato em até 24h úteis.</p>
        </div>

        <form onSubmit={handleSubmit} className="cancelamento-form">
          <div className="cancelamento-form-row">
            <div className="cancelamento-form-group">
              <label>CPF/CNPJ *</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="cancelamento-form-group">
              <label>Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>
          </div>

          <div className="cancelamento-form-row">
            <div className="cancelamento-form-group">
              <label>Telefone *</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="cancelamento-form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="cancelamento-form-group">
            <label>Motivo do cancelamento *</label>
            <select
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um motivo</option>
              <option value="MUDANCA_OPERADORA">Mudança de operadora</option>
              <option value="MUDANCA_ENDERECO">Mudança de endereço</option>
              <option value="VALOR">Valor do serviço</option>
              <option value="QUALIDADE">Qualidade do serviço</option>
              <option value="ATENDIMENTO">Atendimento</option>
              <option value="OUTRO">Outro motivo</option>
            </select>
          </div>

          <div className="cancelamento-form-group">
            <label>Detalhes (opcional)</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="3"
              placeholder="Conte-nos mais sobre o motivo do cancelamento..."
            />
          </div>

          <label className="cancelamento-checkbox">
            <input
              type="checkbox"
              name="consentimento"
              checked={formData.consentimento}
              onChange={handleChange}
              required
            />
            <span>
              Estou ciente que esta é uma solicitação formal de cancelamento e que a equipe entrará em contato para confirmar.
            </span>
          </label>

          {erro && (
            <div className="cancelamento-alert-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{erro}</span>
            </div>
          )}

          <div className="cancelamento-form-actions">
            <button
              type="button"
              className="cancelamento-btn-cancelar"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cancelamento-btn-enviar"
              disabled={loading || !formData.consentimento}
            >
              {loading ? (
                <>
                  <span className="cancelamento-spinner"></span>
                  Enviando...
                </>
              ) : (
                'Solicitar cancelamento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelamentoModal;