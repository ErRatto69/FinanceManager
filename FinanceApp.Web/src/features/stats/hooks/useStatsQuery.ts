import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/statsApi';

export const STATS_QUERY_KEY = ['stats'];

export const useStatsQuery = (month: number, year: number) => {
    return useQuery({
        queryKey: [...STATS_QUERY_KEY, month, year],
        queryFn: () => statsApi.getMonthlyStats(month, year),
    });
};