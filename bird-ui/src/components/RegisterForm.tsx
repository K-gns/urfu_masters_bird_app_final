import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, Grid, Link, Alert, CircularProgress } from '@mui/material'
import AuthHeader from './AuthHeader'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAuthStore } from '../store/authStore'

export function RegisterForm({ onSwitch }: { onSwitch: (v: 'login' | 'register' | 'forgot') => void }) {
  const [fullName, setFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('')

  const { register, isLoading, error, clearError } = useAuthStore()

  useEffect(() => {
    clearError()
  }, [clearError])

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName || !regEmail || !regPassword || !regPasswordConfirm) {
      // Можно добавить локальную валидацию
      return
    }
    if (regPassword !== regPasswordConfirm) {
      alert('Пароли не совпадают.')
      return
    }

    try {
      await register(fullName, regEmail, regPassword)
      alert('Регистрация успешна! Теперь вы можете войти.')
      onSwitch('login')
    } catch (e) {
      // Ошибка в сторе
    }
  }

  return (
      <>
        <AuthHeader title="Создать аккаунт" subtitle="Быстрая регистрация" icon={<PersonAddIcon sx={{ fontSize: 32 }} />} />

        <Grid item sx={{ width: '100%' }}>
          <Box component="form" onSubmit={handleRegisterSubmit} noValidate sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField margin="normal" required fullWidth id="fullname" label="ФИО" name="fullname" autoComplete="name" autoFocus value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
            <TextField margin="normal" required fullWidth id="regEmail" label="Электронная почта" name="regEmail" autoComplete="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} disabled={isLoading} />
            <TextField margin="normal" required fullWidth name="regPassword" label="Пароль" type="password" id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} disabled={isLoading} />
            <TextField margin="normal" required fullWidth name="regPasswordConfirm" label="Повторите пароль" type="password" id="regPasswordConfirm" value={regPasswordConfirm} onChange={(e) => setRegPasswordConfirm(e.target.value)} disabled={isLoading} />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
            </Button>

            <Grid container sx={{ mt: 2 }}>
              <Grid item>
                <Link component="button" onClick={() => onSwitch('login')} variant="body2">
                  Уже есть аккаунт? Войти
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </>
  )
}

export default RegisterForm