import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Waves,
  Wind,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  LifeBuoy
} from 'lucide-react';

interface BeachRadarProps {
  selectedBeachId?: string;
  onFilterMarketplaceByBeach: (beachName: string) => void;
}

export const BeachRadar: React.FC<BeachRadarProps> = ({
  selectedBeachId,
  onFilterMarketplaceByBeach,
}) => {
  const { beaches, loading, error } = useData();
  const [activeId, setActiveId] = useState<string | undefined>(selectedBeachId);

  // quando outra parte do site escolhe uma praia (Hero, Igreja), o radar acompanha
  useEffect(() => {
    if (selectedBeachId) setActiveId(selectedBeachId);
  }, [selectedBeachId]);

  const activeBeach = beaches.find((b) => b.id === activeId) ?? beaches[0];

  if (!activeBeach) {
    return (
      <section id="radar" className="py-20 lg:py-32 bg-white scroll-mt-10 border-b border-[#EAE5D9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-sm text-slate-500">
          {loading ? 'Carregando condições do mar...' : error ?? 'Nenhuma praia cadastrada ainda.'}
        </div>
      </section>
    );
  }

  return (
    <section id="radar" className="py-20 lg:py-32 bg-white scroll-mt-10 border-b border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Copy & Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-[2.75rem] lg:text-[3.5rem] font-display font-black text-[#0A0F16] leading-[1.05] tracking-tight mb-6">
              Entenda o mar com precisão.
            </h2>
            <p className="text-lg text-[#4A5568] font-light leading-relaxed mb-8">
              Junte-se aos surfistas e moradores que usam o SAQUA ON para saber o ritmo exato da maré. Seguro, rápido e atualizado.
            </p>

            <button
              onClick={() => onFilterMarketplaceByBeach(activeBeach.name)}
              className="bg-[#0A0F16] text-white font-bold text-sm px-6 py-4 rounded-sm hover:bg-[#1A202C] transition-colors w-max mb-12"
            >
              Explorar Quiosques Locais
            </button>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-4xl font-display font-black text-[#0A0F16]">{beaches.length}+</p>
                <p className="text-xs text-[#4A5568] mt-1 font-medium">Praias Mapeadas</p>
              </div>
              <div>
                <p className="text-4xl font-display font-black text-[#0A0F16]">24/7</p>
                <p className="text-xs text-[#4A5568] mt-1 font-medium">Cobertura Local</p>
              </div>
            </div>

            {/* Beach Selector (Minimalist Tabs) */}
            <div className="mt-auto">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-widest mb-4">
                Selecione o Pico
              </p>
              <div className="flex flex-wrap gap-2">
                {beaches.map((beach) => (
                  <button
                    key={beach.id}
                    onClick={() => setActiveId(beach.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-sm transition-all border ${
                      activeBeach.id === beach.id
                        ? 'bg-[#004F8A] text-white border-[#004F8A]'
                        : 'bg-transparent text-[#4A5568] border-[#EAE5D9] hover:border-[#CBD5E0]'
                    }`}
                  >
                    {beach.name.replace('Praia de ', '').replace('Praia da ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Bento Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            
            {/* Top Box: Security & Flags (Spans 2 cols) */}
            <div className="md:col-span-2 bg-[#0A1E2F] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
              {/* Background abstract ring purely for subtle elegance, not neon glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 border-[1px] border-white/5 rounded-full" />
              <div className="absolute -top-12 -right-12 w-48 h-48 border-[1px] border-white/10 rounded-full" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-6 backdrop-blur-md">
                  {activeBeach.safetyFlag === 'verde' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : activeBeach.safetyFlag === 'amarela' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  )}
                </div>
                <p className="text-[#94A3B8] text-sm font-medium mb-2">Segurança Marítima</p>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white max-w-sm leading-tight">
                  {activeBeach.safetyFlag === 'verde' 
                    ? 'Mar calmo e seguro para a família.'
                    : activeBeach.safetyFlag === 'amarela'
                    ? 'Atenção redobrada nas valas e correntes.'
                    : 'Mar perigoso. Restrito a surfistas.'}
                </h3>
              </div>
            </div>

            {/* Bottom Left Box: Swell & Wind */}
            <div className="bg-[#E6F0F9] rounded-2xl p-8 flex flex-col justify-between min-h-[220px]">
              <div>
                <p className="text-[#4A5568] text-sm font-medium mb-1">Ondulação & Vento</p>
                <p className="text-3xl font-display font-black text-[#004F8A]">
                  {activeBeach.swellHeight}
                </p>
                <p className="text-sm font-bold text-[#4A5568] mt-1">
                  Vento {activeBeach.windDirection}
                </p>
              </div>
              
              <div className="flex items-center gap-2 mt-6">
                <Waves className="w-5 h-5 text-[#004F8A] opacity-50" />
                <Wind className="w-5 h-5 text-[#004F8A] opacity-50" />
              </div>
            </div>

            {/* Bottom Right Box: Water Temp & Tide */}
            <div className="bg-[#F2EDE4] rounded-2xl p-8 flex flex-col justify-between min-h-[220px]">
              <div>
                <p className="text-[#5C5346] text-sm font-medium mb-1">Temperatura</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-black text-[#0A0F16]">
                    {activeBeach.waterTemp}
                  </p>
                  <span className="text-sm font-bold text-[#5C5346] uppercase">Água</span>
                </div>
                <p className="text-sm font-medium text-[#5C5346] mt-2 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4" />
                  Sol 29°C
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#EAE5D9]">
                <p className="text-xs font-bold text-[#5C5346] uppercase tracking-wider mb-1">Maré Atual</p>
                <p className="text-lg font-bold text-[#0A0F16]">{activeBeach.tide}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
