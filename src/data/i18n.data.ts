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
      badge: "Sempre codando",
      headline: "Engenharia de Software de Ponta a Ponta: Do 3D à Nuvem",
      subtitle: "Senior Fullstack Engineer. Especialista em Sistemas Distribuídos, IoT e Interfaces de Alta Complexidade. Transformando requisitos críticos em código sólido.",
      cta: "Ver Estudos de Caso"
    },
    bio: {
      title: "Sobre a Jornada",
      p1: "Sou um desenvolvedor T-Shaped com raízes profundas. Minha base técnica em Angular e .NET sustenta uma versatilidade que vai longe: da renderização pixel-perfect com Three.js (WebGL) à confiabilidade crítica de integrações fiscais com a SEFAZ. No Instituto Eldorado, projeto arquiteturas IoT que conectam milhares de dispositivos Android via AOSP, garantindo que sistemas complexos operem com a fluidez de um relógio suíço.",
      p2: "Acredito que a excelência técnica nasce da união entre teoria robusta e prática incansável. Com Bacharelado em Engenharia da Computação e Pós em Engenharia de Software, atualmente estou expandindo minhas fronteiras na Pós-graduação em IA Aplicada pela UNIPDS. Meu objetivo é simples: construir a próxima geração de softwares inteligentes, unindo a precisão da engenharia clássica com o potencial da Inteligência Artificial.",
      stats: {
        exp: "5+ Anos de Exp.",
        stack: "Angular, .NET, AWS",
        location: "Manaus, AM"
      }
    },
    cases: {
      title: "Desafios Técnicos & Soluções",
      items: [
        {
          id: 'case1',
          title: "O Desafio Visual",
          category: "Web 3D & Interfaces Ricas",
          description: "Implementação de um motor de visualização 3D diretamente no navegador utilizando Three.js. O objetivo era permitir a manipulação de modelos complexos em tempo real para o setor industrial, exigindo otimização agressiva de WebGL para garantir 60fps em hardware modesto.",
          tech: ["Three.js", "WebGL", "Angular", "Performance"]
        },
        {
          id: 'case2',
          title: "O Desafio Crítico",
          category: "Confiabilidade Fiscal & Gov",
          description: "Desenvolvimento de integrações de alta criticidade com a SEFAZ para emissão fiscal e gestão de estoques no Instituto Creathus. Tolerância zero para falhas ou inconsistência de dados, implementando arquiteturas resilientes e validações rigorosas em sistemas legados.",
          tech: ["Integração Gov", "Sistemas Críticos", ".NET", "SQL"]
        },
        {
          id: 'case3',
          title: "O Desafio de Escala",
          category: "Arquitetura Distribuída & IoT",
          description: "No Instituto Eldorado, orquestrei a arquitetura de comunicação para dispositivos Android customizados (AOSP). Utilizando AWS IoT, SQS e RabbitMQ, criamos um pipeline capaz de gerenciar comandos e telemetria massiva em tempo real.",
          tech: ["AWS IoT", "RabbitMQ", "AOSP", "Distributed Systems"]
        }
      ]
    },
    footer: "© 2024 Jonathan Malagueta"
  },
  en: {
    hero: {
      badge: "Always coding",
      headline: "End-to-End Software Engineering: From 3D to the Cloud",
      subtitle: "Senior Fullstack Engineer. Specialist in Distributed Systems, IoT, and High-Complexity Interfaces. Transforming critical requirements into solid code.",
      cta: "View Case Studies"
    },
    bio: {
      title: "About the Journey",
      p1: "I am a T-Shaped developer with deep roots. My core strength in Angular and .NET supports a versatility that reaches far: from pixel-perfect Three.js (WebGL) rendering to the critical reliability of fiscal integrations with SEFAZ. At Instituto Eldorado, I design IoT architectures connecting thousands of Android devices via AOSP, ensuring complex systems run with Swiss-watch precision.",
      p2: "I believe technical excellence stems from uniting robust theory with relentless practice. Holding a Bachelor's in Computer Engineering and a Post-Grad in Software Engineering, I am currently expanding boundaries with a specialization in Applied AI at UNIPDS. My goal is simple: build the next generation of intelligent software, merging classic engineering precision with AI potential.",
      stats: {
        exp: "5+ Years Exp.",
        stack: "Angular, .NET, AWS",
        location: "Manaus, Brazil"
      }
    },
    cases: {
      title: "Technical Challenges & Solutions",
      items: [
        {
          id: 'case1',
          title: "The Visual Challenge",
          category: "Web 3D & Rich Interfaces",
          description: "Implemented a 3D visualization engine directly in the browser using Three.js. The goal was to allow real-time manipulation of complex models for the industrial sector, requiring aggressive WebGL optimization to ensure 60fps on modest hardware.",
          tech: ["Three.js", "WebGL", "Angular", "Performance"]
        },
        {
          id: 'case2',
          title: "The Critical Challenge",
          category: "Fiscal Reliability & Gov",
          description: "Developed high-criticality integrations with SEFAZ for fiscal issuance and inventory management at Instituto Creathus. Zero tolerance for failure or data inconsistency, implementing resilient architectures and rigorous validations on legacy systems.",
          tech: ["Gov Integration", "Critical Systems", ".NET", "SQL"]
        },
        {
          id: 'case3',
          title: "The Scale Challenge",
          category: "Distributed Architecture & IoT",
          description: "At Instituto Eldorado, I orchestrated the communication architecture for custom Android devices (AOSP). Using AWS IoT, SQS, and RabbitMQ, we created a pipeline capable of managing massive commands and telemetry in real-time.",
          tech: ["AWS IoT", "RabbitMQ", "AOSP", "Distributed Systems"]
        }
      ]
    },
    footer: "© 2024 Jonathan Malagueta"
  }
};