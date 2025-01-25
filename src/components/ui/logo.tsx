import { UserButton, SignedIn } from '@clerk/nextjs'
import { Bot } from 'lucide-react'
import React from 'react'

interface LogoProps {
  showHomeLogo: boolean
  showChatLogo: boolean
  showDashboardLogo: boolean
}

const Logo: React.FC<LogoProps> = ({
  showHomeLogo,
  showChatLogo,
  showDashboardLogo
}) => {
  return (
    <div>
      {showHomeLogo && (
        <div className='m-16 flex w-auto items-center justify-center'>
          <Bot className='mr-1 h-11 w-11 justify-center text-green-600' />
          <h1 className='bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-5xl font-semibold text-transparent'>
            AiPDFly
          </h1>
          <SignedIn>
            <div className='mx-8 my-1 h-10 w-10'>
              <UserButton
                afterSignOutUrl='/'
                appearance={{
                  elements: {
                    avatarBox: 'w-11 h-11'
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      )}
      {showChatLogo && (
        <div className='m-6 flex w-auto justify-center'>
          <Bot className='mr-1 h-11 w-11 justify-center text-green-600' />
          <h1 className='bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-5xl font-semibold text-transparent'>
            AiPDFly
          </h1>
        </div>
      )}
      {showDashboardLogo && (
        <div className='flex w-auto items-center justify-center'>
          <Bot className='mr-1 h-7 w-7 justify-center text-green-600' />
          <h1 className='bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-3xl font-semibold text-transparent'>
            AiPDFly
          </h1>
        </div>
      )}
    </div>
  )
}

export default Logo
