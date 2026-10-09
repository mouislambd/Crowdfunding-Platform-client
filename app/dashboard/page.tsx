'use client';

import { useSession } from '../../lib/auth-client';

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard, {session.user.name}!</h1>
      <p className="text-gray-400">Role: <span className="capitalize">{session.user.role}</span></p>
    </div>
  );
}
