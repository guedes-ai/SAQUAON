import React, { useEffect, useState } from 'react';
import { X, Waves, Check } from 'lucide-react';
import { SaquaOnLogo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface UserExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Tela de boas-vindas para quem já está logado. O cadastro de verdade
 * acontece no AuthModal (conta criada no Supabase Auth).
 */
export const UserExperienceModal: React.FC<UserExperienceModalProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();
  const [simulatedPush, setSimulatedPush] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSimulatedPush(false);
      return;
    }
    const timer = setTimeout(() => setSimulatedPush(true), 1200);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const firstName = profile?.nome?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Banhista';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#004F8A] text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <SaquaOnLogo variant="symbol" size="sm" inverted />
            <span className="text-[11px] font-bold tracking-widest text-[#4FA8D8] uppercase">
              Acesso Gratuito à Plataforma
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-display leading-snug">
            Viva a Melhor Experiência de Saquarema
          </h3>
          <p className="text-xs text-white/80 mt-1">
            Receba alertas de ondas em tempo real, câmeras ao vivo e descontos exclusivos nos quiosques.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-2">Boas-vindas ao SAQUA ON, {firstName}!</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto mb-6">
              Sua conta está ativa. Você já está conectado à rede oficial de praias e quiosques de Saquarema e pode
              avaliar os locais que visitar.
            </p>

            {/* Simulated Notification on Phone Screen */}
            {simulatedPush ? (
              <div className="mb-6 p-3.5 bg-slate-900 text-white rounded-2xl text-left border border-slate-700 shadow-lg animate-in slide-in-from-top duration-300">
                <div className="flex items-center justify-between mb-1.5 text-[11px] text-[#4FA8D8] font-bold">
                  <div className="flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5" />
                    <span>SAQUA ON • ALERTA DE PRAIA</span>
                  </div>
                  <span className="text-slate-400">Agora</span>
                </div>
                <h5 className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Swell Épico em Itaúna!</span>
                  <Waves className="w-3.5 h-3.5 text-[#4FA8D8]" />
                </h5>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Ondas de 2.2m com vento terral e maré favorável. Os quiosques do Posto 1 estão com mesas abertas e
                  ducha livre.
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-slate-100 rounded-xl text-xs text-slate-500 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#004F8A] animate-ping" />
                <span>Sincronizando com as boias marítimas de Saquarema...</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#004F8A] hover:bg-[#003866] text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer"
            >
              Acessar Plataforma Web Completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
