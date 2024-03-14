import { hydrateRoot } from 'react-dom/client'
import { Provider } from 'jotai'

hydrateRoot(document.getElementById('app')!, <Provider>{/* Main */}</Provider>)

// <Main ssrData={safeJsonParse(window.__SSR_DATA__)} />
// import { safeJsonParse } from '../zan/utils'
