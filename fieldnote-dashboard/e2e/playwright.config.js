const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Spins up both servers automatically so `npx playwright test` just works
  webServer: [
    {
      command: 'node ../backend/server.js',
      port: 4000,
      reuseExistingServer: !process.env.CI,
      timeout: 10_000,
    },
    {
      command: 'npm run dev -- --port 5173',
      cwd: '../frontend',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 10_000,
    },
  ],
});
