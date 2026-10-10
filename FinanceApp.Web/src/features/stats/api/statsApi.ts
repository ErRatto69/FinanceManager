import { apiClient } from '../../../api/apiClient';
import type { MonthlyStatsDto } from '../types/stats.types';

export const statsApi = {
    getMonthlyStats: async (month?: number, year?: number): Promise<MonthlyStatsDto> => {
        const params = {
            ...(month ? { month } : {}),
            ...(year ? { year } : {}),
        };
        const response = await apiClient.get<MonthlyStatsDto>('/api/stats', { params });
        return response.data;
    },
};