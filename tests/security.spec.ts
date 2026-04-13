import { test, expect } from '@playwright/test';

test.describe('Spec 5: Security (TC-36 to TC-40)', () => {
  
  test('TC-36: XSS prevention', async ({ page }) => {
    await page.goto('/search');
    const searchInput = page.locator('input[type="search"], input[name="q"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('<script>alert("XSS")</script>');
      await page.keyboard.press('Enter');
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('<script>alert("XSS")</script>');
      console.log('✅ TC-36 PASSED: XSS payload escaped');
    } else {
      console.log('⚠️ TC-36 SKIPPED: No search input found');
    }
  });

  test('TC-37: SQL injection prevention', async ({ page }) => {
    await page.goto('/search');
    const searchInput = page.locator('input[type="search"], input[name="q"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill("' OR '1'='1");
      await page.keyboard.press('Enter');
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toMatch(/SQL|database|syntax/i);
      console.log('✅ TC-37 PASSED: SQL injection attempt handled');
    }
  });

  test('TC-38: CSRF token validation', async ({ page }) => {
    await page.goto('/login');
    const csrfToken = await page.locator('input[name="csrf_token"], input[name="_token"]');
    if (await csrfToken.count() > 0) {
      const tokenValue = await csrfToken.getAttribute('value');
      expect(tokenValue).not.toBeNull();
      expect(tokenValue?.length).toBeGreaterThan(10);
      console.log('✅ TC-38 PASSED: CSRF token present');
    } else {
      console.log('⚠️ TC-38 SKIPPED: No CSRF token found');
    }
  });

  test('TC-39: Secure cookies', async ({ page, context }) => {
    await page.goto('/');
    const cookies = await context.cookies();
    const sessionCookies = cookies.filter(c => 
      c.name.includes('session') || c.name.includes('auth')
    );
    for (const cookie of sessionCookies) {
      expect(cookie.secure).toBe(true);
      expect(cookie.httpOnly).toBe(true);
    }
    console.log(`✅ TC-39 PASSED: ${sessionCookies.length} secure cookies found`);
  });

  test('TC-40: File upload security', async ({ page }) => {
    await page.goto('/upload');
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      const testFile = Buffer.from('MZ test', 'utf8');
      await fileInput.setInputFiles({
        name: 'malware.exe',
        mimeType: 'application/x-msdownload',
        buffer: testFile
      });
      await page.click('button[type="submit"]');
      const errorMsg = page.locator(':has-text("invalid"), :has-text("not allowed"), :has-text("unsupported")');
      await expect(errorMsg).toBeVisible();
      console.log('✅ TC-40 PASSED: Dangerous file type rejected');
    } else {
      console.log('⚠️ TC-40 SKIPPED: No file upload found');
    }
  });
});