export type UserRole = 'USER' | 'APPROVER';
export const getCurrentRole = () => {
  const role = localStorage.getItem('role');
  if (role === 'APPROVER') {
    return 'APPROVER';
  }
  return 'USER';
};

export function setRole(role: UserRole) {
  localStorage.setItem('role', role);
  window.location.reload();
}
