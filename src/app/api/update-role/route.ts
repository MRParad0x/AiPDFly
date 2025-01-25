import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { clerkClient } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { userId, role } = await req.json()

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role
      }
    })

    // Update the role based on userId
    const updateRole = await db
      .update(users) // Update the role field
      .set({ role: role })
      .where(eq(users.userId, userId))

    return NextResponse.json(updateRole, { status: 200 })
  } catch (error) {
    console.error('Error updating the user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
