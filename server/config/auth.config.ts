export interface ProtectedRoute {
  path: string;
  roles?: string[];
  exact?: boolean;
}

export const protectedRoutes: ProtectedRoute[] = [
  { path: '/api/workout', roles: ['admin', 'cliente', 'personal'] },
  { path: '/api/user/register', roles: ['admin'], exact: true },
];
