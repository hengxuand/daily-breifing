#!/usr/bin/env node

/**
 * Build script to generate only yesterday's pages
 * Usage: node scripts/build-yesterday.js
 */

import { execSync } from 'node:child_process'
import { writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = join(__dirname, '..', 'nuxt.config.ts')

// Calculate yesterday's date
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const dateStr = yesterday.toISOString().split('T')[0]

console.log(`🔨 Building pages for ${dateStr}...`)

// Backup original config
const originalConfig = readFileSync(configPath, 'utf-8')

// Create temporary config that only builds yesterday
const tempConfig = originalConfig.replace(
  /for \(let i = 1; i <= 7; i\+\+\) \{[\s\S]*?\}/,
  `// Build only yesterday
        const d = new Date()
        d.setDate(d.getDate() - 1)
        const dateStr = d.toISOString().split('T')[0]
        routes.push(\`/zh/\${dateStr}\`, \`/en/\${dateStr}\`)`
)

try {
  // Write temporary config
  writeFileSync(configPath, tempConfig)
  
  // Run build
  console.log('Running nuxt build...')
  execSync('npm run build', { stdio: 'inherit' })
  
  console.log(`✅ Successfully built pages for ${dateStr}`)
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
} finally {
  // Restore original config
  writeFileSync(configPath, originalConfig)
  console.log('✅ Config restored')
}
