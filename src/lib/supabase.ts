import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

function isHttpUrl(value?: string): boolean {
  try {
    const url = new URL(value ?? '');
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured =
  isHttpUrl(supabaseUrl) && Boolean(supabaseKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[SAQUA ON] Supabase não configurado. Copie .env.example para .env e preencha ' +
      'VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  );
}
export interface AuthRedirectInfo {
  recovery: boolean;
  error: boolean;
}

function readAuthRedirect(): AuthRedirectInfo {
  if (typeof window === 'undefined') {
    return { recovery: false, error: false };
  }

  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, '')
  );

  const searchParams = new URLSearchParams(
    window.location.search
  );

  const getParam = (key: string) =>
    hashParams.get(key) ?? searchParams.get(key);

  return {
    recovery: getParam('type') === 'recovery',
    error: Boolean(
      getParam('error_description') || getParam('error_code')
    ),
  };
}
export const authRedirect: AuthRedirectInfo = readAuthRedirect();
export const supabase = createClient(
  isSupabaseConfigured
    ? supabaseUrl!
    : 'http://localhost:54321',

  isSupabaseConfigured
    ? supabaseKey!
    : 'chave-nao-configurada',

  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
