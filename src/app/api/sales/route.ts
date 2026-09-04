import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Basic filtering can be added here

  try {
    const sales = await prisma.sale.findMany({
      include: {
        property: true,
        salesAgents: {
          include: {
            agent: true
          }
        },
        creator: true
      },
      orderBy: {
        saleDate: 'desc'
      }
    });

    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Simplification for the example: assume creating property and sale in a transaction
    // Also, handling sales agents

    const sale = await prisma.$transaction(async (tx) => {
      // Find or create property
      const property = await tx.property.upsert({
        where: { code: data.property.code },
        update: { ...data.property },
        create: { ...data.property }
      });

      // Assume a dummy creator if not provided
      let creatorId = data.createdBy;
      if (!creatorId) {
         const firstAdmin = await tx.user.findFirst({ where: { role: 'ADMIN' } });
         creatorId = firstAdmin?.id;

         if (!creatorId) {
             const newUser = await tx.user.create({
                 data: {
                     email: 'admin@dreamar.com',
                     name: 'Admin Dreamar',
                     role: 'ADMIN'
                 }
             });
             creatorId = newUser.id;
         }
      }

      const newSale = await tx.sale.create({
        data: {
          propertyId: property.id,
          saleDate: new Date(data.saleDate),
          propertyValue: data.propertyValue,
          totalVgv: data.type === 'PROPOSTA' ? 0 : data.propertyValue, // As per rules, proposals don't count towards VGV until converted? Wait, the rules say: "A proposta deve aparecer nas estatísticas, porém NÃO deve ser contabilizada como venda concluída." and "Uma proposta NÃO entra no VGV vendido até ser convertida em venda."
          commissionPercentage: data.commissionPercentage,
          commissionValue: data.commissionValue,
          status: data.status || 'CONCLUIDA',
          type: data.type,
          notes: data.notes,
          createdBy: creatorId,
        }
      });

      // Create sales agents
      if (data.agents && data.agents.length > 0) {
        for (const agent of data.agents) {
          await tx.salesAgent.create({
            data: {
              saleId: newSale.id,
              agentId: agent.agentId,
              participationPercentage: agent.participationPercentage,
              salesQuantity: data.type === 'PROPOSTA' ? 0 : (agent.participationPercentage / 100),
              agentVgv: data.type === 'PROPOSTA' ? 0 : (data.propertyValue * (agent.participationPercentage / 100)),
              agentCommission: data.commissionValue ? (data.commissionValue * (agent.participationPercentage / 100)) : 0, // Simplified
            }
          });
        }
      }

      return newSale;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
