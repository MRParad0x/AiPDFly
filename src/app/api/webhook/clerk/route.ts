import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'edge'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', { status: 400 })
  }

  const eventType = evt.type

  const {
    id,
    email_addresses,
    first_name,
    last_name,
    image_url,
    username,
    last_sign_in_at,
    created_at,
    updated_at,
    phone_numbers,
    public_metadata
  } = evt.data as UserJSON

  if (eventType === 'user.created') {
    if (!id || !email_addresses) {
      return new Response('Error occurred -- missing data', { status: 400 })
    }

    try {
      // Insert user details into the database
      await db.insert(users).values({
        userId: id,
        username: username || 'default_username',
        emailAddress: email_addresses[0].email_address || 'default_email',
        firstName: first_name || 'default_first_name',
        lastName: last_name || 'default_last_name',
        imageUrl: image_url || 'default_image_url',
        phoneNumber: phone_numbers[0]?.phone_number || 'default_phone_number', // Access the first phone number in the array
        lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : null,
        createdAt: created_at ? new Date(created_at) : null,
        updatedAt: updated_at ? new Date(updated_at) : null
      })

      return new Response('User details inserted into the database', {
        status: 200
      })
    } catch (error) {
      console.error('Error inserting user details into the database:', error)
      return new Response('Error occurred while inserting user details', {
        status: 500
      })
    }
  } else if (eventType === 'user.updated') {
    if (!id || !email_addresses) {
      return new Response('Error occurred -- missing data', { status: 400 })
    }

    try {
      // Update user details in the database
      await db
        .update(users)
        .set({
          username: username || 'default_username',
          emailAddress: email_addresses[0].email_address || 'default_email',
          firstName: first_name || 'default_first_name',
          lastName: last_name || 'default_last_name',
          imageUrl: image_url || 'default_image_url',
          phoneNumber: phone_numbers[0]?.phone_number || 'default_phone_number',
          lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : null,
          createdAt: created_at ? new Date(created_at) : null,
          updatedAt: updated_at ? new Date(updated_at) : null,
          role: (public_metadata?.role as 'admin' | 'customer') || 'customer'
        })
        .where(eq(users.userId, id))
      return new Response('User details updated in the database', {
        status: 200
      })
    } catch (error) {
      console.error('Error updating user details in the database:', error)
      return new Response('Error occurred while updating user details', {
        status: 500
      })
    }
  } else if (eventType === 'user.deleted') {
    if (!id) {
      return new Response('Error occurred -- missing user ID', { status: 400 })
    }

    try {
      // Delete user details from the database
      await db.delete(users).where(eq(users.userId, id)).execute()
      return new Response('User details deleted from the database', {
        status: 200
      })
    } catch (error) {
      console.error('Error deleting user details from the database:', error)
      return new Response('Error occurred while deleting user details', {
        status: 500
      })
    }
  }

  return new Response('Event type not handled', { status: 400 })
}

//ngrok http --domain=capable-oarfish-intense.ngrok-free.app 3000
