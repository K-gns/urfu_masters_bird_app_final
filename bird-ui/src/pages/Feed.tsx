import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, TextField, Button, Typography, Avatar, CircularProgress } from '@mui/material'
import { useTweetStore } from '../store/tweetStore'
import { useAuthStore } from '../store/authStore'
import { useUserStore } from '../store/userStore'

export default function Feed() {
    const { tweets, loading, fetchFeed, createTweet } = useTweetStore()
    const { user } = useAuthStore()
    const { users, fetchUsers } = useUserStore() // Добавил для отображения имен
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchFeed()
        if (users.length === 0) fetchUsers()
    }, [fetchFeed, fetchUsers, users.length])

    const handlePost = async () => {
        if (!content.trim()) return
        await createTweet(content)
        setContent('')
    }

    // Хелпер для получения имени
    const getAuthorName = (id: string) => {
        const u = users.find(user => user.id === id)
        return u ? u.name : 'User'
    }

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                bgcolor: 'background.paper',
                minHeight: '80vh', // Чтобы блок был высоким даже без твитов
                overflow: 'hidden',
                mb: 4
            }}
        >
            {/* Блок создания твита */}
            <Box sx={{ p: 2, borderBottom: '1px solid #eff3f4' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Главная</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar>{user?.email[0].toUpperCase()}</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            placeholder="Что происходит?"
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handlePost}
                                disabled={!content.trim()}
                                sx={{ borderRadius: 8, bgcolor: '#1d9bf0', textTransform: 'none' }}
                            >
                                Твитнуть
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Список твитов */}
            {loading && tweets.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : (
                tweets.map((tweet) => (
                    <Box
                        key={tweet.id}
                        sx={{
                            p: 2,
                            borderBottom: '1px solid #eff3f4',
                            cursor: 'pointer',
                            transition: '0.2s',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' } // Эффект наведения
                        }}
                        onClick={() => navigate(`/profile/${tweet.author}`)}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar>{getAuthorName(tweet.author)[0]}</Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Typography fontWeight="bold">{getAuthorName(tweet.author)}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        @{tweet.author.substring(0, 8)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        · {new Date(tweet.timestamp * 1000).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {tweet.content}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))
            )}

            {/* Заглушка, если твитов нет (чтобы не было пустого белого поля) */}
            {!loading && tweets.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    Лента пуста. Подпишитесь на кого-нибудь!
                </Box>
            )}
        </Paper>
    )
}