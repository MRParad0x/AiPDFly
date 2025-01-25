import React, { useState, useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import axiosInstance from '@/lib/axiosInstance'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { PhoneInput } from '../ui/phone-input'
import Box from '@mui/material/Box'
import { EyeIcon, EyeOffIcon, PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import axios from 'axios'

type UserAddPopupProps = {
  refetch: () => void
}

// Define the schema with additional fields
const FormSchema = z.object({
  username: z.string().min(1, {
    message: 'Username is required.'
  }),
  firstName: z.string().min(1, {
    message: 'First name is required.'
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required.'
  }),
  email: z.string().email({
    message: 'Invalid email.'
  }),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Invalid phone number.' }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  })
})

const UserAddPopup = ({ refetch }: UserAddPopupProps) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const [isOpenAddForm, setIsOpenAddForm] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: ''
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const { username, firstName, lastName, email, password, phoneNumber } =
        data
      const addClerkUser = await axios.post('/api/create-clerk-user', {
        username,
        firstName,
        lastName,
        email,
        password,
        phoneNumber
      })
      if (addClerkUser.status === 200) {
        setTimeout(() => {
          refetch()
          setIsOpenAddForm(false) // Close the dialog after successful submission
          toast.success('User created successfully!')
        }, 1000)
      } else {
        toast.error('Error creating user. Try again later')
      }
    } catch (error: any) {
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 500)
      ) {
        const serverErrors = error.response.data.error
        if (serverErrors.username) {
          form.setError('username', {
            type: 'manual',
            message: serverErrors.username
          })
        }
        if (serverErrors.email) {
          form.setError('email', {
            type: 'manual',
            message: serverErrors.email
          })
        }
        if (serverErrors.phoneNumber) {
          form.setError('phoneNumber', {
            type: 'manual',
            message: serverErrors.phoneNumber
          })
        }
        if (error.response.status === 500) {
          form.setError('phoneNumber', {
            type: 'manual',
            message:
              'Phone numbers from this country are currently not supported.'
          })
        }
      } else {
        toast.error('An unexpected error occurred')
      }
      console.error('Error creating user, try again:', error)
    }
  }

  const handleClear = () => {
    form.reset({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: ''
    })
  }

  return (
    <Dialog open={isOpenAddForm} onOpenChange={setIsOpenAddForm}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-8 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Add User
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='gap-1 p-4 sm:max-w-[500px]'>
        <DialogHeader className='flex-wrap'>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className='flex items-start justify-between'>
          <CardHeader>
            <CardTitle>Create a New User Account</CardTitle>
            <CardDescription>
              by completing the registration form.
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-auto space-y-6'
            >
              <div className='flex gap-2'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='example@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='flex flex-col items-start'>
                    <FormLabel className='text-left'>Phone Number</FormLabel>
                    <FormControl className='w-full'>
                      <PhoneInput
                        placeholder='Enter a phone number'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-between'>
                <Button type='submit'>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
                <Button type='button' onClick={handleClear} variant='outline'>
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}

export default UserAddPopup
