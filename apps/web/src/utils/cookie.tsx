import Cookies from 'js-cookie'

import type { Nullable } from '@/types/common'
import type { CookieName, CookieValue } from '@/types/cookieTypes'

const setCookie = (name: CookieName, value: CookieValue): void => {
  Cookies.set(name, value, { secure: true })
}

const getCookie = (name: CookieName): Nullable<string | undefined> => {
  return Cookies.get(name)
}

// Function to remove a cookie
const removeCookie = (name: CookieName): void => {
  Cookies.remove(name)
}

export { getCookie, removeCookie, setCookie }
