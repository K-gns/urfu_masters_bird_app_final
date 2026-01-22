import { create } from 'zustand'
import api from '../api/axios'

export interface UserProfile {
    id: string
    name: string
    email: string
    created: number
}

interface UserState {
    users: UserProfile[]
    loading: boolean
    fetchUsers: () => Promise<void>
}

// Интерфейс ответа бэкенда
interface UsersResponse {
    code: string
    message: string
    data: UserProfile[]
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    loading: false,

    fetchUsers: async () => {
        set({ loading: true })
        try {
            const response = await api.get<UsersResponse>('/api/ums/users')

            if (response.data.code === '200') {
                set({ users: response.data.data })
            }
        } catch (e) {
            console.error('Ошибка загрузки пользователей:', e)
        } finally {
            set({ loading: false })
        }
    }
}))