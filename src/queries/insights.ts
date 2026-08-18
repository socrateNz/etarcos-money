import { api } from "@/lib/axios";

export interface FinancialHealthFactors {
  savingsRatio: number;
  debtRatio: number;
  budgetAdherence: number;
  consistency: number;
}

export interface FinancialHealthResponse {
  currentScore: { score: number; factors: FinancialHealthFactors; date: string } | null;
  history: { score: number; date: string }[];
}

export interface ForecastResponse {
  forecast: {
    nextMonthPredictedIncome: number;
    nextMonthPredictedExpense: number;
    predictedSavings: number;
  };
}

export interface FraudAlert {
  transactionId: string;
  amount: number;
  date: string;
  description?: string;
  reason: string;
  riskScore: number;
}

export interface FraudResponse {
  alerts: FraudAlert[];
}

export const insightsQueries = {
  getFinancialHealth: async () => {
    return api.get<any, FinancialHealthResponse>("/financial-health");
  },
  getForecast: async () => {
    return api.get<any, ForecastResponse>("/forecast");
  },
  getFraud: async () => {
    return api.get<any, FraudResponse>("/fraud");
  },
};
