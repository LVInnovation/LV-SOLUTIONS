# L&V Solutions

Projeto web premium/tech para a L&V Solutions, com site público e área privada simples para controle local de projetos, clientes, acessos, links e mensalidades.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React
- Sem backend, API, Supabase ou banco externo nesta V1

## Como instalar

```bash
npm install
```

## Como rodar

```bash
npm run dev
```

Depois acesse a URL exibida pelo Vite, normalmente `http://localhost:5173`.

## Build

```bash
npm run build
```

## Rotas

- `/`: site público da L&V Solutions
- `/login`: login da área privada
- `/admin`: controle de projetos protegido por sessão local
- `/admin/projetos/:id`: detalhes completos do projeto

## Login da área privada

- Usuário: `LUVI`
- Senha: `011025`

## Logo

Coloque a logo manualmente em:

```text
public/logo.png
```

Se esse arquivo não existir ou não carregar, o app exibe um fallback neon com `L&V`.

## Dados locais

Os projetos são salvos no navegador usando `localStorage` na chave:

```text
lvsolutions_projects_v1
```

A sessão admin usa `sessionStorage` na chave:

```text
lvsolutions_admin_session
```

## Backup JSON

Na tela `/admin`, use:

- `Exportar backup JSON` para baixar todos os projetos cadastrados.
- `Importar backup JSON` para restaurar um backup. A importação confirma antes de sobrescrever os dados atuais.

## Aviso de segurança

Login fixo e localStorage são apenas para protótipo. Para produção, migrar para Supabase Auth e banco com criptografia.
