import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { formatDateRange, formatPlanPrice, formatPrice } from './format';
import type {
  BeachCondition,
  KioskMerchant,
  LocalEvent,
  MerchantCategory,
  MerchantTier,
  PlanCode,
  Profile,
  SafetyFlag,
  Testimonial,
} from '../types';

interface PraiaRow {
  id: string;
  slug: string;
  nome: string;
  subtitulo: string | null;
  slogan: string | null;
  imagem_url: string | null;
  altura_ondas: string | null;
  periodo_ondas: string | null;
  direcao_ondas: string | null;
  vento_velocidade: string | null;
  vento_direcao: string | null;
  temperatura_agua: string | null;
  mare: BeachCondition['tide'] | null;
  nivel_mare: string | null;
  lotacao: BeachCondition['crowdLevel'] | null;
  bandeira: SafetyFlag;
  mensagem_seguranca: string | null;
  ideal_para: string[] | null;
  recursos: string[] | null;
}

interface PlanoRow {
  codigo: PlanCode;
  nome: string;
  selo: string | null;
  preco_mensal: number | string;
  periodo: string | null;
  descricao: string | null;
  recursos: string[] | null;
  destaque: boolean;
  texto_botao: string | null;
}

/** Linha da view vw_comerciantes */
interface ComercianteRow {
  id: string;
  slug: string | null;
  nome_negocio: string;
  categoria: MerchantCategory;
  descricao: string | null;
  endereco: string | null;
  praia_nome: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  whatsapp: string;
  instagram: string | null;
  fotos: string[] | null;
  comodidades: string[] | null;
  faixa_preco: '$' | '$$' | '$$$' | null;
  verificado: boolean;
  nota_media: number | string | null;
  total_avaliacoes: number | null;
  produto_destaque: string | null;
  produto_destaque_preco: number | string | null;
  produto_destaque_a_partir_de: boolean | null;
  produto_destaque_descricao: string | null;
  promocao: string | null;
}

interface EventoRow {
  id: string;
  slug: string | null;
  titulo: string;
  descricao: string | null;
  local: string | null;
  data_inicio: string;
  data_fim: string | null;
  horario: string | null;
  categoria: LocalEvent['category'] | null;
  selo: string | null;
  imagem_url: string | null;
  link_url: string | null;
}

interface DepoimentoRow {
  id: string;
  autor: string;
  funcao: string | null;
  localizacao: string | null;
  avatar_url: string | null;
  conteudo: string;
  nota: number;
}

const mapPraia = (r: PraiaRow): BeachCondition => ({
  id: r.slug,
  dbId: r.id,
  name: r.nome,
  subtitle: r.subtitulo ?? '',
  tagline: r.slogan ?? '',
  image: r.imagem_url ?? '',
  swellHeight: r.altura_ondas ?? '-',
  swellPeriod: r.periodo_ondas ?? '-',
  swellDirection: r.direcao_ondas ?? '-',
  windSpeed: r.vento_velocidade ?? '-',
  windDirection: r.vento_direcao ?? '-',
  waterTemp: r.temperatura_agua ?? '-',
  tide: r.mare ?? 'Estável',
  tideLevel: r.nivel_mare ?? '-',
  crowdLevel: r.lotacao ?? 'Moderado',
  safetyFlag: r.bandeira,
  safetyMessage: r.mensagem_seguranca ?? '',
  idealFor: r.ideal_para ?? [],
  features: r.recursos ?? [],
});

const mapPlano = (r: PlanoRow): MerchantTier => ({
  id: r.codigo,
  name: r.nome,
  badge: r.selo ?? '',
  price: formatPlanPrice(Number(r.preco_mensal)),
  period: r.periodo ?? '',
  description: r.descricao ?? '',
  features: r.recursos ?? [],
  highlight: r.destaque,
  ctaText: r.texto_botao ?? 'Cadastrar',
});

const mapComerciante = (r: ComercianteRow): KioskMerchant => ({
  id: r.id,
  slug: r.slug ?? undefined,
  name: r.nome_negocio,
  category: r.categoria,
  beach: r.praia_nome ?? 'Outra região de Saquarema',
  rating: Number(r.nota_media) || 0,
  reviewCount: r.total_avaliacoes ?? 0,
  verified: r.verificado,
  image: r.fotos?.[0] ?? '',
  specialty: r.descricao ?? '',
  priceRange: r.faixa_preco ?? undefined,
  amenities: r.comodidades ?? [],
  whatsAppNumber: r.whatsapp,
  instagram: r.instagram ?? undefined,
  featuredDish: r.produto_destaque ?? undefined,
  featuredPrice:
    r.produto_destaque_preco != null
      ? formatPrice(Number(r.produto_destaque_preco), r.produto_destaque_a_partir_de ?? false)
      : undefined,
  featuredNote: r.produto_destaque_descricao ?? undefined,
  distanceOrAddress: r.endereco ?? r.praia_nome ?? 'Saquarema, RJ',
  promo: r.promocao ?? undefined,
  lat: r.latitude != null ? Number(r.latitude) : undefined,
  lng: r.longitude != null ? Number(r.longitude) : undefined,
});

const mapEvento = (r: EventoRow): LocalEvent => ({
  id: r.slug ?? r.id,
  title: r.titulo,
  date: formatDateRange(r.data_inicio, r.data_fim),
  time: r.horario ?? '',
  location: r.local ?? '',
  category: r.categoria ?? 'Surf & Esporte',
  image: r.imagem_url ?? '',
  description: r.descricao ?? '',
  badge: r.selo ?? 'Evento',
  link: r.link_url ?? undefined,
});

const mapDepoimento = (r: DepoimentoRow): Testimonial => ({
  id: r.id,
  author: r.autor,
  role: r.funcao ?? '',
  location: r.localizacao ?? '',
  avatar: r.avatar_url ?? '',
  content: r.conteudo,
  rating: r.nota,
});

export interface NewMerchantInput {
  usuarioId: string;
  nome: string;
  categoria: MerchantCategory;
  praiaId: string | null;
  whatsapp: string;
  instagram: string | null;
  endereco: string | null;
  descricao: string | null;
  planoSolicitado: PlanCode;
}

export interface MyBusiness {
  id: string;
  nome: string;
  categoria: string;
  plano: PlanCode;
  planoSolicitado: PlanCode | null;
  status: 'ativo' | 'inativo' | 'suspenso';
  verificado: boolean;
  praia: string | null;
}

export interface Review {
  id: string;
  nota: number;
  comentario: string | null;
  autor: string;
  data: string;
}

export interface SaveReviewInput {
  existingId?: string;
  userId: string;
  comercianteId: string;
  nota: number;
  comentario: string | null;
}

export function createApi(client: SupabaseClient) {
  async function fetchPraias(): Promise<BeachCondition[]> {
    const { data, error } = await client.from('praias').select('*').order('ordem');
    if (error) throw error;
    return ((data ?? []) as PraiaRow[]).map(mapPraia);
  }

  async function fetchPlanos(): Promise<MerchantTier[]> {
    const { data, error } = await client.from('planos').select('*').order('ordem');
    if (error) throw error;
    return ((data ?? []) as PlanoRow[]).map(mapPlano);
  }

  /** Estabelecimentos ativos, com os planos pagos primeiro (posicionamento prioritário). */
  async function fetchComerciantes(): Promise<KioskMerchant[]> {
    const { data, error } = await client
      .from('vw_comerciantes')
      .select('*')
      .order('plano_ordem', { ascending: false })
      .order('nota_media', { ascending: false })
      .order('nome_negocio');
    if (error) throw error;
    return ((data ?? []) as ComercianteRow[]).map(mapComerciante);
  }

  async function fetchEventos(): Promise<LocalEvent[]> {
    const { data, error } = await client
      .from('eventos')
      .select('*')
      .eq('tipo', 'evento')
      .order('data_inicio', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as EventoRow[]).map(mapEvento);
  }

  async function fetchDepoimentos(): Promise<Testimonial[]> {
    const { data, error } = await client.from('depoimentos').select('*').eq('ativo', true).order('ordem');
    if (error) throw error;
    return ((data ?? []) as DepoimentoRow[]).map(mapDepoimento);
  }

  async function fetchPerfil(userId: string): Promise<Profile | null> {
    const { data, error } = await client
      .from('usuarios')
      .select('id, nome, email, tipo')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return (data as Profile | null) ?? null;
  }

  async function fetchMeusComerciantes(userId: string): Promise<MyBusiness[]> {
    const { data, error } = await client
      .from('comerciantes')
      .select('id, nome_negocio, categoria, plano_codigo, plano_solicitado, status, verificado, praias(nome)')
      .eq('usuario_id', userId)
      .order('criado_em', { ascending: false });
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data ?? []) as any[]).map((r) => ({
      id: r.id,
      nome: r.nome_negocio,
      categoria: r.categoria,
      plano: r.plano_codigo,
      planoSolicitado: r.plano_solicitado,
      status: r.status,
      verificado: r.verificado,
      praia: r.praias?.nome ?? null,
    }));
  }

  async function criarComerciante(input: NewMerchantInput): Promise<{ id: string }> {
    const { data, error } = await client
      .from('comerciantes')
      .insert({
        usuario_id: input.usuarioId,
        nome_negocio: input.nome,
        categoria: input.categoria,
        praia_id: input.praiaId,
        whatsapp: input.whatsapp,
        instagram: input.instagram,
        endereco: input.endereco,
        descricao: input.descricao,
        plano_solicitado: input.planoSolicitado === 'gratuito' ? null : input.planoSolicitado,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data as { id: string };
  }

  async function fetchAvaliacoes(comercianteId: string, limit = 5): Promise<Review[]> {
    const { data, error } = await client
      .from('avaliacoes')
      .select('id, nota, comentario, autor_nome, data')
      .eq('comerciante_id', comercianteId)
      .not('comentario', 'is', null)
      .order('atualizado_em', { ascending: false })
      .limit(limit);
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data ?? []) as any[]).map((r) => ({
      id: r.id,
      nota: r.nota,
      comentario: r.comentario,
      autor: r.autor_nome,
      data: r.data,
    }));
  }

  async function fetchMinhaAvaliacao(
    comercianteId: string,
    userId: string
  ): Promise<{ id: string; nota: number; comentario: string | null } | null> {
    const { data, error } = await client
      .from('avaliacoes')
      .select('id, nota, comentario')
      .eq('comerciante_id', comercianteId)
      .eq('usuario_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data as { id: string; nota: number; comentario: string | null } | null;
  }
  
  async function salvarAvaliacao(input: SaveReviewInput): Promise<void> {
    if (input.existingId) {
      const { data, error } = await client
        .from('avaliacoes')
        .update({ nota: input.nota, comentario: input.comentario })
        .eq('id', input.existingId)
        .select('id');
      if (error) throw error;
      if (!data || data.length === 0) throw { code: '42501', message: 'avaliação não encontrada' };
      return;
    }
    const { error } = await client.from('avaliacoes').insert({
      usuario_id: input.userId,
      comerciante_id: input.comercianteId,
      nota: input.nota,
      comentario: input.comentario,
    });
    if (error) throw error;
  }

  return {
    fetchPraias,
    fetchPlanos,
    fetchComerciantes,
    fetchEventos,
    fetchDepoimentos,
    fetchPerfil,
    fetchMeusComerciantes,
    criarComerciante,
    fetchAvaliacoes,
    fetchMinhaAvaliacao,
    salvarAvaliacao,
  };
}

export const api = createApi(supabase);
export type Api = ReturnType<typeof createApi>;
