import { Link } from '@tanstack/react-router';
import { Boxes, ClipboardList, LayoutDashboard, ShoppingCart } from 'lucide-react';

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
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-[#043C86] text-white ">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <div>
          <p className="text-base font-semibold tracking-tight">ProcureFlow</p>
          <p className="text-xs text-white/60">Procurement System</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              activeProps={{
                className: 'bg-white/15 text-white',
              }}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-xs text-white/50">ProcureFlow v1.0</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
