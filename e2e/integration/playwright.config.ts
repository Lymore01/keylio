import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: '**/e2e/**/*.spec.ts',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
