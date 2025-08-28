import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { LINKS } from '@/data/links'
import { SESSION } from '@/utils/constant'
import { getCookie } from '@/utils/cookie'

const PublicRoute = () => {
  const location = useLocation()
  const auth = getCookie(SESSION)

  return <Outlet />

  // TODO: Add authentication when login is implemented

  return !auth ? <Outlet /> : <Navigate to={LINKS.DASHBOARD} state={{ from: location }} replace />
}

export default PublicRoute
