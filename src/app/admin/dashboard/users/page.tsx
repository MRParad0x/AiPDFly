'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Printer, ListFilter, MoreHorizontal, PlusCircle } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { DrizzleUser } from '@/lib/db/schema'
import { fetchUserList } from '@/lib/fetchUserList'
import { Skeleton } from '@mui/material'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { useReactToPrint } from 'react-to-print'
import React, { useEffect, useRef, useState } from 'react'
import PrintUserList from '@/components/Client/PrintUserList'
import axiosInstance from '@/lib/axiosInstance'
import toast from 'react-hot-toast'
import UserAddPopup from '@/components/Client/UserAddPopup'
import UserEditPopup from '@/components/Client/UserEditPopup'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/pagination'

export default function UsersPage() {
  const {
    data: userList,
    isLoading,
    refetch
  } = useQuery<DrizzleUser[]>(['userData'], fetchUserList, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10 // 10 minutes
  })

  const [currentPageAll, setCurrentPageAll] = useState(1)
  const [currentPageAdmins, setCurrentPageAdmins] = useState(1)
  const [currentPageCustomers, setCurrentPageCustomers] = useState(1)

  const itemsPerPage = 10

  const adminCount = userList?.filter(user => user.role === 'admin').length || 0
  const allUserCount = userList?.length || 0
  const customerCount =
    userList?.filter(user => user.role === 'customer').length || 0

  const totalPagesAll = Math.ceil((userList?.length || 0) / itemsPerPage)
  const totalPagesAdmins = Math.ceil(
    (userList?.filter(user => user.role === 'admin').length || 0) / itemsPerPage
  )
  const totalPagesCustomers = Math.ceil(
    (userList?.filter(user => user.role === 'customer').length || 0) /
      itemsPerPage
  )

  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'AiPDFly - All User List'
  })

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

  const deleteUser = async (userId: string) => {
    try {
      const response = await axiosInstance.post('/api/delete-user', { userId })
      if (response.status === 200) {
        refetch()
        toast.success('User deleted successfully')
      }
    } catch (error) {
      console.error('There was a problem deleting the user:', error)
      toast.error('Error deleting user. Try again later')
    }
  }

  const renderTableContent = (users: DrizzleUser[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const selectedUsers = users.slice(startIndex, startIndex + itemsPerPage)

    return (
      <>
        {selectedUsers && selectedUsers.length > 0 ? (
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
                <TableHead className='hidden md:table-cell'>
                  Last updated in
                </TableHead>
                <TableHead className='hidden md:table-cell'>Role</TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedUsers.map((user: DrizzleUser) => (
                <TableRow key={user.userId}>
                  <TableCell className='hidden sm:table-cell'>
                    <Image
                      alt='User image'
                      className='aspect-square rounded-full object-cover'
                      height='54'
                      src={user.imageUrl || '/placeholder.svg'}
                      width='54'
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
                    {formatDate(
                      user.updatedAt ? user.updatedAt.toString() : null
                    )}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {user.role === 'admin' ? (
                      <Badge className='bg-emerald-500'>{user.role}</Badge>
                    ) : (
                      <Badge className='bg-gray-600'>{user.role}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem> */}
                        <UserEditPopup
                          refresh={refetch}
                          userId={user.userId || ''}
                          userFirstName={user.firstName || ''}
                          userLastName={user.lastName || ''}
                          userEmail={user.emailAddress || ''}
                          userPhoneNumber={user.phoneNumber || ''}
                          userRole={user.role || ''}
                          username={user.username || ''}
                        />
                        {/* </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => deleteUser(user.userId)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='flex flex-col items-center gap-1 text-center'>
            <h3 className='text-2xl font-bold tracking-tight'>
              You have no users
            </h3>
            <p className='text-sm text-muted-foreground'>You can add a user.</p>
            <UserAddPopup refetch={refetch} />
          </div>
        )}
      </>
    )
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='m-2 flex flex-col gap-4'>
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent'>
          <Breadcrumb className='hidden md:flex'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/admin/dashboard/main'>Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/admin/dashboard/users'>Users</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <Tabs
          defaultValue='all'
          className='flex flex-1 flex-col overflow-hidden'
        >
          <div className='flex items-center'>
            <TabsList>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='admin'>Admins</TabsTrigger>
              <TabsTrigger value='customers' className='hidden sm:flex'>
                Customers
              </TabsTrigger>
            </TabsList>
            <div className='ml-auto flex items-center gap-2'>
              <Button size='sm' className='h-8 gap-1' onClick={handlePrint}>
                <Printer className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Print
                </span>
              </Button>
              <UserAddPopup refetch={refetch} />
            </div>
          </div>
          <TabsContent value='all' className='flex-1 overflow-auto'>
            <Card
              x-chunk='dashboard-06-chunk-0'
              className='flex h-full flex-col'
            >
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage your users and view their details.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-1 overflow-auto'>
                {isLoading ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='hidden w-[100px] sm:table-cell'>
                          <span className='sr-only'>image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Username
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Phone number
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Joined
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Last updated in
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Role
                        </TableHead>
                        <TableHead>
                          <span className='sr-only'>Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 10 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell className='hidden sm:table-cell'>
                            <Skeleton
                              variant='circular'
                              width={54}
                              height={54}
                            />
                          </TableCell>
                          <TableCell className='font-medium'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={60} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' width={20} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  renderTableContent(userList || [], currentPageAll)
                )}
              </CardContent>
              {allUserCount > 0 && (
                <CardFooter className='flex-row'>
                  <div className='basis-1/5 text-xs text-muted-foreground'>
                    Showing{' '}
                    <strong>{(currentPageAll - 1) * itemsPerPage + 1}</strong>{' '}
                    to{' '}
                    <strong>
                      {Math.min(
                        currentPageAll * itemsPerPage,
                        userList?.length || 0
                      )}
                    </strong>{' '}
                    of <strong>{userList?.length}</strong> users
                  </div>

                  <Pagination className='basis-3/4'>
                    <PaginationContent>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPageAll(prev => Math.max(prev - 1, 1))
                        }
                      />
                      {[...Array(totalPagesAll).keys()].map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPageAll === page + 1}
                            onClick={() => setCurrentPageAll(page + 1)}
                          >
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        onClick={() =>
                          setCurrentPageAll(prev =>
                            Math.min(prev + 1, totalPagesAll)
                          )
                        }
                      />
                    </PaginationContent>
                  </Pagination>

                  <div className='basis-1/5'></div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value='admin' className='flex-1 overflow-auto'>
            <Card
              x-chunk='dashboard-06-chunk-0'
              className='flex h-full flex-col'
            >
              <CardHeader>
                <CardTitle>Admins</CardTitle>
                <CardDescription>
                  Manage your admin users and view their details.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-1 overflow-auto'>
                {isLoading ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='hidden w-[100px] sm:table-cell'>
                          <span className='sr-only'>image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Username
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Phone number
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Joined
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Last updated in
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Role
                        </TableHead>
                        <TableHead>
                          <span className='sr-only'>Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 10 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell className='hidden sm:table-cell'>
                            <Skeleton
                              variant='circular'
                              width={54}
                              height={54}
                            />
                          </TableCell>
                          <TableCell className='font-medium'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={60} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' width={20} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  renderTableContent(
                    userList?.filter(user => user.role === 'admin') || [],
                    currentPageAdmins
                  )
                )}
              </CardContent>
              {adminCount > 0 && (
                <CardFooter className='flex-row'>
                  <div className='basis-1/5 text-xs text-muted-foreground'>
                    Showing{' '}
                    <strong>
                      {(currentPageAdmins - 1) * itemsPerPage + 1}
                    </strong>{' '}
                    to{' '}
                    <strong>
                      {Math.min(
                        currentPageAdmins * itemsPerPage,
                        userList?.filter(user => user.role === 'admin')
                          .length || 0
                      )}
                    </strong>{' '}
                    of{' '}
                    <strong>
                      {userList?.filter(user => user.role === 'admin').length}
                    </strong>{' '}
                    admin users
                  </div>

                  <Pagination className='basis-3/4'>
                    <PaginationContent>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPageAdmins(prev => Math.max(prev - 1, 1))
                        }
                      />
                      {[...Array(totalPagesAdmins).keys()].map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPageAdmins === page + 1}
                            onClick={() => setCurrentPageAdmins(page + 1)}
                          >
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        onClick={() =>
                          setCurrentPageAdmins(prev =>
                            Math.min(prev + 1, totalPagesAdmins)
                          )
                        }
                      />
                    </PaginationContent>
                  </Pagination>

                  <div className='basis-1/5'></div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value='customers' className='flex-1 overflow-auto'>
            <Card
              x-chunk='dashboard-06-chunk-0'
              className='flex h-full flex-col'
            >
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>
                  Manage your customer users and view their details.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-1 overflow-auto'>
                {isLoading ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='hidden w-[100px] sm:table-cell'>
                          <span className='sr-only'>image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Username
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Phone number
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Joined
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Last updated in
                        </TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Role
                        </TableHead>
                        <TableHead>
                          <span className='sr-only'>Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 10 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell className='hidden sm:table-cell'>
                            <Skeleton
                              variant='circular'
                              width={54}
                              height={54}
                            />
                          </TableCell>
                          <TableCell className='font-medium'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={120} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={160} />
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Skeleton variant='text' width={60} />
                          </TableCell>
                          <TableCell>
                            <Skeleton variant='text' width={20} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  renderTableContent(
                    userList?.filter(user => user.role === 'customer') || [],
                    currentPageCustomers
                  )
                )}
              </CardContent>
              {customerCount > 0 && (
                <CardFooter className='flex-row'>
                  <div className='basis-1/5 text-xs text-muted-foreground'>
                    Showing{' '}
                    <strong>
                      {(currentPageCustomers - 1) * itemsPerPage + 1}
                    </strong>{' '}
                    to{' '}
                    <strong>
                      {Math.min(
                        currentPageCustomers * itemsPerPage,
                        userList?.filter(user => user.role === 'customer')
                          .length || 0
                      )}
                    </strong>{' '}
                    of{' '}
                    <strong>
                      {
                        userList?.filter(user => user.role === 'customer')
                          .length
                      }
                    </strong>{' '}
                    users
                  </div>

                  <Pagination className='basis-3/4'>
                    <PaginationContent>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPageCustomers(prev => Math.max(prev - 1, 1))
                        }
                      />
                      {[...Array(totalPagesCustomers).keys()].map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPageCustomers === page + 1}
                            onClick={() => setCurrentPageCustomers(page + 1)}
                          >
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        onClick={() =>
                          setCurrentPageCustomers(prev =>
                            Math.min(prev + 1, totalPagesCustomers)
                          )
                        }
                      />
                    </PaginationContent>
                  </Pagination>

                  <div className='basis-1/5'></div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        <div style={{ display: 'none' }}>
          <PrintUserList ref={componentRef} userList={userList || []} />
        </div>
      </div>
    </div>
  )
}
