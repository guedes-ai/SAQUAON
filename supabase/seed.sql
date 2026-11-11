
insert into public.praias
  (slug, nome, subtitulo, slogan, imagem_url, altura_ondas, periodo_ondas, direcao_ondas,
   vento_velocidade, vento_direcao, temperatura_agua, mare, nivel_mare, lotacao, bandeira,
   mensagem_seguranca, ideal_para, recursos, ordem)
values
('itauna', 'Praia de Itaúna', 'O Maracanã do Surf Mundial',
 'Palco oficial do campeonato mundial WSL Championship Tour',
 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
 '1.8m – 2.2m', '13s', 'Sul-Sudeste (SSE)', '9 nós', 'Terral (NNE)', '22°C', 'Enchendo', '+0.9m', 'Movimentado', 'amarela',
 'Atenção com correntes de retorno na arrebentação externa. Posto de guarda-vidas ativo (Posto 1).',
 array['Surfistas Avançados', 'Ver Eventos', 'Quiosques Agitados', 'Fotografia'],
 array['Palco WSL', 'Duchas Públicas', 'Acessibilidade', 'Estacionamento', 'Câmera ao Vivo'], 1),

('vila', 'Praia da Vila', 'Charme Histórico & Pôr do Sol',
 'Aos pés da histórica Igreja de Nossa Senhora de Nazareth',
 '/igreja_saquarema.jpg',
 '1.0m – 1.3m', '10s', 'Sudeste (SE)', '11 nós', 'Leste (E)', '23°C', 'Baixa', '+0.4m', 'Moderado', 'verde',
 'Condições excelentes e seguras para banhistas e caminhadas na orla. Guarda-vidas presente.',
 array['Famílias', 'Caminhadas', 'Gastronomia na Orla', 'Pôr do Sol'],
 array['Próximo à Igreja Matriz', 'Ciclovia', 'Quiosques com Wi-Fi', 'Parquinho Infantil'], 2),

('barrinha', 'Praia da Barrinha', 'Tubos Pesados & Encontro com a Lagoa',
 'Onde o mar encontra a lagoa em um espetáculo de ondas perfeitas',
 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
 '2.0m – 2.5m', '14s', 'Sul (S)', '8 nós', 'Terral (N)', '21°C', 'Enchendo', '+1.1m', 'Moderado', 'vermelha',
 'Ressaca forte e canal de correnteza rápido. Recomendado apenas para surfistas experientes.',
 array['Surf de Alta Performance', 'Bodyboard', 'Fotógrafos de Onda'],
 array['Tubos Rápidos', 'Fácil Acesso à Lagoa', 'Ponto de Pescadores'], 3),

('jacone', 'Praia de Jaconé', 'Paz, Natureza Selvagem & Pesca',
 '13 km de extensão de pura tranquilidade e costão rochoso',
 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80',
 '1.4m', '11s', 'Sul (S)', '12 nós', 'Nordeste (NE)', '22°C', 'Alta', '+1.2m', 'Tranquilo', 'amarela',
 'Praia de tombo com valas pontuais. Mantenha as crianças próximas à faixa de areia seca.',
 array['Sossego & Descanso', 'Pesca de Arremesso', 'Caminhadas Longas', 'Pet Friendly'],
 array['Costão Rochoso', 'Preservação Ambiental', 'Amplo Espaço'], 4),

('lagoa', 'Lagoa de Saquarema & Prainha', 'Águas Calmas, Quentes e Espelho D’Água',
 'O refúgio perfeito para esportes a remo e diversão infantil segura',
 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
 '0.0m (Sem ondas)', '-', 'Águas Protegidas', '6 nós', 'Brisa Suave', '25°C', 'Estável', '+0.6m', 'Moderado', 'verde',
 'Águas calmas e rasas, zero correntezas marítimas. Indicado para crianças pequenas e idosos.',
 array['Crianças Pequenas', 'Stand Up Paddle', 'Caiaque', 'Piquenique Familiar'],
 array['Zero Ondas', 'Aluguel de SUP', 'Árvores com Sombra', 'Água Morna'], 5)
on conflict (slug) do nothing;

-- COMERCIANTES (sem dono vinculado: usuario_id nulo) --------------------
insert into public.comerciantes
  (slug, nome_negocio, categoria, descricao, endereco, praia_id, latitude, longitude, whatsapp, instagram,
   fotos, comodidades, faixa_preco, plano_codigo, verificado, nota_base, avaliacoes_base)
select v.slug, v.nome_negocio, v.categoria, v.descricao, v.endereco, p.id, v.latitude, v.longitude,
       v.whatsapp, v.instagram, v.fotos, v.comodidades, v.faixa_preco, v.plano_codigo, true, v.nota, v.avaliacoes
from (values
  ('quiosque-do-russo', 'Quiosque do Russo Point Surf', 'Quiosque',
   'Frutos do Mar & Açaí Especial', 'Orla de Itaúna, em frente ao Palco da WSL', 'itauna',
   -22.9255::numeric, -42.4960::numeric, '5522998765432', '@quiosquedorusso',
   array['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
   array['Ducha Água Doce', 'Wi-Fi 500MB', 'Música ao Vivo', 'Aceita Cartão & Pix', 'Pet Friendly'],
   '$$', 'premium', 4.9::numeric, 384),

  ('cabana-vila-mar', 'Cabana Beach Vila Mar', 'Quiosque',
   'Peixe Frito na Hora & Caipirinhas Tropicais', 'Av. Beira Mar, 412 - Praia da Vila', 'vila',
   -22.9287, -42.5085, '5522997654321', '@cabanavilamar',
   array['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
   array['Cadeiras e Guarda-Sol', 'Banheiro Limpo', 'Ducha Externa', 'Cardápio Digital'],
   '$$', 'pago', 4.8, 290),

  ('escola-surf-saqua', 'Escola de Surf Saqua Waves Pro', 'Escola de Surf',
   'Aulas do Iniciante ao Avançado com Instrutores WSL', 'Ponto dos Surfistas, Posto 1 - Itaúna', 'itauna',
   -22.9265, -42.5005, '5522996543210', '@saquawavespro',
   array['https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=800&q=80'],
   array['Pranchas e Lycras Inclusas', 'Instrutores Certificados', 'Fotos de Ação na Água'],
   '$$', 'premium', 5.0, 412),

  ('pousada-sol-sal', 'Pousada Boutique Sol & Sal Saquarema', 'Pousada',
   'Hospedagem Pé na Areia com Vista Panorâmica do Mar', 'Rua das Gaivotas, 80 - Itaúna', 'itauna',
   -22.9250, -42.4975, '5522995432109', '@solesalsaquarema',
   array['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
   array['Piscina Borda Infinita', 'Café Artesanal', 'Ar Condicionado', 'Estacionamento Fechado'],
   '$$$', 'premium', 4.9, 198),

  ('sup-lagoa-aventura', 'Remo Saquá - Aluguel de SUP & Caiaque', 'Restaurante',
   'Passeios Guiados ao Pôr do Sol na Lagoa', 'Deck dos Pescadores - Prainha da Lagoa', 'lagoa',
   -22.9205, -42.5000, '5522994321098', '@remosaqua',
   array['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
   array['Coletes Salva-vidas', 'Instrução Rápida', 'Pet Friendly no SUP'],
   '$', 'pago', 4.8, 164),

  ('mate-artesanal-ze', 'Barraca do Zé - Mate Gelado & Biscoito Globo', 'Ambulante',
   'Mate com Limão Taiti Natural Trincando de Gelado', 'Circulando na faixa de areia entre Posto 1 e Barrinha', 'itauna',
   -22.9270, -42.5020, '5522993210987', null,
   array['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'],
   array['Ambulante Credenciado Prefeitura', 'Gelo com Água Mineral', 'Pix Fácil'],
   '$', 'pago', 4.9, 310)
) as v(slug, nome_negocio, categoria, descricao, endereco, praia_slug, latitude, longitude, whatsapp, instagram,
       fotos, comodidades, faixa_preco, plano_codigo, nota, avaliacoes)
join public.praias p on p.slug = v.praia_slug
on conflict (slug) do nothing;


insert into public.produtos_servicos (comerciante_id, nome, preco, preco_a_partir_de, descricao, destaque)
select c.id, v.nome, v.preco, v.a_partir_de, v.descricao, true
from (values
  ('quiosque-do-russo',  'Pastel Gigante de Camarão com Catupiry Real',            28.00::numeric, false, null::text),
  ('cabana-vila-mar',    'Porção de Gurjão de Peixe com Molho Tártaro da Casa',    68.00, false, 'Serve 3 pessoas'),
  ('escola-surf-saqua',  'Aula Experimental de 1h30 + Equipamento Completo',      110.00, false, null),
  ('pousada-sol-sal',    'Diária Casal com Café Colonial & Vista Mar',            340.00, true,  null),
  ('sup-lagoa-aventura', 'Locação de Stand Up Paddle (1 Hora)',                    45.00, false, null),
  ('mate-artesanal-ze',  'Copo de Mate 500ml batido com Limão + Biscoito Polvilho', 14.00, false, null)
) as v(slug, nome, preco, a_partir_de, descricao)
join public.comerciantes c on c.slug = v.slug
on conflict do nothing;


insert into public.eventos
  (slug, tipo, titulo, descricao, local, data_inicio, data_fim, horario, categoria, selo, imagem_url, link_url)
values
('wsl-vivo-rio-pro', 'evento', 'WSL Vivo Rio Pro 2026 - Saquarema',
 'A etapa do campeonato mundial de surf da WSL na América do Sul. Os maiores atletas do planeta competindo nas lendárias esquerdas e direitas de Itaúna.',
 'Praia de Itaúna (Estrutura Principal)', '2026-06-19', '2026-06-27', 'A partir das 07:00',
 'Surf & Esporte', 'Evento Internacional',
 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
 'https://www.worldsurfleague.com/events/2026/ct/191/vivo-rio-pro/main'),

('wsl-saquarema-surf-festival', 'evento', 'WSL Saquarema Surf Festival 2025 (QS)',
 'A importante etapa do Qualifying Series (QS) da WSL, celebrando a nova geração do surf sul-americano.',
 'Praia de Itaúna', '2025-04-12', '2025-04-20', 'A partir das 08:00',
 'Surf & Esporte', 'Evento WSL QS',
 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
 'https://www.worldsurfleague.com/events'),

('wsl-banco-do-brasil', 'evento', 'Banco do Brasil Saquarema Pro (CS)',
 'Etapa decisiva do Challenger Series 2025 da WSL, valendo vagas para o Championship Tour do próximo ano.',
 'Praia de Itaúna', '2025-10-11', '2025-10-19', 'A partir das 07:00',
 'Surf & Esporte', 'Evento WSL CS',
 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=800&q=80',
 'https://www.worldsurfleague.com/events'),

('festival-gastronomico', 'evento', 'Festival Sabores da Praia de Saquarema',
 'Mais de 25 quiosques e restaurantes servindo receitas exclusivas com frutos do mar frescos, cervejas artesanais e música ao vivo.',
 'Praça do Coração & Orla da Praia da Vila', '2026-05-15', '2026-05-18', '18:00 às 23:30',
 'Gastronomia', 'Gastronomia Local',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
 'https://www.saquarema.rj.gov.br/')
on conflict (slug) do nothing;

insert into public.eventos (comerciante_id, tipo, titulo, data_inicio)
select c.id, 'promocao', v.titulo, current_date
from (values
  ('quiosque-do-russo', '10% OFF apresentando o SAQUA ON no balcão'),
  ('cabana-vila-mar',   'Ganhe 1 água de coco na compra da porção'),
  ('escola-surf-saqua', 'Agendamento imediato pelo app'),
  ('pousada-sol-sal',   '15% de desconto para reservas no mês de baixa temporada')
) as v(slug, titulo)
join public.comerciantes c on c.slug = v.slug
where not exists (
  select 1 from public.eventos e where e.comerciante_id = c.id and e.tipo = 'promocao' and e.titulo = v.titulo
);

insert into public.depoimentos (autor, funcao, localizacao, avatar_url, conteudo, nota, ordem)
select v.autor, v.funcao, v.localizacao, v.avatar_url, v.conteudo, 5, v.ordem
from (values
  ('Rodrigo Mendonça', 'Surfista & Turista do RJ', 'Rio de Janeiro / Barra da Tijuca',
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
   'Nunca mais cheguei em Saquarema para dar de cara com mar mexido ou vento contra. O radar do SAQUA ON avisa se Itaúna ou a Barrinha tá bombando antes de eu pegar a estrada!', 1),
  ('Dona Neusa & Família', 'Moradora de Saquarema há 18 anos', 'Bairro da Vila, Saquarema',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
   'Com o app nós achamos o quiosque com ducha e espaço seguro pras crianças sem precisar rodar de carro no sol quente. Virou o nosso guia de final de semana.', 2),
  ('Carlos Alberto (Beto do Quiosque)', 'Proprietário de Quiosque em Itaúna', 'Praia de Itaúna',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
   'Desde que cadastrei meu quiosque no SAQUA ON, recebemos clientes de Minas, São Paulo e gringos da WSL que já chegam com mesa reservada pelo WhatsApp!', 3)
) as v(autor, funcao, localizacao, avatar_url, conteudo, ordem)
where not exists (select 1 from public.depoimentos d where d.autor = v.autor);
