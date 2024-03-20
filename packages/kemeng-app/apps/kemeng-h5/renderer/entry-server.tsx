import { renderToString } from 'react-dom/server'
import Main from '../main'
/* __routerImportPlaceholder__ */

export function render(ssrData: unknown) {
	return renderToString(<Main>/* __routerPlaceholder__ */</Main>)
}

//<Main ssrData={ssrData} />
