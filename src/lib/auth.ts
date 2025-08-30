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
  debug: process.env.DEBUG_ENABLED === 'true', // Use environment variable for debug mode
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize function called with credentials:", credentials?.identifier)
        if (!credentials?.identifier || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // Find user by email, phone, or other identifiers
          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier },
                { phone: credentials.identifier },
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
            console.log("User not found or inactive")
            return null
          }

          // Verify password
          console.log("Verifying password...")
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log("Password validation result:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          // Return user object for successful authentication
          console.log("Authentication successful, returning user object")
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
    secret: process.env.NEXTAUTH_SECRET,
  },
  // Optimize session configuration
  useSecureCookies: process.env.NODE_ENV === 'production',
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  
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