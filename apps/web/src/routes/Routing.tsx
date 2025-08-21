import React from 'react'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

// Compoents
import Error404 from '../components/pages/Error404'
import { LINKS } from '../data/links'
import { TABAYAD_SESSION } from '../utils/constant'
import { getCookie } from '../utils/cookie'
import LayoutRoute from './LayoutRoute'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoutes'
import { PrivateRoutes, PublicRoutes } from './RoutesPaths'

const Routing = () => {
  const auth = getCookie(TABAYAD_SESSION)
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              auth ? (
                <Navigate to={LINKS.DASHBOARD} replace />
              ) : (
                <Navigate to={LINKS.LOGIN} replace />
              )
            }
          />
          <Route element={<LayoutRoute />} path="/">
            {PublicRoutes.map(({ path, Component }, index) => (
              <Route element={<PublicRoute />} key={`public-${index}`}>
                <Route path={path} element={<Component />} />
              </Route>
            ))}

            {PrivateRoutes.map(({ path, Component }, index) => (
              <Route element={<PrivateRoute />} key={`private-${index}`}>
                <Route path={path} element={<Component />} />
              </Route>
            ))}

            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Routing
