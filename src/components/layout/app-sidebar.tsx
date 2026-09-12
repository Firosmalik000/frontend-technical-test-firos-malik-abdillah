import { Link } from '@tanstack/react-router';
import { Boxes, ClipboardList, LayoutDashboard, ShoppingCart } from 'lucide-react';

const navigation = [
  {
    label: 'Dashboard',
    to: '/',
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
    <aside className="w-64 bg-gray-800 text-white ">
      <div className="flex h-16 items-center border-r px-6">
        <span className="text-lg font-semibold">ProcureFlow</span>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center text-muted-foregroundpx-3 py-2 gap-3 text-sm hover:bg-muted hover:text-foreground"
              activeProps={{
                className: 'text-foreground bg-muted font-medium',
              }}
            >
              {' '}
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AppSidebar;
