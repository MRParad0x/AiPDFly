import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import React, { useEffect, useState } from 'react'
import { Button2 } from '../ui/button2'
import { Button3 } from '../ui/button3'
import toast from 'react-hot-toast'
import FormattedMessageContent from './FormattedMessageContent'
import Tooltip from '@mui/material/Tooltip'
import {
  VolumeUpOutlined,
  PauseCircleOutline,
  ContentCopyOutlined,
  CheckCircleOutlineOutlined
} from '@mui/icons-material'

type Props = {
  isLoading: boolean
  messages: Message[]
}

const MessageList = ({ messages, isLoading }: Props) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingText, setSpeakingText] = useState('')
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  )
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [visibleTickIds, setVisibleTickIds] = useState<string[]>([])

  useEffect(() => {
    if (!isSpeaking) {
      if (utterance) {
        speechSynthesis.cancel()
        setUtterance(null)
      }
    }
  }, [isSpeaking])

  const toggleSpeak = (text: string) => {
    if (isSpeaking) {
      speechSynthesis.pause()
      setIsSpeaking(false)
    } else {
      const newUtterance = new SpeechSynthesisUtterance(text)
      newUtterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(newUtterance)
      setIsSpeaking(true)
      setSpeakingText(text)
      setUtterance(newUtterance)
    }
  }

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedMessageId(messageId)
    setVisibleTickIds(prevIds => [...prevIds, messageId])
    setTimeout(() => {
      setVisibleTickIds(prevIds => prevIds.filter(id => id !== messageId))
      setCopiedMessageId(null)
    }, 2000) // Reset copied message after 2 seconds
    toast.success('Message copied')
  }

  if (!messages) return <></>

  return (
    <div className='flex flex-col gap-4 p-4'>
      {messages.map(message => {
        const rolePrefix =
          message.role === 'user' ? (
            <Button2 className='mb-0 text-black'>
              <strong>You</strong>
            </Button2>
          ) : (
            <Button3 className='mb-0'>
              <strong>AiPDFly</strong>
            </Button3>
          )
        const buttonClass =
          message.role === 'user'
            ? 'bg-emerald-500 text-white'
            : 'bg-white text-gray-600'
        return (
          <div
            key={message.id}
            className={cn('flex', {
              'justify-end pl-10': message.role === 'user',
              'justify-start pr-10': message.role === 'assistant'
            })}
          >
            <div
              className={cn(
                'mb-4 rounded-lg p-4 text-[1rem] text-gray-600 shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-500/90',
                buttonClass
              )}
            >
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  {rolePrefix}
                  <div className='flex items-center gap-2'>
                    {isSpeaking && speakingText === message.content ? (
                      <Tooltip title='Pause'>
                        <PauseCircleOutline
                          onClick={() => toggleSpeak(message.content)}
                          sx={{ fontSize: 20 }}
                          className='cursor-pointer'
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title='Read'>
                        <VolumeUpOutlined
                          onClick={() => toggleSpeak(message.content)}
                          sx={{ fontSize: 20 }}
                          className='cursor-pointer'
                        />
                      </Tooltip>
                    )}
                    {(copiedMessageId === message.id ||
                      visibleTickIds.includes(message.id)) && (
                      <Tooltip title='Copied'>
                        <CheckCircleOutlineOutlined
                          sx={{ fontSize: 16 }}
                          className='w-[1.1rem]'
                        />
                      </Tooltip>
                    )}
                    {!visibleTickIds.includes(message.id) && (
                      <Tooltip title='Copy'>
                        <ContentCopyOutlined
                          sx={{ fontSize: 16 }}
                          className='cursor-pointer'
                          onClick={() =>
                            copyToClipboard(message.content, message.id)
                          }
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className='mt-2'>
                  <FormattedMessageContent content={message.content} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
