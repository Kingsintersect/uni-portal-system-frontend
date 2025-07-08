
import { NextRequest, NextResponse } from "next/server";
import type { SessionData } from "@/types/auth";
import { Roles } from "@/config";
import { getSession } from "@/lib/session";
import { loginSessionKey } from "@/lib/definitions";

// 1. Specify protected and public routes
const publicRoutes = ["/auth/signin", "/auth/signup"];
const protectedRoutes = "/dashboard";
const studentRoutePrefix = "/dashboard/student";
const adminRoutePrefix = "/dashboard/admin";
const teacherRoutePrefix = "/dashboard/teacher";

// Helper function to get user's dashboard route based on role
const getUserDashboardRoute = (role: string) => {
  switch (role) {
    case Roles.ADMIN:
      return "admin";
    case Roles.TEACHER:
      return "teacher";
    case Roles.STUDENT:
      return "student";
    default:
      return "student"; // default fallback
  }
};

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = path.startsWith(protectedRoutes);
  const isStudentRoute = path.startsWith(studentRoutePrefix);
  const isAdminRoute = path.startsWith(adminRoutePrefix);
  const isTeacherRoute = path.startsWith(teacherRoutePrefix);

  const loginSession = (await getSession(loginSessionKey)) as SessionData;

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !loginSession?.user) {
    return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
  }

  // Redirect to appropriate dashboard if the user is authenticated and trying to access public routes
  if (isPublicRoute && loginSession?.user) {
    const userRole = loginSession.user.role?.toLowerCase() || "";
    const userRoute = getUserDashboardRoute(userRole);
    const redirectUrl = new URL(`/dashboard/${userRoute}`, req.url);
    
    if (req.nextUrl.pathname !== redirectUrl.pathname) {
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect users if they try to access routes not meant for their role
  if (loginSession?.user?.role) {
    const userRole = loginSession.user.role;
    const userDashboardRoute = getUserDashboardRoute(userRole);

    // Admin-only routes
    if (isAdminRoute && userRole !== Roles.ADMIN) {
      return NextResponse.redirect(new URL(`/dashboard/${userDashboardRoute}`, req.url));
    }

    // Teacher-only routes
    if (isTeacherRoute && userRole !== Roles.TEACHER) {
      return NextResponse.redirect(new URL(`/dashboard/${userDashboardRoute}`, req.url));
    }

    // Student-only routes
    if (isStudentRoute && userRole !== Roles.STUDENT) {
      return NextResponse.redirect(new URL(`/dashboard/${userDashboardRoute}`, req.url));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images/.*|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)",
  ],
};




// import { NextRequest, NextResponse } from "next/server";
// import type { SessionData } from "@/types/auth";
// import { Roles } from "@/config";
// import { getSession } from "@/lib/session";
// import { loginSessionKey } from "@/lib/definitions";

// // 1. Specify protected and public routes
// const publicRoutes = ["/auth/signin", "/auth/signup"];
// const protectedRoutes = "/dashboard";
// const studentRoutePrefix = "/dashboard/student";
// const adminRoutePrefix = "/dashboard/admin";
// const teacherRoutePrefix = "/dashboard/teacher";

// export default async function middleware(req: NextRequest) {
// 	// 2. Check if the current route is protected or public
// 	const path = req.nextUrl.pathname;
// 	const isPublicRoute = publicRoutes.includes(path);
// 	const isProtectedRoute = path.startsWith(protectedRoutes);
// 	const isStudentRoute = path.startsWith(studentRoutePrefix);
// 	const isAdminRoute = path.startsWith(adminRoutePrefix);
// 	const isTeacherRoute = path.startsWith(teacherRoutePrefix);

// 	const loginSession = (await getSession(loginSessionKey)) as SessionData;
// 	console.log('userRole====================================', loginSession.user.role)

// 	// Redirect to /login if the user is not authenticated
// 	if (isProtectedRoute && !loginSession?.user) {
// 		return NextResponse.redirect(new URL("/auth/signin", req.nextUrl));
// 	}

// 	// Redirect to /dashboard if the user is authenticated
// 	if (
// 		isPublicRoute &&
// 		loginSession?.user &&
// 		!req.nextUrl.pathname.startsWith("/dashboard")
// 	) {
// 		const userRole =
// 			typeof loginSession.user.role === "string"
// 				? loginSession.user.role.toLowerCase()
// 				: "";
// 		const userRoute = userRole === Roles.STUDENT ? "student" : "admin";
// 		const redirectUrl = new URL(`/dashboard/${userRoute}`, req.url);
// 		if (req.nextUrl.pathname !== redirectUrl.pathname) {
// 			return NextResponse.redirect(redirectUrl);
// 		}
// 	}

// 	// Prevent STUDENTs from accessing ADMIN routes
// 	if (isAdminRoute && loginSession?.user?.role !== Roles.ADMIN) {
// 		return NextResponse.redirect(new URL("/dashboard/student", req.url));
// 	}

// 	// Prevent ADMINs from accessing STUDENT routes
// 	if (isStudentRoute && loginSession?.user?.role !== Roles.STUDENT) {
// 		return NextResponse.redirect(new URL("/dashboard/admin", req.url));
// 	}

// 	return NextResponse.next();
// }

// // Routes Middleware should not run on
// export const config = {
// 	matcher: [
// 		"/((?!api|_next/static|_next/image|images/.*|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)",
// 	],
// };
