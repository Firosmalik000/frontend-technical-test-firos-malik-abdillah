import { type UserRole } from '@/lib/role';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRole } from '@/context/role-context';
import { useNavigate, useRouterState } from '@tanstack/react-router';

const appPage = (pathName: string) => {
  if (pathName === '/dashboard') {
    return 'Dashboard';
  } else if (pathName.startsWith('/purchase-requests')) {
    return 'Purchase Requests';
  } else if (pathName.startsWith('/purchase-orders')) {
    return 'Purchase Orders';
  } else if (pathName.startsWith('/inventory')) {
    return 'Inventories';
  } else if (pathName.startsWith('/goods-receipts')) {
    return 'Goods Receipts';
  } else if (pathName.startsWith('/reports')) {
    return 'Reports';
  } else {
    return 'ProcureFlow';
  }
};

const HeaderApp = () => {
  const { role, changeRole } = useRole();

  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const pageTitle = appPage(pathname);
  if (role === 'APPROVER') {
    navigate({ to: '/purchase-requests' });
  }
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E6E9ED] bg-white px-3 sm:px-6">
      <div className="hidden sm:block">
        <p className="text-sm  text-foreground font-bold">{pageTitle.toUpperCase()}</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-3">
        <div className="leading-tight">
          <Select value={role} onValueChange={(value) => changeRole(value as UserRole)}>
            <SelectTrigger className="h-8 w-28 sm:w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="USER">User</SelectItem>

              <SelectItem value="APPROVER">Approver</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default HeaderApp;
