import { Info } from 'lucide-react';

interface CategoryDetailsProps {
  chartData: Array<{ name: string; score: number }>;
  categoryInfo: Record<string, string>;
  getScoreColor: (score: number) => string;
}

export const CategoryDetails = ({ chartData, categoryInfo, getScoreColor }: CategoryDetailsProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h2 className="text-lg font-bold text-slate-800 mb-2">O que significam essas notas?</h2>
      <p className="text-sm text-slate-500 mb-6">Entenda o impacto prático de cada categoria na experiência dos seus usuários.</p>

      <div className="space-y-6">
        {chartData.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-semibold text-slate-800">{item.name}</span>
              <span className="font-bold text-slate-900">{item.score.toFixed(1)}%</span>
            </div>

            <p className="text-xs text-slate-500 mb-2 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
              {categoryInfo[item.name]}
            </p>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${item.score}%`, backgroundColor: getScoreColor(item.score) }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};