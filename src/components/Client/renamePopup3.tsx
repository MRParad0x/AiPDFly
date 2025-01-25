import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { DrizzleChat } from '@/lib/db/schema'
import { fetchChatList } from '@/lib/fetchChatList'
import axiosInstance from '@/lib/axiosInstance'

type RenamePopupProps = {
  chatId: number
  isVisible: boolean
  onClose: () => void
  userId: string
}

const RenamePopup3 = ({
  chatId,
  isVisible,
  onClose,
  userId
}: RenamePopupProps) => {
  const [newPdfName, setNewPdfName] = useState('')
  const [showPopup, setShowPopup] = useState(isVisible)
  const popupRef = useRef<HTMLDivElement>(null)

  const {
    data: chatList,
    isLoading,
    isError,
    refetch
  } = useQuery<DrizzleChat[]>(['chatData', userId], () => fetchChatList(userId))

  const queryClient = useQueryClient()

  useEffect(() => {
    if (isVisible) {
      setShowPopup(true)
      const currentChat = chatList?.find(chat => chat.id === chatId)
      if (currentChat) {
        setNewPdfName(currentChat.pdfName)
      }
    } else {
      setTimeout(() => setShowPopup(false), 300)
    }
  }, [isVisible, chatId, chatList])

  const renameMutation = useMutation(
    async (newPdfName: string) => {
      await axiosInstance.post('/api/rename-pdf', { chatId, newPdfName })
    },
    {
      onMutate: async newPdfName => {
        await queryClient.cancelQueries(['chatData', userId])

        const previousChatList = queryClient.getQueryData<DrizzleChat[]>([
          'chatData',
          userId
        ])

        if (previousChatList) {
          queryClient.setQueryData(
            ['chatData', userId],
            (old: DrizzleChat[] | undefined) =>
              old?.map(chat =>
                chat.id === chatId ? { ...chat, pdfName: newPdfName } : chat
              )
          )
        }

        return { previousChatList }
      },
      onError: (error, newPdfName, context) => {
        queryClient.setQueryData(
          ['chatData', userId],
          context?.previousChatList
        )
        toast.error('Failed to rename chat')
      },
      onSettled: () => {
        queryClient.invalidateQueries(['chatData', userId])
        onClose()
      },
      onSuccess: () => {
        toast.success('Chat renamed!')
      }
    }
  )

  const handleRenameSubmit = () => {
    if (!newPdfName.trim()) {
      toast.error('Name Required!', { icon: '🔴' })
      return
    }

    // Check for duplicate names
    const isDuplicate = chatList?.some(chat => chat.pdfName === newPdfName)
    if (isDuplicate) {
      toast.error('Enter a different name!', { icon: '🔴' })
      return
    }

    renameMutation.mutate(newPdfName)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  if (!showPopup) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={popupRef}
        className={`transform rounded-xl bg-white p-6 shadow-lg transition-transform duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        <h2 className='mb-4 text-xl font-bold'>Rename Chat</h2>
        <input
          type='text'
          value={newPdfName}
          onChange={e => setNewPdfName(e.target.value)}
          placeholder='Enter new name'
          className='mb-4 w-full rounded border px-3 py-2'
        />

        <div className='flex justify-end gap-2'>
          <Button
            onClick={handleRenameSubmit}
            disabled={renameMutation.isLoading}
          >
            {renameMutation.isLoading ? 'Updating...' : 'Update'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

export default RenamePopup3
