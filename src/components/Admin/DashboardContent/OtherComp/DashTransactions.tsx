import React, { useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { fetchSubscriptionList } from '@/lib/fetchSubscriptionList'
import { useQuery } from '@tanstack/react-query'

const DashTransactions = () => {
  // const {
  //   data: subscriptionList,
  //   isLoading,
  //   refetch
  // } = useQuery(['subscriptionData'], fetchSubscriptionList, {
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  //   cacheTime: 1000 * 60 * 10 // 10 minutes
  // })

  return (
    <Card x-chunk='dashboard-01-chunk-4'>
      <CardHeader className='flex flex-row items-center'>
        <div className='grid gap-2'>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your website.
          </CardDescription>
        </div>
        <Button asChild size='sm' className='ml-auto gap-1'>
          <Link href='/admin/dashboard/orders'>
            View All
            <ArrowUpRight className='h-4 w-4' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className='font-medium'>Liam Johnson</div>
                <div className='hidden text-sm text-muted-foreground md:inline'>
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className='md:hidden lg:hidden xl:table-cell'>
                2023-06-23
              </TableCell>
              <TableCell className='text-right'>$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default DashTransactions
