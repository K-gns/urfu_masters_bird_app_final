import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axios'

interface User {
    id: string
    email: string
    roles: string[]
}

interface AuthState {
    token: string | null
    isAuthenticated: boolean
    user: User | null

    isLoading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    clearError: () => void
}

interface LoginResponseData {
    token: string
    expire: number
    id: string
    email: string
    roles: string[]
}

interface BackendResponse<T> {
    code: string
    message: string
    data: T
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const response = await api.post<BackendResponse<LoginResponseData>>('/api/ums/auth/login', {
                        email,
                        password,
                    })

                    if (response.data.code === '200') {
                        const data = response.data.data
                        set({
                            token: data.token,
                            isAuthenticated: true,
                            user: {
                                id: data.id,
                                email: data.email,
                                roles: data.roles
                            },
                            isLoading: false
                        })
                    } else {
                        // Если сервер вернул 200 OK, но код ошибки внутри JSON (например, "401")
                        set({ error: response.data.message || 'Ошибка входа', isLoading: false })
                        throw new Error(response.data.message)
                    }
                } catch (err: any) {
                    const msg = err.response?.data?.message || err.message || 'Ошибка соединения'
                    set({ error: msg, isLoading: false })
                    throw err
                }
            },

            register: async (name, email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const payload = {
                        name, email, password,
                        roles: [
                            { role: 'SUBSCRIBER', description: 'User role' },
                            { role: 'PRODUCER', description: 'Can post messages' }
                        ]
                    }
                    const response = await api.post('/api/ums/users/user', payload)

                    if (response.data.code !== '201') {
                        set({ error: response.data.message || 'Ошибка регистрации', isLoading: false })
                        throw new Error(response.data.message)
                    }

                    set({ isLoading: false })
                } catch (err: any) {
                    const msg = err.response?.data?.message || err.message || 'Ошибка регистрации'
                    set({ error: msg, isLoading: false })
                    throw err
                }
            },

            logout: () => {
                set({ token: null, isAuthenticated: false, user: null, error: null })
                localStorage.removeItem('auth-storage')
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'auth-storage',
            // Важно: не сохраняем isLoading и error в localStorage
            partialize: (state) => ({
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user
            }),
        }
    )
)