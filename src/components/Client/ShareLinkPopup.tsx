'use client'
import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Tabs, Box, Tab, Switch, Tooltip } from '@mui/material'
import axiosInstance from '@/lib/axiosInstance'
import { Loader2 } from 'lucide-react'
import {
  ContentCopy,
  CheckCircleOutline,
  DeleteOutline,
  ContentPaste,
  DeleteTwoTone,
  Delete,
  FileCopy
} from '@mui/icons-material'
import md5 from 'md5'
import PasswordInput from '../ui/PasswordInput'
import ReadOnlynput from '../ui/ReadOnlyInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Share } from '@mui/icons-material'
import { Button4 } from '../ui/button4'
import { Button3 } from '../ui/button3'
import { Button2 } from '../ui/button2'
import { Button1 } from '../ui/button1'

type ShareLinkPopupProps = {
  chatId: number
  userId: string
}

const ShareLinkPopup = ({ chatId, userId }: ShareLinkPopupProps) => {
  const [shareLink, setShareLink] = useState('')
  const [loading, setLoading] = useState(true)
  const [copyClicked, setCopyClicked] = useState(false)
  const [deleteClicked, setDeleteClicked] = useState(false)
  const [spassword, setSPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isSwitchChecked, setIsSwitchChecked] = useState(false) // State for switch checked status
  const queryClient = useQueryClient()
  const [value, setValue] = useState('one') // Default tab value
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const fetchShareLink = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.post('/api/get-share', { chatId })

      const { protocol, host } = new URL(window.location.href)
      const baseUrl = `${protocol}//${host}`
      const _shareKey = response.data[0]?.shareKey
      const _sharePassword = response.data[0]?.password

      if (_shareKey) {
        const shareLink = `${baseUrl}/share/${_shareKey}`
        setShareLink(shareLink)
        console.log('Share link fetched successfully!')
      } else {
        setShareLink('')
        console.log('No Genrated Share link!')
      }

      if (_sharePassword) {
        setIsSwitchChecked(true)
        setSPassword(false)
      } else {
        setIsSwitchChecked(false)
        setSPassword(true)
      }
    } catch (error) {
      console.error('Failed to fetch share link:', error)
      toast.error('Failed to fetch share link')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchShareLink()
    }
  }, [isOpen])

  const generateLinkMutation = useMutation(
    async () => {
      const response = await axiosInstance.post('/api/create-share', {
        chatId,
        userId
      })
      return response.data.link
    },
    {
      onMutate: async () => {
        setShareLink('')
        queryClient.cancelQueries(['chatData'])
      },
      onError: () => {
        toast.error('Failed to generate share link')
      },
      onSuccess: data => {
        setShareLink(data)
        toast.success('Share link generated!')
        fetchShareLink()
      },
      onSettled: () => {
        queryClient.invalidateQueries(['chatData'])
      }
    }
  )

  const setPasswordMutation = useMutation(
    async (newPassword: string | null) => {
      const response = await axiosInstance.post('/api/update-share', {
        chatId,
        password: newPassword ? md5(newPassword) : null
      })
      return response.data.link
    },
    {
      onMutate: async () => {
        queryClient.cancelQueries(['chatData'])
      },
      onError: () => {
        toast.error('Failed to set password')
      },
      onSuccess: data => {
        setShareLink(data)
        if (password !== '') {
          toast.success('Password added! Link protected.', {
            style: { whiteSpace: 'nowrap' }
          })
        }
        fetchShareLink()
      },
      onSettled: () => {
        queryClient.invalidateQueries(['chatData'])
      }
    }
  )

  const handleGenerateLink = () => {
    generateLinkMutation.mutate()
  }

  const handleSetPassword = () => {
    setPasswordMutation.mutate(password)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast.success('Link copied')
    setCopyClicked(true)
    setTimeout(() => setCopyClicked(false), 2000)
  }

  const handleDeleteLink = async () => {
    try {
      await axiosInstance.post('/api/delete-share', { chatId })
      setShareLink('')
      toast.success('Link removed')
      setDeleteClicked(true)
      setTimeout(() => setDeleteClicked(false), 2000)
    } catch (error) {
      console.error('Failed to delete share link:', error)
      toast.error('Failed to delete share link')
    }
  }

  const handleSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked)
    // When the switch is unchecked, clear the password in the database
    if (isSwitchChecked && !spassword) {
      setPasswordMutation.mutate(null)
      setPassword('')
      toast.success('Password removed!')
    }
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Tooltip title='Share'>
            <Share className='text-emerald-500 hover:text-emerald-300' />
          </Tooltip>
        </DialogTrigger>
        <DialogContent className='gap-2 sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              Share {isSwitchChecked ? 'protected' : 'public'} link to view chat
            </DialogTitle>
            <DialogDescription>Copy the link below to share:</DialogDescription>
          </DialogHeader>
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor='secondary'
              indicatorColor='secondary'
              aria-label='secondary tabs example'
            >
              <Tab
                value='one'
                label={isSwitchChecked ? 'Protected' : 'Public'}
                sx={{ fontWeight: 700 }}
              />
              <Tab value='two' label='Shared Links' sx={{ fontWeight: 700 }} />
            </Tabs>
          </Box>

          {value === 'one' && (
            <>
              {loading ? (
                <div className='m-12 flex flex-col items-center justify-center'>
                  <Loader2 className='animate-spin text-emerald-500' />
                </div>
              ) : (
                <>
                  {shareLink ? (
                    <div className='mb-4'>
                      <p className='mb-6 mt-4 text-sm'>
                        Copy the link below to share:
                      </p>
                      <ReadOnlynput shareLink={shareLink} />
                      <div className='mt-2 flex items-center justify-between'>
                        <div className='flex items-center'>
                          <p>Set password</p>
                          <Switch
                            color='secondary'
                            checked={isSwitchChecked}
                            onChange={handleSwitchChange}
                          />
                        </div>
                        <div className='flex justify-items-center gap-1.5'>
                          <div>
                            {copyClicked ? (
                              <Tooltip title='Copied'>
                                <CheckCircleOutline
                                  className='text-emerald-400'
                                  sx={{ fontSize: 17 }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title='Copy the share link'>
                                <FileCopy
                                  onClick={handleCopyLink}
                                  sx={{ fontSize: 18 }}
                                  className='cursor-pointer text-gray-400 hover:text-emerald-500'
                                />
                              </Tooltip>
                            )}
                          </div>

                          <div>
                            {deleteClicked ? (
                              <Tooltip title='Removed'>
                                <CheckCircleOutline
                                  className='text-emerald-400'
                                  sx={{ fontSize: 17 }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title='Remove the share link'>
                                <Delete
                                  onClick={handleDeleteLink}
                                  sx={{ fontSize: 21 }}
                                  className='cursor-pointer text-gray-400 hover:text-emerald-400'
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                      {isSwitchChecked && spassword && (
                        <>
                          <PasswordInput
                            password={password}
                            setPassword={setPassword}
                            handleSetPassword={handleSetPassword}
                            isLoading={setPasswordMutation.isLoading}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className='mb-4 mt-4 text-sm'>
                        Click the button below to generate a share link for this
                        chat.
                      </p>
                      <div className='flex justify-end gap-2'>
                        <Button
                          onClick={handleGenerateLink}
                          disabled={generateLinkMutation.isLoading}
                        >
                          {generateLinkMutation.isLoading
                            ? 'Generating...'
                            : 'Generate Link'}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShareLinkPopup
