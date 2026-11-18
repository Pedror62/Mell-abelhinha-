import React, { useEffect, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function formatarData(valor) {
  if (!valor) return 'Não informada';
  return String(valor);
}

function textoEndereco(endereco) {
  if (!endereco) return 'Endereço não informado';
  if (typeof endereco === 'string') return endereco;
  if (endereco.completo) return endereco.completo;

  return [
    endereco.logradouro || endereco.endereco || endereco.rua,
    endereco.numero,
    endereco.complemento,
    endereco.bairro,
    endereco.cidade,
    endereco.uf,
    endereco.cep ? `CEP: ${endereco.cep}` : null,
  ].filter(Boolean).join(', ') || 'Endereço não informado';
}

export default function MeusDadosServicos({ cliente: clienteInicial }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        let cliente = clienteInicial;

        if (!cliente) {
          const salvo = localStorage.getItem('clienteLogado');
          cliente = salvo ? JSON.parse(salvo) : null;
        }

        if (!cliente) throw new Error('Cliente não autenticado.');

        const response = await fetch(`${API_URL}/api/app/dashboard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: {
              cpf_cnpj: cliente.cpf_cnpj,
              codigo_cliente: cliente.codigo_cliente,
              id_cliente: cliente.id_cliente,
            },
            periodo: {
              apenas_pendente: 'nao',
            },
          }),
        });

        const data = await response.json();
        if (!response.ok || data.status !== 'success') {
          throw new Error(data.msg || data.error || 'Não foi possível carregar os dados.');
        }

        setDashboard(data);
      } catch (e) {
        console.error('Erro no dashboard do cliente:', e);
        setErro(e.message);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [clienteInicial]);

  if (loading) return <div className="meus-dados-loading">Carregando serviços...</div>;
  if (erro) return <div className="meus-dados-error">{erro}</div>;

  const servicos = Array.isArray(dashboard?.servicos) ? dashboard.servicos : [];
  const atendimentos = Array.isArray(dashboard?.atendimentos) ? dashboard.atendimentos : [];
  const ordens = Array.isArray(dashboard?.ordens_servico)
    ? dashboard.ordens_servico
    : Array.isArray(dashboard?.ordensServico)
      ? dashboard.ordensServico
      : [];

  return (
    <div className="meus-dados-servicos">
      <header>
        <h2>{dashboard?.cliente?.nome_razaosocial || 'Meus serviços'}</h2>
        <p>
          Serviços: {servicos.length} | Atendimentos: {atendimentos.length} | Ordens de serviço: {ordens.length}
        </p>
      </header>

      {servicos.length === 0 && (
        <div className="meus-dados-empty">Nenhum serviço encontrado para este cliente.</div>
      )}

      {servicos.map((servico) => {
        const atendimentosDoServico = Array.isArray(servico.atendimentos)
          ? servico.atendimentos
          : atendimentos.filter((item) => String(item.id_cliente_servico) === String(servico.id_cliente_servico));

        const ordensDoServico = Array.isArray(servico.ordens_servico)
          ? servico.ordens_servico
          : ordens.filter((item) => String(item.id_cliente_servico) === String(servico.id_cliente_servico));

        return (
          <article className="servico-card" key={servico.id_cliente_servico || servico.id_servico}>
            <div className="servico-header">
              <div>
                <h3>{servico.nome || 'Plano não informado'}</h3>
                <small>Serviço: {servico.id_cliente_servico || 'Não informado'}</small>
              </div>
              <strong>{servico.status || 'Status não informado'}</strong>
            </div>

            <p><b>Endereço de instalação:</b> {textoEndereco(servico.endereco_instalacao)}</p>
            <p><b>Valor:</b> {Number(servico.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>

            <section>
              <h4>Atendimentos ({atendimentosDoServico.length})</h4>
              {atendimentosDoServico.length === 0 ? (
                <p>Nenhum atendimento encontrado para este plano.</p>
              ) : atendimentosDoServico.map((item) => (
                <div className="registro-card" key={item.id_atendimento || item.protocolo}>
                  <b>Protocolo: {item.protocolo || item.id_atendimento || 'Não informado'}</b>
                  <span>Status: {item.status || item.status_fechamento || 'Não informado'}</span>
                  <span>Tipo: {item.tipo_atendimento || 'Não informado'}</span>
                  <span>Responsável: {item.usuario_responsavel || 'Não informado'}</span>
                  <span>Data: {formatarData(item.data_cadastro)}</span>
                  <span>{item.descricao_abertura || item.descricao || 'Sem descrição'}</span>
                </div>
              ))}
            </section>

            <section>
              <h4>Ordens de serviço ({ordensDoServico.length})</h4>
              {ordensDoServico.length === 0 ? (
                <p>Nenhuma ordem de serviço encontrada para este plano.</p>
              ) : ordensDoServico.map((item) => (
                <div className="registro-card" key={item.id_ordem_servico || item.numero_ordem_servico}>
                  <b>OS: {item.numero_ordem_servico || item.numero || item.id_ordem_servico || 'Não informada'}</b>
                  <span>Status: {item.status || 'Não informado'}</span>
                  <span>Tipo: {item.tipo || 'Não informado'}</span>
                  <span>Cadastro: {formatarData(item.data_cadastro)}</span>
                  <span>Endereço: {item.endereco_instalacao || textoEndereco(servico.endereco_instalacao)}</span>
                  <span>
                    Técnico: {Array.isArray(item.tecnicos) && item.tecnicos.length
                      ? item.tecnicos.map((tecnico) => tecnico.name || tecnico.nome || tecnico.id).join(', ')
                      : 'Não informado'}
                  </span>
                </div>
              ))}
            </section>
          </article>
        );
      })}
    </div>
  );
}
