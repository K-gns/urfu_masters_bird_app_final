// src/store/tweetStore.ts
import { create } from 'zustand'
import api from '../api/axios'
import { useAuthStore } from './authStore'

export interface Tweet {
    id: string
    author: string // UUID автора
    content: string
    timestamp: number
}

interface TweetState {
    tweets: Tweet[]        // Общая лента
    userTweets: Tweet[]    // Твиты конкретного профиля
    loading: boolean
    fetchFeed: () => Promise<void>
    fetchUserTweets: (userId: string) => Promise<void>
    createTweet: (content: string) => Promise<void>
}

export const useTweetStore = create<TweetState>((set) => ({
    tweets: [],
    userTweets: [],
    loading: false,

    fetchFeed: async () => {
        const user = useAuthStore.getState().user
        if (!user) return

        set({ loading: true })
        try {
            // Запрашиваем ленту для текущего пользователя
            const response = await api.get(`/api/twitter/messages/subscriber/${user.id}`)
            if (response.data.code === '200') {
                // Сортируем по новизне
                const sorted = response.data.data.sort((a: Tweet, b: Tweet) => b.timestamp - a.timestamp)
                set({ tweets: sorted })
            }
        } catch (e) {
            console.error(e)
        } finally {
            set({ loading: false })
        }
    },

    fetchUserTweets: async (userId: string) => {
        set({ loading: true, userTweets: [] }) // Очищаем перед загрузкой
        try {
            const response = await api.get(`/api/twitter/messages/producer/${userId}`)
            if (response.data.code === '200') {
                const sorted = response.data.data.sort((a: Tweet, b: Tweet) => b.timestamp - a.timestamp)
                set({ userTweets: sorted })
            }
        } catch (e) {
            console.error(e)
        } finally {
            set({ loading: false })
        }
    },

    createTweet: async (content) => {
        const user = useAuthStore.getState().user
        if (!user) return

        try {
            // author отправляем, но бэкенд его перезапишет (Identity Enforcement)
            await api.post('/api/twitter/messages/message', {
                author: user.id,
                content: content
            })
            // После создания обновляем ленту
            useTweetStore.getState().fetchFeed()
        } catch (e) {
            console.error(e)
            alert('Ошибка при создании твита')
        }
    }
}))