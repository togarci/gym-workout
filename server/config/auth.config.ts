export interface ProtectedRoute {
  path: string;
  roles?: string[];
  exact?: boolean;
}

export const protectedRoutes: ProtectedRoute[] = [
  // Workout
  { path: '/api/workout/:id' },
  { path: '/api/workout/get' },
  { path: '/api/workout/register', roles: ['personal'] },
  { path: '/api/workout/update', roles: ['personal'] },

  // Exercise
  { path: '/api/exercise/:id' },
  { path: '/api/exercise/get' },
  { path: '/api/exercise/register', roles: ['personal'] },
  { path: '/api/exercise/update', roles: ['personal'] },

  // User
  { path: '/api/user/new', roles: ['personal'] },
  { path: '/api/user/update', roles: ['personal'] },
  { path: '/api/user/delete', roles: ['personal'] },
];
