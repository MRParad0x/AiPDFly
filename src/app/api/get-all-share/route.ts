import { db } from '@/lib/db'
import { shares, chats } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json()

    // Retrieve all share records with pdfName, shareKey, and createdAt based on userId
    const sharedLinks = await db
      .select()
      .from(shares)
      .innerJoin(chats, eq(shares.chatId, chats.id))
    //   .on(shares.chatId.equals(chats.id))
    //   .where(chats.userId.equals(userId))

    return NextResponse.json(sharedLinks, { status: 200 })
  } catch (error) {
    console.error('Error fetching share links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
