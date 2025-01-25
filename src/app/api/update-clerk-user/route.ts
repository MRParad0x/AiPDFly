import { db } from '@/lib/db'
import { users, shares } from '@/lib/db/schema'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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
      role,
      userId
    } = await req.json()

    const UserList = await clerkClient.users.getUserList()
    const users = UserList.data

    // Find the current user
    const currentUser = users.find(user => user.id === userId)
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Extract usernames, emails, and phone numbers from other users
    const usernames = users
      .filter(user => user.id !== userId)
      .map(user => user.username)
      .filter(username => username !== null)

    const emails = users
      .filter(user => user.id !== userId)
      .map(user => user.emailAddresses.map(emailObj => emailObj.emailAddress))
      .flat()
      .filter(email => email !== null)

    const phoneNumbers = users
      .filter(user => user.id !== userId)
      .map(user => user.phoneNumbers.map(phoneObj => phoneObj.phoneNumber))
      .flat()
      .filter(phoneNumber => phoneNumber !== null)

    // Function to check if a username is available
    function isUsernameAvailable(username: string) {
      return !usernames.includes(username)
    }

    // Function to check if an email is available
    function isEmailAvailable(email: string) {
      return !emails.includes(email)
    }

    // Function to check if a phone number is available
    function isPhoneNumberAvailable(phoneNumber: string) {
      return !phoneNumbers.includes(phoneNumber)
    }

    // Check if the new values are different from the current values
    const params: { [key: string]: any } = {}
    if (username && username !== currentUser.username) {
      if (!isUsernameAvailable(username)) {
        return NextResponse.json(
          { error: { username: `${username} is already used.` } },
          { status: 400 }
        )
      }
      params.username = username
    }
    if (
      email &&
      !currentUser.emailAddresses.some(e => e.emailAddress === email)
    ) {
      if (!isEmailAvailable(email)) {
        return NextResponse.json(
          { error: { email: `${email} is already used.` } },
          { status: 400 }
        )
      }
      params.emailAddresses = [{ emailAddress: email }]
    }
    if (
      phoneNumber &&
      !currentUser.phoneNumbers.some(p => p.phoneNumber === phoneNumber)
    ) {
      if (!isPhoneNumberAvailable(phoneNumber)) {
        return NextResponse.json(
          { error: { phoneNumber: `${phoneNumber} is already used.` } },
          { status: 400 }
        )
      }
      params.phoneNumbers = [{ phoneNumber }]
    }
    if (firstName && firstName !== currentUser.firstName)
      params.firstName = firstName
    if (lastName && lastName !== currentUser.lastName)
      params.lastName = lastName
    if (password) params.password = password

    if (Object.keys(params).length === 0) {
      return NextResponse.json(
        { message: 'No changes detected' },
        { status: 200 }
      )
    }

    const updatedUser = await clerkClient.users.updateUser(userId, params)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating the user:', error)
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    )
  }
}
