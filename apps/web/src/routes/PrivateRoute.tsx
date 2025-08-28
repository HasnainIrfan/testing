import { Navigate, Outlet, useLocation } from 'react-router-dom'

import DashboardLayout from '@/components/organisms/DashboardLayout'
import { LINKS } from '@/data/links'
import { SESSION } from '@/utils/constant'
import { getCookie } from '@/utils/cookie'

const PrivateRoute = () => {
  const location = useLocation()
  const auth = getCookie(SESSION)

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )

  // TODO: Add authentication when login is implemented

  return auth ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to={LINKS.LOGIN} state={{ from: location }} replace />
  )
}

export default PrivateRoute
