export type SafetyFlag = 'verde' | 'amarela' | 'vermelha';

export type PlanCode = 'gratuito' | 'pago' | 'premium';
export type UserType = 'turista' | 'morador' | 'comerciante' | 'administrador';
export type SignupType = 'turista' | 'morador' | 'comerciante';
export type MerchantCategory = 'Quiosque' | 'Restaurante' | 'Escola de Surf' | 'Pousada' | 'Ambulante';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
}

export interface BeachCondition {
  id: string; 
  dbId: string; 
  name: string;
  subtitle: string;
  tagline: string;
  image: string;
  swellHeight: string;
  swellPeriod: string;
  swellDirection: string;
  windSpeed: string;
  windDirection: string;
  waterTemp: string;
  tide: 'Baixa' | 'Enchendo' | 'Alta' | 'Vazando' | 'Estável';
  tideLevel: string;
  crowdLevel: 'Tranquilo' | 'Moderado' | 'Movimentado' | 'Lotado';
  safetyFlag: SafetyFlag;
  safetyMessage: string;
  idealFor: string[];
  features: string[];
}

export interface KioskMerchant {
  id: string; 
  slug?: string;
  name: string;
  category: MerchantCategory;
  beach: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  image: string;
  specialty: string;
  priceRange?: '$' | '$$' | '$$$';
  amenities: string[];
  whatsAppNumber: string;
  instagram?: string;
  featuredDish?: string;
  featuredPrice?: string;
  featuredNote?: string;
  distanceOrAddress: string;
  promo?: string;
  lat?: number;
  lng?: number;
}

export interface LocalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Surf & Esporte' | 'Música & Cultura' | 'Gastronomia' | 'Sustentabilidade';
  image: string;
  description: string;
  badge: string;
  link?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface MerchantTier {
  id: PlanCode;
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  ctaText: string;
}
