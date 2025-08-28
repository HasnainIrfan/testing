import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Error404 from '@/components/pages/Error404'

import LayoutRoute from './LayoutRoute'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoutes'
import { PrivateRoutes, PublicRoutes } from './RoutesPaths'

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
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
