import { getHeaders } from './server'

export const getUa = () => getHeaders()['user-agent'] || ''

export const isAndroid = () => /android|adr|linux/gi.test(getUa())
export const isiOS = () => /iPad|iPhone|iPod/.test(getUa())
