import React, { useEffect, useId, useState } from 'react';
import { X, Star, Loader2, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, type Review } from '../lib/api';
import { translateDbError, validateReview } from '../lib/validation';
import type { KioskMerchant } from '../types';

interface ReviewModalProps {
  merchant: KioskMerchant | null;
  onClose: () => void;
  /** chamado depois de salvar, para atualizar a nota média na tela */
  onSaved: () => void;
}

const LABELS = ['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

export const ReviewModal: React.FC<ReviewModalProps> = ({ merchant, onClose, onSaved }) => {
  const uid = useId();
  const { user } = useAuth();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [existingId, setExistingId] = useState<string | undefined>();
  const [recent, setRecent] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const merchantId = merchant?.id;
  const userId = user?.id;

  // Ao abrir: carrega a avaliação que a pessoa já fez (se houver) e os comentários recentes
  useEffect(() => {
    if (!merchantId || !userId) return;
    let cancelled = false;
    setNota(0);
    setComentario('');
    setExistingId(undefined);
    setError(null);
    setDone(false);
    setLoading(true);

    Promise.all([api.fetchMinhaAvaliacao(merchantId, userId), api.fetchAvaliacoes(merchantId, 5)])
      .then(([mine, list]) => {
        if (cancelled) return;
        if (mine) {
          setExistingId(mine.id);
          setNota(mine.nota);
          setComentario(mine.comentario ?? '');
        }
        setRecent(list);
      })
      .catch((err) => {
        if (!cancelled) setError(translateDbError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [merchantId, userId]);

  useEffect(() => {
    if (!merchantId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [merchantId, onClose]);

  if (!merchant || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problems = validateReview(nota, comentario);
    if (problems.nota || problems.comentario) {
      setError(problems.nota ?? problems.comentario ?? null);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.salvarAvaliacao({
        existingId,
        userId: user.id,
        comercianteId: merchant.id,
        nota,
        comentario: comentario.trim() || null,
      });
      setDone(true);
      onSaved();
    } catch (err) {
      setError(translateDbError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-titulo`}
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        <div className="bg-[#004F8A] text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[11px] font-bold tracking-widest text-[#4FA8D8] uppercase block mb-1">
            {existingId ? 'Editar minha avaliação' : 'Avaliar estabelecimento'}
          </span>
          <h3 id={`${uid}-titulo`} className="text-xl font-black font-display leading-snug">
            {merchant.name}
          </h3>
          <p className="text-xs text-white/80 mt-1">{merchant.beach}</p>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">Obrigado pela avaliação!</h4>
              <p className="text-sm text-slate-600 mb-6">Ela ajuda outros visitantes a escolher melhor.</p>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#004F8A] hover:bg-[#003866] text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <span id={`${uid}-nota`} className="block text-xs font-bold text-slate-700 mb-2">
                  Sua nota
                </span>
                <div role="radiogroup" aria-labelledby={`${uid}-nota`} className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={nota === n}
                      aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
                      onClick={() => setNota(n)}
                      className="p-1 cursor-pointer"
                    >
                      <Star className={`w-8 h-8 transition-colors ${n <= nota ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700">{LABELS[nota]}</span>
                </div>
              </div>

              <div>
                <label htmlFor={`${uid}-comentario`} className="block text-xs font-bold text-slate-700 mb-1">
                  Comentário (opcional)
                </label>
                <textarea
                  id={`${uid}-comentario`}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="Conte como foi sua experiência..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004F8A]/30 focus:border-[#004F8A] resize-none"
                />
                <p className="text-[11px] text-slate-400 text-right mt-0.5">{comentario.length}/1000</p>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving || loading}
                className="w-full bg-[#004F8A] hover:bg-[#003866] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {(saving || loading) && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{saving ? 'Salvando...' : existingId ? 'Atualizar avaliação' : 'Enviar avaliação'}</span>
              </button>

              {recent.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">O que dizem sobre este lugar</h4>
                  <ul className="space-y-3">
                    {recent.map((r) => (
                      <li key={r.id} className="text-xs text-slate-700">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="flex text-amber-400">
                            {[...Array(r.nota)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </span>
                          <span className="font-bold text-slate-800">{r.autor}</span>
                        </div>
                        <p className="leading-relaxed">{r.comentario}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
