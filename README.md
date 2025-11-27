# 🏡 ImobCRM Auto

Este é o sistema de CRM Imobiliário com Automação de WhatsApp. Ele foi preparado para ser simples, rápido e fácil de hospedar.

## 🚀 Como colocar na Internet (Deploy)

A maneira mais fácil e gratuita é usar a **Vercel** ou **Netlify**.

### Opção 1: Vercel (Recomendado)

1. Crie uma conta em [vercel.com](https://vercel.com).
2. Instale o **Vercel CLI** no seu computador ou conecte sua conta do **GitHub**.
3. Se usar o GitHub:
   - Suba este código para um repositório.
   - Na Vercel, clique em "Add New Project" e selecione o repositório.
   - O sistema detectará automaticamente que é um projeto **Vite**.
   - Clique em **Deploy**.

### Opção 2: Netlify

1. Crie uma conta em [netlify.com](https://www.netlify.com).
2. Arraste a pasta `dist` (gerada após rodar o comando de build) para o painel da Netlify OU conecte ao GitHub.

---

## 💻 Como rodar no seu computador

Se você baixou os arquivos, siga estes passos para testar:

1. **Instale as dependências:**
   Abra o terminal na pasta do projeto e digite:
   ```bash
   npm install
   ```

2. **Rode o projeto:**
   ```bash
   npm run dev
   ```
   O site abrirá no seu navegador (geralmente em `http://localhost:5173`).

3. **Gere a versão final (Build):**
   Para criar a versão otimizada para internet:
   ```bash
   npm run build
   ```
   Isso criará uma pasta chamada `dist`.

## 🛠 Tecnologias Usadas

- **React**: Para criar as telas.
- **Vite**: Para fazer o site carregar rápido.
- **Tailwind CSS**: Para o visual bonito e limpo.
- **Lucide Icons**: Ícones visuais e simples.
