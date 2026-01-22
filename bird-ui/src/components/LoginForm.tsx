import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Grid, Divider, Link, Alert, CircularProgress, Typography } from '@mui/material'
import AuthHeader from './AuthHeader'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuthStore } from '../store/authStore'

export function LoginForm({ onSwitch }: { onSwitch: (v: 'login' | 'register' | 'forgot') => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, isLoading, error, clearError } = useAuthStore()

  useEffect(() => {
    clearError()
  }, [clearError])

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля.')
      return
    }

    try {
      await login(email, password)
    } catch (e) {
      // Ошибка в сторе
    }
  }

  return (
      <>
        {/* Логотип Bird */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: '900', color: '#1d9bf0', letterSpacing: -1 }}>
            Bird
          </Typography>
        </Box>

        <AuthHeader title="Добро пожаловать" subtitle="Войдите, чтобы продолжить работу с аккаунтом" />

        <Grid item sx={{ width: '100%' }}>
          <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Электронная почта"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, py: 1.2 }}
                disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
            </Button>

            <Divider sx={{ my: 2 }}>или</Divider>

            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} disabled sx={{ textTransform: 'none', py: 1 }}>
              Войти через Google
            </Button>

            <Grid container sx={{ mt: 2 }}>
              <Grid item xs>
                <Link component="button" onClick={() => onSwitch('forgot')} variant="body2">
                  Забыли пароль?
                </Link>
              </Grid>
              <Grid item>
                <Link component="button" onClick={() => onSwitch('register')} variant="body2">
                  Нет аккаунта? Зарегистрироваться
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </>
  )
}

export default LoginForm