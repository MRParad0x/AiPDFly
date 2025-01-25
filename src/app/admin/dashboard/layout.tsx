import { redirect } from 'next/navigation'
import { checkRole } from '@/app/utils/roles'
import AdminLayout from '@/components/Admin/AdminLayout'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole('admin')) {
    redirect('/')
  }

  return <AdminLayout children={children} />
}
