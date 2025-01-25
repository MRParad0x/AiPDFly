'use client'

import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/pagination'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OrderDetails from '@/components/Client/OrderDetails'
import { fetchSubscriptionList } from '@/lib/fetchSubscriptionList'
import { useQuery } from '@tanstack/react-query'
import { PictureAsPdf, Receipt } from '@mui/icons-material'
import { Button } from '@/components/ui/button'
import Tooltip from '@mui/material/Tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import OrderSkeleton from '@/components/Admin/Skeleton/OrderSkeleton'
import OrderDetailsSkeleton from '@/components/Admin/Skeleton/OrderDetailsSkeleton'
import { auth } from '@clerk/nextjs/server'
import { redirect, usePathname } from 'next/navigation'
import { checkRole } from '@/app/utils/roles'

type SubscriptionItem = {
  users: {
    firstName: string
    lastName: string
    emailAddress: string
    phoneNumber: string
  }
  user_subscriptions: {
    stripeSubscriptionId: string
    stripeProduct: string
    stripePaymentStatus: string
    stripeCreatedAt: string
    stripeCurrentPeriodEnd: string
    stripeAmount: number
    stripeInvoiceUrl: string
    stripeInvoicePDF: string
    stripeBillingAddress: string
    stripeCardBrand: string
    stripeCardLast4Digits: string
  }
}

export default function OrdersPage() {
  const pathname = usePathname()
  const {
    data: subscriptionList,
    isLoading,
    refetch
  } = useQuery(['subscriptionData'], fetchSubscriptionList, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10 // 10 minutes
  })

  const [currentPageAll, setCurrentPageAll] = useState(1)
  const itemsPerPage = 15

  const totalPagesAll = Math.ceil(
    (subscriptionList?.length || 0) / itemsPerPage
  )

  useEffect(() => {
    refetch()
  }, [currentPageAll])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
    return date.toLocaleString('en-US', options)
  }

  const [selectedOrder, setSelectedOrder] = useState<SubscriptionItem | null>(
    null
  )

  useEffect(() => {
    if (subscriptionList && subscriptionList.length > 0) {
      setSelectedOrder(subscriptionList[0])
    }
  }, [subscriptionList])

  const handleRowClick = (order: SubscriptionItem) => {
    setSelectedOrder(order)
  }

  const paginatedList = subscriptionList
    ? subscriptionList.slice(
        (currentPageAll - 1) * itemsPerPage,
        currentPageAll * itemsPerPage
      )
    : []

  return (
    <div className='m-2 flex h-full flex-col'>
      <div className='flex flex-col gap-4'>
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
                  <Link href='/admin/dashboard/orders'>Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recent Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className='grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
          <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
            <Tabs defaultValue='week'>
              <TabsContent value='week'>
                <Card x-chunk='dashboard-05-chunk-3'>
                  <CardHeader className='px-7'>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <OrderSkeleton />
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className='hidden sm:table-cell'>
                              Plan
                            </TableHead>
                            <TableHead className='hidden sm:table-cell'>
                              Status
                            </TableHead>
                            <TableHead className='hidden md:table-cell'>
                              Start Date
                            </TableHead>
                            <TableHead className='hidden md:table-cell'>
                              End Date
                            </TableHead>
                            <TableHead className='text-right'>Amount</TableHead>
                            <TableHead className='text-right'>
                              Invoice
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedList.map(
                            (item: SubscriptionItem, index: number) => (
                              <TableRow
                                key={index}
                                onClick={() => handleRowClick(item)}
                                className={
                                  selectedOrder === item
                                    ? 'bg-emerald-200 hover:bg-emerald-200'
                                    : ''
                                }
                              >
                                <TableCell>
                                  {item.users.firstName} {item.users.lastName}
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  {item.user_subscriptions.stripeProduct}
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                  <Badge
                                    className='text-xs'
                                    variant='secondary'
                                  >
                                    {
                                      item.user_subscriptions
                                        .stripePaymentStatus
                                    }
                                  </Badge>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                  {item.user_subscriptions.stripeCreatedAt
                                    ? formatDate(
                                        item.user_subscriptions.stripeCreatedAt.toString()
                                      )
                                    : null}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                  {item.user_subscriptions
                                    .stripeCurrentPeriodEnd
                                    ? formatDate(
                                        item.user_subscriptions.stripeCurrentPeriodEnd.toString()
                                      )
                                    : null}
                                </TableCell>
                                <TableCell className='text-right'>
                                  $
                                  {item.user_subscriptions.stripeAmount
                                    ? (
                                        item.user_subscriptions.stripeAmount /
                                        100
                                      ).toFixed(2)
                                    : ''}
                                </TableCell>
                                <TableCell className='text-right'>
                                  <Tooltip title='View Invoice'>
                                    <Button variant='ghost' size='iconsm'>
                                      <Link
                                        href={
                                          item.user_subscriptions
                                            .stripeInvoiceUrl
                                        }
                                        target='_blank'
                                      >
                                        <Receipt sx={{ fontSize: 18 }} />
                                      </Link>
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title='Download Invoice'>
                                    <Button variant='ghost' size='iconsm'>
                                      <Link
                                        href={
                                          item.user_subscriptions
                                            .stripeInvoicePDF
                                        }
                                        target='_blank'
                                      >
                                        <PictureAsPdf sx={{ fontSize: 18 }} />
                                      </Link>
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                  {subscriptionList?.length > 0 && (
                    <CardFooter className='flex-row'>
                      <div className='basis-1/5 text-xs text-muted-foreground'>
                        Showing{' '}
                        <strong>
                          {(currentPageAll - 1) * itemsPerPage + 1}
                        </strong>{' '}
                        to{' '}
                        <strong>
                          {Math.min(
                            currentPageAll * itemsPerPage,
                            subscriptionList.length
                          )}
                        </strong>{' '}
                        of <strong>{subscriptionList.length}</strong> users
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
            </Tabs>
          </div>

          {isLoading ? (
            <OrderDetailsSkeleton />
          ) : (
            selectedOrder && (
              <OrderDetails
                subscriptionsId={
                  selectedOrder.user_subscriptions.stripeSubscriptionId
                }
                createdAt={selectedOrder.user_subscriptions.stripeCreatedAt}
                plan={selectedOrder.user_subscriptions.stripeProduct}
                price={selectedOrder.user_subscriptions.stripeAmount}
                billingAddress={
                  selectedOrder.user_subscriptions.stripeBillingAddress
                }
                customer={`${selectedOrder.users.firstName} ${selectedOrder.users.lastName}`}
                email={selectedOrder.users.emailAddress}
                phone={selectedOrder.users.phoneNumber}
                cardBrand={selectedOrder.user_subscriptions.stripeCardBrand}
                last4Digits={
                  selectedOrder.user_subscriptions.stripeCardLast4Digits
                }
              />
            )
          )}
        </main>
      </div>
    </div>
  )
}
