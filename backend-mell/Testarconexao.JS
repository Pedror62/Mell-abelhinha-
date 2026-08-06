require('dotenv').config();
const axios = require('axios');

async function tentarAutenticacao(grantType) {
  const baseUrl = process.env.HUBSOFT_BASE_URL ? process.env.HUBSOFT_BASE_URL.replace(/\/$/, '') : '';
  const tokenUrl = `${baseUrl}/oauth/token`;

  const payload = {
    grant_type: grantType,
    client_id: process.env.HUBSOFT_CLIENT_ID?.trim(),
    client_secret: process.env.HUBSOFT_CLIENT_SECRET?.trim(),
  };

  // O grant_type "password" exige usuário/senha; "client_credentials" normalmente não usa esses campos
  if (grantType === 'password') {
    payload.username = process.env.HUBSOFT_USERNAME?.trim();
    payload.password = process.env.HUBSOFT_PASSWORD?.trim();
  }

  console.log(`\n--- Tentando grant_type: "${grantType}" ---`);

  try {
    const res = await axios.post(tokenUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`✅ SUCESSO com "${grantType}"! Token gerado:`, res.data.access_token ? 'OK (Token Ativo)' : 'Vazio');
    return true;
  } catch (err) {
    console.log(`❌ Falhou com "${grantType}"`);
    if (err.response) {
      console.log('Status HTTP:', err.response.status);
      console.log('Detalhes da HubSoft:', err.response.data);
    } else {
      console.log('Mensagem:', err.message);
    }
    return false;
  }
}

async function testarConexao() {
  console.log('--- TESTANDO AUTENTICAÇÃO HUBSOFT ---');

  const baseUrl = process.env.HUBSOFT_BASE_URL ? process.env.HUBSOFT_BASE_URL.replace(/\/$/, '') : '';
  if (!baseUrl) {
    console.error('❌ HUBSOFT_BASE_URL não definida no .env');
    return;
  }

  console.log('URL Final:', `${baseUrl}/oauth/token`);
  console.log('Client ID:', process.env.HUBSOFT_CLIENT_ID);
  console.log('Usuário:', process.env.HUBSOFT_USERNAME);

  const sucessoPassword = await tentarAutenticacao('password');
  if (sucessoPassword) {
    console.log('\n👉 Use grant_type "password" no server.js (já é o padrão).');
    return;
  }

  const sucessoClientCredentials = await tentarAutenticacao('client_credentials');
  if (sucessoClientCredentials) {
    console.log('\n👉 Use grant_type "client_credentials" no server.js. Defina HUBSOFT_GRANT_TYPE=client_credentials no .env.');
    return;
  }

  console.log('\n⚠️  Nenhum dos dois grant_types funcionou. O problema está nas credenciais em si');
  console.log('   (client_id/client_secret revogados ou usuário/senha inválidos), não no código.');
  console.log('   Confirme com o suporte da HubSoft se essas credenciais de API estão ativas.');
}

testarConexao();