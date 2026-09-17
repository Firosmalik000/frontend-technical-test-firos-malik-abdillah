import { getCurrentRole, setRole, type UserRole } from '@/lib/role';
import { createContext, useContext, useState, type ReactNode } from 'react';

type RoleContextValue = {
  role: UserRole;
  changeRole: (role: UserRole) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setCurrentRole] = useState<UserRole>(() => getCurrentRole());

  const changeRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setRole(newRole);
  };
  return <RoleContext.Provider value={{ role, changeRole }}>{children}</RoleContext.Provider>;
}

// This hook intentionally shares the context module with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error('useRole must be used inside RoleProvider');
  }

  return context;
}
