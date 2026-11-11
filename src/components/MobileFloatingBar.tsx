import React from 'react';
import { Waves, Compass, Store, Volume2 } from 'lucide-react';
import { oceanAudio } from '../utils/oceanAudio';

interface MobileFloatingBarProps {
  onOpenMerchantModal: () => void;
  onOpenAppPreview: () => void;
}

export const MobileFloatingBar: React.FC<MobileFloatingBarProps> = ({
  onOpenMerchantModal,
  onOpenAppPreview,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF5EE]/95 backdrop-blur-md border-t border-[#004F8A]/15 py-2 px-3 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
        <a
          href="#radar"
          className="flex flex-col items-center justify-center text-center p-1 rounded-xl text-slate-700 hover:text-[#004F8A] active:scale-95 transition-all"
        >
          <Waves className="w-5 h-5 text-[#004F8A]" />
          <span className="text-[10px] font-bold mt-0.5">Radar Mar</span>
        </a>

        <a
          href="#encontre-sua-praia"
          className="flex flex-col items-center justify-center text-center p-1 rounded-xl text-slate-700 hover:text-[#004F8A] active:scale-95 transition-all"
        >
          <Compass className="w-5 h-5 text-[#004F8A]" />
          <span className="text-[10px] font-bold mt-0.5">Meu Ponto</span>
        </a>

        <a
          href="#marketplace"
          className="flex flex-col items-center justify-center text-center p-1 rounded-xl text-slate-700 hover:text-[#004F8A] active:scale-95 transition-all"
        >
          <Store className="w-5 h-5 text-[#004F8A]" />
          <span className="text-[10px] font-bold mt-0.5">Quiosques</span>
        </a>

        <button
          type="button"
          onClick={onOpenMerchantModal}
          className="flex flex-col items-center justify-center text-center p-1 rounded-xl bg-[#004F8A] text-white active:scale-95 transition-all shadow-xs"
        >
          <span className="text-[10px] font-black uppercase text-[#4FA8D8]">Comércio</span>
          <span className="text-[10px] font-extrabold leading-none mt-0.5">Anunciar</span>
        </button>
      </div>
    </div>
  );
};
