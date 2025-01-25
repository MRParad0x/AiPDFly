import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { DrizzleChat } from '@/lib/db/schema'
import { fetchChatList } from '@/lib/fetchChatList'
import axiosInstance from '@/lib/axiosInstance'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Edit } from 'lucide-react'

type RenamePopupProps = {
  chatId: number
  userId: string
}

const RenamePopup = ({ chatId, userId }: RenamePopupProps) => {
  const [newPdfName, setNewPdfName] = useState('')
  const [currentPdfName, setCurrentPdfName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    data: chatList,
    isLoading,
    isError,
    refetch
  } = useQuery<DrizzleChat[]>(['chatData', userId], () => fetchChatList(userId))

  const queryClient = useQueryClient()

  useEffect(() => {
    if (chatId) {
      const currentChat = chatList?.find(chat => chat.id === chatId)
      if (currentChat) {
        setNewPdfName(currentChat.pdfName)
        setCurrentPdfName(currentChat.pdfName)
      }
    }
  }, [chatId, chatList])

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
      },
      onSuccess: () => {
        toast.success('Chat renamed!')
        setIsDialogOpen(false)
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

  const isButtonDisabled = !newPdfName.trim() || newPdfName === currentPdfName

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger
          className='flex items-center justify-center'
          onClick={() => setIsDialogOpen(true)}
        >
          <Edit className='mr-2 h-4 w-4 text-xs' />
          <h1>Rename</h1>
        </DialogTrigger>
        <DialogContent className='gap-3 sm:max-w-[350px]'>
          <DialogHeader>
            <DialogTitle>Rename chat title</DialogTitle>
            <DialogDescription>
              Make changes to your chat title here.
            </DialogDescription>
          </DialogHeader>
          <div>
            <input
              type='text'
              value={newPdfName}
              onChange={e => setNewPdfName(e.target.value)}
              placeholder='Enter new name'
              className='w-full rounded border px-3 py-2'
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleRenameSubmit}
              disabled={renameMutation.isLoading || isButtonDisabled}
            >
              {renameMutation.isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RenamePopup
