# 💻 CS Compiler - Online IDE

[![Next.js](https://img.shields.io/badge/Next.js-Black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-2C2C32?logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://frontend-compiler-beta.vercel.app)

**CS Compiler** is an online Integrated Development Environment (IDE) built for "CS" — a custom C-like programming language developed as part of the Principles of Programming Languages course. 

This repository contains the frontend client, which provides a rich, browser-based coding experience, allowing users to write, build, and execute CS programs seamlessly via a REST API connected to the Python/ANTLR4 compiler backend.

🌍 **Live Demo:** [CS Compiler Online](https://frontend-compiler-beta.vercel.app)
⚙️ **Backend Repository:** [CS Compiler Backend](https://github.com/conghau2308/Compiler_Online)

## ✨ Key Features

*   **Interactive Code Editor:** Integrates `Monaco Editor` (the core of VS Code) for a powerful typing experience, complete with line numbers, indentation, and standard code editing features.
*   **End-to-End Execution Flow:** Users can write CS code (featuring custom structs, type inference via `auto`, and control flows) and send it to the compiler backend with a single click.
*   **Real-time Feedback:** Displays compilation logs, AST generation status, semantic analysis errors (like type checking), and runtime I/O outputs directly within the browser interface.
*   **Modern & Responsive UI:** Built with Next.js App Router, styled cleanly using Tailwind CSS and `shadcn/ui` for a minimal, developer-focused workspace.

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Code Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

Follow these steps to set up the frontend environment locally.

### Prerequisites
*   Node.js 18.x or higher
*   npm, yarn, pnpm, or bun installed

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/conghau2308/frontend-compiler.git](https://github.com/conghau2308/frontend-compiler.git)
   cd frontend-compiler
2. Install dependencies:
    ```bash
    npm install
    # or yarn install / pnpm install
3. Configure Environment Variables:
Create a .env.local file in the root directory and specify the backend API URL. Make sure your FastAPI backend (running locally or on Azure VM) is accessible.
    ```bash
    NEXT_PUBLIC_COMPILER_API_URL=http://localhost:9000/files
    # Replace with your actual deployed Azure backend URL for production testing
4. Start the development server:

    ```bash
    npm run dev
    Open http://localhost:3000 with your browser to see the IDE.

## 📂 Project Structure
├── app/                  # Next.js App Router (Main UI layout, pages)
├── components/           # Reusable UI components (shadcn/ui, Monaco Editor wrapper, etc.)
├── services/             # API integration (Axios interceptors, endpoints: build, run, read)
├── lib/                  # Utility functions (Tailwind class merging for shadcn)
├── public/               # Static assets
└── types/                # TypeScript interfaces and types
## 🌐 Deployment
The frontend is fully optimized for Vercel. Push your code to the main branch to trigger an automatic deployment.

**Note:** Ensure that your Vercel project settings include the correct NEXT_PUBLIC_COMPILER_API_URL pointing to your Dockerized FastAPI backend hosted on Azure.

## 📄 License
Distributed under the MIT License. See LICENSE for more information.