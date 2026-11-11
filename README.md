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
```

Crie o arquivo `.env` na raiz do projeto (ao lado do `package.json`):

```bash
cp .env.example .env        # Git Bash / Mac / Linux
copy .env.example .env      # PowerShell
```

Preencha as duas variáveis obrigatórias (veja a seção abaixo) e rode:

```bash
npm run dev
```

Abra http://localhost:3000. Ao mudar o `.env`, pare o servidor com Ctrl+C e rode `npm run dev` de novo.

Não abra o `index.html` com duplo clique: o site precisa do servidor do Vite.

Outros comandos úteis:

```bash
npm run build          # gera a versão de produção na pasta dist/
npx tsc --noEmit       # confere os erros de TypeScript
```

## Variáveis de ambiente

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | Project URL, no formato `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave pública do projeto (a `anon` ou a `publishable`, que começa com `sb_publishable_`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Não | Chave do Google Maps |
| `VITE_TURNSTILE_SITE_KEY` | Não | Liga o CAPTCHA (Cloudflare Turnstile) |

Exemplo de `.env`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxx
```

Atenção:
- O nome precisa começar com `VITE_`. Variáveis `NEXT_PUBLIC_...` (de projetos Next.js) são ignoradas pelo Vite.
- Sem aspas e sem espaço em volta do `=`.
- O `.env` não vai para o GitHub (está no `.gitignore`). Use só a chave pública, **nunca a `service_role` nem a `secret`**.

## Configurando o Supabase

1. Crie um projeto (ou peça acesso ao projeto da equipe) e copie a URL e a chave pública para o `.env`.
2. No **SQL Editor**, rode **uma única vez, nesta ordem**:
   1. `supabase/migrations/20261104000000_schema_inicial.sql` (tabelas, segurança e planos)
   2. `supabase/migrations/20261112000000_comunidade_e_fotos.sql` (publicações, comentários, denúncias, funções do administrador e bucket de fotos)
   3. `supabase/seed.sql` (dados de exemplo)
3. Em **Authentication → URL Configuration**, coloque o endereço do site em Site URL e Redirect URLs (`http://localhost:3000` para testes).
4. Para testar sem e-mail de confirmação, desligue **Confirm email** em Authentication → Providers → Email. Em produção, deixe ligado.

Observações:
- Em um banco que já tem o schema inicial, rode **apenas** a segunda migration. Rodar o schema inicial de novo dá erro de tabela já existente.
- O Supabase mostra um aviso de "operações destrutivas" ao rodar as migrations. É automático (por causa de palavras como `delete` e `update`); as migrations só criam coisas novas e não apagam dados.
- Se o projeto for compartilhado, tudo o que for criado em testes (contas, publicações, estabelecimentos) aparece para todos. Apague os testes depois.

### Primeiro administrador

Ninguém se cadastra como administrador pelo site. Crie uma conta normalmente e, no SQL Editor (em uma consulta nova, clicando em **Run**), rode:

```sql
update public.usuarios set tipo = 'administrador' where email = 'seu@email.com';
```

Saia e entre de novo: o menu da conta passa a mostrar **Painel do administrador**. Depois, novos administradores podem ser definidos na aba **Usuários** do painel.

### Voltando a ser comerciante ou turista

O painel não permite que o administrador remova o próprio acesso (para ninguém se trancar para fora). Para isso, use o SQL:

```sql
update public.usuarios set tipo = 'comerciante' where email = 'seu@email.com';
```

Os tipos válidos são `turista`, `morador`, `comerciante` e `administrador`. Os estabelecimentos continuam sendo da conta, mas o bloco "Meus estabelecimentos" do menu só aparece para o tipo `comerciante`.

## CAPTCHA (recomendado em produção)

Sem a chave configurada, o site funciona normalmente e o CAPTCHA fica desligado.

1. No painel da Cloudflare (Turnstile), crie um widget para o seu domínio (adicione `localhost` para testes).
2. Coloque a **Site Key** em `VITE_TURNSTILE_SITE_KEY` (no `.env` e na Vercel).
3. No Supabase, em **Authentication → Attack Protection**, ative **CAPTCHA protection**, escolha **Cloudflare Turnstile** e cole a **Secret Key**.

Ative os dois lados juntos: CAPTCHA ligado no Supabase sem a Site Key no site faz cadastro e login falharem.

## Fotos

As fotos ficam no bucket `fotos` do Supabase Storage (criado pela segunda migration). O banco de dados guarda só o endereço da imagem, e não o arquivo.

- Formatos: JPG, PNG e WebP, até 20 MB por arquivo escolhido.
- O navegador reduz a foto antes de enviar (lado maior de 1600 px, formato WebP, qualidade ~82%). Cada imagem costuma ficar com poucas centenas de KB.
- O bucket recusa arquivos acima de 5 MB depois da redução, e a imagem fica em cache no navegador por 1 ano.
- Cada pessoa só envia e apaga arquivos na própria pasta.
- Estabelecimentos aceitam até 10 fotos (a primeira é a capa); publicações, 1 foto.
- Ao remover uma foto pelo site, o arquivo também é apagado do Storage.

## Perfis e permissões

| Perfil | O que pode fazer |
|---|---|
| Visitante | Ver praias, quiosques, eventos, publicações e comentários |
| Turista / Morador | Avaliar locais, publicar, comentar, denunciar e apagar o que é seu |
| Comerciante | Tudo acima, mais cadastrar até 5 estabelecimentos e editar os seus |
| Administrador | Tudo acima, mais moderar denúncias, alterar plano/status/selo e definir o tipo dos usuários |

Planos: **Gratuito** (sem promoções), **Pro**
