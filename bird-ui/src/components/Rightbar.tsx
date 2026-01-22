import { useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
    CircularProgress,
    ListItemButton
} from '@mui/material'
import { useUserStore } from '../store/userStore'
import { useAuthStore } from '../store/authStore'

import { useNavigate } from 'react-router-dom'

export default function Rightbar() {
    const { users, loading, fetchUsers } = useUserStore()
    const { user: currentUser } = useAuthStore()

    const navigate = useNavigate()

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const recommended = users
        .filter(u => u.id !== currentUser?.id)
        .slice(0, 5)

    return (
        <Box sx={{ position: 'sticky', top: 24, width: '100%', maxWidth: 300 }}>
            <Paper elevation={0} sx={{ bgcolor: '#f7f9f9', borderRadius: 4, p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Кого читать
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <List>
                        {recommended.length > 0 ? (
                            recommended.map((u) => (
                                <ListItemButton onClick={() => navigate(`/profile/${u.id}`)} key={u.id} sx={{ mb: 2, borderRadius: 4 }}>
                                    <ListItemAvatar>
                                        <Avatar>{u.name.charAt(0).toUpperCase()}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={u.name}
                                        secondary={`@${u.email.split('@')[0]}`}
                                        primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                                        secondaryTypographyProps={{ noWrap: true }}
                                    />
                                    <Button size="small" variant="contained" sx={{ bgcolor: '#0f1419', color: '#fff', borderRadius: 4, textTransform: 'none', ml: 1 }}>
                                        Follow
                                    </Button>
                                </ListItemButton>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">Нет рекомендаций</Typography>
                        )}
                    </List>
                )}
            </Paper>
        </Box>
    )
}