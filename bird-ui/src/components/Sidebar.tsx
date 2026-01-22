import { List, ListItemButton, ListItemIcon, ListItemText, Box, Paper, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const menuItems = [
        { text: 'Главная', icon: <HomeIcon />, path: '/' },
        { text: 'Мой профиль', icon: <PersonIcon />, path: '/profile' },
        { text: 'Настройки', icon: <SettingsIcon />, path: '/settings' },
    ]

    return (
        <Box sx={{ position: 'sticky', top: 24, mt: 3, width: { xs: '100%', sm: 240 }, pr: { xs: 0, sm: 2 } }}>
            <Paper elevation={0} sx={{ borderRadius: 4, p: 2, bgcolor: 'background.paper', minHeight: 'fit-content' }}>

                {/* Логотип */}
                <Box
                    onClick={() => navigate('/')}
                    sx={{
                        mb: 2,
                        px: 2,
                        cursor: 'pointer',
                        display: 'inline-block'
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: '900', color: '#1d9bf0', letterSpacing: -1 }}>
                        Bird
                    </Typography>
                </Box>

                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 8,
                                mb: 1,
                                py: 1.5,
                                '&:hover': {
                                    bgcolor: 'rgba(29,155,240,0.1)',
                                    color: '#1d9bf0',
                                    '& .MuiListItemIcon-root': { color: '#1d9bf0' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontSize: 18, fontWeight: 600 }}
                            />
                        </ListItemButton>
                    ))}

                    <ListItemButton
                        onClick={logout}
                        sx={{
                            borderRadius: 8,
                            mt: 4,
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.50' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText
                            primary="Выйти"
                            primaryTypographyProps={{ fontSize: 18, fontWeight: 600 }}
                        />
                    </ListItemButton>
                </List>
            </Paper>
        </Box>
    )
}