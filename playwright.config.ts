import { defineConfig, devices } from '@playwright/test'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const port = 3199
const baseURL = `http://127.0.0.1:${port}`
const contentDatabase = join(tmpdir(), `lva-tldr-content-e2e-${process.pid}.sqlite`)

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `pnpm dev --host 127.0.0.1 --port ${port}`,
    env: { NUXT_CONTENT_DB_PATH: contentDatabase },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
