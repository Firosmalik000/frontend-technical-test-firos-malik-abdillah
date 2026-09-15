import { Link } from '@tanstack/react-router';
import { Boxes, ClipboardList, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { getCurrentRole } from '@/lib/role';
const navigation = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Purchase Requests',
    to: '/purchase-requests',
    icon: ClipboardList,
  },
  {
    label: 'Purchase Orders',
    to: '/purchase-orders',
    icon: ShoppingCart,
  },
  {
    label: 'Inventory',
    to: '/inventory',
    icon: Boxes,
  },
];
const AppSidebar = () => {
  const role = getCurrentRole();

  const visibleNavigation = role === 'APPROVER' ? navigation.filter((item) => item.to === '/purchase-requests') : navigation;

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col bg-[#043C86] text-white md:w-60">
      <div className="flex h-16 items-center justify-center border-b border-white/10 px-2 md:justify-start md:px-5">
        <p className="text-base font-semibold md:hidden">P</p>

        <div className="hidden md:block">
          <p className="text-base font-semibold tracking-tight">ProcureFlow</p>

          <p className="text-xs text-white/60">Procurement System</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2 md:p-3">
        {visibleNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className="flex items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white md:justify-start md:gap-3 md:px-3"
              activeProps={{
                className: 'bg-white/15 text-white',
              }}
            >
              <Icon className="size-4 shrink-0" />

              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-white/10 px-5 py-4 md:block">
        <p className="text-xs text-white/50">ProcureFlow v1.0</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
