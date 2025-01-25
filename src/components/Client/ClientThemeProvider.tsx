'use client'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import theme from '../ui/theme'

const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
}

const ClientThemeProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default ClientThemeProvider
