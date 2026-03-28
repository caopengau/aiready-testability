import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockSend = vi.fn();

vi.mock('@aws-sdk/client-ses', () => ({
  SESClient: vi.fn().mockImplementation(() => ({ send: mockSend })),
  SendEmailCommand: vi.fn().mockImplementation((args) => args),
}));

import {
  sendApprovalEmail,
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
} from './email';

describe('email service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sendApprovalEmail', () => {
    it('should send approval email with login link', async () => {
      await sendApprovalEmail('user@example.com', 'Jane');

      expect(mockSend).toHaveBeenCalledTimes(1);
      const call = mockSend.mock.calls[0][0];
      expect(call.Destination.ToAddresses).toEqual(['user@example.com']);
      expect(call.Message.Subject.Data).toBe(
        'Your ClawMore Account is Approved'
      );
      expect(call.Message.Html.Data).toContain('Jane');
      expect(call.Message.Html.Data).toContain('/login');
      expect(call.Message.Text.Data).toContain('Jane');
    });

    it('should escape HTML in user name', async () => {
      await sendApprovalEmail(
        'user@example.com',
        '<script>alert("xss")</script>'
      );

      const call = mockSend.mock.calls[0][0];
      expect(call.Message.Html.Data).not.toContain('<script>');
      expect(call.Message.Html.Data).toContain('&lt;script&gt;');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with dashboard link and credits info', async () => {
      await sendWelcomeEmail('new@example.com', 'Bob');

      expect(mockSend).toHaveBeenCalledTimes(1);
      const call = mockSend.mock.calls[0][0];
      expect(call.Destination.ToAddresses).toEqual(['new@example.com']);
      expect(call.Message.Subject.Data).toBe('Welcome to ClawMore');
      expect(call.Message.Html.Data).toContain('Bob');
      expect(call.Message.Html.Data).toContain('$5');
      expect(call.Message.Html.Data).toContain('/dashboard');
      expect(call.Message.Html.Data).toContain('3 repositories');
    });
  });

  describe('sendPaymentFailedEmail', () => {
    it('should send payment failed email with billing link', async () => {
      await sendPaymentFailedEmail('fail@example.com', 'Alice');

      expect(mockSend).toHaveBeenCalledTimes(1);
      const call = mockSend.mock.calls[0][0];
      expect(call.Destination.ToAddresses).toEqual(['fail@example.com']);
      expect(call.Message.Subject.Data).toBe('Action Required: Payment Failed');
      expect(call.Message.Html.Data).toContain('Alice');
      expect(call.Message.Html.Data).toContain('Payment Failed');
      expect(call.Message.Html.Data).toContain('/dashboard?tab=account');
    });
  });

  describe('sendSubscriptionCancelledEmail', () => {
    it('should send cancellation email with free tier info', async () => {
      await sendSubscriptionCancelledEmail('cancel@example.com', 'Charlie');

      expect(mockSend).toHaveBeenCalledTimes(1);
      const call = mockSend.mock.calls[0][0];
      expect(call.Destination.ToAddresses).toEqual(['cancel@example.com']);
      expect(call.Message.Subject.Data).toBe('ClawMore Subscription Cancelled');
      expect(call.Message.Html.Data).toContain('Charlie');
      expect(call.Message.Html.Data).toContain('Subscription Cancelled');
      expect(call.Message.Html.Data).toContain('/#pricing');
      expect(call.Message.Html.Data).toContain('10 scans per month');
    });
  });

  describe('error handling', () => {
    it('should not throw when SES send fails', async () => {
      mockSend.mockRejectedValue(new Error('SES down'));

      // Should not throw
      await expect(
        sendApprovalEmail('user@example.com', 'Test')
      ).resolves.not.toThrow();
    });
  });
});
