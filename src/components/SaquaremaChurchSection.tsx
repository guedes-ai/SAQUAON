import React from 'react';
import {
  Compass,
  Waves,
  Sun,
  Wind,
  Anchor,
  LifeBuoy,
  MapPin,
  Landmark,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface SaquaremaChurchSectionProps {
  onSelectBeach: (beachId: string) => void;
}

export const SaquaremaChurchSection: React.FC<SaquaremaChurchSectionProps> = ({ onSelectBeach }) => {
  return (
    <section id="igreja" className="relative py-14 lg:py-20 bg-white border-b border-slate-200/80 overflow-hidden scroll-mt-24">
      {/* Decorative subtle maritime background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4FA8D8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#004F8A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#004F8A] bg-[#004F8A]/10 px-3.5 py-1 rounded-full mb-3 border border-[#004F8A]/15">
              <Landmark className="w-3.5 h-3.5 text-[#004F8A]" />
              <span>Cartão-Postal Oficial & Patrimônio Histórico</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[#0A1E2F] tracking-tight">
              Igreja de Nossa Senhora de Nazareth
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Erguida em 1630 sobre o promontório rochoso que divide a orla histórica da Praia da Vila e as
              lendárias ondas de Itaúna, a igreja é o mirante natural e o símbolo eterno de Saquarema.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
            <Compass className="w-4 h-4 text-[#004F8A]" />
            <span>Coordenadas: 22°55&apos;42&quot;S 42°30&apos;38&quot;W</span>
          </div>
        </div>

        {/* Main Split Grid: Big Photo + Interactive Coastal Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left / Main Column: Church Image Card */}
          <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-100 flex flex-col justify-end min-h-[380px] sm:min-h-[460px]">
            <img
              src="/igreja_saquarema.jpg"
              alt="Igreja de Nossa Senhora de Nazareth em Saquarema"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlays for readability and contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E2F] via-[#0A1E2F]/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-extrabold text-[#004F8A] shadow-md border border-white/20">
                <Landmark className="w-3.5 h-3.5 text-[#004F8A]" />
                <span>Mirante 35m sobre o Mar</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#004F8A]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md border border-white/10">
                <Anchor className="w-3.5 h-3.5 text-[#4FA8D8]" />
                <span>Fundada em 1630</span>
              </div>
            </div>

            {/* Bottom Content overlay */}
            <div className="relative p-6 sm:p-8 text-white z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4FA8D8] uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>Colina dos Pescadores • Entre a Vila e Itaúna</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-display text-white mb-3 leading-snug">
                Onde a Fé, a Tradição Pesqueira e as Ondas Perfeitas se Encontram
              </h3>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl mb-4 font-normal">
                É do pátio gramado da igreja que surfistas profissionais e fotógrafos do mundo todo acompanham o
                desenhar das séries em Itaúna e o espetáculo do pôr do sol nas águas calmas da Praia da Vila.
              </p>

              {/* Quick links to beaches visible from the church */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => onSelectBeach('vila')}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3.5 py-2 rounded-xl backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ver Praia da Vila (Ao Sul)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectBeach('itauna')}
                  className="bg-[#4FA8D8] hover:bg-[#3A96C9] text-[#0A1E2F] text-xs font-black px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Waves className="w-3.5 h-3.5 text-[#004F8A]" />
                  <span>Ver Ondas de Itaúna (Ao Norte)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Coastal & Beach Elements Feature Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Card 1: Observatório do Swell */}
            <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-[#004F8A]/10 shadow-xs hover:border-[#4FA8D8]/50 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#004F8A]/10 text-[#004F8A] flex items-center justify-center shrink-0">
                  <Waves className="w-5 h-5 text-[#004F8A]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0A1E2F] mb-1">
                    Observatório Estratégico do Swell
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A elevação natural de 35 metros permite checar simultaneamente a formação das ondas nos dois
                    lados do promontório: os tubos pesados ao norte e as marolas suaves ao sul.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Leitura dos Ventos e Marés */}
            <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-[#004F8A]/10 shadow-xs hover:border-[#4FA8D8]/50 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0A1E2F] mb-1">
                    Rosa dos Ventos & Vento Terral
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ponto de referência centenário para os marinheiros e surfistas medirem a entrada do vento terral
                    (Norte/Nordeste), que alisa as faces das ondas no Maracanã do Surf.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Pôr do Sol & Tradição Pescadora */}
            <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-[#004F8A]/10 shadow-xs hover:border-[#4FA8D8]/50 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0A1E2F] mb-1">
                    Pôr do Sol Beira-Mar & Pescadores
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aos pés da colina fica o tradicional ponto de lançamento dos barcos de pesca artesanal de
                    Saquarema e os quiosques de frutos do mar frescos da Praia da Vila.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Alertas em Tempo Real no SAQUA ON */}
            <div className="bg-[#004F8A] text-white p-5 rounded-2xl shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0 border border-white/15">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Monitore as Praias ao Vivo</h4>
                  <p className="text-xs text-white/80">Boletins atualizados a cada 15 minutos</p>
                </div>
              </div>

              <a
                href="#radar"
                className="bg-[#4FA8D8] hover:bg-[#3A96C9] text-[#0A1E2F] text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Acessar Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
