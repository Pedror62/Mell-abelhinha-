// src/components/Hero/Hero.jsx
import React, { useState } from 'react';
import './Hero.css';
import heroImg from '../../assets/sentadaNaCadeira.png';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const Hero = () => {
  // ============================================
  // ESTADOS DO MODAL DE VIABILIDADE
  // ============================================
  const [showViabilidadeModal, setShowViabilidadeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [consultaFeita, setConsultaFeita] = useState(false);

  const [formData, setFormData] = useState({
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  // ============================================
  // HANDLERS
  // ============================================
  const resetModal = () => {
    setResultado(null);
    setErro('');
    setConsultaFeita(false);
    setLoading(false);
  };

  const abrirModal = () => {
    resetModal();
    setShowViabilidadeModal(true);
  };

  const fecharModal = () => {
    setShowViabilidadeModal(false);
    resetModal();
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Busca automática no ViaCEP quando o CEP tiver 8 dígitos
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
      // Validação mínima
      if (!formData.cep && !formData.endereco) {
        throw new Error('Informe o CEP ou o endereço para consultar.');
      }

      const response = await fetch(`${API_URL}/api/viabilidade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          raio: 200,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Erro ao consultar viabilidade.');
      }

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
    const msg = `Olá! Consultеi a disponibilidade em ${formData.endereco || ''}, ${formData.numero || ''} - ${formData.cidade || ''}/${formData.uf || ''} e gostaria de saber mais sobre a cobertura.`;
    window.open(`https://wa.me/558000389004?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <section className="hero">
        <div className="hero-container">
          {/* Lado Esquerdo: Conteúdo de Texto */}
          <div className="hero-content">
            <span className="hero-tag">Fibra de verdade para você</span>

            <h1 className="hero-title">
              Internet rápida é bom. <br className="hide-on-mobile" />
              Internet que acompanha <br className="hide-on-mobile" />
              sua vida é Mell.
            </h1>

            <p className="hero-subtitle">
              Tenha conexão de alta velocidade, suporte 24 horas e benefícios
              para estudar, trabalhar, assistir e aproveitar muito mais.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="btn-primary"
                onClick={abrirModal}
              >
                Consultar disponibilidade
              </button>
              <a href="#planos" className="btn-secondary">
                Conhecer os planos <span>↘</span>
              </a>
            </div>

            <div className="hero-badges">
              <span className="badge">
                <svg
                  className="badge-icon-vector"
                  width="9"
                  height="11"
                  viewBox="0 0 9 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 1L1 6.5H4.5L3.5 10L8 4.5H4.5L5 1Z"
                    stroke="#00A1DC"
                    strokeWidth="1.07"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Fibra óptica
              </span>
              <span className="badge">Suporte 24 horas</span>
              <span className="badge">+50 cidades atendidas</span>
            </div>
          </div>

          {/* Lado Direito: Imagem Principal */}
          <div className="hero-image-container">
            <img src={heroImg} alt="Mãe e filha conectadas no sofá" className="hero-image" />
          </div>
        </div>

        {/* Card Laranja de Destaque na Base */}
        <div className="hero-bottom-card">
          <div className="card-item">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z"/>
            </svg>
            <p>Internet para tudo<br className="hide-on-mobile" />acontecer melhor</p>
          </div>

          <div className="card-divider"></div>

          <div className="card-item">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>Suporte disponível a<br className="hide-on-mobile" />qualquer hora</p>
          </div>

          <div className="card-divider"></div>

          <div className="card-item">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p>Atendimento que<br className="hide-on-mobile" />conhece sua região</p>
          </div>

          <div className="card-divider"></div>

          <div className="card-item">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p>Benefícios para toda<br className="hide-on-mobile" />a família</p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MODAL DE VIABILIDADE                          */}
      {/* ============================================ */}
      {showViabilidadeModal && (
        <div className="viabilidade-overlay" onClick={fecharModal}>
          <div className="viabilidade-modal" onClick={(e) => e.stopPropagation()}>
            <button className="viabilidade-close" onClick={fecharModal} aria-label="Fechar">
              ✕
            </button>

            {/* ANTES DA CONSULTA — FORMULÁRIO */}
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
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                  </div>

                  <div className="viabilidade-row">
                    <div className="viabilidade-field viabilidade-flex-3">
                      <label>Endereço *</label>
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        placeholder="Rua, avenida..."
                        required
                      />
                    </div>
                    <div className="viabilidade-field viabilidade-flex-1">
                      <label>Número *</label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="viabilidade-row">
                    <div className="viabilidade-field viabilidade-flex-1">
                      <label>Complemento</label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        placeholder="Apto, bloco..."
                      />
                    </div>
                    <div className="viabilidade-field viabilidade-flex-1">
                      <label>Bairro</label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        placeholder="Centro"
                      />
                    </div>
                  </div>

                  <div className="viabilidade-row">
                    <div className="viabilidade-field viabilidade-flex-3">
                      <label>Cidade *</label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Sua cidade"
                        required
                      />
                    </div>
                    <div className="viabilidade-field viabilidade-flex-1">
                      <label>UF *</label>
                      <input
                        type="text"
                        name="uf"
                        value={formData.uf}
                        onChange={handleChange}
                        placeholder="MG"
                        maxLength={2}
                        required
                      />
                    </div>
                  </div>

                  {erro && <div className="viabilidade-erro">{erro}</div>}

                  <button
                    type="submit"
                    className="viabilidade-submit"
                    disabled={loading}
                  >
                    {loading ? 'Consultando...' : 'Consultar viabilidade'}
                  </button>
                </form>
              </>
            )}

            {/* DEPOIS DA CONSULTA — RESULTADO */}
            {consultaFeita && (
              <div className="viabilidade-resultado">
                {/* CENÁRIO 1: TEM VIABILIDADE */}
                {resultado?.temViabilidade === true && (
                  <>
                    <div className="resultado-icon resultado-icon-ok">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h2 className="resultado-titulo">Temos viabilidade na sua região!</h2>
                    <p className="resultado-texto">
                      Encontramos <strong>{resultado.totalCaixas}</strong> caixa(s) de atendimento próxima(s)
                      ao endereço <strong>{resultado.enderecoConsultado}</strong>.
                    </p>
                    <button type="button" className="resultado-btn resultado-btn-ok" onClick={irParaPlanos}>
                      Conhecer os planos →
                    </button>
                  </>
                )}

                {/* CENÁRIO 2: NÃO TEM VIABILIDADE */}
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
                      Infelizmente não encontramos viabilidade para o endereço
                      <strong> {resultado.enderecoConsultado}</strong>.
                      Mas podemos verificar outras opções para você!
                    </p>
                    <button type="button" className="resultado-btn resultado-btn-wpp" onClick={irParaWhatsApp}>
                      Falar no WhatsApp →
                    </button>
                  </>
                )}

                {/* CENÁRIO 3: ERRO NA CONSULTA */}
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
                      <button
                        type="button"
                        className="resultado-btn resultado-btn-outline"
                        onClick={() => {
                          setConsultaFeita(false);
                          setErro('');
                        }}
                      >
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
      )}
    </>
  );
};

export default Hero;