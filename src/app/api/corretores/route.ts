import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'mensal';

  try {
    const agents = await prisma.user.findMany({
      where: { role: 'CORRETOR' },
      include: {
        sales_agents: {
          include: {
            sale: true
          }
        },
        profile: true,
        goals: true
      }
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const ranking = agents.map(agent => {
      let salesCount = 0;
      let vgvTotal = 0;
      let proposals = 0;

      agent.sales_agents.forEach((sa: any) => {
        const sale = sa.sale;
        const saleDate = new Date(sale.saleDate);

        let shouldInclude = false;

        if (type === 'anual') {
            shouldInclude = saleDate.getFullYear() === currentYear;
        } else {
            shouldInclude = saleDate.getFullYear() === currentYear && saleDate.getMonth() === currentMonth;
        }

        if (shouldInclude) {
            if (sale.type === 'VENDA') {
                salesCount += sa.salesQuantity;
                vgvTotal += sa.agentVgv;
            } else {
                proposals += 1;
            }
        }
      });

      const initials = agent.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

      return {
        id: agent.id,
        name: agent.name,
        photo: initials,
        vendas: salesCount,
        vgv: vgvTotal,
        propostas: proposals,
        meta: 100 // placeholder
      };
    });

    // Sort logic
    if (type === 'vgv') {
      ranking.sort((a, b) => b.vgv - a.vgv);
    } else {
      // Default to sales amount, tiebreaker vgv
      ranking.sort((a, b) => {
        if (b.vendas === a.vendas) {
          return b.vgv - a.vgv;
        }
        return b.vendas - a.vendas;
      });
    }

    return NextResponse.json(ranking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
  }
}
