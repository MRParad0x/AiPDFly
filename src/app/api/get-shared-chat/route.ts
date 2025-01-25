import { db } from '@/lib/db'
import { shares, chats } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { shareId } = await req.json()

    // Retrieve the shared chat record based on the shareKey

    const _share = await db
      .select()
      .from(shares)
      .rightJoin(chats, eq(shares.chatId, chats.id))
      .where(eq(shares.shareKey, shareId))

    if (!_share || _share.length === 0) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 })
    }

    return NextResponse.json(_share, { status: 200 })
  } catch (error) {
    console.error('Error fetching chat by share key:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
