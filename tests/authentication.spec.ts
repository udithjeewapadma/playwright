import { test, expect } from '@playwright/test';

test.describe('Spec 1: Authentication & User Account (TC-01 to TC-10)', () => {
  
  test('TC-01: Navigate to Login page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Sign In"), a:has-text("Login")');
    await expect(page).toHaveURL(/login|signin/i);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    console.log('✅ TC-01 PASSED: Login page loaded successfully');
  });

  test('TC-02: Login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', 'testuser@pixelsuite.com');
    await page.fill('input[type="password"]', 'Test@1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard|account|home/i);
    console.log('✅ TC-02 PASSED: Redirected to dashboard');
  });

  test('TC-03: Login with invalid email format', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', 'invalidemail');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    const errorMsg = page.locator(':has-text("valid email")');
    await expect(errorMsg).toBeVisible();
    console.log('✅ TC-03 PASSED: Invalid email error shown');
  });

  test('TC-04: Login with wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', 'testuser@pixelsuite.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    const errorMsg = page.locator(':has-text("Incorrect"), :has-text("Wrong password")');
    await expect(errorMsg).toBeVisible();
    console.log('✅ TC-04 PASSED: Incorrect password error shown');
  });

  test('TC-05: Empty fields validation', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    const errors = page.locator(':has-text("required")');
    await expect(errors).toHaveCount(2);
    console.log('✅ TC-05 PASSED: Both field validation errors shown');
  });

  test('TC-06: Password reset link', async ({ page }) => {
    await page.goto('/login');
    await page.click('a:has-text("Forgot"), a:has-text("Reset password")');
    await expect(page).toHaveURL(/reset|forgot/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    console.log('✅ TC-06 PASSED: Password reset page loaded');
  });

  test('TC-07: Password reset with valid email', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'testuser@pixelsuite.com');
    await page.click('button[type="submit"]');
    const successMsg = page.locator(':has-text("sent"), :has-text("email")');
    await expect(successMsg).toBeVisible();
    console.log('✅ TC-07 PASSED: Reset link sent message shown');
  });

  test('TC-08: Password reset with invalid email', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'fake@nowhere.com');
    await page.click('button[type="submit"]');
    const errorMsg = page.locator(':has-text("not found"), :has-text("No account")');
    await expect(errorMsg).toBeVisible();
    console.log('✅ TC-08 PASSED: No account found error shown');
  });

  test('TC-09: Sign up / Register page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Sign Up"), a:has-text("Register"), a:has-text("Create Account")');
    await expect(page).toHaveURL(/signup|register|create-account/i);
    const inputs = await page.locator('input').count();
    expect(inputs).toBeGreaterThanOrEqual(4);
    console.log('✅ TC-09 PASSED: Registration page loaded with all fields');
  });

  test('TC-10: Password strength validation', async ({ page }) => {
    await page.goto('/signup');
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('123');
    const strengthIndicator = page.locator(':has-text("Weak")');
    await expect(strengthIndicator).toBeVisible();
    console.log('✅ TC-10 PASSED: Password strength indicator shown');
  });
});