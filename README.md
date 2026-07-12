# Serverless Resume Builder

Welcome to the **Serverless Resume Builder**! This project provides a simple, serverless way to generate and design professional resumes directly in your browser.

> **Note on Origin**: This project is a modified version of [OpenResume](https://github.com/xitanggg/open-resume), built upon its core renderer, and is licensed under the AGPL-3.0 License.

## 🚀 Features

- **Client-Side Rendering**: Completely serverless. All PDF generation and rendering happens directly in your browser.
- **Privacy First**: Your data never leaves your computer.
- **Multiple Templates**: Choose from several sleek templates (Modern, Minimalist, Terminal, and Base).
- **Customization**: Personalize colors, fonts, and layouts to make your resume truly yours.

## 🛠️ Tech Stack

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **PDF Generation**: `@react-pdf/renderer`

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Kalelkar-Noman/Serverless-Resume-Builder.git
   cd Serverless-Resume-Builder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to start building your resume!

## 📚 Documentation

We use the [Diátaxis](https://diataxis.fr/) framework to organize our documentation, alongside [arc42](https://arc42.org/) for architecture.

- **[Tutorials](./docs/tutorials/getting-started.md)**: Step-by-step guides for beginners (e.g., Getting Started).
- **[How-To Guides](./docs/how-to/)**: Practical guides for solving specific problems (e.g., Adding a new template, Extending the parser).
- **[Reference](./docs/reference/)**: Technical descriptions of the machinery (e.g., Redux Schema, PDF Parser API).
- **[Explanation](./docs/explanation/)**: Clarifications and context (e.g., Why we use React-PDF).
- **[Architecture (arc42)](./docs/architecture/arc42.md)**: Comprehensive system overview and Architectural Decision Records (ADRs).

## 🤝 Contributing

Contributions are welcome! Please check out our [CONTRIBUTING.md](./CONTRIBUTING.md) guide for details on how to get started.

## 📄 License

This project is licensed under the AGPL-3.0 License. See the [LICENSE](./LICENSE) file for more details.
