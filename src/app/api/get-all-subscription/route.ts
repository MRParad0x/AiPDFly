import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { userSubscriptions, users } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const _userSubscriptions = await db
      .select()
      .from(users)
      .rightJoin(userSubscriptions, eq(users.userId, userSubscriptions.userId))
      .orderBy(desc(users.createdAt))

    if (!_userSubscriptions || _userSubscriptions.length === 0) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(_userSubscriptions, { status: 200 })
  } catch (error) {
    console.error('Error fetching share link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
