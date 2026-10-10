export interface CategoryInfo {
    id: number;
    name: string;
    color: string;
}

export const APP_CATEGORIES: CategoryInfo[] = [
    { id: 1, name: 'Housing and Utilities', color: '#3B82F6' },
    { id: 2, name: 'Groceries and Food', color: '#10B981' },
    { id: 3, name: 'Transports and Cars', color: '#F59E0B' },
    { id: 4, name: 'Health and Insurances', color: '#EF4444' },
    { id: 5, name: 'Leisure and Free time', color: '#8B5CF6' },
    { id: 6, name: 'Subscriptions and Services', color: '#EC4899' },
    { id: 7, name: 'Other', color: '#6B7280' },
];