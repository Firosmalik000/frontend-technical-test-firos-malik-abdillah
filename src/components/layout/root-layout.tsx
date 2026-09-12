import { Outlet } from '@tanstack/react-router';
import AppSidebar from './app-sidebar';
import HeaderApp from './header-app';

export function RootLayout() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderApp />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
