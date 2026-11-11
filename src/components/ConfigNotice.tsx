import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

/** Aparece só quando o .env ainda não foi preenchido (ajuda a achar o problema rápido). */
export const ConfigNotice: React.FC = () => {
  if (isSupabaseConfigured) return null;
  return (
    <div role="alert" className="bg-amber-100 border-b border-amber-300 text-amber-900 text-xs sm:text-sm px-4 py-2.5 flex items-start sm:items-center justify-center gap-2 text-center">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
      <span>
        Supabase não configurado: copie <code className="font-bold">.env.example</code> para <code className="font-bold">.env</code> e
        preencha <code className="font-bold">VITE_SUPABASE_URL</code> e <code className="font-bold">VITE_SUPABASE_ANON_KEY</code>.
      </span>
    </div>
  );
};
