// import { signInSchema } from "@/schemas/auth-schemas";
// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { Roles } from "./config";
// import { validateUser } from "./app/actions/auth-actions";
// // import { refreshAccessToken } from "@/lib/auth/refreshToken";

// export const { handlers, signIn, signOut, auth } = NextAuth({
// 	providers: [
// 		Credentials({
// 			credentials: {
// 				email: { label: "Email", type: "email" },
// 				password: { label: "Password", type: "password" },
// 			},
// 			authorize: async (credentials) => {
// 				try {
// 					const parsed = signInSchema.safeParse(credentials);
// 					if (!parsed.success) {
// 						console.error(
// 							"Validation error:",
// 							parsed.error.flatten().fieldErrors
// 						);
// 						return null;
// 					}

// 					const { email, password } = parsed.data;
// 					const res = await validateUser({ email, password });

// 					if (!res || !("user" in res && res.user) || !("access_token" in res && res.access_token)) {
// 						console.error("Invalid email or password or missing user fields");
// 						return null;
// 					}
// 					const user = {
// 						...res.user,
// 						expires_in: res.expires_in,
// 						access_token: res.access_token,
// 						id: String(res.user.id),
// 					};
// 					return user;
// 				} catch (error) {
// 					console.error("Authorize error:", error);
// 					return null;
// 				}
// 			},
// 		}),
// 	],
// 	callbacks: {
// 		async jwt({ token, user }) {
// 			if (user) {
// 				token.id = user.id;
// 				token.role = user.role;
// 				token.access_token = user.access_token;
// 				token.expires_in = user.expires_in;
// 				token.name = user.first_name;
// 				token.email = user.email;
// 			}
// 			// If token has expired, refresh it
// 			// const expiresAt = token?.exp ? token.exp * 1000 : 0;
// 			// const isExpired = Date.now() >= expiresAt;

// 			// if (isExpired) {
// 			// 	return await refreshAccessToken(token);
// 			// }
// 			return token;
// 		},
// 		async session({ session, token }) {
// 			if (token && session.user) {
// 				session.user.id = token.id as string;
// 				session.user.name = token.name as string; // corrected this line
// 				session.user.role = token.role as Roles;
// 				session.user.access_token = token.access_token as string;
// 				session.user.expires_in = token.expires_in as number;
// 				session.user.email = token.email as string;
// 			}
// 			return session;
// 		},
// 	},
// 	secret: process.env.NEXTAUTH_SECRET,
// 	session: {
// 		strategy: "jwt",
// 	},
// 	cookies: {
// 		sessionToken: {
// 			name: `next-auth.session-token`,
// 			options: {
// 				httpOnly: true,
// 				sameSite: "lax",
// 				path: "/",
// 				secure: true,
// 			},
// 		},
// 	}
// });




// // import NextAuth from "next-auth/next"
// // import CredentialsProvider from "next-auth/providers/credentials"
// // import { UserRoles } from './app/(dashboard)/dashboard/admin/users/users.types';

// // const authOptions = {
// //   providers: [
// //     CredentialsProvider({
// //       name: "Credentials",
// //       credentials: {
// //         email: { label: "Email", type: "text" },
// //         password: { label: "Password", type: "password" },
// //       },
// //       async authorize(credentials) {
// //         if (
// //           credentials?.email === "admin@example.com" &&
// //           credentials?.password === "admin123"
// //         ) {
// //           return {
// //             id: "1",
// //             name: "Admin User",
// //             email: "admin@example.com",
// //             role: "admin",
// //             access_token: "xyz123",
// //           }
// //         }
// //         return null
// //       },
// //     }),
// //   ],
// //   session: { strategy: "jwt" },
// //   callbacks: {
// //     async jwt({ token, user }) {
// //       if (user) {
// //         token.id = user.id
// //         token.role = user.role
// //         token.access_token = user.access_token
// //       }
// //       return token
// //     },
// //     async session({ session, token }) {
// //       session.user.id = token.id as string
// //       session.user.role = token.role
// //       session.user.access_token = token.access_token
// //       return session
// //     },
// //   },
// //   secret: process.env.NEXTAUTH_SECRET,
// // }

// // const handler = NextAuth(authOptions)

// // export { handler as GET, handler as POST }

export const runtime = 'edge';