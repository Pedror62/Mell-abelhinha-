import React from 'react';
import { useViabilidade } from '../../context/ViabilidadeContext';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const ViabilidadeModal = () => {
  const {
    showViabilidadeModal,
    loading,
    setLoading,
    resultado,
    setResultado,
    erro,
    setErro,
    consultaFeita,
    setConsultaFeita,
    formData,
    setFormData,
    fecharModal,
  } = useViabilidade();

  if (!showViabilidadeModal) return null;

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'cep') {
      const cepLimpo = value.replace(/\D/g, '');
      if (cepLimpo.length === 8) {
        try {
          const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          const data = await resp.json();
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              endereco: data.logradouro || prev.endereco,
              bairro: data.bairro || prev.bairro,
              cidade: data.localidade || prev.cidade,
              uf: data.uf || prev.uf,
            }));
          }
        } catch (err) {
          console.warn('ViaCEP falhou:', err);
        }
      }
    }
  };

  const consultarViabilidade = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setResultado(null);

    try {
      if (!formData.cep && !formData.endereco) {
        throw new Error('Informe o CEP ou o endereço para consultar.');
      }

      const response = await fetch(`${API_URL}/api/viabilidade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, raio: 200 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Erro ao consultar viabilidade.');

      setResultado(data);
      setConsultaFeita(true);
    } catch (error) {
      console.error('Erro na viabilidade:', error);
      setErro(error.message || 'Não foi possível consultar a viabilidade.');
      setConsultaFeita(true);
    } finally {
      setLoading(false);
    }
  };

  const irParaPlanos = () => {
    fecharModal();
    setTimeout(() => {
      const el = document.getElementById('planos');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  const irParaWhatsApp = () => {
    const msg = `Olá! Consultei a disponibilidade em ${formData.endereco || ''}, ${formData.numero || ''} - ${formData.cidade || ''}/${formData.uf || ''} e gostaria de saber mais sobre a cobertura.`;
    window.open(`https://wa.me/558000389004?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="viabilidade-overlay" onClick={fecharModal}>
      <div className="viabilidade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="viabilidade-close" onClick={fecharModal} aria-label="Fechar">✕</button>

        {!consultaFeita && (
          <>
            <div className="viabilidade-header">
              <h2>Consultar disponibilidade</h2>
              <p>Informe o endereço e descubra se temos cobertura na sua região.</p>
            </div>

            <form onSubmit={consultarViabilidade} className="viabilidade-form">
              <div className="viabilidade-row">
                <div className="viabilidade-field">
                  <label>CEP</label>
                  <input type="text" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" maxLength={9} />
                </div>
              </div>

              <div className="viabilidade-row">
                <div className="viabilidade-field viabilidade-flex-3">
                  <label>Endereço *</label>
                  <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua, avenida..." required />
                </div>
                <div className="viabilidade-field viabilidade-flex-1">
                  <label>Número *</label>
                  <input type="text" name="numero" value={formData.numero} onChange={handleChange} placeholder="123" required />
                </div>
              </div>

              <div className="viabilidade-row">
                <div className="viabilidade-field viabilidade-flex-1">
                  <label>Complemento</label>
                  <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, bloco..." />
                </div>
                <div className="viabilidade-field viabilidade-flex-1">
                  <label>Bairro</label>
                  <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Centro" />
                </div>
              </div>

              <div className="viabilidade-row">
                <div className="viabilidade-field viabilidade-flex-3">
                  <label>Cidade *</label>
                  <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Sua cidade" required />
                </div>
                <div className="viabilidade-field viabilidade-flex-1">
                  <label>UF *</label>
                  <input type="text" name="uf" value={formData.uf} onChange={handleChange} placeholder="MG" maxLength={2} required />
                </div>
              </div>

              {erro && <div className="viabilidade-erro">{erro}</div>}

              <button type="submit" className="viabilidade-submit" disabled={loading}>
                {loading ? 'Consultando...' : 'Consultar viabilidade'}
              </button>
            </form>
          </>
        )}

        {consultaFeita && (
          <div className="viabilidade-resultado">
            {resultado?.temViabilidade === true && (
              <>
                <div className="resultado-icon resultado-icon-ok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="resultado-titulo">Temos viabilidade na sua região!</h2>
                <p className="resultado-texto">
                  Encontramos <strong>{resultado.totalCaixas}</strong> caixa(s) de atendimento próxima(s) ao endereço <strong>{resultado.enderecoConsultado}</strong>.
                </p>
                <button type="button" className="resultado-btn resultado-btn-ok" onClick={irParaPlanos}>
                  Conhecer os planos →
                </button>
              </>
            )}

            {resultado?.temViabilidade === false && !erro && (
              <>
                <div className="resultado-icon resultado-icon-warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="resultado-titulo">Ainda não temos cobertura aqui</h2>
                <p className="resultado-texto">
                  Infelizmente não encontramos viabilidade para o endereço <strong> {resultado.enderecoConsultado}</strong>. Mas podemos verificar outras opções para você!
                </p>
                <button type="button" className="resultado-btn resultado-btn-wpp" onClick={irParaWhatsApp}>
                  Falar no WhatsApp →
                </button>
              </>
            )}

            {erro && (
              <>
                <div className="resultado-icon resultado-icon-warn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="resultado-titulo">Não conseguimos consultar agora</h2>
                <p className="resultado-texto">{erro}</p>
                <div className="resultado-actions">
                  <button type="button" className="resultado-btn resultado-btn-outline" onClick={() => { setConsultaFeita(false); setErro(''); }}>
                    Tentar novamente
                  </button>
                  <button type="button" className="resultado-btn resultado-btn-wpp" onClick={irParaWhatsApp}>
                    Falar no WhatsApp →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViabilidadeModal;