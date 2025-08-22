'use server'
import { prisma } from '@/utils/prisma/prisma'
import { defaultCategories } from '@/lib/types'

export async function createDefaultCategoriesForUser(userId: string) {
  try {
    // Verificar se o usuário já tem categorias
    const existingCategories = await prisma.category.findMany({
      where: { userId }
    });

    // Se já existirem categorias, não cria novamente
    if (existingCategories.length > 0) {
      console.log(`Usuário ${userId} já possui ${existingCategories.length} categorias.`);
      return;
    }

    // Preparar categorias para criação
    const categoriesToCreate = defaultCategories.map(cat => ({
      ...cat,
      userId,
    }));

    // Criar categorias
    const result = await prisma.category.createMany({
      data: categoriesToCreate
    });

    console.log(`Criadas ${result.count} categorias padrão para o usuário ${userId}`);
    return result;
  } catch (error) {
    console.error('Erro ao criar categorias padrão:', error);
    throw error; // Repassar o erro para ser tratado onde a função for chamada
  }
} 