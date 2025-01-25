import ChatComponent from '@/components/Client/ChatComponent'
import ChatSideBar from '@/components/Client/ChatSideBar'
import PDFViewer from '@/components/Client/PDFViewer'
import { DrizzleChat, chats } from '@/lib/db/schema'
// import { checkSubscription } from "@/lib/subscription";
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { checkSubscription } from '@/lib/subscription'

type Props = {
  params: {
    chatId: string
  }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/sign-in')
  }
  // const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-chat`,
    { userId }
  )
  const _chats = response.data

  if (!_chats || _chats.length === 0) {
    return redirect('/')
  }

  // if (!_chats.find(chat => chat.id === parseInt(chatId))) {
  //   return redirect('/')
  // }

  const chatIdInt = parseInt(chatId)
  const currentChat = _chats.find((chat: DrizzleChat) => chat.id === chatIdInt)
  // console.log('currentChat:', currentChat)

  if (!currentChat) {
    return redirect('/')
  }

  // const currentChat = _chats.find(chat => chat.id === chatIdInt)
  const isPro = await checkSubscription()
  // console.log('userId layout:', userId)
  return (
    <div className='flex h-screen overflow-hidden bg-gradient-to-r from-slate-50 via-teal-50 to-green-100'>
      <div className='m-6 flex w-full'>
        {/* chat sidebar */}
        <div className='mr-6 w-1/6 max-w-screen-sm flex-[1]'>
          <ChatSideBar chatId={chatIdInt} isPro={isPro} userId={userId} />
        </div>
        {/* pdf viewer */}
        <div className='w-1/2 flex-[5]'>
          <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
        </div>
        {/* chat component */}
        <div className='ml-6 w-1/5 flex-[3] border-l-slate-200'>
          <ChatComponent chatId={chatIdInt} userId={userId} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
