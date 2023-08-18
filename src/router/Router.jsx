import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";
import ComponentLoading from "../components/LoadingComponents/ComponentLoadin";
import { Suspense } from "react";
import { authRoutes, routeList } from "./routes";

function Router() {
  console.log(routeList);
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {routeList.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              <Suspense fallback={<ComponentLoading />}>
                {route.element}
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        {authRoutes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              <Suspense fallback={<ComponentLoading />}>
                {route.element}
              </Suspense>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}

export default Router;
