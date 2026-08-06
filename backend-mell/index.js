require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ============================================
// 1. AUTENTICAÇÃO
// ============================================
async function getHubsoftToken() {
  const baseUrl = process.env.HUBSOFT_BASE_URL?.replace(/\/$/, '') || '';
  const tokenUrl = `${baseUrl}/oauth/token`;

  const payload = {
    grant_type: 'password',
    client_id: process.env.HUBSOFT_CLIENT_ID?.trim(),
    client_secret: process.env.HUBSOFT_CLIENT_SECRET?.trim(),
    username: process.env.HUBSOFT_USERNAME?.trim(),
    password: process.env.HUBSOFT_PASSWORD?.trim(),
  };

  try {
    const response = await axios.post(tokenUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.access_token;
  } catch (error) {
    console.error(' Erro na Autenticação HubSoft:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com a HubSoft.');
  }
}

// ============================================
// 2. FUNÇÕES AUXILIARES
// ============================================

function formatarStatusServico(status) {
  if (!status) return 'Status não disponível';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('suspenso')) {
    return 'Suspenso por Débito';
  }
  if (statusLower.includes('habilitado') || statusLower.includes('ativo')) {
    return 'Serviço Habilitado';
  }
  if (statusLower.includes('cancelado') || statusLower.includes('inativo')) {
    return 'Serviço Cancelado';
  }
  if (statusLower.includes('teste')) {
    return 'Serviço em Teste';
  }
  if (statusLower.includes('bloqueado')) {
    return 'Serviço Bloqueado';
  }
  if (statusLower.includes('pendente')) {
    return 'Pendente de Ativação';
  }
  if (statusLower.includes('spc')) {
    return 'Status SPC';
  }
  
  return status;
}

function isFaturaPaga(fatura) {
  if (fatura.data_pagamento && fatura.data_pagamento !== null && fatura.data_pagamento !== '' && fatura.data_pagamento !== 'null') {
    return true;
  }

  if (fatura.valor_pago !== null && fatura.valor_pago !== undefined && fatura.valor_pago !== '') {
    const valorPago = parseFloat(fatura.valor_pago);
    if (valorPago > 0) return true;
  }

  if (fatura.quitado !== undefined) {
    if (fatura.quitado === true || fatura.quitado === 'true' || fatura.quitado === 1 || fatura.quitado === 'sim') {
      return true;
    }
  }

  if (fatura.pago !== undefined) {
    if (fatura.pago === true || fatura.pago === 'true' || fatura.pago === 1 || fatura.pago === 'sim') {
      return true;
    }
  }

  if (fatura.status) {
    const statusLower = String(fatura.status).toLowerCase();
    const statusPago = ['pago', 'quitado', 'baixa', 'paga', 'confirmado', 'liquidado'];
    if (statusPago.some(word => statusLower.includes(word))) return true;
    if (statusLower.includes('vencido') || statusLower.includes('pendente') || statusLower.includes('aguardando')) {
      return false;
    }
  }

  if (fatura.recibos && Array.isArray(fatura.recibos) && fatura.recibos.length > 0) return true;

  if (fatura.cobrancas && Array.isArray(fatura.cobrancas)) {
    const temPago = fatura.cobrancas.some(item => {
      const statusItem = String(item.status || '').toLowerCase();
      return statusItem.includes('pago') || statusItem.includes('quitado') || statusItem.includes('baixa') || statusItem.includes('liquidado');
    });
    if (temPago) return true;
  }

  if (fatura.data_credito && fatura.data_credito !== null && fatura.data_credito !== '' && fatura.data_credito !== 'null') {
    return true;
  }

  return false;
}

function obterCpfDoClienteDaFatura(fatura) {
  const possiveisCampos = [
    fatura?.cliente?.cpf_cnpj,
    fatura?.cliente?.cpf,
    fatura?.cliente?.cnpj,
  ];

  for (const campo of possiveisCampos) {
    if (campo) {
      const apenasNumeros = String(campo).replace(/\D/g, '');
      if (apenasNumeros.length > 0) {
        return apenasNumeros;
      }
    }
  }
  return null;
}

// Buscar dados do cliente
async function buscarDadosCliente(token, baseUrl, cpfLimpo) {
  try {
    console.log(' Buscando dados do cliente...');
    const response = await axios.get(
      `${baseUrl}/api/v1/integracao/cliente/detalhes`,
      {
        params: {
          busca: 'cpf_cnpj',
          termo_busca: cpfLimpo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
          senha: servicoInfo.senha || 'N/A',
          ipv4: servicoInfo.ipv4 || 'N/A',
          mac_addr: servicoInfo.mac_addr || 'N/A',
          referencia: servicoInfo.referencia || null,
          endereco_cadastral: servicoInfo.endereco_cadastral?.completo || null,
          endereco_instalacao: servicoInfo.endereco_instalacao?.completo || null,
          endereco_cobranca: servicoInfo.endereco_cobranca?.completo || null,
          ultima_conexao: servicoInfo.ultima_conexao?.conectado || false,
          ultima_conexao_data: servicoInfo.ultima_conexao?.ultima_conexao || null,
          equipamento_conexao: servicoInfo.equipamento_conexao?.nome || null,
          equipamento_roteamento: servicoInfo.equipamento_roteamento?.nome || null,
        } : null
      };
    }
    return null;
  } catch (error) {
    console.log(` Cliente não encontrado: ${error.message}`);
    return null;
  }
}

// Extrair serviços das faturas
function extrairTodosServicos(faturas) {
  const servicosMap = new Map();

  faturas.forEach(f => {
    const servico = f.servico || f.cliente?.servico || null;

    if (servico) {
      const key = servico.id_cliente_servico || servico.uuid_cliente_servico || servico.nome || 'servico';

      if (!servicosMap.has(key)) {
        const statusFormatado = formatarStatusServico(servico.status || servico.servico_status);
        servicosMap.set(key, {
          id_cliente_servico: servico.id_cliente_servico || servico.uuid_cliente_servico || 'N/A',
          numero_plano: servico.numero_plano || 'N/A',
          nome: servico.descricao || servico.nome || 'N/A',
          valor: parseFloat(servico.valor || 0),
          status: statusFormatado,
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

  let servicoAtivo = todos.find(s =>
    s.status?.toLowerCase().includes('habilitado') ||
    s.status?.toLowerCase().includes('vigência') ||
    s.status?.toLowerCase().includes('ativo')
  );

  if (!servicoAtivo && todos.length > 0) {
    servicoAtivo = todos[0];
  }

  return servicoAtivo || null;
}

// ============================================
// 3. BUSCA DE FATURAS (COM FILTROS DA API)
// ============================================

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

  return {
    data_inicio: formatarData(dataInicio),
    data_fim: formatarData(dataFim),
  };
}

async function buscarFaturasCliente(token, baseUrl, cpfLimpo) {
  try {
    console.log(' Buscando faturas do cliente...');

    const periodo = gerarPeriodoDatas();
    console.log(`   Período: ${periodo.data_inicio} a ${periodo.data_fim}`);

    let faturasPagas = [];
    let faturasEmAberto = [];
    let todasFaturas = [];

    // ============================================================
    // BUSCA 1: Faturas PAGAS (apenas_quitado=sim)
    // ============================================================
    try {
      console.log('   Buscando faturas pagas (apenas_quitado=sim, exibir_fatura_inativa=nao)...');
      const responsePagas = await axios.get(
        `${baseUrl}/api/v1/integracao/financeiro/fatura`,
        {
          params: {
            busca: 'cpf_cnpj',
            termo_busca: cpfLimpo,
            apenas_quitado: 'sim',
            exibir_fatura_inativa: 'nao', // CRUCIAL: Exclui faturas inativas/canceladas
            tipo_data: 'data_vencimento',
            data_inicio: periodo.data_inicio,
            data_fim: periodo.data_fim,
            exibir_pix_copia_cola: 'sim',
            exibir_faturas_renegociacao: 'sim',
            valor_zerado: 'sim',
            itens_por_pagina: 500,
            pagina: 0,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      faturasPagas = responsePagas.data?.faturas || [];
      console.log(`   ✅ Faturas pagas encontradas: ${faturasPagas.length}`);
    } catch (error) {
      console.log(`   Erro ao buscar faturas pagas: ${error.message}`);
    }

    // ============================================================
    // BUSCA 2: Faturas EM ABERTO (apenas_em_aberto=sim)
    // ============================================================
    try {
      console.log('   Buscando faturas em aberto (apenas_em_aberto=sim, exibir_fatura_inativa=nao)...');
      const responseAberto = await axios.get(
        `${baseUrl}/api/v1/integracao/financeiro/fatura`,
        {
          params: {
            busca: 'cpf_cnpj',
            termo_busca: cpfLimpo,
            apenas_em_aberto: 'sim',
            exibir_fatura_inativa: 'nao', // CRUCIAL: Exclui faturas inativas/canceladas
            tipo_data: 'data_vencimento',
            data_inicio: periodo.data_inicio,
            data_fim: periodo.data_fim,
            exibir_pix_copia_cola: 'sim',
            exibir_faturas_renegociacao: 'sim',
            valor_zerado: 'sim',
            itens_por_pagina: 500,
            pagina: 0,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      faturasEmAberto = responseAberto.data?.faturas || [];
      console.log(`   ✅ Faturas em aberto encontradas: ${faturasEmAberto.length}`);

    } catch (error) {
      console.log(`   Erro ao buscar faturas em aberto: ${error.message}`);
    }

    // ============================================================
    // COMBINAR RESULTADOS (sem duplicatas)
    // ============================================================
    const idsPagas = new Set(faturasPagas.map(f => f.id_fatura));
    todasFaturas = [...faturasPagas];
    
    faturasEmAberto.forEach(f => {
      if (!idsPagas.has(f.id_fatura)) {
        todasFaturas.push(f);
      }
    });

    // ============================================================
    // FALLBACK: Se não encontrou nada, buscar sem filtros
    // (apenas se ambas as buscas retornaram vazio)
    // ============================================================
    if (todasFaturas.length === 0) {
      console.log('   ⚠️ Nenhuma fatura encontrada com os filtros. Buscando sem filtros como fallback...');
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/integracao/financeiro/fatura`,
          {
            params: {
              busca: 'cpf_cnpj',
              termo_busca: cpfLimpo,
              tipo_data: 'data_vencimento',
              data_inicio: periodo.data_inicio,
              data_fim: periodo.data_fim,
              exibir_pix_copia_cola: 'sim',
              exibir_fatura_inativa: 'sim',
              exibir_faturas_renegociacao: 'sim',
              valor_zerado: 'sim',
              itens_por_pagina: 500,
              pagina: 0,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const faturasFallback = response.data?.faturas || [];
        console.log(`   📊 Fallback encontrou: ${faturasFallback.length} faturas`);
        
        // Filtrar manualmente as faturas inativas
        todasFaturas = faturasFallback.filter(f => {
          const servico = f.servico || f.cliente?.servico || null;
          if (!servico) return true;
          
          const status = String(servico.status || '').toLowerCase();
          const statusInativo = ['cancelado', 'inativo', 'desabilitado'];
          const ehInativo = statusInativo.some(s => status.includes(s));
          
          if (ehInativo) {
            console.log(`   🚫 Fatura ${f.id_fatura} ignorada (fallback) - Serviço cancelado/inativo`);
            return false;
          }
          return true;
        });
        
        console.log(`   📊 Total após filtro manual: ${todasFaturas.length}`);
        
      } catch (error) {
        console.log(`   Erro no fallback: ${error.message}`);
      }
    }

    console.log(`   📊 Total de faturas (pagas + em aberto): ${todasFaturas.length}`);
    console.log(`   📊 Faturas pagas: ${faturasPagas.length}`);
    console.log(`   📊 Faturas em aberto: ${faturasEmAberto.length}`);

    return {
      todas: todasFaturas,
      pagas: faturasPagas,
      emAberto: faturasEmAberto,
    };
  } catch (error) {
    console.error(' Erro ao buscar faturas:', error.message);
    return { todas: [], pagas: [], emAberto: [] };
  }
}

// ============================================
// 4. ROTA PRINCIPAL
// ============================================

app.post('/api/consultar-boleto', async (req, res) => {
  console.log(' Requisição recebida:', req.body);

  try {
    const { cpfCnpj, mostrarTodos } = req.body;

    if (!cpfCnpj) {
      return res.status(400).json({ error: 'Informe um CPF ou CNPJ válido.' });
    }

    const cpfDigitadoLimpo = String(cpfCnpj).replace(/\D/g, '');
    console.log(` Buscando CPF: ${cpfDigitadoLimpo}`);

    const baseUrl = process.env.HUBSOFT_BASE_URL?.replace(/\/$/, '') || '';
    const token = await getHubsoftToken();

    const dadosCliente = await buscarDadosCliente(token, baseUrl, cpfDigitadoLimpo);
    const resultado = await buscarFaturasCliente(token, baseUrl, cpfDigitadoLimpo);
    const todasFaturas = resultado.todas;

    // Verificar se tem faturas
    if (todasFaturas.length === 0) {
      if (dadosCliente) {
        return res.json({
          mensagem: 'Cliente não possui faturas em aberto ou pagas.',
          tipo: 'sem_faturas',
          cliente: {
            nome: dadosCliente.nome_razaosocial || 'Cliente',
            cpf_cnpj: dadosCliente.cpf_cnpj || cpfDigitadoLimpo,
          },
          cliente_detalhes: dadosCliente,
          faturas: [],
          faturasPagas: [],
          faturasEmAberto: [],
          dadosServico: dadosCliente.servico_detalhes || null,
          todosServicos: [],
          statusCliente: dadosCliente.servico_detalhes?.status || 'Status não disponível',
          totalFaturas: 0,
          totalFaturasPagas: 0,
          totalFaturasPendentes: 0,
          resumo: { total: 0, pagas: 0, pendentes: 0, vencidas: 0, em_aberto: 0 },
        });
      }
      return res.status(404).json({
        error: 'CPF/CNPJ não encontrado na base de dados.',
      });
    }

    // Filtrar faturas do cliente específico
    let faturasDoCliente = todasFaturas;

    if (dadosCliente) {
      const cpfCliente = dadosCliente.cpf_cnpj?.replace(/\D/g, '');
      if (cpfCliente) {
        const filtradas = todasFaturas.filter(f => {
          const cpfFatura = obterCpfDoClienteDaFatura(f);
          return cpfFatura === cpfCliente;
        });
        if (filtradas.length > 0) {
          faturasDoCliente = filtradas;
        }
      }
    }

    console.log(` ${faturasDoCliente.length} faturas do cliente`);

    // Separar pagas e pendentes
    const faturasPagas = faturasDoCliente.filter(f => isFaturaPaga(f));
    const faturasPendentes = faturasDoCliente.filter(f => !isFaturaPaga(f));

    // Classificar pendentes
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const faturasVencidas = faturasPendentes.filter(f => {
      if (f.data_vencimento) {
        const dataVenc = new Date(f.data_vencimento);
        dataVenc.setHours(0, 0, 0, 0);
        return dataVenc < hoje;
      }
      return false;
    });

    const faturasEmAberto = faturasPendentes.filter(f => {
      if (f.data_vencimento) {
        const dataVenc = new Date(f.data_vencimento);
        dataVenc.setHours(0, 0, 0, 0);
        return dataVenc >= hoje;
      }
      return true;
    });

    // Determinar quais faturas enviar
    let faturasFinaisLista;
    if (mostrarTodos) {
      faturasFinaisLista = faturasDoCliente;
      console.log(` Exibindo TODAS as ${faturasFinaisLista.length} faturas (pagas + pendentes)`);
    } else {
      faturasFinaisLista = faturasPendentes;
      console.log(` Exibindo apenas ${faturasFinaisLista.length} faturas pendentes`);
    }

    // Se não tem faturas para exibir
    if (faturasFinaisLista.length === 0) {
      return res.json({
        mensagem: mostrarTodos
          ? 'Nenhuma fatura encontrada para este CPF.'
          : 'Cliente não possui faturas em aberto.',
        tipo: 'sem_faturas',
        cliente: dadosCliente ? {
          nome: dadosCliente.nome_razaosocial || 'Cliente',
          cpf_cnpj: dadosCliente.cpf_cnpj || cpfDigitadoLimpo,
        } : null,
        cliente_detalhes: dadosCliente || null,
        faturas: [],
        faturasPagas: faturasPagas,
        faturasEmAberto: [],
        dadosServico: dadosCliente?.servico_detalhes || null,
        todosServicos: [],
        statusCliente: dadosCliente?.servico_detalhes?.status || 'Status não disponível',
        totalFaturas: faturasDoCliente.length,
        totalFaturasPagas: faturasPagas.length,
        totalFaturasPendentes: faturasPendentes.length,
        resumo: {
          total: faturasDoCliente.length,
          pagas: faturasPagas.length,
          pendentes: faturasPendentes.length,
          vencidas: faturasVencidas.length,
          em_aberto: faturasEmAberto.length,
        },
      });
    }

    // Extrair serviços
    const dadosServico = dadosCliente?.servico_detalhes || extrairDadosServico(faturasDoCliente);
    const todosServicos = extrairTodosServicos(faturasDoCliente);

    // Processar cada fatura
    const faturasFinais = faturasFinaisLista.map((f) => {
      const estaPaga = isFaturaPaga(f);

      let statusFatura = 'Pendente';
      let statusDescricao = 'Aguardando pagamento';

      if (estaPaga) {
        statusFatura = 'Pago';
        statusDescricao = 'Pagamento confirmado';
      } else if (f.data_vencimento) {
        const dataVenc = new Date(f.data_vencimento);
        dataVenc.setHours(0, 0, 0, 0);
        if (dataVenc < hoje) {
          statusFatura = 'Vencido';
          statusDescricao = 'Fatura vencida';
        } else {
          const diffDays = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));
          statusFatura = diffDays <= 3 ? 'Próximo ao vencimento' : 'A vencer';
          statusDescricao = `Vence em ${diffDays} dias`;
        }
      }

      const servicoDaFatura = f.servico || f.cliente?.servico || null;
      const detalhamento = Array.isArray(f.cobrancas) ? f.cobrancas :
        Array.isArray(f.detalhamento) ? f.detalhamento : [];

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
        id_fatura: f.id_fatura || f.id_cobranca || f.id,
        valor: parseFloat(f.valor || 0),
        data_vencimento: f.data_vencimento || f.vencimento,
        data_pagamento: f.data_pagamento || null,
        linha_digitavel: f.linha_digitavel || null,
        codigo_barras: f.codigo_barras || null,
        pix_copia_e_cola: f.pix_copia_e_cola || f.pix_copia_cola || null,
        link: f.link || null,
        nosso_numero: f.nosso_numero || null,
        status: statusFatura,
        status_descricao: statusDescricao,
        pago: estaPaga,
        valor_pago: f.valor_pago ? parseFloat(f.valor_pago) : null,
        forma_cobranca: f.forma_cobranca?.descricao || null,
        cliente: {
          nome: f.cliente?.nome_razaosocial || dadosCliente?.nome_razaosocial || 'Cliente',
          cpf_cnpj: f.cliente?.cpf_cnpj || dadosCliente?.cpf_cnpj || cpfDigitadoLimpo,
          servico: servicoMapeado,
        },
        detalhamento: detalhamento.map(item => ({
          id_cobranca: item.id_cobranca || item.id || null,
          descricao: item.descricao || 'Item',
          valor: parseFloat(item.valor || item.valor_original || 0),
          status: item.status || 'Aguardando',
        })),
        id_cliente_servico: servicoMapeado?.id_cliente_servico || 'N/A',
        nome_servico: servicoMapeado?.nome || 'N/A',
        status_servico: servicoMapeado?.status || 'N/A',
      };
    });

    console.log(` ${faturasFinais.length} faturas processadas e enviadas`);

    // Retornar resposta enriquecida
    return res.json({
      faturas: faturasFinais,
      faturasPagas: faturasPagas.map(f => ({
        id_fatura: f.id_fatura,
        valor: parseFloat(f.valor || 0),
        valor_pago: f.valor_pago ? parseFloat(f.valor_pago) : null,
        data_vencimento: f.data_vencimento,
        data_pagamento: f.data_pagamento,
        status: 'Pago',
        quitado: true,
        linha_digitavel: f.linha_digitavel || null,
        codigo_barras: f.codigo_barras || null,
        pix_copia_e_cola: f.pix_copia_e_cola || null,
        nosso_numero: f.nosso_numero,
        link: f.link || null,
      })),
      faturasEmAberto: faturasEmAberto.map(f => ({
        id_fatura: f.id_fatura,
        valor: parseFloat(f.valor || 0),
        data_vencimento: f.data_vencimento,
        status: 'Em aberto',
        quitado: false,
        linha_digitavel: f.linha_digitavel || null,
        codigo_barras: f.codigo_barras || null,
        pix_copia_e_cola: f.pix_copia_e_cola || null,
        nosso_numero: f.nosso_numero,
        link: f.link || null,
      })),
      cliente_detalhes: dadosCliente || null,
      dadosServico: dadosServico,
      todosServicos: todosServicos,
      statusCliente: dadosServico?.status || 'Status não disponível',
      totalFaturas: faturasDoCliente.length,
      totalFaturasPagas: faturasPagas.length,
      totalFaturasPendentes: faturasPendentes.length,
      totalFaturasVencidas: faturasVencidas.length,
      resumo: {
        total: faturasDoCliente.length,
        pagas: faturasPagas.length,
        pendentes: faturasPendentes.length,
        vencidas: faturasVencidas.length,
        em_aberto: faturasEmAberto.length,
      },
    });

  } catch (error) {
    console.error(' Erro na consulta:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    const mensagem = error.response?.data?.msg || error.response?.data?.message || error.message || 'Erro ao consultar faturas.';
    return res.status(statusCode).json({ error: mensagem });
  }
});

// ============================================
// 5. ROTA DE SAÚDE
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor está rodando!' });
});

// ============================================
// 6. INICIALIZAÇÃO
// ============================================

app.listen(PORT, () => {
  console.log(` Servidor backend pronto e rodando na porta ${PORT}`);
  console.log(` Teste: http://localhost:${PORT}/api/health`);
});