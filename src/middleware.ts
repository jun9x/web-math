import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const devRole = request.cookies.get("dev_user_role")?.value;

  // If Supabase credentials are placeholder or dev cookie exists
  const isPlaceholderEnv = env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (!isPlaceholderEnv) {
    try {
      const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              supabaseResponse = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const path = request.nextUrl.pathname;

      if (path.startsWith("/teacher") || path.startsWith("/student")) {
        if (!user && !devRole) {
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("redirect", path);
          return NextResponse.redirect(url);
        }

        let role = devRole || "student";
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile?.role) role = profile.role;
        }

        if (path.startsWith("/teacher") && role !== "teacher" && role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = "/student/dashboard";
          return NextResponse.redirect(url);
        }

        if (path.startsWith("/student") && role !== "student" && role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = "/teacher/dashboard";
          return NextResponse.redirect(url);
        }
      }

      if ((path === "/login" || path === "/register") && (user || devRole)) {
        let role = devRole || "student";
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile?.role) role = profile.role;
        }

        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = role === "teacher" || role === "admin" ? "/teacher/dashboard" : "/student/dashboard";
        return NextResponse.redirect(redirectUrl);
      }
    } catch {
      // Supabase connection error fallback to devRole
    }
  }

  const path = request.nextUrl.pathname;
  if ((path.startsWith("/teacher") || path.startsWith("/student")) && !devRole) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
