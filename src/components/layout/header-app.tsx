import { useNavigate, useRouterState } from '@tanstack/react-router';

import type { UserRole } from '@/lib/role';
import { useRole } from '@/context/role-context';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const appPage = (pathname: string) => {
  if (pathname === '/') {
    return 'Dashboard';
  }

  if (pathname.startsWith('/purchase-requests')) {
    return 'Purchase Requests';
  }

  if (pathname.startsWith('/purchase-orders')) {
    return 'Purchase Orders';
  }

  if (pathname.startsWith('/inventory')) {
    return 'Inventory';
  }

  if (pathname.startsWith('/goods-receipts')) {
    return 'Goods Receipt';
  }

  if (pathname.startsWith('/reports')) {
    return 'Reports';
  }

  return 'ProcureFlow';
};

const HeaderApp = () => {
  const { role, changeRole } = useRole();

  const navigate = useNavigate();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const pageTitle = appPage(pathname);

  const handleRoleChange = (value: string) => {
    const newRole = value as UserRole;

    changeRole(newRole);

    if (newRole === 'APPROVER') {
      navigate({
        to: '/purchase-requests',
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-3 sm:px-6">
      <div className="hidden sm:block">
        <p className="text-sm font-bold text-foreground">{pageTitle.toUpperCase()}</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-3">
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="h-8 w-28 sm:w-32">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="USER">User</SelectItem>

            <SelectItem value="APPROVER">Approver</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default HeaderApp;
