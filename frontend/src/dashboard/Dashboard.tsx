import React, { useState } from 'react';
import { useAnalyze } from './useAnalyze';
import { useRecommendations } from './useRecommendations';
import { DashboardHeader } from './DashboardHeader';
import { ScoreOverview } from './ScoreOverview';
import { CategoryChart } from './CategoryChart';
import { CategoryDetails } from './CategoryDetails';
import { SiteRecommendations } from './Recommendations';
import { IssuesDetails } from './IssuesDetails';

const COLORS = {
  primary: '#00509d',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#e2e8f0'
};

const CATEGORY_INFO: Record<string, string> = {
  Visual: 'Cores, contrastes e suporte a leitores de tela para pessoas com baixa visão ou cegueira.',
  Motor: 'Facilidade de navegar pelo site usando apenas o teclado ou comandos de voz.',
  Cognitivo: 'Textos claros, design simples e sem distrações que atrapalhem o entendimento.',
  Auditivo: 'Presença de legendas e textos alternativos para conteúdos em áudio e vídeo.'
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return COLORS.success;
  if (score >= 50) return COLORS.warning;
  return COLORS.danger;
};

const Dashboard = () => {
  const [urlInput, setUrlInput] = useState('');
  const { data, isLoading, error, analyzeUrl } = useAnalyze();
  const { recommendationsData, isLoadingRecs } = useRecommendations(data?.id);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeUrl(urlInput);
  };

  const chartData = data
    ? [
        { name: 'Visual', score: data.scores.visual_score },
        { name: 'Motor', score: data.scores.motor_score },
        { name: 'Cognitivo', score: data.scores.cognitive_score },
        { name: 'Auditivo', score: data.scores.auditory_score }
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          handleAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
          analyzedUrl={data?.url}
        />

        {data && !error && (
          <main className="space-y-6">
            <ScoreOverview
              overallScore={data.scores.overall_score}
              totalIssues={data.total_issues}
              getScoreColor={getScoreColor}
              neutralColor={COLORS.neutral}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart chartData={chartData} getScoreColor={getScoreColor} />
              <CategoryDetails
                chartData={chartData}
                categoryInfo={CATEGORY_INFO}
                getScoreColor={getScoreColor}
              />
            </div>

            <SiteRecommendations data={recommendationsData} isLoading={isLoadingRecs} />

            <IssuesDetails issues={data.issues} />
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;