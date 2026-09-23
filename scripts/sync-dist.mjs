import { cp, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.resolve(root, 'younoya-web', 'dist')
const target = path.resolve(root, 'dist')

if (target !== path.join(root, 'dist') || source !== path.join(root, 'younoya-web', 'dist')) {
  throw new Error('Build output paths resolved outside the intended workspace.')
}

if (!(await stat(path.join(source, 'index.html'))).isFile()) {
  throw new Error('The verified storefront build is missing its index.html.')
}

await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true })
console.log(`Synced clean production assets to ${target}`)
