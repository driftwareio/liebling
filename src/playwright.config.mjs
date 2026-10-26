import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: '../tests', testMatch: '*.spec.mjs', workers: 1,
  use: {baseURL: 'http://127.0.0.1:4173', launchOptions: process.env.CHROMIUM_EXECUTABLE ? {
    executablePath: process.env.CHROMIUM_EXECUTABLE, args: ['--no-sandbox', '--disable-dev-shm-usage']
  } : {}},
  webServer: {command: 'node ../tests/server.mjs', port: 4173}
});
