import { renderToString } from 'react-dom/server'
import { ServerContext } from '@kemengjs/ssr-utils'
import Main from '../main'
/* __routerImportPlaceholder__ */

import { virtualServerData } from 'virtual:serverData'

export function render(_context: ServerContext) {
	return renderToString(<Main>/* __routerPlaceholder__ */</Main>)
}

// 服务端数据注入 以灵活为主
export function getServerData(_context: ServerContext) {
	const func = virtualServerData[(_context.path as string).toLowerCase()]

	return func ? func(_context) : Promise.resolve({})
}
