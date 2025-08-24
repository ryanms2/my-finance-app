"use server"

import { auth } from "@/app/auth";
import { prisma } from "@/utils/prisma/prisma";
import { revalidatePath } from 'next/cache';
import bcrypt from "bcryptjs";
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Função para atualizar o perfil do usuário
export async function updateUserProfile({ name }: { name: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { 
      success: false, 
      message: 'Usuário não autenticado' 
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name }
    });

    revalidatePath('/settings');
    revalidatePath('/(main)', 'layout');

    return { 
      success: true, 
      message: 'Perfil atualizado com sucesso!' 
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { 
      success: false, 
      message: 'Erro ao atualizar perfil. Tente novamente.' 
    };
  }
}

// Função para atualizar a imagem de perfil do usuário
export async function updateUserImage({ imageUrl }: { imageUrl: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { 
      success: false, 
      message: 'Usuário não autenticado' 
    };
  }

  try {
    // Atualizar a imagem do perfil no banco de dados
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl }
    });

    // Revalidar todas as páginas que podem mostrar a imagem do perfil
    revalidatePath('/settings');
    revalidatePath('/dashboard');
    revalidatePath('/wallets');
    revalidatePath('/budgets');
    revalidatePath('/transactions');
    revalidatePath('/reports');
    revalidatePath('/(main)', 'layout');
    
    // Forçar atualização da sessão
    await auth();

    return { 
      success: true, 
      message: 'Foto de perfil atualizada com sucesso!' 
    };
  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    return { 
      success: false, 
      message: 'Erro ao atualizar foto de perfil. Tente novamente.' 
    };
  }
}

// Função para remover a imagem de perfil do usuário
export async function removeUserImage() {
  const session = await auth();
  if (!session?.user?.id) {
    return { 
      success: false, 
      message: 'Usuário não autenticado' 
    };
  }

  try {
    // Buscar a imagem atual do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    // Se o usuário tiver uma imagem salva localmente, tentar excluí-la
    if (user?.image && user.image.startsWith('/uploads/')) {
      const relativePath = user.image.replace(/^\//, ''); // Remove a barra inicial
      const filePath = join(process.cwd(), 'public', relativePath);
      
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    // Atualizar o usuário para remover a referência à imagem
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null }
    });

    // Revalidar todas as páginas que podem mostrar a imagem do perfil
    revalidatePath('/settings');
    revalidatePath('/dashboard');
    revalidatePath('/wallets');
    revalidatePath('/budgets');
    revalidatePath('/transactions');
    revalidatePath('/reports');
    revalidatePath('/(main)', 'layout');
    
    // Forçar atualização da sessão
    await auth();

    return { 
      success: true, 
      message: 'Foto de perfil removida com sucesso!' 
    };
  } catch (error) {
    console.error('Erro ao remover foto de perfil:', error);
    return { 
      success: false, 
      message: 'Erro ao remover foto de perfil. Tente novamente.' 
    };
  }
}

// Função para atualizar a senha do usuário
export async function updateUserPassword({ 
  currentPassword, 
  newPassword 
}: { 
  currentPassword: string, 
  newPassword: string 
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { 
      success: false, 
      message: 'Usuário não autenticado' 
    };
  }

  try {
    // Buscar o usuário com a senha atual
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true }
    });

    if (!user?.password) {
      return { 
        success: false, 
        message: 'Usuário não possui senha cadastrada' 
      };
    }

    // Verificar se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { 
        success: false, 
        message: 'Senha atual incorreta' 
      };
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar a senha no banco de dados
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return { 
      success: true, 
      message: 'Senha atualizada com sucesso!' 
    };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return { 
      success: false, 
      message: 'Erro ao atualizar senha. Tente novamente.' 
    };
  }
}
