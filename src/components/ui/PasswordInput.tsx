import React, { useState } from 'react'
import { TextField, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button } from './button'

interface PasswordInputProps {
  password: string
  setPassword: (password: string) => void
  handleSetPassword: () => void
  isLoading: boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  handleSetPassword,
  isLoading
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== '') {
      handleSetPassword()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id='outlined-password-input'
        label='Enter Password'
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={handlePasswordChange}
        autoComplete='current-password'
        fullWidth
        margin='normal'
        variant='outlined'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Button
        type='submit'
        color='primary'
        disabled={isLoading || password === ''}
        style={{ marginTop: '0.5rem' }}
      >
        {isLoading ? 'Setting Pass...' : 'Set Password'}
      </Button>
    </form>
  )
}

export default PasswordInput
