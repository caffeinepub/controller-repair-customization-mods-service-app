import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import ServiceRequestPage from './pages/ServiceRequestPage';
import ServiceRequestConfirmationPage from './pages/ServiceRequestConfirmationPage';
import StatusLookupPage from './pages/StatusLookupPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminRequestDetailPage from './pages/admin/AdminRequestDetailPage';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import AdminRouteGuard from './components/auth/AdminRouteGuard';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ProfileSetupDialog />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const serviceRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/service-request',
  component: ServiceRequestPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation/$requestId',
  component: ServiceRequestConfirmationPage,
});

const statusLookupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/status',
  component: StatusLookupPage,
});

const adminRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminRequestsPage />
    </AdminRouteGuard>
  ),
});

const adminRequestDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/request/$requestId',
  component: () => (
    <AdminRouteGuard>
      <AdminRequestDetailPage />
    </AdminRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  serviceRequestRoute,
  confirmationRoute,
  statusLookupRoute,
  adminRequestsRoute,
  adminRequestDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
