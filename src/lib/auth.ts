import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

// Get the base URL from environment or fallback
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return ''
  }
  // Server should use the environment variable
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Optimize query - only select necessary fields
        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
            isActive: true,
            avatar: true
          }
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          // Track failed login attempt
          try {
            await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/security/failed-login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                ipAddress: 'unknown', // Will be captured by the API
                userAgent: 'unknown'
              })
            })
          } catch (error) {
            console.error('Error tracking failed login attempt:', error)
          }
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        // Clear failed login attempts on successful login
        if (token.email) {
          try {
            await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/security/failed-login`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: token.email
              })
            })
          } catch (error) {
            console.error('Error clearing failed login attempts:', error)
          }
        }
      }
      return session
    }
  },
  // Configure JWT settings for middleware
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
    encryption: true,
  },
  // Optimize session configuration
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
}