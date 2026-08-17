import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

const SPREADSHEET_ID = '1jDCXIWrkTjDgxRX-2zddojWoUnD3TKYTFWdQz2DD6zc'
const OUT_DIR = join(ROOT, 'public', 'data')

// Add more sheets here as we get their gid tab IDs.
const SHEETS = [
  { name: 'roster', gid: '1946443746' },
  // { name: 'medals', gid: '...' },
]

async function download(name, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`
  const out = join(OUT_DIR, `${name}.csv`)
  const cmd = process.platform === 'win32' ? 'curl.exe' : 'curl'
  const args = ['-L', '-o', out, url]

  return new Promise((resolve, reject) => {
    console.log(`Downloading ${name} from ${url}...`)
    const child = spawn(cmd, args, { stdio: 'inherit' })
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Saved ${name}.csv`)
        resolve()
      } else {
        reject(new Error(`Download of ${name} failed with code ${code}`))
      }
    })
  })
}

await mkdir(OUT_DIR, { recursive: true })
for (const { name, gid } of SHEETS) {
  await download(name, gid)
}
console.log('All sheets synced.')
