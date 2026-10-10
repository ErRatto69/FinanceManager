import { apiClient } from '../../../api/apiClient';
import type { DashboardSummaryDto } from '../types/dashboard.types';

export const dashboardApi = {
    getSummary: async (): Promise<DashboardSummaryDto> => {
        const response = await apiClient.get<DashboardSummaryDto>('/api/dashboard/summary');
        return response.data;
    },
};