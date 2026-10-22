# Jonathan Malagueta | Portfolio

![Angular](https://img.shields.io/badge/Angular-21-dd0031?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-0.182-black?style=flat&logo=three.js)
![Status](https://img.shields.io/badge/Build-Passing-brightgreen)

> **Fullstack & AI/ML Engineer** — Sistemas Distribuídos, IoT, Plataformas Críticas e Machine Learning aplicado em produção.

---

## Sobre o Projeto

Portfolio pessoal de **Jonathan Malagueta**, Fullstack Engineer sênior com atuação atual como **ML Engineer**.

O site foi construído como peça de portfólio com dois objetivos:

1. **Apresentar o escopo real de atuação** — WMS/logística, IoT híbrido (on-premise e AWS), P&D e startups, e IA aplicada — sem expor clientes ou quebrar NDA.
2. **Demonstrar prática de engenharia de front-end** — arquitetura, performance e acabamento visual.

---

## Stack

| Camada | Tecnologias |
| --- | --- |
| **Framework** | Angular 21 (Standalone Components, Signals, `@defer`, Control Flow) |
| **Linguagem** | TypeScript 5.9 |
| **Estilos** | Tailwind CSS 3.4 + SCSS (design system próprio) |
| **3D** | Three.js (WebGL) |
| **i18n** | Service próprio baseado em Signals, com lazy loading de JSON |
| **Build** | Angular CLI + Vite, deploy na Vercel |

---

## Arquitetura

```text
src/
├── app.component.ts          # Root: orquestração, meta tags, SEO
├── app.component.html        # Template principal da landing
├── app/
│   └── directives/
│       └── scroll-reveal.directive.ts   # Reveal on scroll via IntersectionObserver
├── components/
│   ├── case-card/            # Cards de Domínio de Atuação
│   ├── services/             # TranslationService (signal-based i18n)
│   └── three-viz/            # Visualizador 3D (constelação de sistemas distribuídos)
├── data/
│   └── i18n.data.ts          # Conteúdo bilíngue (PT/EN)
├── env.ts                    # Ponte para o ambiente gerado
└── styles.scss               # Design system + tokens + scroll reveal
```

### Decisões Técnicas

- **Standalone Components** — sem NgModules, melhor tree-shaking e acoplamento explícito.
- **Fine-grained Reactivity** — `signal()` / `computed()` no lugar de `BehaviorSubject` eRxJS subjects.
- **Deferrable Views (`@defer`)** — o bundle do Three.js (517 kB) só é baixado quando o navegador fica ocioso, fora do caminho crítico de renderização.
- **Render loop fora do Angular Zone** — a animação WebGL não dispara change detection, evitando travamentos de ChangeDetection na interação.
- **i18n por Signals** — troca de idioma sem recarregar, com dados de tradução tipados por interface.
- **Scroll reveal progressivo** — `IntersectionObserver` com `prefers-reduced-motion` respeitado.

---

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Servidor em modo produção
```

### Variáveis de Ambiente

O build gera `src/environments/environment.ts` a partir de um `.env` local (ou das variáveis do ambiente de deploy):

```bash
VITE_PUBLIC_URL=
VITE_PHOTO_URL=
VITE_WHATSAPP_URL=
VITE_GITHUB_URL=
VITE_LINKEDIN_URL=
```

---

## Deploy

Configurado para Vercel:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## Licença

MIT
