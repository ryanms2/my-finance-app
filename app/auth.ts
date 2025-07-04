import NextAuth from "next-auth"
import EmailProvider from 'next-auth/providers/nodemailer'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/utils/prisma/prisma"
import { createDefaultCategoriesForUser } from "@/services/categoryService"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
    signOut: "/register",
    error: "/auth/error",
    newUser: "/dashboard",
    verifyRequest: "/signin",
  },
  events: {
    async createUser({ user }) {
      if (user.id) await createDefaultCategoriesForUser(user.id);
    }
  }
})