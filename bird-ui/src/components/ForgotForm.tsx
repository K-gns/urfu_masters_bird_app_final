import React, { useState } from 'react'
import { Box, Button, TextField, Grid, Link } from '@mui/material'
import AuthHeader from './AuthHeader'

export default function ForgotForm({ onSwitch }: { onSwitch: (v: 'login' | 'register' | 'forgot') => void }) {
  const [forgotEmail, setForgotEmail] = useState('')

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!forgotEmail) {
      alert('Пожалуйста, укажите электронную почту.')
      return
    }
    console.log('Восстановление пароля для', forgotEmail)
    alert('Если аккаунт с таким email существует, инструкция по восстановлению отправлена (плейсхолдер).')
  }

  return (
    <>
      <AuthHeader title="Восстановление пароля" subtitle="Укажите вашу электронную почту" />

      <Grid item sx={{ width: '100%' }}>
        <Box component="form" onSubmit={handleForgotSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="forgotEmail" label="Электронная почта" name="forgotEmail" autoComplete="email" autoFocus value={forgotEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForgotEmail(e.target.value)} />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.2 }}>
            Отправить инструкцию
          </Button>

          <Grid container sx={{ mt: 2 }}>
            <Grid item>
              <Link component="button" onClick={() => onSwitch('login')} variant="body2">
                Вернуться на страницу входа
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  )
}

