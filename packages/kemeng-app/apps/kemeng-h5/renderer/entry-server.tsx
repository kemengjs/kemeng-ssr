import { renderToString } from 'react-dom/server'
import Main from '../main'
/* __routerImportPlaceholder__ */

import { virtualServerData } from 'virtual:serverData'

export function render(serverData: unknown, _context: any) {
	return renderToString(
		<Main serverData={serverData}>/* __routerPlaceholder__ */</Main>
	)
}

// 服务端数据注入 以灵活为主
export function getServerData(_context: any) {
	const func = virtualServerData[(_context.path as string).toLowerCase()]

	return func ? func(_context) : Promise.resolve({})
}
