import React, { useEffect, useId, useState } from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { SaquaOnLogo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { api } from '../lib/api';
import {
  translateDbError,
  validateBusinessName,
  validateInstagram,
  validateOptionalText,
  validateWhatsapp,
  formatWhatsappDisplay,
} from '../lib/validation';
import type { MerchantCategory, PlanCode } from '../types';

interface MerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: PlanCode;
}

const CATEGORIAS: { value: MerchantCategory; label: string }[] = [
  { value: 'Quiosque', label: 'Quiosque de Praia' },
  { value: 'Restaurante', label: 'Restaurante / Bar' },
  { value: 'Escola de Surf', label: 'Escola de Surf / Aluguel' },
  { value: 'Pousada', label: 'Pousada / Hotel' },
  { value: 'Ambulante', label: 'Ambulante Credenciado' },
];

const OUTRA_REGIAO = 'outra';

const inputClass = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
      : 'border-slate-300 focus:ring-[#004F8A]/30 focus:border-[#004F8A]'
  }`;

export const MerchantModal: React.FC<MerchantModalProps> = ({ isOpen, onClose, defaultPlan = 'pago' }) => {
  const uid = useId();
  const { user, profile, openAuthModal, refreshProfile } = useAuth();
  const { beaches, plans, refreshMerchants } = useData();

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [beachId, setBeachId] = useState<string>(OUTRA_REGIAO);
  const [category, setCategory] = useState<MerchantCategory>('Quiosque');
  const [selectedPlan, setSelectedPlan] = useState<PlanCode>(defaultPlan);
  const [instagram, setInstagram] = useState('');
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ nome: string; plan: PlanCode; phone: string; praia: string } | null>(null);

  // Cada vez que o modal abre, começa limpo (com Itaúna pré-selecionada, como antes)
  useEffect(() => {
    if (!isOpen) return;
    setBusinessName('');
    setPhone('');
    setBeachId(beaches.find((b) => b.id === 'itauna')?.dbId ?? beaches[0]?.dbId ?? OUTRA_REGIAO);
    setCategory('Quiosque');
    setSelectedPlan(defaultPlan);
    setInstagram('');
    setEndereco('');
    setDescricao('');
    setErrors({});
    setFormError(null);
    setSubmitting(false);
    setDone(null);
  }, [isOpen, defaultPlan]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const planName = (code: PlanCode) => plans.find((p) => p.id === code)?.name ?? code;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const nameRes = validateBusinessName(businessName);
    const phoneRes = validateWhatsapp(phone);
    const igRes = validateInstagram(instagram);
    const addrRes = validateOptionalText(endereco, 200, 'O endereço');
    const descRes = validateOptionalText(descricao, 300, 'A descrição');

    const next: Record<string, string> = {};
    if (nameRes.error) next.nome = nameRes.error;
    if (phoneRes.error) next.phone = phoneRes.error;
    if (igRes.error) next.instagram = igRes.error;
    if (addrRes.error) next.endereco = addrRes.error;
    if (descRes.error) next.descricao = descRes.error;
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await api.criarComerciante({
        usuarioId: user.id,
        nome: nameRes.value,
        categoria: category,
        praiaId: beachId === OUTRA_REGIAO ? null : beachId,
        whatsapp: phoneRes.value,
        instagram: igRes.value || null,
        endereco: addrRes.value || null,
        descricao: descRes.value || null,
        planoSolicitado: selectedPlan,
      });
      // o banco passa a pessoa para "comerciante" e o estabelecimento entra na lista
      await Promise.all([refreshMerchants(), refreshProfile()]);
      setDone({
        nome: nameRes.value,
        plan: selectedPlan,
        phone: formatWhatsappDisplay(phoneRes.value),
        praia: beaches.find((b) => b.dbId === beachId)?.name ?? 'Outra região de Saquarema',
      });
    } catch (err) {
      setFormError(translateDbError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const errorText = (key: string) =>
    errors[key] ? (
      <p id={`${uid}-${key}-erro`} role="alert" className="mt-1 text-xs text-red-600 flex items-start gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
        <span>{errors[key]}</span>
      </p>
    ) : null;
  const described = (key: string) => (errors[key] ? `${uid}-${key}-erro` : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-titulo`}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
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
              Credenciamento Oficial de Comércio
            </span>
          </div>

          <h3 id={`${uid}-titulo`} className="text-xl sm:text-2xl font-black font-display leading-snug">
            Cadastre Seu Estabelecimento no SAQUA ON
          </h3>
          <p className="text-xs text-white/80 mt-1">
            Conecte seu quiosque, barraca, escola de surf ou pousada a milhares de turistas em Saquarema.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {!user ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-600 mb-4">Entre na sua conta para cadastrar um estabelecimento.</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal({ view: 'login' });
                }}
                className="inline-flex items-center gap-2 bg-[#004F8A] hover:bg-[#003866] text-white font-bold text-sm py-3 px-6 rounded-xl transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            </div>
          ) : done ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 stroke-[2.5]" />
              </div>

              <h4 className="text-xl font-bold text-slate-800 mb-2">Estabelecimento Cadastrado!</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                Parabéns, <strong>{profile?.nome?.split(' ')[0] ?? 'Parceiro'}</strong>! Seu perfil já está no ar no plano{' '}
                <strong>{planName('gratuito')}</strong>.
                {done.plan !== 'gratuito' && (
                  <>
                    {' '}
                    Nossa equipe comercial entrará em contato pelo WhatsApp <strong>{done.phone}</strong> em até 24h úteis
                    para ativar o plano <strong>{planName(done.plan)}</strong>.
                  </>
                )}
              </p>

              <div className="bg-[#FAF5EE] p-4 rounded-xl border border-[#004F8A]/10 text-left text-xs text-slate-700 space-y-1.5 mb-6">
                <p>
                  ✓ <strong>Comércio:</strong> {done.nome}
                </p>
                <p>
                  ✓ <strong>Praia:</strong> {done.praia}
                </p>
                <p>
                  ✓ <strong>Contato:</strong> botão de WhatsApp direto ativado no seu perfil.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#004F8A] hover:bg-[#003866] text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer"
              >
                Concluir e Voltar à Navegação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor={`${uid}-nome`} className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Estabelecimento / Ponto Comercial *
                </label>
                <input
                  id={`${uid}-nome`}
                  type="text"
                  autoFocus
                  maxLength={120}
                  placeholder="Ex: Quiosque Onda Boa, Pousada Mar Azul..."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby={described('nome')}
                  className={inputClass(Boolean(errors.nome))}
                />
                {errorText('nome')}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="block text-xs font-bold text-slate-700 mb-1">Responsável</span>
                  <div className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 truncate">
                    {profile?.nome ?? user.email}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">É o nome da sua conta.</p>
                </div>

                <div>
                  <label htmlFor={`${uid}-phone`} className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={20}
                    placeholder="(22) 99876-5432"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={described('phone')}
                    className={inputClass(Boolean(errors.phone))}
                  />
                  {errorText('phone')}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${uid}-categoria`} className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    id={`${uid}-categoria`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MerchantCategory)}
                    className={inputClass(false)}
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`${uid}-praia`} className="block text-xs font-bold text-slate-700 mb-1">
                    Praia de Atuação
                  </label>
                  <select
                    id={`${uid}-praia`}
                    value={beachId}
                    onChange={(e) => setBeachId(e.target.value)}
                    className={inputClass(false)}
                  >
                    {beaches.map((b) => (
                      <option key={b.dbId} value={b.dbId}>
                        {b.name}
                      </option>
                    ))}
                    <option value={OUTRA_REGIAO}>Outra região de Saquarema</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${uid}-instagram`} className="block text-xs font-bold text-slate-700 mb-1">
                    Instagram <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <input
                    id={`${uid}-instagram`}
                    type="text"
                    maxLength={40}
                    placeholder="@seuquiosque"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    aria-invalid={Boolean(errors.instagram)}
                    aria-describedby={described('instagram')}
                    className={inputClass(Boolean(errors.instagram))}
                  />
                  {errorText('instagram')}
                </div>

                <div>
                  <label htmlFor={`${uid}-endereco`} className="block text-xs font-bold text-slate-700 mb-1">
                    Endereço / referência <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <input
                    id={`${uid}-endereco`}
                    type="text"
                    maxLength={200}
                    placeholder="Ex: Posto 1, em frente ao palco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    aria-invalid={Boolean(errors.endereco)}
                    aria-describedby={described('endereco')}
                    className={inputClass(Boolean(errors.endereco))}
                  />
                  {errorText('endereco')}
                </div>
              </div>

              <div>
                <label htmlFor={`${uid}-descricao`} className="block text-xs font-bold text-slate-700 mb-1">
                  O que você oferece? <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <input
                  id={`${uid}-descricao`}
                  type="text"
                  maxLength={300}
                  placeholder="Ex: Peixe frito na hora e caipirinhas"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  aria-invalid={Boolean(errors.descricao)}
                  aria-describedby={described('descricao')}
                  className={inputClass(Boolean(errors.descricao))}
                />
                {errorText('descricao')}
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1">Plano Escolhido</span>
                {plans.length === 0 ? (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Carregando planos...
                  </p>
                ) : (
                  <div role="radiogroup" aria-label="Plano" className="grid grid-cols-3 gap-2">
                    {plans.map((p) => {
                      const isSelected = selectedPlan === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedPlan(p.id)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#004F8A] text-white border-[#004F8A] shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block text-xs font-bold truncate">{p.name}</span>
                          <span className={`text-[11px] ${isSelected ? 'text-[#4FA8D8]' : 'text-slate-500'}`}>
                            {p.price === '0' ? 'Grátis' : `R$ ${p.price}/mês`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {selectedPlan !== 'gratuito' && (
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Seu perfil entra no ar já no plano gratuito; a equipe ativa o plano escolhido após o contato.
                  </p>
                )}
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Em conformidade com a LGPD e regulamentação turística de Saquarema.</span>
              </p>

              {formError && (
                <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || plans.length === 0}
                className="w-full bg-[#004F8A] hover:bg-[#003866] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{submitting ? 'Enviando...' : 'Enviar Cadastro'}</span>
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
