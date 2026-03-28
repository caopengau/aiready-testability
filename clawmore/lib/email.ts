import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { createLogger } from './logger';

const log = createLogger('email');

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
});

const fromEmail = process.env.SES_FROM_EMAIL || 'noreply@dev.getaiready.dev';

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || 'https://clawmore.getaiready.dev';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailWrapper(inner: string): string {
  return `
    <body style="background-color: #0a0a0a; color: #ffffff; font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 40px 20px; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(0, 224, 255, 0.2); border-radius: 8px; padding: 40px; box-shadow: 0 0 40px rgba(0, 224, 255, 0.05);">
        <div style="margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; font-style: italic; letter-spacing: -0.05em; margin: 0; text-transform: uppercase;">CLAW<span style="color: #00e0ff;">MORE</span></h1>
          <p style="color: #71717a; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; margin-top: 8px;">Managed Agentic Platform</p>
        </div>
        <div style="margin-bottom: 30px; height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 224, 255, 0.3), transparent);"></div>
        ${inner}
        <p style="margin-top: 40px; font-size: 12px; color: #52525b; font-family: monospace;">
          ClawMore &mdash; Autonomous Infrastructure Platform
        </p>
      </div>
    </body>`;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  const command = new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Source: fromEmail,
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: html, Charset: 'UTF-8' },
        Text: { Data: text, Charset: 'UTF-8' },
      },
    },
  });

  try {
    await sesClient.send(command);
    log.info({ to, subject }, 'Email sent');
  } catch (err) {
    log.error({ err, to, subject }, 'Email send failed');
  }
}

export async function sendApprovalEmail(to: string, name: string) {
  const safeName = escapeHtml(name);
  const loginUrl = `${appUrl}/login`;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Welcome to the Beta, ${safeName}!</h2>
    <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">Your account has been approved. Log in to start using ClawMore.</p>
    <a href="${loginUrl}" style="display: inline-block; padding: 16px 32px; background-color: #00e0ff; color: #000000; text-decoration: none; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Access Console</a>
  `);

  await sendEmail(
    to,
    'Your ClawMore Account is Approved',
    html,
    `Welcome, ${name}! Your account has been approved. Log in at ${loginUrl}`
  );
}

export async function sendWelcomeEmail(to: string, name: string) {
  const safeName = escapeHtml(name);
  const dashboardUrl = `${appUrl}/dashboard`;
  const pricingUrl = `${appUrl}/#pricing`;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Welcome, ${safeName}!</h2>
    <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">Your ClawMore account has been created. You start with <strong style="color: #00e0ff;">$5 in free AI credits</strong> to try automated code fixes.</p>
    <div style="text-align: left; margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 4px;">
      <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 8px;">What you can do now:</p>
      <ul style="color: #d4d4d8; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Scan up to 3 repositories for free</li>
        <li>Run 10 analysis scans per month</li>
        <li>Track improvements in your dashboard</li>
      </ul>
    </div>
    <a href="${dashboardUrl}" style="display: inline-block; padding: 16px 32px; background-color: #00e0ff; color: #000000; text-decoration: none; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Open Dashboard</a>
    <p style="margin-top: 16px; font-size: 12px; color: #52525b;">
      <a href="${pricingUrl}" style="color: #71717a;">View plans &rarr;</a>
    </p>
  `);

  await sendEmail(
    to,
    'Welcome to ClawMore',
    html,
    `Welcome, ${name}! Your account is ready with $5 in free AI credits. Open your dashboard at ${dashboardUrl}`
  );
}

export async function sendPaymentFailedEmail(to: string, name: string) {
  const safeName = escapeHtml(name);
  const billingUrl = `${appUrl}/dashboard?tab=account`;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #f87171;">Payment Failed</h2>
    <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">Hi ${safeName}, we were unable to process your latest payment. Please update your billing information to keep your ClawMore subscription active.</p>
    <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">If your payment method isn't updated within 7 days, your account will be downgraded to the free tier.</p>
    <a href="${billingUrl}" style="display: inline-block; padding: 16px 32px; background-color: #00e0ff; color: #000000; text-decoration: none; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Update Billing</a>
  `);

  await sendEmail(
    to,
    'Action Required: Payment Failed',
    html,
    `Hi ${name}, your payment failed. Update your billing info at ${billingUrl} to keep your subscription active.`
  );
}

export async function sendSubscriptionCancelledEmail(to: string, name: string) {
  const safeName = escapeHtml(name);
  const pricingUrl = `${appUrl}/#pricing`;

  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Subscription Cancelled</h2>
    <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">Hi ${safeName}, your ClawMore Managed subscription has been cancelled. Your account has been moved to the free tier.</p>
    <div style="text-align: left; margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 4px;">
      <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 8px;">You still have access to:</p>
      <ul style="color: #d4d4d8; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>3 repositories</li>
        <li>10 scans per month</li>
        <li>7-day history</li>
      </ul>
    </div>
    <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">Want to resubscribe? Your previous configuration is still saved.</p>
    <a href="${pricingUrl}" style="display: inline-block; padding: 16px 32px; background-color: #00e0ff; color: #000000; text-decoration: none; border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">View Plans</a>
  `);

  await sendEmail(
    to,
    'ClawMore Subscription Cancelled',
    html,
    `Hi ${name}, your subscription has been cancelled and your account moved to the free tier. View plans at ${pricingUrl}`
  );
}
