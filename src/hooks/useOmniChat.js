import { useEffect, useRef } from 'react';

export const useOmniChat = (clienteLogado) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    // 1. Configura a fila e o domínio
    window.omniChatQueueId = 75;
    window.omniChatDomain = 'mellinternet.atenderbem.com';

    // 2. Cria e injeta o script
    const script = document.createElement('script');
    script.type = 'module';
    script.async = true;
    script.src = 'https://wc.a-tend.online/omnichat.min.js';
    
    // 3. Callback quando o script carregar
    script.onload = () => {
      scriptLoaded.current = true;
      
      const bootOmniChat = () => {
        if (!window.omniChat || !window.omniChat.configLoaded) {
          return setTimeout(bootOmniChat, 50);
        }

        // Se o cliente estiver logado, passa os dados para o chat
        if (clienteLogado) {
          window.omniChat.clientId = String(clienteLogado.id_cliente);
          window.omniChat.clientName = clienteLogado.nome_razaosocial;
          window.omniChat.clientData = JSON.stringify({
            plano: clienteLogado.servico_detalhes?.nome || 'Não informado'
          });
        }

        // Inicializa o chat
        window.omniChat.initialize();
        
        // Esconde o botão nativo do OmniChat (já que usamos o nosso)
        setTimeout(() => {
            if (window.omniChat) window.omniChat.hide();
        }, 1000);
      };

      bootOmniChat();
    };

    document.head.appendChild(script);

    return () => {
      // Limpeza opcional se necessário
    };
  }, [clienteLogado]);
};