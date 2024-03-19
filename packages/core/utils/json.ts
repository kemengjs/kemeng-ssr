import { logger } from './log'

export function safeJsonParse<T>(jsonStr: string, defaultValue = {}) {
	if (!jsonStr) {
		return defaultValue as T
	}
	if (typeof jsonStr !== 'string') {
		return jsonStr
	}
	try {
		return (JSON.parse(jsonStr) || defaultValue) as T
	} catch (error) {
		logger.warn(error, jsonStr)
		return defaultValue as T
	}
}
