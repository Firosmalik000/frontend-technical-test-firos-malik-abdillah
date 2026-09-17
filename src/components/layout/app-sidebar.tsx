import { Link } from '@tanstack/react-router';
import { BarChart3, Boxes, ClipboardList, FileCheck2, LayoutDashboard, PackageCheck, Search, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Input } from '../ui/input';

import { getPurchaseRequests } from '@/api/purchase-requests';
import { useRole } from '@/context/role-context';

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

const navigationItemClass =
  'flex min-h-10 items-center justify-center rounded-md px-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:justify-start md:gap-3 md:px-3';

const AppSidebar = () => {
  const { role } = useRole();
  const [filter, setFilter] = useState('');

  const { data: purchaseRequestCount = 0 } = useQuery({
    queryKey: ['purchase-requests'],
    queryFn: getPurchaseRequests,
    select: (data) => data.filter((request) => request.status !== 'APPROVED').length,
  });

  const normalizedFilter = filter.trim().toLowerCase();

  const roleNavigation = role === 'APPROVER' ? navigation.filter((item) => item.to === '/purchase-requests') : navigation;

  const visibleNavigation = roleNavigation.filter((item) => item.label.toLowerCase().includes(normalizedFilter));

  const visibleExtensionNavigation = role === 'APPROVER' ? [] : extensionNavigation.filter((item) => item.label.toLowerCase().includes(normalizedFilter));

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:w-60">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-white to-primary text-xs font-semibold text-primary-foreground">PF</div>

          <p className="hidden truncate text-base font-semibold tracking-tight text-foreground md:block">ProcureFlow</p>
        </div>
      </div>

      {/* Search */}
      <div className="hidden px-4 pt-4 md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sidebar-muted" />

          <Input
            type="text"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Search anything..."
            aria-label="Search navigation"
            className="h-9 border-sidebar-border bg-card pl-9 pr-3 text-xs text-foreground shadow-none placeholder:text-sidebar-muted"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Main */}
        <p className="hidden px-5 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-sidebar-muted md:block">Main</p>

        <nav className="flex flex-col gap-1 px-2 md:px-3">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;

            const isPurchaseRequest = item.to === '/purchase-requests';

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                activeOptions={item.to === '/' ? { exact: true } : undefined}
                className={navigationItemClass}
                activeProps={{
                  className: 'bg-sidebar-accent text-sidebar-accent-foreground',
                }}
              >
                <Icon className="size-4 shrink-0" />

                <div className="hidden min-w-0 flex-1 items-center justify-between gap-2 md:flex">
                  <span className="truncate">{item.label}</span>

                  {isPurchaseRequest && purchaseRequestCount > 0 && (
                    <span className="flex min-w-6 shrink-0 items-center justify-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold leading-4 text-red-500">{purchaseRequestCount}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Extensions */}
        {visibleExtensionNavigation.length > 0 && (
          <>
            <p className="hidden px-5 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-sidebar-muted md:block">Extensions</p>

            <nav className="flex flex-col gap-1 px-2 md:px-3">
              {visibleExtensionNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-label={item.label}
                    className={navigationItemClass}
                    activeProps={{
                      className: 'bg-sidebar-accent text-sidebar-accent-foreground',
                    }}
                  >
                    <Icon className="size-4 shrink-0" />

                    <span className="hidden truncate md:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        )}

        {/* Empty result */}
        {visibleNavigation.length === 0 && visibleExtensionNavigation.length === 0 && <p className="hidden px-5 py-4 text-xs text-sidebar-muted md:block">Menu tidak ditemukan.</p>}
      </div>

      {/* Bottom */}
      <div className="hidden border-t border-sidebar-border md:block">
        {/* Settings - visual only */}
        <div className="px-3 py-3">
          <div className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground">
            <Settings className="size-4 shrink-0" />

            <span>Settings</span>
          </div>
        </div>

        {/* User */}
        <div className="border-t border-sidebar-border px-5 py-2">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">JD</div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">John Doe</p>

              <p className="mt-0.5 truncate text-[11px] text-sidebar-muted">Procurement System</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
