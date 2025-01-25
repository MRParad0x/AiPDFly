import { db } from '@/lib/db'
import { userSubscriptions } from '@/lib/db/schema'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

interface StripeCustomer {
  id: string
  object: string
  address: {
    city: string
    country: string
    line1: string
    line2: string
    postal_code: string
    state: string | null
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string
    )
  } catch (error) {
    return new NextResponse('webhook error', { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const updateSession = event.data.object as Stripe.CustomerCreateParams

  // new subscription created
  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    )

    const paymentMethods = await stripe.paymentMethods.list({
      type: 'card',
      limit: 3,
      customer: subscription.customer as string
    })

    const invoice = await stripe.invoices.retrieve(
      subscription.latest_invoice as string
    )

    const product = await stripe.products.retrieve(
      subscription.items.data[0].price.product as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse('no userid', { status: 400 })
    }

    const cardId = await db.insert(userSubscriptions).values({
      userId: session.metadata.userId,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionStatus: subscription.status, // assuming this field exists in the subscription object
      stripeProduct: product.name,
      stripeAmount: subscription.items.data[0].price.unit_amount,
      stripeCreatedAt: new Date(subscription.created * 1000),
      stripeSubscriptionId: subscription.id,
      stripePaymentStatus: session.payment_status,
      stripeCheckoutStatus: session.status,
      stripeCardLast4Digits: paymentMethods.data[0].card?.last4,
      stripeCardBrand: paymentMethods.data[0].card?.brand,
      stripeInvoiceUrl: invoice.hosted_invoice_url,
      stripeInvoicePDF: invoice.invoice_pdf,
      stripeBillingAddress: `${invoice.customer_address?.line1}, 
        ${invoice.customer_address?.line2}, 
        ${invoice.customer_address?.city}, ${invoice.customer_address?.state}, ${invoice.customer_address?.postal_code}, ${invoice.customer_address?.country}`
    })
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = await stripe.subscriptions.retrieve(
      session.id as string
    )
    const paymentMethods = await stripe.paymentMethods.list({
      type: 'card',
      limit: 3,
      customer: subscription.customer as string
    })

    const invoice = await stripe.invoices.retrieve(
      subscription.latest_invoice as string
    )
    await db
      .update(userSubscriptions)
      .set({
        stripePaymentStatus: session.payment_status,
        stripeCheckoutStatus: session.status,
        stripeSubscriptionStatus: subscription.status,
        stripeAmount: subscription.items.data[0].price.unit_amount,
        stripeCardLast4Digits: paymentMethods.data[0].card?.last4,
        stripeCardBrand: paymentMethods.data[0].card?.brand,
        stripeBillingAddress: `${invoice.customer_address?.line1}, 
        ${invoice.customer_address?.line2}, 
        ${invoice.customer_address?.city}, ${invoice.customer_address?.state}, ${invoice.customer_address?.postal_code}, ${invoice.customer_address?.country}`
      })
      .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id))
  }

  if (event.type === 'customer.updated') {
    const customer = event.data.object as StripeCustomer
    await db
      .update(userSubscriptions)
      .set({
        stripeBillingAddress: `${customer.address.line1},
        ${customer.address.line2},
        ${customer.address.city}, ${customer.address.postal_code}, ${customer.address.country}`
      })
      .where(eq(userSubscriptions.stripeCustomerId, customer.id))
  }

  return new NextResponse(null, { status: 200 })
}

//stripe listen --forward-to localhost:3000/api/webhook/stripe
