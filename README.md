# SAQUA ON

Guia digital das praias de Saquarema (RJ). Mostra as condições do mar, reúne quiosques e comerciantes locais, divulga eventos e permite cadastro de turistas, moradores e comerciantes.

## O que o site tem

- Radar das praias: ondas, vento, maré, bandeira de segurança e lotação.
- Resumo do clima de Saquarema.
- Marketplace de quiosques, restaurantes, escolas de surf, pousadas e ambulantes, com filtros, mapa e avaliações de 1 a 5 estrelas.
- Eventos e agenda da capital do surf (WSL).
- Seção sobre a Igreja de Nossa Senhora de Nazaré.
- Cadastro e login (turista, morador ou comerciante), com recuperação de senha.
- Cadastro de estabelecimentos com plano Gratuito, Pro ou Master (até 5 por conta). O comerciante só pede o plano; a equipe ativa depois do contato.
- Depoimentos, simulador de retorno para comerciantes, player de som do mar e barra flutuante no celular.

## Tecnologias

- React 19, TypeScript, Vite e Tailwind CSS 4
- Supabase (PostgreSQL com RLS e Auth)

## Pré-requisitos

- Node.js 18 ou mais novo
- Uma conta gratuita no Supabase (https://supabase.com)

## Como rodar

```bash
git clone https://github.com/SEU-USUARIO/SAQUAON.git
cd SAQUAON
npm install
```

Crie um arquivo chamado `.env` na raiz do projeto (ao lado do `package.json`) com:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
VITE_GOOGLE_MAPS_API_KEY=
```

Depois rode:

```bash
npm run dev
```

Abra http://localhost:3000. Sempre que mudar o `.env`, pare o servidor (Ctrl+C) e rode `npm run dev` de novo.

Não abra o `index.html` com duplo clique: o site precisa do servidor do Vite.

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | Project URL do seu projeto no Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave `anon public` (Project Settings → API) |
| `VITE_GOOGLE_MAPS_API_KEY` | Não | Chave do Google Maps, se o mapa a utilizar |

O `.env` não vai para o GitHub (está no `.gitignore`). Use somente a chave `anon`. **Nunca coloque a chave `service_role` no projeto.**

## Configurando o Supabase

1. Crie um projeto em https://supabase.com e espere ele terminar de iniciar.
2. Em **Project Settings → API**, copie a Project URL e a chave `anon public` para o `.env`.
3. No **SQL Editor**, rode, nesta ordem:
   1. `supabase/migrations/20261104000000_schema_inicial.sql` (tabelas, regras de segurança e planos)
   2. `supabase/seed.sql` (praias, quiosques, eventos e depoimentos de exemplo)
4. Em **Authentication → URL Configuration**, coloque o endereço do site em **Site URL** e em **Redirect URLs**. Para testes locais, use `http://localhost:3000`.
5. Para testar sem e-mail de confirmação, desligue **Confirm email** em **Authentication → Providers → Email**. Em produção, deixe ligado.

Rode cada arquivo uma única vez. Rodar de novo dá erro de tabela já existente.

### Criando um administrador

Ninguém se cadastra como administrador pelo site. Crie uma conta normalmente e, no SQL Editor, rode:

```sql
update public.usuarios set tipo = 'administrador' where email = 'seu@email.com';
```

Por enquanto isso só libera as permissões no banco (veja "O que falta fazer").

## Perfis e permissões

| Perfil | O que pode fazer |
|---|---|
| Visitante | Ver praias, quiosques e eventos |
| Turista / Morador | Avaliar locais e editar a própria avaliação |
| Comerciante | Tudo acima, mais cadastrar até 5 estabelecimentos |
| Administrador | Regras já existem no banco para gerir praias, planos, depoimentos, eventos da cidade, estabelecimentos e avaliações |

As regras ficam no banco (RLS e triggers), então valem mesmo que alguém tente burlar a tela. Plano, status e selo de verificado só a equipe altera.

## Estrutura do projeto

```
src/
  components/     telas e janelas do site
  context/        sessão do usuário (AuthContext) e dados do site (DataContext)
  lib/
    api.ts        chamadas ao Supabase
    supabase.ts   cliente do Supabase
    validation.ts validações e tradução de erros
supabase/
  migrations/     esquema do banco
  seed.sql        dados de exemplo
```

## Publicando (Vercel)

1. Importe o repositório na Vercel (framework: Vite).
2. Em **Settings → Environment Variables**, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. Faça o deploy. A cada `git push` na branch `main` a Vercel publica uma nova versão.
4. Depois de mudar qualquer variável, faça **Redeploy**.
5. No Supabase, coloque o endereço da Vercel em **Authentication → URL Configuration**.

O comando de build é `npm run build` e a saída fica na pasta `dist/`.

## Problemas comuns

- **Faixa amarela "Supabase não configurado":** o `.env` não existe, está na pasta errada ou o servidor não foi reiniciado depois de criá-lo.
- **"Sem conexão com o servidor":** o `.env` ainda tem valores de exemplo, ou o projeto do Supabase está pausado (clique em Restore project).
- **Site abre mas sem praias e quiosques:** falta rodar o schema e o `seed.sql`.
- **Erro de `package.json` não encontrado:** o terminal está na pasta errada. Entre na pasta que tem o `package.json`.

## O que falta fazer

- **Painel de administrador (UC18–UC20):** as regras já existem no banco, falta a tela.
- **Publicações, comentários e denúncias (UC06–UC08, UC12):** não fazem parte do DER enviado.
- **Editar estabelecimento, produtos e promoções pela tela (UC14–UC17)** e **envio de fotos** (Supabase Storage).
- **Para produção:** ativar CAPTCHA no Supabase Auth (Turnstile ou hCaptcha) contra cadastros automáticos.
