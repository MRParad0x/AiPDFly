import axiosInstance from '@/lib/axiosInstance'
import { db } from '@/lib/db'
import { chats, messages, shares, users } from '@/lib/db/schema'
import { clerkClient } from '@clerk/nextjs/server'
import { eq, inArray } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json()

    const chatIds = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .execute()

    // Extract the chat IDs from the result
    const chatIdArray = chatIds.map(chat => chat.id)

    if (chatIdArray.length > 0) {
      // Step 2: Delete messages with the retrieved chat IDs
      await db
        .delete(messages)
        .where(inArray(messages.chatId, chatIdArray))
        .execute()
    }

    await db.delete(shares).where(eq(shares.userId, userId)).execute()

    await db.delete(chats).where(eq(chats.userId, userId)).execute()

    await db.delete(users).where(eq(users.userId, userId)).execute()

    await clerkClient.users.deleteUser(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chat:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}
