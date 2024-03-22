// 入口main 所有页面都会经过该组件
import { Provider } from 'jotai'
import { ReactNode } from 'react'

export async function onBeforeRender() {
	return {
		main: '666',
		zxczxc: 'zxcxcasd'
	}
}

export default function Main({
	children,
	serverData = {}
}: {
	children?: ReactNode
	serverData?: unknown
}) {
	console.log('serverData', serverData)

	return <Provider>{children}</Provider>
}
