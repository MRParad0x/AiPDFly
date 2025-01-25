import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default function AfterSignInPage() {
  const { sessionClaims } = auth()

  // Check if the user has the admin role
  if (sessionClaims?.metadata.role === 'admin') {
    redirect('/admin/dashboard/main')
  } else {
    redirect('/')
  }
}
