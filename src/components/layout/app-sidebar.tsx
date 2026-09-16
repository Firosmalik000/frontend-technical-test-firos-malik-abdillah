import { Link } from '@tanstack/react-router';
import { BarChart3, Boxes, ClipboardList, FileCheck2, LayoutDashboard, PackageCheck, Search } from 'lucide-react';
import { useState } from 'react';

import { getCurrentRole } from '@/lib/role';
import { Input } from '../ui/input';

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
    icon: FileCheck2,
  },
  {
    label: 'Inventory',
    to: '/inventory',
    icon: Boxes,
  },
];

const extensionNavigation = [
  {
    label: 'Goods Receipt',
    to: '/goods-receipts',
    icon: PackageCheck,
  },
  {
    label: 'Reports',
    to: '/reports',
    icon: BarChart3,
  },
];

const AppSidebar = () => {
  const role = getCurrentRole();

  const [filter, setFilter] = useState('');

  const normalizedFilter = filter.trim().toLowerCase();

  const roleNavigation = role === 'APPROVER' ? navigation.filter((item) => item.to === '/purchase-requests') : navigation;

  const visibleNavigation = roleNavigation.filter((item) => item.label.toLowerCase().includes(normalizedFilter));

  const visibleExtensionNavigation = role === 'APPROVER' ? [] : extensionNavigation.filter((item) => item.label.toLowerCase().includes(normalizedFilter));

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col bg-[#043C86] text-white md:w-60">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center px-2 md:justify-start md:px-5">
        <p className="text-base font-semibold md:hidden">P</p>

        <div className="hidden md:block">
          <p className="text-base font-semibold tracking-tight">ProcureFlow</p>

          <p className="text-xs text-white/60">Procurement System</p>
        </div>
      </div>

      {/* Search */}
      <div className="hidden px-3 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

          <Input type="text" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search anything..." aria-label="Search navigation" className="h-9 w-full bg-white pl-9 pr-3 text-xs text-gray-900" />
        </div>
      </div>

      {/* Navigation area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Main */}
        <p className="hidden px-4 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-wide text-white/40 md:block">Main</p>

        <nav className="flex flex-col gap-1 p-2 md:px-3">
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

        {/* Extensions */}
        {visibleExtensionNavigation.length > 0 && (
          <>
            <p className="hidden px-4 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-wide text-white/40 md:block">Extensions</p>

            <nav className="flex flex-col gap-1 p-2 md:px-3">
              {visibleExtensionNavigation.map((item) => {
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
          </>
        )}

        {/* Empty search result */}
        {visibleNavigation.length === 0 && visibleExtensionNavigation.length === 0 && <p className="hidden px-4 py-3 text-xs text-white/50 md:block">Menu tidak ditemukan.</p>}
      </div>

      {/* Footer */}
      <div className="hidden border-t border-white/10 px-5 py-4 md:block">
        <p className="text-xs text-white/50">ProcureFlow v1.0</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
