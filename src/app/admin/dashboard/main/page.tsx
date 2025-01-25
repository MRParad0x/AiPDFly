import Link from 'next/link'
import { CreditCard, DollarSign, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { checkRole } from '@/app/utils/roles'
import { redirect } from 'next/navigation'
import DashAreaChart from '@/components/Admin/DashboardContent/DashboardCharts/DashAreaChart'
import DashBarChart from '@/components/Admin/DashboardContent/DashboardCharts/DashBarChart'
import DashPieChart from '@/components/Admin/DashboardContent/DashboardCharts/DashPieChart'
import Image from 'next/image'
import DashRadialChart from '@/components/Admin/DashboardContent/DashboardCharts/DashRadialChart'
import DashPieChartLabel from '@/components/Admin/DashboardContent/DashboardCharts/DashPieChartLabel'
import DashUsers from '@/components/Admin/DashboardContent/OtherComp/DashUsers'
import DashTransactions from '@/components/Admin/DashboardContent/OtherComp/DashTransactions'
import { clerkClient, auth } from '@clerk/nextjs/server'

export default async function MainPage() {
  const { userId } = auth()
  const response = await clerkClient.users.getUser(userId as string)

  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole('admin')) {
    redirect('/')
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='m-2 flex flex-col sm:gap-4'>
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
                <BreadcrumbPage>All Statis</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className='flex flex-1 flex-col gap-4 md:gap-8'>
          <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2 xl:grid-cols-4'>
            <Card x-chunk='dashboard-01-chunk-3'>
              <CardHeader className='flex flex-col items-center'>
                <CardTitle className='flex w-full items-center justify-items-start gap-4'>
                  <Image
                    className='aspect-square rounded-full object-cover'
                    height='54'
                    src={response.imageUrl?.toString()}
                    width='54'
                    alt='Avatar'
                  />
                  <div className='flex flex-col text-xl font-extrabold'>
                    <h1>Welcome Back!</h1>
                    <p className='text-lg font-bold text-muted-foreground'>
                      {response.firstName?.toString()}{' '}
                      {response.lastName?.toString()}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  It's time to go over your dashboard insights.
                </p>
              </CardContent>
            </Card>
            <Card x-chunk='dashboard-01-chunk-0'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>$45,231.89</div>
                <p className='text-xs text-muted-foreground'>
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk='dashboard-01-chunk-1'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Subscriptions
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+2350</div>
                <p className='text-xs text-muted-foreground'>
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk='dashboard-01-chunk-2'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Sales
                </CardTitle>
                <CreditCard className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+12,234</div>
                <p className='text-xs text-muted-foreground'>
                  +19% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 md:gap-8 xl:grid-cols-4'>
            <DashBarChart />
            <DashAreaChart />
            <DashPieChartLabel />
          </div>

          <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4'>
            <DashTransactions />
            <DashPieChart />
            <DashRadialChart />
            <DashUsers />
          </div>
        </main>
      </div>
    </div>
  )
}
