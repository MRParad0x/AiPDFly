import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json()

    // Retrieve only the shareKey based on chatId
    const _share = await db
      .select() // Select only the shareKey
      .from(users)
      .where(eq(users.userId, userId))

    return NextResponse.json(_share, { status: 200 })
  } catch (error) {
    console.error('Error fetching share link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
