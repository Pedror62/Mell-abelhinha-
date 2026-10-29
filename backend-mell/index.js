// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const qs = require('querystring');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001;
const HUBSOFT_TIMEOUT_MS = Number(process.env.HUBSOFT_TIMEOUT_MS || 30000);
let tokenCache = { value: null, expiresAt: 0 };

// ============================================
// CACHE DO TOKEN GEOSITE
// ============================================
let geositeTokenCache = { value: null, expiresAt: 0 };

function hubsoftBaseUrl() {
  const value = process.env.HUBSOFT_BASE_URL?.trim().replace(/\/$/, '');
  if (!value) throw new Error('HUBSOFT_BASE_URL não configurada.');
  return value;
}

function hubsoftHeaders(token) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function hubsoftError(error) {
  const data = error.response?.data;
  const message = data?.msg || data?.message || data?.error || error.message;
  const wrapped = new Error(message || 'Erro na API HubSoft.');
  wrapped.status = error.response?.status || 502;
  wrapped.details = data;
  return wrapped;
}

function sendHubsoftError(res, error) {
  const normalized = error?.response ? hubsoftError(error) : error;
  return res.status(normalized.status || 500).json({
    error: normalized.message || 'Erro na integração HubSoft.',
    details: process.env.NODE_ENV === 'production' ? undefined : normalized.details,
  });
}

async function hubsoftGet(pathname, params = {}) {
  const token = await getHubsoftToken();
  try {
    return (await axios.get(`${hubsoftBaseUrl()}${pathname}`, {
      params,
      headers: hubsoftHeaders(token),
      timeout: HUBSOFT_TIMEOUT_MS,
    })).data;
  } catch (error) {
    if (error.response?.status === 401) {
      tokenCache = { value: null, expiresAt: 0 };
      const retryToken = await getHubsoftToken(true);
      try {
        return (await axios.get(`${hubsoftBaseUrl()}${pathname}`, {
          params,
          headers: hubsoftHeaders(retryToken),
          timeout: HUBSOFT_TIMEOUT_MS,
        })).data;
      } catch (retryError) {
        throw hubsoftError(retryError);
      }
    }
    throw hubsoftError(error);
  }
}

function queryParams(req, allowed) {
  const result = {};
  for (const key of allowed) {
    const value = req.query[key];
    if (value !== undefined && value !== '') result[key] = value;
  }
  return result;
}

function sanitizarDadosCliente(data) {
  if (!data || typeof data !== 'object') return data;
  const copiar = JSON.parse(JSON.stringify(data));
  const clientes = Array.isArray(copiar.clientes) ? copiar.clientes : [];
  copiar.clientes = clientes.map((cliente) => ({
    ...cliente,
    servicos: (cliente.servicos || []).map((servico) => {
      const { senha, senhas, ...servicoSeguro } = servico;
      return servicoSeguro;
    }),
  }));
  return copiar;
}

// ============================================
// NORMALIZA O ENDEREÇO
// ============================================
function normalizarEndereco(e) {
  if (!e) return null;
  if (typeof e === 'string') return { completo: e };
  const txt = (v) =>
    v && typeof v === 'object' ? (v.nome || v.sigla || v.descricao || '') : (v || '');
  return {
    completo: e.completo || null,
    logradouro: txt(e.endereco || e.logradouro || e.rua),
    numero: txt(e.numero),
    complemento: txt(e.complemento),
    bairro: txt(e.bairro),
    cidade: txt(e.cidade),
    uf: txt(e.estado || e.uf),
    cep: txt(e.cep),
  };
}

// ============================================
// 1. AUTENTICAÇÃO TÉCNICA (TOKEN HUBSOFT)
// ============================================
async function getHubsoftToken(forceRefresh = false) {
  if (!forceRefresh && tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value;
  const tokenUrl = `${hubsoftBaseUrl()}/oauth/token`;
  const payload = qs.stringify({
    grant_type: 'password',
    client_id: process.env.HUBSOFT_CLIENT_ID?.trim(),
    client_secret: process.env.HUBSOFT_CLIENT_SECRET?.trim(),
    username: process.env.HUBSOFT_USERNAME?.trim(),
    password: process.env.HUBSOFT_PASSWORD?.trim(),
  });
  try {
    const response = await axios.post(tokenUrl, payload, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: HUBSOFT_TIMEOUT_MS,
    });
    const accessToken = response.data?.access_token;
    if (!accessToken) throw new Error('A HubSoft não retornou access_token.');
    const expiresIn = Number(response.data?.expires_in || 3600);
    tokenCache = { value: accessToken, expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000 };
    return accessToken;
  } catch (error) {
    console.error(' ❌ Erro na Autenticação HubSoft:', error.response?.data || error.message);
    throw hubsoftError(error);
  }
}

// ============================================
// 2. AUTENTICAÇÃO GEOSITE (TOKEN)
// ============================================
async function getGeositeToken(forceRefresh = false) {
  if (!forceRefresh && geositeTokenCache.value && Date.now() < geositeTokenCache.expiresAt) {
    return geositeTokenCache.value;
  }

  const username = process.env.GEOSITE_USERNAME?.trim();
  const password = process.env.GEOSITE_PASSWORD?.trim();

  if (!username || !password) {
    throw new Error('GEOSITE_USERNAME e GEOSITE_PASSWORD não configurados no .env');
  }

  try {
    const response = await axios.post(
      'https://telecom.geosite.com.br/geosite-telecom-api/auth/generatetoken',
      { username, password },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );

    const token = response.data?.token;
    if (!token) throw new Error('GeoSite não retornou token.');

    // GeoSite não informa expires_in, assume 55 minutos
    geositeTokenCache = {
      value: token,
      expiresAt: Date.now() + 55 * 60 * 1000,
    };

    return token;
  } catch (error) {
    console.error(' ❌ Erro na Autenticação GeoSite:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com o GeoSite.');
  }
}

// ============================================
// 3. LOGIN DO CLIENTE (CENTRAL DO ASSINANTE)
// ============================================
app.post('/api/login-cliente', async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  try {
    const baseUrl = process.env.HUBSOFT_BASE_URL?.replace(/\/$/, '') || '';
    const token = await getHubsoftToken();

    console.log(` 🔑 Tentando login do cliente: ${usuario}`);

    const response = await axios.post(
      `${baseUrl}/api/v1/integracao/cliente/autenticacao`,
      { usuario, senha },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.status === 'success') {
      console.log(` ✅ Login bem-sucedido: ${response.data.cliente.nome_razaosocial}`);

      const clienteRetorno = response.data.cliente || {};

      return res.json({
        status: 'success',
        msg: 'Usuário autenticado com sucesso',
        cliente: {
          id_cliente: clienteRetorno.id_cliente,
          codigo_cliente: clienteRetorno.codigo_cliente,
          nome_razaosocial: clienteRetorno.nome_razaosocial,
          cpf_cnpj: clienteRetorno.cpf_cnpj || usuario,
          email_principal: clienteRetorno.email_principal,
        },
      });
    } else {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
  } catch (error) {
    console.error(' ❌ Erro no login:', error.response?.data || error.message);
    const statusCode = error.response?.status || 401;
    const mensagem = error.response?.data?.msg || 'Usuário ou senha inválidos na HubSoft.';
    return res.status(statusCode).json({ error: mensagem });
  }
});

// ============================================
// 4. FUNÇÕES AUXILIARES HUBSOFT
// ============================================
function formatarStatusServico(status) {
  if (!status) return 'Status não disponível';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('suspenso')) return 'Suspenso por Débito';
  if (statusLower.includes('habilitado') || statusLower.includes('ativo')) return 'Serviço Habilitado';
  if (statusLower.includes('cancelado') || statusLower.includes('inativo')) return 'Serviço Cancelado';
  if (statusLower.includes('teste')) return 'Serviço em Teste';
  if (statusLower.includes('bloqueado')) return 'Serviço Bloqueado';
  if (statusLower.includes('pendente')) return 'Pendente de Ativação';
  if (statusLower.includes('spc')) return 'Status SPC';
  return status;
}

function isFaturaPaga(fatura) {
  if (fatura.data_pagamento && fatura.data_pagamento !== null && fatura.data_pagamento !== '' && fatura.data_pagamento !== 'null') return true;
  if (fatura.valor_pago !== null && fatura.valor_pago !== undefined && fatura.valor_pago !== '') {
    if (parseFloat(fatura.valor_pago) > 0) return true;
  }
  if (fatura.quitado !== undefined) {
    if (fatura.quitado === true || fatura.quitado === 'true' || fatura.quitado === 1 || fatura.quitado === 'sim') return true;
  }
  if (fatura.pago !== undefined) {
    if (fatura.pago === true || fatura.pago === 'true' || fatura.pago === 1 || fatura.pago === 'sim') return true;
  }
  if (fatura.status) {
    const statusLower = String(fatura.status).toLowerCase();
    const statusPago = ['pago', 'quitado', 'baixa', 'paga', 'confirmado', 'liquidado'];
    if (statusPago.some(word => statusLower.includes(word))) return true;
    if (statusLower.includes('vencido') || statusLower.includes('pendente') || statusLower.includes('aguardando')) return false;
  }
  if (fatura.recibos && Array.isArray(fatura.recibos) && fatura.recibos.length > 0) return true;
  if (fatura.cobrancas && Array.isArray(fatura.cobrancas)) {
    const temPago = fatura.cobrancas.some(item => {
      const statusItem = String(item.status || '').toLowerCase();
      return statusItem.includes('pago') || statusItem.includes('quitado') || statusItem.includes('baixa') || statusItem.includes('liquidado');
    });
    if (temPago) return true;
  }
  if (fatura.data_credito && fatura.data_credito !== null && fatura.data_credito !== '' && fatura.data_credito !== 'null') return true;
  return false;
}

function obterCpfDoClienteDaFatura(fatura) {
  const possiveisCampos = [fatura?.cliente?.cpf_cnpj, fatura?.cliente?.cpf, fatura?.cliente?.cnpj];
  for (const campo of possiveisCampos) {
    if (campo) {
      const apenasNumeros = String(campo).replace(/\D/g, '');
      if (apenasNumeros.length > 0) return apenasNumeros;
    }
  }
  return null;
}

async function buscarDadosCliente(token, baseUrl, cpfLimpo) {
  try {
    console.log(' Buscando dados do cliente...');
    const response = await axios.get(`${baseUrl}/api/v1/integracao/cliente`, {
      params: {
        busca: 'cpf_cnpj',
        termo_busca: cpfLimpo,
        relacoes: 'servicos,contratos,velocidade,ultima_conexao,endereco_instalacao',
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.clientes && response.data.clientes.length > 0) {
      const cliente = response.data.clientes[0];
      console.log(` Cliente encontrado: ${cliente.nome_razaosocial}`);
      const servicoInfo = cliente.servicos && cliente.servicos.length > 0 ? cliente.servicos[0] : null;

      return {
        id_cliente: cliente.id_cliente,
        codigo_cliente: cliente.codigo_cliente,
        nome_razaosocial: cliente.nome_razaosocial,
        nome_fantasia: cliente.nome_fantasia,
        tipo_pessoa: cliente.tipo_pessoa,
        cpf_cnpj: cliente.cpf_cnpj,
        telefone_primario: cliente.telefone_primario,
        telefone_secundario: cliente.telefone_secundario,
        email_principal: cliente.email_principal,
        data_cadastro: cliente.data_cadastro,
        data_nascmento: cliente.data_nascmento,
        servico_detalhes: servicoInfo ? {
          id_cliente_servico: servicoInfo.id_cliente_servico || 'N/A',
          numero_plano: servicoInfo.numero_plano || 'N/A',
          nome: servicoInfo.nome || 'N/A',
          valor: servicoInfo.valor || 0,
          status: formatarStatusServico(servicoInfo.status),
          status_prefixo: servicoInfo.status_prefixo || null,
          tecnologia: servicoInfo.tecnologia || 'Fibra Óptica / Wireless',
          login: servicoInfo.login || 'N/A',
          ipv4: servicoInfo.ipv4 || 'N/A',
          mac_addr: servicoInfo.mac_addr || 'N/A',
          referencia: servicoInfo.referencia || null,
          endereco_cadastral: servicoInfo.endereco_cadastral || null,
          endereco_instalacao: servicoInfo.endereco_instalacao || null,
          endereco_cobranca: servicoInfo.endereco_cobranca || null,
          ultima_conexao: servicoInfo.ultima_conexao?.conectado || false,
          ultima_conexao_data: servicoInfo.ultima_conexao?.ultima_conexao || null,
          equipamento_conexao: servicoInfo.equipamento_conexao?.nome || null,
          equipamento_roteamento: servicoInfo.equipamento_roteamento?.nome || null,
        } : null,
      };
    }
    return null;
  } catch (error) {
    console.log(` Cliente não encontrado na rota de detalhes: ${error.message}`);
    return null;
  }
}

function extrairTodosServicos(faturas) {
  const servicosMap = new Map();
  faturas.forEach(f => {
    const servico = f.servico || f.cliente?.servico || null;
    if (servico) {
      const key = servico.id_cliente_servico || servico.uuid_cliente_servico || servico.nome || 'servico';
      if (!servicosMap.has(key)) {
        servicosMap.set(key, {
          id_cliente_servico: servico.id_cliente_servico || servico.uuid_cliente_servico || 'N/A',
          numero_plano: servico.numero_plano || 'N/A',
          nome: servico.descricao || servico.nome || 'N/A',
          valor: parseFloat(servico.valor || 0),
          status: formatarStatusServico(servico.status || servico.servico_status),
          status_original: servico.status || servico.servico_status || 'Status não informado',
          status_prefixo: servico.status_prefixo || null,
          tecnologia: servico.tecnologia || 'Fibra Óptica / Wireless',
          login: servico.login || 'N/A',
          ipv4: servico.ipv4 || 'N/A',
          mac_addr: servico.mac_addr || 'N/A',
        });
      }
    }
  });
  return Array.from(servicosMap.values());
}

function extrairDadosServico(faturas) {
  const todos = extrairTodosServicos(faturas);
  let servicoAtivo = todos.find(s => s.status?.toLowerCase().includes('habilitado') || s.status?.toLowerCase().includes('vigência') || s.status?.toLowerCase().includes('ativo'));
  if (!servicoAtivo && todos.length > 0) servicoAtivo = todos[0];
  return servicoAtivo || null;
}

function gerarPeriodoDatas() {
  const dataFim = new Date();
  const dataInicio = new Date();
  dataInicio.setFullYear(dataInicio.getFullYear() - 1);
  const formatarData = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return { data_inicio: formatarData(dataInicio), data_fim: formatarData(dataFim) };
}

async function buscarFaturasCliente(token, baseUrl, cpfLimpo) {
  try {
    console.log(' Buscando faturas do cliente...');
    const periodo = gerarPeriodoDatas();
    let faturasPagas = [];
    let faturasEmAberto = [];
    let todasFaturas = [];

    try {
      const responsePagas = await axios.get(`${baseUrl}/api/v1/integracao/financeiro/fatura`, {
        params: { busca: 'cpf_cnpj', termo_busca: cpfLimpo, apenas_quitado: 'sim', exibir_fatura_inativa: 'nao', tipo_data: 'data_vencimento', data_inicio: periodo.data_inicio, data_fim: periodo.data_fim, exibir_pix_copia_cola: 'sim', exibir_faturas_renegociacao: 'sim', valor_zerado: 'sim', itens_por_pagina: 500, pagina: 0 },
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      faturasPagas = responsePagas.data?.faturas || [];
    } catch (error) { console.log(`   Erro ao buscar faturas pagas: ${error.message}`); }

    try {
      const responseAberto = await axios.get(`${baseUrl}/api/v1/integracao/financeiro/fatura`, {
        params: { busca: 'cpf_cnpj', termo_busca: cpfLimpo, apenas_em_aberto: 'sim', exibir_fatura_inativa: 'nao', tipo_data: 'data_vencimento', data_inicio: periodo.data_inicio, data_fim: periodo.data_fim, exibir_pix_copia_cola: 'sim', exibir_faturas_renegociacao: 'sim', valor_zerado: 'sim', itens_por_pagina: 500, pagina: 0 },
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      faturasEmAberto = responseAberto.data?.faturas || [];
    } catch (error) { console.log(`   Erro ao buscar faturas em aberto: ${error.message}`); }

    const idsPagas = new Set(faturasPagas.map(f => f.id_fatura));
    todasFaturas = [...faturasPagas];
    faturasEmAberto.forEach(f => { if (!idsPagas.has(f.id_fatura)) todasFaturas.push(f); });

    if (todasFaturas.length === 0) {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/integracao/financeiro/fatura`, {
          params: { busca: 'cpf_cnpj', termo_busca: cpfLimpo, tipo_data: 'data_vencimento', data_inicio: periodo.data_inicio, data_fim: periodo.data_fim, exibir_pix_copia_cola: 'sim', exibir_fatura_inativa: 'sim', exibir_faturas_renegociacao: 'sim', valor_zerado: 'sim', itens_por_pagina: 500, pagina: 0 },
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const faturasFallback = response.data?.faturas || [];
        todasFaturas = faturasFallback.filter(f => {
          const servico = f.servico || f.cliente?.servico || null;
          if (!servico) return true;
          const status = String(servico.status || '').toLowerCase();
          const statusInativo = ['cancelado', 'inativo', 'desabilitado'];
          return !statusInativo.some(s => status.includes(s));
        });
      } catch (error) { console.log(`   Erro no fallback: ${error.message}`); }
    }
    return { todas: todasFaturas, pagas: faturasPagas, emAberto: faturasEmAberto };
  } catch (error) {
    console.error(' Erro ao buscar faturas:', error.message);
    return { todas: [], pagas: [], emAberto: [] };
  }
}

// ============================================
// 5. ROTA DE VIABILIDADE GEOSITE (NOVA)
// ============================================
app.post('/api/viabilidade', async (req, res) => {
  console.log(' Rota /api/viabilidade chamada:', req.body);

  try {
    const { endereco, numero, complemento, bairro, cidade, uf, cep, raio } = req.body;

    if (!endereco && !cep) {
      return res.status(400).json({
        status: 'error',
        msg: 'Informe ao menos o endereço ou o CEP.',
        temViabilidade: false,
      });
    }

    // Monta o endereço no formato que o GeoSite aceita
    const enderecoCompleto = [
      endereco,
      numero,
      complemento,
      bairro,
      cidade && uf ? `${cidade} - ${uf}` : cidade,
      cep,
    ].filter(Boolean).join(', ');

    console.log('Endereço para consulta:', enderecoCompleto);

    const token = await getGeositeToken();

    const response = await axios.get(
      'https://telecom.geosite.com.br/geosite-telecom-api/viabilidade/caixas',
      {
        params: {
          raio: raio || 200,
          endereco: enderecoCompleto,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const data = response.data || {};

    // GeoSite pode retornar em diferentes chaves dependendo da versão
    const caixas =
      data.caixas ||
      data.records ||
      data.features ||
      (Array.isArray(data) ? data : []);

    const temViabilidade = Array.isArray(caixas) && caixas.length > 0;

    console.log(` Viabilidade: ${temViabilidade ? 'SIM' : 'NÃO'} (${caixas.length} caixas)`);

    return res.json({
      status: 'success',
      temViabilidade,
      totalCaixas: caixas.length,
      caixas: caixas.slice(0, 5),
      enderecoConsultado: enderecoCompleto,
      raio: raio || 200,
      raw: temViabilidade ? undefined : data,
    });
  } catch (error) {
    console.error('Erro na viabilidade:', error.response?.data || error.message);

    const statusCode = error.response?.status || 500;
    const mensagem =
      error.response?.data?.message ||
      error.response?.data?.msg ||
      error.message ||
      'Erro ao consultar viabilidade.';

    return res.status(statusCode).json({
      status: 'error',
      msg: mensagem,
      temViabilidade: false,
    });
  }
});

// ============================================
// 6. ROTA DE BOLETOS
// ============================================
app.post('/api/consultar-boleto', async (req, res) => {
  try {
    const { cpfCnpj, mostrarTodos } = req.body;
    if (!cpfCnpj) return res.status(400).json({ error: 'Informe um CPF ou CNPJ válido.' });
    const cpfDigitadoLimpo = String(cpfCnpj).replace(/\D/g, '');
    const baseUrl = process.env.HUBSOFT_BASE_URL?.replace(/\/$/, '') || '';
    const token = await getHubsoftToken();

    const dadosCliente = await buscarDadosCliente(token, baseUrl, cpfDigitadoLimpo);
    const resultado = await buscarFaturasCliente(token, baseUrl, cpfDigitadoLimpo);
    const todasFaturas = resultado.todas;

    if (todasFaturas.length === 0) {
      if (dadosCliente) {
        return res.json({
          mensagem: 'Cliente não possui faturas em aberto ou pagas.', tipo: 'sem_faturas',
          cliente: { nome: dadosCliente.nome_razaosocial || 'Cliente', cpf_cnpj: dadosCliente.cpf_cnpj || cpfDigitadoLimpo },
          cliente_detalhes: dadosCliente, faturas: [], faturasPagas: [], faturasEmAberto: [],
          dadosServico: dadosCliente.servico_detalhes || null, todosServicos: [],
          statusCliente: dadosCliente.servico_detalhes?.status || 'Status não disponível',
          totalFaturas: 0, totalFaturasPagas: 0, totalFaturasPendentes: 0,
          resumo: { total: 0, pagas: 0, pendentes: 0, vencidas: 0, em_aberto: 0 },
        });
      }
      return res.status(404).json({ error: 'CPF/CNPJ não encontrado na base de dados.' });
    }

    let faturasDoCliente = todasFaturas;
    if (dadosCliente) {
      const cpfCliente = dadosCliente.cpf_cnpj?.replace(/\D/g, '');
      if (cpfCliente) {
        const filtradas = todasFaturas.filter(f => obterCpfDoClienteDaFatura(f) === cpfCliente);
        if (filtradas.length > 0) faturasDoCliente = filtradas;
      }
    }

    const faturasPagas = faturasDoCliente.filter(f => isFaturaPaga(f));
    const faturasPendentes = faturasDoCliente.filter(f => !isFaturaPaga(f));
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const faturasVencidas = faturasPendentes.filter(f => {
      if (f.data_vencimento) { const d = new Date(f.data_vencimento); d.setHours(0,0,0,0); return d < hoje; }
      return false;
    });
    const faturasEmAberto = faturasPendentes.filter(f => {
      if (f.data_vencimento) { const d = new Date(f.data_vencimento); d.setHours(0,0,0,0); return d >= hoje; }
      return true;
    });

    let faturasFinaisLista = mostrarTodos ? faturasDoCliente : faturasPendentes;

    if (faturasFinaisLista.length === 0) {
      return res.json({
        mensagem: mostrarTodos ? 'Nenhuma fatura encontrada.' : 'Cliente não possui faturas em aberto.',
        tipo: 'sem_faturas', cliente: dadosCliente ? { nome: dadosCliente.nome_razaosocial, cpf_cnpj: dadosCliente.cpf_cnpj } : null,
        cliente_detalhes: dadosCliente || null, faturas: [], faturasPagas: faturasPagas, faturasEmAberto: [],
        dadosServico: dadosCliente?.servico_detalhes || null, todosServicos: [],
        statusCliente: dadosCliente?.servico_detalhes?.status || 'Status não disponível',
        totalFaturas: faturasDoCliente.length, totalFaturasPagas: faturasPagas.length, totalFaturasPendentes: faturasPendentes.length,
        resumo: { total: faturasDoCliente.length, pagas: faturasPagas.length, pendentes: faturasPendentes.length, vencidas: faturasVencidas.length, em_aberto: faturasEmAberto.length },
      });
    }

    const dadosServico = dadosCliente?.servico_detalhes || extrairDadosServico(faturasDoCliente);
    const todosServicos = extrairTodosServicos(faturasDoCliente);

    const faturasFinais = faturasFinaisLista.map((f) => {
      const estaPaga = isFaturaPaga(f);
      let statusFatura = 'Pendente', statusDescricao = 'Aguardando pagamento';
      if (estaPaga) { statusFatura = 'Pago'; statusDescricao = 'Pagamento confirmado'; }
      else if (f.data_vencimento) {
        const d = new Date(f.data_vencimento); d.setHours(0,0,0,0);
        if (d < hoje) { statusFatura = 'Vencido'; statusDescricao = 'Fatura vencida'; }
        else {
          const diffDays = Math.ceil((d - hoje) / (1000 * 60 * 60 * 24));
          statusFatura = diffDays <= 3 ? 'Próximo ao vencimento' : 'A vencer';
          statusDescricao = `Vence em ${diffDays} dias`;
        }
      }
      const servicoDaFatura = f.servico || f.cliente?.servico || null;
      const detalhamento = Array.isArray(f.cobrancas) ? f.cobrancas : Array.isArray(f.detalhamento) ? f.detalhamento : [];
      let servicoMapeado = null;

      if (servicoDaFatura) {
        servicoMapeado = {
          id_cliente_servico: servicoDaFatura.id_cliente_servico || servicoDaFatura.uuid_cliente_servico || 'N/A',
          numero_plano: servicoDaFatura.numero_plano || 'N/A',
          nome: servicoDaFatura.descricao || servicoDaFatura.nome || dadosServico?.nome || 'N/A',
          valor: parseFloat(servicoDaFatura.valor || dadosServico?.valor || 0),
          status: formatarStatusServico(servicoDaFatura.servico_status || servicoDaFatura.status || dadosServico?.status || 'Status não informado'),
          status_prefixo: servicoDaFatura.status_prefixo || null,
          tecnologia: servicoDaFatura.tecnologia || dadosServico?.tecnologia || 'Fibra Óptica / Wireless',
          login: servicoDaFatura.login || dadosServico?.login || 'N/A',
          ipv4: servicoDaFatura.ipv4 || dadosServico?.ipv4 || 'N/A',
          mac_addr: servicoDaFatura.mac_addr || dadosServico?.mac_addr || 'N/A',
        };
      } else if (dadosServico) {
        servicoMapeado = {
          id_cliente_servico: dadosServico.id_cliente_servico || 'N/A',
          numero_plano: dadosServico.numero_plano || 'N/A',
          nome: dadosServico.nome || 'N/A',
          valor: parseFloat(dadosServico.valor || 0),
          status: formatarStatusServico(dadosServico.status || 'Status não informado'),
          status_prefixo: dadosServico.status_prefixo || null,
          tecnologia: dadosServico.tecnologia || 'Fibra Óptica / Wireless',
          login: dadosServico.login || 'N/A',
          ipv4: dadosServico.ipv4 || 'N/A',
          mac_addr: dadosServico.mac_addr || 'N/A',
        };
      }
      return {
        id_fatura: f.id_fatura || f.id_cobranca || f.id, valor: parseFloat(f.valor || 0),
        data_vencimento: f.data_vencimento || f.vencimento, data_pagamento: f.data_pagamento || null,
        linha_digitavel: f.linha_digitavel || null, codigo_barras: f.codigo_barras || null,
        pix_copia_e_cola: f.pix_copia_e_cola || f.pix_copia_cola || null, link: f.link || null, nosso_numero: f.nosso_numero || null,
        status: statusFatura, status_descricao: statusDescricao, pago: estaPaga,
        valor_pago: f.valor_pago ? parseFloat(f.valor_pago) : null, forma_cobranca: f.forma_cobranca?.descricao || null,
        cliente: { nome: f.cliente?.nome_razaosocial || dadosCliente?.nome_razaosocial || 'Cliente', cpf_cnpj: f.cliente?.cpf_cnpj || dadosCliente?.cpf_cnpj || cpfDigitadoLimpo, servico: servicoMapeado },
        detalhamento: detalhamento.map(item => ({ id_cobranca: item.id_cobranca || item.id || null, descricao: item.descricao || 'Item', valor: parseFloat(item.valor || item.valor_original || 0), status: item.status || 'Aguardando' })),
        id_cliente_servico: servicoMapeado?.id_cliente_servico || 'N/A', nome_servico: servicoMapeado?.nome || 'N/A', status_servico: servicoMapeado?.status || 'N/A',
      };
    });

    return res.json({
      faturas: faturasFinais,
      faturasPagas: faturasPagas.map(f => ({ id_fatura: f.id_fatura, valor: parseFloat(f.valor || 0), valor_pago: f.valor_pago ? parseFloat(f.valor_pago) : null, data_vencimento: f.data_vencimento, data_pagamento: f.data_pagamento, status: 'Pago', quitado: true, linha_digitavel: f.linha_digitavel || null, codigo_barras: f.codigo_barras || null, pix_copia_e_cola: f.pix_copia_e_cola || null, nosso_numero: f.nosso_numero, link: f.link || null })),
      faturasEmAberto: faturasEmAberto.map(f => ({ id_fatura: f.id_fatura, valor: parseFloat(f.valor || 0), data_vencimento: f.data_vencimento, status: 'Em aberto', quitado: false, linha_digitavel: f.linha_digitavel || null, codigo_barras: f.codigo_barras || null, pix_copia_e_cola: f.pix_copia_e_cola || null, nosso_numero: f.nosso_numero, link: f.link || null })),
      cliente_detalhes: dadosCliente || null, dadosServico: dadosServico, todosServicos: todosServicos,
      statusCliente: dadosServico?.status || 'Status não disponível',
      totalFaturas: faturasDoCliente.length, totalFaturasPagas: faturasPagas.length, totalFaturasPendentes: faturasPendentes.length, totalFaturasVencidas: faturasVencidas.length,
      resumo: { total: faturasDoCliente.length, pagas: faturasPagas.length, pendentes: faturasPendentes.length, vencidas: faturasVencidas.length, em_aberto: faturasEmAberto.length },
    });

  } catch (error) {
    console.error(' Erro na consulta:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const mensagem = error.response?.data?.msg || error.response?.data?.message || error.message || 'Erro ao consultar faturas.';
    return res.status(statusCode).json({ error: mensagem });
  }
});

async function hubsoftPost(pathname, body = {}) {
  const token = await getHubsoftToken();
  try {
    return (await axios.post(`${hubsoftBaseUrl()}${pathname}`, body, {
      headers: { ...hubsoftHeaders(token), 'Content-Type': 'application/json' },
      timeout: HUBSOFT_TIMEOUT_MS,
    })).data;
  } catch (error) {
    throw hubsoftError(error);
  }
}

// ============================================
// 7. ROTAS PROXY HUBSOFT
// ============================================
const CLIENT_PARAMS = ['busca', 'termo_busca', 'limit', 'inativo', 'cancelado', 'ultima_conexao', 'incluir_alarmes', 'incluir_contrato'];
const CLIENT_ALL_PARAMS = ['pagina', 'itens_por_pagina', 'data_inicio', 'data_fim', 'cancelado', 'possui_pacote', 'codigo_pacote', 'servico_status', 'relacoes'];
const ATTENDANCE_PARAMS = ['pagina', 'itens_por_pagina', 'data_inicio', 'data_fim', 'relacoes'];
const OS_PARAMS = ['pagina', 'itens_por_pagina', 'data_inicio', 'data_fim', 'tipo_data', 'relacoes'];

app.get('/api/hubsoft/cliente', async (req, res) => {
  try {
    const data = await hubsoftGet('/api/v1/integracao/cliente', queryParams(req, CLIENT_PARAMS));
    return res.json(data);
  } catch (error) { return sendHubsoftError(res, error); }
});

app.get('/api/hubsoft/clientes', async (req, res) => {
  try {
    const data = await hubsoftGet('/api/v1/integracao/cliente/todos', queryParams(req, CLIENT_ALL_PARAMS));
    return res.json(data);
  } catch (error) { return sendHubsoftError(res, error); }
});

app.get('/api/hubsoft/atendimentos', async (req, res) => {
  try {
    const data = await hubsoftGet('/api/v1/integracao/atendimento/todos', queryParams(req, ATTENDANCE_PARAMS));
    return res.json(data);
  } catch (error) { return sendHubsoftError(res, error); }
});

app.get('/api/hubsoft/ordens-servico', async (req, res) => {
  try {
    const data = await hubsoftGet('/api/v1/integracao/ordem_servico/todos', queryParams(req, OS_PARAMS));
    return res.json(data);
  } catch (error) { return sendHubsoftError(res, error); }
});

app.get('/api/hubsoft/vendedores', async (req, res) => {
  try {
    return res.json(await hubsoftGet('/api/v1/integracao/configuracao/vendedor'));
  } catch (error) { return sendHubsoftError(res, error); }
});

app.get('/api/hubsoft/grupos', async (req, res) => {
  try {
    return res.json(await hubsoftGet('/api/v1/integracao/configuracao/grupo_cliente_servico'));
  } catch (error) { return sendHubsoftError(res, error); }
});

app.get('/api/hubsoft/cliente-completo', async (req, res) => {
  try {
    const params = queryParams(req, CLIENT_PARAMS);
    const data = await hubsoftGet('/api/v1/integracao/cliente', params);
    const clientes = Array.isArray(data?.clientes) ? data.clientes : [];
    return res.json({ ...data, clientes: clientes.map(cliente => ({
      ...cliente,
      servicos: (cliente.servicos || []).map(servico => ({
        ...servico,
        endereco_instalacao: servico.endereco_instalacao || null,
        grupos: servico.grupos || [],
      })),
    })) });
  } catch (error) { return sendHubsoftError(res, error); }
});

// ============================================
// 8. DASHBOARD DO CLIENTE
// ============================================
app.post('/api/app/dashboard', async (req, res) => {
  const cliente = req.body?.cliente || req.body || {};
  const codigoCliente = cliente.codigo_cliente || req.body?.codigo_cliente;
  const cpfCnpj = cliente.cpf_cnpj || req.body?.cpf_cnpj;
  const idClienteServico = cliente.id_cliente_servico || req.body?.id_cliente_servico;

  if (!codigoCliente && !cpfCnpj && !idClienteServico) {
    return res.status(400).json({
      error: 'Informe codigo_cliente, cpf_cnpj ou id_cliente_servico para carregar o dashboard.',
    });
  }

  const hoje = new Date();
  const inicio = new Date();
  inicio.setFullYear(inicio.getFullYear() - 1);
  const iso = (date) => date.toISOString().slice(0, 10);

  try {
    const busca = codigoCliente ? 'codigo_cliente' : cpfCnpj ? 'cpf_cnpj' : 'id_cliente_servico';
    const termoBusca = codigoCliente || cpfCnpj || idClienteServico;

    const cadastro = await hubsoftGet('/api/v1/integracao/cliente', {
      busca,
      termo_busca: termoBusca,
      limit: 5,
      inativo: 'nao',
      cancelado: 'nao',
      ultima_conexao: 'sim',
      incluir_alarmes: 'sim',
      incluir_contrato: 'sim',
      relacoes: 'servicos,contratos,velocidade,ultima_conexao,endereco_instalacao',
    });

    const cadastroSeguro = sanitizarDadosCliente(cadastro);
    const clienteHubsoft = cadastroSeguro?.clientes?.[0] || null;
    const codigoParaAtendimento = clienteHubsoft?.codigo_cliente || codigoCliente;
    const filtroAtendimento = codigoParaAtendimento
      ? { busca: 'codigo_cliente', termo_busca: codigoParaAtendimento }
      : { busca, termo_busca: termoBusca };

    const atendimentos = await hubsoftGet('/api/v1/integracao/cliente/atendimento', {
      ...filtroAtendimento,
      limit: 50,
      apenas_pendente: req.body?.apenas_pendente || 'nao',
      order_by: 'data_cadastro',
      order_type: 'desc',
      ...(req.body?.data_inicio ? { data_inicio: req.body.data_inicio } : {}),
      ...(req.body?.data_fim ? { data_fim: req.body.data_fim } : {}),
    });

    let ordens = { status: 'success', ordens_servico: [] };
    try {
      const nomeOuCodigo = clienteHubsoft?.nome_razaosocial || String(codigoParaAtendimento || termoBusca);
      const respostaOrdens = await hubsoftPost('/api/v1/integracao/ordem_servico/consultar', {
        consulta: nomeOuCodigo,
        data_inicio: req.body?.data_inicio || iso(inicio),
        data_fim: req.body?.data_fim || iso(hoje),
        tipo_data: req.body?.tipo_data || 'data_cadastro',
        order_by: 'data_cadastro',
        order_by_key: 'desc',
      });
      ordens = respostaOrdens || ordens;
    } catch (error) {
      console.warn('Aviso: não foi possível carregar ordens de serviço:', error.message);
    }

    const servicoRef =
      (clienteHubsoft?.servicos || []).find((s) => s.endereco_instalacao) ||
      (clienteHubsoft?.servicos || []).find((s) => s.endereco_cadastral) ||
      clienteHubsoft?.servicos?.[0];

    const endereco = normalizarEndereco(
      servicoRef?.endereco_instalacao ||
      servicoRef?.endereco_cadastral ||
      servicoRef?.endereco_cobranca
    );

    return res.json({
      status: 'success',
      cliente: clienteHubsoft,
      dados: cadastroSeguro,
      servicos: clienteHubsoft?.servicos || [],
      endereco,
      atendimentos,
      ordens_servico: ordens,
      ordensServico: ordens,
    });
  } catch (error) {
    return sendHubsoftError(res, error);
  }
});

// ============================================
// 9. ROTAS FINAIS
// ============================================
app.get('/api/health', (req, res) =>
  res.json({
    status: 'OK',
    message: 'Servidor está rodando!',
    hubsoft: Boolean(process.env.HUBSOFT_BASE_URL),
    geosite: Boolean(process.env.GEOSITE_USERNAME && process.env.GEOSITE_PASSWORD),
  })
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) res.status(200).send('Servidor rodando! Acesse /api/health para testar.');
  });
});
// ============================================
// 10. ROTA DE DESBLOQUEIO EM CONFIANÇA (NOVA)
// ============================================
app.post('/api/app/desbloqueio-confianca', async (req, res) => {
  const { id_cliente_servico, dias_desbloqueio = 1 } = req.body;

  if (!Number.isInteger(Number(id_cliente_servico)) || Number(id_cliente_servico) <= 0) {
    return res.status(400).json({
      status: 'error',
      error: 'ID do serviço inválido.',
    });
  }

  const dias = Number(dias_desbloqueio);

  if (!Number.isInteger(dias) || dias < 1 || dias > 3) {
    return res.status(400).json({
      status: 'error',
      error: 'A quantidade de dias deve estar entre 1 e 3.',
    });
  }

  try {
    const resposta = await hubsoftPost(
      '/api/v1/integracao/cliente/desbloqueio_confianca',
      {
        id_cliente_servico: Number(id_cliente_servico),
        dias_desbloqueio: dias,
      }
    );

    return res.json(resposta);
  } catch (error) {
    return sendHubsoftError(res, error);
  }
});

app.listen(PORT, () => {
  console.log(` Servidor backend pronto e rodando na porta ${PORT}`);
  console.log(` Teste: http://localhost:${PORT}/api/health`);
  console.log(`\n Rotas GeoSite:`);
  console.log(`   POST /api/viabilidade - Consulta caixas via GeoSite`);
});