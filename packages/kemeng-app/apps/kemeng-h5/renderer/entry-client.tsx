// 默认使用routerPlaceholder生成对应路由模版 不使用框架提供路由可以移除 自已定义路由
// 注：路由采用react-router纯静态路由 无任何绑定
import { hydrateRoot } from 'react-dom/client'
import Main from '../main'
import { safeJsonParse } from '@kemeng-ssr/utils'
/* __routerImportPlaceholder__ */

hydrateRoot(
	document.getElementById('app')!,
	<Main serverData={safeJsonParse(window.__SERVER_DATA__)}>
		/* __routerPlaceholder__ */
	</Main>
)
