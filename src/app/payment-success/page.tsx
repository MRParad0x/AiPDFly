'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const PaymentSuccessPage = () => {
  const router = useRouter()
  const toastShown = useRef(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      router.push('/') // Redirect to home if session_id is not present
      return
    }

    if (!toastShown.current) {
      toast.success(
        "Your payment was successful! You've been upgraded to Pro. Redirecting...",
        {
          style: {
            maxWidth: '800px', // Adjust the width as needed
            whiteSpace: 'pre-wrap' // Ensure text wraps within the toast
          },
          duration: 4000
        }
      )
      toastShown.current = true
    }

    const timer = setTimeout(() => {
      router.push('/') // Redirect to the home page
    }, 3000) // Redirect after 3 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <Toaster />
    </>
  )
}

export default PaymentSuccessPage
