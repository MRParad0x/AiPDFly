import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export const runtime = 'edge'

export const POST = async (req: Request) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role
    } = await req.json()

    const UserList = await clerkClient.users.getUserList()
    const users = UserList.data

    // Extract usernames, emails, and phone numbers
    const usernames = users
      .map(user => user.username)
      .filter(username => username !== null)

    const emails = users
      .map(user => user.emailAddresses.map(emailObj => emailObj.emailAddress))
      .flat()
      .filter(email => email !== null)

    const phoneNumbers = users
      .map(user => user.phoneNumbers.map(phoneObj => phoneObj.phoneNumber))
      .flat()
      .filter(phoneNumber => phoneNumber !== null)

    // Function to check if a username is available
    function isUsernameAvailable(username: string | null) {
      return !usernames.includes(username as string)
    }

    // Function to check if an email is available
    function isEmailAvailable(email: string) {
      return !emails.includes(email)
    }

    // Function to check if a phone number is available
    function isPhoneNumberAvailable(phoneNumber: string) {
      return !phoneNumbers.includes(phoneNumber)
    }

    // Check if the desired username, email, and phone number are available
    const isUsernameFree = isUsernameAvailable(username)
    const isEmailFree = isEmailAvailable(email)
    const isPhoneNumberFree = isPhoneNumberAvailable(phoneNumber)

    if (isUsernameFree && isEmailFree && isPhoneNumberFree) {
      const response = await clerkClient.users.createUser({
        username,
        firstName,
        lastName,
        emailAddress: [email],
        password,
        phoneNumber: [phoneNumber]
      })
      return NextResponse.json(response)
    } else {
      const errors: { [key: string]: string } = {}
      if (!isUsernameFree) errors.username = `${username} is already used.`
      if (!isEmailFree) errors.email = `${email} is already used.`
      if (!isPhoneNumberFree)
        errors.phoneNumber = `${phoneNumber} is already used.`

      return NextResponse.json({ error: errors }, { status: 400 })
    }
  } catch (error) {
    console.error('Error creating a new user:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}
