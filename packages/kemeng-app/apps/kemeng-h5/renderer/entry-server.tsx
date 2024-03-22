import { renderToString } from 'react-dom/server'
import Main, { onBeforeRender } from '../main'
/* __routerImportPlaceholder__ */

export function render(serverData: unknown, _context: any) {
	return renderToString(
		<Main serverData={serverData}>/* __routerPlaceholder__ */</Main>
	)
}

// 服务端数据注入 以灵活为主
export async function getServerData() {
	return Promise.all([onBeforeRender()])
}
