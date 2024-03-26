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
export async function getServerData(_context: any) {
	return await virtualServerData(_context)
}

export const serverDataObj = {
	id: Promise.all([])
}
