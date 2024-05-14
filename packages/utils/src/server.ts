import { IncomingHttpHeaders } from 'http'
import { ParsedUrlQuery } from 'querystring'
import { safeJsonParse } from '../src/json'

export type ServerContext = {
	headers: IncomingHttpHeaders
	query: ParsedUrlQuery
	cookies: string
	path: string
}

export const isServerCompile = __SSR_BUILD__

export const isServer = typeof window === 'undefined'

export type LocalStore = {
	context: ServerContext
	serverData: any
}

let SERVER_STORE: LocalStore = null

export const getLocalStore = () => {
	if (isServerCompile) {
		const store: LocalStore = global._asyncLocalStorage.getStore()
		return store
	} else {
		if (!SERVER_STORE) {
			SERVER_STORE = safeJsonParse(window.__SERVER_STORE__, {
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

export const getCookieByName = (name: string) => {
	let cookie = ''.concat(getCookies())
	let indexStart = cookie.indexOf(''.concat(name, '='))
	if (indexStart === -1) {
		return ''
	}
	let indexEnd = cookie.indexOf(';', indexStart)
	if (indexEnd === -1) {
		indexEnd = cookie.length
	}
	return decodeURIComponent(
		cookie.substring(indexStart + name.length + 1, indexEnd)
	)
}
