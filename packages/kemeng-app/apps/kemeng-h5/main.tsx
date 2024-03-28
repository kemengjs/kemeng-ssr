// 入口main 所有页面都会经过该组件
import { Provider } from 'jotai'
import { ReactNode } from 'react'

export default function Main({ children }: { children?: ReactNode }) {
	return <Provider>{children}</Provider>
}
