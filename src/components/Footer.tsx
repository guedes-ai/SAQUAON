import React from 'react';
import { SaquaOnLogo } from './Logo';
import { ShieldCheck, Phone, Heart, ExternalLink, MapPin, Mail } from 'lucide-react';

interface FooterProps {
  onOpenMerchantModal: () => void;
  onOpenAppPreview: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMerchantModal, onOpenAppPreview }) => {
  return (
    <footer className="bg-[#0A1E2F] text-white pt-16 pb-24 lg:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand and Description */}
          <div className="lg:col-span-2">
            <SaquaOnLogo variant="full" size="md" inverted className="mb-4" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mb-6">
              A plataforma digital oficial para centralização de informações marítimas, meteorológicas,
              comerciais e esportivas do município de Saquarema (RJ). Desenvolvida para fortalecer o turismo
              sustentável e impulsionar a economia local.
            </p>

            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#4FA8D8]" />
                <span>Saquarema, Região dos Lagos — Rio de Janeiro, Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4FA8D8]" />
                <span>contato@saquaon.com.br</span>
              </div>
            </div>
          </div>

          {/* Col 3: Navegação Rápida */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#4FA8D8] mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#radar" className="hover:text-white transition-colors">
                  Radar do Mar ao Vivo
                </a>
              </li>
              <li>
                <a href="#encontre-sua-praia" className="hover:text-white transition-colors">
                  Achar Minha Praia Ideal
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-white transition-colors">
                  Quiosques & Comércio Local
                </a>
              </li>
              <li>
                <a href="#eventos" className="hover:text-white transition-colors">
                  WSL & Calendário de Eventos
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAppPreview}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Alertas de Boas Ondas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Comerciantes & Parcerias */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#4FA8D8] mb-4">
              Para Empresas
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={onOpenMerchantModal}
                  className="hover:text-white transition-colors text-left cursor-pointer font-bold text-white"
                >
                  Cadastrar Estabelecimento
                </button>
              </li>
              <li>
                <a href="#comerciantes" className="hover:text-white transition-colors">
                  Planos de Impulsionamento
                </a>
              </li>
              <li>
                <a href="#comerciantes" className="hover:text-white transition-colors">
                  Simulador de Faturamento
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Apoio a Ambulantes Credenciados</span>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Parcerias com Pousadas e Escolas</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Segurança & Utilidade Pública */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Emergência & Apoio</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Corpo de Bombeiros / Guarda-Vidas
                </span>
                <span className="text-sm font-black text-white flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-red-400" />
                  Disque 193
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Defesa Civil de Saquarema
                </span>
                <span className="text-sm font-black text-white flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Disque 199
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional & Academic Note (from the document) */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>
              Projeto concebido academicamente pela <strong>Universidade de Vassouras</strong> (Práticas Extensionistas
              Integradoras III) sob as diretrizes da <strong>LGPD</strong> (Lei 13.709/2018).
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-400 flex-wrap justify-center md:justify-end">
            <a href="https://www.saquarema.rj.gov.br/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
              Prefeitura de Saquarema
            </a>
            <span>•</span>
            <span>Privacidade Protegida</span>
            <span>•</span>
            <span>Termos de Uso</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} SAQUA ON</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
