# Jonathan Malagueta | Senior Engineering Portfolio

![Angular](https://img.shields.io/badge/Angular-18%2B-dd0031?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **"Engineering First" Portfolio.** This project showcases modern Frontend Architecture, featuring Angular 18+, granular reactivity with Signals, and high-performance rendering techniques including Three.js.

## 🚀 About The Project

This repository hosts the personal portfolio of **Jonathan Malagueta**, a Senior Fullstack Engineer specializing in Distributed Systems, IoT, and Scalable Architecture.

Unlike standard portfolio templates, this application was engineered to demonstrate **enterprise-grade frontend practices**. It bridges the gap between complex backend logic (my background in AWS/IoT) and high-performance UI.

### Key Technical Features

* **Bleeding Edge Angular:** Built entirely with **Angular 18+**.
* **Architecture:** 100% **Standalone Components** (No NgModules) for better tree-shaking and simplified architecture.
* **Fine-Grained Reactivity:** State management utilizing **Angular Signals** (`signal`, `computed`, `effect`) instead of traditional `BehaviorSubject` or massive state libraries, ensuring distinct updates and Zone.js independence.
* **Custom i18n Engine:** A lightweight, signal-based Internationalization service with **Lazy Loading** support for JSON translation files (PT-BR / EN), avoiding large initial bundles.
* **Performance:** Extensive use of **Control Flow** syntax (`@if`, `@for`) and **Defferable Views** (`@defer`) to optimize the loading of heavy assets like 3D models.
* **3D Integration:** Uses **Three.js** to render interactive elements, demonstrating capabilities beyond standard DOM manipulation.

---

## 🛠 Tech Stack

* **Framework:** Angular 18+
* **Language:** TypeScript 5+
* **Styling:** SCSS Modules / TailwindCSS (Configurable)
* **3D Graphics:** Three.js
* **Build Tool:** Angular CLI / Vite
* **Deployment:** Vercel / Netlify (CI/CD Integrated)

---

### 📱 Mobile OS & Fleet Orchestration
> Deep expertise in managing enterprise Android ecosystems.
![Android](https://img.shields.io/badge/Android_AOSP-3DDC84?style=flat&logo=android&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_AMAPI-4285F4?style=flat&logo=googlecloud&logoColor=white)
**Skills:** `Custom ROMs` `Kiosk Mode` `Zero-Touch Provisioning` `MQTT/IoT`

## 📂 Architecture & Folder Structure

The project follows a **Feature-Based Architecture** to ensure scalability:

```text
src/
├── app/
│   ├── core/                # Singletons, Global Services, Interceptors
│   │   ├── i18n/            # Custom Signal-based Translation Service
│   │   ├── theme/           # Theme management (Dark/Light)
│   │   └── services/        # API and Logic services
│   ├── features/            # Domain-specific modules (Lazy Loaded)
│   │   ├── hero/            # Hero section logic
│   │   ├── projects/        # Project showcase (Case Studies)
│   │   └── about/           # Bio & Skills
│   ├── shared/              # Reusable UI Components (Buttons, Cards)
│   │   ├── ui/
│   │   └── utils/
│   ├── assets/
│   │   ├── i18n/            # Translation JSONs (en.json, pt.json)
│   │   └── models/          # 3D Assets
│   └── app.component.ts     # Root with Signals orchestration
└── main.ts                  # Bootstrap logic
