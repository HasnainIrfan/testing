import Dashboard from '@/components/pages/Dashboard'
import Error401 from '@/components/pages/Error401'
import Error404 from '@/components/pages/Error404'
import Login from '@/components/pages/Login'
import { LINKS } from '@/data/links'
import type { RouteType } from '@/types/common'

export const PublicRoutes: RouteType[] = [
  {
    path: LINKS.LOGIN,
    Component: Login,
  },
]

export const PrivateRoutes: RouteType[] = [
  {
    path: LINKS.DASHBOARD,
    Component: Dashboard,
  },
]

export const OtherRoutes: RouteType[] = [
  {
    path: LINKS.ERROR_404,
    Component: Error404,
  },
  {
    path: LINKS.ERROR_401,
    Component: Error401,
  },
]
