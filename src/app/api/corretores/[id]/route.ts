import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const rawAgent = await prisma.user.findUnique({ where: { id }, include: { profile: true, goals: true, sales_agents: { include: { sale: { include: { property: true } } } }, agent_achievements: { include: { achievement: true } } } } as any);
const agent = rawAgent as any;
/*{
      where: { id },
      include: {
        profile: true,
        goals: true,
        salesAgents: {
          include: {
            sale: {
              include: {
                property: true
              }
            }
          }
        },
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    */

    if (!agent) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let vendasMes = 0;
    let vendasAno = 0;
    let vgvMes = 0;
    let vgvAno = 0;
    let propostasMes = 0;

    const evolucaoMap = new Map();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    months.forEach((m) => evolucaoMap.set(m, { name: m, vendas: 0, vgv: 0, propostas: 0 }));

    const historico: any[] = [];

    agent.salesAgents.forEach((sa: any) => {
      const sale = sa.sale;
      const saleDate = new Date(sale.saleDate);
      const sMonth = saleDate.getMonth();
      const sYear = saleDate.getFullYear();

      // Only care about this year for evolucao and year stats
      if (sYear === currentYear) {
        if (sale.type === 'VENDA') {
          vendasAno += sa.salesQuantity;
          vgvAno += sa.agentVgv;

          if (sMonth === currentMonth) {
            vendasMes += sa.salesQuantity;
            vgvMes += sa.agentVgv;
          }

          const mName = months[sMonth];
          const curr = evolucaoMap.get(mName);
          curr.vendas += sa.salesQuantity;
          curr.vgv += sa.agentVgv;
        } else {
          if (sMonth === currentMonth) {
            propostasMes += 1;
          }
          const mName = months[sMonth];
          const curr = evolucaoMap.get(mName);
          curr.propostas += 1;
        }
      }

      historico.push({
        id: sale.id,
        date: sale.saleDate,
        property: `${sale.property.type} - ${sale.property.neighborhood}`,
        value: sale.propertyValue,
        type: sale.type
      });
    });

    historico.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const evolucao = Array.from(evolucaoMap.values());

    const payload = {
      name: agent.name,
      cargo: agent.profile?.position || 'Corretor',
      dataEntrada: agent.profile?.hireDate ? new Date(agent.profile.hireDate).toLocaleDateString() : 'N/A',
      photo: agent.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      indicadores: {
        vendasMes,
        vendasAno,
        vgvMes,
        vgvAno,
        propostasMes,
        ticketMedio: vendasMes > 0 ? vgvMes / vendasMes : 0,
        metaMensal: agent.goals[0]?.salesMonthly || 0,
        metaAnual: agent.goals[0]?.salesAnnual || 0
      },
      historico: historico.filter(h => h.type === 'VENDA'),
      evolucao,
      conquistas: agent.achievements.map((aa: any) => ({
        id: aa.id,
        title: aa.achievement.name,
        date: new Date(aa.earnedAt).toLocaleDateString(),
        icon: aa.achievement.icon
      }))
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch agent profile' }, { status: 500 });
  }
}
