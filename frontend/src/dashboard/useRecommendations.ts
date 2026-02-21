import { useState, useEffect } from 'react';
import type { RecommendationsResponse } from './types';

const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://acessibilidade-digital-pcd.onrender.com' 
  : 'http://localhost:8000';

export const useRecommendations = (analysisId?: number) => {
  const [recommendationsData, setRecommendationsData] = useState<RecommendationsResponse | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [errorRecs, setErrorRecs] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisId) { setRecommendationsData(null); return; }
    const fetchRecommendations = async () => {
      setIsLoadingRecs(true); setErrorRecs(null);
      try {
        const response = await fetch(`${API_URL}/api/recommendations/${analysisId}`);
        if (!response.ok) throw new Error('Falha ao buscar o plano de ação.');
        const result: RecommendationsResponse = await response.json();
        setRecommendationsData(result);
      } catch (err: any) {
        setErrorRecs(err.message); console.error(err);
      } finally {
        setIsLoadingRecs(false);
      }
    };
    fetchRecommendations();
  }, [analysisId]);

  return { recommendationsData, isLoadingRecs, errorRecs };
};