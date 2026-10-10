import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const DASHBOARD_SUMMARY_QUERY_KEY = ['dashboard-summary'];

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
        queryFn: dashboardApi.getSummary,
    });
};