import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { ProvisioningOrchestrator } from '../../../../lib/onboarding/provision-node';
import {
  sendApprovalEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
} from '../../../../lib/email';
import { createLogger } from '../../../../lib/logger';

const log = createLogger('stripe-webhook');

const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
});

const docClient = DynamoDBDocument.from(dbClient);
const TableName = process.env.DYNAMO_TABLE || '';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27-acacia' as any,
  });

  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    }
    if (!sig) {
      throw new Error('Missing stripe-signature header');
    }

    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    log.error({ err }, 'Webhook signature verification failed');
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle $29/mo Initial Subscription
        if (session.metadata?.type === 'platform_subscription') {
          const userEmail =
            session.customer_email || session.metadata?.userEmail;
          const userName = session.metadata?.userName || 'Valued Client';
          const repoName = session.metadata?.repoName;

          if (userEmail) {
            // Find the user by email in DynamoDB using GSI1
            const res = await docClient.query({
              TableName,
              IndexName: 'GSI1',
              KeyConditionExpression: 'GSI1PK = :pk AND GSI1SK = :email',
              ExpressionAttributeValues: {
                ':pk': 'USER',
                ':email': userEmail,
              },
            });

            const userItem = res.Items?.[0];
            if (userItem) {
              const userId = userItem.PK.replace('USER#', '');

              // Update the user's metadata: set plan, customerId, subscriptionId and initial fuel pool
              await docClient.update({
                TableName,
                Key: { PK: `USER#${userId}`, SK: 'METADATA' },
                UpdateExpression:
                  'SET stripeCustomerId = :customerId, stripeSubscriptionId = :subscriptionId, plan = :plan, aiTokenBalanceCents = if_not_exists(aiTokenBalanceCents, :zero) + :initialFuel, coEvolutionOptIn = :coEvo',
                ExpressionAttributeValues: {
                  ':customerId': session.customer as string,
                  ':subscriptionId': session.subscription as string,
                  ':plan': 'MANAGED',
                  ':initialFuel': 1000, // $10 initial fuel
                  ':zero': 0,
                  ':coEvo': session.metadata?.coEvolutionOptIn === 'true',
                },
              });

              // Also update the main user record status to APPROVED for beta access
              await docClient.update({
                TableName,
                Key: { PK: `USER#${userId}`, SK: `USER#${userId}` },
                UpdateExpression: 'SET #s = :status',
                ExpressionAttributeNames: { '#s': 'status' },
                ExpressionAttributeValues: { ':status': 'APPROVED' },
              });

              // Send approval notification
              sendApprovalEmail(userEmail, userName).catch((err) =>
                log.error({ err, userId }, 'Failed to send approval email')
              );

              // Trigger Autonomous Provisioning
              const githubToken = process.env.GITHUB_SERVICE_TOKEN;
              if (githubToken && repoName) {
                log.info(
                  { userId, email: userEmail },
                  'Triggering provisioning'
                );
                const orchestrator = new ProvisioningOrchestrator(githubToken);

                orchestrator
                  .provisionNode({
                    userEmail,
                    userName,
                    repoName,
                    githubToken,
                    coEvolutionOptIn:
                      session.metadata?.coEvolutionOptIn === 'true',
                  })
                  .then((result) => {
                    log.info(
                      { userId, accountId: result.accountId },
                      'Provisioning complete'
                    );
                  })
                  .catch((err) => {
                    log.error({ err, userId }, 'Provisioning failed');
                  });
              }

              log.info(
                { userId, email: userEmail },
                'Managed subscription initialized'
              );
            }
          }
        }

        // Handle AI Fuel Pack Refills ($10 bump)
        if (session.metadata?.type === 'fuel_pack_refill') {
          const amountCents = parseInt(
            session.metadata.amountCents || '1000',
            10
          );
          const customerId = session.customer as string;

          // Find user by Stripe Customer ID via GSI (assuming one exists)
          // or we can store userEmail in metadata and use that.
          // For now, let's check if we have the customerId in the database.
          const res = await docClient.query({
            TableName,
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :customerId',
            ExpressionAttributeValues: {
              ':customerId': `STRIPE#${customerId}`,
            },
          });

          const userItem = res.Items?.[0];
          if (userItem) {
            const userId = userItem.PK.replace('USER#', '');
            await docClient.update({
              TableName,
              Key: { PK: `USER#${userId}`, SK: 'METADATA' },
              UpdateExpression:
                'SET aiTokenBalanceCents = if_not_exists(aiTokenBalanceCents, :zero) + :amount',
              ExpressionAttributeValues: {
                ':amount': amountCents,
                ':zero': 0,
              },
            });
            log.info({ userId, amountCents }, 'AI credits topped up');
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const subscriptionId =
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription?.id;

        if (subscriptionId) {
          // Find user by subscription ID
          const res = await docClient.query({
            TableName,
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :subscriptionId',
            ExpressionAttributeValues: {
              ':subscriptionId': `SUB#${subscriptionId}`,
            },
          });

          const userItem = res.Items?.[0];
          if (userItem) {
            const userId = userItem.PK.replace('USER#', '');
            // Replenish $10 monthly fuel allowance
            await docClient.update({
              TableName,
              Key: { PK: `USER#${userId}`, SK: 'METADATA' },
              UpdateExpression:
                'SET aiTokenBalanceCents = if_not_exists(aiTokenBalanceCents, :zero) + :amount',
              ExpressionAttributeValues: {
                ':amount': 1000,
                ':zero': 0,
              },
            });
            log.info(
              { userId, subscriptionId },
              'Monthly AI credits replenished'
            );
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        log.warn({ customerId, invoiceId: invoice.id }, 'Payment failed');

        // Find user by Stripe Customer ID
        const res = await docClient.query({
          TableName,
          IndexName: 'GSI1',
          KeyConditionExpression: 'GSI1PK = :customerId',
          ExpressionAttributeValues: {
            ':customerId': `STRIPE#${customerId}`,
          },
        });

        const userItem = res.Items?.[0];
        if (userItem) {
          const userId = userItem.PK.replace('USER#', '');
          // Mark account as payment_failed so access can be restricted
          await docClient.update({
            TableName,
            Key: { PK: `USER#${userId}`, SK: 'METADATA' },
            UpdateExpression: 'SET paymentStatus = :status, updatedAt = :now',
            ExpressionAttributeValues: {
              ':status': 'PAYMENT_FAILED',
              ':now': new Date().toISOString(),
            },
          });

          // Notify user about failed payment
          const userEmail = userItem.email || userItem.GSI1SK;
          const userName = userItem.name || 'there';
          if (userEmail) {
            sendPaymentFailedEmail(userEmail, userName).catch((err) =>
              log.error({ err, userId }, 'Failed to send payment failed email')
            );
          }

          log.info({ userId, customerId }, 'Payment failed status recorded');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe Customer ID
        const res = await docClient.query({
          TableName,
          IndexName: 'GSI1',
          KeyConditionExpression: 'GSI1PK = :customerId',
          ExpressionAttributeValues: {
            ':customerId': `STRIPE#${customerId}`,
          },
        });

        const userItem = res.Items?.[0];
        if (userItem) {
          const userId = userItem.PK.replace('USER#', '');
          await docClient.update({
            TableName,
            Key: { PK: `USER#${userId}`, SK: 'METADATA' },
            UpdateExpression:
              'SET subscriptionStatus = :status, updatedAt = :now',
            ExpressionAttributeValues: {
              ':status': subscription.status,
              ':now': new Date().toISOString(),
            },
          });
          log.info(
            { userId, status: subscription.status },
            'Subscription updated'
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        log.warn({ customerId }, 'Subscription cancelled');

        // Find user by Stripe Customer ID
        const res = await docClient.query({
          TableName,
          IndexName: 'GSI1',
          KeyConditionExpression: 'GSI1PK = :customerId',
          ExpressionAttributeValues: {
            ':customerId': `STRIPE#${customerId}`,
          },
        });

        const userItem = res.Items?.[0];
        if (userItem) {
          const userId = userItem.PK.replace('USER#', '');
          // Downgrade plan and restrict access
          await docClient.update({
            TableName,
            Key: { PK: `USER#${userId}`, SK: 'METADATA' },
            UpdateExpression:
              'SET plan = :plan, subscriptionStatus = :status, paymentStatus = :payStatus, updatedAt = :now',
            ExpressionAttributeValues: {
              ':plan': 'FREE',
              ':status': 'CANCELLED',
              ':payStatus': 'CANCELLED',
              ':now': new Date().toISOString(),
            },
          });

          // Notify user about cancellation
          const userEmail = userItem.email || userItem.GSI1SK;
          const userName = userItem.name || 'there';
          if (userEmail) {
            sendSubscriptionCancelledEmail(userEmail, userName).catch((err) =>
              log.error({ err, userId }, 'Failed to send cancellation email')
            );
          }

          log.info({ userId }, 'User downgraded to FREE after cancellation');
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    log.error({ err: error }, 'Webhook event processing failed');
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
