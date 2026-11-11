create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;


create table public.usuarios (
  id            uuid primary key references auth.users (id) on delete cascade,
  nome          text not null,
  email         text not null,
  tipo          text not null default 'turista'
                  check (tipo in ('turista', 'morador', 'comerciante', 'administrador')),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint usuarios_nome_tamanho check (char_length(btrim(nome)) between 2 and 80),
  constraint usuarios_email_formato check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create unique index usuarios_email_key on public.usuarios (lower(email));
comment on table public.usuarios is
  'Perfil do usuário (turista, morador, comerciante ou administrador). A senha fica no Supabase Auth.';


create table public.praias (
  id                       uuid primary key default gen_random_uuid(),
  slug                     text not null unique,
  nome                     text not null,
  subtitulo                text,
  slogan                   text,
  imagem_url               text,
  altura_ondas             text,
  periodo_ondas            text,
  direcao_ondas            text,
  vento_velocidade         text,
  vento_direcao            text,
  temperatura_agua         text,
  mare                     text check (mare in ('Baixa', 'Enchendo', 'Alta', 'Vazando', 'Estável')),
  nivel_mare               text,
  lotacao                  text check (lotacao in ('Tranquilo', 'Moderado', 'Movimentado', 'Lotado')),
  bandeira                 text not null default 'verde' check (bandeira in ('verde', 'amarela', 'vermelha')),
  mensagem_seguranca       text,
  ideal_para               text[] not null default '{}',
  recursos                 text[] not null default '{}',
  ordem                    int not null default 0,
  condicoes_atualizadas_em timestamptz not null default now(),
  criado_em                timestamptz not null default now(),
  atualizado_em            timestamptz not null default now()
);


create table public.planos (
  codigo       text primary key check (codigo in ('gratuito', 'pago', 'premium')),
  nome         text not null,
  selo         text,
  preco_mensal numeric(8, 2) not null default 0 check (preco_mensal >= 0),
  periodo      text,
  descricao    text,
  recursos     text[] not null default '{}',
  destaque     boolean not null default false,
  texto_botao  text,
  ordem        int not null default 0
);

create table public.comerciantes (
  id                   uuid primary key default gen_random_uuid(),
  usuario_id           uuid references public.usuarios (id) on delete cascade,
  slug                 text unique,
  nome_negocio         text not null,
  categoria            text not null
                         check (categoria in ('Quiosque', 'Restaurante', 'Escola de Surf', 'Pousada', 'Ambulante')),
  descricao            text check (descricao is null or char_length(descricao) <= 300),
  endereco             text check (endereco is null or char_length(endereco) <= 200),
  praia_id             uuid references public.praias (id) on delete set null,
  latitude             numeric(9, 6) check (latitude between -90 and 90),
  longitude            numeric(9, 6) check (longitude between -180 and 180),
  horario_funcionamento text check (horario_funcionamento is null or char_length(horario_funcionamento) <= 200),
  whatsapp             text not null check (whatsapp ~ '^[0-9]{12,13}$'),
  instagram            text check (instagram is null or instagram ~ '^@?[A-Za-z0-9._]{1,30}$'),
  fotos                text[] not null default '{}' check (cardinality(fotos) <= 10),
  comodidades          text[] not null default '{}' check (cardinality(comodidades) <= 20),
  faixa_preco          text check (faixa_preco in ('$', '$$', '$$$')),
  plano_codigo         text not null default 'gratuito' references public.planos (codigo),
  plano_solicitado     text references public.planos (codigo),
  status               text not null default 'ativo' check (status in ('ativo', 'inativo', 'suspenso')),
  verificado           boolean not null default false,
  nota_base            numeric(2, 1) not null default 0 check (nota_base between 0 and 5),
  avaliacoes_base      int not null default 0 check (avaliacoes_base >= 0),
  criado_em            timestamptz not null default now(),
  atualizado_em        timestamptz not null default now(),
  constraint comerciantes_nome_tamanho check (char_length(btrim(nome_negocio)) between 2 and 120)
);
comment on column public.comerciantes.plano_codigo is 'Plano ATIVO. Só a equipe (admin) altera.';
comment on column public.comerciantes.plano_solicitado is 'Plano que o comerciante pediu; a equipe ativa depois do contato.';


create table public.produtos_servicos (
  id                uuid primary key default gen_random_uuid(),
  comerciante_id    uuid not null references public.comerciantes (id) on delete cascade,
  nome              text not null check (char_length(btrim(nome)) between 2 and 120),
  preco             numeric(10, 2) not null check (preco >= 0),
  preco_a_partir_de boolean not null default false,
  descricao         text check (descricao is null or char_length(descricao) <= 500),
  destaque          boolean not null default false,
  ativo             boolean not null default true,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

create unique index produtos_um_destaque_por_comerciante
  on public.produtos_servicos (comerciante_id) where destaque;


create table public.eventos (
  id             uuid primary key default gen_random_uuid(),
  comerciante_id uuid references public.comerciantes (id) on delete cascade,
  slug           text unique,
  tipo           text not null default 'evento' check (tipo in ('evento', 'promocao')),
  titulo         text not null check (char_length(btrim(titulo)) between 3 and 150),
  descricao      text check (descricao is null or char_length(descricao) <= 1000),
  local          text check (local is null or char_length(local) <= 200),
  data_inicio    date not null,
  data_fim       date,
  horario        text check (horario is null or char_length(horario) <= 100),
  categoria      text check (categoria in ('Surf & Esporte', 'Música & Cultura', 'Gastronomia', 'Sustentabilidade')),
  selo           text,
  imagem_url     text,
  link_url       text check (link_url is null or link_url ~* '^https?://'),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now(),
  constraint eventos_periodo_valido check (data_fim is null or data_fim >= data_inicio),
  constraint eventos_promocao_tem_dono check (tipo <> 'promocao' or comerciante_id is not null)
);

create table public.avaliacoes (
  id             uuid primary key default gen_random_uuid(),
  usuario_id     uuid not null references public.usuarios (id) on delete cascade,
  comerciante_id uuid references public.comerciantes (id) on delete cascade,
  praia_id       uuid references public.praias (id) on delete cascade,
  nota           smallint not null check (nota between 1 and 5),
  comentario     text check (comentario is null or char_length(comentario) <= 1000),
  autor_nome     text not null default '',            -- preenchido por trigger (ex.: "Maria S.")
  data           date not null default current_date,
  atualizado_em  timestamptz not null default now(),
  constraint avaliacoes_um_alvo check ((comerciante_id is not null)::int + (praia_id is not null)::int = 1),
  constraint avaliacoes_uma_por_comerciante unique (usuario_id, comerciante_id),
  constraint avaliacoes_uma_por_praia unique (usuario_id, praia_id)
);


create table public.depoimentos (
  id          uuid primary key default gen_random_uuid(),
  autor       text not null,
  funcao      text,
  localizacao text,
  avatar_url  text,
  conteudo    text not null,
  nota        smallint not null default 5 check (nota between 1 and 5),
  ativo       boolean not null default true,
  ordem       int not null default 0,
  criado_em   timestamptz not null default now()
);


create index comerciantes_usuario_idx on public.comerciantes (usuario_id);
create index comerciantes_praia_idx   on public.comerciantes (praia_id);
create index produtos_comerciante_idx on public.produtos_servicos (comerciante_id);
create index eventos_comerciante_idx  on public.eventos (comerciante_id);
create index eventos_data_idx         on public.eventos (data_inicio desc);
create index avaliacoes_comerciante_idx on public.avaliacoes (comerciante_id);
create index avaliacoes_praia_idx     on public.avaliacoes (praia_id);


create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;


create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.usuarios u
    where u.id = (select auth.uid()) and u.tipo = 'administrador'
  );
$$;


create or replace function private.gerencia_comerciante(p_comerciante_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin() or exists (
    select 1 from public.comerciantes c
    where c.id = p_comerciante_id and c.usuario_id = (select auth.uid())
  );
$$;


create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nome text;
  v_tipo text;
begin
  v_nome := btrim(coalesce(new.raw_user_meta_data ->> 'nome', ''));
  if char_length(v_nome) < 2 then
    v_nome := btrim(split_part(coalesce(new.email, ''), '@', 1));
  end if;
  if char_length(v_nome) < 2 then
    v_nome := 'Usuário';
  end if;

  v_tipo := coalesce(new.raw_user_meta_data ->> 'tipo', 'turista');
  if v_tipo not in ('turista', 'morador', 'comerciante') then
    v_tipo := 'turista';
  end if;

  insert into public.usuarios (id, nome, email, tipo)
  values (new.id, left(v_nome, 80), coalesce(new.email, ''), v_tipo);
  return new;
end;
$$;

create or replace function private.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.usuarios set email = coalesce(new.email, email) where id = new.id;
  return new;
end;
$$;

create or replace function private.comerciantes_validar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_total int;
begin
  new.nome_negocio := btrim(new.nome_negocio);
  new.slug := nullif(btrim(new.slug), '');

  if (select auth.uid()) is null or private.is_admin() then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.usuario_id is distinct from old.usuario_id
       or new.plano_codigo is distinct from old.plano_codigo
       or new.status is distinct from old.status
       or new.verificado is distinct from old.verificado
       or new.nota_base is distinct from old.nota_base
       or new.avaliacoes_base is distinct from old.avaliacoes_base
       or new.slug is distinct from old.slug then
      raise exception 'Somente a equipe do SAQUA ON pode alterar plano, status ou selo de verificação.';
    end if;
  elsif new.usuario_id = (select auth.uid()) then
    select count(*) into v_total from public.comerciantes where usuario_id = new.usuario_id;
    if v_total >= 5 then
      raise exception 'Limite de 5 estabelecimentos por conta atingido.';
    end if;
  end if;

  return new;
end;
$$;

create or replace function private.comerciantes_depois_inserir()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.usuario_id is not null then
    update public.usuarios
       set tipo = 'comerciante'
     where id = new.usuario_id and tipo in ('turista', 'morador');
  end if;
  return new;
end;
$$;

create or replace function private.avaliacoes_antes_inserir()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nome   text;
  v_ultimo text;
  v_dono   uuid;
begin
  select btrim(nome) into v_nome from public.usuarios where id = new.usuario_id;
  v_nome := coalesce(v_nome, '');
  v_ultimo := case when position(' ' in v_nome) > 0 then regexp_replace(v_nome, '^.*\s', '') end;
  new.autor_nome := split_part(v_nome, ' ', 1) || coalesce(' ' || upper(left(v_ultimo, 1)) || '.', '');
  new.comentario := nullif(btrim(coalesce(new.comentario, '')), '');

  if new.comerciante_id is not null then
    select usuario_id into v_dono from public.comerciantes where id = new.comerciante_id;
    if v_dono is not null and v_dono = new.usuario_id then
      raise exception 'Você não pode avaliar o seu próprio estabelecimento.';
    end if;
  end if;
  return new;
end;
$$;

create or replace function private.eventos_validar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plano  text;
  v_ativas int;
begin
  new.titulo := btrim(new.titulo);

  if new.comerciante_id is not null
     and (select auth.uid()) is not null
     and not private.gerencia_comerciante(new.comerciante_id) then
    return new;
  end if;

  if new.tipo = 'promocao' and (new.data_fim is null or new.data_fim >= current_date) then
    select plano_codigo into v_plano from public.comerciantes where id = new.comerciante_id;

    if v_plano = 'gratuito' then
      raise exception 'O plano gratuito não inclui promoções. Conheça os planos pago e premium.';
    end if;

    if v_plano = 'pago' then
      select count(*) into v_ativas
        from public.eventos e
       where e.comerciante_id = new.comerciante_id
         and e.tipo = 'promocao'
         and (e.data_fim is null or e.data_fim >= current_date)
         and e.id <> new.id;
      if v_ativas >= 3 then
        raise exception 'O plano pago permite até 3 promoções ativas ao mesmo tempo.';
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- Funções de trigger não precisam (nem devem) ser chamáveis por ninguém
revoke execute on all functions in schema private from public;
grant execute on function private.is_admin() to anon, authenticated;
grant execute on function private.gerencia_comerciante(uuid) to anon, authenticated;

-- Triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function private.handle_user_email_change();

create trigger comerciantes_validar
  before insert or update on public.comerciantes
  for each row execute function private.comerciantes_validar();

create trigger comerciantes_depois_inserir
  after insert on public.comerciantes
  for each row execute function private.comerciantes_depois_inserir();

create trigger avaliacoes_antes_inserir
  before insert on public.avaliacoes
  for each row execute function private.avaliacoes_antes_inserir();

create trigger eventos_validar
  before insert or update on public.eventos
  for each row execute function private.eventos_validar();

create trigger usuarios_updated_at        before update on public.usuarios        for each row execute function private.set_updated_at();
create trigger praias_updated_at          before update on public.praias          for each row execute function private.set_updated_at();
create trigger comerciantes_updated_at    before update on public.comerciantes    for each row execute function private.set_updated_at();
create trigger produtos_updated_at        before update on public.produtos_servicos for each row execute function private.set_updated_at();
create trigger eventos_updated_at         before update on public.eventos         for each row execute function private.set_updated_at();
create trigger avaliacoes_updated_at      before update on public.avaliacoes      for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------
-- 3) VIEW usada pelo marketplace (nota média, produto em destaque, promoção)
--    security_invoker = as policies (RLS) das tabelas valem para quem consulta
-- ---------------------------------------------------------------------
create or replace view public.vw_comerciantes
with (security_invoker = true) as
select
  c.id,
  c.slug,
  c.nome_negocio,
  c.categoria,
  c.descricao,
  c.endereco,
  c.praia_id,
  p.slug  as praia_slug,
  p.nome  as praia_nome,
  c.latitude,
  c.longitude,
  c.horario_funcionamento,
  c.whatsapp,
  c.instagram,
  c.fotos,
  c.comodidades,
  c.faixa_preco,
  c.plano_codigo,
  pl.ordem as plano_ordem,
  c.verificado,
  c.criado_em,
  (c.avaliacoes_base + coalesce(a.total, 0))::int as total_avaliacoes,
  case
    when c.avaliacoes_base + coalesce(a.total, 0) = 0 then 0::numeric
    else round((c.nota_base * c.avaliacoes_base + coalesce(a.soma, 0)) / (c.avaliacoes_base + coalesce(a.total, 0)), 1)
  end as nota_media,
  d.nome              as produto_destaque,
  d.preco             as produto_destaque_preco,
  d.preco_a_partir_de as produto_destaque_a_partir_de,
  d.descricao         as produto_destaque_descricao,
  pr.titulo           as promocao
from public.comerciantes c
join public.planos pl on pl.codigo = c.plano_codigo
left join public.praias p on p.id = c.praia_id
left join lateral (
  select count(*) as total, sum(av.nota) as soma
  from public.avaliacoes av
  where av.comerciante_id = c.id
) a on true
left join lateral (
  select ps.nome, ps.preco, ps.preco_a_partir_de, ps.descricao
  from public.produtos_servicos ps
  where ps.comerciante_id = c.id and ps.ativo
  order by ps.destaque desc, ps.criado_em asc
  limit 1
) d on true
left join lateral (
  select e.titulo
  from public.eventos e
  where e.comerciante_id = c.id
    and e.tipo = 'promocao'
    and (e.data_fim is null or e.data_fim >= current_date)
  order by e.data_inicio desc, e.criado_em desc
  limit 1
) pr on true
where c.status = 'ativo';

-- ---------------------------------------------------------------------
-- 4) RLS — quem pode ler/escrever o quê
-- ---------------------------------------------------------------------
alter table public.usuarios          enable row level security;
alter table public.praias            enable row level security;
alter table public.planos            enable row level security;
alter table public.comerciantes      enable row level security;
alter table public.produtos_servicos enable row level security;
alter table public.eventos           enable row level security;
alter table public.avaliacoes        enable row level security;
alter table public.depoimentos       enable row level security;

-- usuarios: cada um vê e edita só o próprio perfil (admin vê todos).
-- Não há policy de INSERT/DELETE: o perfil nasce pelo trigger e some junto com o Auth.
create policy usuarios_select on public.usuarios for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));
create policy usuarios_update on public.usuarios for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- praias / planos / depoimentos: leitura pública; escrita só do administrador
create policy praias_select on public.praias for select to anon, authenticated using (true);
create policy praias_insert on public.praias for insert to authenticated with check ((select private.is_admin()));
create policy praias_update on public.praias for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy praias_delete on public.praias for delete to authenticated using ((select private.is_admin()));

create policy planos_select on public.planos for select to anon, authenticated using (true);

create policy depoimentos_select on public.depoimentos for select to anon, authenticated
  using (ativo or (select private.is_admin()));
create policy depoimentos_insert on public.depoimentos for insert to authenticated with check ((select private.is_admin()));
create policy depoimentos_update on public.depoimentos for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy depoimentos_delete on public.depoimentos for delete to authenticated using ((select private.is_admin()));

-- comerciantes (UC13, UC14, UC20)
create policy comerciantes_select on public.comerciantes for select to anon, authenticated
  using (status = 'ativo' or (select private.gerencia_comerciante(id)));
create policy comerciantes_insert on public.comerciantes for insert to authenticated
  with check (
    (select private.is_admin())
    or (
      usuario_id = (select auth.uid())
      and plano_codigo = 'gratuito'
      and status = 'ativo'
      and verificado = false
      and nota_base = 0
      and avaliacoes_base = 0
      and slug is null
    )
  );
create policy comerciantes_update on public.comerciantes for update to authenticated
  using ((select private.gerencia_comerciante(id)))
  with check ((select private.gerencia_comerciante(id)));
create policy comerciantes_delete on public.comerciantes for delete to authenticated
  using ((select private.gerencia_comerciante(id)));

-- produtos_servicos (UC15, UC17)
create policy produtos_select on public.produtos_servicos for select to anon, authenticated
  using (
    exists (select 1 from public.comerciantes c where c.id = produtos_servicos.comerciante_id)
    and (ativo or (select private.gerencia_comerciante(comerciante_id)))
  );
create policy produtos_insert on public.produtos_servicos for insert to authenticated
  with check ((select private.gerencia_comerciante(comerciante_id)));
create policy produtos_update on public.produtos_servicos for update to authenticated
  using ((select private.gerencia_comerciante(comerciante_id)))
  with check ((select private.gerencia_comerciante(comerciante_id)));
create policy produtos_delete on public.produtos_servicos for delete to authenticated
  using ((select private.gerencia_comerciante(comerciante_id)));

-- eventos (UC16): eventos da cidade (sem comerciante) só o administrador mexe
create policy eventos_select on public.eventos for select to anon, authenticated
  using (
    comerciante_id is null
    or exists (select 1 from public.comerciantes c where c.id = eventos.comerciante_id)
  );
create policy eventos_insert on public.eventos for insert to authenticated
  with check (
    (comerciante_id is null and (select private.is_admin()))
    or (comerciante_id is not null and (select private.gerencia_comerciante(comerciante_id)))
  );
create policy eventos_update on public.eventos for update to authenticated
  using (
    (comerciante_id is null and (select private.is_admin()))
    or (comerciante_id is not null and (select private.gerencia_comerciante(comerciante_id)))
  )
  with check (
    (comerciante_id is null and (select private.is_admin()))
    or (comerciante_id is not null and (select private.gerencia_comerciante(comerciante_id)))
  );
create policy eventos_delete on public.eventos for delete to authenticated
  using (
    (comerciante_id is null and (select private.is_admin()))
    or (comerciante_id is not null and (select private.gerencia_comerciante(comerciante_id)))
  );

-- avaliacoes (UC05): qualquer um lê; só quem está logado avalia, e só edita a própria
create policy avaliacoes_select on public.avaliacoes for select to anon, authenticated
  using (
    comerciante_id is null
    or exists (select 1 from public.comerciantes c where c.id = avaliacoes.comerciante_id)
  );
create policy avaliacoes_insert on public.avaliacoes for insert to authenticated
  with check (usuario_id = (select auth.uid()));
create policy avaliacoes_update on public.avaliacoes for update to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));
create policy avaliacoes_delete on public.avaliacoes for delete to authenticated
  using (usuario_id = (select auth.uid()) or (select private.is_admin()));

-- ---------------------------------------------------------------------
-- 5) PERMISSÕES (GRANT) — segunda camada, além do RLS
-- ---------------------------------------------------------------------
revoke all on public.usuarios, public.praias, public.planos, public.depoimentos,
              public.comerciantes, public.produtos_servicos, public.eventos,
              public.avaliacoes, public.vw_comerciantes
  from anon, authenticated;

grant select on public.praias, public.planos, public.depoimentos,
                public.produtos_servicos, public.eventos, public.vw_comerciantes
  to anon, authenticated;

-- visitantes não enxergam quem é o dono nem o plano solicitado
grant select (id, slug, nome_negocio, categoria, descricao, endereco, praia_id, latitude, longitude,
              horario_funcionamento, whatsapp, instagram, fotos, comodidades, faixa_preco,
              plano_codigo, status, verificado, nota_base, avaliacoes_base, criado_em, atualizado_em)
  on public.comerciantes to anon;
grant select on public.comerciantes to authenticated;

-- avaliações: visitantes não veem o usuario_id de quem avaliou
grant select (id, comerciante_id, praia_id, nota, comentario, autor_nome, data, atualizado_em)
  on public.avaliacoes to anon;
grant select on public.avaliacoes to authenticated;

-- usuarios: o usuário só pode alterar o próprio NOME (tipo/e-mail ficam travados)
grant select on public.usuarios to authenticated;
grant update (nome) on public.usuarios to authenticated;

grant insert, update, delete on public.praias, public.depoimentos to authenticated;
grant insert, update, delete on public.comerciantes, public.produtos_servicos, public.eventos to authenticated;
grant insert (usuario_id, comerciante_id, praia_id, nota, comentario) on public.avaliacoes to authenticated;
grant update (nota, comentario) on public.avaliacoes to authenticated;
grant delete on public.avaliacoes to authenticated;

-- ---------------------------------------------------------------------
-- 6) DADOS DE REFERÊNCIA — os 3 planos (o seed.sql traz o resto do conteúdo)
-- ---------------------------------------------------------------------
insert into public.planos (codigo, nome, selo, preco_mensal, periodo, descricao, recursos, destaque, texto_botao, ordem) values
('gratuito', 'Onda Livre', 'Comece Grátis', 0, 'para sempre',
 'Ideal para novos ambulantes e comércios locais começarem a ser encontrados.',
 array['Perfil comercial na lista de praias', 'Localização e horários de funcionamento', 'Link para WhatsApp direto', 'Aparece na busca regional'],
 false, 'Cadastrar Estabelecimento Grátis', 1),
('pago', 'Saqua Pro Destaque', 'Mais Escolhido pelos Quiosques', 49, 'mês (sem fidelidade)',
 'Destaque prioritário, cardápio digital e atração garantida de turistas na orla.',
 array['Posicionamento prioritário no topo da praia', 'Selo Oficial "Comércio Verificado"', 'Cardápio digital completo com fotos e preços', 'Botão WhatsApp com mensagem personalizada', 'Até 3 promoções ativas na vitrine', 'Estatísticas de cliques e visitantes'],
 true, 'Quero Vender Mais com o Pro', 2),
('premium', 'Saqua Master WSL', 'Visibilidade Máxima', 99, 'mês',
 'Para hotéis, pousadas, escolas de surf e restaurantes que querem dominar a região.',
 array['Destaque no Banner Principal em todas as praias', 'Impulsionamento turbinado durante WSL e feriados', 'Notificação push exclusiva para turistas na cidade', 'Sessão com fotos profissionais do seu espaço', 'Suporte VIP via WhatsApp dedicado', 'Relatório mensal de retorno e conversões'],
 false, 'Turbinar Minha Marca', 3)
on conflict (codigo) do update set
  nome = excluded.nome, selo = excluded.selo, preco_mensal = excluded.preco_mensal,
  periodo = excluded.periodo, descricao = excluded.descricao, recursos = excluded.recursos,
  destaque = excluded.destaque, texto_botao = excluded.texto_botao, ordem = excluded.ordem;
