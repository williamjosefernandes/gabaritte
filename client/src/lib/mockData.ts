import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock, 
  BarChart2, 
  FileText,
  CheckCircle,
  Target,
  AlertCircle,
  Shield,
  Code,
  Scale,
  Stethoscope,
  Calculator,
  PenTool,
  Globe,
  Briefcase,
  GraduationCap
} from "lucide-react";

export const userProfile = {
  name: "Alex Silva",
  email: "alex.silva@example.com",
  avatar: "https://github.com/shadcn.png",
  level: 12,
  xp: 4500,
  nextLevelXp: 5000
};

export const currentUser = {
  plan: "free" as "free" | "premium" // Toggle this to test different states
};

export const activePlan = {
  id: 1,
  name: "Concurso Receita Federal",
  type: "Concurso",
  deadline: "2025-12-15",
  dailyGoalHours: 4,
  progress: 35,
  color: "bg-blue-600",
  startDate: "2025-01-01",
  endDate: "2025-12-15",
  subjects: [
    { name: "Direito Constitucional", progress: 60, color: "bg-blue-500" },
    { name: "Direito Administrativo", progress: 45, color: "bg-indigo-500" },
    { name: "Contabilidade Geral", progress: 20, color: "bg-emerald-500" },
    { name: "Português", progress: 80, color: "bg-amber-500" },
    { name: "Raciocínio Lógico", progress: 30, color: "bg-rose-500" }
  ]
};

export const todaysSchedule = [
  { id: 1, subject: "Direito Constitucional", topic: "Direitos Fundamentais", duration: "60 min", status: "completed", time: "08:00 - 09:00" },
  { id: 2, subject: "Contabilidade", topic: "Balanço Patrimonial", duration: "90 min", status: "active", time: "09:30 - 11:00" },
  { id: 3, subject: "Português", topic: "Crase", duration: "45 min", status: "pending", time: "14:00 - 14:45" },
  { id: 4, subject: "Raciocínio Lógico", topic: "Proposições", duration: "60 min", status: "pending", time: "15:00 - 16:00" },
];

export const stats = {
  weeklyHours: [4, 3.5, 5, 4.2, 2, 0, 0], // Mon-Sun
  monthlyProgress: 42,
  questionsSolved: 1250,
  accuracy: 78,
  streak: 14
};

export const mockSubjects = [
  {
    id: 1,
    name: "Direito Constitucional",
    progress: 60,
    color: "bg-blue-500",
    icon: "Gavel",
    topics: [
      {
        id: 101,
        name: "Teoria da Constituição",
        completed: true,
        expanded: false,
        totalTime: "2h 15m",
        subtopics: [
          { id: 1011, name: "Conceito e Classificação", completed: true, duration: "45m", type: "video" },
          { id: 1012, name: "Poder Constituinte", completed: true, duration: "60m", type: "reading" },
          { id: 1013, name: "Eficácia das Normas", completed: true, duration: "30m", type: "exercise" }
        ]
      },
      {
        id: 102,
        name: "Direitos Fundamentais",
        completed: false,
        expanded: true,
        totalTime: "3h 15m",
        subtopics: [
          { id: 1021, name: "Direitos e Deveres Individuais", completed: true, duration: "90m", type: "video" },
          { id: 1022, name: "Direitos Sociais", completed: false, duration: "60m", current: true, type: "reading" },
          { id: 1023, name: "Nacionalidade", completed: false, duration: "45m", type: "exercise" }
        ]
      },
      {
        id: 103,
        name: "Organização do Estado",
        completed: false,
        expanded: false,
        totalTime: "3h 30m",
        subtopics: [
          { id: 1031, name: "União, Estados e Municípios", completed: false, duration: "120m", type: "video" },
          { id: 1032, name: "Administração Pública", completed: false, duration: "90m", type: "reading" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Português",
    progress: 80,
    color: "bg-amber-500",
    icon: "BookOpen",
    topics: [
      {
        id: 201,
        name: "Morfologia",
        completed: true,
        expanded: false,
        totalTime: "1h 45m",
        subtopics: [
          { id: 2011, name: "Classes de Palavras", completed: true, duration: "60m", type: "video" },
          { id: 2012, name: "Estrutura e Formação", completed: true, duration: "45m", type: "exercise" }
        ]
      },
      {
        id: 202,
        name: "Sintaxe",
        completed: false,
        expanded: false,
        totalTime: "3h 30m",
        subtopics: [
          { id: 2021, name: "Termos da Oração", completed: true, duration: "90m", type: "video" },
          { id: 2022, name: "Concordância Nominal e Verbal", completed: false, duration: "120m", type: "reading" }
        ]
      }
    ]
  }
];

export const recentActivity = [
  { id: 1, type: "study", title: "Estudou Direito Constitucional", time: "2 horas atrás", duration: "60m" },
  { id: 2, type: "quiz", title: "Simulado de Contabilidade", time: "Ontem", score: "85%" },
  { id: 3, type: "plan", title: "Criou plano 'Receita Federal'", time: "3 dias atrás" },
];

export const tracks = [
  // Concurso Público
  {
    id: 1,
    title: "Trilha Polícia Federal",
    role: "Agente e Escrivão",
    category: "Concurso Público",
    description: "Plano completo focado no edital da PF, com ênfase em Contabilidade e Informática.",
    longDescription: "Esta trilha foi desenhada meticulosamente para cobrir 100% do edital da Polícia Federal para os cargos de Agente e Escrivão. Com foco estratégico nas matérias de maior peso (Contabilidade, Informática/TI e Português), ela guia o aluno desde a base teórica até a resolução avançada de questões da banca Cebraspe.",
    duration: "6 meses",
    users: 1240,
    rating: 4.9,
    icon: Shield,
    color: "bg-blue-600",
    tags: ["Segurança Pública", "Alta Performance"],
    author: { name: "Gabaritte AI", type: "official", avatar: null },
    subjects: mockSubjects,
    benefits: [
      "Cronograma adaptativo baseado no seu desempenho",
      "Material em PDF e Videoaulas completas",
      "Banco de 20.000 questões comentadas",
      "Simulados inéditos com ranking",
      "Mentoria mensal ao vivo"
    ]
  },
  {
    id: 2,
    title: "Trilha BACEN TI",
    role: "Analista de TI",
    category: "Concurso Público",
    description: "Roteiro especializado para o Banco Central, cobrindo Engenharia de Software e Banco de Dados.",
    longDescription: "Prepare-se para o concurso do Banco Central na área de TI com este roteiro focado. Abrange desde os fundamentos de Engenharia de Software até tópicos avançados de Banco de Dados e Segurança da Informação, alinhado com as últimas tendências cobradas pela banca.",
    duration: "4 meses",
    users: 850,
    rating: 4.8,
    icon: Code,
    color: "bg-emerald-600",
    tags: ["Tecnologia", "Bancário"],
    author: { name: "Gabaritte AI", type: "official", avatar: null },
    subjects: mockSubjects.slice(0, 1), 
    benefits: [
      "Foco em TI para concursos bancários",
      "Questões comentadas de alto nível",
      "Simulados específicos de TI"
    ]
  },
  {
    id: 3,
    title: "Trilha Magistratura",
    role: "Juiz de Direito",
    category: "Concurso Público",
    description: "Estudo aprofundado de doutrina e jurisprudência para concursos de juiz estadual.",
    longDescription: "Uma jornada completa para quem almeja a toga. Esta trilha aborda com profundidade a doutrina e a jurisprudência atualizada dos tribunais superiores, preparando o candidato para todas as fases do concurso da Magistratura Estadual.",
    duration: "12 meses",
    users: 2100,
    rating: 5.0,
    icon: Scale,
    color: "bg-amber-600",
    tags: ["Jurídico", "Elite"],
    author: { name: "Prof. Ricardo", type: "community", avatar: "https://github.com/shadcn.png" },
    subjects: mockSubjects,
    benefits: [
      "Análise detalhada de jurisprudência",
      "Preparação para prova oral",
      "Correção individual de peças"
    ],
    saved: true
  },
  // Vestibular
  {
    id: 4,
    title: "Medicina na USP",
    role: "Vestibulando",
    category: "Vestibular",
    description: "Foco intensivo em Biologia, Química e Física para os vestibulares de medicina mais concorridos.",
    longDescription: "O sonho da aprovação em Medicina na USP começa aqui. Esta trilha intensiva foca nas disciplinas de peso para a FUVEST, com aprofundamento em Biologia, Química e Física, além de treino específico para a redação.",
    duration: "10 meses",
    users: 3500,
    rating: 4.9,
    icon: Stethoscope,
    color: "bg-rose-500",
    tags: ["Medicina", "FUVEST"],
    author: { name: "Gabaritte AI", type: "official", avatar: null },
    subjects: mockSubjects,
    benefits: [
      "Foco total na FUVEST",
      "Correção de redação semanal",
      "Monitoria de exatas"
    ],
    saved: true
  },
  {
    id: 5,
    title: "Engenharia no ITA",
    role: "Vestibulando",
    category: "Vestibular",
    description: "Matemática e Física de nível avançado para o Instituto Tecnológico de Aeronáutica.",
    longDescription: "Enfrente o vestibular mais difícil do país com preparação de elite. Matemática, Física e Química em nível IME/ITA, com resolução de questões olímpicas e provas anteriores detalhadas.",
    duration: "12 meses",
    users: 1200,
    rating: 5.0,
    icon: Calculator,
    color: "bg-slate-600",
    tags: ["Exatas", "Militar"],
    author: { name: "Eng. Marcos", type: "community", avatar: "https://github.com/shadcn.png" },
    subjects: mockSubjects.slice(0, 2),
    benefits: [
      "Nível avançado (Olimpíadas)",
      "Turmas reduzidas",
      "Simulados estilo ITA"
    ]
  },
  // ENEM
  {
    id: 6,
    title: "ENEM 800+",
    role: "Estudante",
    category: "ENEM",
    description: "Estratégia para alcançar mais de 800 pontos na média geral, com foco em Redação e Matemática.",
    longDescription: "Garanta sua vaga na universidade com uma média superior a 800 pontos. Estratégia focada em alavancar sua nota através da Teoria de Resposta ao Item (TRI), priorizando Matemática e Redação.",
    duration: "8 meses",
    users: 5600,
    rating: 4.7,
    icon: PenTool,
    color: "bg-yellow-500",
    tags: ["Redação Nota 1000", "SISU"],
    author: { name: "Gabaritte AI", type: "official", avatar: null },
    subjects: mockSubjects,
    benefits: [
      "Estratégia de prova (TRI)",
      "Modelos de redação nota 1000",
      "Revisão rápida de conteúdos"
    ]
  },
  // Idiomas
  {
    id: 7,
    title: "Inglês para Negócios",
    role: "Profissional",
    category: "Idiomas",
    description: "Vocabulário corporativo, escrita de e-mails e conversação para reuniões.",
    longDescription: "Domine o inglês corporativo e impulsione sua carreira. Aprenda a conduzir reuniões, escrever e-mails profissionais e fazer apresentações impactantes em inglês.",
    duration: "6 meses",
    users: 980,
    rating: 4.6,
    icon: Globe,
    color: "bg-indigo-500",
    tags: ["Business", "Carreira"],
    author: { name: "Teacher Sarah", type: "community", avatar: "https://github.com/shadcn.png" },
    subjects: mockSubjects.slice(1, 2),
    benefits: [
      "Vocabulário Business",
      "Roleplay de reuniões",
      "Networking internacional"
    ]
  },
  {
    id: 8,
    title: "Espanhol Fluente",
    role: "Iniciante",
    category: "Idiomas",
    description: "Do zero à conversação básica em 3 meses com método imersivo.",
    longDescription: "Aprenda espanhol de forma rápida e prática. Método focado em conversação desde a primeira semana, ideal para quem planeja viajar ou precisa do idioma para o trabalho.",
    duration: "3 meses",
    users: 1500,
    rating: 4.8,
    icon: Globe,
    color: "bg-orange-500",
    tags: ["Viagem", "Cultura"],
    author: { name: "Gabaritte AI", type: "official", avatar: null },
    subjects: mockSubjects.slice(0, 1),
    benefits: [
      "Conversação desde o início",
      "Cultura hispânica",
      "Aulas dinâmicas"
    ]
  },
  // Profissão/Certificação
  {
    id: 9,
    title: "Certificação PMP",
    role: "Gerente de Projetos",
    category: "Certificação",
    description: "Preparatório completo para a certificação Project Management Professional do PMI.",
    longDescription: "Torne-se um Project Management Professional (PMP). Curso completo alinhado com o PMBOK 7ª edição, cobrindo todas as áreas de conhecimento e grupos de processos exigidos no exame.",
    duration: "3 meses",
    users: 450,
    rating: 4.9,
    icon: Briefcase,
    color: "bg-purple-600",
    tags: ["Gestão", "Internacional"],
    author: { name: "PM Expert", type: "community", avatar: "https://github.com/shadcn.png" },
    subjects: mockSubjects,
    benefits: [
      "Simulados oficiais",
      "Flashcards de processos",
      "Plano de estudos personalizado"
    ]
  },
  {
    id: 10,
    title: "AWS Solutions Architect",
    role: "Arquiteto Cloud",
    category: "Certificação",
    description: "Domine a nuvem da Amazon e prepare-se para a prova SAA-C03.",
    longDescription: "Domine a maior nuvem do mundo. Preparatório prático e teórico para o exame AWS Certified Solutions Architect - Associate (SAA-C03), com laboratórios reais.",
    duration: "2 meses",
    users: 890,
    rating: 4.8,
    icon: Code,
    color: "bg-orange-400",
    tags: ["Cloud", "Tech"],
    author: { name: "Gabaritte AI", type: "official", avatar: null },
    subjects: mockSubjects.slice(0, 2),
    benefits: [
      "Laboratórios práticos (Hands-on)",
      "Cobertura completa dos serviços AWS",
      "Dicas de prova"
    ]
  },
  // Faculdade
  {
    id: 11,
    title: "Cálculo I e II",
    role: "Universitário",
    category: "Faculdade",
    description: "Sobreviva aos primeiros semestres de engenharia com aulas didáticas de limites, derivadas e integrais.",
    longDescription: "Desmistificando o Cálculo. Aulas didáticas e muitos exercícios resolvidos para você dominar Limites, Derivadas e Integrais e passar sem sufoco nos primeiros semestres da faculdade.",
    duration: "4 meses",
    users: 3200,
    rating: 4.5,
    icon: GraduationCap,
    color: "bg-red-500",
    tags: ["Engenharia", "Reforço"],
    author: { name: "Monitor Lucas", type: "community", avatar: "https://github.com/shadcn.png" },
    subjects: mockSubjects.slice(0, 1),
    benefits: [
      "Resolução passo a passo",
      "Listas de exercícios por nível",
      "Aulas de revisão para prova"
    ]
  }
];
