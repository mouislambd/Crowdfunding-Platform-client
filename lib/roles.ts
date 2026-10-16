export function normalizeRole(role?: string): string {
  if (!role) return '';
  return role.trim().toLowerCase();
}

export function homePathFor(role?: string): string {
  const norm = normalizeRole(role);
  if (norm === 'admin') return '/dashboard/admin-home';
  if (norm === 'builder') return '/dashboard/builder-home';
  if (norm === 'supporter') return '/dashboard/supporter-home';
  return '/dashboard/supporter-home';
}
