import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { translateDbError } from '../lib/validation';
import type { BeachCondition, KioskMerchant, LocalEvent, MerchantTier, Testimonial } from '../types';

interface DataContextValue {
  beaches: BeachCondition[];
  merchants: KioskMerchant[];
  events: LocalEvent[];
  testimonials: Testimonial[];
  plans: MerchantTier[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  refreshMerchants: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [beaches, setBeaches] = useState<BeachCondition[]>([]);
  const [merchants, setMerchants] = useState<KioskMerchant[]>([]);
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [plans, setPlans] = useState<MerchantTier[]>([]);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(
    isSupabaseConfigured ? null : 'O Supabase ainda não foi configurado (arquivo .env).'
  );

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const results = await Promise.allSettled([
      api.fetchPraias(),
      api.fetchComerciantes(),
      api.fetchEventos(),
      api.fetchDepoimentos(),
      api.fetchPlanos(),
    ]);
    const [praias, comerciantes, eventos, depoimentos, planos] = results;

    if (praias.status === 'fulfilled') setBeaches(praias.value);
    if (comerciantes.status === 'fulfilled') setMerchants(comerciantes.value);
    if (eventos.status === 'fulfilled') setEvents(eventos.value);
    if (depoimentos.status === 'fulfilled') setTestimonials(depoimentos.value);
    if (planos.status === 'fulfilled') setPlans(planos.value);

    const firstFailure = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
    setError(firstFailure ? translateDbError(firstFailure.reason) : null);
    setLoading(false);
  }, []);

  const refreshMerchants = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      setMerchants(await api.fetchComerciantes());
    } catch (err) {
      setError(translateDbError(err));
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo(
    () => ({ beaches, merchants, events, testimonials, plans, loading, error, reload, refreshMerchants }),
    [beaches, merchants, events, testimonials, plans, loading, error, reload, refreshMerchants]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData precisa estar dentro de <DataProvider>.');
  return ctx;
}
