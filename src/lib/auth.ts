import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("=== NEXTAUTH AUTHORIZE FUNCTION CALLED ===")
        console.log("Credentials received:", credentials)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Looking for user:", credentials.email)
          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { phone: credentials.email }
              ]
            }
          })

          console.log("User found:", user ? "YES" : "NO")
          
          if (!user || !user.isActive) {
            console.log("User not found or inactive")
            return null
          }

          console.log("Verifying password...")
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          console.log("Authentication successful for user:", user.email)
          const result = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
          console.log("Returning user object:", result)
          return result
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT callback - adding user to token")
        token.role = user.role
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        console.log("Session callback - adding token to session")
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
}