import { AsyncLocalStorage } from 'async_hooks'

declare global {
	var _asyncLocalStorage: AsyncLocalStorage<any>
}
export {}
