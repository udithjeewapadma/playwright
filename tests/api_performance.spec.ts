import { test, expect } from '@playwright/test';

test.describe('Spec 3: API & Performance (TC-20 to TC-28)', () => {
  
  test('TC-20: API response time - Homepage', async ({ page }) => {
    const apiDurations: number[] = [];
    const startTime = Date.now();
    
    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        apiDurations.push(duration);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    for (const duration of apiDurations) {
      expect(duration).toBeLessThan(500);
    }
    console.log(`✅ TC-20 PASSED: ${apiDurations.length} API calls, all <500ms`);
  });

  test('TC-21: API response time - Image tools', async ({ page }) => {
    const apiDurations: number[] = [];
    const startTime = Date.now();
    
    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        const duration = Date.now() - startTime;
        apiDurations.push(duration);
      }
    });
    
    await page.goto('/image-resize');
    await page.waitForLoadState('networkidle');
    
    for (const duration of apiDurations) {
      expect(duration).toBeLessThan(1000);
    }
    console.log(`✅ TC-21 PASSED: ${apiDurations.length} API calls, all <1s`);
  });

  test('TC-22: Network status codes', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('response', response => {
      const status = response.status();
      if (status >= 400) {
        failedRequests.push(`${response.url()} - ${status}`);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(failedRequests).toEqual([]);
    console.log('✅ TC-22 PASSED: No 4xx/5xx errors');
  });

  test('TC-23: Performance navigation timing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const navigationTiming = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.fetchStart,
        loadComplete: perf.loadEventEnd - perf.fetchStart
      };
    });
    
    expect(navigationTiming.loadComplete).toBeLessThan(3000);
    console.log(`✅ TC-23 PASSED: Load time ${navigationTiming.loadComplete}ms`);
  });

  test('TC-24: First Contentful Paint (FCP)', async ({ page }) => {
    await page.goto('/');
    
    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) resolve(fcpEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ type: 'paint', buffered: true });
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    expect(fcp).toBeLessThan(1500);
    console.log(`✅ TC-24 PASSED: FCP = ${fcp}ms`);
  });

  test('TC-25: Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries[entries.length - 1];
          if (lcpEntry) resolve(lcpEntry.startTime);
          observer.disconnect();
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    expect(lcp).toBeLessThan(2500);
    console.log(`✅ TC-25 PASSED: LCP = ${lcp}ms`);
  });

  test('TC-26: Time to Interactive (TTI)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const tti = Date.now() - startTime;
    
    expect(tti).toBeLessThan(3500);
    console.log(`✅ TC-26 PASSED: TTI = ${tti}ms`);
  });

  test('TC-27: Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');
    
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
          observer.disconnect();
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(clsValue), 5000);
      });
    });
    
    expect(cls).toBeLessThan(0.1);
    console.log(`✅ TC-27 PASSED: CLS = ${cls}`);
  });

  test('TC-28: Concurrent API requests', async ({ request }) => {
    const endpoints = [
      'https://www.pixelsuite.com/api/health',
      'https://www.pixelsuite.com/api/config', 
      'https://www.pixelsuite.com/api/status'
    ];
    
    const promises = endpoints.map(endpoint => 
      request.get(endpoint).catch(() => null)
    );
    
    const responses = await Promise.all(promises);
    const successCount = responses.filter(r => r && r.ok()).length;
    
    expect(successCount).toBe(endpoints.length);
    console.log(`✅ TC-28 PASSED: ${successCount}/${endpoints.length} concurrent requests succeeded`);
  });
});