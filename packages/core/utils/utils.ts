import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = `${__dirname}/..`
const resolve = (p: string) => path.resolve(root, p)

export { root, __dirname, resolve }
