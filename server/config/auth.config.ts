export interface ProtectedRoute {
  path: string;
  roles?: string[];
  exact?: boolean;
}

export const protectedRoutes: ProtectedRoute[] = [
  { path: '/api/workout', exact: true },
  { path: '/api/user/register', roles: ['admin'], exact: true },
];
