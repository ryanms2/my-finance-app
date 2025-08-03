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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      // Se a URL já é absoluta e válida, use ela
      if (url.startsWith("http")) return url
      // Senão, use a baseUrl configurada
      return baseUrl
    },
  },
  events: {
    async createUser({ user }) {
      try {
        if (user.id) {
          await createDefaultCategoriesForUser(user.id);
        }
      } catch (error) {
        console.error('Erro ao criar categorias padrão:', error)
        // Não impedir a criação do usuário
      }
    }
  }
})