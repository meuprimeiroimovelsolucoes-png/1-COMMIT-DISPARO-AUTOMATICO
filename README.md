# ⚡ Power Remarketing

Sistema de CRM Imobiliário focado em automação de WhatsApp e gestão de leads simples.

---

## 🚀 Como colocar na Internet (Vercel)

A tela que você está vendo pede um **Repositório Git**. Siga estes passos para criar um:

### Passo 1: Preparar o Git (No seu computador)
Se você baixou os arquivos para seu computador:
1. Abra o terminal na pasta do projeto.
2. Digite os comandos abaixo, um por um:
   ```bash
   git init
   git add .
   git commit -m "Primeira versão Power Remarketing"
   ```

### Passo 2: Enviar para o GitHub
1. Crie um repositório novo no site do [GitHub](https://github.com/new) (pode chamar de `power-remarketing`).
2. Copie o link do repositório (algo como `https://github.com/seu-usuario/power-remarketing.git`).
3. Volte ao terminal e cole:
   ```bash
   git branch -M main
   git remote add origin SEU_LINK_DO_GITHUB_AQUI
   git push -u origin main
   ```

### Passo 3: Conectar na Vercel
1. Agora, nessa tela da Vercel que você mostrou ("Importar repositório Git"):
2. Procure pelo nome `power-remarketing` que você acabou de criar.
3. Clique em **Import**.
4. Nas configurações que aparecerem, apenas clique em **Deploy**. A Vercel detectará que é um projeto Vite automaticamente.

---

## 💻 Rodando Localmente

Para testar no seu computador antes de enviar:

1. **Instale:**
   ```bash
   npm install
   ```

2. **Rode:**
   ```bash
   npm run dev
   ```

## 🛠 Arquivos de Configuração

- **.gitignore:** Impede que arquivos pesados (como `node_modules`) ou senhas subam para o GitHub.
- **.env.example:** Modelo das variáveis que o sistema usa. Renomeie para `.env` se for usar localmente.
- **vercel.json:** Garante que o site não quebre ao atualizar a página.