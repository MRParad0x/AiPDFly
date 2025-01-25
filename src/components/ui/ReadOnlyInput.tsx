import { TextField } from '@mui/material'
import React from 'react'

type Props = {
  shareLink: string
}

const ReadOnlyInput = ({ shareLink }: Props) => {
  return (
    <div>
      <TextField
        id='outlined-read-only-input'
        label='Link to Share'
        defaultValue={shareLink}
        InputProps={{
          readOnly: true
        }}
        fullWidth
      />
    </div>
  )
}

export default ReadOnlyInput
