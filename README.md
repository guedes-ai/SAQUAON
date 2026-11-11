# SAQUA ON

Guia digital das praias de Saquarema (RJ). Mostra as condições do mar, reúne quiosques e comerciantes locais, divulga eventos e tem uma comunidade onde moradores e turistas compartilham dicas e fotos.

## O que o site tem

**Para quem visita**
- Radar das praias: ondas, vento, maré, bandeira de segurança e lotação.
- Marketplace de quiosques, restaurantes, escolas de surf, pousadas e ambulantes, com filtros, mapa e avaliações.
- Eventos e agenda da capital do surf (WSL).
- Comunidade: publicações com foto, comentários e denúncias.
- Cadastro e login (turista, morador ou comerciante) com recuperação de senha.

**Para comerciantes**
- Cadastro do estabelecimento com plano Gratuito, Pro ou Master.
- Edição pelo próprio site: dados, horário, comodidades, fotos, cardápio/serviços (com item em destaque), promoções e eventos.

**Para administradores**
- Painel com moderação de denúncias, gestão de estabelecimentos (plano, status e selo de verificado) e gestão de usuários.

## Tecnologias

- React 19, TypeScript, Vite e Tailwind CSS 4
- Supabase: PostgreSQL com RLS, autenticação e Storage de fotos
- Cloudflare Turnstile (CAPTCHA, opcional)

## Como rodar

Requisitos: Node.js 18+ e acesso a um projeto no Supabase.

```bash
git clone https://github.com/SEU-USUARIO/SAQUAON.git
cd SAQUAON
npm install
cp .env.example .env     # no PowerShell: copy .env.example .env
npm run dev
```

Preencha o `.env` antes de rodar e abra http://localhost:3000. Ao mudar o `.env`, reinicie o `npm run dev`. Não abra o `index.html` com duplo clique.

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | Project URL do projeto no Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave `anon public` (Project Settings → API) |
| `VITE_GOOGLE_MAPS_API_KEY` | Não | Chave do Google Maps |
| `VITE_TURNSTILE_SITE_KEY` | Não | Liga o CAPTCHA (Cloudflare Turnstile) |

O `.env` não vai para o GitHub. Use só a chave `anon`, **nunca a `service_role`**.

## Configurando o Supabase

1. Crie um projeto (ou peça acesso ao projeto da equipe) e copie a URL e a chave `anon` para o `.env`.
2. No **SQL Editor**, rode **uma única vez, nesta ordem**:
   1. `supabase/migrations/20261104000000_schema_inicial.sql` (tabelas, segurança e planos)
   2. `supabase/migrations/20261112000000_comunidade_e_fotos.sql` (publicações, comentários, denúncias, funções do administrador e bucket de fotos)
   3. `supabase/seed.sql` (dados de exemplo)
3. Em **Authentication → URL Configuration**, coloque o endereço do site em Site URL e Redirect URLs (`http://localhost:3000` para testes).
4. Para testar sem e-mail de confirmação, desligue **Confirm email** em Authentication → Providers → Email. Em produção, deixe ligado.

Em um banco que já tem o schema inicial, rode **apenas** a segunda migration.

### Primeiro administrador

Crie uma conta normalmente e, no SQL Editor, rode:

```sql
update public.usuarios set tipo = 'administrador' where email = 'seu@email.com';
```

Saia e entre de novo: o menu da conta passa a mostrar **Painel do administrador**. Depois, novos administradores podem ser definidos na aba **Usuários** do painel.

## CAPTCHA (recomendado em produção)

Sem a chave configurada, o site funciona normalmente e o CAPTCHA fica desligado.

1. No painel da Cloudflare (Turnstile), crie um widget para o seu domínio (adicione `localhost` para testes).
2. Coloque a **Site Key** em `VITE_TURNSTILE_SITE_KEY` (no `.env` e na Vercel).
3. No Supabase, em **Authentication → Attack Protection**, ative **CAPTCHA protection**, escolha **Cloudflare Turnstile** e cole a **Secret Key**.

Ative os dois lados juntos: CAPTCHA ligado no Supabase sem a Site Key no site faz cadastro e login falharem.

## Fotos

Vão para o bucket `fotos` do Supabase Storage (criado pela segunda migration): JPG, PNG ou WebP, até 20 MB por arquivo. O navegador reduz a foto antes de enviar (lado maior de 1600 px, formato WebP, qualidade ~82%), então cada imagem costuma ficar com poucas centenas de KB. O banco de dados guarda só o endereço da imagem. Cada pessoa só envia e apaga arquivos na própria pasta. Estabelecimentos aceitam até 10 fotos (a primeira é a capa) e publicações, 1 foto.

## Perfis e permissões

| Perfil | O que pode fazer |
|---|---|
| Visitante | Ver praias, quiosques, eventos, publicações e comentários |
| Turista / Morador | Avaliar locais, publicar, comentar, denunciar e apagar o que é seu |
| Comerciante | Tudo acima, mais cadastrar até 5 estabelecimentos e editar os seus |
| Administrador | Tudo acima, mais moderar denúncias, alterar plano/status/selo e definir o tipo dos usuários |

Planos: **Gratuito** (sem promoções), **Pro** (até 3 promoções ativas) e **Master** (ilimitado). O comerciante só pede o plano; o administrador ativa na aba Estabelecimentos. As regras ficam no banco (RLS e triggers) e valem mesmo que alguém tente burlar a tela.

## Moderação

- Qualquer pessoa logada denuncia publicação, comentário ou estabelecimento (uma vez por item).
- O administrador oculta o conteúdo, suspende o estabelecimento, descarta ou reabre a denúncia.
- Conteúdo oculto some para o público; o autor e os administradores ainda o veem.
- Limite contra spam: 10 publicações e 30 comentários por hora por pessoa.

## Estrutura

```
src/
  components/   telas e janelas (AdminPanel, Community, MyBusinessModal, AuthModal...)
    ui/         Modal, campos e abas reutilizáveis
  context/      AuthContext (sessão) e DataContext (dados do site)
  lib/          api.ts (Supabase), supabase.ts, validation.ts
supabase/
  migrations/   esquema do banco, em ordem
  seed.sql      dados de exemplo
```

## Publicando (Vercel)

1. Importe o repositório (framework: Vite).
2. Cadastre as variáveis em Settings → Environment Variables.
3. Cada `git push` na `main` publica uma nova versão. Depois de mudar variáveis, faça **Redeploy**.
4. Coloque o endereço da Vercel em Authentication → URL Configuration no Supabase.

## Problemas comuns

- **Faixa amarela "Supabase não configurado":** `.env` ausente, na pasta errada ou servidor não reiniciado.
- **"Sem conexão com o servidor":** `.env` com valores de exemplo, ou projeto do Supabase pausado.
- **Sem praias e quiosques:** faltou rodar o schema e o `seed.sql`.
- **Erro em comunidade, fotos ou painel:** faltou rodar a segunda migration.
- **Sem "Painel do administrador":** o usuário ainda não é administrador (veja o SQL acima) ou precisa sair e entrar de novo.
- **Falha no cadastro com CAPTCHA:** falta a Site Key no site ou a Secret Key no Supabase.

## Ideias para o futuro

Notificações, estatísticas de cliques para comerciantes (prometidas nos planos Pro e Master), pagamento online dos planos e edição de publicações pela tela.
