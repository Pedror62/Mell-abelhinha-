require('dotenv').config();
const axios = require('axios');

async function testarFluxoCompleto() {
  console.log('--- TESTANDO AUTENTICAÇÃO E CONSULTA HUBSOFT ---');

  const baseUrl = process.env.HUBSOFT_BASE_URL.replace(/\/$/, '');
  const tokenUrl = `${baseUrl}/oauth/token`;

  try {
    // 1. Gera o Token
    console.log('1. Autenticando para obter o Token Bearer...');
    const authRes = await axios.post(tokenUrl, {
      grant_type: 'password',
      client_id: process.env.HUBSOFT_CLIENT_ID?.trim(),
      client_secret: process.env.HUBSOFT_CLIENT_SECRET?.trim(),
      username: process.env.HUBSOFT_USERNAME?.trim(),
      password: process.env.HUBSOFT_PASSWORD?.trim(),
    });

    const token = authRes.data.access_token;
    console.log('✅ Token gerado com sucesso!');

    // 2. Testa a consulta com a rota corrigida (faturas no plural)
    console.log('2. Consultando faturas do cliente...');
    const cpfTeste = '00000000000'; // Substitua por um CPF real cadastrado para testar retorno
    const consultaUrl = `${baseUrl}/api/v1/integracao/cliente/faturas?cpf_cnpj=${cpfTeste}`;

    const faturaRes = await axios.get(consultaUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Consulta realizada com sucesso!');
    console.log('Retorno:', faturaRes.data);

  } catch (err) {
    console.error('\n❌ ERRO NO TESTE:');
    if (err.response) {
      console.error('Status HTTP:', err.response.status);
      console.error('Detalhes:', err.response.data);
    } else {
      console.error('Mensagem:', err.message);
    }
  }
}

testarFluxoCompleto();