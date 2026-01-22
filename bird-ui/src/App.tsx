import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box, Grid, Container } from '@mui/material'
import { useAuthStore } from './store/authStore'

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import ForgotForm from './components/ForgotForm'

import Sidebar from './components/Sidebar'
import Feed from './pages/Feed'
import Rightbar from './components/Rightbar'
import Profile from "./pages/Profile"

function AuthLayout() {
    const [view, setView] = useState<'login' | 'register' | 'forgot'>('login')

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 450, width: '100%', p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
                {view === 'login' && <LoginForm onSwitch={setView} />}
                {view === 'register' && <RegisterForm onSwitch={setView} />}
                {view === 'forgot' && <ForgotForm onSwitch={setView} />}
            </Box>
        </Box>
    )
}

function MainLayout() {
    return (
        <Container maxWidth="xl" sx={{ px: { xs: 0, md: 4 } }}>
            <Grid container justifyContent="center" columnSpacing={4}>

                {/* Левая колонка (Меню) */}
                <Grid item xs={12} sm={3} md={3} lg={3}
                      sx={{
                          position: 'relative',
                          // ДОБАВЛЕНО: display: 'flex' и justifyContent: 'flex-end'
                          // Это прижимает Sidebar к правой части колонки (ближе к ленте)
                          display: { xs: 'none', sm: 'flex' },
                          justifyContent: 'flex-end'
                      }}
                >
                    <Sidebar />
                </Grid>

                {/* Центральная колонка (Лента) */}
                <Grid item xs={12} sm={8} md={6} lg={6}
                      sx={{ minHeight: '100vh' }}
                >
                    <Routes>
                        <Route path="/" element={<Feed />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                        <Route path="/settings" element={<Box p={2} sx={{ color: 'white' }}>Настройки (WIP)</Box>} />
                    </Routes>
                </Grid>

                {/* Правая колонка (Рекомендации) */}
                <Grid item md={3} lg={3}
                      sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}
                >
                    <Rightbar />
                </Grid>
            </Grid>
        </Container>
    )
}

export default function App() {
    const { isAuthenticated } = useAuthStore()

    return (
        <BrowserRouter>
            {isAuthenticated ? <MainLayout /> : <AuthLayout />}
        </BrowserRouter>
    )
}