export interface ProtectedRoute {
  path: string;
  roles?: string[];
  exact?: boolean;
}

export const protectedRoutes: ProtectedRoute[] = [
  // Workout
  { path: '/api/workout/:id' },
  { path: '/api/workout/get', exact: true },
  { path: '/api/workout/register', roles: ['admin'], exact: true },
  { path: '/api/workout/update', roles: ['admin'], exact: true },

  // Exercise
  { path: '/api/exercise/:id' },
  { path: '/api/exercise/get', exact: true },
  { path: '/api/exercise/register', roles: ['admin'], exact: true },
  { path: '/api/exercise/update', roles: ['admin'], exact: true },

  // User
  { path: '/api/user/register', roles: ['admin'], exact: true },
  { path: '/api/user/update', roles: ['admin'], exact: true },
  { path: '/api/user/delete', roles: ['admin'], exact: true },
];
