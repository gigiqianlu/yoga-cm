import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match public pages only — skip /api, /admin, /_next, static files
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
