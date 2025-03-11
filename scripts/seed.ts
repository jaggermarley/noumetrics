import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Criar empresa de exemplo
  const company = await prisma.company.create({
    data: {
      name: 'Empresa XYZ Ltda.',
      industry: 'Tecnologia',
      address: 'Av. Paulista, 1000, São Paulo, SP',
      website: 'www.empresaxyz.com.br',
      description: 'Empresa líder no segmento de tecnologia, especializada em soluções inovadoras para o mercado corporativo.',
    },
  })

  console.log('Empresa criada:', company.name)

  // Criar usuário admin
  const adminPassword = await hash('password', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      position: 'Administrador',
    },
  })

  console.log('Usuário admin criado:', admin.email)

  // Criar usuário cliente
  const clientPassword = await hash('password', 12)
  const client = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      password: clientPassword,
      role: 'client',
      position: 'Marketing Manager',
      companyId: company.id,
    },
  })

  console.log('Usuário cliente criado:', client.email)

  // Criar campanhas
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: 'Campanha de Verão 2025',
        description: 'Campanha promocional para produtos de verão',
        platform: 'Facebook',
        budget: 2500,
        spent: 1892,
        impressions: 450000,
        clicks: 25000,
        conversions: 1200,
        status: 'active',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        companyId: company.id,
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Promoção Especial - Junho',
        description: 'Campanha promocional para o mês de junho',
        platform: 'Google',
        budget: 1800,
        spent: 1220,
        impressions: 380000,
        clicks: 18000,
        conversions: 950,
        status: 'active',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-30'),
        companyId: company.id,
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Lançamento Produto X',
        description: 'Campanha de lançamento do novo produto',
        platform: 'Instagram',
        budget: 2000,
        spent: 980,
        impressions: 320000,
        clicks: 15000,
        conversions: 720,
        status: 'active',
        startDate: new Date('2025-04-15'),
        endDate: new Date('2025-05-15'),
        companyId: company.id,
      },
    }),
  ])

  console.log(`${campaigns.length} campanhas criadas`)

  // Criar notificações
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Nova campanha aprovada',
        description: 'A campanha "Promoção de Verão 2025" foi aprovada e está pronta para ser lançada.',
        type: 'campaign',
        userId: client.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Relatório mensal disponível',
        description: 'O relatório de desempenho de Fevereiro 2025 já está disponível para visualização.',
        type: 'report',
        userId: client.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Comentário em campanha',
        description: 'Carlos Mendes comentou na campanha "Lançamento Produto X".',
        type: 'comment',
        read: true,
        userId: client.id,
      },
    }),
  ])

  console.log(`${notifications.length} notificações criadas`)

  // Criar relatórios
  const reports = await Promise.all([
    prisma.report.create({
      data: {
        title: 'Relatório de Desempenho - Q1 2025',
        description: 'Análise completa de métricas e KPIs do primeiro trimestre',
        type: 'performance',
        format: 'PDF',
        url: '/reports/q1-2025.pdf',
        size: '8.4 MB',
        userId: client.id,
      },
    }),
    prisma.report.create({
      data: {
        title: 'Análise de Campanhas - Facebook',
        description: 'Desempenho detalhado das campanhas no Facebook',
        type: 'campaign',
        format: 'XLSX',
        url: '/reports/facebook-campaigns.xlsx',
        size: '5.2 MB',
        userId: client.id,
      },
    }),
  ])

  console.log(`${reports.length} relatórios criados`)

  // Criar recursos
  const resources = await Promise.all([
    prisma.resource.create({
      data: {
        title: 'Guia de Marketing Digital 2025',
        description: 'Estratégias avançadas para o próximo ano',
        type: 'document',
        format: 'PDF',
        url: '/resources/marketing-guide-2025.pdf',
        size: '12.4 MB',
        category: 'Marketing Digital',
        views: 245,
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Análise de Concorrência',
        description: 'Estudo detalhado dos principais competidores',
        type: 'document',
        format: 'DOCX',
        url: '/resources/competitor-analysis.docx',
        size: '8.2 MB',
        category: 'Pesquisa',
        views: 186,
      },
    }),
  ])

  console.log(`${resources.length} recursos criados`)

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

