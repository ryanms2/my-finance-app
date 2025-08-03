import { auth } from "@/app/auth"
import { prisma } from "@/utils/prisma/prisma"

/**
 * Obtém o ID do usuário de forma segura no server-side
 * usando a sessão autenticada
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    return user?.id || null
  } catch (error) {
    console.error('Erro ao obter ID do usuário:', error)
    return null
  }
}

/**
 * Obtém os dados completos do usuário de forma segura no server-side
 */
export async function getCurrentUser() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    return user
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error)
    return null
  }
}

/**
 * Verifica se o usuário está autenticado (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await auth()
    return !!(session?.user?.email)
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    return false
  }
}
