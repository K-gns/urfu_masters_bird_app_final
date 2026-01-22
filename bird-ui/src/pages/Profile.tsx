import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Paper, Typography, Avatar, CircularProgress, Divider } from '@mui/material'
import { useAuthStore } from '../store/authStore'
import { useTweetStore } from '../store/tweetStore'
import type { UserProfile } from '../store/userStore'
import api from '../api/axios'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Profile() {
    const { userId } = useParams()
    const { user: currentUser } = useAuthStore()
    const { userTweets, loading: tweetsLoading, fetchUserTweets } = useTweetStore()

    const [profileData, setProfileData] = useState<UserProfile | null>(null)
    const [profileLoading, setProfileLoading] = useState(false)

    const targetId = userId || currentUser?.id

    useEffect(() => {
        if (!targetId) return

        const loadProfile = async () => {
            setProfileLoading(true)
            try {
                const response = await api.get(`/api/ums/users/user/${targetId}`)
                if (response.data.code === '200') {
                    setProfileData(response.data.data)
                }
            } catch (e) {
                console.error("Failed to load profile", e)
            } finally {
                setProfileLoading(false)
            }
        }

        loadProfile()
        fetchUserTweets(targetId)
    }, [targetId, fetchUserTweets])

    if (profileLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
    }

    if (!profileData) {
        return <Box p={2}>Профиль не найден</Box>
    }

    const joinDate = profileData?.created
        ? new Date(profileData?.created * 1000).toLocaleDateString()
        : 'Неизвестно';

    return (
        // Используем Paper как основной контейнер с закруглением, аналогично Feed
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                bgcolor: 'background.paper',
                minHeight: '80vh',
                overflow: 'hidden', // Чтобы баннер не вылезал за углы
                mb: 4
            }}
        >
            <Box>
                {/* Баннер */}
                <Box sx={{ height: 150, bgcolor: '#cfd9de' }}></Box>

                {/* Аватар */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', px: 2, mt: -6 }}>
                    <Avatar sx={{ width: 130, height: 130, border: '4px solid white', fontSize: '3rem', bgcolor: 'primary.main' }}>
                        {profileData.name.charAt(0).toUpperCase()}
                    </Avatar>
                </Box>

                {/* Инфо о пользователе */}
                <Box sx={{ mt: 1, px: 2, pb: 2 }}>
                    <Typography variant="h5" fontWeight="800" sx={{ lineHeight: 1.2 }}>
                        {profileData.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body1">
                        @{profileData.email.split('@')[0]}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, color: 'text.secondary' }}>
                        <CalendarMonthIcon fontSize="small" />
                        <Typography variant="body2">
                            Регистрация: {joinDate}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider />

            {/* Вкладки / Заголовок ленты */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eff3f4' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Твиты</Typography>
            </Box>

            {/* Список твитов */}
            {tweetsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : userTweets.length > 0 ? (
                userTweets.map((tweet) => (
                    // Используем Box вместо Paper для сплошной ленты
                    <Box
                        key={tweet.id}
                        sx={{
                            p: 2,
                            borderBottom: '1px solid #eff3f4',
                            transition: '0.2s',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar>{profileData.name.charAt(0).toUpperCase()}</Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Typography fontWeight="bold">{profileData.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">@{profileData.email.split('@')[0]}</Typography>
                                    <Typography variant="caption" color="text.secondary">· {new Date(tweet.timestamp * 1000).toLocaleDateString()}</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {tweet.content}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))
            ) : (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography>Пока нет твитов</Typography>
                </Box>
            )}
        </Paper>
    )
}