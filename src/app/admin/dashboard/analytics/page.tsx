import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
  const { sessionClaims } = auth()

  // If the user does not have the admin role, redirect them to the home page
  if (sessionClaims?.metadata.role !== 'admin') {
    redirect('/')
  }
  return <div>This is admin page</div>
}

export default page
