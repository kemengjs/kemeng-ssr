import fs from 'node:fs'
import { workspaceResolve } from '../utils/utils'

export let templateMap: Record<string, string> = {}

export type RouteItem = {
	template: string
	render: any
	getServerData: any
}

export type RoutesMap = Record<string, RouteItem>

export let routesMap: RoutesMap = {}

export const initRoutesMap = async () => {
	const appsFiles = fs.readdirSync(workspaceResolve('./apps'))

	for (const app of appsFiles) {
		const template = fs.readFileSync(
			workspaceResolve(`./apps/${app}/dist/client/index.html`),
			'utf8'
		)
		const entryModule = await import(
			workspaceResolve(`./apps/${app}/dist/server/entry-server.mjs`)
		)
		const { render, getServerData } = entryModule

		routesMap[app] = {
			template,
			render,
			getServerData
		}
	}
}
