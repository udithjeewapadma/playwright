import { test, expect } from '@playwright/test';

test.describe('Spec 2: Pricing & Payment (TC-11 to TC-19)', () => {
  
  test('TC-11: Navigate to Pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1, h2').filter({ hasText: /pricing|plans/i })).toBeVisible();
    console.log('✅ TC-11 PASSED: Pricing page loaded');
  });

  test('TC-12: All pricing plans visible', async ({ page }) => {
    await page.goto('/pricing');
    const plans = page.locator('.plan, .pricing-card');
    const count = await plans.count();
    expect(count).toBeGreaterThanOrEqual(3);
    console.log(`✅ TC-12 PASSED: ${count} pricing plans visible`);
  });

  test('TC-13: Toggle monthly/yearly billing', async ({ page }) => {
    await page.goto('/pricing');
    const toggle = page.locator('.toggle, [role="switch"]');
    if (await toggle.count() > 0) {
      const initialPrice = await page.locator('.price').first().textContent();
      await toggle.click();
      await page.waitForTimeout(500);
      const newPrice = await page.locator('.price').first().textContent();
      expect(initialPrice).not.toEqual(newPrice);
      console.log('✅ TC-13 PASSED: Billing toggle changed prices');
    } else {
      console.log('⚠️ TC-13 SKIPPED: No billing toggle found');
    }
  });

  test('TC-14: Select Pro plan', async ({ page }) => {
    await page.goto('/pricing');
    const proPlan = page.locator('.plan:has-text("Pro"), .pricing-card:has-text("Professional")');
    await proPlan.locator('a:has-text("Choose"), button:has-text("Select")').click();
    await expect(page).toHaveURL(/checkout|payment/i);
    console.log('✅ TC-14 PASSED: Redirected to checkout');
  });

  test('TC-15: Checkout page loads', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('input[name="cardnumber"], [data-elements="cardNumber"]')).toBeVisible();
    console.log('✅ TC-15 PASSED: Payment form loaded');
  });

  test('TC-16: Card number validation', async ({ page }) => {
    await page.goto('/checkout');
    const cardInput = page.locator('input[name="cardnumber"], [data-elements="cardNumber"] input');
    if (await cardInput.count() > 0) {
      await cardInput.fill('1234');
      await page.click('button[type="submit"]');
      const error = page.locator(':has-text("invalid"), :has-text("card number")');
      await expect(error).toBeVisible();
      console.log('✅ TC-16 PASSED: Card number validation working');
    }
  });

  test('TC-17: Expiry date validation', async ({ page }) => {
    await page.goto('/checkout');
    const expiryInput = page.locator('input[name="expiry"], [placeholder*="MM/YY"]');
    if (await expiryInput.count() > 0) {
      await expiryInput.fill('01/20');
      await page.click('button[type="submit"]');
      const error = page.locator(':has-text("expired")');
      await expect(error).toBeVisible();
      console.log('✅ TC-17 PASSED: Expiry date validation working');
    }
  });

  test('TC-18: CVV validation', async ({ page }) => {
    await page.goto('/checkout');
    const cvvInput = page.locator('input[name="cvv"], input[name="cvc"]');
    if (await cvvInput.count() > 0) {
      await cvvInput.fill('12');
      await page.click('button[type="submit"]');
      const error = page.locator(':has-text("CVV"), :has-text("cvc")');
      await expect(error).toBeVisible();
      console.log('✅ TC-18 PASSED: CVV validation working');
    }
  });

  test('TC-19: Apply promo code', async ({ page }) => {
    await page.goto('/checkout');
    const promoInput = page.locator('input[name="promo"], input[name="coupon"]');
    if (await promoInput.count() > 0) {
      await promoInput.fill('SAVE20');
      await page.click('button:has-text("Apply")');
      const discountMsg = page.locator(':has-text("discount"), :has-text("applied")');
      await expect(discountMsg).toBeVisible();
      console.log('✅ TC-19 PASSED: Promo code applied');
    }
  });
});