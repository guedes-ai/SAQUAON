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

- Node.js 18 ou superior;
- Acesso ao repositório do projeto;
- Acesso ao projeto SAQUA ON no Supabase.

## Como rodar

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/SAQUAON.git
```

Entre na pasta do projeto:

```bash
cd SAQUAON
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo chamado `.env` na raiz do projeto, no mesmo diretório do `package.json`, e configure as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
VITE_GOOGLE_MAPS_API_KEY=
```

As credenciais de conexão devem ser obtidas no projeto SAQUA ON já configurado no Supabase, em **Project Settings → API**.

Depois, execute:

```bash
npm run dev
```

Abra o endereço disponibilizado pelo Vite no terminal. Caso esteja configurado na porta 3000, acesse:

http://localhost:3000

Sempre que modificar o arquivo `.env`, encerre o servidor com `Ctrl + C` e execute novamente `npm run dev`.

Não abra o `index.html` diretamente pelo navegador, pois o projeto precisa do servidor do Vite.

## Variáveis de ambiente

| **Variável** | **Obrigatória** | **Para que serve** |
|---|---|---|
| `VITE_SUPABASE_URL` | Sim | Endereço do projeto SAQUA ON no Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Sim | Chave pública de acesso utilizada para conectar a aplicação ao Supabase. |
| `VITE_GOOGLE_MAPS_API_KEY` | Não | Chave do Google Maps, caso o mapa utilize essa integração. |

O arquivo `.env` está incluído no `.gitignore`, evitando que as credenciais sejam enviadas ao GitHub.

**Importante:** utilize somente a chave pública apropriada para o frontend. Nunca disponibilize a chave `service_role`, pois ela possui permissões administrativas.

## Configurando o Supabase

O projeto SAQUA ON já possui um ambiente configurado no Supabase. Portanto, não é necessário criar um novo projeto ou executar novamente os scripts de criação do banco de dados.

Para conectar a aplicação:

1. Acesse o projeto SAQUA ON no painel do Supabase.
2. Entre em **Project Settings → API**.
3. Copie a Project URL e a chave pública.
4. Insira os valores correspondentes no arquivo `.env`.
5. Confira se o projeto está ativo e se as tabelas e configurações necessárias estão disponíveis.

### Autenticação e redirecionamento

Em **Authentication → URL Configuration**, verifique se os endereços utilizados pela aplicação estão configurados em Site URL e Redirect URLs.

Para testes locais, utilize:

```text
http://localhost:3000
```

Em produção, adicione também o endereço publicado na Vercel.

### Criando um administrador

Ninguém pode se cadastrar como administrador diretamente pelo site.

Para conceder permissões administrativas, crie uma conta normalmente pela plataforma e execute o seguinte comando no SQL Editor do Supabase:

```sql
UPDATE public.usuarios
SET tipo = 'administrador'
WHERE email = 'seu@email.com';
```

Substitua o e-mail pelo endereço da conta que receberá as permissões.

Atualmente, essa operação libera as permissões previstas nas regras do banco de dados. O painel administrativo ainda precisa ser desenvolvido.

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

- **Faixa amarela "Supabase não configurado":** verifique se o arquivo `.env` existe na raiz do projeto, se as variáveis estão preenchidas corretamente e se o servidor foi reiniciado após as alterações.
- **"Sem conexão com o servidor":** confira as credenciais de acesso ao Supabase e verifique se o projeto está ativo.
- **Site abre, mas sem praias e quiosques:** verifique se as tabelas necessárias existem no banco de dados e se os dados iniciais foram cadastrados corretamente no Supabase.
- **Erro de `package.json` não encontrado:** o terminal está aberto na pasta incorreta. Entre no diretório que contém o arquivo `package.json`.

## O que falta fazer

- **Painel de administrador (UC18–UC20):** as regras de permissões já estão configuradas no banco de dados, mas ainda falta desenvolver a interface do painel administrativo.
- **Publicações, comentários e denúncias (UC06–UC08, UC12):** implementar essas funcionalidades, que não foram contempladas no DER disponibilizado para o projeto.
- **Gerenciamento de estabelecimentos, produtos e promoções (UC14–UC17):** desenvolver as funcionalidades de edição e gerenciamento dessas informações pela interface, além da implementação do envio de fotos utilizando o Supabase Storage.
- **Segurança em produção:** implementar CAPTCHA no Supabase Auth, utilizando soluções como Cloudflare Turnstile ou hCaptcha, para reduzir cadastros automatizados.
