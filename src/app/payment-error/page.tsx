'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const PaymentErrorPage = () => {
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
      toast.error(
        'Your payment was not successful! try again later. Redirecting...',
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

export default PaymentErrorPage
