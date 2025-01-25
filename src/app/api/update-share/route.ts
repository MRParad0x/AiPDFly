import { db } from '@/lib/db'
import { shares } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { chatId, password } = await req.json()

    // Update the password based on chatId
    const updatedShare = await db
      .update(shares) // Update the password field
      .set({ password: password || null })
      .where(eq(shares.chatId, chatId))

    return NextResponse.json(updatedShare, { status: 200 })
  } catch (error) {
    console.error('Error updating share link password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
