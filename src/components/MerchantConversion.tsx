import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { PlanCode } from '../types';
import { Store, Check, ArrowRight, TrendingUp, DollarSign, Users, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';

interface MerchantConversionProps {
  onOpenMerchantModal: (planCode?: PlanCode) => void;
}

export const MerchantConversion: React.FC<MerchantConversionProps> = ({ onOpenMerchantModal }) => {
  const { plans, loading } = useData();
  const proPlan = plans.find((plan) => plan.id === 'pago');

  // Simulator State
  const [dailyVisitors, setDailyVisitors] = useState<number>(60);
  const [averageTicket, setAverageTicket] = useState<number>(45);

  // Business simulation calculation
  // Document points out: +30% to +45% traffic increase for featured merchants in Saquarema
  const estimatedNewCustomersPerMonth = Math.round(dailyVisitors * 0.35 * 30 * 0.15); // ~15% extra capture rate
  const estimatedExtraRevenue = estimatedNewCustomersPerMonth * averageTicket;

  return (
    <section id="comerciantes" className="py-16 lg:py-24 bg-[#004F8A] text-white relative overflow-hidden scroll-mt-20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4FA8D8]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#004F8A] bg-[#4FA8D8] px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-[#004F8A]" />
            <span>Monetização & Crescimento para Negócios Locais</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white mb-4">
            Transforme Turistas em Clientes Fiéis no Seu Quiosque
          </h2>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Mais de 180 mil turistas passam pelas praias de Saquarema ao longo do ano. No SAQUA ON, seu
            estabelecimento ganha visibilidade prioritária, cardápio digital e reservas diretas no seu WhatsApp,
            garantindo movimento até nos meses de baixa temporada.
          </p>
        </div>

        {/* Interactive ROI Calculator for Merchants */}
        <div className="bg-white text-[#0A1E2F] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl mb-16 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left Controls */}
            <div className="w-full lg:w-7/12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004F8A] bg-[#004F8A]/10 px-3 py-1 rounded-md uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#4FA8D8]" />
                <span>Simulador de Retorno Comercial</span>
              </div>
              <h3 className="text-2xl font-black font-display mb-2">
                Quanto o SAQUA ON pode somar ao seu faturamento?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Ajuste os valores do seu quiosque ou ponto comercial para simular a captação média com o plano Pro.
              </p>

              {/* Slider 1: Average daily customers */}
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-slate-700">Média de clientes atendidos por dia:</span>
                  <span className="text-[#004F8A] text-sm font-black">{dailyVisitors} pessoas/dia</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={dailyVisitors}
                  onChange={(e) => setDailyVisitors(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg accent-[#004F8A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Pequeno quiosque (20)</span>
                  <span>Grande orla Itaúna (300)</span>
                </div>
              </div>

              {/* Slider 2: Average Ticket */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-slate-700">Gasto médio por cliente (Ticket Médio):</span>
                  <span className="text-[#004F8A] text-sm font-black">R$ {averageTicket},00</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="150"
                  step="5"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg accent-[#004F8A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Mate/Água de coco (R$ 15)</span>
                  <span>Almoço com frutos do mar (R$ 150)</span>
                </div>
              </div>
            </div>

            {/* Right Output Box */}
            <div className="w-full lg:w-5/12 bg-[#FAF5EE] p-6 sm:p-8 rounded-2xl border border-[#004F8A]/15 text-center flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Aumento Estimado de Faturamento
              </span>
              <p className="text-3xl sm:text-4xl font-black font-display text-[#004F8A] mb-1">
                + R$ {estimatedExtraRevenue.toLocaleString('pt-BR')},00
              </p>
              <span className="text-xs font-semibold text-emerald-600 block mb-4">
                em média por mês (~{estimatedNewCustomersPerMonth} novos pedidos diretos)
              </span>

              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Investimento de apenas R$ {proPlan?.price ?? '49'}/mês no plano <strong>Saqua Pro</strong>. Retorno estimado em menos de 1 semana!
              </p>

              <button
                type="button"
                onClick={() => onOpenMerchantModal('pago')}
                className="w-full bg-[#004F8A] hover:bg-[#003866] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Quero Começar Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Tiers Table */}
        {plans.length === 0 && (
          <p className="text-center text-white/80 text-sm py-6">
            {loading ? 'Carregando planos...' : 'Planos indisponíveis no momento.'}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                tier.highlight
                  ? 'bg-white text-[#0A1E2F] shadow-2xl scale-[1.03] border-2 border-[#4FA8D8] relative'
                  : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/15'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4FA8D8] text-[#004F8A] text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                {!tier.highlight && (
                  <span className="text-xs font-bold text-[#4FA8D8] uppercase tracking-wider block mb-1">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-black font-display mb-2">{tier.name}</h3>
                <p className={`text-xs leading-relaxed mb-6 ${tier.highlight ? 'text-slate-600' : 'text-white/80'}`}>
                  {tier.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-200/40">
                  <span className="text-sm font-bold">R$</span>
                  <span className="text-4xl sm:text-5xl font-black font-display tracking-tight">
                    {tier.price}
                  </span>
                  <span className={`text-xs font-medium ${tier.highlight ? 'text-slate-500' : 'text-white/70'}`}>
                    /{tier.period}
                  </span>
                </div>

                {/* Features list */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs font-medium">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          tier.highlight ? 'bg-[#004F8A] text-white' : 'bg-[#4FA8D8] text-[#004F8A]'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={tier.highlight ? 'text-slate-700' : 'text-white/90'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier CTA */}
              <button
                type="button"
                onClick={() => onOpenMerchantModal(tier.id)}
                className={`w-full font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tier.highlight
                    ? 'bg-[#004F8A] hover:bg-[#003866] text-white shadow-lg shadow-[#004F8A]/20'
                    : 'bg-white text-[#004F8A] hover:bg-slate-100 shadow-xs'
                }`}
              >
                <span>{tier.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
