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
  debug: true, // Enable debug mode
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize function called with credentials:", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // Find user by email, phone, or other identifiers
          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { phone: credentials.email },
                // Add other identifier fields if needed
              ]
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

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Return user object for successful authentication
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
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
        session.user.role = token.role as string
      }
      return session
    }
  },
  // Configure JWT settings for middleware
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  },
  // Optimize session configuration
  useSecureCookies: process.env.NODE_ENV === 'production',
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  
  // Custom error handling
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata)
    },
    warn(code) {
      console.warn("NextAuth Warning:", code)
    },
    debug(code, metadata) {
      console.debug("NextAuth Debug:", code, metadata)
    }
  }
}