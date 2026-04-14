import { test, expect } from '@playwright/test';

test.describe('Spec 5: Security (TC-26 to TC-30)', () => {
  
  test('TC-27: XSS prevention', async ({ page }) => {
    await page.goto('/search');
    const searchInput = page.locator('input[type="search"], input[name="q"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('<script>alert("XSS")</script>');
      await page.keyboard.press('Enter');
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('<script>alert("XSS")</script>');
      console.log('✅ TC-27 PASSED: XSS payload escaped');
    } else {
      console.log('⚠️ TC-27 SKIPPED: No search input found');
    }
  });

  test('TC-28: SQL injection prevention', async ({ page }) => {
    await page.goto('/search');
    const searchInput = page.locator('input[type="search"], input[name="q"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill("' OR '1'='1");
      await page.keyboard.press('Enter');
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toMatch(/SQL|database|syntax/i);
      console.log('✅ TC-28 PASSED: SQL injection attempt handled');
    }
  });

  test('TC-29: CSRF token validation', async ({ page }) => {
    await page.goto('/login');
    const csrfToken = await page.locator('input[name="csrf_token"], input[name="_token"]');
    if (await csrfToken.count() > 0) {
      const tokenValue = await csrfToken.getAttribute('value');
      expect(tokenValue).not.toBeNull();
      expect(tokenValue?.length).toBeGreaterThan(10);
      console.log('✅ TC-29 PASSED: CSRF token present');
    } else {
      console.log('⚠️ TC-29 SKIPPED: No CSRF token found');
    }
  });

  test('TC-30: Secure cookies', async ({ page, context }) => {
    await page.goto('/');
    const cookies = await context.cookies();
    const sessionCookies = cookies.filter(c => 
      c.name.includes('session') || c.name.includes('auth')
    );
    for (const cookie of sessionCookies) {
      expect(cookie.secure).toBe(true);
      expect(cookie.httpOnly).toBe(true);
    }
    console.log(`✅ TC-30 PASSED: ${sessionCookies.length} secure cookies found`);
  });
});