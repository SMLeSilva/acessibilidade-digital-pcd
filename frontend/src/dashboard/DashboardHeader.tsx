import React from 'react';
import { Search, AlertCircle, Activity, Info, CheckCircle2 } from 'lucide-react';

interface DashboardHeaderProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  handleAnalyze: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  analyzedUrl?: string;
}

export const DashboardHeader = ({ urlInput, setUrlInput, handleAnalyze, isLoading, error, analyzedUrl }: DashboardHeaderProps) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#00509d]">Painel de Acessibilidade Digital</h1>
          <p className="text-slate-500 mt-1">Descubra se o seu site é fácil de usar para todas as pessoas</p>
        </div>

        <form onSubmit={handleAnalyze} className="w-full md:w-1/2 flex relative shadow-sm rounded-lg overflow-hidden">
          <div className="relative grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="url"
              placeholder="Digite o endereço do site (ex: https://site.com.br)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00509d] transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#00509d] hover:bg-[#003f7a] text-white px-6 py-3 font-medium transition-colors disabled:opacity-70 flex items-center justify-center min-w-40"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                Analisando
                <span className="flex gap-1 -mb-1">
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
                </span>
              </span>
            ) : (
              'Analisar Site'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-xl mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 font-bold text-red-700">
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg">Ops! Não foi possível analisar este site.</span>
          </div>

          <p className="text-sm mb-4 text-red-700/90 font-medium">Erro técnico: {error}</p>

          <div className="bg-white/60 p-4 rounded-lg border border-red-100 flex flex-col gap-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 teaxt-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 mb-1">Por que isso acontece?</strong>
                Alguns sites possuem barreiras fortes de segurança (como bloqueios contra bots, firewalls corporativos ou regras estritas de CORS) que impedem nossa ferramenta de realizar a varredura automática de acessibilidade.
              </div>
            </div>

            <div className="w-full h-px bg-red-100" />

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 mb-1">Onde a ferramenta brilha?</strong>
                A premissa do projeto funciona perfeitamente em páginas de acesso livre. Tente testar em sites institucionais, blogs, páginas governamentais ou portais públicos que não exijam login ou proteções avançadas.
              </div>
            </div>
          </div>
        </div>
      )}

      {analyzedUrl && !error && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-sm text-slate-600">
          <Activity className="w-4 h-4 text-[#00509d]" />
          <span>
            Mostrando resultados para: <strong className="text-slate-800">{analyzedUrl}</strong>
          </span>
        </div>
      )}
    </header>
  );
};