import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dreamar.com',
      name: 'Admin Dreamar',
      role: 'ADMIN',
      profile: {
        create: {
          jobTitle: 'Administrador'
        }
      }
    }
  });

  const agent1 = await prisma.user.create({
    data: {
      email: 'joao@dreamar.com',
      name: 'João Silva',
      role: 'CORRETOR',
      profile: {
        create: {
          jobTitle: 'Corretor Especialista'
        }
      },
      goals: {
        create: [
          { type: 'MENSAL', period: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`, salesTarget: 3, vgvTarget: 2000000, isCompany: false },
          { type: 'ANUAL', period: `${new Date().getFullYear()}`, salesTarget: 36, vgvTarget: 24000000, isCompany: false }
        ]
      }
    }
  });

  const agent2 = await prisma.user.create({
    data: {
      email: 'maria@dreamar.com',
      name: 'Maria Souza',
      role: 'CORRETOR',
      profile: {
        create: {
          jobTitle: 'Corretora'
        }
      },
      goals: {
        create: [
          { type: 'MENSAL', period: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`, salesTarget: 3, vgvTarget: 1500000, isCompany: false },
          { type: 'ANUAL', period: `${new Date().getFullYear()}`, salesTarget: 36, vgvTarget: 18000000, isCompany: false }
        ]
      }
    }
  });

  const prop1 = await prisma.property.create({
    data: {
      code: 'REF-001',
      title: 'Apartamento - Martim de Sá',
      address: 'Av. Castelo Branco',
      neighborhood: 'Martim de Sá',
      city: 'Caraguatatuba',
      type: 'Apartamento'
    }
  });

  const sale1 = await prisma.sale.create({
    data: {
      propertyId: prop1.id,
      saleDate: new Date(),
      propertyValue: 650000,
      totalVgv: 650000,
      commissionPercentage: 6,
      commissionValue: 39000,
      status: 'CONCLUIDA',
      type: 'VENDA',
      createdBy: admin.id,
      salesAgents: {
        create: {
          agentId: agent1.id,
          participationPercentage: 100,
          salesQuantity: 1,
          agentVgv: 650000,
          agentCommission: 39000
        }
      }
    }
  });

  await prisma.companySetting.create({
    data: {
      key: 'monthly_goal_sales',
      value: '20'
    }
  });
  await prisma.companySetting.create({
    data: {
      key: 'monthly_goal_vgv',
      value: '12000000'
    }
  });

  console.log('Seeded database successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
