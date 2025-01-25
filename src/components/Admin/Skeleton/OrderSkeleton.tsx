import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from '@mui/material'

const OrderSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead className='hidden md:table-cell'>Status</TableHead>
          <TableHead className='hidden md:table-cell'>Start Date</TableHead>
          <TableHead className='hidden md:table-cell'>End Date</TableHead>
          <TableHead className='hidden md:table-cell'>Amount</TableHead>
          <TableHead className='hidden md:table-cell'>Invoice</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 18 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className='hidden sm:table-cell'>
              <Skeleton variant='text' width={100} />
            </TableCell>
            <TableCell className='font-medium'>
              <Skeleton variant='text' width={80} />
            </TableCell>
            <TableCell>
              <Skeleton variant='text' width={50} />
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton variant='text' width={140} />
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton variant='text' width={140} />
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton variant='text' width={50} />
            </TableCell>
            <TableCell className='hidden md:table-cell'>
              <Skeleton variant='text' width={50} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default OrderSkeleton
