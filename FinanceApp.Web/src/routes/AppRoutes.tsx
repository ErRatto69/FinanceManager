import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { GroceryPage } from '../pages/GroceryPage';
import { StatsPage } from '../pages/StatsPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Root */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    {/* Admin & Standard Only */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'Standard']} />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/stats" element={<StatsPage />} />
                    </Route>

                    {/* All Roles (Admin, Standard, Basic) */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'Standard', 'Basic']} />}>
                        <Route path="/grocery" element={<GroceryPage />} />
                    </Route>

                    {/* Admin Only */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};