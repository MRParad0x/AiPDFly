import { DrizzleUser } from '@/lib/db/schema'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Image from 'next/image'
import { format } from 'date-fns'
import { Bot } from 'lucide-react'

const PrintUserList = React.forwardRef(
  (props: { userList: DrizzleUser[] }, ref: React.Ref<HTMLDivElement>) => {
    const { userList } = props

    const formatDate = (dateString: string | null): string => {
      if (!dateString) {
        return 'N/A' // Placeholder for null values
      }

      try {
        const date = new Date(dateString)
        return format(date, 'yyyy-MM-dd hh:mm a')
      } catch (error) {
        return 'Invalid date' // Handle invalid date
      }
    }

    return (
      <div ref={ref}>
        <Card x-chunk='dashboard-06-chunk-0' className='m-6'>
          <div className='flex justify-between'>
            <div>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  All registered user details of AiPDFly.
                </CardDescription>
              </CardHeader>
            </div>
            <div className='m-4'>
              <div className='flex w-auto items-center justify-center'>
                <Bot className='mr-1 h-7 w-7 justify-center text-green-600' />
                <h1 className='bg-gradient-to-r from-emerald-500 to-emerald-900 bg-clip-text text-3xl font-semibold text-transparent'>
                  AiPDFly
                </h1>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='hidden w-[100px] sm:table-cell'>
                  <span className='sr-only'>image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className='hidden md:table-cell'>Username</TableHead>
                <TableHead className='hidden md:table-cell'>
                  Phone number
                </TableHead>
                <TableHead className='hidden md:table-cell'>Joined</TableHead>
                <TableHead className='hidden md:table-cell'>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map((user: DrizzleUser) => (
                <TableRow key={user.userId}>
                  <TableCell className='hidden sm:table-cell'>
                    <Image
                      alt='User image'
                      className='aspect-square rounded-full object-cover'
                      height='52'
                      src={user.imageUrl || '/placeholder.svg'}
                      width='52'
                    />
                  </TableCell>
                  <TableCell className='font-medium'>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.emailAddress}</TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {user.username}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {formatDate(
                      user.createdAt ? user.createdAt.toString() : null
                    )}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {user.role}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    )
  }
)

export default PrintUserList
