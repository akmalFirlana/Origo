import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/tasks(.*)',
  '/habits(.*)',
  '/calendar(.*)',
  '/activity(.*)',
  '/settings(.*)',
  '/api/tasks(.*)',
  '/api/habits(.*)',
  '/api/events(.*)',
  '/api/activity(.*)',
  '/api/habit-logs(.*)',
  '/api/profiles(.*)',
  '/api/tags(.*)',
]);

export default clerkMiddleware((req) => {
  if (isProtectedRoute(req)) {
    req.auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};