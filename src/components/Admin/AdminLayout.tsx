'use client'
import React from 'react'
import Link from 'next/link'
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Logo from '@/components/ui/logo'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { redirect, usePathname } from 'next/navigation'
import { checkRole } from '@/app/utils/roles'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <div className='grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <div className='hidden border-r bg-muted/40 md:block'>
        <div className='flex h-full max-h-screen flex-col gap-2'>
          <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
            <Link href='/' className='flex items-center gap-2 font-semibold'>
              <Logo
                showHomeLogo={false}
                showChatLogo={false}
                showDashboardLogo={true}
              />
            </Link>
            <Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
              <Bell className='h-4 w-4' />
              <span className='sr-only'>Toggle notifications</span>
            </Button>
          </div>
          <div className='flex-1'>
            <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
              <Link
                href='/admin/dashboard/main'
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/admin/dashboard/main' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Home className='h-4 w-4' />
                Dashboard
              </Link>
              <Link
                href='/admin/dashboard/orders'
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/admin/dashboard/orders' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <ShoppingCart className='h-4 w-4' />
                Orders
                <Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
                  6
                </Badge>
              </Link>
              <Link
                href='/admin/dashboard/users'
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/admin/dashboard/users' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Package className='h-4 w-4' />
                Users
              </Link>
              <Link
                href='/admin/dashboard/roles'
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/admin/dashboard/roles' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Users className='h-4 w-4' />
                Roles
              </Link>
              <Link
                href='/admin/dashboard/analytics'
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/admin/dashboard/analytics' ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <LineChart className='h-4 w-4' />
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className='flex h-full flex-col'>
        <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='shrink-0 md:hidden'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='flex flex-col'>
              <nav className='grid gap-2 text-lg font-medium'>
                <Link
                  href='#'
                  className='flex items-center gap-2 text-lg font-semibold'
                >
                  <Package2 className='h-6 w-6' />
                  <span className='sr-only'>Acme Inc</span>
                </Link>
                <Link
                  href='/admin/dashboard/main'
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all`}
                >
                  <Home className='h-5 w-5' />
                  Dashboard
                </Link>
                <Link
                  href='/admin/dashboard/orders'
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${pathname === '/admin/dashboard/orders' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <ShoppingCart className='h-5 w-5' />
                  Orders
                  <Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
                    6
                  </Badge>
                </Link>
                <Link
                  href='/admin/dashboard/users'
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${pathname === '/admin/dashboard/users' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Package className='h-5 w-5' />
                  Users
                </Link>
                <Link
                  href='/admin/dashboard/roles'
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${pathname === '/admin/dashboard/roles' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Users className='h-5 w-5' />
                  Roles
                </Link>
                <Link
                  href='/admin/dashboard/analytics'
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${pathname === '/admin/dashboard/analytics' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LineChart className='h-5 w-5' />
                  Analytics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className='w-full flex-1'>
            <form>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search products...'
                  className='w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3'
                />
              </div>
            </form>
          </div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon' className='rounded-full'>
                <CircleUser className='h-5 w-5' />
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className='flex h-full flex-1 flex-col gap-4 overflow-hidden sm:pb-4 sm:pl-6 sm:pr-6 sm:pt-6 md:gap-8'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
