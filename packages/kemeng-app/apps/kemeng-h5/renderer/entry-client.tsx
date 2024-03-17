// 默认使用routerPlaceholder生成对应路由模版 不使用框架提供路由可以移除 自已定义路由
// 注：路由采用react-router纯静态路由 无任何绑定
import { hydrateRoot } from 'react-dom/client'
import Main from '../main'
import { routerImportPlaceholder, routerPlaceholder } from '@/zan/placeholder'
routerImportPlaceholder()

hydrateRoot(
	document.getElementById('app')!,

	<Main>{routerPlaceholder()}</Main>
)

// <Main ssrData={safeJsonParse(window.__SSR_DATA__)} />
// import { safeJsonParse } from '../zan/utils'

//import { About } from '@/apps/kemeng-h5/pages/About/About.page'
//<About />
