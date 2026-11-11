import React from 'react';
import { useData } from '../context/DataContext';
import { FALLBACK_IMAGE } from '../lib/placeholders';
import { Trophy, Calendar, MapPin, Clock, Sparkles, Flag, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

interface SurfCapitalWslProps {
  onOpenAppPreview: () => void;
}

export const SurfCapitalWsl: React.FC<SurfCapitalWslProps> = ({ onOpenAppPreview }) => {
  const { events, loading, error } = useData();

  return (
    <section id="eventos" className="py-16 lg:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WSL Special Feature Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0A1E2F] text-white p-6 sm:p-10 lg:p-12 mb-16 shadow-2xl border border-slate-800">
          {/* Background image & gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80"
              alt="Surf em Itaúna Saquarema"
              className="w-full h-full object-cover opacity-25"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1E2F] via-[#0A1E2F]/90 to-[#0A1E2F]/60" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 bg-[#4FA8D8]/20 text-[#4FA8D8] text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full mb-4 border border-[#4FA8D8]/30">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Capital Nacional do Surf & Etapa Mundial WSL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight mb-4">
                O Maracanã do Surf Mundial Vive no SAQUA ON
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl mb-6">
                Saquarema não é apenas uma praia: é o templo sagrado das ondas no Brasil. Aqui, as ondulações
                quebradas na lendária bancada de Itaúna e na Barrinha reúnem os campeões do mundo. Com o SAQUA ON,
                você recebe alertas de swell épico, janelas de bateria da WSL e programação cultural completa.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-white/90">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <Flag className="w-3.5 h-3.5 text-[#4FA8D8]" />
                  <span>Palco Oficial WSL Vivo Rio Pro</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Boletim das Escolas de Surf Locais</span>
                </div>
              </div>
            </div>

            {/* Event Highlight Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-widest block mb-1">
                Próximo Grande Evento
              </span>
              <h3 className="text-xl font-bold font-display text-white mb-2">WSL Vivo Rio Pro Saquarema</h3>
              <p className="text-xs text-white/70 mb-4">20 a 28 de Junho de 2026 • Praia de Itaúna</p>

              <div className="bg-[#004F8A]/80 p-3 rounded-xl mb-5 text-left text-xs text-white/90 border border-[#4FA8D8]/30">
                <p className="font-bold text-[#4FA8D8] mb-1">Dica de Ouro:</p>
                Os quiosques de Itaúna lotam cedo durante a janela da WSL. Use o SAQUA ON para ver a lotação em tempo
                real e reservar mesas parceiras.
              </div>

              <button
                type="button"
                onClick={onOpenAppPreview}
                className="w-full bg-[#4FA8D8] hover:bg-[#3A96C9] text-[#0A1E2F] font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Receber Alertas do Evento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Local Events Calendar Grid */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#004F8A] bg-[#004F8A]/10 px-3 py-1 rounded-full mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#4FA8D8]" />
                <span>Calendário Oficial de Saquarema</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-[#0A1E2F]">
                O Que Rola na Cidade: Esporte, Música & Gastronomia
              </h3>
            </div>
          </div>

          {events.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-10">
              {loading ? 'Carregando eventos...' : error ?? 'Nenhum evento cadastrado no momento.'}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-[#FAF5EE] rounded-2xl overflow-hidden border border-[#004F8A]/10 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="relative aspect-16/10 overflow-hidden">
                    <img
                      src={event.image || FALLBACK_IMAGE}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#004F8A] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                      {event.badge}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-[#004F8A] font-bold mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#4FA8D8]" />
                      <span>{event.date}</span>
                    </div>

                    <h4 className="font-bold text-base text-[#0A1E2F] group-hover:text-[#004F8A] transition-colors leading-snug mb-2">
                      {event.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-200/60 mt-1 flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 py-2">
                    <MapPin className="w-3.5 h-3.5 text-[#004F8A] shrink-0" />
                    <span className="truncate font-medium">{event.location}</span>
                  </div>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#0A1E2F] hover:bg-[#004F8A] text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Acessar Site Oficial</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
