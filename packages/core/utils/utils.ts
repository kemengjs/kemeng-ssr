import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { searchForWorkspaceRoot } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = `${__dirname}/..`
const resolve = (p: string) => path.resolve(root, p)

const workspaceRoot = searchForWorkspaceRoot(process.cwd())
const workspaceResolve = (p: string) => path.resolve(workspaceRoot, p)

const curAppResolve = (p: string) => path.resolve(process.cwd(), p)

const packageName = process.env.npm_package_name || ''
const appName = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)

const serverEntryFilePath = curAppResolve('./renderer/entry-server.tsx')
const clientEntryFilePath = curAppResolve('./renderer/entry-client.tsx')

export {
	root,
	__dirname,
	resolve,
	workspaceResolve,
	workspaceRoot,
	serverEntryFilePath,
	clientEntryFilePath,
	packageName,
	appName
}
