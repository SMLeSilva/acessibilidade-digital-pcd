import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CategoryChartProps {
  chartData: Array<{ name: string; score: number }>;
  getScoreColor: (score: number) => string;
}

export const CategoryChart = ({ chartData, getScoreColor }: CategoryChartProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Visão Geral das Categorias</h2>
        <p className="text-sm text-slate-500 mb-6">Comparativo rápido de onde o site se sai melhor e onde precisa melhorar.</p>
      </div>
      <div className="h-64 grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value: any) => {
                if (value === undefined || value === null) return ['0%', 'Pontuação'];
                return [`${Number(value).toFixed(1)}%`, 'Pontuação'];
              }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};