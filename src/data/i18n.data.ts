export type Lang = 'pt' | 'en';

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  items: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  topics?: string;
}

export interface TranslationData {
  nav: {
    about: string;
    services: string;
    portfolio: string;
    contact: string;
    hire: string;
  };
  hero: {
    badge: string;
    greeting: string;
    headline: string;
    subtitle: string;
    cta: string;
    ctaHire: string;
    ctaWork: string;
  };
  stats: { value: string; label: string }[];
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
  };
  bio: {
    eyebrow: string;
    title: string;
    summary: string;
    experienceTitle: string;
    educationTitle: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    stats: {
      exp: string;
      stack: string;
      location: string;
    }
  };
  skills: {
    title: string;
    items: { name: string; percent: number }[];
  };
  stacks: {
    eyebrow: string;
    title: string;
    description: string;
    items: StackCard[];
  };
  cases: {
    eyebrow: string;
    title: string;
    items: CaseStudy[];
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  footer: string;
}

export interface StackCard {
  title: string;
  icon: string;
  tags: string[];
  color: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
}

export const TRANSLATIONS: Record<Lang, TranslationData> = {
  pt: {
    nav: {
      about: "Sobre",
      services: "Serviços",
      portfolio: "Portfólio",
      contact: "Contato",
      hire: "Contrate-me!"
    },
    hero: {
      badge: "Disponível para Projetos",
      greeting: "Olá, eu sou",
      headline: "Engenharia de Software de Ponta a Ponta",
      subtitle: "Fullstack Engineer em transição para IA. Especialista em Sistemas Distribuídos, IoT e Machine Learning. Transformando requisitos críticos em código sólido.",
      cta: "Ver Estudos de Caso",
      ctaHire: "Contrate-me",
      ctaWork: "Ver Trabalhos"
    },
    stats: [
      { value: "15+", label: "Projetos Entregues" },
      { value: "5+", label: "Anos de Experiência" },
      { value: "3", label: "Empresas" },
      { value: "2", label: "Pós-Graduações" }
    ],
    showcase: {
      eyebrow: "Three.js · WebGL Demo",
      title: "Motor de Visualização 3D",
      description: "Renderização WebGL em tempo real, otimizado para 60fps. Demonstração das capacidades do Three.js com geometria procedural, iluminação dinâmica e animações fora do Angular Zone."
    },
    bio: {
      eyebrow: "Sobre mim",
      title: "Fullstack Developer | AI & Machine Learning",
      summary: "Desenvolvedor Fullstack com mais de 5 anos de experiência em arquitetura de sistemas distribuídos, microserviços e integração com serviços em nuvem. Atualmente em transição para Engenharia de IA, com formação especializada em Machine Learning, LLMs e IA Generativa.",
      experienceTitle: "Experiência Profissional",
      educationTitle: "Formação Acadêmica",
      experience: [
        {
          role: "Fullstack Developer Mid Level",
          company: "Instituto de Pesquisas Eldorado",
          period: "2024 — atual",
          items: [
            "Sistemas distribuídos com AWS IoT, SQS e RabbitMQ para dispositivos Android via AOSP e AMAPI",
            "Microserviços com NestJS e Angular com foco em escalabilidade",
            "Pipelines de dados integrando PostgreSQL, MySQL, Oracle e MongoDB",
            "Mentoria de desenvolvedores júnior em ambiente ágil"
          ]
        },
        {
          role: "Fullstack Developer Mid Level",
          company: "Instituto Creathus",
          period: "2021 — 2024",
          items: [
            "Sistemas IoT com RabbitMQ e MQTT para integração com dispositivos embarcados",
            "Stack diversificada: NestJS, Spring Boot, .NET, Angular, Vue.js",
            "Modelagem com PostgreSQL, MongoDB e Oracle para sistemas de alta demanda",
            "Integrações fiscais críticas com SEFAZ — tolerância zero a falhas"
          ]
        },
        {
          role: "Technology Trainee",
          company: "MB Consultoria",
          period: "2020 — 2021",
          items: [
            "Manutenção de plataforma de e-commerce",
            "Suporte técnico a usuários e onboarding de funcionalidades"
          ]
        }
      ],
      education: [
        {
          degree: "Pós-Graduação em IA Aplicada",
          institution: "UNIPDS",
          period: "2024 — em andamento",
          topics: "LLMs, LangChain, RAG, Prompt Engineering, MCP, MLOps"
        },
        {
          degree: "Pós-Graduação em Engenharia de Software",
          institution: "FAVENI",
          period: "Fev 2024 — Fev 2025"
        },
        {
          degree: "Bacharelado em Engenharia da Computação",
          institution: "UniNorte",
          period: "2018 — 2022"
        }
      ],
      stats: {
        exp: "5+ Anos de Exp.",
        stack: "Angular, .NET, AOSP, AWS",
        location: "Manaus, AM"
      }
    },
    skills: {
      title: "Habilidades Técnicas",
      items: [
        { name: "Angular / TypeScript", percent: 92 },
        { name: ".NET / C# / Backend", percent: 85 },
        { name: "AWS / Cloud & IoT", percent: 80 },
        { name: "AOSP / MDM / Android", percent: 87 },
        { name: "AI / LLMs / RAG", percent: 72 }
      ]
    },
    stacks: {
      eyebrow: "Especialidades",
      title: "Arsenal Tecnológico",
      description: "Uma abordagem agnóstica para resolver problemas complexos.",
      items: [
        {
          title: "Frontend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          tags: ["Angular", "TypeScript", "Three.js", "RxJS", "NgRx"],
          color: "cyan"
        },
        {
          title: "Backend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
          tags: [".NET", "Node.js", "NestJS", "REST", "GraphQL"],
          color: "cyan"
        },
        {
          title: "IoT & Cloud",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
          tags: ["AWS IoT", "AOSP", "AMAPI", "RabbitMQ", "Docker"],
          color: "cyan"
        },
        {
          title: "AI & LLMs",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
          tags: ["LangChain", "RAG", "Prompt Engineering", "MCP", "Python"],
          color: "cyan"
        }
      ]
    },
    cases: {
      eyebrow: "Projetos",
      title: "Desafios Técnicos & Soluções",
      items: [
        {
          id: 'case1',
          title: "O Desafio Visual",
          category: "Web 3D & Interfaces Ricas",
          description: "Implementação de um motor de visualização 3D no navegador com Three.js. O objetivo era permitir a manipulação de modelos complexos em tempo real, exigindo otimização agressiva de WebGL para garantir 60fps em hardware modesto.",
          tech: ["Three.js", "WebGL", "Angular", "Performance"]
        },
        {
          id: 'case2',
          title: "O Desafio Crítico",
          category: "Gov Tech & Confiabilidade",
          description: "Desenvolvimento de integrações fiscais críticas com a SEFAZ e gestão de estoques no Instituto Creathus. Tolerância zero para falhas, implementando arquiteturas resilientes em sistemas legados e validações fiscais rigorosas.",
          tech: ["Integração SEFAZ", "Sistemas Críticos", ".NET", "SQL"]
        },
        {
          id: 'case3',
          title: "O Desafio de Escala (MDM)",
          category: "IoT & Mobile Engineering",
          description: "No Instituto Eldorado, orquestrei a arquitetura para frotas de dispositivos Android customizados (AOSP). Utilizando AWS IoT, AMAPI e RabbitMQ, criamos um pipeline para gerenciamento remoto e telemetria massiva.",
          tech: ["AOSP", "Google AMAPI", "AWS IoT", "RabbitMQ"]
        }
      ]
    },
    contact: {
      badge: "Disponível para Projetos",
      title: "Vamos Construir Algo Juntos?",
      subtitle: "Seja um projeto greenfield, uma integração crítica ou uma solução de IA, estou pronto para transformar sua ideia em realidade.",
      cta: "Entrar em Contato"
    },
    footer: "© 2026 Jonathan Malagueta. Deployed on Vercel."
  },
  en: {
    nav: {
      about: "About",
      services: "Services",
      portfolio: "Portfolio",
      contact: "Contact",
      hire: "Hire Me!"
    },
    hero: {
      badge: "Available for Projects",
      greeting: "Hello, I am",
      headline: "End-to-End Software Engineering",
      subtitle: "Fullstack Engineer transitioning to AI. Specialist in Distributed Systems, IoT, and Machine Learning. Transforming critical requirements into solid code.",
      cta: "View Case Studies",
      ctaHire: "Hire Me",
      ctaWork: "My Work"
    },
    stats: [
      { value: "15+", label: "Projects Delivered" },
      { value: "5+", label: "Years Experience" },
      { value: "3", label: "Companies" },
      { value: "2", label: "Post-Graduations" }
    ],
    showcase: {
      eyebrow: "Three.js · WebGL Demo",
      title: "3D Visualization Engine",
      description: "Real-time WebGL rendering, optimized for 60fps. A demonstration of Three.js capabilities with procedural geometry, dynamic lighting, and animations running outside Angular Zone."
    },
    bio: {
      eyebrow: "About me",
      title: "Fullstack Developer | AI & Machine Learning",
      summary: "Fullstack Developer with 5+ years of experience in distributed systems architecture, microservices, and cloud integration. Currently transitioning to AI Engineering, with specialized training in Machine Learning, LLMs, and Generative AI.",
      experienceTitle: "Work Experience",
      educationTitle: "Education",
      experience: [
        {
          role: "Fullstack Developer Mid Level",
          company: "Instituto de Pesquisas Eldorado",
          period: "2024 — present",
          items: [
            "Distributed systems with AWS IoT, SQS and RabbitMQ for Android devices via AOSP and AMAPI",
            "Microservices with NestJS and Angular focused on scalability",
            "Data pipelines integrating PostgreSQL, MySQL, Oracle and MongoDB",
            "Junior developer mentoring in an agile environment"
          ]
        },
        {
          role: "Fullstack Developer Mid Level",
          company: "Instituto Creathus",
          period: "2021 — 2024",
          items: [
            "IoT systems with RabbitMQ and MQTT for embedded device integration",
            "Diverse stack: NestJS, Spring Boot, .NET, Angular, Vue.js",
            "Database modeling with PostgreSQL, MongoDB and Oracle for high-demand systems",
            "Critical fiscal integrations with SEFAZ — zero failure tolerance"
          ]
        },
        {
          role: "Technology Trainee",
          company: "MB Consultoria",
          period: "2020 — 2021",
          items: [
            "E-commerce platform maintenance",
            "Technical user support and feature onboarding"
          ]
        }
      ],
      education: [
        {
          degree: "Post-Grad in Applied AI",
          institution: "UNIPDS",
          period: "2024 — in progress",
          topics: "LLMs, LangChain, RAG, Prompt Engineering, MCP, MLOps"
        },
        {
          degree: "Post-Grad in Software Engineering",
          institution: "FAVENI",
          period: "Feb 2024 — Feb 2025"
        },
        {
          degree: "Bachelor's in Computer Engineering",
          institution: "UniNorte",
          period: "2018 — 2022"
        }
      ],
      stats: {
        exp: "5+ Years Exp.",
        stack: "Angular, .NET, AOSP, AWS",
        location: "Manaus, Brazil"
      }
    },
    skills: {
      title: "Technical Skills",
      items: [
        { name: "Angular / TypeScript", percent: 92 },
        { name: ".NET / C# / Backend", percent: 85 },
        { name: "AWS / Cloud & IoT", percent: 80 },
        { name: "AOSP / MDM / Android", percent: 87 },
        { name: "AI / LLMs / RAG", percent: 72 }
      ]
    },
    stacks: {
      eyebrow: "Specialties",
      title: "Tech Arsenal",
      description: "An agnostic approach to solving complex problems.",
      items: [
        {
          title: "Frontend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          tags: ["Angular", "TypeScript", "Three.js", "RxJS", "NgRx"],
          color: "cyan"
        },
        {
          title: "Backend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
          tags: [".NET", "Node.js", "NestJS", "REST", "GraphQL"],
          color: "cyan"
        },
        {
          title: "IoT & Cloud",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
          tags: ["AWS IoT", "AOSP", "AMAPI", "RabbitMQ", "Docker"],
          color: "cyan"
        },
        {
          title: "AI & LLMs",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
          tags: ["LangChain", "RAG", "Prompt Engineering", "MCP", "Python"],
          color: "cyan"
        }
      ]
    },
    cases: {
      eyebrow: "Projects",
      title: "Technical Challenges & Solutions",
      items: [
        {
          id: 'case1',
          title: "The Visual Challenge",
          category: "Web 3D & Rich Interfaces",
          description: "Implemented a 3D visualization engine directly in the browser using Three.js. The goal was to allow real-time manipulation of complex models, requiring aggressive WebGL optimization to ensure 60fps on modest hardware.",
          tech: ["Three.js", "WebGL", "Angular", "Performance"]
        },
        {
          id: 'case2',
          title: "The Critical Challenge",
          category: "Gov Tech & Reliability",
          description: "Developed high-criticality fiscal integrations with SEFAZ and inventory management at Instituto Creathus. Zero tolerance for failure, implementing resilient architectures on legacy systems and rigorous fiscal validations.",
          tech: ["Gov Integration", "Critical Systems", ".NET", "SQL"]
        },
        {
          id: 'case3',
          title: "The Scale Challenge (MDM)",
          category: "IoT & Mobile Engineering",
          description: "At Instituto Eldorado, I orchestrated the architecture for custom Android device fleets (AOSP). Using AWS IoT, AMAPI and RabbitMQ, we created a pipeline for remote management and massive telemetry.",
          tech: ["AOSP", "Google AMAPI", "AWS IoT", "RabbitMQ"]
        }
      ]
    },
    contact: {
      badge: "Available for Projects",
      title: "Let's Build Something Together?",
      subtitle: "Whether it's a greenfield project, a critical integration, or an AI solution — I'm ready to turn your idea into reality.",
      cta: "Get in Touch"
    },
    footer: "© 2026 Jonathan Malagueta. Deployed on Vercel."
  }
};
