import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Printer
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
  Pagination,
  PaginationContent,
  PaginationItem
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
import { use, useEffect } from 'react'
import OrderDetailsSkeleton from '../Admin/Skeleton/OrderDetailsSkeleton'

type OrderDetailsprops = {
  subscriptionsId: string
  createdAt: string
  plan: string
  price: number
  billingAddress: string
  customer: string
  email: string
  phone: string
  cardBrand: string
  last4Digits: string
}

// Helper function to format the billing address
const formatAddress = (address: string): string => {
  return address
    .split(',')
    .filter(component => component.trim() !== 'null')
    .map(component => component.trim())
    .join(', ')
}

// Helper function to format the date
const formatDate = (dateString: string): string => {
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

const OrderDetails = ({
  subscriptionsId,
  createdAt,
  plan,
  price,
  billingAddress,
  customer,
  email,
  phone,
  cardBrand,
  last4Digits
}: OrderDetailsprops) => {
  const formattedBillingAddress = formatAddress(billingAddress)
  const formattedCreatedAt = formatDate(createdAt)

  return (
    <div className='mt-2'>
      <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
        <CardHeader className='flex flex-row items-start bg-muted/50'>
          <div className='grid gap-0.5'>
            <CardTitle className='group flex items-center gap-2 text-lg'>
              Order ID: {subscriptionsId}
              <Button
                size='icon'
                variant='outline'
                className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <Copy className='h-3 w-3' />
                <span className='sr-only'>Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>Date: {formattedCreatedAt}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='p-6 text-sm'>
          <div className='grid gap-3'>
            <div className='font-semibold'>Order Details</div>
            <ul className='grid gap-3'>
              <li className='flex items-center justify-between'>
                <span className='text-muted-foreground'>
                  {plan} Subscription
                </span>
                <span>$ {(price / 100).toFixed(2)}</span>
              </li>
            </ul>
            <Separator className='my-2' />
            <ul className='grid gap-3'>
              <li className='flex items-center justify-between font-semibold'>
                <span className='text-muted-foreground'>Total</span>
                <span>$ {(price / 100).toFixed(2)}</span>
              </li>
            </ul>
          </div>
          <Separator className='my-4' />
          <div className='grid-cols grid gap-4'>
            <div className='grid gap-3'>
              <div className='font-semibold'>Billing Information</div>
              <address className='grid gap-0.5 not-italic text-muted-foreground'>
                {formattedBillingAddress}
              </address>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='grid gap-3'>
            <div className='font-semibold'>Customer Information</div>
            <dl className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <dt className='text-muted-foreground'>Customer</dt>
                <dd>{customer}</dd>
              </div>
              <div className='flex items-center justify-between'>
                <dt className='text-muted-foreground'>Email</dt>
                <dd>
                  <a href='mailto:'>{email}</a>
                </dd>
              </div>
              <div className='flex items-center justify-between'>
                <dt className='text-muted-foreground'>Phone</dt>
                <dd>
                  <a href='tel:'>{phone}</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator className='my-4' />
          <div className='grid gap-3'>
            <div className='font-semibold'>Payment Information</div>
            <dl className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <dt className='flex items-center gap-1 text-muted-foreground'>
                  <CreditCard className='h-4 w-4' />
                  {cardBrand}
                </dt>
                <dd>**** **** **** {last4Digits}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'></CardFooter>
      </Card>
    </div>
  )
}

export default OrderDetails
