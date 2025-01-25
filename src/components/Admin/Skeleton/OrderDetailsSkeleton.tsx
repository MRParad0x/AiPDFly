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
import { useEffect } from 'react'
import { Skeleton } from '@mui/material'

const OrderDetailsSkeleton = () => {
  return (
    <div className='mt-2'>
      <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
        <CardHeader className='flex flex-row items-start bg-muted/50'>
          <div className='grid gap-0.5'>
            <CardTitle className='group flex items-center gap-2 text-lg'>
              <Skeleton width={120} />
              <Button
                size='icon'
                variant='outline'
                className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <Copy className='h-3 w-3' />
                <span className='sr-only'>Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              <Skeleton width={80} />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='p-6 text-sm'>
          <div className='grid gap-3'>
            <div className='font-semibold'>
              <Skeleton width={100} />
            </div>
            <ul className='grid gap-3'>
              <li className='flex items-center justify-between'>
                <Skeleton width={140} />
                <Skeleton width={60} />
              </li>
            </ul>
            <Separator className='my-2' />
            <ul className='grid gap-3'>
              <li className='flex items-center justify-between font-semibold'>
                <Skeleton width={140} />
                <Skeleton width={60} />
              </li>
            </ul>
          </div>
          <Separator className='my-4' />
          <div className='grid-cols grid gap-4'>
            <div className='grid gap-3'>
              <div className='font-semibold'>
                <Skeleton width={150} />
              </div>
              <address className='grid gap-0.5 not-italic text-muted-foreground'>
                <Skeleton width={300} />
              </address>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='grid gap-3'>
            <div className='font-semibold'>
              <Skeleton width={160} />
            </div>
            <dl className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <Skeleton width={100} />
                <Skeleton width={100} />
              </div>
              <div className='flex items-center justify-between'>
                <Skeleton width={100} />
                <Skeleton width={100} />
              </div>
              <div className='flex items-center justify-between'>
                <Skeleton width={100} />
                <Skeleton width={100} />
              </div>
            </dl>
          </div>
          <Separator className='my-4' />
          <div className='grid gap-3'>
            <div className='font-semibold'>
              <Skeleton width={180} />
            </div>
            <dl className='grid gap-3'>
              <div className='flex items-center justify-between'>
                <Skeleton width={140} />
                <Skeleton width={60} />
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'></CardFooter>
      </Card>
    </div>
  )
}

export default OrderDetailsSkeleton
