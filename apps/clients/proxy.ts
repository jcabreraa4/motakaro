import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isOrgFreeRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/org-selection(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth({ treatPendingAsSignedOut: false });

  if (userId && !orgId && !isOrgFreeRoute(req)) {
    return NextResponse.redirect(new URL('/org-selection', req.url));
  }

  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
