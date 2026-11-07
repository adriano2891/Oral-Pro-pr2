export interface TreatmentItem {
  id: string;
  name: string;
  shortDesc: string;
  purpose: string;
  demoPrice: string;
  available: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PaymentMethodItem {
  title: string;
  description: string;
  badge?: string;
}

export interface BusinessHourItem {
  day: string;
  hours: string;
  status: string;
}

export const CLINIC_ATTENDANCE_DATA = {
  clinicName: 'OralPro Clínica Odontológica',
  whatsappNumber: '5511934739629',
  whatsappBaseUrl: 'https://wa.me/5511934739629',
  defaultWhatsAppMessage: 'Olá! Vim pelo site OralPro e gostaria de falar com uma atendente.',
  googleMapsUrl: 'https://google.com/map',
  address: 'Av. Paulista, 1578 - 14º Andar, Bela Vista, São Paulo - SP, CEP 01310-200',
  referencePoint: 'Próximo ao MASP e Estação Trianon-Masp do Metrô (com estacionamento conveniado no local)',

  // Disclaimer obrigatório para os valores simulados
  priceDisclaimer:
    'Os valores apresentados são estimativas e podem variar conforme a avaliação individual de cada paciente. Consulte nossa equipe para confirmar os valores.',

  // Mensagem inicial de boas-vindas
  welcomeMessage:
    'Olá! 👋 Seja bem-vindo(a) à nossa clínica!\n\nSou a assistente virtual e estou aqui para ajudar você a encontrar informações sobre nossos tratamentos, valores e agendamentos.\n\nComo podemos ajudar hoje?',

  // 10 Tratamentos e Especialidades
  treatments: [
    {
      id: 'clinica-geral',
      name: 'Clínica geral',
      shortDesc: 'Diagnóstico completo, restaurações preventivas e saúde bucal contínua.',
      purpose: 'Identificar problemas no início, prevenir cáries e manter seus dentes fortes e saudáveis.',
      demoPrice: 'R$ 80,00 (Avaliação)',
      available: true,
    },
    {
      id: 'limpeza-dentaria',
      name: 'Limpeza dentária (Profilaxia)',
      shortDesc: 'Remoção de placa bacteriana, tártaro e polimento dental com ultrassom.',
      purpose: 'Eliminar bactérias prejudiciais, prevenir gengivite e garantir hálito fresco e gengivas saudáveis.',
      demoPrice: 'R$ 180,00',
      available: true,
    },
    {
      id: 'clareamento-dental',
      name: 'Clareamento dental',
      shortDesc: 'Clareamento profissional a laser no consultório ou caseiro supervisionado.',
      purpose: 'Remover manchas e pigmentações escuras, devolvendo a cor natural e a luminosidade ao seu sorriso.',
      demoPrice: 'R$ 650,00',
      available: true,
    },
    {
      id: 'restauracao',
      name: 'Restauração dental',
      shortDesc: 'Reconstrução estética e funcional em resina composta de alta durabilidade.',
      purpose: 'Restaurar dentes cariados, fraturados ou desgastados com acabamento idêntico ao dente natural.',
      demoPrice: 'R$ 180,00',
      available: true,
    },
    {
      id: 'tratamento-de-canal',
      name: 'Tratamento de canal (Endodontia)',
      shortDesc: 'Remoção da polpa dental inflamada ou infeccionada com tecnologia rotatória.',
      purpose: 'Salvar o dente natural da extração, eliminar a dor e restaurar a função mastigatória com conforto.',
      demoPrice: 'A partir de R$ 800,00',
      available: true,
    },
    {
      id: 'extracao-dentaria',
      name: 'Extração dentária',
      shortDesc: 'Remoção cirúrgica segura de dentes comprometidos ou dentes do siso.',
      purpose: 'Aliviar dores intensas, prevenir infecções e liberar espaço para alinhamento dentário.',
      demoPrice: 'A partir de R$ 250,00',
      available: true,
    },
    {
      id: 'implantes-dentarios',
      name: 'Implantes dentários',
      shortDesc: 'Fixação em titânio ou zircônia para substituição definitiva da raiz do dente perdido.',
      purpose: 'Recuperar com total firmeza a mastigação, a segurança ao sorrir e a autoestima.',
      demoPrice: 'A partir de R$ 2.500,00',
      available: true,
    },
    {
      id: 'aparelhos-ortodonticos',
      name: 'Aparelhos ortodônticos',
      shortDesc: 'Alinhadores invisíveis e aparelhos fixos metálicos ou estéticos de safira.',
      purpose: 'Corrigir dentes tortos, mordida cruzada e alinhar o sorriso com precisão estética e conforto.',
      demoPrice: 'A partir de R$ 150,00/mês',
      available: true,
    },
    {
      id: 'proteses-dentarias',
      name: 'Próteses dentárias',
      shortDesc: 'Próteses fixas sobre implantes, coroas em porcelana ou próteses parciais/totais.',
      purpose: 'Devolver dentes ausentes, estética e mastigação com materiais biocompatíveis e resistentes.',
      demoPrice: 'A partir de R$ 900,00',
      available: true,
    },
    {
      id: 'estetica-dental',
      name: 'Estética dental (Facetas e Lentes)',
      shortDesc: 'Lentes de contato dental em porcelana ultrafina e recontorno estético do sorriso.',
      purpose: 'Transformar a harmonia, o formato e a brancura dos dentes de forma personalizada e duradoura.',
      demoPrice: 'Sob avaliação personalizada',
      available: true,
    },
  ] as TreatmentItem[],

  // Tabela de Preços e Valores Simulados
  priceList: [
    { service: 'Avaliação odontológica', price: 'R$ 80,00', available: true },
    { service: 'Limpeza dentária', price: 'R$ 180,00', available: true },
    { service: 'Clareamento dental', price: 'R$ 650,00', available: true },
    { service: 'Restauração', price: 'R$ 180,00', available: true },
    { service: 'Tratamento de canal', price: 'A partir de R$ 800,00', available: true },
    { service: 'Extração dentária', price: 'A partir de R$ 250,00', available: true },
    { service: 'Implante dentário', price: 'A partir de R$ 2.500,00', available: true },
    { service: 'Aparelho ortodôntico', price: 'A partir de R$ 150,00/mês', available: true },
    { service: 'Prótese dentária', price: 'A partir de R$ 900,00', available: true },
  ],

  // Formas de Pagamento
  paymentMethods: [
    {
      title: 'PIX',
      description: 'Pagamento instantâneo via QR Code ou Chave PIX com confirmação em tempo real.',
      badge: 'Instantâneo',
    },
    {
      title: 'Cartão de Crédito',
      description: 'Parcelamento facilitado em até 12x em todas as principais bandeiras (Visa, Mastercard, Elo, Amex).',
      badge: 'Até 12x',
    },
    {
      title: 'Cartão de Débito',
      description: 'Pagamento presencial rápido e seguro no momento da sua consulta.',
      badge: 'À vista',
    },
    {
      title: 'Dinheiro',
      description: 'Aceito diretamente na recepção da clínica.',
      badge: 'Recepção',
    },
    {
      title: 'Parcelamento para Tratamentos Específicos',
      description: 'Condições personalizadas e planos de pagamento para tratamentos de implantes, próteses e ortodontia.',
      badge: 'Personalizado',
    },
  ] as PaymentMethodItem[],

  // Horários de Atendimento
  businessHours: [
    { day: 'Segunda a Sexta-feira', hours: '08:30 às 19:30', status: 'Aberto' },
    { day: 'Sábados', hours: '08:30 às 13:00', status: 'Atendimento matutino' },
    { day: 'Domingos e Feriados', hours: 'Fechado', status: 'Urgências sob marcação prévia' },
  ] as BusinessHourItem[],

  // 9 Dúvidas Frequentes (FAQ)
  faqs: [
    {
      id: 'faq-1',
      question: 'O clareamento dental dói?',
      answer:
        'Não dói! Alguns pacientes podem apresentar uma sensibilidade transitória e leve durante o tratamento, que passa rapidamente. Utilizamos géis clareadores com agentes dessensibilizantes de última geração para garantir o máximo conforto.',
    },
    {
      id: 'faq-2',
      question: 'Quanto tempo dura o tratamento com aparelho?',
      answer:
        'O tempo médio varia entre 12 e 24 meses, dependendo da complexidade do caso e do tipo de aparelho escolhido (alinhadores invisíveis costumam ser até 30% mais rápidos que aparelhos convencionais). A duração exata é definida na sua avaliação inicial.',
    },
    {
      id: 'faq-3',
      question: 'A limpeza dentária precisa ser feita de quanto em quanto tempo?',
      answer:
        'A recomendação clínica da Organização Mundial de Saúde e dos nossos especialistas é realizar a profilaxia (limpeza com ultrassom e polimento) a cada 6 meses para prevenir acúmulo de tártaro, gengivite e cáries.',
    },
    {
      id: 'faq-4',
      question: 'O implante dentário dói para colocar?',
      answer:
        'O procedimento é realizado sob anestesia local eficaz e é totalmente indolor. No pós-operatório, prescrevemos medicamentos analgésicos e anti-inflamatórios que tornam a recuperação extremamente suave e tranquila.',
    },
    {
      id: 'faq-5',
      question: 'Crianças podem ser atendidas na clínica?',
      answer:
        'Sim! Contamos com equipe de odontopediatria preparada com ambiente acolhedor e lúdico para atender bebês, crianças e adolescentes, cuidando do desenvolvimento seguro e sem traumas.',
    },
    {
      id: 'faq-6',
      question: 'Vocês atendem urgências e emergências?',
      answer:
        'Sim! Priorizamos pacientes com dor de dente aguda, fraturas ou quedas no mesmo dia durante o nosso horário comercial. Para urgências fora de horário, você pode entrar em contato direto com a nossa atendente pelo WhatsApp.',
    },
    {
      id: 'faq-7',
      question: 'Aceitam convênio ou apenas particular?',
      answer:
        'Trabalhamos no sistema particular com emissão de recibo e nota fiscal detalhada para que você possa solicitar reembolso integral ou parcial ao seu seguro ou plano de saúde odontológico. Também facilitamos formas de pagamento.',
    },
    {
      id: 'faq-8',
      question: 'Qual o valor da primeira consulta?',
      answer:
        'O valor simulado de avaliação odontológica inicial é de R$ 80,00, incluindo exame clínico detalhado, diagnóstico digital e plano de tratamento personalizado. Consulte a atendente para promoções ativas.',
    },
    {
      id: 'faq-9',
      question: 'Como funciona a avaliação inicial?',
      answer:
        'Durante a avaliação inicial, o dentista realiza um exame clínico minucioso, avalia a saúde das gengivas e dentes, identifica necessidades estéticas ou funcionais e elabora um plano de tratamento personalizado com orçamento detalhado e transparente.',
    },
  ] as FAQItem[],
};
