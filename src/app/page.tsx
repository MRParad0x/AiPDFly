import { Button } from '@/components/ui/button'
import { auth, clerkClient } from '@clerk/nextjs/server'
import Link from 'next/link'
import { ArrowRight, LogIn } from 'lucide-react'
import FileUpload from '@/components/Client/FileUpload'
import Logo from '@/components/ui/logo'
import axiosInstance from '@/lib/axiosInstance'
import { checkSubscription } from '@/lib/subscription'
import SubscriptionButton from '@/components/Client/SubscriptionButton'

export default async function Home() {
  const { userId } = await auth()
  const isAuth = !!userId
  const isPro = await checkSubscription()

  let firstChat

  if (userId) {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-chat`,
        {
          userId
        }
      )
      firstChat = response.data
      if (firstChat && firstChat.length > 0) {
        firstChat = firstChat[0]
      }
    } catch (error) {
      console.error('Error fetching chat:', error)
    }
  }

  return (
    <div className='min-h-screen w-screen bg-gradient-to-r from-slate-50 via-teal-50 to-green-100'>
      <div className='flex w-auto flex-col'>
        <Logo
          showHomeLogo={true}
          showChatLogo={false}
          showDashboardLogo={false}
        />
      </div>

      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center justify-center text-center'>
          <div className='flex items-center'>
            <h1 className='text-5xl'>
              Optimize your workflow <br />
              with <span className='mr-3 text-5xl font-semibold'>AiPDFly</span>
            </h1>
          </div>

          <div className='my-6 flex'>
            {isAuth && firstChat.length !== 0 && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className='ml-2' />
                  </Button>
                </Link>
                <div className='ml-3'>
                  <SubscriptionButton isPro={isPro} />
                </div>
              </>
            )}
          </div>

          <p className='mb-3 max-w-xl text-lg text-slate-600'>
            Connect with millions of students, researchers, and professionals to
            swiftly find answers and gain insights into research using AI.
          </p>

          <div className='mt-4 w-full'>
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href='/sign-in'>
                <Button>
                  Login to get Started!
                  <LogIn className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
