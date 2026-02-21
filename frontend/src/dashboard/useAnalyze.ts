import { useState } from 'react';
import type { DashboardData } from './types';

const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://acessibilidade-digital-pcd.onrender.com' 
  : 'http://localhost:8000';

export const useAnalyze = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = async (url: string) => {
    if (!url) return;
    setIsLoading(true); setError(null);
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
      const result: DashboardData = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Falha ao conectar com o servidor.'); console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, analyzeUrl };
};