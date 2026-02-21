import React from 'react';
import { Lightbulb, CheckCircle2, AlertOctagon, AlertTriangle, Info, Hammer } from 'lucide-react';
import type { RecommendationsResponse } from './types';

interface SiteRecommendationsProps {
  data: RecommendationsResponse | null;
  isLoading: boolean;
}

const IMPACT_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  critico: { color: 'text-red-700', bg: 'bg-red-50', icon: <AlertOctagon className="w-4 h-4" />, label: 'Crítico' },
  medio: { color: 'text-orange-700', bg: 'bg-orange-50', icon: <AlertTriangle className="w-4 h-4" />, label: 'Médio' },
  leve: { color: 'text-blue-700', bg: 'bg-blue-50', icon: <Info className="w-4 h-4" />, label: 'Leve' }
};

export const SiteRecommendations = ({ data, isLoading }: SiteRecommendationsProps) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse mt-6">
        <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-2/4 mb-6" />
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 rounded" />
          <div className="h-20 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { recommendations, total_recommendations } = data;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800">Plano de Ação e Recomendações</h2>
        </div>
        <p className="text-sm text-slate-500">Passos práticos agrupados para resolver os problemas de acessibilidade encontrados.</p>
      </div>

      <div className="p-6 bg-slate-50/50">
        {total_recommendations === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-800 mb-2">Nenhuma correção necessária!</h3>
            <p className="text-emerald-700/90 text-sm max-w-2xl mx-auto">
              <strong>Por que não há recomendações para este site?</strong> Nossa análise varreu o código fonte e não detectou violações nas regras verificadas (como ausência de atributos alt, hierarquia quebrada ou labels faltantes). Isso significa que a página já implementa com excelência as diretrizes fundamentais de acessibilidade mapeadas na plataforma.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const impactStyle = IMPACT_CONFIG[rec.impact?.toLowerCase()] || IMPACT_CONFIG.leve;
              return (
                <div key={index} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                  <div className="shrink-0 pt-1">
                    <div className={`p-2 rounded-full ${impactStyle.bg} ${impactStyle.color}`}>
                      <Hammer className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${impactStyle.bg} ${impactStyle.color}`}>
                        {impactStyle.icon} Prioridade {impactStyle.label}
                      </span>
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        {rec.occurrences} ocorrência{rec.occurrences > 1 ? 's' : ''} encontrada{rec.occurrences > 1 ? 's' : ''}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-3">{rec.actionable_recommendation}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <strong>Regra originária:</strong>
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{rec.rule}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};