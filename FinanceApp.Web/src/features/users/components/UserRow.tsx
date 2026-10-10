import React, { useState } from 'react';
import type { UserDto } from '../types/user-admin.types';
import type { UserRole } from '../../../types/user.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../../context/useAuth';

interface UserRowProps {
    user: UserDto;
    onRoleChange: (id: number, newRole: UserRole) => Promise<unknown>;
    onDeactivate: (id: number) => Promise<unknown>;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onRoleChange, onDeactivate }) => {
    const { user: currentUser } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);

    const isSelf = currentUser?.id === user.id;

    const handleRoleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as UserRole;
        if (newRole === user.role) return;

        setIsUpdating(true);
        try {
            await onRoleChange(user.id, newRole);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm(`Are you sure you want to deactivate user "${user.username}"?`)) return;

        setIsDeactivating(true);
        try {
            await onDeactivate(user.id);
        } finally {
            setIsDeactivating(false);
        }
    };

    const roleBadgeVariant = (role: UserRole) => {
        switch (role) {
            case 'Admin': return 'info';
            case 'Standard': return 'success';
            case 'Basic': return 'neutral';
        }
    };

    return (
        <tr className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        {user.role === 'Admin' ? <ShieldCheck className="w-4 h-4 text-blue-500" /> : <UserIcon className="w-4 h-4" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-white text-sm">{user.username}</span>
                            {isSelf && <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-medium">You</span>}
                        </div>
                        <span className="text-xs text-slate-400">ID: #{user.id}</span>
                    </div>
                </div>
            </td>

            <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                    <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
                    {!isSelf && user.isActive && (
                        <select
                            value={user.role}
                            disabled={isUpdating}
                            onChange={handleRoleSelect}
                            className="text-xs bg-transparent border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 outline-none cursor-pointer text-slate-600 dark:text-slate-300 hover:border-slate-400"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Standard">Standard</option>
                            <option value="Basic">Basic</option>
                        </select>
                    )}
                </div>
            </td>

            <td className="py-3.5 px-4">
                <Badge variant={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? 'Active' : 'Deactivated'}
                </Badge>
            </td>

            <td className="py-3.5 px-4 text-xs text-slate-400 hidden sm:table-cell">
                {new Date(user.createdAt).toLocaleDateString()}
            </td>

            <td className="py-3.5 px-4 text-right">
                {!isSelf && user.isActive && (
                    <Button
                        variant="ghost"
                        onClick={handleDeactivate}
                        isLoading={isDeactivating}
                        title="Deactivate account"
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </td>
        </tr>
    );
};