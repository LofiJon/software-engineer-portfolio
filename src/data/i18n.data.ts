export type Lang = 'pt' | 'en';

export interface TranslationData {
  hero: {
    badge: string;
    headline: string;
    subtitle: string;
    cta: string;
  };
  bio: {
    title: string;
    p1: string;
    p2: string;
    stats: {
      exp: string;
      stack: string;
      location: string;
    }
  };
  stacks: {
    title: string;
    description: string;
    items: StackCard[];
  };
  cases: {
    title: string;
    items: CaseStudy[];
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
    hero: {
      badge: "Engenharia Sólida",
      headline: "Engenharia de Software de Ponta a Ponta: Do 3D à Nuvem",
      subtitle: "Fullstack Engineer em transição para IA. Especialista em Sistemas Distribuídos, IoT e Machine Learning. Transformando requisitos críticos em código sólido.",
      cta: "Ver Estudos de Caso"
    },
    bio: {
      title: "Engenheiro Full-Stack & IA",
      p1: `Sou um Engenheiro de Software de Manaus com 5 anos de experiência em sistemas distribuídos, IoT, arquitetura de nuvem e desenvolvimento fullstack. Começo projetos do zero e os levo até produção — da modelagem do banco de dados ao deploy em AWS, passando por front-end 3D com Three.js e integrações fiscais críticas com a SEFAZ.`,
      p2: "Na MB Consultoria iniciei minha trajetória em e-commerce. No Instituto Creathus evoluí para arquitetura de sistemas, soluções IoT com RabbitMQ e MQTT e integrações fiscais com tolerância zero a falhas. No Instituto Eldorado, lidero o gerenciamento de frotas de dispositivos Android customizados via AOSP e AMAPI, integrando AWS IoT, SQS e pipelines de dados em alta escala. Formado em Engenharia da Computação, com Pós em Engenharia de Software e cursando Pós em IA Aplicada — aprofundando LLMs, RAG, LangChain e Prompt Engineering.",
      stats: {
        exp: "5+ Anos de Exp.",
        stack: "Angular, .NET, AOSP, AWS",
        location: "Manaus, AM"
      },
    },
    stacks: {
      title: "Arsenal Tecnológico",
      description: "Uma abordagem agnóstica para resolver problemas complexos.",
      items: [
        {
          title: "Frontend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          tags: ["Angular", "TypeScript", "Three.js", "RxJS", "NgRx"],
          color: "blue"
        },
        {
          title: "Backend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
          tags: [".NET", "Node.js", "NestJS", "REST", "GraphQL"],
          color: "purple"
        },
        {
          title: "IoT & Cloud",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
          tags: ["AWS IoT", "AOSP", "AMAPI", "RabbitMQ", "Docker"],
          color: "green"
        },
        {
          title: "AI & LLMs",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
          tags: ["LangChain", "RAG", "Prompt Engineering", "MCP", "Python"],
          color: "amber"
        }
      ]
    },
    cases: {
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
          description: "No Instituto Eldorado, orquestrei a arquitetura para frotas de dispositivos Android customizados (AOSP). Utilizando AWS IoT, AMAPI (Android Management API) e RabbitMQ, criamos um pipeline para gerenciamento remoto e telemetria massiva.",
          tech: ["AOSP", "Google AMAPI", "AWS IoT", "RabbitMQ"]
        }
      ]
    },
    footer: "© 2026 Jonathan Malagueta. Deployed on Vercel."
  },
  en: {
    hero: {
      badge: "Solid Engineering",
      headline: "End-to-End Software Engineering: From 3D to the Cloud",
      subtitle: "Fullstack Engineer transitioning to AI. Specialist in Distributed Systems, IoT, and Machine Learning. Transforming critical requirements into solid code.",
      cta: "View Case Studies"
    },
    bio: {
      title: "Full-Stack Engineer & AI",
      p1: `I am a Software Engineer from Manaus with 5 years of experience in distributed systems, IoT, cloud architecture, and fullstack development. I take projects from zero to production — from database modeling to AWS deployment, through 3D front-end with Three.js and critical fiscal integrations.`,
      p2: "At MB Consultoria I started my career in e-commerce. At Instituto Creathus I evolved into systems architecture, IoT solutions with RabbitMQ and MQTT, and fiscal integrations with zero tolerance for failure. At Instituto Eldorado, I lead the management of custom Android device fleets via AOSP and AMAPI, integrating AWS IoT, SQS and data pipelines at scale. I hold a Bachelor's in Computer Engineering, a Post-Grad in Software Engineering, and am currently pursuing a Post-Grad in Applied AI — deepening expertise in LLMs, RAG, LangChain and Prompt Engineering.",
      stats: {
        exp: "5+ Years Exp.",
        stack: "Angular, .NET, AOSP, AWS",
        location: "Manaus, Brazil"
      }
    },
    stacks: {
      title: "Tech Arsenal",
      description: "An agnostic approach to solving complex problems.",
      items: [
        {
          title: "Frontend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          tags: ["Angular", "TypeScript", "Three.js", "RxJS", "NgRx"],
          color: "blue"
        },
        {
          title: "Backend",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
          tags: [".NET", "Node.js", "NestJS", "REST", "GraphQL"],
          color: "purple"
        },
        {
          title: "IoT & Cloud",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
          tags: ["AWS IoT", "AOSP", "AMAPI", "RabbitMQ", "Docker"],
          color: "green"
        },
        {
          title: "AI & LLMs",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
          tags: ["LangChain", "RAG", "Prompt Engineering", "MCP", "Python"],
          color: "amber"
        }
      ]
    },
    cases: {
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
          description: "At Instituto Eldorado, I orchestrated the architecture for custom Android device fleets (AOSP). Using AWS IoT, AMAPI (Android Management API), and RabbitMQ, we created a pipeline for remote management and massive telemetry.",
          tech: ["AOSP", "Google AMAPI", "AWS IoT", "RabbitMQ"]
        }
      ]
    },
    footer: "© 2026 Jonathan Malagueta. Deployed on Vercel."
  }
};