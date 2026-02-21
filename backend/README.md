# ⚙️ Backend - Plataforma de Acessibilidade Digital PcD

Este é o módulo backend da plataforma. Ele expõe uma API REST responsável por visitar os sites informados pelo usuário, extrair o código-fonte e realizar a auditoria heurística baseada nas regras da WCAG.

## 🚀 Principais Tecnologias

* **FastAPI**: Criação ágil e tipada das rotas da API REST.
* **Playwright**: Automação de navegador para renderizar páginas dinâmicas (SPAs) antes da análise.
* **BeautifulSoup4**: Motor de busca e manipulação do DOM (HTML) para encontrar as barreiras de acessibilidade.
* **SQLModel / SQLite**: ORM e banco de dados local para guardar o histórico e pontuações das análises.
* **Docker**: Configuração conteinerizada para facilitar o deploy.

## ⚙️ Como Executar Localmente

Certifique-se de ter o Python (3.10+) instalado. É altamente recomendado o uso de um ambiente virtual (venv).

1. Instale as dependências listadas no projeto:
$ pip install -r requirements.txt

2. Instale os navegadores do Playwright (Obrigatório para que o bot consiga abrir os sites):
$ playwright install chromium

3. Inicie o servidor de desenvolvimento:
$ uvicorn main:app --reload

A API estará rodando em `http://localhost:8000`. 
Você pode testar as rotas e ver a documentação interativa (Swagger) acessando `http://localhost:8000/docs`.

## 🐳 Como Executar via Docker

Se preferir não instalar as dependências de Python e os navegadores do Playwright diretamente na sua máquina, você pode subir o ambiente inteiro via Docker:

$ docker-compose up --build

O contêiner subirá a aplicação já com todas as dependências do sistema operacional necessárias para o Playwright funcionar.

---
Nota: Como este serviço realiza web scraping em tempo real, lembre-se que análises em sites com proteções anti-bot severas podem sofrer timeout.