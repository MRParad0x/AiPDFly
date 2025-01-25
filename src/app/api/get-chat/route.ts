import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  const { userId } = await req.json()
  try {
    const _chats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt))
    return NextResponse.json(_chats, { status: 200 })
  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    )
  }
}
