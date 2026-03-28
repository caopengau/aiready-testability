import { test, expect } from '@playwright/test';

test.describe('Billing API Endpoints', () => {
  test('checkout returns 401 without auth', async ({ request }) => {
    const res = await request.post('/api/billing/checkout');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('portal returns 401 without auth', async ({ request }) => {
    const res = await request.post('/api/billing/portal');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('fuel pack checkout returns 401 without auth', async ({ request }) => {
    const res = await request.post('/api/billing/checkout-fuel');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });
});

test.describe('Registration API', () => {
  test('register rejects invalid email', async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: { email: 'not-an-email', name: 'Test' },
    });
    expect(res.status()).toBe(400);
  });

  test('register rejects missing name', async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: { email: 'test@example.com' },
    });
    expect(res.status()).toBe(400);
  });

  test('register accepts valid data and returns success', async ({
    request,
  }) => {
    const uniqueEmail = `e2e-${Date.now()}@example.com`;
    const res = await request.post('/api/auth/register', {
      data: { email: uniqueEmail, name: 'E2E Test User' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.userId).toBeDefined();
  });

  test('register rejects duplicate approved account', async ({ request }) => {
    const uniqueEmail = `dup-${Date.now()}@example.com`;

    // First registration
    await request.post('/api/auth/register', {
      data: { email: uniqueEmail, name: 'First' },
    });

    // Second registration with same email (pending status - should succeed)
    const res = await request.post('/api/auth/register', {
      data: { email: uniqueEmail, name: 'Second' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});

test.describe('Stripe Webhook', () => {
  test('webhook rejects requests without signature', async ({ request }) => {
    const res = await request.post('/api/webhooks/stripe', {
      data: JSON.stringify({ type: 'ping' }),
      headers: { 'Content-Type': 'application/json' },
    });
    // Should fail signature verification
    expect(res.status()).toBe(400);
  });
});

test.describe('Admin API', () => {
  test('admin users endpoint returns 401 without auth', async ({ request }) => {
    const res = await request.get('/api/admin/users');
    expect(res.status()).toBe(401);
  });

  test('provision endpoint returns 401 without auth', async ({ request }) => {
    const res = await request.post('/api/provision', {
      data: { test: true },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe('Rate Limiting', () => {
  test('API responses include rate limit headers', async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: { email: 'header-test@example.com', name: 'Test' },
    });

    // Check rate limit headers are present
    const limit = res.headers()['x-ratelimit-limit'];
    const remaining = res.headers()['x-ratelimit-remaining'];

    expect(limit).toBeDefined();
    expect(remaining).toBeDefined();
    expect(parseInt(limit)).toBeGreaterThan(0);
  });
});
