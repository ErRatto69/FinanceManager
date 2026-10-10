import React, { useState } from 'react';
import { useUsersQuery } from '../features/users/hooks/useUsersQuery';
import { UserRow } from '../features/users/components/UserRow';
import { CreateUserModal } from '../features/users/components/CreateUserModal';
import { Button } from '../components/ui/Button';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
    const { data: users, isLoading, isError, createUser, updateRole, deactivateUser } = useUsersQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        User Management
                    </h1>
                    <p className="text-sm text-slate-500">
                        Control user access privileges, roles, and account statuses.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="self-start sm:self-auto">
                    <UserPlus className="w-4 h-4" />
                    New User
                </Button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            )}

            {isError && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Failed to load users from the server. Verify your network or administrator session.</span>
                </div>
            )}

            {users && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 hidden sm:table-cell">Created</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onRoleChange={async (id, role) => updateRole({ id, payload: { role } })}
                                    onDeactivate={async (id) => deactivateUser(id)}
                                />
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <CreateUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createUser}
            />
        </div>
    );
};