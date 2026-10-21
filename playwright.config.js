import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: 'output/playwright/results',
  reporter: [['list'], ['html', { outputFolder: 'output/playwright/report', open: 'never' }]],
  use: { baseURL: process.env.BASE_URL || 'http://127.0.0.1:4332', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'iphone', use: { ...devices['iPhone 13'] } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    { name: 'small-phone', use: { ...devices['iPhone SE'], viewport: { width: 320, height: 568 } } },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4332',
    url: 'http://127.0.0.1:4332', reuseExistingServer: false,
  },
});
