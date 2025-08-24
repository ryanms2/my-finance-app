import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/utils/prisma/prisma"
import { createDefaultCategoriesForUser } from "@/services/categoryService"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Schema de validação para login
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validar entrada
          const { email, password } = signInSchema.parse(credentials)

          // Buscar usuário no banco
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
          })

          if (!user || !user.password) {
            // Retornar null vai acionar o erro CredentialsSignin automaticamente
            return null
          }

          // Verificar senha
          const isPasswordValid = await bcrypt.compare(password, user.password)
          
          if (!isPasswordValid) {
            // Retornar null vai acionar o erro CredentialsSignin automaticamente
            return null
          }

          // Retornar dados do usuário (sem a senha)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Erro na autorização:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin", 
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Apenas retorna true para permitir o login
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirecionar para dashboard após login
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      
      // Assegurar que temos as informações mais recentes do usuário
      if (token.sub) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { name: true, email: true, image: true }
          });
          
          if (user) {
            if (user.name) session.user.name = user.name;
            if (user.email) session.user.email = user.email;
            if (user.image) session.user.image = user.image;
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário para sessão:', error);
        }
      }
      
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
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
      }
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
})