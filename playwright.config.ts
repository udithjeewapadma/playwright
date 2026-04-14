import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Folder where test files are located
  testDir: './tests',
  
  // Maximum time one test can run for
  timeout: 60000,
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail build on CI if test.only is used
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests
  retries: 1,
  
  // Number of parallel workers
  workers: 4,
  
  // Reporters for output
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list'],
    ['junit', { outputFile: 'junit.xml' }]
  ],
  
  // Shared settings for all tests
  use: {
    baseURL: 'https://www.pixelssuite.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  // Configure projects for 2 browsers only
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 }
    //   },
    // },
  ],
  
  // Output folder for test results
  outputDir: './test-results',
});