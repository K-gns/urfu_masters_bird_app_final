import React from 'react'
import { Grid, Avatar, Typography, Box } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

export function AuthHeader({
                               title,
                               subtitle,
                               icon,
                           }: {
    title: string
    subtitle?: string
    icon?: React.ReactNode
}) {
    return (
        <Grid container direction="column" alignItems="center" spacing={1}>
            <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        {icon ?? <LockOutlinedIcon />}
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {title}
                    </Typography>
                </Box>
            </Grid>

            {subtitle && (
                <Grid item>
                    <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                        {subtitle}
                    </Typography>
                </Grid>
            )}
        </Grid>
    )
}

export default AuthHeader