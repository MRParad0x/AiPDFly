import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IconButton, Tabs, Box, Tab, Switch, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axiosInstance from '@/lib/axiosInstance'
import { Loader2 } from 'lucide-react'
import {
  ContentCopy,
  CheckCircleOutline,
  DeleteOutline
} from '@mui/icons-material'
import { Button } from '../ui/button'
import md5 from 'md5'
import PasswordInput from '../ui/PasswordInput'
import ReadOnlynput from '../ui/ReadOnlyInput'

type ShareLinkPopupProps = {
  chatId: number
  isVisible: boolean
  onClose: () => void
  userId: string
}

const ShareLinkPopup = ({
  chatId,
  isVisible,
  onClose,
  userId
}: ShareLinkPopupProps) => {
  const [shareLink, setShareLink] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(isVisible)
  const [copyClicked, setCopyClicked] = useState(false)
  const [deleteClicked, setDeleteClicked] = useState(false)
  const [spassword, setSPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isSwitchChecked, setIsSwitchChecked] = useState(false) // State for switch checked status
  const popupRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const [value, setValue] = useState('one') // Default tab value

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
      }

      if (_sharePassword === null) {
        setIsSwitchChecked(false)
        setSPassword(true)
      } else {
        setIsSwitchChecked(true)
        setSPassword(false)
      }
    } catch (error) {
      console.error('Failed to fetch share link:', error)
      toast.error('Failed to fetch share link')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isVisible) {
      setShowPopup(true)
      fetchShareLink()
    } else {
      setShowPopup(false)
    }
  }, [isVisible])

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

  if (!showPopup) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={popupRef}
        className={`relative transform rounded-xl bg-white p-6 shadow-lg transition-transform duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
        style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold'>
            Share {isSwitchChecked ? 'protected' : 'public'} link to view chat
          </h2>
          <IconButton onClick={onClose} className='m-0'>
            <CloseIcon />
          </IconButton>
        </div>

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
                      <div className='flex items-start justify-center gap-2'>
                        <div>
                          {copyClicked ? (
                            <Tooltip title='Copied'>
                              <CheckCircleOutline className='h-[1.24rem] w-[1.24rem] text-green-500' />
                            </Tooltip>
                          ) : (
                            <Tooltip title='Copy the share link'>
                              <ContentCopy
                                onClick={handleCopyLink}
                                className='h-[1.20rem] w-[1.20rem] cursor-pointer text-gray-600 hover:text-emerald-500'
                              />
                            </Tooltip>
                          )}
                        </div>

                        <div>
                          {deleteClicked ? (
                            <Tooltip title='Removed'>
                              <CheckCircleOutline className='h-6 w-6 text-green-500' />
                            </Tooltip>
                          ) : (
                            <Tooltip title='Remove the share link'>
                              <DeleteOutline
                                onClick={handleDeleteLink}
                                className='h-6 w-6 cursor-pointer text-gray-500 hover:text-emerald-400'
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
      </div>
    </div>
  )
}

export default ShareLinkPopup
