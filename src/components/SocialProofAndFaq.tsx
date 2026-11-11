import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { getInitials } from '../lib/format';
import { Star, ChevronDown, HelpCircle, ShieldCheck, CheckCircle2, MessageSquare, Bell, Smartphone } from 'lucide-react';

interface SocialProofAndFaqProps {
  onOpenAppPreview: () => void;
}

export const SocialProofAndFaq: React.FC<SocialProofAndFaqProps> = ({ onOpenAppPreview }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { testimonials } = useData();

  const faqs = [
    {
      q: 'O SAQUA ON é gratuito para turistas e moradores?',
      a: 'Sim, 100% gratuito! Qualquer pessoa pode consultar as condições do mar em tempo real, checar bandeiras de segurança dos salva-vidas, buscar quiosques, cardápios e eventos sem pagar nada e sem burocracia.',
    },
    {
      q: 'De onde vêm os dados de ondas, vento e segurança?',
      a: 'Nossos dados combinam previsões meteorológicas marítimas atualizadas minuto a minuto com checagens locais dos postos de guarda-vidas e monitores nas praias de Itaúna, Vila, Barrinha e Jaconé.',
    },
    {
      q: 'Como funciona para quiosques, ambulantes e comerciantes anunciarem?',
      a: 'É muito simples! O comerciante pode começar no plano Onda Livre (gratuito) para ter sua localização e WhatsApp listados, ou optar pelos planos Pro e Master para figurar no topo das buscas, ter cardápio digital completo e receber reservas diretas.',
    },
    {
      q: 'Preciso baixar algum aplicativo pesado no meu celular?',
      a: 'Não! O SAQUA ON foi desenvolvido como uma Plataforma Web de carregamento ultrarrápido (PWA). Você pode acessar direto do navegador em qualquer smartphone ou computador e, se quiser, adicionar o ícone à sua tela inicial com 1 clique.',
    },
    {
      q: 'A plataforma cumpre as normas da LGPD (Lei Geral de Proteção de Dados)?',
      a: 'Com certeza. Seguimos rigorosamente todas as diretrizes da LGPD (Lei 13.709/2018). Seus dados cadastrais e preferências de navegação são protegidos com criptografia e nunca são repassados a terceiros.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#FAF5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        {testimonials.length > 0 && (
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004F8A] bg-[#004F8A]/10 px-3 py-1 rounded-full mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-[#4FA8D8]" />
              <span>Quem Já Vive as Praias com o SAQUA ON</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#0A1E2F] tracking-tight">
              Aprovado por Surfistas, Banhistas e Comerciantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-10 h-10 rounded-full object-cover border border-[#004F8A]/20"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#004F8A] text-white text-xs font-black flex items-center justify-center shrink-0">
                      {getInitials(item.author)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-[#0A1E2F]">{item.author}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {item.role} • {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004F8A] bg-[#004F8A]/10 px-3 py-1 rounded-full mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[#4FA8D8]" />
              <span>Dúvidas Frequentes</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-[#0A1E2F]">
              Perguntas e Respostas sobre a Plataforma
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-[#0A1E2F] hover:text-[#004F8A] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#004F8A]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
