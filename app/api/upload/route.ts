import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })
    }

    // Obter o FormData da requisição
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'Nenhum arquivo enviado' }, { status: 400 })
    }
    
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, message: 'Tipo de arquivo não suportado' }, { status: 400 })
    }

    // Verificar o tamanho do arquivo (limite de 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Arquivo muito grande' }, { status: 400 })
    }

    // Ler o arquivo como ArrayBuffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Gerar um nome único para o arquivo com UUID e extensão original
    const originalName = file.name
    const extension = originalName.split('.').pop() || 'jpg'
    const fileName = `${uuidv4()}.${extension}`
    
    // Diretório para salvar as imagens (criando um subdiretório por usuário)
    const userDirectory = join(process.cwd(), 'public', 'uploads', session.user.id)
    
    // Verificar se o diretório existe e criar se necessário
    if (!existsSync(userDirectory)) {
      await mkdir(userDirectory, { recursive: true })
    }
    
    // Salvar o arquivo no sistema de arquivos
    const filePath = join(userDirectory, fileName)
    await writeFile(filePath, buffer)
    
    // URL pública do arquivo
    const imageUrl = `/uploads/${session.user.id}/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      message: 'Imagem enviada com sucesso' 
    })
  } catch (error) {
    console.error('Erro no upload de imagem:', error)
    return NextResponse.json({ success: false, message: 'Erro ao processar o upload' }, { status: 500 })
  }
}
