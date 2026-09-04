import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // format: YYYY-MM

  const targetDate = month ? new Date(`${month}-01`) : new Date();
  const start = startOfMonth(targetDate);
  const end = endOfMonth(targetDate);

  const prevMonthStart = startOfMonth(subMonths(targetDate, 1));
  const prevMonthEnd = endOfMonth(subMonths(targetDate, 1));

  try {
    // Current month stats
    const currentSales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: start,
          lte: end
        },
        type: 'VENDA'
      }
    });

    const currentProposals = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: start,
          lte: end
        },
        type: 'PROPOSTA'
      }
    });

    const salesCount = currentSales.length;
    const vgvTotal = currentSales.reduce((acc, sale) => acc + sale.propertyValue, 0); // using propertyValue as totalVgv since it avoids sum duplication per rule
    const proposalCount = currentProposals.length;
    const ticketMedio = salesCount > 0 ? vgvTotal / salesCount : 0;

    // Previous month stats for comparison
    const prevSales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: prevMonthStart,
          lte: prevMonthEnd
        },
        type: 'VENDA'
      }
    });

    const prevProposals = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: prevMonthStart,
          lte: prevMonthEnd
        },
        type: 'PROPOSTA'
      }
    });

    const prevSalesCount = prevSales.length;
    const prevVgvTotal = prevSales.reduce((acc, sale) => acc + sale.propertyValue, 0);
    const prevProposalCount = prevProposals.length;

    // Get company goals for current month
    const companyGoal = await prisma.goal.findFirst({
      where: {
        isCompany: true,
        type: 'MENSAL',
        period: `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`
      }
    });

    // Ranking
    const agents = await prisma.user.findMany({
      where: { role: 'CORRETOR' },
      include: {
        sales_agents: {
          where: {
            sale: {
              saleDate: {
                gte: start,
                lte: end
              },
              type: 'VENDA'
            }
          }
        },
        profile: true
      }
    });

    const ranking = agents.map(agent => {
      const totalSales = agent.sales_agents.reduce((acc, sa) => acc + sa.salesQuantity, 0);
      const totalVgv = agent.sales_agents.reduce((acc, sa) => acc + sa.agentVgv, 0);

      return {
        id: agent.id,
        name: agent.name,
        photoUrl: agent.profile?.photoUrl,
        totalSales,
        totalVgv
      };
    }).sort((a, b) => b.totalSales - a.totalSales || b.totalVgv - a.totalVgv);

    return NextResponse.json({
      current: {
        sales: salesCount,
        vgv: vgvTotal,
        proposals: proposalCount,
        ticketMedio
      },
      previous: {
        sales: prevSalesCount,
        vgv: prevVgvTotal,
        proposals: prevProposalCount
      },
      goal: companyGoal || { salesTarget: 0, vgvTarget: 0 },
      ranking: ranking.slice(0, 10) // Top 10
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
