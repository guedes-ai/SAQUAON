import React from 'react';
import { MapPin } from 'lucide-react';

interface HeroProps {
  onOpenMerchantModal: () => void;
  onSelectBeach: (beachId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenMerchantModal }) => {
  return (
    <section className="relative w-full bg-[#FAF9F6] pt-16 pb-24 overflow-hidden border-b border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col items-start relative z-10">
            {/* Minimal Tag */}
            <div className="inline-flex items-center gap-2 bg-[#F2EDE4] text-[#5C5346] px-3 py-1 rounded-sm text-xs font-bold tracking-[0.2em] uppercase mb-8">
              <MapPin className="w-3.5 h-3.5" />
              <span>Saquarema, RJ</span>
            </div>

            {/* Massive Editorial Title */}
            <h1 className="text-[3.5rem] leading-[1.05] sm:text-[4.5rem] lg:text-[5.5rem] font-display font-black text-[#0A0F16] tracking-tight">
              Viva a <span className="text-[#004F8A]">verdadeira</span> <br />
              Saquarema.
            </h1>

            {/* Human Copy */}
            <p className="mt-8 text-lg sm:text-xl text-[#4A5568] max-w-md leading-relaxed font-light">
              Esqueça os roteiros prontos. Descubra onde o mar está liso, qual quiosque serve peixe fresco e o que está acontecendo agora. Feito por quem é daqui.
            </p>

            {/* Avatars & Info */}
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center -space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Local 1" className="w-12 h-12 rounded-full border-2 border-[#FAF9F6] object-cover" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Local 2" className="w-12 h-12 rounded-full border-2 border-[#FAF9F6] object-cover" />
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Local 3" className="w-12 h-12 rounded-full border-2 border-[#FAF9F6] object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0A0F16]">Comunidade Local</p>
                <p className="text-xs text-[#4A5568]">Atualizado em tempo real</p>
              </div>
            </div>

            {/* Custom Arrow connecting left to right */}
            <div className="hidden lg:block absolute -right-8 bottom-16 text-[#0A0F16]">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                <path d="M10 10 Q 50 100 110 90" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M95 75 L 110 90 L 95 105" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] aspect-[4/5] bg-white p-3 sm:p-4 shadow-xs border border-[#EAE5D9]">
              <img 
                src="./public/praiaitaunawsl.jpg" 
                alt="Surfista em Saquarema" 
                className="w-full h-full object-cover grayscale-[15%] contrast-110"
              />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-xs font-bold tracking-widest uppercase mb-1 drop-shadow-md">Itaúna</p>
                  <p className="text-sm font-light drop-shadow-md">A capital do surf.</p>
                </div>
                <button 
                  onClick={onOpenMerchantModal}
                  className="bg-white text-[#0A0F16] text-xs font-bold px-4 py-2 rounded-sm hover:bg-[#F2EDE4] transition-colors"
                >
                  Sou Comerciante
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
