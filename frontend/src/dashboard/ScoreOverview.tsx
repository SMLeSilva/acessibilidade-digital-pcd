import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertCircle, ExternalLink, Award } from 'lucide-react';

interface ScoreOverviewProps {
  overallScore: number;
  totalIssues: number;
  getScoreColor: (score: number) => string;
  neutralColor: string;
}

const getConformanceLevel = (score: number) => {
  if (score >= 95) return { level: 'AAA', label: 'Excelente', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
  if (score >= 80) return { level: 'AA', label: 'Recomendado', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
  if (score >= 50) return { level: 'A', label: 'Básico', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
  return { level: 'Crítico', label: 'Abaixo do Padrão', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
};

export const ScoreOverview = ({ overallScore, totalIssues, getScoreColor, neutralColor }: ScoreOverviewProps) => {
  const pieData = [
    { name: 'Pontuação', value: overallScore },
    { name: 'Faltante', value: 100 - overallScore }
  ];

  const conformance = getConformanceLevel(overallScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-around">
        <div className="max-w-md">
          <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Nota Geral do Site</h2>

          <div className="flex items-center gap-4">
            <span className="text-5xl font-extrabold text-slate-800">{overallScore.toFixed(1)}%</span>
            <div className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg border ${conformance.bg} ${conformance.border} ${conformance.text}`}>
              <div className="flex items-center gap-1 font-bold text-lg">
                <Award className="w-4 h-4" />
                Nível {conformance.level}
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">{conformance.label}</span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              Baseado nos padrões internacionais de acessibilidade web{' '}
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#00509d] hover:text-[#003f7a] hover:underline font-medium transition-colors"
                title="Saiba mais sobre as Diretrizes de Acessibilidade (WCAG)"
              >
                (WCAG) <ExternalLink className="w-3 h-3" />
              </a>
              . Quanto maior, mais inclusivo é o seu site.
            </p>
          </div>
        </div>

        <div className="h-40 w-40 mt-6 md:mt-0 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={getScoreColor(overallScore)} />
                <Cell fill={neutralColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-center md:text-left">
        <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Barreiras Encontradas</h2>
        <div className="flex items-center justify-center md:justify-start gap-4">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <span className="text-5xl font-extrabold text-slate-800">{totalIssues}</span>
        </div>
        <p className="text-sm text-slate-600 mt-4">
          Quantidade de problemas técnicos que podem impedir pessoas com deficiência de usar seu site.
        </p>
      </div>
    </div>
  );
};