'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthState } from '@/types/user';
import { GenericDataType } from '@/types/generic.types';

// Import server actions
import {
    studentSignin,
    adminSignin,
    logout as serverLogout,
    getCurrentUser as fetchCurrentUser
} from '@/app/actions/auth-actions';
import { notify } from './ToastProvider';
import { baseUrl, Roles } from '@/config';

interface AuthContextType extends AuthState {
    studentSignin: (data: GenericDataType) => Promise<any>;
    adminSignin: (data: GenericDataType) => Promise<any>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        access_token: null,
        loading: true,
        error: null,
    });
    const router = useRouter();

    // Check auth status on page load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { success } = await fetchCurrentUser();

                if (success && success.user) {
                    setAuthState({
                        user: success.user,
                        access_token: success.access_token || null,
                        loading: false,
                        error: null
                    });
                } else {
                    setAuthState({
                        user: null,
                        access_token: null,
                        loading: false,
                        error: null
                    });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setAuthState({
                    user: null,
                    access_token: null,
                    loading: false,
                    error: null
                });
            }
        };

        checkAuth();
    }, []);

    const handleStudentLogin = async (data: GenericDataType) => {
        setAuthState({ ...authState, loading: true, error: null });

        try {
            const { success, error } = await studentSignin(data);

            if (success) {
                setAuthState({
                    user: success.user,
                    access_token: success.access_token,
                    loading: false,
                    error: null
                });
                notify({ message: 'Login Successful.', variant: "success", timeout: 5000 });
                let redirectUrl = success.user.role === Roles.STUDENT
                    ? `${baseUrl}/dashboard/student`
                    : success.user.role === Roles.TEACHER ? `${baseUrl}/dashboard/teacher`
                        : success.user.role === Roles.ADMIN ? `${baseUrl}/dashboard/admin`
                            : `${baseUrl}/dashboard/student`;

                if (success.user.role === Roles.STUDENT) {
                    redirectUrl = (!success.user.is_applied)
                        ? `${redirectUrl}/complete-application`
                        : `${redirectUrl}`;
                }
                router.push(`${redirectUrl}`);
                return { success: true };
            }
            if (error) {
                setAuthState({
                    user: null,
                    access_token: null,
                    loading: false,
                    error: error
                });
                notify({ message: 'Login Failed Try again.', variant: "error", timeout: 5000 });
                return { error: error };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setAuthState({
                user: null,
                access_token: null,
                loading: false,
                error: errorMessage
            });

            return { error: errorMessage };
        }
    };

    const handleAdminLogin = async (data: GenericDataType) => {
        setAuthState({ ...authState, loading: true, error: null });

        try {
            const { success, error } = await adminSignin(data);

            if (success) {
                setAuthState({
                    user: success.user,
                    access_token: success.access_token,
                    loading: false,
                    error: null
                });
                notify({ message: 'Login Successful.', variant: "success", timeout: 5000 })
                router.push(`${baseUrl}/dashboard/admin/users/student-applications`);
                return { success: true };
            }
            if (error) {
                setAuthState({
                    user: null,
                    access_token: null,
                    loading: false,
                    error: error
                });
                notify({ message: 'Login Failed Try again.', variant: "error", timeout: 5000 });
                return { error: error };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setAuthState({
                user: null,
                access_token: null,
                loading: false,
                error: errorMessage
            });

            return { error: errorMessage };
        }
    };

    const handleLogout = async () => {
        setAuthState({ ...authState, loading: true });

        try {
            await serverLogout();
            setAuthState({
                user: null,
                access_token: null,
                loading: false,
                error: null
            });

            router.push(`/auth/signin`);
            // router.push(`/auth/${authState.user?.role.toLowerCase()}`);
        } catch (error) {
            console.error('Logout error:', error);

            setAuthState({
                ...authState,
                loading: false,
                error: error instanceof Error ? error.message : 'Logout failed'
            });
        }
    };

    const refreshUser = async () => {
        setAuthState({ ...authState, loading: true });

        try {
            const { success } = await fetchCurrentUser();

            if (success && success.user) {
                setAuthState({
                    user: success.user,
                    access_token: success.access_token || authState.access_token,
                    loading: false,
                    error: null
                });
            } else {
                // If there's an error getting the user, they might be logged out
                setAuthState({
                    user: null,
                    access_token: null,
                    loading: false,
                    error: null
                });

                router.push('/auth/signin');
            }
        } catch (error) {
            console.error('Refresh user error:', error);

            setAuthState({
                ...authState,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to refresh user'
            });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                studentSignin: handleStudentLogin,
                adminSignin: handleAdminLogin,
                logout: handleLogout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
