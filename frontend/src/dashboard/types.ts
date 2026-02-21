export interface Issue {
  rule: string;
  line: number | null;
  element: string;
  impact: string;
  disabilities_affected: string[];
  description: string;
}

export interface DashboardData {
  id: number;
  url: string;
  scores: {
    overall_score: number;
    visual_score: number;
    motor_score: number;
    cognitive_score: number;
    auditory_score: number;
  };
  total_issues: number;
  issues: Issue[];
}

export interface Recommendation {
  rule: string;
  impact: string;
  disabilities_affected: string[];
  occurrences: number;
  actionable_recommendation: string;
}

export interface RecommendationsResponse {
  analysis_id: number;
  url: string;
  message?: string;
  total_recommendations: number;
  recommendations: Recommendation[];
}