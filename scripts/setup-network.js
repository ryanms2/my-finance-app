#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalNetworkIP() {
  const networkInterfaces = os.networkInterfaces();
  
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      // Ignorar loopback e interfaces não IPv4
      if (net.family === 'IPv4' && !net.internal) {
        // Priorizar redes privadas (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
        if (
          net.address.startsWith('192.168.') ||
          net.address.startsWith('10.') ||
          (net.address.startsWith('172.') && 
           parseInt(net.address.split('.')[1]) >= 16 && 
           parseInt(net.address.split('.')[1]) <= 31)
        ) {
          return net.address;
        }
      }
    }
  }
  
  return null;
}

function updateEnvFile(mode) {
  const envPath = path.join(__dirname, '..', '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  let newUrl;
  
  if (mode === 'network') {
    const networkIP = getLocalNetworkIP();
    if (!networkIP) {
      console.error('❌ Não foi possível detectar o IP da rede local');
      process.exit(1);
    }
    newUrl = `http://${networkIP}:3000`;
    console.log(`🌐 Configurando para rede local: ${newUrl}`);
  } else {
    newUrl = 'http://localhost:3000';
    console.log(`🏠 Configurando para localhost: ${newUrl}`);
  }
  
  // Atualizar NEXTAUTH_URL
  envContent = envContent.replace(
    /NEXTAUTH_URL="[^"]*"/,
    `NEXTAUTH_URL="${newUrl}"`
  );
  
  // Atualizar NEXT_PUBLIC_APP_URL
  envContent = envContent.replace(
    /NEXT_PUBLIC_APP_URL="[^"]*"/,
    `NEXT_PUBLIC_APP_URL="${newUrl}"`
  );
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Arquivo .env.local atualizado com sucesso!');
  console.log('');
  console.log('📱 Para testar no celular:');
  console.log(`   1. Certifique-se de que o celular está na mesma rede WiFi`);
  console.log(`   2. Acesse: ${newUrl}`);
  console.log(`   3. Os magic links agora funcionarão no celular`);
  console.log('');
  console.log('🔄 Para voltar ao localhost, execute: npm run dev:localhost');
}

const mode = process.argv[2];

if (!mode || (mode !== 'network' && mode !== 'localhost')) {
  console.log('');
  console.log('🚀 Script de configuração de rede para desenvolvimento');
  console.log('');
  console.log('Uso:');
  console.log('  npm run dev:network   - Configura para acesso via rede local (celular)');
  console.log('  npm run dev:localhost - Configura para localhost apenas');
  console.log('');
  process.exit(1);
}

updateEnvFile(mode);
