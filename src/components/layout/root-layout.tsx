import { Outlet } from '@tanstack/react-router';
import AppSidebar from './app-sidebar';
import HeaderApp from './header-app';

export function RootLayout() {
  return (
    <div className="flex min-h-screen bg-white  ">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderApp />

        <main className="p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
