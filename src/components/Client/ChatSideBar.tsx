'use client'
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import { MessageCircle, PlusCircle, MoreVertical, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button1 } from '../ui/button1'
import { UserButton } from '@clerk/nextjs'
import Logo from '../ui/logo'
import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button4 } from '../ui/button4'
import RenamePopup from './renamePopup'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchChatList } from '@/lib/fetchChatList'
import axiosInstance from '@/lib/axiosInstance'
import SubscriptionButton from './SubscriptionButton'

type Props = {
  chatId: number
  isPro: boolean
  userId: string
}

const deleteChat = async (chatId: number) => {
  try {
    await axiosInstance.post('/api/delete-chat', { chatId })
  } catch (error) {
    console.error('Error deleting chat:', error)
    toast.error('Error deleting chat. Try again later')
    throw error
  }
}

const ChatSideBar = ({ chatId, isPro, userId }: Props) => {
  useEffect(() => {
    refetch()
  }, [chatId])

  const {
    data: chatList,
    isLoading,
    isError,
    refetch
  } = useQuery<DrizzleChat[]>(
    ['chatData', userId],
    () => fetchChatList(userId),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10 // 10 minutes
    }
  )

  const queryClient = useQueryClient()
  const mutation = useMutation(deleteChat, {
    onSuccess: (data, variables) => {
      toast.success('Chat deleted!')

      // Invalidate the chatData query to refetch the chat list
      queryClient.invalidateQueries(['chatData', userId])

      // Redirect to the first chat if available, otherwise to the homepage
      if (chatList && chatList.length > 0) {
        const updatedChatList = chatList.filter(chat => chat.id !== variables)
        if (updatedChatList.length > 0) {
          router.push(`/chat/${updatedChatList[0].id}`)
        } else {
          router.push('/')
        }
      }
    },
    onError: error => {
      console.error('Error deleting chat:', error)
    }
  })

  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [hoveredChat, setHoveredChat] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter() // Initialize useRouter

  const handleMenuToggle = (id: number) => {
    setMenuOpen(prev => (prev === id ? null : id))
  }

  const handleDelete = (id: number) => {
    setMenuOpen(null)
    toast(t => (
      <div>
        Confirm deletion of this chat?
        <div className='m-1 flex items-center justify-center gap-2'>
          <Button4
            onClick={() => {
              YesDeleteChat(id) // Pass the chatId as an argument
              toast.dismiss(t.id)
            }}
          >
            Yes
          </Button4>

          <Button4
            onClick={() => {
              NoDeleteChat()
              toast.dismiss(t.id)
            }}
          >
            No
          </Button4>
        </div>
      </div>
    ))
  }

  const NoDeleteChat = () => {
    toast.error('Chat has not been deleted!')
  }

  const YesDeleteChat = (id: number) => {
    mutation.mutate(id) //
  }

  const handleRename = async (id: number) => {
    setMenuOpen(null) // Close the menu after rename action
  }

  return (
    <div className='relative h-full w-80 overflow-hidden rounded-[2rem] bg-gray-900'>
      <div className='h-full w-full overflow-hidden rounded-[2rem] bg-gray-900 p-4 text-gray-200'>
        <div className='mb-6'>
          <Logo
            showHomeLogo={false}
            showChatLogo={true}
            showDashboardLogo={false}
          />
          <Link href='/'>
            <Button1 className='w-full border border-dashed border-emerald-500'>
              <PlusCircle className='mr-2 h-4 w-4' />
              New Chat
            </Button1>
          </Link>
        </div>

        <div className='h-full bg-gray-900'>
          <div className='scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-500 flex h-full flex-col gap-2 overflow-auto pb-64'>
            {isLoading ? (
              // Skeleton UI
              <div className='flex flex-col gap-2'>
                {[...Array(17)].map((_, index) => (
                  <div
                    key={index}
                    className='h-12 w-full animate-pulse rounded-lg bg-gray-800'
                  />
                ))}
              </div>
            ) : (
              chatList &&
              chatList.map((chat: DrizzleChat) => (
                <div
                  key={chat.id}
                  className='group relative'
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                >
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div
                      className={cn(
                        'flex items-center rounded-lg p-3 text-slate-300',
                        {
                          'bg-emerald-500 text-white': chat.id === chatId,
                          'hover:text-white': chat.id !== chatId
                        }
                      )}
                      style={{ width: '100%' }}
                    >
                      <MessageCircle className='mr-2 flex-shrink-0' />
                      <p className='flex-grow overflow-hidden truncate text-ellipsis whitespace-nowrap text-[1rem]'>
                        {chat.pdfName}
                      </p>
                      {(hoveredChat === chat.id || chat.id === chatId) && (
                        <button
                          onClick={e => {
                            e.preventDefault()
                            handleMenuToggle(chat.id)
                          }}
                          className='ml-auto flex-shrink-0'
                        >
                          <MoreVertical className='h-5 w-5 text-slate-300 hover:text-white' />
                        </button>
                      )}
                    </div>
                  </Link>
                  {menuOpen === chat.id && (
                    <div
                      ref={menuRef}
                      className='absolute right-0 top-full z-50 mt-1 rounded-lg bg-neutral-700 p-3 text-[15px] font-light shadow-lg'
                    >
                      <div className='flex cursor-pointer items-center rounded-lg p-2 hover:bg-neutral-800'>
                        <RenamePopup
                          chatId={chat.id} // Pass the chatIdToRename if it is not null, otherwise pass 0
                          userId={userId}
                        />
                      </div>
                      <div
                        className='flex cursor-pointer items-center rounded-lg p-2 hover:bg-neutral-800'
                        onClick={() => handleDelete(chat.id)}
                      >
                        <Trash className='mr-2 h-4 w-4 text-xs' />
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className='absolute bottom-0 left-0 right-0 bg-neutral-800 p-2'>
          <div className='flex h-16 items-center justify-center gap-4'>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10'
                }
              }}
            />
            <SubscriptionButton isPro={isPro} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSideBar
