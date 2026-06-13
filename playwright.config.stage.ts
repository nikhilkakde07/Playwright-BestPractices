import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  //retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],

    [
      'html',
      {
        open: 'never'
      }
    ],

    ['allure-playwright'],

    [
      'playwright-html-reporter',
      {
        testFolder: 'tests',
        title: 'Playwright Best Practices Report',
        project: 'Playwright Best Practices',
        release: '1.0.0',
        testEnvironment: process.env.TEST_ENV || 'STAGE',
        embedAssets: true,
        embedAttachments: true,
        outputFolder: 'playwright-html-report',
        minifyAssets: true,
        startServer: false
      }
    ]
  ],

  use: {
    baseURL: 'https://automationexercise.com',

    headless: true,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure'
  },

  metadata: {
    framework: 'Playwright',
    language: 'TypeScript',
    author: 'Nikhil Kakde',
    project: 'Playwright Best Practices Framework'
  },

  projects: [
    {
      name: 'Google Chrome',

      use: {
        channel: 'chrome',

        viewport: null,

        launchOptions: {
          args: ['--start-maximized'],
          ignoreDefaultArgs: ['--window-size=1280,720']
        }
      }
    }

    // Uncomment below when needed

    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge'
    //   }
    // },

    // {
    //   name: 'Firefox',
    //   use: {
    //     ...devices['Desktop Firefox']
    //   }
    // },

    // {
    //   name: 'WebKit',
    //   use: {
    //     ...devices['Desktop Safari']
    //   }
    // }
  ]
});