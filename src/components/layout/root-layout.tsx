import { Link, Outlet } from '@tanstack/react-router';

export function RootLayout() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">ProcureFlow</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
