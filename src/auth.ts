import Credentials from "next-auth/providers/credentials"
import NextAuth from "next-auth" 

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    pages: {
        signIn: '/SignIn',
        signOut: '/',
        error: '/SignIn',
    },
    providers: [
        Credentials({
            credentials: { 
                id: {
                    label: "Id",
                    type: "text",
                },
            },
            authorize: async (credentials) => {
                return {
                    id: credentials.id as string,
                }

            },
        }),
    ],

    callbacks: {
        session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                }
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token
        },
        async redirect({ url, baseUrl }) {
            // Handle relative URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`
            // Handle absolute URLs on the same domain
            else if (new URL(url).origin === baseUrl) return url
            // Default to base URL for external URLs
            return baseUrl
        },
    },
})
