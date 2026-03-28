import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test('signup page renders with form fields', async ({ page }) => {
    await page.goto('/signup');

    // Check heading
    await expect(page.locator('h1')).toContainText('Create Account');

    // Check form fields exist
    await expect(page.locator('input[placeholder="Jane Smith"]')).toBeVisible();
    await expect(
      page.locator('input[placeholder="you@company.com"]')
    ).toBeVisible();

    // Check submit button
    const submitBtn = page.locator('button:has-text("Create Free Account")');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('signup page shows free tier benefits', async ({ page }) => {
    await page.goto('/signup');

    // Check free tier features are listed
    await expect(page.locator('text=3 repositories')).toBeVisible();
    await expect(page.locator('text=10 analysis runs')).toBeVisible();
    await expect(page.locator('text=$5 welcome')).toBeVisible();
  });

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/signup');

    const loginLink = page.locator('a:has-text("Sign in")');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('signup form validates required fields', async ({ page }) => {
    await page.goto('/signup');

    // Try to submit empty form
    const submitBtn = page.locator('button:has-text("Create Free Account")');

    // HTML5 validation should prevent submission
    // The form has `required` attributes
    await submitBtn.click();

    // Page should still be on /signup (no redirect)
    await expect(page).toHaveURL(/\/signup/);
  });

  test('signup form submits and shows success state', async ({ page }) => {
    await page.goto('/signup');

    // Fill form
    await page.fill('input[placeholder="Jane Smith"]', 'Test User');
    await page.fill(
      'input[placeholder="you@company.com"]',
      `test-${Date.now()}@example.com`
    );

    // Submit
    await page.click('button:has-text("Create Free Account")');

    // Should show success state with "Account Created"
    await expect(page.locator('text=Account Created')).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe('Login Page', () => {
  test('login page renders with email input', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(
      page.locator('input[placeholder="you@company.com"]')
    ).toBeVisible();
    await expect(
      page.locator('button:has-text("Send Magic Link")')
    ).toBeVisible();
  });

  test('login page has GitHub and Google auth buttons', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('button:has-text("GitHub")')).toBeVisible();
    await expect(page.locator('button:has-text("Google")')).toBeVisible();
  });

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login');

    const signupLink = page.locator('a:has-text("Create an account")');
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', '/signup');
  });
});

test.describe('Legal Pages', () => {
  test('terms of service page renders', async ({ page }) => {
    await page.goto('/terms');

    await expect(page.locator('h1')).toContainText('Terms of Service');
    await expect(page.locator('text=Acceptance of Terms')).toBeVisible();
  });

  test('privacy policy page renders', async ({ page }) => {
    await page.goto('/privacy');

    await expect(page.locator('h1')).toContainText('Privacy Policy');
    await expect(page.locator('text=Information We Collect')).toBeVisible();
  });

  test('footer links to terms and privacy', async ({ page }) => {
    await page.goto('/');

    const termsLink = page.locator('footer a:has-text("Terms")');
    const privacyLink = page.locator('footer a:has-text("Privacy")');

    await expect(termsLink).toHaveAttribute('href', '/terms');
    await expect(privacyLink).toHaveAttribute('href', '/privacy');
  });
});
