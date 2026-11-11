import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Check,
  ArrowRight,
  MapPin,
  Star,
  MessageCircle,
  ShieldCheck,
  Waves,
  LifeBuoy,
  UtensilsCrossed,
  Palmtree,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface InteractiveFinderProps {
  onGoToMarketplace: (category?: string) => void;
}

type VibeType = 'surf' | 'familia' | 'quiosque' | 'paz';

interface VibeOption {
  id: VibeType;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  matchedBeachId: string;
  matchedKioskId: string;
  badge: string;
}

export const InteractiveFinder: React.FC<InteractiveFinderProps> = ({ onGoToMarketplace }) => {
  const [selectedVibe, setSelectedVibe] = useState<VibeType>('surf');
  const [requireShower, setRequireShower] = useState<boolean>(true);
  const [requirePetFriendly, setRequirePetFriendly] = useState<boolean>(false);
  const { beaches, merchants, loading } = useData();

  const vibeOptions: VibeOption[] = [
    {
      id: 'surf',
      icon: Waves,
      title: 'Quero Surf de Alta Performance',
      subtitle: 'Ondas tubulares, esquerdas lendárias e clima da WSL',
      matchedBeachId: 'itauna',
      matchedKioskId: 'escola-surf-saqua',
      badge: 'Capital Nacional do Surf',
    },
    {
      id: 'familia',
      icon: LifeBuoy,
      title: 'Família & Crianças Pequenas',
      subtitle: 'Águas calmas, segurança, sombra e sem perigo de correnteza',
      matchedBeachId: 'lagoa',
      matchedKioskId: 'sup-lagoa-aventura',
      badge: 'Zero Correnteza • Água Morna',
    },
    {
      id: 'quiosque',
      icon: UtensilsCrossed,
      title: 'Petiscos, Caipirinha & Música',
      subtitle: 'Pastel de camarão, peixe frito, cerveja gelada e ducha doce',
      matchedBeachId: 'vila',
      matchedKioskId: 'quiosque-do-russo',
      badge: 'Orla Gastronômica',
    },
    {
      id: 'paz',
      icon: Palmtree,
      title: 'Sossego, Natureza & Descanso',
      subtitle: 'Areia espaçosa, tranquilidade para ler e contemplar o mar',
      matchedBeachId: 'jacone',
      matchedKioskId: 'mate-artesanal-ze',
      badge: 'Paz & Desconexão',
    },
  ];

  const currentVibe = vibeOptions.find((v) => v.id === selectedVibe)!;
  const matchedBeach = beaches.find((b) => b.id === currentVibe.matchedBeachId);
  // primeiro o ponto sugerido para essa vibe; se ele não existir mais, qualquer um da mesma praia
  const matchedKiosk =
    merchants.find((k) => k.slug === currentVibe.matchedKioskId) ??
    merchants.find((k) => k.beach === matchedBeach?.name);

  if (!matchedBeach) {
    return (
      <section id="encontre-sua-praia" className="py-16 lg:py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          {loading ? 'Carregando sugestões...' : 'Sugestões indisponíveis no momento.'}
        </div>
      </section>
    );
  }

  return (
    <section id="encontre-sua-praia" className="py-16 lg:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#004F8A] bg-[#004F8A]/10 px-3.5 py-1.5 rounded-full mb-3">
            <Compass className="w-3.5 h-3.5 text-[#4FA8D8]" />
            <span>Guia Personalizado em 2 Cliques</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[#0A1E2F] tracking-tight">
            Qual é a sua vibe de praia hoje?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            O algoritmo do SAQUA ON analisa a previsão marítima ao vivo, vento e estrutura para indicar o local
            exato para o seu dia perfeito.
          </p>
        </div>

        {/* 4 Interactive Vibe Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {vibeOptions.map((opt) => {
            const isSelected = selectedVibe === opt.id;
            const IconComponent = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedVibe(opt.id)}
                className={`flex flex-col text-left p-5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#004F8A] text-white border-[#004F8A] shadow-xl shadow-[#004F8A]/25 scale-[1.02]'
                    : 'bg-[#FAF5EE] text-slate-800 border-slate-200 hover:border-[#4FA8D8] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-[#4FA8D8]'
                        : 'bg-[#004F8A]/10 text-[#004F8A]'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-[#4FA8D8] text-[#004F8A] flex items-center justify-center font-bold text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h3 className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-[#0A1E2F]'}`}>
                  {opt.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-white/80' : 'text-slate-600'}`}>
                  {opt.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quick Amenities Filter checkmarks */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs font-semibold">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Filtros extras:</span>
          <button
            type="button"
            onClick={() => setRequireShower(!requireShower)}
            className={`px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
              requireShower
                ? 'bg-[#004F8A] text-white border-[#004F8A]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${requireShower ? 'opacity-100' : 'opacity-40'}`} />
            <span>Exigir Ducha de Água Doce</span>
          </button>

          <button
            type="button"
            onClick={() => setRequirePetFriendly(!requirePetFriendly)}
            className={`px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${
              requirePetFriendly
                ? 'bg-[#004F8A] text-white border-[#004F8A]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${requirePetFriendly ? 'opacity-100' : 'opacity-40'}`} />
            <span>Aceita Animais (Pet Friendly)</span>
          </button>
        </div>

        {/* Matched Result Card (Persuasive Recommendation) */}
        <div className="bg-[#FAF5EE] rounded-3xl p-6 sm:p-8 border border-[#004F8A]/15 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#4FA8D8]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left Result Image */}
            <div className="w-full lg:w-5/12 shrink-0">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-md group">
                <img
                  src={matchedBeach.image}
                  alt={matchedBeach.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#004F8A] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#4FA8D8]" />
                  <span>Sua Combinação Ideal</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {matchedBeach.swellHeight} • {matchedBeach.windSpeed}
                </div>
              </div>
            </div>

            {/* Right Result Details */}
            <div className="w-full lg:w-7/12 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-extrabold text-[#004F8A] bg-[#4FA8D8]/20 px-2.5 py-0.5 rounded-md uppercase">
                  {currentVibe.badge}
                </span>
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <span>•</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Avaliação 4.9</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-display text-[#0A1E2F] mb-2">
                {matchedBeach.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-normal">
                {matchedBeach.tagline}. Com condições ideais para o seu objetivo de hoje ({currentVibe.title}),
                vento favorável ({matchedBeach.windDirection}) e águas a {matchedBeach.waterTemp}.
              </p>

              {/* Recommended Kiosk / Partner inside the beach */}
              {matchedKiosk && (
              <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-6 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Ponto Recomendado no SAQUA ON nesta praia:
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#0A1E2F]">{matchedKiosk.name}</h4>
                      {matchedKiosk.verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    </div>
                    {matchedKiosk.featuredDish && (
                      <p className="text-xs text-slate-600 mt-0.5">
                        Destaque: <strong className="text-slate-800">{matchedKiosk.featuredDish}</strong>
                        {matchedKiosk.featuredPrice ? ` (${matchedKiosk.featuredPrice})` : ''}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {matchedKiosk.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${matchedKiosk.whatsAppNumber}?text=${encodeURIComponent(
                      `Olá! Vi o ${matchedKiosk.name} no app SAQUA ON e queria informações sobre vagas e cardápio de hoje!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Direto</span>
                  </a>
                </div>
              </div>
              )}

              {/* Action Button */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <a
                  href="#marketplace"
                  onClick={() => onGoToMarketplace()}
                  className="w-full sm:w-auto bg-[#004F8A] hover:bg-[#003866] text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Explorar Todos os Quiosques em {matchedBeach.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
