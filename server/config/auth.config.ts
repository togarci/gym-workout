export interface ProtectedRoute {
  path: string;
  roles?: string[];
  exact?: boolean;
}

export const protectedRoutes: ProtectedRoute[] = [
  // Workout
  { path: '/api/workout/:id' },
  { path: '/api/workout/get' },
  { path: '/api/workout/register', roles: ['admin'] },
  { path: '/api/workout/update', roles: ['admin'] },

  // Exercise
  { path: '/api/exercise/:id' },
  { path: '/api/exercise/get' },
  { path: '/api/exercise/register', roles: ['admin'] },
  { path: '/api/exercise/update', roles: ['admin'] },

  // User
  { path: '/api/user/register', roles: ['admin'] },
  { path: '/api/user/update', roles: ['admin'] },
  { path: '/api/user/delete', roles: ['admin'] },
];
