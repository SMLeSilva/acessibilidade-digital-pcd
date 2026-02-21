# 🖥️ Frontend - Plataforma de Acessibilidade Digital PcD

Este é o módulo frontend da plataforma, responsável por exibir o painel de análise de acessibilidade (Dashboard) de forma interativa e visual. O projeto foi construído com foco em performance e tipagem estática.

## 🚀 Tecnologias Utilizadas

* **React** + **TypeScript**
* **Vite** (Build tool e servidor de desenvolvimento)
* **Tailwind CSS** (Estilização utilitária)
* **Recharts** (Gráficos visuais de pontuação)
* **Lucide React** (Biblioteca de ícones)

## ⚙️ Como Executar Localmente

Certifique-se de ter o Node.js instalado na sua máquina.

1. Instale as dependências do projeto:
$ npm install

2. Inicie o servidor de desenvolvimento:
$ npm run dev

O aplicativo estará disponível no seu navegador em http://localhost:5173.

## 📦 Principais Comandos (Scripts)

* npm run dev: Inicia o servidor local para desenvolvimento.
* npm run build: Compila o TypeScript e gera a versão otimizada para produção na pasta dist/.
* npm run preview: Sobe um servidor local para você testar o build de produção gerado.

---
Nota: Este frontend consome a API construída em FastAPI. Para realizar análises reais de sites, certifique-se de que o backend também esteja em execução. Para entender a arquitetura completa e como os serviços se comunicam, consulte o README.md na raiz do repositório.