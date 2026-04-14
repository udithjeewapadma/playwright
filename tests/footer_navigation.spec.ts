import { test, expect } from '@playwright/test';

test.describe('Spec 2: Footer Navigation (TC-11 to TC-19)', () => {
  
  test('TC-11: Navigate to About Us page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("About Us")');
    await expect(page).toHaveURL('/about');
    console.log('✅ TC-11 PASSED: About page loaded');
  });

  test('TC-12: Navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Contact")');
    await expect(page).toHaveURL('/contact');
    console.log('✅ TC-12 PASSED: Contact page loaded');
  });

  test('TC-13: Navigate to Privacy Policy page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Privacy Policy")');
    await expect(page).toHaveURL('/privacy');
    console.log('✅ TC-13 PASSED: Privacy page loaded');
  });

  test('TC-14: Navigate to Terms of Service page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Terms of Service")');
    await expect(page).toHaveURL('/terms');
    console.log('✅ TC-14 PASSED: Terms page loaded');
  });

  test('TC-15: Navigate to Disclaimer page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Disclaimer")');
    await expect(page).toHaveURL('/disclaimer');
    console.log('✅ TC-15 PASSED: Disclaimer page loaded');
  });

  test('TC-16: Footer copyright text visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText('PixelsSuite ©2026');
    console.log('✅ TC-16 PASSED: Copyright text visible');
  });

  test('TC-17: All footer links are visible', async ({ page }) => {
    await page.goto('/');
    const footerLinks = page.locator('footer a');
    await expect(footerLinks).toHaveCount(5);
    console.log('✅ TC-17 PASSED: All 5 footer links present');
  });

  test('TC-18: Footer links open same tab', async ({ page }) => {
    await page.goto('/');
    const contactLink = page.locator('a:has-text("Contact")');
    const target = await contactLink.getAttribute('target');
    expect(target).toBeNull(); // Should open in same tab
    console.log('✅ TC-18 PASSED: Footer links open in same tab');
  });

  test('TC-19: Navigate back from footer page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("About Us")');
    await page.goBack();
    await expect(page.locator('h1')).toContainText('Free Online Tools');
    console.log('✅ TC-19 PASSED: Back navigation works');
  });
});