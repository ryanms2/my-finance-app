import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { exportDataAction } from '@/lib/dashboardActions/exportActions';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const result = await exportDataAction(body);

    if (!result.success || !result.data) {
      return NextResponse.json({ error: result.error || 'Dados não encontrados' }, { status: 400 });
    }

    // Determinar se é conteúdo binário (XLSX/PDF) ou texto (CSV)
    const isBase64 = result.filename?.endsWith('.xlsx') || result.filename?.endsWith('.pdf');
    
    let responseData: Buffer | string;
    if (isBase64) {
      // Converter base64 de volta para buffer para arquivos binários
      responseData = Buffer.from(result.data, 'base64');
    } else {
      // Manter como string para CSV
      responseData = result.data;
    }

    // Retornar o arquivo para download
    const response = new NextResponse(responseData);
    
    response.headers.set('Content-Type', result.mimeType || 'application/octet-stream');
    response.headers.set(
      'Content-Disposition', 
      `attachment; filename="${result.filename || 'export.txt'}"`
    );
    response.headers.set('Cache-Control', 'no-cache');

    return response;

  } catch (error) {
    console.error('Erro na API de exportação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}
