'use client'
import React from 'react'
import { Button } from '../ui/button'

type Props = {
  title: string
  createdDate: string
}

const ShareHeader: React.FC<Props> = ({ title, createdDate }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className='flex h-full flex-row items-center justify-between rounded-[2rem] bg-gray-900 p-8'>
      <div className='text-left text-white'>
        <h1 className='mb-3 text-3xl font-bold'>{title}</h1>
        <p className='text-sm text-gray-300'>{formatDate(createdDate)}</p>
      </div>
      <div>
        <Button>Get started with AiPDFly</Button>
      </div>
    </div>
  )
}

export default ShareHeader
