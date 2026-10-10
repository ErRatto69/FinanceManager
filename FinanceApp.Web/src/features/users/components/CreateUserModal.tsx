import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import type { UserRole } from '../../../types/user.types';
import type { ProblemDetails } from '../../../types/api.types';
import axios from 'axios';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { username: string; password: string; role: UserRole }) => Promise<unknown>;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('Standard');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setRole('Standard');
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await onSubmit({ username: username.trim(), password, role });
            handleClose();
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const problem = err.response.data as ProblemDetails;
                setError(problem.detail || 'Failed to create user.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New User">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <Alert message={error} variant="error" />}

                <Input
                    label="Username"
                    type="text"
                    placeholder="e.g. MarioRossi"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <Input
                    label="Password (min. 6 characters)"
                    type="password"
                    placeholder="Secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Select
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    options={[
                        { value: 'Admin', label: 'Admin (Full access)' },
                        { value: 'Standard', label: 'Standard (Dashboard, Stats, Grocery)' },
                        { value: 'Basic', label: 'Basic (Grocery list only)' },
                    ]}
                />

                <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Create User
                    </Button>
                </div>
            </form>
        </Modal>
    );
};