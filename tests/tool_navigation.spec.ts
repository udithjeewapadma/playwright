import { test, expect } from '@playwright/test';

test.describe('Spec 1: Tool Navigation', () => {
  
  test('TC-01: Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Free Online Tools');
  });

  test('TC-02: Navigate to Image to PDF tool', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Image → PDF")');
    await expect(page).toHaveURL(/image-to-pdf/i);
  });

  test('TC-03: Navigate to PDF Editor', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Open Editor →")');
    await expect(page).toHaveURL(/pdf-editor/i);
  });

  test('TC-04: Resize tool dropdown opens', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Resize")');
    
    await expect(page.locator('button:has-text("Resize Image")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Bulk Resize")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Image Enlarger")').first()).toBeVisible();
  });

  test('TC-05: Navigate to Compress Image tool', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Compress Image")');
    await expect(page).toHaveURL(/compress/i);
  });

  test('TC-06: Navigate to Image Converter', async ({ page }) => {
    await page.goto('/');
    // Image Converter section appears after Crop section, so .last() works
    await page.locator('div:has-text("Image Converter")').locator('button:has-text("To JPG")').last().click();
    await expect(page).toHaveURL(/to-jpg/i);
  });

  test('TC-07: Navigate to Rotate tool', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Rotate")');
    await expect(page).toHaveURL(/rotate/i);
  });

  test('TC-08: Navigate to Meme Generator', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Meme")');
    await expect(page).toHaveURL(/meme/i);
  });

  test('TC-09: Navigate to Color Picker', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Color Picker")');
    await expect(page).toHaveURL(/color-picker/i);
  });

  test('TC-10: Navigate to Image to Text (OCR)', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Image → Text")');
    await expect(page).toHaveURL(/image-to-text/i);
  });
});