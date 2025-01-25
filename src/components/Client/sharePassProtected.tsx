'use client'
import React, { useState, ReactNode, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import md5 from 'md5'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Box from '@mui/material/Box'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import LockIcon from '@mui/icons-material/Lock'

type SharePassProtectedProps = {
  password4Share: string
  children: ReactNode
}

const SharePassProtected = ({
  password4Share,
  children
}: SharePassProtectedProps) => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(true)
  const [isBlurred, setIsBlurred] = useState(true)
  const [passwordVisibility, setPasswordVisibility] = useState(false)

  useEffect(() => {
    if (password4Share === null) {
      setIsBlurred(false)
      setIsPasswordDialogOpen(false)
    } else {
      setIsPasswordDialogOpen(true)
      setIsBlurred(true)
    }
  }, [password4Share])

  const FormSchema = z.object({
    password: z.string().refine(value => md5(value) === password4Share, {
      message: 'Incorrect password'
    })
  })

  const formMethods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: ''
    }
  })

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = data => {
    setIsPasswordDialogOpen(false)
    setIsBlurred(false)
  }

  return (
    <div
      className={`flex h-screen w-full items-center justify-center ${isBlurred ? 'blur-sm' : ''}`}
    >
      <div className='w-full'>{children}</div>
      {isPasswordDialogOpen && (
        <Dialog
          open={isPasswordDialogOpen}
          onOpenChange={() => {}} // Prevent dialog from closing
        >
          <DialogContent className='flex w-full flex-col items-center sm:max-w-[375px]'>
            <DialogHeader>
              <DialogTitle className='flex justify-items-center gap-1'>
                Protected Conversation
                <LockIcon sx={{ fontSize: 17 }} />
              </DialogTitle>
              <DialogDescription>
                This shared content is protected. Please enter the password to
                view.
              </DialogDescription>
            </DialogHeader>
            <FormProvider {...formMethods}>
              <form
                onSubmit={formMethods.handleSubmit(onSubmit)}
                className='flex w-full justify-between'
              >
                <FormField
                  control={formMethods.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Box className='relative'>
                          <Input
                            type={passwordVisibility ? 'text' : 'password'}
                            placeholder='Password'
                            {...field}
                          />
                          <Box
                            className='absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground'
                            onClick={() =>
                              setPasswordVisibility(!passwordVisibility)
                            }
                          >
                            {passwordVisibility ? (
                              <EyeOffIcon className='h-6 w-6' />
                            ) : (
                              <EyeIcon className='h-6 w-6' />
                            )}
                          </Box>
                        </Box>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type='submit'>Unlock</Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default SharePassProtected
