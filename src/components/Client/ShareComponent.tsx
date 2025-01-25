'use client'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Message, useChat } from 'ai/react'
import { Send, Share, MessageSquare } from 'lucide-react'
import MessageList from './MessageList'
import AutoResizableTextarea from '../ui/Textarea' // Import the new component
import { Button } from '../ui/button'
import axiosInstance from '@/lib/axiosInstance'

type Props = {
  chatId: number
}

const ShareComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await axiosInstance.post<Message[]>(
        '/api/get-messages',
        {
          chatId
        }
      )
      return response.data
    }
  })

  const { messages } = useChat({
    api: '/api/chat',
    body: {
      chatId
    },
    initialMessages: data || []
  })

  useEffect(() => {
    const messageContainer = document.getElementById('message-container')
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  return (
    <div className='h-full'>
      {/* header */}
      <div className='relative h-full overflow-hidden rounded-[2rem] border-b-[20px] border-gray-900 bg-gray-900'>
        <div className='m-5left-0 absolute right-0 top-0 flex w-full items-center bg-neutral-800 p-2'>
          <div className='m-5 w-4/5'>
            <h3 className='flex bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-3xl font-bold text-transparent'>
              Chat History
              <MessageSquare className='ml-2 text-green-600' />
            </h3>
          </div>
        </div>

        <div className='h-full'>
          <div
            className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-500 m-4 flex h-full flex-col-reverse overflow-auto px-4 pb-10 pt-28'
            id='message-container'
          >
            {/* message list */}
            {isLoading ? (
              <div className='flex flex-col space-y-4'>
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex animate-pulse space-x-4 rounded-lg bg-gray-800 p-5'
                  >
                    <div className='h-10 w-10 rounded-full bg-gray-700'></div>
                    <div className='flex-1 space-y-4 py-1'>
                      <div className='h-4 w-3/4 rounded bg-gray-700'></div>
                      <div className='space-y-2'>
                        <div className='h-4 rounded bg-gray-700'></div>
                        <div className='h-4 w-5/6 rounded bg-gray-700'></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <MessageList
                messages={messages.reverse()}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareComponent
