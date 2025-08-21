import React from 'react'

// react-router-dom
import { Navigate, Outlet, useLocation } from 'react-router-dom'

// Data
import { LINKS } from '../data/links'
import { TABAYAD_SESSION } from '../utils/constant'
// Utils
import { getCookie } from '../utils/cookie'

const PublicRoute = () => {
  const location = useLocation()
  const auth = getCookie(TABAYAD_SESSION)

  return !auth ? <Outlet /> : <Navigate to={LINKS.DASHBOARD} state={{ from: location }} replace />
}

export default PublicRoute
