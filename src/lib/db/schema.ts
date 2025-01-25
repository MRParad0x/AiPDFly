import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'

// Define the enums
export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])
export const userRoleEnum = pgEnum('user_role_enum', ['admin', 'customer'])

// Define the users table
export const users = pgTable('users', {
  userId: varchar('user_id', { length: 256 }).primaryKey(),
  username: varchar('username', { length: 256 }).notNull(),
  emailAddress: varchar('email_address', { length: 256 }).notNull(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }).notNull(),
  imageUrl: varchar('image_url', { length: 256 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 15 }).notNull(),
  role: userRoleEnum('role').notNull().default('customer'),
  lastSignInAt: timestamp('last_sign_in_at'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
})

export type DrizzleUser = typeof users.$inferSelect

// Define the chats table
export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 })
    .references(() => users.userId) // Establishing relationship with users table
    .notNull(),
  fileKey: text('file_key').notNull()
})

export type DrizzleChat = typeof chats.$inferSelect

// Define the messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: userSystemEnum('role').notNull()
})

// Define the user subscriptions table
export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 })
    .references(() => users.userId)
    .notNull()
    .unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar('stripe_subscription_id', {
    length: 256
  }).unique(),
  stripePriceId: varchar('stripe_price_id', { length: 256 }),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_ended_at'),
  stripeSubscriptionStatus: varchar('stripe_subscription_status', {
    length: 256
  }),
  stripeProduct: varchar('stripe_product'),
  stripeInvoiceUrl: varchar('stripe_invoice_url', { length: 256 }),
  stripeInvoicePDF: varchar('stripe_invoice_pdf', { length: 256 }),
  stripeAmount: integer('stripe_amount'),
  stripePaymentStatus: varchar('stripe_payment_status'),
  stripeCheckoutStatus: varchar('stripe_checkout_status'),
  stripeCreatedAt: timestamp('stripe_created_at'),
  stripeCardLast4Digits: varchar('stripe_card_last_4_digits', { length: 256 }),
  stripeCardBrand: varchar('stripe_card_brand'),
  stripeBillingAddress: varchar('stripe_billing_address')
})

export type DrizzleUserSubscriptions = typeof userSubscriptions.$inferSelect

// Define the shares table
export const shares = pgTable('shares', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .references(() => chats.id)
    .notNull(),
  shareKey: varchar('share_key', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 })
    .references(() => users.userId) // Adding userId reference to users table
    .notNull()
})

export type DrizzleShare = typeof shares.$inferSelect

//npx drizzle-kit studio
//npx drizzle-kit push
