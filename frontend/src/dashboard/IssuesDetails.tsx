import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertOctagon, AlertTriangle, Info, Code, Accessibility } from 'lucide-react';

export interface Issue {
  rule: string;
  line: number | null;
  element: string;
  impact: string;
  disabilities_affected: string[];
  description: string;
}

interface IssuesDetailsProps {
  issues: Issue[];
}

const IMPACT_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  critico: { color: 'text-red-700', bg: 'bg-red-50', icon: <AlertOctagon className="w-4 h-4" />, label: 'Crítico' },
  serio: { color: 'text-orange-700', bg: 'bg-orange-50', icon: <AlertTriangle className="w-4 h-4" />, label: 'Sério' },
  moderado: { color: 'text-yellow-700', bg: 'bg-yellow-50', icon: <Info className="w-4 h-4" />, label: 'Moderado' },
  menor: { color: 'text-blue-700', bg: 'bg-blue-50', icon: <Info className="w-4 h-4" />, label: 'Menor' }
};

export const IssuesDetails = ({ issues }: IssuesDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!issues || issues.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors focus:outline-none">
        <div>
          <h2 className="text-lg font-bold text-slate-800 text-left">Detalhes Técnicos das Barreiras</h2>
          <p className="text-sm text-slate-500 mt-1 text-left">Veja exatamente quais elementos do código precisam de correção.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">{issues.length} problemas</span>
          {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
          {issues.map((issue, index) => {
            const impactStyle = IMPACT_CONFIG[issue.impact.toLowerCase()] || IMPACT_CONFIG.moderado;
            return (
              <div key={index} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{issue.description}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${impactStyle.bg} ${impactStyle.color}`}>
                        {impactStyle.icon} Impacto {impactStyle.label}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 border border-slate-200 px-2 py-1 rounded-md bg-slate-50">
                        <Code className="w-3.5 h-3.5" />
                        Regra: {issue.rule} {issue.line ? `(Linha ${issue.line})` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {issue.disabilities_affected.map(disability => (
                      <span key={disability} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium capitalize">
                        <Accessibility className="w-3 h-3" />
                        {disability}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -top-3 left-4 bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded tracking-wider uppercase">
                    Elemento HTML
                  </div>
                  <pre className="bg-slate-800 text-slate-100 p-4 pt-5 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all shadow-inner border border-slate-700">
                    <code>{issue.element}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};