import React, { useState, useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import axiosInstance from '@/lib/axiosInstance'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { PhoneInput } from '../ui/phone-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type UserEditPopupProps = {
  refresh: () => void
  userId: string
  userFirstName: string
  userLastName: string
  userEmail: string
  userPhoneNumber: string
  userRole: string
  username: string
}

// Define the schema with additional fields
const FormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Invalid email.' }),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Invalid phone number.' }),
  role: z.string().min(1, { message: 'Role is required.' })
})

const UserEditPopup = ({
  refresh,
  userId,
  userFirstName,
  userLastName,
  userEmail,
  userPhoneNumber,
  userRole,
  username
}: UserEditPopupProps) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [isEditButtonDisabled, setIsEditButtonDisabled] = useState(true)
  const popupRef = useRef<HTMLDivElement>(null)
  const [isOpenEditForm, setIsOpenEditForm] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: userRole // Set initial value of role
    }
  })

  const initialValues = {
    username,
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    role: userRole
  }

  useEffect(() => {
    form.reset(initialValues)
  }, [
    username,
    userFirstName,
    userLastName,
    userEmail,
    userPhoneNumber,
    userRole,
    form
  ])

  const currentValues = useWatch({ control: form.control })

  useEffect(() => {
    const valuesChanged =
      currentValues.username !== initialValues.username ||
      currentValues.firstName !== initialValues.firstName ||
      currentValues.lastName !== initialValues.lastName ||
      currentValues.email !== initialValues.email ||
      currentValues.phoneNumber !== initialValues.phoneNumber ||
      currentValues.role !== initialValues.role

    setIsEditButtonDisabled(!valuesChanged)
  }, [currentValues, initialValues])

  async function onEditSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const { username, firstName, lastName, email, phoneNumber, role } = data
      const updateClerkUser = await axiosInstance.post(
        '/api/update-clerk-user',
        {
          userId,
          username,
          firstName,
          lastName,
          email,
          phoneNumber,
          role
        }
      )
      if (updateClerkUser) {
        await axiosInstance.post('/api/update-role', {
          userId,
          role
        })
      }
      if (updateClerkUser.status === 200) {
        refresh()
        setIsOpenEditForm(false)
        toast.success('User updated successfully!')
      } else {
        toast.error('Error updating user. Try again later')
      }
    } catch (error: any) {
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 500)
      ) {
        toast.error('testing 01')
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
      console.error('Error updating user, try again:', error)
    }
  }

  return (
    <Dialog open={isOpenEditForm} onOpenChange={setIsOpenEditForm}>
      <DialogTrigger asChild>
        <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
          Edit
        </div>
      </DialogTrigger>
      <DialogContent className='gap-1 p-4 sm:max-w-[500px]'>
        <DialogHeader className='flex-wrap'>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className='flex items-start justify-between'>
          <CardHeader>
            <CardTitle>Edit User Account</CardTitle>
            <CardDescription>
              by making changes to the update form.
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onEditSubmit)}
              className='w-auto space-y-6'
            >
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={value => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {field.value || 'Select a user role'}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='customer'>Customer</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              <Button type='submit' disabled={isEditButtonDisabled}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}

export default UserEditPopup
