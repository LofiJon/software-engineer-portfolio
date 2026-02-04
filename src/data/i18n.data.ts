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
  };
  cases: {
    title: string;
    items: CaseStudy[];
  };
  footer: string;
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
      subtitle: "Fullstack Engineer. Especialista em Sistemas Distribuídos, IoT e MDM. Transformando requisitos críticos em código sólido.",
      cta: "Ver Estudos de Caso"
    },
    bio: {
      title: "O Flow do Engenheiro",
      p1: "Aos 27 anos, sou um Engenheiro de Software Manauara que encontra o equilíbrio perfeito entre a batida calma do Lo-fi Hip Hop e o ritmo acelerado de sistemas críticos. Sou um desenvolvedor T-Shaped: minha base em Angular e .NET sustenta uma versatilidade que vai da renderização pixel-perfect com Three.js à responsabilidade de integrações fiscais com a SEFAZ.",
      p2: "No Instituto Eldorado, lidero arquiteturas IoT que orquestram milhares de dispositivos via AOSP e Google AMAPI. Acredito que a excelência nasce da união entre teoria e prática: com Bacharelado e Pós em Engenharia, agora expando fronteiras na Pós em IA Aplicada (UNIPDS), focado em unir a robustez da engenharia clássica com a inovação da Inteligência Artificial.",
      stats: {
        exp: "5+ Anos de Exp.",
        stack: "Angular, .NET, AOSP, AWS",
        location: "Manaus, AM"
      },
    },
     stacks: {
        title: "Arsenal Tecnológico",
        description: "Uma abordagem agnóstica para resolver problemas complexos."
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
      subtitle: "Fullstack Engineer. Specialist in Distributed Systems, IoT, and MDM. Transforming critical requirements into solid code.",
      cta: "View Case Studies"
    },
    bio: {
      title: "The Engineer's Flow",
      p1: "At 27, I am a Software Engineer from Manaus who balances the calm beat of Lo-fi Hip Hop with the fast pace of critical systems. I am a T-Shaped developer: my core strength in Angular and .NET supports a versatility ranging from pixel-perfect 3D rendering (Three.js) to critical fiscal integrations.",
      p2: "At Instituto Eldorado, I lead IoT architectures orchestrating thousands of devices via AOSP and Google AMAPI. I believe excellence comes from uniting theory and practice: holding a Bachelor's and Post-Grad in Engineering, I am now expanding boundaries with a specialization in Applied AI (UNIPDS), merging robust engineering with AI innovation.",
      stats: {
        exp: "5+ Years Exp.",
        stack: "Angular, .NET, AOSP, AWS",
        location: "Manaus, Brazil"
      }
    },
      stacks: {
        title: "Tech Arsenal",
        description: "An agnostic approach to solving complex problems."
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