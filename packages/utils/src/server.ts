import { IncomingHttpHeaders } from 'http'
import { ParsedUrlQuery } from 'querystring'
import { safeJsonParse } from '../src/json'

export type ServerContent = {
	headers: IncomingHttpHeaders
	query: ParsedUrlQuery
	cookies: string
	path: string
}

export const isServerCompile = (import.meta as any).env.SSR as boolean

export const isServer = typeof window === 'undefined'

export type LocalStore = {
	context: ServerContent
	serverData: any
}

let SERVER_STORE: LocalStore = null

export const getLocalStore = () => {
	if (isServerCompile) {
		const store: LocalStore = global._asyncLocalStorage.getStore()
		return store
	} else {
		if (!SERVER_STORE) {
			SERVER_STORE = safeJsonParse(window.__SERVER_STORE__ as string, {
				context: {},
				serverData: {}
			})
		}

		return SERVER_STORE
	}
}

export const getContexts = () => {
	return getLocalStore().context
}

export const getServerData = <T = any>() => {
	return getLocalStore().serverData as T
}

export const getHeaders = () => {
	return getContexts()?.headers
}

export const getQuerys = <
	T extends Record<string, string> = Record<string, string>
>() => {
	return getContexts()?.query as T
}

export const getCookies = () => {
	return getContexts()?.cookies
}
