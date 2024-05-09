export function removeSlash(str: string) {
	// 移除开头的斜杠
	str = str.replace(/^\/+/, '')

	// 移除结尾的斜杠
	str = str.replace(/\/+$/, '')

	return str
}
