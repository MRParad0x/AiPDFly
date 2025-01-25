'use client'
import React from 'react'
import { Button } from '../ui/button'
import axiosInstance from '@/lib/axiosInstance'

type Props = { isPro: boolean }

const SubscriptionButton = (props: Props) => {
  const [loading, setLoading] = React.useState(false)
  const handleSubscription = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/stripe')
      window.location.href = response.data.url
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Button disabled={loading} onClick={handleSubscription}>
      {props.isPro ? 'Manage Subscriptions' : 'Upgrade Pro'}
    </Button>
  )
}

export default SubscriptionButton
