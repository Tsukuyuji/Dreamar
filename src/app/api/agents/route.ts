import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const agents = await prisma.user.findMany({
      where: {
        role: {
          in: ['CORRETOR', 'GESTOR', 'ADMIN']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}
