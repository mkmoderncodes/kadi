import { NextRequest, NextResponse } from "next/server";

// Root domain(s) that should NOT be treated as a business subdomain
// (your marketing site, www, localhost for dev, the app's own preview URL).
// Replace "kadi.app" with your real domain once you buy one.
const ROOT_DOMAINS = ["kadi.app", "www.kadi.app", "localhost:3000"];

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  // --- Subdomain routing: business-slug.kadi.app -> /b/business-slug ---
  // Custom domains (mybusiness.com) are handled the same way once they're
  // CNAME'd to this app and verified in the `custom_domains` table — look
  // up the domain -> business in that same rewritten route instead of by
  // subdomain. For now this handles the *.kadi.app case, which covers
  // every business by default (custom domain is a paid add-on).
  if (!ROOT_DOMAINS.includes(host) && !pathname.startsWith("/b/") && !pathname.startsWith("/api")) {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "kadi") {
      return NextResponse.rewrite(new URL(`/b/${subdomain}${pathname}`, req.url));
    }
  }

  // --- Dashboard auth gate ---
  if (pathname.startsWith("/dashboard")) {
    const hasSession = req.cookies.has("ghsaas_session");
    if (!hasSession) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except static assets/API internals, so subdomain
  // rewriting applies site-wide while dashboard matching still works.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
