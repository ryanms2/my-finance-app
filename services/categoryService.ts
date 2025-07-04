'use server'
import { prisma } from '@/utils/prisma/prisma'
import { defaultCategories } from '@/lib/types'

export async function createDefaultCategoriesForUser(userId: string) {
  const categoriesToCreate = defaultCategories.map(cat => ({
    ...cat,
    userId,
  }));

  const create = await prisma.category.createMany({
    data: categoriesToCreate
  });
} 