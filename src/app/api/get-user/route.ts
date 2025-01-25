import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    // Retrieve users data
    const _user = await db.select().from(users).orderBy(desc(users.createdAt))

    return NextResponse.json(_user, { status: 200 })
  } catch (error) {
    console.error('Error fetching share link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
